<%@ tag import="com.chequer.axboot.core.utils.TagUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="id" %>
<%@ attribute name="width" %>
<%@ attribute name="height" %>
<%@ attribute name="style" %>
<%@ attribute name="clazz" %>
<%@ attribute name="scroll" %>
<%
    TagUtils tagUtils = new TagUtils(getParent());
    String _orientation = tagUtils.getParentAttribute("orientation");
    if (_orientation.equals("vertical")) {
%>
<div data-split-panel='{width: "${width}"}' id="${id}">
    <div style="${style}" class="${clazz}" data-split-panel-wrap="${scroll}">
        <jsp:doBody/>
    </div>
</div>
<%
} else {
%>
<div data-split-panel='{height: "${height}"}' id="${id}" style="${style}" class="${clazz}">
    <div style="${style}" class="${clazz}" data-split-panel-wrap="${scroll}">
        <jsp:doBody/>
    </div>
</div>
<%
    }
%>