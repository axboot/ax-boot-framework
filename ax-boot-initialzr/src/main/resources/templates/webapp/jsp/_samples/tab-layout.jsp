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
        <script>
            $(function () {
                //$('[data-ax5layout]').ax5layout("reset");
                
                $('[data-left-view-01-btn]').on("click", function () {
                    //console.log(this.getAttribute("data-left-view-01-btn"));
                    $('[data-ax5layout="ax2"]').ax5layout("tabOpen", this.getAttribute("data-left-view-01-btn"));
                });
                
            });
        </script>
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

        <ax:split-layout name="ax1" orientation="horizontal">
            <ax:split-panel height="250" style="padding-bottom: 10px;">

                <div class="ax-button-group" data-fit-height-aside="left-view-01">
                    <div class="left">
                        <h2>
                            <i class="cqc-list"></i>
                            <ax:lang id="ax.admin.sample.layout.toppanel"/> </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-left-view-01-btn="add"><i class="cqc-circle-with-plus"></i> <ax:lang id="ax.admin.add"/></button>
                    </div>
                </div>

                <div data-fit-height-content="left-view-01" style="height: 300px;border: 1px solid #D8D8D8;background: #fff;">

<pre>
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
                        <button type="button" class="btn btn-default" data-left-view-01-btn="0"><ax:lang id="ax.admin.button"/> 기본정보</button>
                        <button type="button" class="btn btn-primary" data-left-view-01-btn="1"><ax:lang id="ax.admin.button"/> 일반정보</button>
                        <button type="button" class="btn btn-info" data-left-view-01-btn="2"><ax:lang id="ax.admin.button"/> 상세정보</button>
                        <button type="button" class="btn btn-success" data-left-view-01-btn="3"><ax:lang id="ax.admin.button"/> 기타정보</button>
                        <button type="button" class="btn btn-warning" data-left-view-01-btn="4"><ax:lang id="ax.admin.button"/> 이력조회</button>
                    </div>
                </div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel height="*" style="padding-top: 10px;">

                <ax:tab-layout name="ax2" data_fit_height_content="layout-view-01" style="height:100%;">
                    <ax:tab-panel label="ax.admin.sample.layout.tab.d1" scroll="scroll">
                        <p>
                            <ax:lang id="ax.admin.sample.layout.tab.d1"/>
                        </p>
                    </ax:tab-panel>
                    <ax:tab-panel label="ax.admin.sample.layout.tab.d2" scroll="scroll" active="true">

                        <div class="ax-button-group" data-fit-height-aside="right-view-01">
                            <div class="left">
                                <h2>
                                    <i class="cqc-list"></i>
                                    <ax:lang id="ax.admin.sample.layout.tabpanel"/> </h2>
                            </div>
                        </div>

                        <div data-fit-height-content="right-view-01" style="height: 300px;border: 1px solid #D8D8D8;background: #fff;">

<pre>
// 탭 레이아웃을 손쉽게 태그만으로 만들 수 있습니다.
// ax:tab-layout 태그를 만드세요. name을 반드시 부모 layout과 다르게 설정해야 하는 것을 잊지 마세요.
&lt;ax:tab-layout name="ax2" data_fit_height_content="layout-view-01" style="height:100%;">
    &lt;ax:tab-panel label="기본정보" scroll="scroll">
        &lt;p>
            기본정보
        &lt;/p>
    &lt;/ax:tab-panel>
    &lt;ax:tab-panel label="일반정보" scroll="scroll" active="true"> // active="true"인 패널이 활성화 패널이 됩니다.
        &lt;p>
            일반정보
        &lt;/p>
    &lt;/ax:tab-panel>
    &lt;ax:tab-panel label="상세정보" scroll="scroll">
        &lt;p>
            상세정보
        &lt;/p>
    &lt;/ax:tab-panel>
    &lt;ax:tab-panel label="기타정보" scroll="scroll">
        &lt;p>
            기타정보
        &lt;/p>
    &lt;/ax:tab-panel>
    &lt;ax:tab-panel label="이력조회" scroll="scroll">
        &lt;p>
            이력조회
        &lt;/p>
    &lt;/ax:tab-panel>
&lt;/ax:tab-layout>

</pre>
                        </div>

                    </ax:tab-panel>
                    <ax:tab-panel label="ax.admin.sample.layout.tab.d3" scroll="scroll">
                        <p>
                            <ax:lang id="ax.admin.sample.layout.tab.d3"/>
                        </p>
                    </ax:tab-panel>
                    <ax:tab-panel label="ax.admin.sample.layout.tab.d4" scroll="scroll">
                        <p>
                            <ax:lang id="ax.admin.sample.layout.tab.d4"/>
                        </p>
                    </ax:tab-panel>
                    <ax:tab-panel label="ax.admin.sample.layout.tab.d5" scroll="scroll">
                        <p>
                            <ax:lang id="ax.admin.sample.layout.tab.d5"/>
                        </p>
                    </ax:tab-panel>
                </ax:tab-layout>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>