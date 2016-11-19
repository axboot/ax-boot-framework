<%@ tag import="com.chequer.axboot.core.utils.TagUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.MessageUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>

<%@ attribute name="id" %>
<%@ attribute name="label" %>
<%@ attribute name="labelClazz" %>
<%@ attribute name="clazz" %>
<%@ attribute name="labelStyle" %>
<%@ attribute name="style" %>
<%@ attribute name="labelWidth" %>
<%@ attribute name="width" %>
<%
    if(StringUtils.isNotEmpty(label)) {
        String localizedMessage = MessageUtils.getMessage(request, label);

        if(StringUtils.isNotEmpty(localizedMessage)) {
            label = localizedMessage;
        }
    }

    TagUtils tagUtils = new TagUtils(getParent());
    String trLabelWidth = tagUtils.getParentAttribute("labelWidth");
    String trWidth = tagUtils.getParentAttribute("width");

    if (StringUtils.isEmpty(labelStyle)) {
        labelStyle = "";
    }

    if (StringUtils.isEmpty(style)) {
        style = "";
    }

    if (StringUtils.isEmpty(labelWidth)) {
        if(!StringUtils.isEmpty(trLabelWidth)) {
            labelStyle += ";width:" + trLabelWidth;
        }
    }else{
        labelStyle += ";width:" + labelWidth;
    }

    if (StringUtils.isEmpty(width)) {
        if(!StringUtils.isEmpty(trWidth)) {
            style += ";width:" + trWidth;
        }
    }else{
        style += ";width:" + width;
    }

    if (StringUtils.isEmpty(label)) {
%>
<div data-ax-td="${id}" id="${id}" class="${clazz}" style="<%=label%>">
    <jsp:doBody/>
</div>
<%
} else {
%>

<div data-ax-td="${id}" id="${id}" class="${clazz}" style="<%=style%>">
    <div data-ax-td-label="${id}" class="${labelClazz}" style="<%=labelStyle%>"><%=label%></div>
    <div data-ax-td-wrap="">
        <jsp:doBody/>
    </div>
</div>
<%
    }
%>
