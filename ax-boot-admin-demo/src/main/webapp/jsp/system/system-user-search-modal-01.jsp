<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
    request.setAttribute("callBack", request.getParameter("callBack"));
%>
<ax:layout name="modal.jsp">
    <ax:set name="title" value="사용자선택"/>
    <ax:set name="page_desc" value=""/>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12" wrap="true">

                <div class="ax-search" id="page-search-box"></div>
                <div class="ax-button-group">
                    <div class="left">

                    </div>
                    <div class="right">
                        <button type="button" class="AXButton" id="ax-grid-btn-search"><i class="axi axi-search"></i> 조회</button>
                    </div>
                    <div class="ax-clear"></div>
                </div>
                <div class="ax-grid" id="page-grid-box" style="height:300px;"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="buttons">
        <button type="button" class="AXButton" onclick="fnObj.control.save();">확인</button>
        <button type="button" class="AXButton" onclick="fnObj.control.cancel();">취소</button>
    </ax:div>

    <ax:div name="scripts">
        <script type="text/javascript">
            var callBackName = "${callBack}";
            var fnObj = {
                pageStart: function () {
                    this.search.bind();
                    this.grid.bind();
                    this.bindEvent();
                    app.modal.resize();
                    fnObj.search.submit();
                },
                pageResize: function () {
                    app.modal.resize();
                },
                bindEvent: function () {
                    $("#ax-grid-btn-search").click(function () {
                        fnObj.search.submit();
                    });
                },

                search: {
                    target: new AXSearch(),
                    get: function () {
                        return this.target
                    },
                    bind: function () {
                        var _this = this;
                        this.target.setConfig({
                            targetID: "page-search-box",
                            theme: "AXSearch",
                            /*
                             mediaQuery: {
                             mx:{min:"N", max:767}, dx:{min:767}
                             },
                             */
                            onsubmit: function () {
                                // 버튼이 선언되지 않았거나 submit 개체가 있는 경우 발동 합니다.
                                fnObj.search.submit();
                            },
                            rows: [
                                {
                                    display: true, addClass: "", style: "", list: [
                                    {
                                        label: "ID 검색", labelWidth: "60", type: "inputText", width: "", key: "userCd", addClass: "secondItem", valueBoxStyle: "", value: "",
                                        onChange: function (changedValue) {
                                            //아래 2개의 값을 사용 하실 수 있습니다.
                                            //toast.push(Object.toJSON(this));
                                            //dialog.push(changedValue);
                                        }
                                    }
                                ]
                                }
                            ]
                        });
                    },
                    save: function () {
                        //fnObj.form.save();
                    },
                    excel: function () {

                    },
                    submit: function () {
                        var pars = this.target.getParam();
                        fnObj.grid.setPage(fnObj.grid.pageNo, pars);
                    }
                },

                grid: {
                    pageNo: 0,
                    userType: {R: "슈퍼 관리자", I: "공항공사 관리자", C: "업체 관리자", B: "브랜드 관리자", S: "매장 관리자"},
                    userYn: {Y: "사용", N: "사용안함"},
                    target: new AXGrid(),
                    get: function () {
                        return this.target
                    },
                    bind: function () {
                        var _this = this;
                        this.target.setConfig({
                            targetID: "page-grid-box",
                            theme: "AXGrid",
                            colHeadAlign: "center",
                            colGroup: [
                                {key: "userCd", label: "아이디", width: "100"},
                                {key: "userNm", label: "이름", width: "100"},
                                {
                                    key: "userType", label: "구분", width: "100", formatter: function () {
                                    return fnObj.grid.userType[this.value];
                                }
                                },
                                {
                                    key: "useYn", label: "사용여부", width: "80", align: "center", formatter: function () {
                                    return fnObj.grid.userYn[this.value];
                                }
                                }
                            ],
                            body: {
                                onclick: function () {
                                    //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                    //fnObj.modal.open("gridView", this.item);
                                    if (_this.selectedIndex == this.index) {
                                        fnObj.control.save();
                                    }
                                    _this.selectedIndex = this.index;
                                }
                            },
                            page: {
                                display: true,
                                paging: false,
                                onchange: function (pageNo) {
                                    _this.setPage(pageNo);
                                }
                            }
                        });

                        this.target.setList([
                            {c1: "FB001"}
                        ]);
                    },
                    setPage: function (pageNo, searchParams) {
                        var _this = this;
                        _this.pageNo = pageNo;
                        app.ajax({
                            type: "GET",
                            url: "/api/v1/users",
                            data: "pageNumber=" + (pageNo) + "&pageSize=50&" + (searchParams || "")
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
                                _this.target.setData(gridData);
                            }
                        });
                    }
                }, // grid

                control: {
                    save: function () {
                        var items = fnObj.grid.target.getSelectedItem();
                        if (items.error) {
                            alert("선택된 아이템이 없습니다.");
                            return;
                        }
                        app.modal.save(window.callBackName, items.item);
                    },
                    cancel: function () {
                        app.modal.cancel();
                    }
                }
            };
        </script>
    </ax:div>
</ax:layout>