package ${basePackage};

import com.chequer.axboot.core.AXBootCoreConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.WebApplicationInitializer;

@Configuration
public class AXBootApplicationInitializer extends SpringBootServletInitializer implements WebApplicationInitializer {

    public static final Object[] APPLICATION_SOURCES = new Object[]{AXBootApplication.class, AXBootCoreConfiguration.class};

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        this.setRegisterErrorPageFilter(false);
        return application.sources(APPLICATION_SOURCES);
    }
}
