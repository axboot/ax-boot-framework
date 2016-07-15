package com.chequer.axboot.core.db.schema;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.internal.SessionFactoryImpl;
import org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl;
import org.hibernate.jpa.boot.internal.PersistenceUnitInfoDescriptor;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.persister.entity.SingleTableEntityPersister;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.orm.jpa.hibernate.SpringNamingStrategy;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.spi.PersistenceUnitInfo;
import java.util.Map;
import java.util.Properties;

public class SchemaGeneratorBase {

    @Autowired
    protected EntityManagerFactory entityManagerFactory;

    @Autowired
    protected EntityManager entityManager;

    @Autowired
    protected LocalContainerEntityManagerFactoryBean localContainerEntityManagerFactoryBean;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected Environment environment;

    protected SessionFactoryImpl getSessionFactory() {
        Session session = (Session) entityManager.getDelegate();
        return (SessionFactoryImpl) session.getSessionFactory();
    }

    protected SchemaExport getSchemaExport() {

        Properties prop = new Properties();
        prop.put("hibernate.dialect", getSessionFactory().getDialect().toString());
        prop.put("hibernate.hbm2ddl.auto", "create");
        prop.put("hibernate.show_sql", "true");
        prop.put("hibernate.connection.username", environment.getProperty("axboot.dataSource.username", ""));
        prop.put("hibernate.connection.password", environment.getProperty("axboot.dataSource.password", ""));
        prop.put("hibernate.connection.url", environment.getProperty("axboot.dataSource.url", ""));

        PersistenceUnitInfo info = localContainerEntityManagerFactoryBean.getPersistenceUnitInfo();
        PersistenceUnitInfoDescriptor persistenceUnitInfoDescriptor = new PersistenceUnitInfoDescriptor(info);
        EntityManagerFactoryBuilderImpl entityManagerFactoryBuilder = new EntityManagerFactoryBuilderImpl(persistenceUnitInfoDescriptor, prop);

        ServiceRegistry serviceRegistry = entityManagerFactoryBuilder.buildServiceRegistry();
        Configuration configuration = entityManagerFactoryBuilder.buildHibernateConfiguration(serviceRegistry);
        configuration.setNamingStrategy(new SpringNamingStrategy());

        return new SchemaExport(serviceRegistry, configuration);
    }

    protected ClassMetadata getClassMetaData(String tableName) {
        SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
        Map<String, ClassMetadata> classMetadataMap = sessionFactory.getAllClassMetadata();

        for (String className : classMetadataMap.keySet()) {
            ClassMetadata classMetadata = classMetadataMap.get(className);

            if (((SingleTableEntityPersister) classMetadata).getTableName().toLowerCase().equals(tableName.toLowerCase()))
                return classMetadata;
        }

        throw new IllegalArgumentException("not exist table");
    }
}
