<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="${PAGE_NAME}"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>
    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button" pageId="${PAGE_ID}" searchAuth="${SEARCH_AUTH}" saveAuth="${SAVE_AUTH}" excelAuth="${EXCEL_AUTH}" function1Auth="${FUNCTION_1_AUTH}" function2Auth="${FUNCTION_2_AUTH}" function3Auth="${FUNCTION_3_AUTH}" function4Auth="${FUNCTION_4_AUTH}"
                           function5Auth="${FUNCTION_5_AUTH}"></ax:custom>

                <div class="ax-search" id="page-search-box"></div>
                <div class="ax-button-group">
                    <div class="right">
                        <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 추가</button>
                    </div>
                    <div class="ax-clear"></div>
                </div>
                <div class="ax-grid" id="page-grid-box" style="min-height:300px;"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            // 삭제금지 엘리먼트의 높이를 조절 해주는 오브젝트 - 2015-05-03
            var RESIZE_ELEMENTS = [
                {id: "page-grid-box", adjust: -80}
            ];
            var fnObj = {
                pageStart: function () {
                    this.search.bind();
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
                                progCd: (d.progCd || ""),
                                progNm: (d.progNm || ""),
                                fileNm: (d.fileNm || ""),
                                progPh: (d.progPh || ""),
                                target: (d.target || ""),
                                schAh: (d.schAh || "N"),
                                savAh: (d.savAh || "N"),
                                exlAh: (d.exlAh || "N"),
                                fn1Ah: (d.fn1Ah || "N"),
                                fn2Ah: (d.fn2Ah || "N"),
                                fn3Ah: (d.fn3Ah || "N"),
                                fn4Ah: (d.fn4Ah || "N"),
                                fn5Ah: (d.fn5Ah || "N"),
                                remark: (d.remark || ""),
                                useYn: (d.useYn || "N")
                            };
                            dto_list.push(item);
                        }
                    });

                    //trace(dto_list);
                    //return;

                    app.ajax({
                        type: "PUT",
                        url: "/api/v1/programs",
                        data: Object.toJSON(dto_list)
                    }, function (res) {
                        if (res.error) {
                            alert(res.error.message);
                        }
                        else {
                            toast.push("저장되었습니다.");
                        }
                    });
                },
                excel: function () {

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
                            mediaQuery: {
                                mx: {min: "N", max: 767}, dx: {min: 767}
                            },
                            onsubmit: function () {
                                // 버튼이 선언되지 않았거나 submit 개체가 있는 경우 발동 합니다.
                                fnObj.search.submit();
                            },
                            rows: [
                                {
                                    display: true, addClass: "", style: "", list: [
                                    {
                                        label: "프로그램 코드/명", labelWidth: "", type: "inputText", width: "150", key: "searchParams", addClass: "", valueBoxStyle: "", value: "",
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
                        var pars = this.target.getParam();

                        fnObj.grid.setPage(fnObj.grid.pageNo, pars);
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
                            /*
                             mediaQuery: {
                             mx:{min:"N", max:767}, dx:{min:767}
                             },
                             */
                            colGroup: [
                                {
                                    key: "progNm", label: "프로그램명", width: "160", align: "left",
                                    editor: {
                                        type: "text",
                                        maxLength: 25
                                    }
                                },
                                {
                                    key: "progPh", label: "경로", width: "350",
                                    editor: {
                                        type: "text",
                                        maxLEngth: 100
                                    }
                                },
                                {
                                    key: "schAh", label: "조회", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "savAh", label: "저장", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "exlAh", label: "엑셀", width: "50", align: "center",

                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn1Ah", label: "삭제", width: "50", align: "center",

                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn2Ah", label: "FN2", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn3Ah", label: "FN3", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn4Ah", label: "FN4", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn5Ah", label: "FN5", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        }
                                    }
                                },
                                {
                                    key: "useYn", label: "사용여부", width: "80", align: "center", formatter: function () {
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
                                    key: "remark", label: "설명", width: "*",
                                    editor: {
                                        type: "text"
                                    }
                                }
                            ],
                            colHead: {
                                rows: [
                                    [
                                        {colSeq: 0, rowspan: 2, valign: "middle"},
                                        {colSeq: 1, rowspan: 2, valign: "middle"},
                                        {colSeq: 2, rowspan: 2, valign: "middle"},
                                        {colSeq: null, colspan: 3, label: "공통버튼", align: "center"},
                                        {colSeq: 6, rowspan: 2, valign: "middle"},
                                        {colSeq: 7, rowspan: 2, valign: "middle"},
                                        {colSeq: 8, rowspan: 2, valign: "middle"},
                                        {colSeq: 9, rowspan: 2, valign: "middle"},
                                        {colSeq: 10, rowspan: 2, valign: "middle"},
                                        {colSeq: 11, rowspan: 2, valign: "middle"},
                                        {colSeq: 12, rowspan: 2, valign: "middle"}
                                    ],
                                    [
                                        {colSeq: 3},
                                        {colSeq: 4},
                                        {colSeq: 5}
                                    ]
                                ]
                            },
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
                        this.setPage(fnObj.grid.pageNo);
                    },
                    add: function () {
                        this.target.pushList(
                                {
                                    "progNm": "",
                                    "fileNm": "",
                                    "progPh": "",
                                    "target": "",
                                    "schAh": "",
                                    "savAh": "",
                                    "exlAh": "",
                                    "fn1Ah": "",
                                    "fn2Ah": "",
                                    "fn3Ah": "",
                                    "fn4Ah": "",
                                    "fn5Ah": "",
                                    "remark": "",
                                    "useYn": "Y"
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
                    setPage: function (pageNo, searchParams) {
                        var _target = this.target;
                        fnObj.grid.pageNo = pageNo;

                        app.ajax({
                            type: "GET",
                            url: "/api/v1/programs",
                            data: "pageNumber=" + (pageNo - 1) + "&pageSize=10000&" + (searchParams || "")
                        }, function (res) {
                            if (res.error) {
                                alert(res.error.message);
                            }
                            else {
                                // 샘플 입니다. 지워주세요
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
                }
            };
        </script>
    </ax:div>
</ax:layout>