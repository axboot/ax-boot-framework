package com.chequer.axboot.core.db.schema;

import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Table;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Session;
import org.hibernate.boot.Metadata;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.BootstrapServiceRegistry;
import org.hibernate.boot.registry.BootstrapServiceRegistryBuilder;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.internal.SessionFactoryImpl;
import org.reflections.Reflections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import com.chequer.axboot.core.config.AXBootContextConfig;

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

    @Autowired
    private AXBootContextConfig axBootContextConfig;

    /**
     * key  : TableName
     * value: EntityClass
     */
    private Map<String, Class<?>> tableNameEntityClassMap;

    public SchemaGeneratorBase() {
        tableNameEntityClassMap = getTableNameEntityClassMap();
    }

    protected SessionFactoryImpl getSessionFactory() {
        Session session = (Session) entityManager.getDelegate();
        return (SessionFactoryImpl) session.getSessionFactory();
    }

    protected Metadata getMetaData() {
        Properties prop = new Properties();
        prop.put("hibernate.dialect", getSessionFactory().getJdbcServices().getDialect().toString());
        prop.put("hibernate.hbm2ddl.auto", "create");
        prop.put("hibernate.show_sql", "true");
        prop.put("hibernate.connection.username", environment.getProperty("axboot.dataSource.username", ""));
        prop.put("hibernate.connection.password", environment.getProperty("axboot.dataSource.password", ""));
        prop.put("hibernate.connection.url", environment.getProperty("axboot.dataSource.url", ""));

        BootstrapServiceRegistry bsr = new BootstrapServiceRegistryBuilder().build();
        StandardServiceRegistryBuilder ssrBuilder = new StandardServiceRegistryBuilder(bsr);
        ssrBuilder.applySettings(prop);
        StandardServiceRegistry standardServiceRegistry = ssrBuilder.build();

        MetadataSources metadataSources = new MetadataSources(standardServiceRegistry);

        Reflections reflections = new Reflections(axBootContextConfig.getBasePackageName());

        reflections.getTypesAnnotatedWith(Entity.class)
                .forEach(metadataSources::addAnnotatedClass);

        return metadataSources.buildMetadata();
    }

    public Map<String, Class<?>> getTableNameEntityClassMap() {
        return new Reflections()
            .getTypesAnnotatedWith(Entity.class)
            .stream()
            .filter(clazz -> clazz.isAnnotationPresent(Table.class))
            .collect(Collectors.toMap(
                clazz -> clazz.getAnnotation(Table.class).name(),
                clazz -> clazz
            ));
    }

    public List<String> getTableList() {
        return tableNameEntityClassMap.values().stream()
            .map(entity -> entity.getAnnotation(Table.class).name())
            .collect(Collectors.toList());
    }

    protected String getEntityClassName(final String tableName) {
        if (tableNameEntityClassMap.containsKey(tableName)) {
            return tableNameEntityClassMap.get(tableName).getName();
        }

        return tableNameEntityClassMap.values().stream()
            .filter(clazz -> StringUtils.equals(clazz.getName(), tableName))
            .map(Class::getName)
            .findFirst()
            .orElse(null);
    }
}
