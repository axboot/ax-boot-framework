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

    RequestUtils requestUtils = RequestUtils.of(request);
    String language = requestUtils.getString(GlobalConstants.LANGUAGE_PARAMETER_KEY);

    Locale locale;

    if (StringUtils.isNotEmpty(language)) {
        locale = new Locale(language);
    } else {
        String localeCookie = CookieUtils.getCookieValue(request, GlobalConstants.LANGUAGE_COOKIE_KEY);

        if (StringUtils.isNotEmpty(localeCookie)) {
            locale = new Locale(localeCookie);
        } else {
            locale = new Locale("ko_KR");
        }
    }

    String message = "";

    if (StringUtils.isNotEmpty(arguments)) {
        message = messageSource.getMessage(code, arguments.split(","), locale);
    } else {
        message = messageSource.getMessage(code, null, locale);
    }
%>

<%=message%>