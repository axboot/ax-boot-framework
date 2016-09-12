package com.chequer.axboot.admin.config;

import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.config.AXBootLoggingConfig;
import com.chequer.axboot.core.db.dbcp.AXBootDataSourceFactory;
import com.chequer.axboot.core.db.monitor.SqlMonitoringService;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.transaction.SpringManagedTransactionFactory;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.*;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement(proxyTargetClass = true, mode = AdviceMode.PROXY)
@EnableJpaRepositories(basePackages = "com.chequer.axboot.admin")
@EnableAspectJAutoProxy(proxyTargetClass = true)
@EntityScan("com.chequer.axboot.admin")
public class GlobalApplicationConfig {

    @Bean
    @Primary
    public DataSource dataSource(AXBootContextConfig axBootContextConfig) throws Exception {
        return AXBootDataSourceFactory.create(axBootContextConfig.getDataSourceConfig());
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource, SpringManagedTransactionFactory springManagedTransactionFactory, AXBootContextConfig axBootContextConfig) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage(axBootContextConfig.getPackageName());
        sqlSessionFactoryBean.setTypeHandlersPackage(axBootContextConfig.getPackageName());
        sqlSessionFactoryBean.setTypeHandlers(axBootContextConfig.getMyBatisTypeHandlers());
        sqlSessionFactoryBean.setPlugins(new Interceptor[]{new AuditInterceptor()});
        sqlSessionFactoryBean.setTransactionFactory(springManagedTransactionFactory);
        return sqlSessionFactoryBean.getObject();
    }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) throws ClassNotFoundException {
        JpaTransactionManager jpaTransactionManager = new JpaTransactionManager();
        jpaTransactionManager.setEntityManagerFactory(entityManagerFactory);
        jpaTransactionManager.afterPropertiesSet();
        return jpaTransactionManager;
    }

    @Bean
    public SqlMonitoringService sqlMonitoringService(DataSource dataSource) throws Exception {
        return new SqlMonitoringService(dataSource);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(11);
    }

    @Bean
    public AXBootLoggingConfig axBootLoggingConfig() {
        return new AXBootLoggingConfig();
    }
}
