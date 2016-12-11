package com.chequer.axboot.core.logging;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.StackTraceElementProxy;
import ch.qos.logback.core.UnsynchronizedAppenderBase;
import ch.qos.logback.core.util.ContextUtil;
import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.domain.log.AXBootErrorLog;
import com.chequer.axboot.core.domain.log.AXBootErrorLogService;
import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.MDCUtil;
import com.chequer.axboot.core.utils.PhaseUtils;
import lombok.Getter;
import lombok.Setter;
import net.gpedro.integrations.slack.SlackApi;
import net.gpedro.integrations.slack.SlackAttachment;
import net.gpedro.integrations.slack.SlackField;
import net.gpedro.integrations.slack.SlackMessage;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Setter
@Getter
public class AXBootLogbackAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {

    private AXBootErrorLogService errorLogService;

    private AXBootContextConfig axBootContextConfig;

    private AXBootContextConfig.Logging axBootLoggingConfig;

    public AXBootLogbackAppender(AXBootErrorLogService axBootErrorLogService, AXBootContextConfig axBootContextConfig) {
        this.errorLogService = axBootErrorLogService;
        this.axBootContextConfig = axBootContextConfig;
        this.axBootLoggingConfig = axBootContextConfig.getLoggingConfig();
    }

    @PostConstruct
    public void created() {
        this.axBootLoggingConfig = axBootContextConfig.getLoggingConfig();
    }

    @Override
    public void doAppend(ILoggingEvent eventObject) {
        super.doAppend(eventObject);
    }

    @Override
    protected void append(ILoggingEvent loggingEvent) {
        if (loggingEvent.getLevel().isGreaterOrEqual(axBootLoggingConfig.getLevel())) {
            AXBootErrorLog errorLog = getErrorLog(loggingEvent);

            if (axBootLoggingConfig.getDatabase().isEnabled()) {
                if (axBootLoggingConfig.getSlack().isEnabled()) {
                    errorLog.setAlertYn("Y");
                }
                toDatabase(errorLog);
            }

            if (axBootLoggingConfig.getSlack().isEnabled()) {
                toSlack(errorLog);
            }

            if (axBootLoggingConfig.getJandi().isEnable()) {
                toJandi(errorLog);
            }
        }
    }

    private void toJandi(AXBootErrorLog errorLog) {

    }

    private void toSlack(AXBootErrorLog errorLog) {
        SlackApi slackApi = new SlackApi(axBootLoggingConfig.getSlack().getWebHookUrl());

        List<SlackField> fields = new ArrayList<>();

        SlackField message = new SlackField();
        message.setTitle("에러내용");
        message.setValue(errorLog.getMessage());
        message.setShorten(false);
        fields.add(message);

        SlackField path = new SlackField();
        path.setTitle("요청 URL");
        path.setValue(errorLog.getPath());
        path.setShorten(false);
        fields.add(path);

        SlackField date = new SlackField();
        date.setTitle("발생시간");

        LocalDateTime localDateTime = LocalDateTime.ofInstant(errorLog.getErrorDatetime(), ZoneId.of("Asia/Seoul"));
        date.setValue(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        date.setShorten(true);
        fields.add(date);

        SlackField profile = new SlackField();
        profile.setTitle("프로파일");
        profile.setValue(errorLog.getPhase());
        profile.setShorten(true);
        fields.add(profile);

        SlackField system = new SlackField();
        system.setTitle("시스템명");
        system.setValue(errorLog.getSystem());
        system.setShorten(true);
        fields.add(system);

        SlackField serverName = new SlackField();
        serverName.setTitle("서버명");
        serverName.setValue(errorLog.getServerName());
        serverName.setShorten(true);
        fields.add(serverName);

        SlackField hostName = new SlackField();
        hostName.setTitle("호스트명");
        hostName.setValue(errorLog.getHostName());
        hostName.setShorten(false);
        fields.add(hostName);

        if (errorLog.getUserInfo() != null) {
            SlackField userInformation = new SlackField();
            userInformation.setTitle("사용자 정보");
            userInformation.setValue(JsonUtils.toPrettyJson(errorLog.getUserInfo()));
            userInformation.setShorten(false);
            fields.add(userInformation);
        }

        String title = errorLog.getMessage();

        SlackAttachment slackAttachment = new SlackAttachment();
        slackAttachment.setFallback("에러발생!! 확인요망");
        slackAttachment.setColor("danger");
        slackAttachment.setFields(fields);
        slackAttachment.setTitle(title);

        if (StringUtils.isNotEmpty(axBootContextConfig.getLoggingConfig().getAdminUrl())) {
            slackAttachment.setTitleLink(axBootContextConfig.getLoggingConfig().getAdminUrl());
        }

        slackAttachment.setText(errorLog.getTrace());

        SlackMessage slackMessage = new SlackMessage("");

        String channel = axBootLoggingConfig.getSlack().getChannel();

        if (!axBootLoggingConfig.getSlack().getChannel().startsWith("#")) {
            channel = "#" + channel;
        }

        slackMessage.setChannel(channel);
        slackMessage.setUsername(String.format("[%s] - ErrorReportBot", errorLog.getPhase()));
        slackMessage.setIcon(":exclamation:");
        slackMessage.setAttachments(Collections.singletonList(slackAttachment));

        slackApi.call(slackMessage);
    }

    private void toDatabase(AXBootErrorLog errorLog) {
        errorLogService.save(errorLog);
    }

    public AXBootErrorLog getErrorLog(ILoggingEvent loggingEvent) {
        AXBootErrorLog errorLog = new AXBootErrorLog();
        errorLog.setPhase(PhaseUtils.phase());
        errorLog.setSystem(axBootContextConfig.getApplication().getName());
        errorLog.setLoggerName(loggingEvent.getLoggerName());
        errorLog.setServerName(axBootContextConfig.getServerName());
        errorLog.setHostName(getHostName());
        errorLog.setPath(MDCUtil.get(MDCUtil.REQUEST_URI_MDC));
        errorLog.setMessage(loggingEvent.getFormattedMessage());
        errorLog.setHeaderMap(MDCUtil.get(MDCUtil.HEADER_MAP_MDC));
        errorLog.setParameterMap(MDCUtil.get(MDCUtil.PARAMETER_BODY_MDC));
        errorLog.setUserInfo(MDCUtil.get(MDCUtil.USER_INFO_MDC));

        if (loggingEvent.getThrowableProxy() != null) {
            errorLog.setTrace(getStackTrace(loggingEvent.getThrowableProxy().getStackTraceElementProxyArray()));
        }

        return errorLog;
    }

    public String getHostName() {
        try {
            return ContextUtil.getLocalHostName();
        } catch (Exception e) {
            // ignored
        }
        return null;
    }

    public String getStackTrace(StackTraceElementProxy[] stackTraceElements) {
        if (stackTraceElements == null || stackTraceElements.length == 0) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        for (StackTraceElementProxy element : stackTraceElements) {
            sb.append(element.toString());
            sb.append("\n");
        }
        return sb.toString();
    }
}