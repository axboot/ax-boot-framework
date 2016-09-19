<%@ tag import="com.chequer.axboot.core.utils.TagUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="width" %>
<%@ attribute name="height" %>
<%@ attribute name="style" %>
<%@ attribute name="clazz" %>
<%@ attribute name="scroll" %>
<%
    TagUtils tagUtils = new TagUtils(getParent());
    String _oriental = tagUtils.getParentAttribute("oriental");
    if (_oriental.equals("horizontal")) {
%>
<div data-split-panel='{width: "${width}"}'>
    <div style="${style}" class="${clazz}" data-split-panel-wrap="${scroll}">
        <jsp:doBody/>
    </div>
</div>
<%
} else {
%>
<div data-split-panel='{height: "${height}"}' style="${style}" class="${clazz}">
    <div style="${style}" class="${clazz}" data-split-panel-wrap="${scroll}">
        <jsp:doBody/>
    </div>
</div>
<%
    }
%>