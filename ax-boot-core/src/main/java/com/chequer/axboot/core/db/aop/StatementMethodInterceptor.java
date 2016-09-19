package com.chequer.axboot.core.db.aop;


import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.db.QueryNormalizer;
import com.chequer.axboot.core.db.SqlFormatter;
import com.chequer.axboot.core.db.monitor.sql.SqlExecutionInfo;
import com.chequer.axboot.core.db.monitor.sql.SqlTaskPool;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.CommunicationException;
import java.lang.reflect.Method;
import java.net.SocketTimeoutException;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

public class StatementMethodInterceptor implements MethodInterceptor {
    private final Logger logger = LoggerFactory.getLogger(StatementMethodInterceptor.class);

    private static final String BATCH_STATEMENT_FORMAT = "%s /** count(%d) **/";
    private static final String STATEMENT_METHOD_ADD_BATCH = "addBatch";
    private static final String STATEMENT_METHOD_EXECUTE_BATCH = "executeBatch";
    private static final String STATEMENT_METHOD_EXECUTE = "execute";
    private static final String PREPARED_STATEMENT_METHOD_SET = "set";
    private static final String PREPARED_STATEMENT_METHOD_SET_NULL = "setNull";
    private static final String ORACLE_QUERY_TIMEOUT_CODE = "ORA-01013";

    private static QueryNormalizer queryNormalizer = new QueryNormalizer();
    private static SqlFormatter sqlFormatter = new SqlFormatter();

    private String dataSourceId;
    private String databaseType;
    private Long slowQueryThreshold;
    private boolean sqlOutput;

    private Map<Statement, StatementExecutionInfo> statementInfoMap;

    private SqlTaskPool sqlTaskPool;

    public StatementMethodInterceptor(String dataSourceId, String databaseType, Long slowQueryThreshold,
                                      Map<Statement, StatementExecutionInfo> statementInfoMap, SqlTaskPool sqlTaskPool, boolean sqlOutput) {
        this.dataSourceId = dataSourceId;
        this.databaseType = databaseType;
        this.slowQueryThreshold = slowQueryThreshold;
        this.statementInfoMap = statementInfoMap;
        this.sqlTaskPool = sqlTaskPool;
        this.sqlOutput = sqlOutput;
    }

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        if (!(invocation.getThis() instanceof Statement)) {
            return invocation.proceed();
        }
        Object returnValue;
        SqlExecutionInfo sqlExecutionInfo = null;
        Method invokedMethod = invocation.getMethod();

