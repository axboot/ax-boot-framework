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
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=1024, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>AXBOOT :: ${title}</title>

    <link rel="shortcut icon" href="<c:url value='/static/ui/axisj-black.ico'/>" type="image/x-icon"/>
    <link rel="icon" href="<c:url value='/static/ui/axisj-black.ico'/>" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/static/plugins/axicon/axicon.min.css' />"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/static/ui/axisj/axisj-theme-axboot/axisj.min.css'/>" id="axu-theme-axisj"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/static/css/app.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/static/css/custom.css' /> "/>
    <ax:write divname="css"/>
    <script type="text/javascript">
        var CONTEXT_PATH = "<%=ContextUtil.getContext()%>";
        var topMenu_data = <%=menuJson%>;
        var pageInfo = {
            id: '${PAGE_ID}',
            searchAuth: '${SEARCH_AUTH}',
            saveAuth: '${SAVE_AUTH}',
            excelAuth: '${EXCEL_AUTH}',
            function1Auth: '${FUNCTION_1_AUTH}',
            function2Auth: '${FUNCTION_2_AUTH}',
            function3Auth: '${FUNCTION_3_AUTH}',
            function4Auth: '${FUNCTION_4_AUTH}',
            function5Auth: '${FUNCTION_5_AUTH}'
        };
    </script>
    <script type="text/javascript" src="<c:url value='/static/plugins/jquery/jquery.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/static/plugins/axisj/dist/AXJ.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/static/plugins/jquery.easy-pie-chart/dist/jquery.easypiechart.js' />"></script>
    <script type="text/javascript" src="<c:url value='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/static/plugins/mustache/mustache.min.js' />"></script>

    <script type="text/javascript" src="<c:url value='/static/plugins/AXBinder/dist/AXBinder.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/static/plugins/axboot.js/dist/axboot.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/static/js/common/ax5-polyfill.js' />"></script>

    <script type="text/javascript" src="<c:url value='/static/js/data/data.js' />"></script>
    <script type="text/javascript" src="<c:url value='/static/js/common/base.js' />"></script>
    <script type="text/javascript" src="<c:url value='/static/js/common/app.js' />"></script>

    <ax:write divname="js"/>
</head>
<body>
<div id="AXPage">
    <div class="ax-body">
        <div class="ax-wrap">

            <div class="ax-layer ax-title">
                <div class="ax-col-12 ax-content expand">
                    <ax:write divname="header">
                        <h1 id="cx-page-title"><i class="axi axi-web"></i> ${title}</h1>

                        <p class="desc">${page_desc}</p>
                    </ax:write>
                </div>
                <div class="ax-clear"></div>
            </div>

            <div class="ax-layer cx-content-layer">
                <div class="ax-col-12 ax-content expand">
                    <div id="CXPage">
                        <ax:write divname="contents"/>
                    </div>
                </div>
                <div class="ax-clear"></div>
            </div>

        </div>
    </div>
</div>
<ax:write divname="scripts"/>
</body>
</html>
