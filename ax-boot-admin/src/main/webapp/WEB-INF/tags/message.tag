<%@ tag import="com.chequer.axboot.admin.code.GlobalConstants" %>
<%@ tag import="com.chequer.axboot.core.context.AppContextManager" %>
<%@ tag import="com.chequer.axboot.core.utils.CookieUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.SessionUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="org.springframework.context.MessageSource" %>
<%@ tag import="java.util.Locale" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="code" required="true" %>
<%@ attribute name="arguments" %>
<%
    MessageSource messageSource = AppContextManager.getBean(MessageSource.class);

    Locale locale = RequestUtils.getLocale(request);

    String message = "";

    if (StringUtils.isNotEmpty(arguments)) {
        message = messageSource.getMessage(code, arguments.split(","), locale);
    } else {
        message = messageSource.getMessage(code, null, locale);
    }
%>

<%=message%>