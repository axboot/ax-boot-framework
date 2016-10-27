<%@ tag import="com.chequer.axboot.core.utils.TagUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="width" %>
<%@ attribute name="height" %>
<%
    TagUtils tagUtils = new TagUtils(getParent());
    String _oriental = tagUtils.getParentAttribute("oriental");
%>
<div data-splitter='{}'><jsp:doBody/></div>