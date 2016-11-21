<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="ERROR"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="error-page"/>

<ax:layout name="empty">
    <jsp:attribute name="css">

    </jsp:attribute>
    <jsp:attribute name="script">

    </jsp:attribute>
    <jsp:body>

        <h1>Not Authorized</h1>

    </jsp:body>
</ax:layout>