
package com.chequer.axboot.core.domain.log;

import lombok.Getter;
import lombok.Setter;

import java.time.Clock;
import java.time.Instant;

@Setter
@Getter
public class AXBootErrorLog {

    private String phase;
    private String system;
    private String loggerName;
    private String serverName;
    private String hostName;
    private String path;
    private String message;
    private String trace;
    private Instant errorDatetime = Instant.now(Clock.systemUTC());
    private String alertYn = "N";
    private String headerMap;
    private String parameterMap;
    private String userInfo;
}
