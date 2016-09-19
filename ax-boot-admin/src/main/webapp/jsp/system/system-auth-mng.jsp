<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="${PAGE_NAME}"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customId="page-button" pageId="${PAGE_ID}" searchAuth="${SEARCH_AUTH}" saveAuth="${SAVE_AUTH}" excelAuth="${EXCEL_AUTH}" function1Auth="${FUNCTION_1_AUTH}"
                           function2Auth="${FUNCTION_2_AUTH}" function3Auth="${FUNCTION_3_AUTH}" function4Auth="${FUNCTION_4_AUTH}" function5Auth="${FUNCTION_5_AUTH}">
                    <button type="button" class="AXButton Blue" id="ax-grid-btn-del"><i class="axi axi-minus-circle"></i> 삭제</button>
                </ax:custom>

                <div class="ax-search" id="page-search-box"></div>

                <ax:custom customId="table">

                    <ax:custom customId="tr">
                        <ax:custom customId="td" style="width:30%;">
                            <h2><i class="axi axi-list-alt"></i> 권한그룹</h2>
                            <div class="ax-grid" id="page-grid-box" style="min-height:300px;"></div>

                        </ax:custom>
                        <ax:custom customId="td">
                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-table"></i> 권한그룹 정보</h2>
                                </div>
                                <div class="right">
                                    <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 신규</button>
                                </div>
                                <div class="ax-clear"></div>
                            </div>

                            <ax:form name="table-form" id="table-form" method="get">
                                <input type="hidden" name="act_tp" id="act_tp" value="C"/>
                                <ax:fields>
                                    <ax:field label="그룹코드" width="100px">
                                        <input type="text" name="grpAuthCd" id="grpAuthCd" maxlength="10" class="AXInput W100" value=""/>
                                    </ax:field>
                                    <ax:field label="그룹명" width="200px">
                                        <input type="text" name="grpAuthNm" id="grpAuthNm" maxlength="25" class="AXInput W200" value=""/>
                                    </ax:field>
                                </ax:fields>
                                <ax:fields>
                                    <ax:field label="비고">
                                        <input type="text" name="remark" id="remark" maxlength="100" class="AXInput W200" value=""/>
                                    </ax:field>
                                </ax:fields>
                            </ax:form>

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-list-alt"></i> 권한허용 메뉴목록</h2>
                                </div>
                                <div class="right">
                                    <button type="button" class="AXButton" id="ax-grid2-btn-add"><i class="axi axi-plus-circle"></i> 추가</button>
                                    <button type="button" class="AXButton" id="ax-grid2-btn-del"><i class="axi axi-minus-circle"></i> 삭제</button>
                                </div>
                                <div class="ax-clear"></div>
                            </div>
                            <div class="ax-grid" id="page-grid2-box" style="min-height:150px;"></div>
                        </ax:custom>
                    </ax:custom>
                </ax:custom>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var RESIZE_ELEMENTS = [
                {id: "page-grid-box", adjust: -80},
                {
                    id: "page-grid2-box", adjust: function () {
                    return -$("#table-form").outerHeight() - 80 - 47;
                }
                }
            ];
            var fnObj = {
                pageStart: function () {
                    this.search.bind();
                    this.grid.bind();
                    this.grid2.bind();
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
                        _this.form.add();
                    });
                    $("#ax-grid-btn-del").bind("click", function () {
                        _this.form.del();
                    });

                    $("#ax-grid2-btn-add").bind("click", function () {
                        //_this.grid2.add();

                        app.modal.open({
                            url: "/jsp/system/system-menu-search-modal-01.jsp",
                            pars: "callBack=fnObj.grid2.setMnuCd&grpAuthCd=" + $("#grpAuthCd").val(), // callBack 말고
                            width: 500 // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                            //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                        });

                    });
                    $("#ax-grid2-btn-del").bind("click", function () {
                        _this.grid2.del();
                    });

                    $("#ax-frm-2").bindSelect();
                },

                save: function () {
                    fnObj.form.save();
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
                                mx: {min: 0, max: 767}, dx: {min: 767}
                            },
                            onsubmit: function () {
                                // 버튼이 선언되지 않았거나 submit 개체가 있는 경우 발동 합니다.
                            },
                            rows: [
                                {
                                    display: true, addClass: "", style: "", list: [
                                    {
                                        label: "검색어", labelWidth: "", type: "inputText", width: "150", key: "searchParams", addClass: "", valueBoxStyle: "", value: "",
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
                        //toast.push("콘솔창에 파라미터 정보를 출력하였습니다.");
                        //trace(pars);
                        fnObj.grid.setPage(0, pars);
                        fnObj.form.add();
                    }
                },
                grid: {
                    pageNo: 0,
                    target: new AXGrid(),
                    bind: function () {
                        var _this = this;
                        _this.target.setConfig({
                            targetID: "page-grid-box",
                            theme: "AXGrid",
                            colHeadAlign: "center",
                            /*
                             mediaQuery: {
                             mx:{min:0, max:767}, dx:{min:767}
                             },
                             */
                            colGroup: [
                                {key: "grpAuthCd", label: "그룹코드", width: "70", align: "center"},
                                {key: "grpAuthNm", label: "그룹명", width: "140"},
                                {key: "remark", label: "비고", width: "*"}
                            ],
                            body: {
                                onclick: function () {
                                    //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                    fnObj.form.edit(this.item);
                                }
                            },
                            page: {
                                display: true,
                                paging: false,
                                onchange: function (pageNo) {
                                    _this.setPage(pageNo - 1);
                                }
                            }
                        });
                        this.setPage(this.pageNo);
                    },
                    setPage: function (pageNo, searchParams) {
                        var _this = this;
                        _this.pageNo = pageNo;
                        app.ajax({
                            type: "GET",
                            url: "/api/v1/auth/groups",
                            data: "pageNumber=" + (pageNo) + "&pageSize=50&" + (searchParams || fnObj.search.target.getParam())
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
                },
                grid2: {
                    removedList: [],
                    target: new AXGrid(),
                    bind: function () {
                        this.target.setConfig({
                            targetID: "page-grid2-box",
                            theme: "AXGrid",
                            colHeadAlign: "center",
                            /*
                             mediaQuery: {
                             mx:{min:0, max:767}, dx:{min:767}
                             },
                             */
                            colGroup: [
                                {key: "index", label: "구분", width: "40", align: "center", formatter: "checkbox"},
                                {
                                    key: "mnuCd", label: "메뉴코드", width: "180", align: "left",
                                    formatter: function () {
                                        return ((this.value || "") == "") ? "<span style='color:#ff3300;'>메뉴를 선택하세요.</span>" : this.value;
                                    },
                                    editor: {
                                        type: "finder",
                                        finder: {
                                            onclick: function () {
                                                app.modal.open({
                                                    url: "/jsp/system/system-menu-search-modal-01.jsp",
                                                    pars: "callBack=fnObj.grid2.setMnuCd&itemIndex=" + this.index, // callBack 말고
                                                    width: 500 // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                                                    //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    key: "mnuNm", label: "메뉴", width: "200",
                                    formatter: function () {
                                        return ((this.value || "") == "") ? "<span style='color:#ff3300;'>메뉴를 선택하세요.</span>" : this.value;
                                    },
                                    editor: {
                                        type: "finder",
                                        finder: {
                                            onclick: function () {
                                                app.modal.open({
                                                    url: "/jsp/system/system-menu-search-modal-01.jsp",
                                                    pars: "callBack=fnObj.grid2.setMnuCd&itemIndex=" + this.index, // callBack 말고
                                                    width: 500 // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                                                    //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    key: "schAh", label: "조회", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progSchAh == "N";
                                        }
                                    }
                                },
                                {
                                    key: "savAh", label: "저장", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progSavAh == "N";
                                        }
                                    }
                                },
                                {
                                    key: "exlAh", label: "엑셀", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progExlAh == "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn1Ah", label: "삭제", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progFn1Ah == "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn2Ah", label: "FN2", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progFn2Ah == "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn3Ah", label: "FN3", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progFn3Ah == "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn4Ah", label: "FN4", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progFn4Ah == "N";
                                        }
                                    }
                                },
                                {
                                    key: "fn5Ah", label: "FN5", width: "50", align: "center",
                                    editor: {
                                        type: "checkbox",
                                        beforeUpdate: function (val) {
                                            return (val == true) ? "Y" : "N";
                                        },
                                        disabled: function () {
                                            return this.item.progFn5Ah == "N";
                                        }
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
                                        {colSeq: 10, rowspan: 2, valign: "middle"}
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
                                paging: false
                            }
                        });
                    },
                    setList: function (list) {
                        this.target.setList(list);
                    },
                    add: function () {
                        fnObj.grid2.target.pushList(
                                {
                                    "grpAuthCd": $("#grpAuthCd").val(),
                                    "mnuCd": "",
                                    "mnuNm": "",
                                    "progCd": "",
                                    "progNm": "",
                                    "schAh": "N",
                                    "savAh": "N",
                                    "exlAh": "N",
                                    "fn1Ah": "N",
                                    "fn2Ah": "N",
                                    "fn3Ah": "N",
                                    "fn4Ah": "N",
                                    "fn5Ah": "N",
                                    "progSchAh": "N",
                                    "progSavAh": "N",
                                    "progExlAh": "N",
                                    "progFn1Ah": "N",
                                    "progFn2Ah": "N",
                                    "progFn3Ah": "N",
                                    "progFn4Ah": "N",
                                    "progFn5Ah": "N"
                                }
                        );
                        fnObj.grid2.target.setFocus(fnObj.grid2.target.list.length - 1);
                    },
                    del: function () {
                        var checkedList = fnObj.grid2.target.getCheckedListWithIndex(0);// colSeq
                        if (checkedList.length == 0) {
                            alert("선택된 목록이 없습니다. 삭제하시려는 목록을 체크하세요");
                            return;
                        }

                        for (var i = 0, l = checkedList.length; i < l; i++) {
                            if (checkedList[i].item._CUD != "C" && checkedList[i].item.mnuCd != "") fnObj.grid2.removedList.push(checkedList[i].item.mnuCd);
                        }
                        //todo 삭제목록 담기
                        fnObj.grid2.target.removeListIndex(checkedList);
                    },
                    setMnuCd: function (item, itemIndex) {

                        if ($.isArray(item)) {
                            //console.log(item);
                            var grpAuthCd = $("#grpAuthCd").val();
                            item.forEach(function (n) {
                                if (n.progCd && n.useYn != "N") {
                                    fnObj.grid2.target.pushList({
                                        "grpAuthCd": grpAuthCd,
                                        "mnuCd": n.mnuCd,
                                        "mnuNm": n.mnuNm,
                                        "progCd": n.progCd,
                                        "progNm": n.progNm,
                                        "schAh": "N",
                                        "savAh": "N",
                                        "exlAh": "N",
                                        "fn1Ah": "N",
                                        "fn2Ah": "N",
                                        "fn3Ah": "N",
                                        "fn4Ah": "N",
                                        "fn5Ah": "N",
                                        "progSchAh": n.program.schAh,
                                        "progSavAh": n.program.savAh,
                                        "progExlAh": n.program.exlAh,
                                        "progFn1Ah": n.program.fn1Ah,
                                        "progFn2Ah": n.program.fn2Ah,
                                        "progFn3Ah": n.program.fn3Ah,
                                        "progFn4Ah": n.program.fn4Ah,
                                        "progFn5Ah": n.program.fn5Ah
                                    });
                                }
                            });
                            app.modal.close();
                        }
                        else {
                            //trace(item);
                            var update_item = {
                                "grpAuthCd": $("#grpAuthCd").val(),
                                "mnuCd": item.mnuCd,
                                "mnuNm": item.mnuNm,
                                "progCd": item.progCd,
                                "progNm": item.progNm,
                                "schAh": "N",
                                "savAh": "N",
                                "exlAh": "N",
                                "fn1Ah": "N",
                                "fn2Ah": "N",
                                "fn3Ah": "N",
                                "fn4Ah": "N",
                                "fn5Ah": "N",
                                "progSchAh": item.program.schAh,
                                "progSavAh": item.program.savAh,
                                "progExlAh": item.program.exlAh,
                                "progFn1Ah": item.program.fn1Ah,
                                "progFn2Ah": item.program.fn2Ah,
                                "progFn3Ah": item.program.fn3Ah,
                                "progFn4Ah": item.program.fn4Ah,
                                "progFn5Ah": item.program.fn5Ah
                            };
                            fnObj.grid2.target.updateList(itemIndex, update_item);
                            app.modal.close();
                        }
                    }
                },
                form: {
                    target: document["table-form"],
                    init: function () {
                        fnObj.grid2.removedList = []; // 삭제된 목록 초기화
                        var collect = [];
                        axf.each(fnObj.grid2.target.list, function (i, item) {
                            collect.push({index: i, item: item});
                        });
                        if (collect.length > 0) fnObj.grid2.target.removeListIndex(collect);
                    },
                    add: function () {
                        this.init();
                        var frm = this.target;
                        frm.reset();
                        $("#act_tp").val("C");
                        $("#grpAuthCd").removeAttr("readonly");
                        fnObj.grid2.target.setList([]);
                    },
                    del: function () {
                        if (axdom("#act_tp").val() == "C") {
                            toast.push("선택된 권한 그룹이 없습니다.");
                            return false;
                        }
                        if (!confirm("정말 삭제하시겠습니까?")) return;

                        app.ajax({
                            type: "DELETE",
                            url: "/api/v1/auth/groups?grpAuthCd=" + $("#grpAuthCd").val(),
                            data: ""
                        }, function (res) {
                            if (res.error) {
                                alert(res.error.message);
                            }
                            else {
                                toast.push("삭제 되었습니다.");
                                // 그리드 새로고침
                                fnObj.search.submit();
                            }
                        });

                    },
                    edit: function (item) {
                        this.init();

                        $("#act_tp").val("U");

                        $("#grpAuthCd").attr("readonly", "readonly");
                        $("#grpAuthCd").val(item.grpAuthCd);
                        $("#grpAuthNm").val(item.grpAuthNm);
                        $("#remark").val(item.remark);

                        loading_mask.open();

                        app.ajax({
                            type: "GET",
                            url: "/api/v1/auth/groups/menus",
                            data: "grpAuthCd=" + item.grpAuthCd
                        }, function (res) {
                            if (res.error) {
                                alert(res.error.message);
                            }
                            else {
                                // 그리드 새로고침
                                var list = [];
                                for (var i = 0, l = res.list.length; i < l; i++) {
                                    if (res.list[i].progCd) list.push(res.list[i]);
                                }
                                fnObj.grid2.setList(list);
                            }
                        });

                    },
                    save: function () {
                        //alert("저장");
                        var item = app.form.serializeObjectWithIds($("#table-form"));
                        //trace(item);

                        if (item.grpAuthCd == "") {
                            alert("그룹코드를 입력하세요");
                            $("#grpAuthCd").focus();
                            return;
                        }
                        if (item.grpAuthNm == "") {
                            alert("그룹명을 입력하세요");
                            $("#grpAuthNm").focus();
                            return;
                        }

                        //trace(fnObj.grid2.target.list);
                        var update_list = [];
                        for (var i = 0, l = fnObj.grid2.target.list.length; i < l; i++) {
                            if (fnObj.grid2.target.list[i].mnuCd != "") {
                                //fnObj.grid2.target.list[i]
                                if (fnObj.grid2.target.list[i]["progSchAh"] == "N") fnObj.grid2.target.list[i]["schAh"] = "N";
                                if (fnObj.grid2.target.list[i]["progSavAh"] == "N") fnObj.grid2.target.list[i]["savAh"] = "N";
                                if (fnObj.grid2.target.list[i]["progExlAh"] == "N") fnObj.grid2.target.list[i]["exlAh"] = "N";
                                if (fnObj.grid2.target.list[i]["progFn1Ah"] == "N") fnObj.grid2.target.list[i]["fn1Ah"] = "N";
                                if (fnObj.grid2.target.list[i]["progFn2Ah"] == "N") fnObj.grid2.target.list[i]["fn2Ah"] = "N";
                                if (fnObj.grid2.target.list[i]["progFn3Ah"] == "N") fnObj.grid2.target.list[i]["fn3Ah"] = "N";
                                if (fnObj.grid2.target.list[i]["progFn4Ah"] == "N") fnObj.grid2.target.list[i]["fn4Ah"] = "N";
                                if (fnObj.grid2.target.list[i]["progFn5Ah"] == "N") fnObj.grid2.target.list[i]["fn5Ah"] = "N";
                                update_list.push(fnObj.grid2.target.list[i]);
                            }
                        }

                        var delete_pars = [];
                        for (var i = 0, l = fnObj.grid2.removedList.length; i < l; i++) {
                            delete_pars.push("mnuCd=" + fnObj.grid2.removedList[i]);
                        }

                        // step 권한그룹명 저장
                        app.ajax(
                                {
                                    type: "PUT",
                                    url: "/api/v1/auth/groups",
                                    data: Object.toJSON([item])
                                },
                                function (res) {
                                    if (res.error) {
                                        alert(res.error.message);
                                    }
                                    else {

                                        var put_fn = function () {
                                            // step 권한그룹메뉴 등록
                                            //trace(update_list);
                                            app.ajax({
                                                type: "PUT",
                                                url: "/api/v1/auth/groups/menus",
                                                data: Object.toJSON(update_list)
                                            }, function (res) {
                                                // step 권한그룹메뉴 등록
                                                if (res.error) {
                                                    alert(res.error.message);
                                                }
                                                else {
                                                    toast.push("저장 되었습니다.");
                                                    fnObj.grid.setPage(fnObj.grid.pageNo);
                                                    fnObj.form.add();
                                                }
                                            });
                                        };

                                        // step 권한그룹메뉴 삭제
                                        if (delete_pars.length > 0) {
                                            //trace("grpAuthCd="+ $("#grpAuthCd").val() +"&" + delete_pars.join("&"));
                                            app.ajax({
                                                type: "DELETE",
                                                url: "/api/v1/auth/groups/menus?" + "grpAuthCd=" + $("#grpAuthCd").val() + "&" + delete_pars.join("&"),
                                                data: ""
                                            }, function (res) {

                                                if (res.error) {
                                                    alert(res.error.message);
                                                }
                                                else {
                                                    put_fn();
                                                }
                                            });
                                        }
                                        else {
                                            put_fn();
                                        }

                                    }
                                }
                        );

                    }
                }
            };
        </script>
    </ax:div>
</ax:layout>