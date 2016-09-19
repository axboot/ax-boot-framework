package com.chequer.axboot.admin;

import com.mangofactory.swagger.configuration.SpringSwaggerConfig;
import com.mangofactory.swagger.models.dto.ApiInfo;
import com.mangofactory.swagger.plugin.EnableSwagger;
import com.mangofactory.swagger.plugin.SwaggerSpringMvcPlugin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import javax.inject.Inject;


@Configuration
@EnableSwagger
public class AXBootAdminSwaggerConfig {
    @Inject
    private SpringSwaggerConfig springSwaggerConfig;

    @Bean
    public SwaggerSpringMvcPlugin customImplementation() {
        return new SwaggerSpringMvcPlugin(this.springSwaggerConfig)
                .apiInfo(new ApiInfo("CHEQUER API", "CHEQUER API", "", "", "", ""))
                .includePatterns("/api/v1.*")
                .ignoredParameterTypes(AuthenticationPrincipal.class);
    }
}
