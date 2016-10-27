package com.chequer.axboot.initialzr;

import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.model.extract.service.jdbc.JdbcMetadataService;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
@ComponentScan
@EnableAutoConfiguration
public class AXBootInitialzrApplication {

    @Bean
    public LocalValidatorFactoryBean validatorFactoryBean() {
        return new LocalValidatorFactoryBean();
    }

    @Bean
    public JdbcMetadataService jdbcMetadataService() {
        return new JdbcMetadataService();
    }

    @Bean(name = "axBootContextConfig")
    public AXBootContextConfig axBootContextConfig() {
        return new AXBootContextConfig();
    }

}
