<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<ax:set key="axbody_class" value="frame-set"/>

<ax:layout name="frame">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" var="LANG" />
        <ax:script-lang key="ax.admin" var="COL" />
		<script type="text/javascript" src="<c:url value='/assets/js/view/frame.js' />"></script>
	</jsp:attribute>
    <jsp:body>
        <div id="content-frame-container" class="ax-frame-contents"></div>
    </jsp:body>
</ax:layout>
