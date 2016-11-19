<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="system-operation-log-version" value="1.0.0"/>
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
        <ax:script-lang key="ax.script" />
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-operation-log.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <ax:split-layout name="ax1" orientation="horizontal">
            <ax:split-panel height="*" style="padding-bottom: 5px;">
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">

                    <ax:tbl clazz="ax-search-box" style="width:300px;margin-bottom: 7px;">
                        <ax:form name="searchView0">
                            <div class="input-group">
                                <input type="text" name="filter" id="filter" class="form-control" value="" placeholder="검색어를 입력하세요."/>
                                <span class="input-group-btn">
                                    <button class="btn btn-primary">확인</button>
                                </span>
                            </div>
                        </ax:form>
                    </ax:tbl>

                    <div class="right">
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="remove"><i class="cqc-circle-with-minus"></i> 삭제</button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="removeAll"><i class="cqc-circle-with-minus"></i> 전체삭제</button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel height="*" style="padding-top: 10px;" scroll="scroll">

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