<%@ page import="com.chequer.axboot.admin.utils.SessionUtils" %>
<%@ page import="com.chequer.axboot.admin.vo.PageContextVO" %>
<%@ page import="com.chequer.axboot.core.utils.ContextUtil" %>
<%@ page import="com.chequer.axboot.core.utils.JsonUtils" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
    PageContextVO pageContextVO = SessionUtils.getPageContext(request);
    String menuJson = JsonUtils.toJson(SessionUtils.getUserMenuContext(request).getMenu());

    if (!pageContextVO.isAuthorized()) {
        response.sendRedirect("/jsp/common/not-authorized.jsp");
    }
%>
<!DOCTYPE html>
<html>
<head>
<!-- META -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=1024, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- TITLE -->
<title>AXBOOT</title>
<link rel="shortcut icon" href="<c:url value='/static/ui/axisj-black.ico'/>" type="image/x-icon"/>
<link rel="icon" href="<c:url value='/static/ui/axisj-black.ico'/>" type="image/x-icon"/>
<link rel="stylesheet" type="text/css" href="<c:url value='/static/plugins/axicon/axicon.min.css' />"/>
<link rel="stylesheet" type="text/css" href="<c:url value='/static/ui/axisj/axisj-theme-axboot/axisj.min.css'/>" id="axu-theme-axisj"/>
<link rel="stylesheet" type="text/css" href="<c:url value='/static/css/app.css'/>"/>
<link rel="stylesheet" type="text/css" href="<c:url value='/static/css/custom.css' /> "/>
<ax:write divname="css" />
<script type="text/javascript">
var CONTEXT_PATH = "<%=ContextUtil.getContext()%>";
var topMenu_data = <%=menuJson%>;
var pageInfo = {};
</script>
<script type="text/javascript" src="<c:url value='/static/plugins/jquery/jquery.min.js' />"></script>
<script type="text/javascript" src="<c:url value='/static/plugins/axisj/dist/AXJ.min.js' />"></script>
<script type="text/javascript" src="<c:url value='/static/js/common/ax5-polyfill.js' />"></script>
<script type="text/javascript" src="<c:url value='/static/js/common/base-frame.js?v=${version}' />"></script>
<script type="text/javascript" src="<c:url value='/static/js/common/app.js' />"></script>
</head>
<body onselectstart="return false;">
<div id="AXPage" style="min-width: 900px;">
    <ax:write divname="ax-header">
        <div class="ax-header">

            <div class="ax-header">
                <div class="ax-logo">
                    <a href="${pageContext.request.contextPath}/jsp/main.jsp">
                        <img src="${pageContext.request.contextPath}/static/ui/axboot/images/logo.png" width="100%"/>
                    </a>
                </div>
                <!-- 상단 top-down-menu 표시 영역 : s-->
                <div id="ax-top-menu" class="ax-top-menu AXMenuBox"></div>
                <!-- e : 상단 top-down-menu 표시 영역 -->

                <ul class="ax-loginfo" id="ax-loginfo">
                    <li class="profile">
                        <div class="photo"
                             style="background: url('${pageContext.request.contextPath}/static/ui/axboot/images/profile.png') no-repeat 50%;background-size:cover;"></div>
                    </li>
                    <li class="account">
                        <a href="#ax" onclick="fcObj.open_user_info();">${LOGIN_USER_NAME}</a>님 로그인
                    </li>
                    <li class="btns">
                        <a href="#ax" class="AXButton Blue" onclick="location.href = '${pageContext.request.contextPath}/api/logout';">
                            <i class="axi axi-power-off"></i> 로그아웃
                        </a>
                    </li>
                </ul>
                <div class="mx-loginfo"><a id="mx-loginfo-handle" class="mx-menu-button"><i class="axi axi-bars"></i></a></div>

                <div class="ax-heder-bottom-line"></div>
            </div>
        </div>
        <div class="ax-header-tab">
            <div class="tab-container" id="header-tab-container"></div>
        </div>
        <div class="ax-header-height"></div>
    </ax:write>
    <!-- e ax-header -->

    <ax:write divname="contents" />
    <!-- e ax-body -->


    <div class="ax-aside" style="display:none;">
        <div class="ax-layer ax-aside-menu-box">
            <a class="ax-aside-menu">
                <i class="axi axi-fast-forward fa-lg"></i><i class="axi axi-rewind fa-lg"></i>
            </a>
        </div>
        <div class="ax-layer ax-aside-box">
            <div class="ax-unit">
                <div class="ax-box">
                    <ul class="ax-aside-ul" id="ax-aside-ul"></ul>
                </div>

                <div class="H10"></div>

            </div>
        </div>
    </div>

</div>
<!-- @@@@@@@@@@@@@@@@@@@@@@ scripts begin @@@@@@@@@@@@@@@@@@@@@@ -->
<ax:write divname="scripts" />
<!-- @@@@@@@@@@@@@@@@@@@@@@ scripts end   @@@@@@@@@@@@@@@@@@@@@@ -->
</body>
</html>
