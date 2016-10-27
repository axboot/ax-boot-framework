<%@ tag import="com.chequer.axboot.core.utils.TagUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="id" %>
<%@ attribute name="clazz" %>
<%@ attribute name="style" %>
<%@ attribute name="labelWidth" type="java.lang.String" %>
<%@ attribute name="width" type="java.lang.String" %>
<%
    TagUtils tagUtils = new TagUtils(getParent());

    if (StringUtils.isEmpty(clazz)) {

    }

    if (StringUtils.isEmpty(id)) {
        id = "";
    }
%>
<div data-ax-tr="${id}" id="${id}" class="${clazz}" style="${style}">
    <jsp:doBody/>
</div>
