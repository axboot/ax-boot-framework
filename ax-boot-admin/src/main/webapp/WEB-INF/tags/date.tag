<%@ tag import="com.chequer.axboot.core.domain.user.SessionUser" %>
<%@ tag import="com.chequer.axboot.core.utils.SessionUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="java.time.Instant" %>
<%@ tag import="java.time.LocalDateTime" %>
<%@ tag import="java.time.OffsetDateTime" %>
<%@ tag import="java.time.ZoneId" %>
<%@ tag import="java.time.format.DateTimeFormatter" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="value" required="true" %>
<%@ attribute name="format" required="false" %>

<%
    SessionUser sessionUser = SessionUtils.getCurrentUser();

    if (StringUtils.isEmpty(format)) {
        format = sessionUser.getDateTimeFormat();
    }

    OffsetDateTime offsetDateTime = OffsetDateTime.parse("2016-09-04T15:28:55Z");

    Instant instant = offsetDateTime.toInstant();

    LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of(sessionUser.getTimeZone()));

    out.print(localDateTime.format(DateTimeFormatter.ofPattern(format)));
%>
