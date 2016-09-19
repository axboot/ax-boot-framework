<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="key" required="true" %>
<%@ attribute name="value" required="true" %>
<%@ attribute name="scope" required="false" %>
<%
    request.setAttribute(key, value);
%>