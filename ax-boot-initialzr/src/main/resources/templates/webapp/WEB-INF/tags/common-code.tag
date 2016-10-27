<%@ tag import="$" %>
<%@ tag import="$" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="java.util.List" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="groupCd" required="true" %>
<%@ attribute name="name" required="false" %>
<%@ attribute name="id" required="false" %>
<%@ attribute name="dataPath" required="false" %>
<%@ attribute name="type" required="false" %>
<%@ attribute name="defaultValue" required="false" %>
<%@ attribute name="clazz" %>

<%
    if (StringUtils.isEmpty(type)) {
        type = "select";
    }

    StringBuilder builder = new StringBuilder();

    List<CommonCode> commonCodes = CommonCodeUtils.get(groupCd);

    switch (type) {
        case "select":
            builder.append(String.format("<select id=\"%s\" name=\"%s\" data-ax-path=\"%s\" class=\"form-control %s\">", id, name, dataPath, clazz));

            for (CommonCode commonCode : commonCodes) {
                if (StringUtils.isNotEmpty(defaultValue) && defaultValue.equals(commonCode.getCode())) {
                    builder.append(String.format("<option value=\"%s\" selected>%s</option>", commonCode.getCode(), commonCode.getName()));
                } else {
                    builder.append(String.format("<option value=\"%s\">%s</option>", commonCode.getCode(), commonCode.getName()));
                }
            }
            builder.append("</select>");
            break;

        case "checkbox":
            for (CommonCode commonCode : commonCodes) {
                if (StringUtils.isNotEmpty(defaultValue) && defaultValue.equals(commonCode.getCode())) {
                    builder.append(String.format("<label class=\"checkbox-inline\"><input type=\"checkbox\" name=\"%s\" data-ax-path=\"%s\" value=\"%s\" checked> %s </label>", name, dataPath, commonCode.getCode(), commonCode.getName()));
                } else {
                    builder.append(String.format("<label class=\"checkbox-inline\"><input type=\"checkbox\" name=\"%s\" data-ax-path=\"%s\" value=\"%s\"> %s </label>", name, dataPath, commonCode.getCode(), commonCode.getName()));
                }
            }
            break;

        case "radio":
            for (CommonCode commonCode : commonCodes) {
                if (StringUtils.isNotEmpty(defaultValue) && defaultValue.equals(commonCode.getCode())) {
                    builder.append(String.format("<input type=\"radio\" name=\"%s\" data-ax-path=\"%s\" value=\"%s\" checked> %s ", name, dataPath, commonCode.getCode(), commonCode.getName()));
                } else {
                    builder.append(String.format("<input type=\"radio\" name=\"%s\" data-ax-path=\"%s\" value=\"%s\"> %s ", name, dataPath, commonCode.getCode(), commonCode.getName()));
                }
            }
            break;
    }
%>

<%=builder.toString()%>