        try {
            StatementExecutionInfo statementExecutionInfo = statementInfoMap.get(invocation.getThis());
            if (statementExecutionInfo == null) {
                logger.error("StatementExecutionInfo is null.");
                return invocation.proceed();
            }

            if (invocation.getThis() instanceof PreparedStatement &&
                    invokedMethod.getName().startsWith(PREPARED_STATEMENT_METHOD_SET)) {
                returnValue = invocation.proceed();

                if (invocation.getArguments().length >= 2) {
                    List<Object> parameterList = statementExecutionInfo.getCurrentParameters();
                    Integer position = (Integer) invocation.getArguments()[0];

                    while (position >= parameterList.size()) {
                        parameterList.add(null);
                    }

                    if (!StringUtils.equals(invokedMethod.getName(), PREPARED_STATEMENT_METHOD_SET_NULL)) {
                        parameterList.set(position, invocation.getArguments()[1]);
                    }
                }
            } else if (invokedMethod.getName().equals(STATEMENT_METHOD_ADD_BATCH)) {
                returnValue = invocation.proceed();

                if (statementExecutionInfo.getBatchCount() == 0) {
                    String statementQuery = getQueryFromStatement(statementExecutionInfo, invocation);
                    statementExecutionInfo.setFirstBatchQuery(statementQuery);
                }

                statementExecutionInfo.incrementBatchCount();
            } else if (invokedMethod.getName().startsWith(STATEMENT_METHOD_EXECUTE)) {
                if (statementExecutionInfo.getStatementType() == StatementType.statement) {
                    String statementQuery;

                    if (invokedMethod.getName().equals(STATEMENT_METHOD_EXECUTE_BATCH)) {
                        statementQuery = String.format(BATCH_STATEMENT_FORMAT, statementExecutionInfo.getFirstBatchQuery(), statementExecutionInfo.getBatchCount());
                    } else {
                        statementQuery = getQueryFromStatement(statementExecutionInfo, invocation);
                    }

                    sqlExecutionInfo = sqlTaskPool.get(statementQuery);

                    if (sqlExecutionInfo.isNew()) {
                        sqlExecutionInfo.setDataSourceId(dataSourceId);
                        sqlExecutionInfo.setType(statementExecutionInfo.getStatementType());
                    }

                } else {
                    sqlExecutionInfo = sqlTaskPool.get(statementExecutionInfo.getQueryFormat());
                }
                // 실행시간을 조사
                long currentTaskStartTime = System.currentTimeMillis();
                returnValue = invocation.proceed();
                long lastTaskTime = System.currentTimeMillis() - currentTaskStartTime;

                if (isSlowQuery(lastTaskTime) && sqlExecutionInfo != null) {
                    sqlExecutionInfo.addSlowQueryCount();
                }

                if (sqlExecutionInfo != null) {
                    sqlExecutionInfo.appendTaskTime(lastTaskTime, statementExecutionInfo.getCurrentParameters().toArray());
                }

                if (isSlowQuery(lastTaskTime) && logger.isErrorEnabled()) {
                    String sqlLogging = getLoggingSql(statementExecutionInfo, sqlExecutionInfo, invocation);

                    if (statementExecutionInfo.getBatchCount() > 0) {
                        logger.error("[slowQueryTime/ {} ms] [batching]]n{}\n", new Object[]{lastTaskTime, statementExecutionInfo.getBatchCount(), sqlLogging});
                    } else {
                        logger.error("[slowQueryTime/ {} ms] [query]]n{}\n", lastTaskTime, sqlLogging);
                    }
                } else if (logger.isDebugEnabled()) {
                    String sqlLogging = getLoggingSql(statementExecutionInfo, sqlExecutionInfo, invocation);
                    if (statementExecutionInfo.getBatchCount() > 0) {
                        logger.debug("[batching/{}]\n{}\n", statementExecutionInfo.getBatchCount(), sqlLogging);
                    } else {
                        logger.debug("[query]\n{}\n", sqlLogging);
                    }
                } else if (logger.isInfoEnabled() && sqlOutput) {
                    String sqlLogging = getLoggingSql(statementExecutionInfo, sqlExecutionInfo, invocation);
                    logger.info("\n[query] - {} - {}\n", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), sqlLogging);
                }
            } else {
                returnValue = invocation.proceed();
            }
        } catch (Exception exception) {
            if (sqlExecutionInfo != null) {
                boolean timeoutException = false;
                switch (databaseType) {
                    case Types.DatabaseType.MYSQL:
                        if (exception instanceof CommunicationException && (exception.getCause() != null && exception.getCause() instanceof SocketTimeoutException)) {
                            sqlExecutionInfo.addSocketTimeoutCount();
                            timeoutException = true;
                        }
                        break;
                    case Types.DatabaseType.ORACLE:
                        if (StringUtils.indexOf(exception.getMessage(), ORACLE_QUERY_TIMEOUT_CODE) != -1) {
                            sqlExecutionInfo.addQueryTimeoutCount();
                            timeoutException = true;
                        }
                        break;
                }
                if (!timeoutException) {
                    sqlExecutionInfo.addExceptionCount();
                }
            }
            throw exception;
        } finally {
            if (invocation.getMethod().getName().startsWith("close") && invocation.getThis() instanceof Statement) {
                statementInfoMap.remove(invocation.getThis());
            }
        }
        return returnValue;
    }

    private boolean isSlowQuery(long lastTaskTime) {
        return slowQueryThreshold != null && lastTaskTime > slowQueryThreshold;
    }

    private String getQueryFromStatement(StatementExecutionInfo statementExecutionInfo, MethodInvocation methodInvocation) {
        String query = null;

        switch (statementExecutionInfo.getStatementType()) {
            case statement: {
                query = (String) methodInvocation.getArguments()[0];
                break;
            }
            case preparedStatement:
            case callableStatement: {
                List<Object> parameters = statementExecutionInfo.getCurrentParameters();
                String queryFormat = statementExecutionInfo.getQueryFormat();
                query = queryNormalizer.format(databaseType, queryFormat, parameters);
                break;
            }
        }
        return query;
    }

    private String getLoggingSql(StatementExecutionInfo statementExecutionInfo, SqlExecutionInfo sqlExecutionInfo, MethodInvocation invocation) {
        String sqlLogging = (statementExecutionInfo.getBatchCount() > 0) ? sqlExecutionInfo.getSql() : getQueryFromStatement(statementExecutionInfo, invocation);

        try {
            return sqlFormatter.format(sqlLogging);
        } catch (Exception except) {
            logger.debug("sql formatting exception, sql - {}", sqlLogging, except);
        }

        return sqlLogging;
    }
}
