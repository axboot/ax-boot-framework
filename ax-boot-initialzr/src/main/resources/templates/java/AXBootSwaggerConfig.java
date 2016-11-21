package ${basePackage};

import com.chequer.axboot.core.parameter.RequestParams;
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
public class AXBootSwaggerConfig {
    @Inject
    private SpringSwaggerConfig springSwaggerConfig;

    @Bean
    public SwaggerSpringMvcPlugin customImplementation() {
        return new SwaggerSpringMvcPlugin(this.springSwaggerConfig)
                .apiInfo(new ApiInfo("AXBoot API Swagger", "API Demonstration", "", "", "", ""))
                .includePatterns("/api/v.*")
                .ignoredParameterTypes(AuthenticationPrincipal.class, RequestParams.class);
    }
}
