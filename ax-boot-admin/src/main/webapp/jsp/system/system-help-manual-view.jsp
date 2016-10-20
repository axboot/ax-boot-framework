<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    RequestUtils requestUtils = RequestUtils.of(request);

    String manualGrpCd = requestUtils.getString("manualGrpCd");
    request.setAttribute("manualGrpCd", manualGrpCd);
%>

<ax:set key="system-help-manual-version" value="1.0.0"/>
<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
<ax:set key="page_auto_height" value="false"/>
<ax:set key="axbody_class" value="manualView"/>

<ax:layout name="modal">
    <jsp:attribute name="css">

    </jsp:attribute>
    <jsp:attribute name="js">
        <script type="text/javascript">
            var menuId = "7";
            var manualGrpCd = "${manualGrpCd}";
        </script>
        <script src="/assets/plugins/ckeditor/ckeditor.js"></script>
    </jsp:attribute>
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-help-manual-view.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <div role="page-header" class="ax-base-title">
            <h1 class="title"><i class="cqc-browser"></i> 매뉴얼</h1>
            <p class="desc"></p>
        </div>

        <div role="page-content">

            <table class="manual-content-layout">
                <tbody>
                <tr>
                    <td class="content-aside">

                        <div data-z-tree="tree-view-01" data-fit-height-content="tree-view-01" style="height: 300px;" class="ztree"></div>

                    </td>
                    <td>

                        <div data-fit-height-content="form-view-01">
                            <textarea data-ax-path="content" id="editor1"></textarea>
                        </div>

                    </td>
                </tr>
                </tbody>
            </table>

        </div>

    </jsp:body>
</ax:layout>