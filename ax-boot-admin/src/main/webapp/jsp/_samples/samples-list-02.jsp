<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="샘플리스트(페이징)" />
    <ax:set name="page_desc" value="${PAGE_REMARK}" />
    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button">
                </ax:custom>

                <div id="page-header">
                    <form id="page-search-view">
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
                                <span class="slabel">라디오박스</span>
                                <label>
                                    <input type="radio" name="radioBox" data-ax-id="radioBox" value="M"> 남자
                                </label>
                                <label>
                                    <input type="radio" name="radioBox" data-ax-id="radioBox" value="F"> 여자
                                </label>
                            </span>
                        </div>
                        <div class="ax-sbar">
                            <span class="sitem W320">
                                <span class="slabel">텍스트</span>
                                <input type="text" id="searchParams" maxlength="10" title="검색어" class="AXInput W100" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">콤보박스</span>
                                <select class="AXSelect" id="comboBox">
                                    <option value="">전체</option>
                                    <option value="A">A형</option>
                                    <option value="B">B형</option>
                                </select>
                            </span>
                            <span class="sitem">
                                <span class="slabel W230">
                                    체크박스
                                    <small>(라벨이름이 아주 긴 경우 입니다.)</small>
                                </span>
                                <label>
                                    <input type="checkbox" name="checkBox" data-ax-id="checkBox" value="M"> 남자
                                </label>
                                <label>
                                    <input type="checkbox" name="checkBox" data-ax-id="checkBox" value="F"> 여자
                                </label>
                            </span>
                        </div>
                        <div class="ax-sbar">
                            <span class="sitem W320">
                                <span class="slabel">날짜</span>
                                <input type="text" id="singleDate" class="AXInput W100" value=""/>
                            </span>
                            <span class="sitem W320">
                                <span class="slabel">페이징갯수</span>
                                <input type="text" id="pageSize" class="AXInput W60" value=""/>
                            </span>
                        </div>
                    </form>

                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="axi axi-list-alt"></i> 정보리스트</h2>
                        </div>
                        <div class="right">
                            <!--
                            <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 추가</button>
                            <button type="button" class="AXButton" id="ax-grid-btn-del"><i class="axi axi-minus-circle"></i> 삭제</button>
                            -->
                        </div>
                        <div class="ax-clear"></div>
                    </div>
                </div>
                <div class="ax-grid" id="page-grid-view0" style="min-height:300px;"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript" src="js/sample-list-02.js"></script>
    </ax:div>
</ax:layout>