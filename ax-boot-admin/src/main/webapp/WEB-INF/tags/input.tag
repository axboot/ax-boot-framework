<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.MessageUtils" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>

<%@ attribute name="id" %>
<%@ attribute name="name" %>
<%@ attribute name="type" required="true" %>
<%@ attribute name="clazz" %>
<%@ attribute name="style" %>
<%@ attribute name="value" %>
<%@ attribute name="placeholder" %>

<%
    StringBuilder builder = new StringBuilder();

    builder.append(String.format("<input type=\"%s\"", type));



    if (StringUtils.isNotEmpty(placeholder)) {
        String localizedMessage = MessageUtils.getMessage(request, placeholder);

        if (StringUtils.isNotEmpty(localizedMessage)) {
            placeholder = localizedMessage;
        }
        builder.append(String.format(" placeholder=\"%s\"", placeholder));
    }


    builder.append("/>");

%>