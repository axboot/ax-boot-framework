<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" />
        <script type="text/javascript" src="<c:url value='/assets/js/view/_samples/basic.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                        <ax:td label='ax.admin.sample.search.condition1' width="300px">
                            <input type="text" class="form-control" />
                        </ax:td>
                        <ax:td label='ax.admin.sample.search.condition2' width="300px">
                            <input type="text" class="form-control" />
                        </ax:td>
                        <ax:td label='ax.admin.sample.search.condition3' width="300px">
                            <input type="text" class="form-control" />
                        </ax:td>
                    </ax:tr>
                    <ax:tr>
                        <ax:td label='ax.admin.sample.search.condition1' width="300px">
                            <input type="text" class="form-control" />
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="">

                <!-- 목록 -->
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>
                            <ax:lang id="ax.admin.sample.grid.title"/> </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="add"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.add"/></button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="delete"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.delete"/></button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>