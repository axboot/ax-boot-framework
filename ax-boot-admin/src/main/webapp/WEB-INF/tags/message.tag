<%@ tag import="com.chequer.axboot.core.context.AppContextManager" %>
<%@ tag import="org.springframework.context.MessageSource" %>
<%@ tag import="org.springframework.web.servlet.i18n.CookieLocaleResolver" %>
<%@ tag import="java.util.Locale" %>
<%@ tag import="com.chequer.axboot.core.utils.CookieUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.SessionUtils" %>
<%@ tag import="sun.applet.resources.MsgAppletViewer_zh_CN" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="code" required="true" %>
<%
    MessageSource messageSource = AppContextManager.getBean(MessageSource.class);

    Locale locale;

    Object requestAttributeLocale = request.getAttribute(CookieLocaleResolver.LOCALE_REQUEST_ATTRIBUTE_NAME);

    if (requestAttributeLocale != null) {
        locale = (Locale) requestAttributeLocale;
    } else {
        String localeCookie = CookieUtils.getCookieValue(request, "language");

        if (StringUtils.isEmpty(localeCookie)) {
            locale = new Locale(SessionUtils.getCurrentUser().getLocale().getLanguage());
        } else {
            locale = new Locale(localeCookie);
        }
    }

    String message = messageSource.getMessage(code, null, locale);
%>

<%=message%>