<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="샘플:그리드 & 모달"/>
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
                                <span class="slabel">자동완성</span>
                                <input type="hidden" id="autoCompleteCode" />
                                <input type="text" id="autoComplete" class="AXInput W200" value=""/>
                            </span>
                        </div>
                    </form>
                </div>

                <div class="ax-layout-split"></div>

                <div class="ax-grid" id="page-tmpl-view0" style="min-height:300px;"></div>

                <div class="ax-layout-split"></div>

                <div class="ax-grid" id="page-tmpl-view1" style="min-height:300px;"></div>

                <script type="text/html" data-tmpl="report-tmpl">

                    <div>
                        <div style="float:left;line-height: 14px;">
                            [{{compNM_storNm}}] 조회기간 :
                            {{#_f_date}}{{saleStartDt}}{{/_f_date}}
                            ~
                            {{#_f_date}}{{saleEndDt}}{{/_f_date}}
                        </div>
                        <div style="float:right;line-height: 14px;">
                            출력일자 : {{toDayTime}}
                        </div>
                        <div class="ax-clear"></div>
                    </div>

                    <div style="text-align: center;">
                        <h1>마감 정산 보고서</h1>
                    </div>

                    <h6><i class="axi axi-caret-right"></i> 기간별 판매현황</h6>
                    <table class="AXFormTable">
                        <tbody>
                        <tr>
                            <th>총 판매금액</th>
                            <th>순 매출액(VAT포함)</th>
                            <th>순 매출액(VAT제외)</th>
                            <th>실 매출액</th>
                            <th>공급가액</th>
                            <th>부가세</th>
                        </tr>
                        {{#summary}}
                        <tr align="right">
                            <td>{{#_f_money}}{{totalAmt}}{{/_f_money}}</td>
                            <td class="blue">{{#_f_money}}{{amtCleanO}}{{/_f_money}}</td>
                            <td class="blue">{{#_f_money}}{{amtCleanX}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{saleTot}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{saleAmt}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{vatAmt}}{{/_f_money}}</td>
                        </tr>
                        {{/summary}}
                        </tbody>
                    </table>

                    <h6><i class="axi axi-caret-right"></i> 결제별 판매현황</h6>
                    <table class="AXFormTable">
                        <colgroup>
                            <col/>
                            <col width="60"/>

                            <col/>
                            <col width="60"/>

                            <col/>
                            <col width="60"/>

                            <col/>
                            <col width="60"/>

                            <col/>
                            <col width="60"/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <th colspan="2">총 판매금액 [건수]</th>
                            <th colspan="2">현금매출 [건수]</th>
                            <th colspan="2">카드매출 [건수]</th>
                            <th colspan="2">기타매출 [건수]</th>
                            <th colspan="2">할인금액 [건수]</th>
                        </tr>
                        {{#detailOfEachPayMethod}}
                        <tr align="right">
                            <td>{{#_f_money}}{{tranHeaderSum}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{tranHeaderCnt}}{{/_f_money}}</td>

                            <td>{{#_f_money}}{{tranCashSum}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{tranCashCnt}}{{/_f_money}}</td>

                            <td>{{#_f_money}}{{tranCardSum}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{tranCardCnt}}{{/_f_money}}</td>

                            <td>{{#_f_money}}{{tranEtcSum}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{tranEtcCnt}}{{/_f_money}}</td>

                            <td>{{#_f_money}}{{tranDcSum}}{{/_f_money}}</td>
                            <td>{{#_f_money}}{{tranDcCnt}}{{/_f_money}}</td>
                        </tr>
                        {{/detailOfEachPayMethod}}
                        </tbody>
                    </table>


                    <table style="table-layout: fixed;width:100%;">
                        <tr valign="top">
                            <td width="30%">

                                <h6><i class="axi axi-caret-right"></i> 신용카드 상세 판매현황</h6>
                                <table class="AXFormTable">
                                    <colgroup>
                                        <col width="60"/>
                                        <col width="60"/>
                                        <col/>
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th>매입사</th>
                                        <th>건수</th>
                                        <th>총 결제금액</th>
                                    </tr>
                                    {{#detailOfCreditCard}}
                                    <tr align="right">
                                        <td align="center">{{cardNm}}</td>
                                        <td>{{#_f_money}}{{cnt}}{{/_f_money}}</td>
                                        <td>{{#_f_money}}{{aproAmt}}{{/_f_money}}</td>
                                    </tr>
                                    {{/detailOfCreditCard}}
                                    <!--
                                    <tr align="right">
                                        <th align="center">합계</th>
                                        <th>건수</th>
                                        <th>금액</th>
                                    </tr>
                                    -->
                                    </tbody>
                                </table>
                                <!-- // 신용카드 상세 -->

                            </td>
                            <td style="padding-left: 10px;">

                                <h6><i class="axi axi-caret-right"></i> 외환판매 상세 현황</h6>
                                <table class="AXFormTable">
                                    <colgroup>
                                        <col width="60"/>
                                        <col width="60"/>
                                        <col/>
                                        <col/>
                                        <col/>
                                        <col/>
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th>외환명</th>
                                        <th>건수</th>
                                        <th>결제금액(외환)</th>
                                        <th>결제금액(환산)</th>
                                        <th>받음금액(외환)</th>
                                        <th>받음금액(환산)</th>
                                    </tr>
                                    {{#detailOfForeignCurrency}}
                                    <tr align="right">
                                        <td align="center">{{excNm}}</td>
                                        <td>{{#_f_money}}{{compCnt}}{{/_f_money}}</td>

                                        <td>{{#_f_money}}{{excEamt}}{{/_f_money}}</td>
                                        <td>{{#_f_money}}{{excWamt}}{{/_f_money}}</td>
                                        <td>{{#_f_money}}{{excInEamt}}{{/_f_money}}</td>
                                        <td>{{#_f_money}}{{excInWamt}}{{/_f_money}}</td>

                                    </tr>
                                    {{/detailOfForeignCurrency}}

                                    </tbody>
                                </table>
                                <!-- // 외환판매 상세 -->

                                <table style="table-layout: fixed;width:100%;">
                                    <tr valign="top">
                                        <td>

                                            <h6><i class="axi axi-caret-right"></i> 할인금액 상세 현황</h6>
                                            <table class="AXFormTable">
                                                <colgroup>
                                                    <col/>
                                                    <col width="60"/>

                                                    <col/>
                                                    <col width="60"/>
                                                </colgroup>
                                                <tbody>
                                                <tr>
                                                    <th colspan="2">할인유형 1 [건수]</th>
                                                    <th colspan="2">할인유형 2 [건수]</th>
                                                </tr>

                                                {{#detailOfDiscount}}
                                                <tr align="right">
                                                    <td>{{#_f_money}}{{rateDcSum}}{{/_f_money}}</td>
                                                    <td>{{#_f_money}}{{rateDcCnt}}{{/_f_money}}</td>

                                                    <td>{{#_f_money}}{{notRateDcSum}}{{/_f_money}}</td>
                                                    <td>{{#_f_money}}{{notRateDcCnt}}{{/_f_money}}</td>
                                                </tr>
                                                {{/detailOfDiscount}}
                                                </tbody>
                                            </table>
                                            <!-- // 할인금액 상세 -->

                                        </td>
                                        <td style="padding-left: 10px;">

                                            <h6><i class="axi axi-caret-right"></i> 거스름돈 발생 현황</h6>
                                            <table class="AXFormTable">
                                                <colgroup>
                                                    <col/>
                                                    <col/>
                                                </colgroup>
                                                <tbody>
                                                <tr>
                                                    <th>외환 거스름금액</th>
                                                    <th>기타결제 거스름금액</th>
                                                </tr>

                                                {{#detailOfChanges}}
                                                <tr align="right">
                                                    <td>{{#_f_money}}{{excRefundWamt}}{{/_f_money}}</td>
                                                    <td>{{#_f_money}}{{etcRefundamt}}{{/_f_money}}</td>
                                                </tr>
                                                {{/detailOfChanges}}

                                                </tbody>
                                            </table>
                                            <!-- // 거스름돈 발생 현황 -->

                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>


                    <table style="table-layout: fixed;width:100%;">
                        <tr valign="top">
                            <td style="width: 60%;">

                                <h6><i class="axi axi-caret-right"></i> 현금 시재 현황</h6>
                                <table class="AXFormTable">
                                    <colgroup>
                                        <col/>
                                        <col/>
                                        <col/>
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th>실 현금금액</th>
                                        <th>계산 현금금액</th>
                                        <th>과부족 금액</th>
                                    </tr>


                                    {{#detailOfTranCloseCash}}
                                    <tr align="right">
                                        <td>{{#_f_money}}{{closeCashAmt}}{{/_f_money}}</td>
                                        <td>{{#_f_money}}{{computeCashAmt}}{{/_f_money}}</td>
                                        <td>{{#_f_money}}{{excessAmt}}{{/_f_money}}</td>
                                    </tr>
                                    {{/detailOfTranCloseCash}}

                                    </tbody>
                                </table>
                                <!-- // 현금 시재 현황 -->

                            </td>
                            <td style="padding-left: 10px;">

                                <h6><i class="axi axi-caret-right"></i> 본사송금액</h6>
                                <table class="AXFormTable">
                                    <colgroup>
                                        <col/>
                                        <col/>
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th>환화 송금액(외화별도)</th>
                                        <th>환전 후 전체 송금액</th>
                                    </tr>

                                    {{#detailOfTranCloseCash}}
                                    <tr align="right">
                                        <td>{{#_f_money}}{{computeCashAmt}}{{/_f_money}}</td>
                                        <td>{{#_f_money}}{{__computeCashAmt}}{{/_f_money}}</td>
                                    </tr>
                                    {{/detailOfTranCloseCash}}

                                    </tbody>
                                </table>
                                <!-- // 본사송금액 -->

                            </td>
                        </tr>
                    </table>
                </script>

                <script type="text/html" data-tmpl="role-table">
                    <div style="width:100%;overflow: auto;">
                        <table class="AXGridTable" style="width: auto;">
                            <thead>
                            <tr>
                                <td>NO</td>
                                <td>Name</td>
                                <td>이름</td>
                                {{#timeset}}
                                <td>{{hour}}</td>
                                {{/timeset}}
                            </tr>
                            </thead>
                            <tbody>
                            {{#list}}
                            <tr>
                                <td align="center">{{@i}}</td>
                                <td>
                                    {{firstName}} {{lastName}}
                                </td>
                                <td>
                                    {{nameInKorea}}
                                </td>
                                {{#@printTime}}
                                {{#@val}}
                                <td align="center" style="background: #eecbcf;">
                                    {{label}}
                                </td>
                                {{/@val}}
                                {{^@val}}
                                <td align="center">&nbsp;</td>
                                {{/@val}}
                                {{/@printTime}}
                            </tr>
                            {{/list}}
                            </tbody>
                        </table>
                    </div>
                </script>

            </ax:col>
        </ax:row>
        <div class="H10"></div>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript" src="js/sample-tmpl.js"></script>
    </ax:div>
</ax:layout>