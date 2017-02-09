
package com.chequer.axboot.admin.domain.log;

import com.chequer.axboot.admin.domain.SimpleJpaModel;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import com.chequer.axboot.core.domain.log.AXBootErrorLog;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.Clock;
import java.time.Instant;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@ToString
@Table(name = "ERROR_LOG_M")
@Comment(value = "에러로그")
public class ErrorLog extends SimpleJpaModel<Long> implements AXBootErrorLog {

    @Id
    @Column(name = "ID", precision = 20)
    @ColumnPosition(1)
    @Comment(value = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "PHASE", length = 10)
    @ColumnPosition(2)
    @Comment(value = "PHASE")
    private String phase;

    @Column(name = "SYSTEM", length = 50)
    @ColumnPosition(3)
    @Comment(value = "SYSTEM")
    private String system;

    @Column(name = "LOGGER_NAME", length = 300)
    @ColumnPosition(4)
    @Comment(value = "Logger Name")
    private String loggerName;

    @Column(name = "SERVER_NAME", length = 50)
    @ColumnPosition(5)
    @Comment(value = "서버명")
    private String serverName;

    @Column(name = "HOST_NAME", length = 50)
    @ColumnPosition(6)
    @Comment(value = "호스트 명")
    private String hostName;

    @Column(name = "PATH", length = 2048)
    @ColumnPosition(7)
    @Comment(value = "ERROR PATH")
    private String path;

    @Column(name = "MESSAGE", columnDefinition = "TEXT")
    @ColumnPosition(8)
    @Comment(value = "메시지")
    private String message;

    @Column(name = "TRACE", columnDefinition = "TEXT")
    @ColumnPosition(9)
    @Comment(value = "STACK TRACE")
    private String trace;

    @Column(name = "ERROR_DATETIME")
    @ColumnPosition(10)
    @Comment(value = "에러일시")
    private Instant errorDatetime = Instant.now(Clock.systemUTC());

    @Column(name = "ALERT_YN", length = 1)
    @ColumnPosition(11)
    @Comment(value = "알람여부")
    private String alertYn = "N";

    @Column(name = "HEADER_MAP", columnDefinition = "TEXT")
    @ColumnPosition(12)
    @Comment(value = "헤더 정보")
    private String headerMap;

    @Column(name = "PARAMETER_MAP", columnDefinition = "TEXT")
    @ColumnPosition(13)
    @Comment(value = "파라미터 정보")
    private String parameterMap;

    @Column(name = "USER_INFO", columnDefinition = "TEXT")
    @ColumnPosition(14)
    @Comment(value = "사용자 정보")
    private String userInfo;

    @Override
    public Long getId() {
        return id;
    }
}
