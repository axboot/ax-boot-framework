<%@ tag import="com.chequer.axboot.core.api.Api" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="url" required="true" %>
<%@ attribute name="key" required="true" %>
<%@ attribute name="type" required="false" %>
<%
    if (StringUtils.isEmpty(type)) {
        type = "json";
    }

    Api api = new Api(request);

    if (type.equals("json")) {
        api.json(url, key);
    } else if (type.equals("object")) {
        api.object(url, key);
    }
%>