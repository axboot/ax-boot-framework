<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="system-operation-log-version" value="1.0.0"/>
<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
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
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-operation-log.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                        <ax:td label='<lang data-id="검색"></lang>' width="300px">
                            <input type="text" name="filter" id="filter" class="form-control" value="" placeholder="검색어를 입력하세요."/>
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>


        <ax:split-layout name="ax1" oriental="horizontal">
            <ax:split-panel height="300" style="padding-bottom: 10px;">
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>
                            에러목록
                        </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="remove"><i class="cqc-circle-with-minus"></i> 삭제</button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="removeAll"><i class="cqc-circle-with-minus"></i> 전체삭제</button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel height="*" style="padding-top: 10px;padding-right: 5px;" scroll="scroll">

                <ax:form name="formView01">
                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="cqc-classic-computer"></i> Stack Trace</h2>
                        </div>
                    </div>

                    <div class="form-control for-prettify" style="height:auto;padding: 0;" data-ax-path="trace"></div>

                    <div class="ax-button-group">
                        <div class="left">
                            <h3><i class="cqc-info-with-circle"></i> 에러 메시지</h3>
                        </div>
                    </div>

                    <pre class="form-control for-prettify" style="height:auto;padding: 0;" data-ax-path="message"></pre>

                    <div class="ax-button-group">
                        <div class="left">
                            <h3><i class="cqc-info-with-circle"></i> Request 파라미터 정보</h3>
                        </div>
                    </div>

                    <pre class="form-control for-prettify" style="height:auto;padding: 0;" data-ax-path="parameterMap"></pre>

                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="cqc-info-with-circle"></i> Request 헤더 정보</h2>
                        </div>
                        <div class="right">
                            <!--<button type="button" class="AXButton" id="ax-form-btn-new"><i class="axi axi-plus-circle"></i> 신규</button>-->
                        </div>
                    </div>

                    <pre class="form-control for-prettify" style="height:auto;padding: 0;" data-ax-path="headerMap"></pre>

                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="cqc-info-with-circle"></i> Request 사용자 정보</h2>
                        </div>
                    </div>

                    <pre class="form-control for-prettify" style="height:auto;padding: 0;" data-ax-path="userInfo"></pre>

                </ax:form>


            </ax:split-panel>
        </ax:split-layout>




    </jsp:body>
</ax:layout>