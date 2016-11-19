<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    RequestUtils requestUtils = RequestUtils.of(request);
    request.setAttribute("GROUP_CD", requestUtils.getString("GROUP_CD"));
    request.setAttribute("GROUP_NM", requestUtils.getString("GROUP_NM"));
%>
<ax:set key="pageName" value="프린터 그룹설정"/>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="baseStyle"/>

<ax:layout name="modal">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" />
        <script>
            var GROUP_CD = "${GROUP_CD}";
            var GROUP_NM = "${GROUP_NM}";
        </script>
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-config-common-code-modal.js' />"></script>
    </jsp:attribute>
    <jsp:attribute name="header">
        <h2 class="title">
            <i class="cqc-list"></i>
            ${GROUP_NM}
        </h2>
    </jsp:attribute>
    <jsp:body>
        <ax:page-buttons>
            <button type="button" class="btn btn-default" data-page-btn="add">추가</button>
            <button type="button" class="btn btn-default" data-page-btn="del">삭제</button>

            <button type="button" class="btn btn-default" data-page-btn="close">창닫기</button>
            <button type="button" class="btn btn-fn1" data-page-btn="save">완료</button>
        </ax:page-buttons>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="">

                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>