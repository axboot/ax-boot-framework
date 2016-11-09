<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<ax:set key="axbody_class" value="dev-tools"/>

<ax:layout name="devTools">
    <jsp:attribute name="script">
		<script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-dev-tools.js' />"></script>
	</jsp:attribute>
    <jsp:body>
        <div id="content-frame-container" class="ax-frame-contents"></div>
    </jsp:body>
</ax:layout>
