package ${basePackage};

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ComponentScan
@EnableAutoConfiguration
@PropertySource(value = {"classpath:spring-boot.properties", "classpath:axboot-common.properties", "classpath:axboot-${spring.profiles.active:local}.properties"})
public class AXBootApplication {
}
