<%@ tag import="com.chequer.axboot.core.utils.MessageUtils" %><%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %><%@ attribute name="id" required="true" %><%@ attribute name="args" %><%
    String message = "";
    try {
        message = MessageUtils.getMessage(request, id, args);
    } catch (Exception e) {
        e.printStackTrace();
    }

%><%=message%>