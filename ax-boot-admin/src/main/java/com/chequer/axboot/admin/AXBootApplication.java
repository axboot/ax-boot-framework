package com.chequer.axboot.admin;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(value = {"classpath:axboot-common.properties", "classpath:axboot-${spring.profiles.active:local}.properties"})
public class AXBootApplication {
}
