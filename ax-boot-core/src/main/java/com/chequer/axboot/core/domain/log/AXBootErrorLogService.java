package com.chequer.axboot.core.domain.log;

import ch.qos.logback.classic.spi.ILoggingEvent;

public interface AXBootErrorLogService {

    void save(AXBootErrorLog errorLog);

    void deleteAllLogs();

    void deleteLog(Long id);

    AXBootErrorLog build(ILoggingEvent loggingEvent);
}
