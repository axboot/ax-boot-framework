<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="ERROR"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="error-page"/>

<ax:layout name="empty">
    <jsp:attribute name="css">
        <link href="https://fonts.googleapis.com/css?family=Unica+One" rel="stylesheet">
    </jsp:attribute>
    <jsp:attribute name="script">
        <script>
            var isHeadless = true;
        </script>
    </jsp:attribute>
    <jsp:body>
        <div class="robotpage-bottom-half">
            <div>
                <p id="robot-text">PAGE NOT FOUND</p>
                <p>TO RETURN TO THE PREVIOUS PAGE, PLEASE CLICK BUTTON.</p>
                <div class="robot-buttons">
                    <a class="robot-buttons" onclick="history.back();">BACK</a>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </jsp:body>
</ax:layout>