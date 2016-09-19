<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>AXBOOT :: ${title}</title>

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
<body class="ax-body ${axbody_class}" onselectstart="return false;">
<div id="AXPage" class="bodyHeightDiv page-modal">
    <div class="ax-modal-header">
        <div class="ax-col-12">
            <div class="ax-unit">
                <h1>${title}</h1>
            </div>
        </div>
        <div class="ax-clear"></div>
    </div>
    <div class="ax-modal-body">
        <div class="ax-wrap">
            <div class="ax-layer">
                <div class="ax-col-12">
                    <jsp:doBody/>
                </div>
                <div class="ax-clear"></div>
            </div>
        </div>
    </div>
    <div class="ax-modal-footer">
        <div class="ax-wrap">
            <div class="ax-col-12">
                <div class="ax-unit center">
                    <jsp:invoke fragment="buttons"/>
                </div>
            </div>
            <div class="ax-clear"></div>
        </div>
    </div>
    <div class="ax-box-underline"></div>
</div>
<jsp:invoke fragment="script"/>
</body>
</html>