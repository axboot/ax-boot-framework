<%@ tag import="com.chequer.axboot.core.utils.TagUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.MessageUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="width" %>
<%@ attribute name="height" %>
<%@ attribute name="style" %>
<%@ attribute name="clazz" %>
<%@ attribute name="scroll" %>
<%@ attribute name="label" %>
<%@ attribute name="active" %>
<%
    if(StringUtils.isNotEmpty(label)) {
        String localizedMessage = MessageUtils.getMessage(request, label);

        if(StringUtils.isNotEmpty(localizedMessage)) {
            label = localizedMessage;
        }
    }

    TagUtils tagUtils = new TagUtils(getParent());

    if (StringUtils.isEmpty(active)) {
        active = "false";
    }

    if (StringUtils.isEmpty(style)) {
        style = "padding:10px 0 0 0;";
    }
%>
<div data-tab-panel='{label: "<%=label%>", active: <%=active%>}'>
    <div style="<%=style%>" data-split-panel-wrap="${scroll}">
        <jsp:doBody/>
    </div>
</div>