package com.chequer.axboot.admin;

import com.chequer.axboot.core.AXBootCoreConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminApplicationInitializer extends SpringBootServletInitializer {

    public static final Object[] APPLICATION_SOURCES = new Object[]{AdminApplication.class, AXBootCoreConfiguration.class};

    public static void main(String[] args) {
        SpringApplication.run(APPLICATION_SOURCES, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(APPLICATION_SOURCES);
    }
}
