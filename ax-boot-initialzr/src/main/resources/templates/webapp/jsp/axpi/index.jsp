<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>Database Schema to JPA Objects</title>

    <link rel="stylesheet" type="text/css" href="/jsp/axpi/plugins/prettify/github.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/axisj/ax5/master/src/css/dplus/ax5.min.css">
    <link rel="stylesheet" type="text/css" href="/jsp/axpi/css/app.css">
    <link rel="stylesheet" type="text/css" href="http://cdno.axisj.com/axicon/axicon.css">

    <style type="text/css">
        pre {
            padding: 10px;
            border: 1px solid #bbbbbb;
        }

        a:hover {
            color: #0F6AB4;
        }

        .ax-btn {
            border-radius: 6px;
            text-decoration: none;
        }
    </style>

    <script type="text/javascript" src="/jsp/axpi/plugins/prettify/prettify.js"></script>
    <script type="text/javascript" src="https://rawgit.com/axisj/ax5/master/pub/ax5.min.js"></script>
    <script type="text/javascript" src="https://rawgit.com/axisj/ax5/master/pub/ui/all.min.js"></script>
    <script>
        function makeAll() {
            var my_dialog = new ax5.ui.dialog();
            my_dialog.set_config({});

            my_dialog.prompt({
                theme: 'good',
                width: 300,
                title: 'AXBOOT Generated Code',
                input: {
                    data1: {label:"Package Name"},
                    data2: {label:"Class Name"}
                }
            }, function () {
                //console.log(this.value);

                ax5.xhr({
                    method: "GET",
                    url: "${copyLink}&templateTypes=Controller,Entity,Repository,Service&packageName=" + this.data1 + "&className=" + this.data2,
                    param: "",
                    res: function (response, status) {
                        alert("Success");
                    },
                    error: function () {

                    }
                });

            });
        }
    </script>
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
                    <h1 data-menu-item="JPA" data-value="Codes" style="padding-top: 0px;">
                        Generated Code
                        <button onclick="makeAll()" class="ax-btn good">MakeAll</button>

                        <button class="ax-btn" onclick="history.back();" style="border-radius: 6px;position: absolute;right: 15px; top :10px;">Back</button>
                    </h1>
                </article>
                <article class="content">
                    <h3 data-menu-item="Controller">Controller /
                        <a href="${downloadLink}=Controller" class="ax-btn">Download</a>
                    </h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getController().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Modal">Entity /
                        <a href="${downloadLink}=Entity" class="ax-btn">Download</a>
                    </h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getEntity().code()}</pre>
                </article>

                <article class="content">
                    <h3>VO /
                        <a href="${downloadLink}=VO" class="ax-btn">Download</a>
                    </h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getVo().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Service">Service /
                        <a href="${downloadLink}=Service" class="ax-btn">Download</a>

                    </h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getService().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Repository">Repository /
                        <a href="${downloadLink}=Repository" class="ax-btn">Download</a>

                    </h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getRepository().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="MyBatis-Interface">MyBatis-Interface /
                        <a href="${downloadLink}=MyBatisInterface" class="ax-btn">Download</a>

                    </h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getMyBatisInterface().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="MyBatis-XML">MyBatis-XML /
                        <a href="${downloadLink}=MyBatisXML" class="ax-btn">Download</a>

                    </h3>
                    <xmp class="prettyprint linenums">${jpaMvcModel.getMyBatisXML().code()}</xmp>
                </article>

            </div>
            <div class="app-nav-left" id="app-nav-left"></div>
        </c:otherwise>
    </c:choose>
</div>
<script type="text/javascript" src="/jsp/axpi/app.js"></script>
</body>
</html>
