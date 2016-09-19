<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="id" %>
<%@ attribute name="clazz" type="java.lang.String" %>
<%@ attribute name="style" %>
<%@ attribute name="minWidth" %>
<%
    if (StringUtils.isEmpty(id)) {
        id = "";
    }
%>
<div data-ax-tbl="${id}" id="${id}" class="${clazz}" style="${style}">
    <jsp:doBody/>
</div>
