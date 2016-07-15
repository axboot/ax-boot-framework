package com.chequer.axboot.core;

import com.chequer.axboot.core.config.AXBootContextConfig;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@ComponentScan
@Configuration
@EnableJpaRepositories(basePackages = AXBootContextConfig.CORE_PACKAGE_NAME)
@EntityScan(basePackages = AXBootContextConfig.CORE_PACKAGE_NAME)
@EnableAutoConfiguration
@PropertySource(value = {"classpath:spring-boot.properties", "classpath:axboot-common.properties", "classpath:axboot-${spring.profiles.active:local}.properties"})
public class AXBootCoreConfiguration {
}
