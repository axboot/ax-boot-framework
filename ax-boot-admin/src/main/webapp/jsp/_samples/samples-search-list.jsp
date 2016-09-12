<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="샘플:그리드 (고급)"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>
    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button">

                </ax:custom>

                <div id="page-header">
                    <form id="page-search-view">
                        <div class="ax-sbar">
                            <span class="sitem W320">
                                <span class="slabel">접수일자</span>
                                <input type="text" id="singleDate" class="AXInput W100" value=""/>

                                <label>
                                    <input type="radio" name="dateType" data-ax-id="dateType" value="M"> 접수일자
                                </label>
                                <label>
                                    <input type="radio" name="dateType" data-ax-id="dateType" value="F"> 마감일자
                                </label>

                            </span>
                        </div>
                        <div class="ax-sbar">

                            <span class="sitem W320">
                                <!-- W10 ~ W1000 까지 10단위로 입력가능 -->
                                <!-- 아이템의 라벨을 포함한 너비 입니다 -->
                                <span class="slabel">기간</span>
                                <input type="text" id="startDate" class="AXInput W80" value=""/>
                                ~
                                <input type="text" id="endDate" class="AXInput W100" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">
                                    국가선택
                                </span>
                                <label>
                                    <input type="checkbox" name="country" data-ax-id="country" value="KOR"> 한국
                                </label>
                                <label>
                                    <input type="checkbox" name="country" data-ax-id="country" value="USA"> 미국
                                </label>
                                <label>
                                    <input type="checkbox" name="country" data-ax-id="country" value="CHINA"> 중국
                                </label>
                                <label>
                                    <input type="checkbox" name="country" data-ax-id="country" value="방글라데시"> 방글라데시
                                </label>
                            </span>
                        </div>

                        <div class="ax-sbar">
                            <span class="sitem W320">
                                <span class="slabel">접수년월</span>
                                <input type="text" id="singleYM" class="AXInput W100" value=""/>
                            </span>
                            <span class="sitem W320">
                                <span class="slabel">년월기간</span>
                                <input type="text" id="startYM" class="AXInput W80" value=""/>
                                ~
                                <input type="text" id="endYM" class="AXInput W100" value=""/>
                            </span>
                        </div>

                        <div class="ax-sbar">
                            <span class="sitem W320">
                                <span class="slabel">소속부서</span>
                                <select class="AXSelect" id="group"></select>
                            </span>
                            <span class="sitem">
                                <span class="slabel">분류</span>
                                <select class="AXSelect" id="category1"></select>
                                <select class="AXSelect" id="category2"></select>
                                <select class="AXSelect" id="category3"></select>
                            </span>
                        </div>

                        <div class="ax-sbar">
                            <span class="sitem W320">
                                <span class="slabel">국가코드</span>
                                <input type="text" id="countryCD" class="AXInput W50" readonly="readonly" value=""/>
                                <button class="AXButton" id="countryFinder"><i class="axi axi-search3"></i></button>
                                <input type="text" id="countryNM" class="AXInput W120" value=""/>
                            </span>
                        </div>

                    </form>

                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="axi axi-list-alt"></i> 정보리스트</h2>
                        </div>
                        <div class="right">
                            <button type="button" class="AXButton" id="ax-grid0-btn-add"><i class="axi axi-plus-circle"></i> 추가</button>
                            <button type="button" class="AXButton" id="ax-grid0-btn-del"><i class="axi axi-minus-circle"></i> 삭제</button>
                        </div>
                        <div class="ax-clear"></div>
                    </div>
                </div>

                <div id="page-grid-view0" style="position:relative;height:300px;"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript" src="js/sample-search-list.js"></script>
    </ax:div>
</ax:layout>