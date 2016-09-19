<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="DASH BOARD"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>

<ax:layout name="base">
    <jsp:attribute name="css">
        <style>
            .widget {

            }

            .widget .widget-head {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .widget .chart-container {
                text-align: center;
            }
        </style>
    </jsp:attribute>
    <jsp:attribute name="script">
        <script type="text/javascript">

        </script>
    </jsp:attribute>
    <jsp:attribute name="header">
        <h1 class="title"><i class='cqc-gauge'></i> ${title}</h1>
        <p class="desc">${page_desc}</p>
    </jsp:attribute>
    <jsp:body>


    </jsp:body>
</ax:layout>