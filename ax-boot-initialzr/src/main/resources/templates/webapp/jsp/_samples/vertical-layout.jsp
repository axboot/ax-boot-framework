<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="js">
    <script src="/assets/plugins/prettify/prettify.js"></script>
    <script src="/assets/plugins/prettify/lang-css.js"></script>
    </jsp:attribute>
    <jsp:attribute name="css">
        <link rel="stylesheet" type="text/css" href="/assets/plugins/prettify/skins/github.css"/>
    </jsp:attribute>
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='/assets/js/view/_samples/page-structure.js' />"></script>
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
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>


        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="padding-right: 10px;">

                <div class="ax-button-group" data-fit-height-aside="left-view-01">
                    <div class="left">
                        <h2>
                            <i class="cqc-list"></i>
                            <ax:lang id="ax.admin.sample.layout.leftpanel"/> </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-left-view-01-btn="add"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.add"/></button>
                    </div>
                </div>

                <div data-fit-height-content="left-view-01" style="height: 300px;border: 1px solid #D8D8D8;background: #fff;">

<pre>
// ax:split-panel 안에 들어가는 컨텐츠를 딱맞게 집어넣기 위한 소스코드 입니다.
&lt;div data-fit-height-aside="left-view-01">&lt;/div>
&lt;div data-fit-height-content="left-view-01">&lt;/div>
&lt;div data-fit-height-aside="left-view-01">&lt;/div>
// [data-fit-height-aside] [data-dit-height-content] 는 속성의 같은 엘리먼트간에 유기적으로 작동합니다
// 엘리먼트들이 속한 부모 엘리먼트의 높이에서. aside항목의 높이들은 뺀 나머지를 content항목으로 계산하여 style.height를 자동으로 결정합니다.
// data-fit-height 속성은 ax5layout 안에 있는 항목에 대해서만 작동 하고 해당 기능의 이벤트는 axboot.init에서 초기화 되어 있습니다.
</pre>

                </div>

                <div class="ax-button-group ax-button-group-bottom" data-fit-height-aside="left-view-01">
                    <div class="left">
                        <button type="button" class="btn btn-default" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN0</button>
                        <button type="button" class="btn btn-primary" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN1</button>
                        <button type="button" class="btn btn-info" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN2</button>
                        <button type="button" class="btn btn-success" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN3</button>
                        <button type="button" class="btn btn-warning" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN3</button>
                        <button type="button" class="btn btn-danger" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN3</button>
                    </div>
                </div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel width="*" style="padding-left: 10px;">

                <div class="ax-button-group" data-fit-height-aside="right-view-01">
                    <div class="left">
                        <h2>
                            <i class="cqc-list"></i>
                            <ax:lang id="ax.admin.sample.layout.rightpanel"/> </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-right-view-01-btn="add"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.add"/></button>
                    </div>
                </div>

                <div data-fit-height-content="right-view-01" style="height: 300px;border: 1px solid #D8D8D8;background: #fff;">

<pre>
&lt;div data-fit-height-aside="right-view-01">&lt;/div>
&lt;div data-fit-height-content="right-view-01">&lt;/div>
&lt;div data-fit-height-aside="right-view-01">&lt;/div>
</pre>

                </div>

                <div class="ax-button-group ax-button-group-bottom" data-fit-height-aside="right-view-01">
                    <div class="right">
                        <button type="button" class="btn btn-default" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN0</button>
                        <button type="button" class="btn btn-primary" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN1</button>
                        <button type="button" class="btn btn-info" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN2</button>
                        <button type="button" class="btn btn-success" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN3</button>
                        <button type="button" class="btn btn-warning" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN3</button>
                        <button type="button" class="btn btn-danger" data-left-view-01-btn="add"><ax:lang id="ax.admin.button"/> FN3</button>
                    </div>
                </div>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>