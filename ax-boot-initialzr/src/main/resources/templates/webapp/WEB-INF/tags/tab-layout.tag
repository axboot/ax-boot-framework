<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="name" %>
<%@ attribute name="clazz" type="java.lang.String" %>
<%@ attribute name="style" %>
<%@ attribute name="data_fit_height_content" type="java.lang.String" %>

<%
    if (StringUtils.isEmpty(style)) {
        style = "";
    }
%>
<div data-ax5layout="${name}" data-config='{layout:"tab-panel"}' data-fit-height-content="${data_fit_height_content}" style="<%=style%>">
    <jsp:doBody/>
</div>
