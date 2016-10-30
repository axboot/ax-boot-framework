<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="false"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='/assets/js/view/_samples/ax5ui-sample.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                        <ax:td label='기간선택' width="400px">

                            <div class="input-group" data-ax5picker="search-saleDt">
                                <input type="text" class="form-control" placeholder="yyyy/mm/dd">
                                <span class="input-group-addon">~</span>
                                <input type="text" class="form-control" placeholder="yyyy/mm/dd">
                                <span class="input-group-addon"><i class="cqc-calendar"></i></span>
                            </div>

                        </ax:td>
                        <ax:td label='모달선택' width="450px">

                            <div class="form-inline">
                                <div class="form-group">
                                    <input type="text" class="form-control W60" value="" readonly="readonly"/>
                                    <input type="text" id="compStorLabel" class="form-control W100" value=""/>
                                    <button type="button" class="btn btn-primary" id="find_stor_modal" disabled="disabled">
                                        <i class="cqc-magnifier"></i>
                                        찾기
                                    </button>
                                </div>
                            </div>

                        </ax:td>
                    </ax:tr>
                    <ax:tr>
                        <ax:td label='날자' width="400px">

                            <div class="input-group" data-ax5picker="search-saleDt">
                                <input type="text" class="form-control" placeholder="yyyy/mm/dd">
                                <span class="input-group-addon"><i class="cqc-calendar"></i></span>
                            </div>

                        </ax:td>
                        <ax:td label='검색어' width="450px">

                            <div class="form-inline">
                                <div class="form-group">
                                    <label>영수번호</label>

                                    <input type="text" class="form-control W80" value="" />
                                </div>
                                <div class="form-group">
                                    <label>계약번호</label>
                                    <input type="text" class="form-control W80" value="" />
                                </div>
                            </div>

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
                            Parent List </h2>
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
                            Parent Info
                        </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-form-view-01-btn="form-clear">
                            <i class="cqc-erase"></i>
                            신규
                        </button>
                    </div>
                </div>

                <ax:form name="formView01">
                    <ax:tbl clazz="ax-form-tbl" minWidth="500px">
                        <ax:tr>
                            <ax:td label="키(KEY) *" width="300px">
                                <input type="text" data-ax-path="key" title="키(KEY)" class="form-control" data-ax-validate="required" />
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="값(VALUE)" width="300px">
                                <input type="text" data-ax-path="value" class="form-control" />
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="ETC1" width="300px">
                                <input type="text" data-ax-path="etc1" class="form-control" data-ax5formatter="money" />
                            </ax:td>
                            <ax:td label="ETC2" width="300px">
                                <select data-ax-path="etc2" class="form-control W100">
                                    <option value="ko_KR">대한민국</option>
                                    <option value="en_US">미국</option>
                                </select>
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="사용여부" width="300px">
                                <select data-ax-path="etc3" class="form-control W100">
                                    <option value="Y">사용</option>
                                    <option value="N">사용안함</option>
                                </select>
                            </ax:td>
                            <ax:td label="계정상태" width="220px">
                                <ax:common-code groupCd="USER_STATUS" dataPath="userStatus"/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="비고" width="100%">
                                <textarea data-ax-path="etc4" class="form-control"></textarea>
                            </ax:td>
                        </ax:tr>
                        <ax:tr>
                            <ax:td label="날짜선택" width="100%">
                                <div id="calendar-target"></div>
                            </ax:td>
                        </ax:tr>
                    </ax:tbl>

                </ax:form>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>