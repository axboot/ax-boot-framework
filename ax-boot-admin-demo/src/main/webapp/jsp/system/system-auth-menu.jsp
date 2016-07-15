<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="${PAGE_NAME}"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button" pageId="${PAGE_ID}" searchAuth="${SEARCH_AUTH}" saveAuth="${SAVE_AUTH}" excelAuth="${EXCEL_AUTH}" function1Auth="${FUNCTION_1_AUTH}"
                           function2Auth="${FUNCTION_2_AUTH}" function3Auth="${FUNCTION_3_AUTH}" function4Auth="${FUNCTION_4_AUTH}" function5Auth="${FUNCTION_5_AUTH}"></ax:custom>

                <ax:custom customid="table">
                    <ax:custom customid="tr">
                        <ax:custom customid="td" style="width:30%;">

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-list-alt"></i> 카테고리 선택</h2>
                                </div>
                                <div class="right">
                                    <!--button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 신규</button-->
                                </div>
                                <div class="ax-clear"></div>
                            </div>

                            <div class="ax-tree" id="page-tree-box" style="height: 400px;"></div>

                        </ax:custom>
                        <ax:custom customid="td">

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2>
                                        <i class='axi axi-folder-open-o'></i>
                                        상위메뉴
                                        <input type="text" name="parent_cd" id="parent_cd" class="AXInput W80" readonly="readonly"/>
                                        <input type="text" name="parent_nm" id="parent_nm" class="AXInput W150" readonly="readonly"/>
                                    </h2>
                                </div>
                                <div class="right">
                                    <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 추가</button>
                                    <button type="button" class="AXButton" id="ax-grid-btn-del"><i class="axi axi-minus-circle"></i> 삭제</button>
                                </div>
                                <div class="ax-clear"></div>
                            </div>

                            <div class="ax-grid" id="page-grid-box"></div>

                        </ax:custom>
                    </ax:custom>
                </ax:custom>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var RESIZE_ELEMENTS = [
                {id: "page-grid-box", adjust: -40},
                {id: "page-tree-box", adjust: -40}
            ];
            var fnObj = {
                pageStart: function () {
                    this.tree.bind();
                    this.grid.bind();
                    this.bindEvent();
                },
                bindEvent: function () {
                    var _this = this;
                    $("#ax-page-btn-search").bind("click", function () {
                        _this.search.submit();
                    });
                    $("#ax-page-btn-save").bind("click", function () {
                        setTimeout(function () {
                            _this.save();
                        }, 500);
                    });
                    $("#ax-page-btn-excel").bind("click", function () {
                        app.modal.excel({
                            pars: "target=${className}"
                        });
                    });
                    $("#ax-grid-btn-add").bind("click", function () {
                        _this.grid.add();
                    });
                    $("#ax-grid-btn-del").bind("click", function () {
                        _this.grid.del();
                    });

                },

                save: function () {
                    var items = fnObj.grid.target.list;
                    if (items.length == 0) {
                        alert("저장할 내용이 없습니다.");
                        return;
                    }
                    var dto_list = [];
                    axf.each(items, function (i, d) {
                        if (d._CUD) {
                            var item = {
                                mnuCd: (d.mnuCd || ""),
                                mnuUpCd: (d.mnuUpCd || ""),
                                mnuNm: (d.mnuNm || ""),
                                mnuIx: (d.mnuIx || ""),
                                useYn: (d.useYn || "N"),
                                mnuLv: (d.mnuLv || ""),
                                progCd: (d.progCd || "")
                            };
                            dto_list.push(item);
                        }
                    });

                    app.ajax({
                        type: "PUT",
                        url: "/api/v1/menus",
                        data: Object.toJSON(dto_list)
                    }, function (res) {
                        if (res.error) {
                            alert(res.error.message);
                        }
                        else {
                            toast.push("저장되었습니다.");
                            fnObj.tree.load();
                        }
                    });

                    //console.log(fnObj.grid.list);
                },
                excel: function () {

                },

                search: {
                    target: new AXSearch(),
                    bind: function () {
                        var _this = this;
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
                            },
                            rows: [
                                {
                                    display: true, addClass: "", style: "", list: [
                                    {
                                        label: "프로그램 코드/명", labelWidth: "", type: "inputText", width: "150", key: "inputText", addClass: "", valueBoxStyle: "", value: "",
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
                    submit: function () {
                        fnObj.tree.load();
                    }
                },
                tree: {
                    clickIndex: 0,
                    target: new AXTree(),
                    get: function () { return this.target; },
                    bind: function () {
                        var _this = this;
                        this.target.setConfig({
                            targetID: "page-tree-box",
                            theme: "AXTree_none",
                            xscroll: true,
                            relation: {
                                parentKey: "mnuUpCd",
                                childKey: "mnuCd"
                            },
                            reserveKeys: {
                                parentHashKey: "pHash", // 부모 트리 포지션
                                hashKey: "hash", // 트리 포지션
                                openKey: "open", // 확장여부
                                subTree: "cn", // 자식개체키
                                displayKey: "display" // 표시여부
                            },
                            colGroup: [
                                {
                                    key: "mnuNm", label: "제목", width: "*", align: "left", indent: true,
                                    getIconClass: function () {
                                        if (this.item.__subTreeLength > 0) {
                                            return {
                                                addClass: "userHtml",
                                                html: "<i class='axi axi-folder-open-o'></i>"
                                            };
                                        }
                                        else {
                                            return {
                                                addClass: "userHtml",
                                                html: "<i class='axi axi-file-o'></i>"
                                            };
                                        }
                                    },
                                    formatter: function () {
                                        //return "<b>"+this.item.no.setDigit(2) + "</b> : " + this.item.nodeName + " (" + this.item.writer + ")";
                                        return this.item.mnuNm;
                                    }
                                }
                            ],
                            body: {
                                onclick: function (idx, item) {
                                    fnObj.tree.clickIndex = this.index;
                                    fnObj.tree.mnuLv = (this.item.mnuLv || 0);

                                    $("#parent_cd").val(this.item.mnuCd);
                                    $("#parent_nm").val(this.item.mnuNm);

                                    fnObj.grid.setList(this.subTree.cn);
                                }
                            }
                        });

                        this.load();
                    },
                    load: function () {
                        var _this = this;
                        app.ajax(
                                {
                                    type: "GET",
                                    url: "/api/v1/menus",
                                    data: {pageNumber: 0, pageSize: 10000}
                                },
                                function (res) {

                                    res.list.forEach(function (item) {
                                        if (item.mnuLv == 1) item.mnuUpCd = "__root__"
                                    });

                                    res.list.splice(0, 0, {
                                        mnuCd: "__root__",
                                        mnuNm: "메뉴",
                                        open: true
                                    });

                                    fnObj.tree.target.setList(res.list);
                                    fnObj.tree.target.click(_this.clickIndex, "open");
                                }
                        );
                    }
                },
                grid: {
                    pageNo: 1,
                    target: new AXGrid(),
                    bind: function () {
                        var target = this.target, _this = this;
                        target.setConfig({
                            targetID: "page-grid-box",
                            theme: "AXGrid",
                            colHeadAlign: "center",
                            colGroup: [
                                {
                                    key: "mnuCd", label: "구분", width: "40", align: "center", formatter: "checkbox", disabled: function () {
                                    return (this.item._CUD != "C");
                                }
                                },
                                {
                                    key: "mnuCd", label: "메뉴코드", width: "120",
                                    editor: {
                                        type: "text",
                                        maxLength: 50,
                                        disabled: function () {
                                            return this.item._CUD != "C";
                                        }
                                    }
                                },
                                {
                                    key: "mnuNm", label: "메뉴명", width: "180",
                                    editor: {
                                        type: "text",
                                        maxLength: 50
                                    }
                                },
                                {
                                    key: "mnuIx", label: "정렬", width: "50", align: "center",
                                    editor: {
                                        type: "number"
                                    }
                                },
                                {
                                    key: "useYn", label: "사용여부", width: "60", align: "center", formatter: function () {
                                    return Object.isObject(this.value) ? this.value.optionText : (this.value == "Y") ? "사용" : "미사용";
                                },
                                    editor: {
                                        type: "select", value: "itemValue",
                                        options: [
                                            {optionValue: "Y", optionText: "사용"},
                                            {optionValue: "N", optionText: "미사용"}
                                        ]
                                    }
                                },

                                {
                                    key: "progCd", label: "프로그램코드", width: "140",
                                    formatter: function () {
                                        return ((this.value || "") == "") ? "<span style='color:#ff3300;'>프로그램을 선택하세요.</span>" : this.value;
                                    },
                                    editor: {
                                        type: "finder",
                                        finder: {
                                            onclick: function () {
                                                app.modal.open({
                                                    url: "/jsp/system/system-program-search-modal-01.jsp",
                                                    pars: "callBack=fnObj.grid.setProgCd&itemIndex=" + this.index, // callBack 말고
                                                    width: 500 // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                                                    //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    key: "progNm", label: "프로그램명", width: "200",
                                    formatter: function () {
                                        return ((this.value || "") == "") ? "<span style='color:#ff3300;'>프로그램을 선택하세요.</span>" : this.value;
                                    },
                                    editor: {
                                        type: "finder",
                                        finder: {
                                            onclick: function () {
                                                app.modal.open({
                                                    url: "/jsp/system/system-program-search-modal-01.jsp",
                                                    pars: "callBack=fnObj.grid.setProgCd&itemIndex=" + this.index, // callBack 말고
                                                    width: 500 // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                                                    //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                                                })
                                            }
                                        }
                                    }
                                },
                                {
                                    key: "mnuLv", label: "LEVEL", width: "70", align: "center",
                                    editor: {
                                        type: "number"
                                    }
                                }
                            ],
                            body: {
                                onclick: function () {
                                    //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                    //alert(this.list);
                                    //alert(this.page);
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
                        //this.setPage(fnObj.grid.pageNo);
                    },
                    add: function () {
                        // $("#parent_cd").val()
                        this.target.pushList(
                                {
                                    mnuCd: "",
                                    mnuUpCd: $("#parent_cd").val(),
                                    mnuNm: "",
                                    mnuIx: "",
                                    useYn: "Y",
                                    mnuLv: Number(fnObj.tree.mnuLv) + 1,
                                    progCd: ""
                                }
                        );
                        this.target.setFocus(this.target.list.length - 1);
                    },
                    del: function () {
                        var checkedList = this.target.getCheckedListWithIndex(0);// colSeq
                        if (checkedList.length == 0) {
                            alert("선택된 목록이 없습니다. 삭제하시려는 목록을 체크하세요");
                            return;
                        }
                        this.target.removeListIndex(checkedList);
                    },
                    setList: function (list) {
                        this.target.setList(list);
                    },
                    setProgCd: function (item, itemIndex) {
                        fnObj.grid.target.updateItem(0, 1, itemIndex, item.progCd);
                        fnObj.grid.target.updateItem(0, 2, itemIndex, item.progNm);

                        fnObj.grid.target.updateItem(0, 5, itemIndex, item.progCd);
                        fnObj.grid.target.updateItem(0, 6, itemIndex, item.progNm);
                        app.modal.close();
                    }
                }
            };
        </script>
    </ax:div>
</ax:layout>
