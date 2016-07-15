<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="empty.jsp">
    <ax:set name="title" value="패턴 바인딩 및 유효성 검사"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>
    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button">

                </ax:custom>

                <div id="page-header">
                    <form name="page-search-view" id="page-search-view">
                        <div class="ax-sbar">
                            <span class="sitem">
                                <!-- W10 ~ W1000 까지 10단위로 입력가능 -->
                                <!-- 아이템의 라벨을 포함한 너비 입니다 -->
                                <span class="slabel">날짜(년도)</span>
                                <input type="text" name="y1" id="yyyy" class="AXInput W80 av-required" required value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">날짜(년월)</span>
                                <input type="text" name="y2" id="yyyymm" class="AXInput W80 av-isdate" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">날짜(년월일)</span>
                                <input type="text" name="y3" id="yyyymmdd" class="AXInput W80 av-required av-isdate" value=""/>
                            </span>
                        </div>
                        <div class="ax-sbar">
                            <span class="sitem">
                                <span class="slabel">기간</span>
                                <input type="text" id="startdd" class="AXInput W80" value=""/> ~
                                <input type="text" id="enddd" class="AXInput W80" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">기간</span>
                                <input type="text" id="startmm" class="AXInput W80" value=""/> ~
                                <input type="text" id="endmm" class="AXInput W80" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">기간</span>
                                <input type="text" id="startyy" class="AXInput W80" value=""/>
                                <input type="text" id="endyy" class="AXInput W80" value=""/>
                            </span>
                        </div>
                        <div class="ax-sbar">
                            <span class="sitem">
                                <span class="slabel">기간</span>
                                <input type="text" id="startdd2" class="AXInput W80" value=""/> ~
                                <input type="text" id="enddd2" class="AXInput W80" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">기간</span>
                                <input type="text" id="startmm2" class="AXInput W80" value=""/> ~
                                <input type="text" id="endmm2" class="AXInput W80" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">기간</span>
                                <input type="text" id="startyy2" class="AXInput W80" value=""/>
                                <input type="text" id="endyy2" class="AXInput W80" value=""/>
                            </span>
                        </div>
                        <div class="ax-sbar">
                            <span class="sitem">
                                <span class="slabel">숫자</span>
                                <input type="text" id="number" class="AXInput W80 av-number" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">숫자</span>
                                <input type="text" id="number2" class="AXInput W80" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">전화번호</span>
                                <input type="text" id="phone" class="AXInput W80" value=""/>
                            </span>
                        </div>
                        <div class="ax-sbar">
                            <span class="sitem">
                                <span class="slabel">통화</span>
                                <input type="text" id="money" class="AXInput W80" value=""/>
                            </span>
                            <span class="sitem">
                                <span class="slabel">통화2</span>
                                <input type="text" id="money2" class="AXInput W80" value=""/>
                            </span>
                        </div>
                        <div class="ax-sbar">
                            <span class="sitem">
                                <button type="button" class="AXButton" id="btnDisabled"><i class="axi axi-lock-outline"></i> Disabled</button>
                                <button type="button" class="AXButton" id="btnDisabled2"><i class="axi axi-lock-outline"></i> Disabled2</button>
                            </span>
                        </div>
                    </form>
                </div>

                <div class="ax-layout-split"></div>
            </ax:col>
        </ax:row>
        <div class="H10"></div>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript" src="js/sample-bind-pattern.js"></script>
    </ax:div>
</ax:layout>