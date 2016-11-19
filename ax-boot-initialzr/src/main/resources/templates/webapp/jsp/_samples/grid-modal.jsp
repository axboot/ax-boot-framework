<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" />
        <script type="text/javascript" src="<c:url value='/assets/js/view/_samples/grid-modal.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>


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
            <ax:split-panel width="400" style="padding-right: 10px;">

                <!-- 목록 -->
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>
                            <ax:lang id="ax.admin.sample.parent.list"/> </h2>
                    </div>
                    <div class="right">

                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel width="*" style="padding-left: 10px;" scroll="scroll">

                <!-- 폼 -->
                <div class="ax-button-group" role="panel-header">
                    <div class="left">
                        <h2><i class="cqc-news"></i>
                            <ax:lang id="ax.admin.sample.parent.information"/>
                        </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-form-view-01-btn="form-clear">
                            <i class="cqc-erase"></i>
                            <ax:lang id="ax.admin.clear"/>
                        </button>
                    </div>
                </div>

                <ax:form name="formView01">
                    <ax:tbl clazz="ax-form-tbl" minWidth="500px">
                        <ax:tr>
                            <ax:td label="ax.admin.sample.form.key" width="300px">
                                <input type="text" data-ax-path="key" title="Key" class="form-control" data-ax-validate="required"/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="ax.admin.sample.form.value" width="300px">
                                <input type="text" data-ax-path="value" class="form-control"/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="ax.admin.sample.form.address" width="100%">
                                <input type="text" data-ax-path="etc1" class="form-control inline-block W100" readonly="readonly"/>
                                <button class="btn btn-default" data-form-view-01-btn="etc1find"><i class="cqc-magnifier"></i> <ax:lang id="ax.admin.sample.form.find"/></button>
                                <div class="H5"></div>
                                <input type="text" data-ax-path="etc2" class="form-control"/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="ax.admin.sample.form.code" width="100%">
                                <input type="text" data-ax-path="etc3" class="form-control inline-block W60" readonly="readonly" />
                                <input type="text" data-ax-path="etc4" class="form-control inline-block W150"/>
                                <button class="btn btn-default" data-form-view-01-btn="etc3find"><i class="cqc-magnifier"></i> <ax:lang id="ax.admin.sample.form.show.code.list"/></button>
                            </ax:td>
                        </ax:tr>
                    </ax:tbl>

                </ax:form>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>