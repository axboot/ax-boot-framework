<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="false"/>

<ax:layout name="base">
    <jsp:attribute name="js">
    <script src="/assets/plugins/prettify/prettify.js"></script>
    <script src="/assets/plugins/prettify/lang-css.js"></script>
    </jsp:attribute>
    <jsp:attribute name="css">
    <link rel="stylesheet" type="text/css" href="/assets/plugins/prettify/skins/github.css"/>
    </jsp:attribute>
    <jsp:attribute name="script">
    <script>
        $(document.body).ready(function () {
            $(document.body).find("pre").addClass("prettyprint linenums lang-js");
            if (window["prettyPrint"]) window["prettyPrint"]();
        });
    </script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div class="panel panel-default">
            <div class="panel-body">
                <ax:markdown src="ax-phase-auth.md"></ax:markdown>
            </div>
        </div>

    </jsp:body>
</ax:layout>