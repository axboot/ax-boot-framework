<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>AXBoot DevTools</title>

    <link rel="stylesheet" type="text/css" href="/jsp/axpi/plugins/prettify/github.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/thomasJang/ax5/a8d0ab77/pub/css/dplus/ax5.min.css">
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
    <script type="text/javascript" src="https://cdn.rawgit.com/thomasJang/ax5/a8d0ab77/pub/ax5.min.js"></script>
    <script type="text/javascript" src="https://cdn.rawgit.com/thomasJang/ax5/a8d0ab77/pub/ui/all.min.js"></script>
    <script>
        function makeAll() {
            var my_dialog = new ax5.ui.dialog();
            my_dialog.set_config({});

            my_dialog.prompt({
                theme: 'good',
                width: 300,
                title: 'AXBOOT Code Generator',
                input: {
                    data1: {label:"Package Name"},
                    data2: {label:"Class Name"}
                }
            }, function () {
                if(this.key == 'ok') {
                    ax5.xhr({
                        method: "GET",
                        url: "${copyLink}&templateTypes=Controller,Entity,Repository,Service&packageName=" + this.data1 + "&className=" + this.data2,
                        param: "",
                        res: function (response, status) {
                            alert("Code Generated");
                        },
                        error: function () {
                        }
                    });
                }
                console.log(this);

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
                    <h1 data-menu-item="JPA" data-value="Code" style="padding-top: 0px;">
                        Code
                        <button onclick="makeAll()" class="ax-btn good">Generate</button>
                        <button class="ax-btn" onclick="history.back();" style="border-radius: 6px;position: absolute;right: 15px; top :10px;">Back</button>
                    </h1>
                </article>
                <article class="content">
                    <h3 data-menu-item="Controller">Controller</h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getController().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Modal">Entity</h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getEntity().code()}</pre>
                </article>

                <article class="content">
                    <h3>VO</h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getVo().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Service">Service</h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getService().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="Repository">Repository</h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getRepository().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="MyBatis-Interface">MyBatis-Interface</h3>
                    <pre class="prettyprint linenums">${jpaMvcModel.getMyBatisInterface().code()}</pre>
                </article>

                <article class="content">
                    <h3 data-menu-item="MyBatis-XML">MyBatis-XML</h3>
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
