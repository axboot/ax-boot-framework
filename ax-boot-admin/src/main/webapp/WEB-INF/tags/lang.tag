<%@ tag import="com.chequer.axboot.core.context.AppContextManager" %>
<%@ tag import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="org.springframework.context.MessageSource" %>
<%@ tag import="java.util.Locale" %>
<%@ tag import="com.chequer.axboot.core.utils.MessageUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="id" required="true" %>
<%@ attribute name="arguments" %>
<%
    String message = "";
    try {
        message = MessageUtils.getMessage(request, id, arguments);
    } catch (Exception e) {
        e.printStackTrace();
    }

%>

<%=message%>