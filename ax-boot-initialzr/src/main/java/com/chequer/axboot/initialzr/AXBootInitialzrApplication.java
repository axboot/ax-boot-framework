package com.chequer.axboot.initialzr;

import com.chequer.axboot.core.AXBootCoreConfiguration;
import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.model.extract.service.jdbc.JdbcMetadataService;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@Import(AXBootCoreConfiguration.class)
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
