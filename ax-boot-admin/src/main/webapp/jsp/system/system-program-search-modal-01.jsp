<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
    request.setAttribute("callBack", request.getParameter("callBack"));
    request.setAttribute("itemIndex", request.getParameter("itemIndex"));
%>
<ax:layout name="modal.jsp">
    <ax:set name="title" value="프로그램선택"/>
    <ax:set name="page_desc" value=""/>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12" wrap="true">

                <div class="ax-search" id="page-search-box"></div>
                <!--
                <div class="ax-button-group">
                <div class="left">

                </div>
                <div class="right">
                <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-search"></i> 이전</button>
                <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-search"></i> 다음</button>
                </div>
                <div class="ax-clear"></div>
                </div>
                -->
                <div class="ax-grid" id="page-grid-box" style="height:300px;"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="buttons">
        <button type="button" class="AXButton" onclick="fnObj.control.save();">확인</button>
        <button type="button" class="AXButton" onclick="fnObj.control.clear();">선택안함</button>
        <button type="button" class="AXButton" onclick="fnObj.control.cancel();">취소</button>
    </ax:div>

    <ax:div name="scripts">
        <script type="text/javascript">
            var callBackName = "${callBack}";
            var itemIndex = "${itemIndex}";
            var fnObj = {
                pageStart: function () {
                    this.search.bind();
                    this.grid.bind();
                    this.bindEvent();
                    app.modal.resize();
                },
                pageResize: function () {
                    app.modal.resize();
                },
                bindEvent: function () {

                },

                search: {
                    target: new AXSearch(),
                    get: function () { return this.target },
                    bind: function () {
                        var _this = this;
                        var _target = this.target;
                        this.target.setConfig({
                            targetID: "page-search-box",
                            theme: "AXSearch",
                            /*
                             mediaQuery: {
                             mx:{min:0, max:767}, dx:{min:767}
                             },
                             */
                            onsubmit: function () {
                                // 버튼이 선언되지 않았거나 submit 개체가 있는 경우 발동 합니다.
                                _this.submit();
                            },
                            rows: [
                                {
                                    display: true, addClass: "", style: "", list: [
                                    {label: "프로그램코드/명", labelWidth: 100, type: "inputText", width: "150", key: "searchParams", value: ""},
                                    {label: "", type: "submit", width: "50", key: "", valueBoxStyle: "padding-left:0px;", value: "찾기"}
                                ]
                                }
                            ]
                        });
                        //axdom("#" + this.target.getItemId("inputText1")).attr("readonly", "readonly");
                    },
                    submit: function () {
                        fnObj.grid.setPage(fnObj.grid.pageNo, this.target.getParam())
                    }
                }, // search

                grid: {
                    pageNo: 1,
                    target: new AXGrid(),
                    bind: function () {
                        var _this = this;
                        this.target.setConfig({
                            targetID: "page-grid-box",
                            theme: "AXGrid",
                            colHeadAlign: "center",
                            colGroup: [
                                {key: "progCd", label: "코드", width: "150"},
                                {key: "progNm", label: "프로그램명", width: "*"}
                            ],
                            body: {
                                onclick: function () {
                                    //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                    //fnObj.modal.open("gridView", this.item);
                                }
                            },
                            page: {
                                display: true,
                                paging: false,
                                onchange: function (pageNo) {  // 체크
                                    _this.setPage(pageNo);
                                }
                            }
                        });
                        this.setPage(fnObj.grid.pageNo); // 체크
                    },
                    setPage: function (pageNo, searchParams) { // 체크
                        var _target = this.target;
                        fnObj.grid.pageNo = pageNo;

                        app.ajax({
                            type: "GET",
                            url: "/api/v1/programs",
                            data: "pageNumber=" + (pageNo - 1) + "&pageSize=50&" + (searchParams || "")
                        }, function (res) {
                            if (res.error) {
                                alert(res.error.message);
                            }
                            else {
                                var gridData = {
                                    list: res.list,
                                    page: {
                                        pageNo: res.page.currentPage.number() + 1,
                                        pageSize: res.page.pageSize,
                                        pageCount: res.page.totalPages,
                                        listCount: res.page.totalElements
                                    }
                                };
                                _target.setData(gridData);
                            }
                        });
                    }
                }, // grid

                control: {
                    save: function () {

                        var result = fnObj.grid.target.getSelectedItem();
                        if (result.error) {
                            alert("목록을 선택해주세요");
                            return false;
                        }
                        var item = [].concat(result.item);
                        app.modal.save(window.callBackName, {
                            progCd: item[0].progCd,
                            progNm: item[0].progNm
                        }, itemIndex);
                    },
                    clear: function () {
                        app.modal.save(window.callBackName, {
                            progCd: '',
                            progNm: ''
                        }, itemIndex);
                    },
                    cancel: function () {
                        app.modal.cancel();
                    }
                }
            };
        </script>
    </ax:div>
</ax:layout>