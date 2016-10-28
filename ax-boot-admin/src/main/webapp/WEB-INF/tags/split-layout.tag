<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="name" %>
<%@ attribute name="clazz" type="java.lang.String" %>
<%@ attribute name="style" %>
<%@ attribute name="orientation" type="java.lang.String" %>
<%@ attribute name="margin" %>
<%@ attribute name="width" %>
<%@ attribute name="height" %>

<%
    if (StringUtils.isEmpty(style)) {
        style = "";
    }
    if (!StringUtils.isEmpty(width)) {
        style += ";width:" + width;
    }
    if (!StringUtils.isEmpty(height)) {
        style += ";height:" + height;
    }
%>
<div data-ax5layout="${name}" role="page-content" data-config='{layout:"split-panel", orientation: "${orientation}", splitter: {size: 7}}' style="<%=style%>">
    <jsp:doBody/>
</div>
