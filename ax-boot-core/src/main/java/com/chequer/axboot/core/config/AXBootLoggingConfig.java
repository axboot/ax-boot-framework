package com.chequer.axboot.core.config;

import ch.qos.logback.classic.LoggerContext;
import com.chequer.axboot.core.domain.log.ErrorLogService;
import com.chequer.axboot.core.logback.AXBootLogbackAppender;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;

import javax.inject.Inject;

public class AXBootLoggingConfig implements InitializingBean {

    @Inject
    private AXBootContextConfig axBootContextConfig;

    @Inject
    private ErrorLogService errorLogService;

    @Override
    public void afterPropertiesSet() throws Exception {
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        AXBootLogbackAppender axBootLogbackAppender = new AXBootLogbackAppender(errorLogService, axBootContextConfig);
        axBootLogbackAppender.setContext(loggerContext);
        axBootLogbackAppender.setName("axBootLogbackAppender");
        axBootLogbackAppender.start();
        loggerContext.getLogger("ROOT").addAppender(axBootLogbackAppender);
    }
}
