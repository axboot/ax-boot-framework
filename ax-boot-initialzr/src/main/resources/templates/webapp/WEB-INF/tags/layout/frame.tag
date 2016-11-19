<%@ tag import="${basePackage}.utils.CommonCodeUtils" %>
<%@ tag import="com.chequer.axboot.core.utils.ContextUtil" %>
<%@ tag import="com.chequer.axboot.core.utils.PhaseUtils" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%
    String commonCodeJson = CommonCodeUtils.getAllByJson();
    boolean isDevelopmentMode = PhaseUtils.isDevelopmentMode();
    request.setAttribute("isDevelopmentMode", isDevelopmentMode);
%>
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

    <c:forEach var="css" items="${config.extendedCss}">
        <link rel="stylesheet" type="text/css" href="<c:url value='${css}'/>"/>
    </c:forEach>
    <!--[if lt IE 10]>
    <c:forEach var="css" items="${config.extendedCssforIE9}">
        <link rel="stylesheet" type="text/css" href="<c:url value='${css}'/>"/>
    </c:forEach>
    <![endif]-->

    <script type="text/javascript">
        var CONTEXT_PATH = "<%=ContextUtil.getContext()%>";
        var TOP_MENU_DATA = (function (json) {
            return json;
        })(${menuJson});
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
<div id="ax-frame-root" class="<c:if test="${config.layout.leftSideMenu eq 'visible'}">show-aside</c:if>" data-root-container="true">
    <jsp:doBody/>

    <div class="ax-frame-header-tool">
        <div class="ax-split-col" style="height: 100%;">
            <div class="ax-split-panel text-align-left">

            </div>
            <div class="ax-split-panel text-align-right">

                <div class="ax-split-col ax-frame-user-info">
                    <div class="ax-split-panel">
                        <a href="/?language=en">English</a> / <a href="/?language=ko">한국어</a>
                    </div>
                    <div class="panel-split"></div>
                    <c:if test="${isDevelopmentMode}">
                        <!-- 개발자 툴 연결 아이콘 -->
                        <div class="ax-split-panel">
                            <a href="#ax" onclick="window.open('/jsp/system/system-dev-tools.jsp');"><i class="cqc-tools"></i> <ax:lang code="axboot.devtools"/></a>
                        </div>
                        <div class="panel-split"></div>
                    </c:if>
                    <div class="ax-split-panel">
                        <a href="#ax" onclick="fcObj.open_user_info();"><ax:lang code="axboot.admin.login.status.message" arguments="${loginUser.userNm}"/></a>
                    </div>
                    <div class="panel-split"></div>
                    <div class="ax-split-panel">

                        <a href="#ax" class="ax-frame-logout" onclick="location.href = '${pageContext.request.contextPath}/api/logout';">
                            <i class="cqc-log-out"></i>
                            <ax:lang code="axboot.admin.logout"/>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="ax-frame-header">
        <div class="ax-split-col" style="height: 100%;">
            <c:if test="${config.layout.leftSideMenu eq 'visible'}">
                <div class="ax-split-panel cell-aside-handle" id="ax-aside-handel">
                    <i class="cqc-menu"></i>
                </div>
            </c:if>
            <c:if test="${config.layout.leftSideMenu ne 'visible'}">
                <div class="ax-split-panel">&nbsp;</div>
            </c:if>
            <div class="ax-split-panel cell-logo">
                <a href="${pageContext.request.contextPath}/jsp/main.jsp">
                    <img src="${pageContext.request.contextPath}${config.logo.header}" width="100%"/>
                </a>
            </div>
            <div id="ax-top-menu" class="ax-split-panel ax-split-flex"></div>
            <div class="ax-split-panel cell-aside-handle" id="ax-fullscreen-handel">
                <i class="cqc-expand icon-closed"></i>
                <i class="cqc-collapse icon-opened"></i>
            </div>
        </div>
    </div>

    <div class="ax-frame-header-tab">
        <div id="ax-frame-header-tab-container"></div>
    </div>

    <c:if test="${config.layout.leftSideMenu eq 'visible'}">
        <div class="ax-frame-aside" id="ax-frame-aside"></div>
        <script type="text/html" data-tmpl="ax-frame-aside">
            <div class="ax-frame-aside-menu-holder">
                <div style="height: 10px;"></div>
                {{#items}}
                <a class="aside-menu-item aside-menu-item-label{{#hasChildren}} {{#open}}opend{{/open}}{{/hasChildren}}" data-label-index="{{@i}}">{{{name}}}</a>
                {{#hasChildren}}
                <div class="aside-menu-item aside-menu-item-tree-body {{#open}}opend{{/open}}" data-tree-body-index="{{@i}}">
                    <div class="tree-holder ztree" id="aside-menu-{{@i}}" data-tree-holder-index="{{@i}}"></div>
                </div>
                {{/hasChildren}}
                {{/items}}
            </div>
        </script>
    </c:if>

    <div class="ax-frame-foot">
        <div class="ax-split-col" style="height: 100%;">
            <div class="ax-split-panel text-align-left"> ${config.copyrights} </div>
            <div class="ax-split-panel text-align-right">
                Last account activity <b id="account-activity-timer">00</b> ago.
            </div>
        </div>
    </div>

</div>
<jsp:invoke fragment="script"/>
</body>
</html>