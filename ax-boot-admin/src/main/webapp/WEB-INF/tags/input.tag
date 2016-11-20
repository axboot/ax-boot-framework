<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.MessageUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>

<%@ attribute name="id" %>
<%@ attribute name="name" %>
<%@ attribute name="type" %>
<%@ attribute name="clazz" %>
<%@ attribute name="style" %>
<%@ attribute name="value" %>
<%@ attribute name="placeholder" %>
<%@ attribute name="maxLength" %>
<%@ attribute name="dataPath" required="false" %>

<%
    StringBuilder builder = new StringBuilder();

    if(StringUtils.isEmpty(type)) {
        type = "text";
    }
    builder.append(String.format("<input type=\"%s\"", type));

    if(StringUtils.isNotEmpty(id)) {
        builder.append(String.format(" id=\"%s\"", id));
    }

    if(StringUtils.isNotEmpty(name)) {
        builder.append(String.format(" name=\"%s\"", name));
    }

    if (StringUtils.isNotEmpty(dataPath)) {
        builder.append(String.format(" data-ax-path=\"%s\"", dataPath));
    }

    if (StringUtils.isEmpty(clazz)) {
        clazz = "";
    }

    builder.append(String.format(" class=\"form-control %s\"", clazz));

    if(StringUtils.isNotEmpty(style)) {
        builder.append(String.format(" style=\"%s\"", style));
    }

    if(StringUtils.isNotEmpty(value)) {
        builder.append(String.format(" value=\"%s\"", value));
    }

    if(StringUtils.isNotEmpty(maxLength)) {
        builder.append(String.format(" maxLength=\"%s\"", maxLength));
    }

    if (StringUtils.isNotEmpty(placeholder)) {
        String localizedMessage = MessageUtils.getMessage(request, placeholder);

        if (StringUtils.isNotEmpty(localizedMessage)) {
            placeholder = localizedMessage;
        }
        builder.append(String.format(" placeholder=\"%s\"", placeholder));
    }


    builder.append("/>");

%>
<%=builder.toString()%>