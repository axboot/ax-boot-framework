<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
<ax:set key="page_auto_height" value="false"/>

<ax:layout name="base">
    <jsp:attribute name="script">

    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <ax:markdown src="api.md"></ax:markdown>

    </jsp:body>
</ax:layout>