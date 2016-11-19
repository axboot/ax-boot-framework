<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%

%>
<ax:set key="pageName" value="File Browser"/>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="baseStyle"/>

<ax:layout name="modal">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" />
        <script type="text/javascript" src="<c:url value='/assets/js/view/_samples/modal.js' />"></script>
    </jsp:attribute>
    <jsp:attribute name="header">
        <h1 class="title">
            <i class="cqc-browser"></i>
            <ax:lang id="ax.admin.sample.modal.title"/>
        </h1>
    </jsp:attribute>
    <jsp:body>
        <ax:page-buttons>
            <button type="button" class="btn btn-default" data-page-btn="close"><ax:lang id="ax.admin.sample.modal.button.close"/></button>
            <button type="button" class="btn btn-info" data-page-btn="search"><ax:lang id="ax.admin.sample.modal.button.search"/></button>
            <button type="button" class="btn btn-fn1" data-page-btn="choice"><ax:lang id="ax.admin.sample.modal.button.choice"/></button>
        </ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                        <ax:td label='ax.admin.sample.search.condition' width="300px">
                            <input type="text" class="form-control"/>
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="padding-right: 0px;">

                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>
                            List </h2>
                    </div>
                    <div class="right">

                    </div>
                </div>

                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>