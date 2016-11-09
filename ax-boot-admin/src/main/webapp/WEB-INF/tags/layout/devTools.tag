<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ tag import="com.chequer.axboot.admin.utils.CommonCodeUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.PhaseUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.ContextUtil" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%String commonCodeJson = CommonCodeUtils.getAllByJson();
    boolean isDevelopmentMode = PhaseUtils.isDevelopmentMode();
    request.setAttribute("isDevelopmentMode", isDevelopmentMode);%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>${config.title}</title>
    <link rel="shortcut icon" href="<c:url value='/assets/favicon.ico'/>" type="image/x-icon"/>
    <link rel="icon" href="<c:url value='/assets/favicon.ico'/>" type="image/x-icon"/>

    <link rel="stylesheet" type="text/css" href="//axboot-theme:2022/cocker/axboot.css"/>

    <script type="text/javascript">
        var CONTEXT_PATH = "<%=ContextUtil.getContext()%>";
        var TOP_MENU_DATA = [
            {
                menuId: "00-swagger", id: "swagger", progNm: 'Swagger', name: 'Swagger', menuNm: 'Swagger', progPh: '/swagger/index.html', url: '/swagger/index.html', program: {
                progCd: "Swagger",
                progNm: "Swagger",
                progPh: "/swagger/index.html"
            }
            },
            {
                menuId: "01-H2Console", id: "H2-Console", progNm: 'H2-Console', name: 'H2-Console', menuNm: 'H2-Console', progPh: '/h2-console', url: '/h2-console', program: {
                progCd: "H2-Console",
                progNm: "H2-Console",
                progPh: "/h2-console"
            }
            },
            {
                menuId: "02-ModelExtractor", id: "ModelExtractor", progNm: 'ModelExtractor', name: 'ModelExtractor', menuNm: 'ModelExtractor', progPh: '/modelExtractor/db', url: '/modelExtractor/db',
                program: {
                    progCd: "ModelExtractor",
                    progNm: "ModelExtractor",
                    progPh: "/modelExtractor/db"
                }
            }
        ];
        var COMMON_CODE = (function (json) {
            return json;
        })(<%=commonCodeJson%>);
        var SCRIPT_SESSION = (function (json) {
            return json;
        })(${scriptSession});
    </script>

    <script type="text/javascript" src="<c:url value='/assets/js/plugins.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/assets/js/axboot/dist/axboot.js' />"></script>
    <script type="text/javascript" src="<c:url value='/axboot.config.js' />"></script>
    <jsp:invoke fragment="css"/>
    <jsp:invoke fragment="js"/>
</head>
<body class="ax-body ${axbody_class}" onselectstart="return false;">
<div id="ax-frame-root" class="" data-root-container="true">
    <jsp:doBody/>

    <div class="ax-frame-header-tool">
        <div class="ax-split-col" style="height: 100%;">
            <div class="ax-split-panel text-align-left">

            </div>
            <div class="ax-split-panel text-align-right">
                <div class="ax-split-col ax-frame-user-info">

                </div>
            </div>
        </div>

    </div>

    <div class="ax-frame-header">
        <div class="ax-split-col" style="height: 100%;">
            <div>&nbsp;</div>
            <div class="ax-split-panel cell-logo">
                <a href="#">
                    <img src="https://cdn.rawgit.com/axboot/ax-boot-themes/master/cocker/images/header-logo.png" width="100%"/>
                </a>
            </div>
            <div id="ax-top-menu" class="ax-split-panel ax-split-flex"></div>
        </div>
    </div>

    <div class="ax-frame-header-tab">
        <div id="ax-frame-header-tab-container"></div>
    </div>

</div>
<jsp:invoke fragment="script"/>
</body>
</html>