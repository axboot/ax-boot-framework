<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%
    /*
    PageContextVO pageContextVO = SessionUtils.getPageContext(request);
    String menuJson = JsonUtils.toJson(SessionUtils.getUserMenuContext(request).getMenu());

    if (!pageContextVO.isAuthorized()) {
        //response.sendRedirect("/jsp/common/not-authorized.jsp");
    }
    */
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport"
          content="width=1024, user-scalable=yes, initial-scale=1, maximum-scale=1, minimum-scale=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>AXBOOT :: ${pageName}</title>

    <link rel="shortcut icon" href="<c:url value='/assets/favicon.ico'/>" type="image/x-icon"/>
    <link rel="icon" href="<c:url value='/assets/favicon.ico'/>" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/assets/css/axboot.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/assets/css/lang-kor.css'/>"/>
    <jsp:invoke fragment="css"/>

    <jsp:invoke fragment="js"/>
    <script type="text/javascript">
        var CONTEXT_PATH = "<%=ContextUtil.getContext()%>";
    </script>

    <script type="text/javascript" src="<c:url value='/assets/js/plugins.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/assets/js/axboot/dist/axboot.js' />"></script>
</head>
<body class="ax-body ${axbody_class}" data-page-auto-height="${page_auto_height}">
<div id="ax-base-root">
    <div class="ax-base-title" role="page-title">
        <jsp:invoke var="headerContent" fragment="header"/>
        <c:if test="${empty headerContent}">
            <h1 class="title"><i class="cqc-browser"></i> ${pageName}</h1>
            <p class="desc">${pageRemark}</p>
        </c:if>
        <c:if test="${!empty headerContent}">
            ${headerContent}
        </c:if>
    </div>
    <div class="ax-base-content">
        <jsp:doBody/>
    </div>
</div>
<jsp:invoke fragment="script"/>
</body>
</html>