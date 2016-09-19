<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>Database Schema to JPA Objects</title>
    <style type="text/css">
        pre {
            padding: 10px;
            border: 1px solid #bbbbbb;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="/jsp/axpi/plugins/prettify/github.css">
    <link rel="stylesheet" type="text/css" href="/jsp/axpi/plugins/ax5/css/jellyfish/ax5.min.css">
    <link rel="stylesheet" type="text/css" href="/jsp/axpi/css/app.css">
    <link rel="stylesheet" type="text/css" href="http://cdno.axisj.com/axicon/axicon.css">

    <script type="text/javascript" src="/jsp/axpi/plugins/prettify/prettify.js"></script>
    <script type="text/javascript" src="/jsp/axpi/plugins/ax5/ax5.min.js"></script>
</head>
<body>

<div class="app-page" style="padding-top:0px;">

    <c:choose>
        <c:when test="${not empty error}">
            <h1>${error}</h1>
        </c:when>

        <c:otherwise>
            <div class="app-content app-wrap">

                <article class="cover">
                    <h1 data-menu-item="JPA" data-value="Codes">Extracted Java Codes</h1>
                </article>
                <article class="content">
                    <h3 data-menu-item="Controller">Controller / <a href="${downloadLink}=Controller">Download</a></h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getController().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Modal">Entity / <a href="${downloadLink}=Entity">Download</a></h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getEntity().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Modal">GoEntity / <a href="${downloadLink}=GoEntity">Download</a></h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getGoEntity().code()}</pre>
                </article>

                <article class="content">
                    <h3>VO / <a href="${downloadLink}=VO">Download</a></h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getVo().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Service">Service / <a href="${downloadLink}=Service">Download</a></h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getService().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Repository">Repository / <a href="${downloadLink}=Repository">Download</a></h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getRepository().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="MyBatis-Interface">MyBatis-Interface / <a href="${downloadLink}=MyBatisInterface">Download</a></h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getMyBatisInterface().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="MyBatis-XML">MyBatis-XML / <a href="${downloadLink}=MyBatisXML">Download</a></h3>
                    <xmp class="prettyprint linenums">${jpaMvcModel.getMyBatisXML().code()}></xmp>
                </article>

            </div>
            <div class="app-nav-left" id="app-nav-left"></div>
        </c:otherwise>
    </c:choose>
</div>
<script type="text/javascript" src="/jsp/axpi/app.js"></script>
</body>
</html>
