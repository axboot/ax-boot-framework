<%@ tag import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ tag import="com.chequer.axboot.core.message.AXBootReloadableResourceBundleMessageSource" %>
<%@ tag import="com.chequer.axboot.core.context.AppContextManager" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.JsonUtils" %>
<%@ tag import="java.util.*" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="key" required="true" %>
<%@ attribute name="var" %>
<%
    if(StringUtils.isEmpty(var)) {
        var = "LANG";
    }

    String json = "";

    AXBootReloadableResourceBundleMessageSource axBootReloadableResourceBundleMessageSource = AppContextManager.getBean(AXBootReloadableResourceBundleMessageSource.class);

    Properties properties = axBootReloadableResourceBundleMessageSource.getAllProperties(RequestUtils.getLocale(request));


    if (key.equals("*")) {
        json = JsonUtils.toJson(properties);
    } else {
        Map<String, String> filterMap = new HashMap<>();

        Enumeration enumeration = properties.keys();

        while (enumeration.hasMoreElements()) {
            String _key = (String) enumeration.nextElement();
            String _value = properties.getProperty(_key);

            if (_key.startsWith(key)) {
                filterMap.put(_key, _value);
            }
        }

        json = JsonUtils.toJson(filterMap);
    }%>
<%if (StringUtils.isNotEmpty(json)) {%>

<script type="text/javascript">
    window.<%=var%>_INSTANCE = (function (json) {
        return new axboot.lang(json);
    })(<%=json%>);
    window.<%=var%> = function () {
        return <%=var%>_INSTANCE.get.apply(<%=var%>_INSTANCE, arguments);
    }
</script>
<%}%>