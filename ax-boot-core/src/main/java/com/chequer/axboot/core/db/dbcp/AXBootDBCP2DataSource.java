package com.chequer.axboot.core.db.dbcp;

import com.chequer.axboot.core.db.aop.CreateStatementInterceptor;
import com.chequer.axboot.core.db.aop.StatementExecutionInfo;
import com.chequer.axboot.core.db.monitor.sql.SqlTaskPool;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.aop.framework.ProxyFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.sql.Statement;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

@Setter
@Getter
public class AXBootDBCP2DataSource extends BasicDataSource {
    private SqlTaskPool sqlTaskPool = new SqlTaskPool();

    private ConcurrentHashMap<Statement, StatementExecutionInfo> statementInfoMap = new ConcurrentHashMap<>();

    private String dataSourceId;

    private String databaseType;

    private Long slowQueryThreshold;

    private boolean useStatementCache = false;

    private int statementCacheSize = 250;

    private boolean sqlOutput = false;

    @Override
    public Connection getConnection() throws SQLException {
        Connection connection = super.getConnection();
        return createProxy(connection);
    }

    @Override
    public Connection getConnection(String user, String pass) throws SQLException {
        Connection connection = super.getConnection(user, pass);
        return createProxy(connection);
    }

    @Override
    public synchronized void close() throws SQLException {
        super.close();
    }

    private Connection createProxy(Connection originalConnection) {
        ProxyFactory proxyFactory = new ProxyFactory();
        proxyFactory.setTarget(originalConnection);
        proxyFactory.addAdvice(new CreateStatementInterceptor(getDataSourceId(), getDatabaseType(), getSlowQueryThreshold(), getStatementInfoMap(), getSqlTaskPool(), isSqlOutput()));
        proxyFactory.setInterfaces(new Class[]{Connection.class});
        return (Connection) proxyFactory.getProxy();
    }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return null;
    }
}
