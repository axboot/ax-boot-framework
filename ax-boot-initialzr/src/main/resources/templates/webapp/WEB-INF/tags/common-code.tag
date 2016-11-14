<%@ tag import="${basePackage}.domain.code.CommonCode" %>
<%@ tag import="${basePackage}.utils.CommonCodeUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="java.util.List" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="empty" %>
<%@ attribute name="groupCd" required="true" %>
<%@ attribute name="name" required="false" %>
<%@ attribute name="clazz" required="false" %>
<%@ attribute name="id" required="false" %>
<%@ attribute name="dataPath" required="false" %>
<%@ attribute name="type" required="false" %>
<%@ attribute name="defaultValue" required="false" %>
<%@ attribute name="emptyValue" required="false" %>
<%@ attribute name="emptyText" required="false" %>

<%
    if (StringUtils.isEmpty(type)) {
        type = "select";
    }

    StringBuilder builder = new StringBuilder();

    List<CommonCode> commonCodes = CommonCodeUtils.get(groupCd);

    switch (type) {
        case "select":
            builder.append("<select class=\"form-control "+ clazz +" \"");

            if (StringUtils.isEmpty(emptyValue)) {
                emptyValue = "";
            }

            if (StringUtils.isNotEmpty(id)) {
                builder.append("id=\"" + id + "\"");
            }

            if (StringUtils.isNotEmpty(name)) {
                builder.append("name=\"" + name + "\"");
            }

            if (StringUtils.isNotEmpty(dataPath)) {
                builder.append("data-ax-path=\"" + dataPath + "\"");
            }

            builder.append(">");


            if (StringUtils.isEmpty(defaultValue) && StringUtils.isNotEmpty(emptyText)) {
                builder.append(String.format("<option value=\"%s\">%s</option>", emptyValue, emptyText));
            }

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
                    builder.append(String.format(" <input type=\"radio\" name=\"%s\" data-ax-path=\"%s\" value=\"%s\" checked> %s &nbsp;", name, dataPath, commonCode.getCode(), commonCode.getName()));
                } else {
                    builder.append(String.format(" <input type=\"radio\" name=\"%s\" data-ax-path=\"%s\" value=\"%s\"> %s &nbsp;", name, dataPath, commonCode.getCode(), commonCode.getName()));
                }
            }
            break;
    }
%>

<%=builder.toString()%>