<%@ page contentType="text/html; charset=UTF-8"
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"
%>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j"
%>
<ax:layout name="base.jsp">
    <ax:div name="css">

    </ax:div>
    <ax:set name="title" value="${PAGE_NAME}"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>

    <ax:div name="contents">

        <!-- 반응형 테이블 -->
        <ax:row>
            <ax:col size="12" wrap="true">

                <h2>반응형 테이블 / 입력도구</h2>
                <ax:form name="table-form" method="get">
                    <ax:fields>
                        <ax:field label="번호" width="150px"> <!-- 필드의 너비를 정할 수 있습니다. -->
                            <input type="text" name="" id="ax-inp-number" class="AXInput W100"/>
                        </ax:field>
                        <ax:field label="통화단위" width="100px">
                            <input type="text" name="" id="ax-inp-money" class="AXInput"/>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="Switch" width="150px">
                            <input type="text" name="" id="ax-inp-switch" class="AXInput W50"/>
                        </ax:field>
                        <ax:field label="Segment">
                            <input type="text" name="" id="ax-inp-segment" class="AXInput"/>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="Slider">
                            <input type="text" name="" id="ax-inp-slider" class="AXInput W200"/>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="Selector" width="150px">
                            <input type="text" name="" id="ax-inp-selector" class="AXInput"/>
                        </ax:field>
                        <ax:field label="Select">
                            <select class="AXSelect" id="ax-select">
                                <option value="">-- 선택하세요 --</option>
                                <option value="1">%가나다라마바사</option>
                                <option value="2" selected="selected">abcdefg</option>
                                <option value="3">abcdefg 가나다라마바사</option>
                                <option value="4">abcdefg 가나다라마바사</option>
                                <option value="5">abcdefg 가나다라마바사</option>
                                <option value="6">abcdefg 가나다라마바사</option>
                            </select>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="Date">
                            <input type="text" name="" id="ax-inp-date" class="AXInput"/>
                        </ax:field>
                    </ax:fields>
                </ax:form>

                <div class="H10"></div>
                <!-- 높이 10px -->
                <a href="http://dev.axisj.com/samples/AXInput/index.html" target="_blank">http://dev.axisj.com/samples/AXInput/index.html</a>
                <div class="H10"></div>

            </ax:col>
        </ax:row>

        <!-- 버튼들 -->
        <ax:row>
            <ax:col size="12" wrap="true">
                <h2>버튼들</h2>

                <button class="AXButton">버튼</button>
                <button class="AXButton Red">버튼</button>
                <button class="AXButton Green">버튼</button>
                <button class="AXButton Blue">버튼</button>
                <button class="AXButton Classic">버튼</button>

                <button class="AXButton"><i class="axi axi-bmg-market"></i> 버튼</button>
                <button class="AXButtonLarge W100"><i class="axi axi-bmg-market"></i> 버튼</button>
                <button class="AXButtonSmall"><i class="axi axi-bmg-market"></i> 버튼</button>

                <div class="H10"></div>
                <a href="http://dev.axisj.com/samples/AXButton/index.html" target="_blank">http://dev.axisj.com/samples/AXButton/index.html</a>
                <div class="H10"></div>


            </ax:col>
        </ax:row>

        <!-- 모달오픈 -->
        <ax:row>
            <ax:col size="12" wrap="true">
                <h2>모달오픈</h2>

                <button class="AXButton" onclick="app.modal.open({url:'/jsp/_samples/samples-modal-02.jsp', pars:'pa1=1&pa2=2'});">모달창 열기</button>

                <button class="AXButton" onclick="app.modal.open({url:'/jsp/_samples/samples-modal-02.jsp', pars:'pa1=1&pa2=2', top:200, width:400});">모달창 열기 {top:200, width:400}</button>

                <div class="H10"></div>
                <a href="http://dev.axisj.com/samples/AXModal/index.html" target="_blank">http://dev.axisj.com/samples/AXModal/index.html</a>
                <div class="H10"></div>


            </ax:col>
        </ax:row>

        <!-- 그리드 -->
        <ax:row>
            <ax:col size="12" wrap="true">

                <h2>조합형</h2>
                <div id="ax-grid-target" style="height:300px;"></div>

            </ax:col>
        </ax:row>

        <!-- 좌우 분할 -->
        <ax:row>
            <ax:col size="12" wrap="true">
                <ax:custom customid="table">
                    <ax:custom customid="tr">
                        <ax:custom customid="td" style="width:300px">
                            <h2>왼쪽컬럼</h2>
                            <p>
                                style="width:300px;"
                            </p>

                        </ax:custom>
                        <ax:custom customid="td">
                            <div class="ax-button-group">
                                <div class="left">
                                    <h2>ax-button-group</h2>
                                </div>
                                <div class="right">
                                    <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 신규</button>
                                </div>
                                <div class="ax-clear"></div>
                            </div>
                            <table cellpadding="0" cellspacing="0" class="AXGridTable">
                                <colgroup>
                                    <col width="60"/>
                                    <col width="110"/>
                                    <col/>
                                </colgroup>
                                <thead>
                                <tr align="center">
                                    <td>
                                        <div class="tdRel">
                                            구분
                                        </div>
                                    </td>
                                    <td>
                                        <div class="tdRel">
                                            적용시간대
                                        </div>
                                    </td>
                                    <td>
                                        <div class="tdRel">
                                            전화번호
                                        </div>
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td align="center" rowspan="3" class="gray">
                                        협력사
                                    </td>
                                    <td align="center" class="red">
                                        평일 영업시간<br/>
                                        (9시 ~ 18시)
                                    </td>
                                    <td align="center" rowspan="3" class="green">
                                        1234-1234
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" class="yellow">
                                        평일 영업시간 외
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        주말 / 공휴일
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" rowspan="3" class="blue">
                                        아워홈
                                    </td>
                                    <td align="center">
                                        평일 영업시간<br/>
                                        (9시 ~ 18시)
                                    </td>
                                    <td align="center" rowspan="3">
                                        운영 시스템 : 액시스제이 장기영 팀장 <br/>
                                        02-0000-0000 / 010-0000-0000
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        평일 영업시간 외
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        주말 / 공휴일
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </ax:custom>
                    </ax:custom>
                </ax:custom>
            </ax:col>
        </ax:row>

        <!-- search & sbar -->
        <ax:row>
            <ax:col size="12" wrap="true">
                <ax:custom customid="table">
                    <ax:custom customid="tr">
                        <ax:custom customid="td" style="width: 200px;">
                            <h1>검색바</h1>
                        </ax:custom>
                        <ax:custom customid="td">
                            <form id="page-search-box">
                                <div class="ax-sbar">
                                    <span class="sitem">
                                        <span class="slabel">브랜드분류</span>
                                        <select class="AXSelect" id="ax-select1">
                                            <option value="1" selected="selected">ALL</option>
                                            <option value="2">SOME??</option>
                                        </select>
                                    </span>
                                    <span class="sitem">
                                        <span class="slabel">대분류</span>
                                        <select class="AXSelect" id="ax-select2">
                                            <option value="1" selected="selected">ALL</option>
                                            <option value="2">SOME??</option>
                                        </select>
                                    </span>
                                    <span class="sitem">
                                        <span class="slabel">중분류</span>
                                        <select class="AXSelect" id="ax-select3">
                                            <option value="1" selected="selected">ALL</option>
                                            <option value="2">SOME??</option>
                                        </select>
                                    </span>
                                    <span class="sitem">
                                        <span class="slabel">소분류</span>
                                        <select class="AXSelect" id="ax-select4">
                                            <option value="1" selected="selected">ALL</option>
                                            <option value="2">SOME??</option>
                                        </select>
                                    </span>
                                    <span class="sitem">
                                        <span class="slabel">메뉴</span>
                                        <input type="text" name="" id="ax-frm-2" class="AXInput W100" value=""/>
                                    </span>
                                </div>
                            </form>
                            <p>
                                내용을 입력합니다.
                            </p>

                        </ax:custom>
                    </ax:custom>
                </ax:custom>
            </ax:col>
        </ax:row>

        <div class="H20"></div>

    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var page_menu_id = "template-guide";
            var fnObj = {
                list: [],
                pageStart: function () {

                    // input
                    $("#ax-inp-number").bindNumber();
                    $("#ax-inp-money").bindMoney();
                    $("#ax-inp-switch").bindSwitch({
                        off: "AM", on: "PM", onChange: function () {
                            toast.push(Object.toJSON({targetID: this.targetID, on: this.on, off: this.off, value: this.value}));
                        }
                    });
                    $("#ax-inp-segment").bindSegment({
                        options: [
                            {optionValue: 0, optionText: "왼쪽", addClass: "type1"},
                            {optionValue: 1, optionText: "가운데", addClass: "type2"},
                            {optionValue: 2, optionText: "오른쪽", addClass: "type3"}
                        ],
                        onChange: function () {
                            //this.targetID, this.options, this.selectedIndex, this.selectedOption
                            toast.push(Object.toJSON({targetID: this.targetID, options: this.options, selectedIndex: this.selectedIndex, selectedOption: this.selectedOption}));
                        }
                    });
                    $("#ax-inp-slider").bindSlider({min: 0, max: 100, snap: 10, unit: "%"});
                    $("#ax-inp-selector").bindSelector({
                        appendable: true,
                        options: [
                            {optionValue: 1, optionText: "Seoul"},
                            {optionValue: 2, optionText: "대구"},
                            {optionValue: 3, optionText: "대전"},
                            {optionValue: 4, optionText: "창원"},
                            {optionValue: 5, optionText: "마산"},
                            {optionValue: 6, optionText: "구례"},
                            {optionValue: 7, optionText: "제주도"},
                            {optionValue: 8, optionText: "전주"},
                            {optionValue: 4, optionText: "창원"},
                            {optionValue: 5, optionText: "마산"},
                            {optionValue: 6, optionText: "구례"},
                            {optionValue: 7, optionText: "제주도"},
                            {optionValue: 8, optionText: "전주"},
                            {optionValue: 9, optionText: "Gwangju"}
                        ]
                    });
                    $("#ax-select").bindSelect();
                    $("#ax-inp-date").bindDate();

                    // AXGrid init
                    this.grid.init();
                },
                grid: {
                    target: new AXGrid(),
                    init: function () {

                        this.target.setConfig({
                            targetID: "ax-grid-target",
                            theme: "AXGrid",
                            colHeadAlign: "center", // 컬럼헤드 정렬

                            //viewMode: "grid", // ["grid","icon","mobile"]
                            // 브라우저 사이즈에 따른 changeGridView 설정
                            /*
                            mediaQuery: {
                                mx:{min:0, max:600}, dx:{min:600}
                            },
                            */
                            colGroup: [
                                {key: "no", label: "번호", width: "40", align: "center"},
                                {key: "title", label: "제목", width: "200"},
                                {key: "writer", label: "작성자", width: "100", align: "center"},
                                {key: "date", label: "작성일", width: "100", align: "center"},
                                {key: "category", label: "category", width: "*"}
                            ],

                            body: {
                                onclick: function () {
                                    //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                    //alert(this.list);
                                    //alert(this.page);
                                }
                            },
                            page: {
                                paging: false,
                                status: {formatter: null}
                            }
                        });

                        var list = [
                            {
                                no: 1, title: "AXGrid 첫번째 줄 입니다.AXGrid 첫번째 줄 입니다.AXGrid 첫번째 줄 입니다.",
                                writer: "장기영", desc: "많은 글을 담고 있는 내용 입니다. 자연스럽게 줄이 넘어가고 표현되는 것이 관건 입니다.",
                                category: "액시스제이", date: "2014-04-02"
                            }, // item
                            {no: 2, title: "AXGrid 두번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 3, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 4, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 5, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 6, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 7, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 8, title: "AXGrid 첫번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 9, title: "AXGrid 두번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 10, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 11, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 12, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 13, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 14, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 15, title: "AXGrid 두번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 16, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 17, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 18, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 19, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"},
                            {no: 20, title: "AXGrid 세번째 줄 입니다.", writer: "장기영", category: "액시스제이", date: "2014-04-02"}
                        ];
                        this.target.setList(list);
                    },
                    add: function () {

                    },
                    remove: function () {

                    }
                }
            }
        </script>
    </ax:div>
</ax:layout>