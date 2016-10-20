<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    RequestUtils requestUtils = RequestUtils.of(request);

    String manualGrpCd = requestUtils.getString("manualGrpCd");
    request.setAttribute("manualGrpCd", manualGrpCd);

    String manualKey = requestUtils.getString("manualKey");
    request.setAttribute("manualKey", manualKey);
%>

<ax:set key="system-help-manual-version" value="1.0.0"/>
<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="manualView"/>

<ax:layout name="modal">
    <jsp:attribute name="css">

    </jsp:attribute>
    <jsp:attribute name="js">
        <script type="text/javascript">
            var menuId = "7";
            var manualKey = "${manualKey}";
            var manualGrpCd = "${manualGrpCd}";
        </script>
        <script src="/assets/plugins/ckeditor/ckeditor.js"></script>
    </jsp:attribute>
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-help-manual-view.js' />"></script>
    </jsp:attribute>
    <jsp:body>


        <div role="page-header">
            <nav class="navbar navbar-default">
                <span class="navbar-brand navbar-menu-handle" data-manual-menu-handle="">
                    <button class="btn btn-default"><i class="cqc-menu"></i></button>
                </span>
                <b class="navbar-brand" href="#">${manualGrpCd} 매뉴얼</b>
            </nav>
        </div>

        <div role="page-content">

            <div class="content-aside">
                <div data-z-tree="tree-view-01" data-fit-height-content="tree-view-01" style="height: 300px;" class="ztree"></div>
            </div>
            <div class="content-body">
                <div data-fit-height-content="form-view-01" data-manual-content="view" style="background: #fff;border:1px solid #ccc;overflow: auto;padding: 10px;"></div>
                <script type="text/html" data-manual-content="tmpl">
                    {{{content}}}
                </script>
            </div>

        </div>

    </jsp:body>
</ax:layout>