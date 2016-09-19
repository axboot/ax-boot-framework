package com.chequer.axboot.core.db.dbcp;

import com.chequer.axboot.core.config.AXBootContextConfig;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;

public class AXBootDataSourceFactory {
    private static Logger logger = LoggerFactory.getLogger(AXBootDataSourceFactory.class);

    public static AXBootDBCP2DataSource create(String dataSourceId, AXBootContextConfig.DataSourceConfig dataSourceConfig) throws Exception {
        try {
            AXBootDBCP2DataSource axBootDBCP2DataSource = new ModelMapper().map(dataSourceConfig, AXBootDBCP2DataSource.class);
            axBootDBCP2DataSource.setDatabaseType(dataSourceConfig.getHibernateConfig().getDatabaseType());
            Connection conn = axBootDBCP2DataSource.getConnection();
            conn.close();
            logger.info("success to create DataSource('{}')", dataSourceId);
            return axBootDBCP2DataSource;

        } catch (Exception exception) {
            logger.error("fail to create DataSource('{}')", dataSourceId, exception);
            throw exception;
        }
    }

    public static AXBootDBCP2DataSource create(AXBootContextConfig.DataSourceConfig dataSourceConfig) throws Exception {
        return create("MainDataSource", dataSourceConfig);
    }
}
