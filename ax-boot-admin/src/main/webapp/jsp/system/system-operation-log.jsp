<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<ax:layout name="base.jsp">
    <ax:set name="title" value="${PAGE_NAME}"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>

    <ax:div name="css">
        <link rel="stylesheet" type="text/css" href="<c:url value='/static/plugins/CodeMirror/lib/codemirror.css' />"/>
        <link rel="stylesheet" type="text/css"
              href="<c:url value='/static/plugins/CodeMirror/addon/fold/foldgutter.css' />"/>
        <link rel="stylesheet" type="text/css" href="<c:url value='/static/plugins/CodeMirror/addon/lint/lint.css' />"/>
        <link rel="stylesheet" type="text/css" href="<c:url value='/static/plugins/CodeMirror/theme/eclipse.css' />"/>

        <style>
            .CodeMirror {
            / / border: 1 px solid #ccc;
                line-height: 1.7em;
                font-size: 12px;
            }
        </style>
    </ax:div>
    <ax:div name="js">
        <script src="<c:url value='/static/plugins/CodeMirror/lib/codemirror.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/mode/loadmode.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/lib/util/formatting.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/mode/javascript/javascript.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/mode/xml/xml.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/mode/htmlmixed/htmlmixed.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/mode/clike/clike.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/fold/foldcode.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/fold/foldgutter.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/fold/brace-fold.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/fold/xml-fold.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/fold/markdown-fold.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/fold/comment-fold.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/selection/active-line.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/edit/closebrackets.js' />"></script>
        <script src="<c:url value='/static/plugins/CodeMirror/addon/edit/closetag.js' />"></script>
    </ax:div>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button"/>
                <div class="ax-search" id="page-search-box"></div>

                <ax:custom customid="table">
                    <ax:custom customid="tr">
                        <ax:custom customid="td">

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-table"></i> 에러목록</h2>
                                </div>
                                <div class="right">
                                    <button type="button" class="AXButton" id="ax-grid1-btn-del"><i
                                            class="axi axi-minus-circle"></i> 삭제
                                    </button>
                                    <button type="button" class="AXButton" id="ax-grid1-btn-del-all"><i
                                            class="axi axi-delete2"></i> 전체삭제
                                    </button>
                                </div>
                                <div class="ax-clear"></div>
                            </div>
                            <%-- %%%%%%%%%% 그리드 %%%%%%%%%% --%>
                            <div class="ax-grid" id="page-grid-box" style="min-height: 250px; max-height:250px;"></div>
                        </ax:custom>
                    </ax:custom>
                    <ax:custom customid="tr">
                        <ax:custom customid="td">

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-table"></i> Stack Trace</h2>
                                </div>
                                <div class="right" id="error-date" style="color:#ff3300;font-weight:bold;">
                                    <!--<button type="button" class="AXButton" id="ax-form-btn-new"><i class="axi axi-plus-circle"></i> 신규</button>-->
                                </div>
                                <div class="ax-clear"></div>
                            </div>

                            <div id="trace-target" class="AXTextarea" style="padding:0px;overflow: hidden;"></div>

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-table"></i> 에러 메시지</h2>
                                </div>
                                <div class="right">
                                    <!--<button type="button" class="AXButton" id="ax-form-btn-new"><i class="axi axi-plus-circle"></i> 신규</button>-->
                                </div>
                                <div class="ax-clear"></div>
                            </div>

							<textarea class="AXTextarea" id="message-target"
                                      style="width:100%;box-sizing: border-box;height:50px;font-size: 12px;line-height: 1.6;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-table"></i> Request 파라미터 정보</h2>
                                </div>
                                <div class="right">
                                    <!--<button type="button" class="AXButton" id="ax-form-btn-new"><i class="axi axi-plus-circle"></i> 신규</button>-->
                                </div>
                                <div class="ax-clear"></div>
                            </div>

							<textarea class="AXTextarea" id="request-parameter-map"
                                      style="width:100%;box-sizing: border-box;height:150px;font-size: 12px;line-height: 1.3;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-table"></i> Request 헤더 정보</h2>
                                </div>
                                <div class="right">
                                    <!--<button type="button" class="AXButton" id="ax-form-btn-new"><i class="axi axi-plus-circle"></i> 신규</button>-->
                                </div>
                                <div class="ax-clear"></div>
                            </div>

							<textarea class="AXTextarea" id="request-header-map"
                                      style="width:100%;box-sizing: border-box;height:150px;font-size: 12px;line-height: 1.3;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-table"></i> Request 사용자 정보</h2>
                                </div>
                                <div class="right">
                                    <!--<button type="button" class="AXButton" id="ax-form-btn-new"><i class="axi axi-plus-circle"></i> 신규</button>-->
                                </div>
                                <div class="ax-clear"></div>
                            </div>

							<textarea class="AXTextarea" id="request-user-info"
                                      style="width:100%;box-sizing: border-box;height:150px;font-size: 12px;line-height: 1.3;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>

                            <div id="test-el"></div>
                        </ax:custom>
                    </ax:custom>
                </ax:custom>

            </ax:col>
        </ax:row>
        <div class="H10"></div>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var RESIZE_ELEMENTS = [
                {id: "page-grid-box", adjust: -55},
                {
                    id: "trace-target", adjust: function () {
                    return -200;
                }
                }
            ];
            var fnObj = {
                CODES: {
                    "etc3": [
                        {CD: '1', NM: "코드"},
                        {CD: '2', NM: "CODE"},
                        {CD: '4', NM: "VA"}
                    ],
                    "_etc3": {"1": "코드", "2": "CODE", "4": "VA"}
                },
                pageStart: function () {
                    this.search.bind();
                    this.grid.bind();
                    this.form.bind();
                    this.editor.bind();
                    this.bindEvent();
                    // 페이지 로딩 후 바로 검색 처리하기 (option)
                    this.search.submit();

                    this.pageResize();
                },
                pageResize: function () {
                    //var ch = axf.clientHeight() - 450;
                    setTimeout(function () {
                        fnObj.editor.target.setSize("100%", ($("#trace-target").innerHeight()));
                    }, 100);
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

                    //ax-grid1-btn-del
                    $("#ax-grid1-btn-del").bind("click", function () {
                        fnObj.del();
                    });

                    $("#ax-grid1-btn-del-all").bind("click", function () {
                        fnObj.delAll();
                    });
                },
                search: {
                    target: new AXSearch(),
                    bind: function () {
                        var _this = this;
                        this.target.setConfig({
                            targetID: "page-search-box",
                            theme: "AXSearch",
                            onsubmit: function () {
                                fnObj.search.submit();
                            },
                            rows: [
                                {
                                    display: true, addClass: "", style: "", list: [
                                    {
                                        label: "검색",
                                        labelWidth: "",
                                        type: "inputText",
                                        width: "150",
                                        key: "searchParams",
                                        addClass: "",
                                        valueBoxStyle: "",
                                        value: "",
                                        onChange: function (changedValue) {
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

                progress: new AXProgress(),
                del: function () {

                    var _this = this;
                    var delete_queue = [];
                    $.each(fnObj.grid.target.getCheckedList(0), function () {
                        delete_queue.push(this.id);
                    });
                    if (delete_queue.length == 0) {
                        alert("삭제할 목록을 선택해주세요");
                        return;
                    }

                    if (!confirm("정말 삭제하시겠습니까?")) return;

                    this.progress.setConfig({
                        theme: "AXlineProgress",
                        totalCount: delete_queue.length,
                        width: 400,
                        top: 100,
                        title: "삭제중입니다",
                        duration: 50
                    });

                    mask.open();

                    this.progress.start(function () {
                        if (this.isEnd) {
                            _this.progress.close();
                            mask.close();
                            toast.push("삭제 처리 되었습니다.");
                            fnObj.search.submit();
                        }
                        else {
                            var pars;
                            if (pars = delete_queue.shift()) {
                                app.ajax({
                                    type: "DELETE", url: "/api/v1/errorLogs/" + pars, data: ""
                                }, function (res) {
                                    if (res.error) {
                                        console.log(res.error);
                                    }
                                    else {
                                        _this.progress.update();
                                    }
                                });
                            }
                            else {
                                _this.progress.update();
                            }
                        }
                    });
                },
                delAll: function () {
                    if (!confirm("정말 삭제하시겠습니까?")) return;
                    app.ajax({
                                type: "DELETE", url: "/api/v1/errorLogs/events/all", data: ""
                            },
                            function (res) {
                                if (res.error) {
                                    console.log(res.error);
                                }
                                else {
                                    toast.push("삭제 처리 되었습니다.");
                                    fnObj.search.submit();
                                }
                            });
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
                                {key: "index", label: "선택", width: "35", align: "center", formatter: "checkbox"},
                                {key: "id", label: "ID", width: "60", align: "center"},
                                {key: "phase", label: "빌드단계", width: "80", align: "center"},
                                {key: "system", label: "시스템명", width: "70", align: "center"},
                                {key: "serverName", label: "서버명", width: "100", align: "center"},
                                {key: "hostName", label: "호스트명", width: "100", align: "center"},
                                {key: "path", label: "URL", width: "100", align: "center"},
                                {key: "message", label: "에러 메시지", width: "400"},
                                {
                                    key: "errorDatetime",
                                    label: "발생시간",
                                    width: "140",
                                    align: "center",
                                    formatter: function () {
                                        return this.value.date().print('yyyy/mm/dd hh:mi:ss');
                                    }
                                }
                            ],
                            body: {
                                onclick: function () {
                                    fnObj.form.setJSON(this.item);
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
                    },
                    setPage: function (pageNo, searchParams) {
                        var _target = this.target;
                        this.pageNo = pageNo;

                        app.ajax({
                            type: "GET",
                            url: "/api/v1/errorLogs",
                            data: "sort=id,desc&dummy=" + axf.timekey() + "&pageNumber=" + (pageNo - 1) + "&pageSize=" + app.grid.page_size + "&" + (searchParams || fnObj.search.target.getParam())
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
                                // console.log(gridData);
                                _target.setData(gridData);
                            }
                        });
                    }
                },

                /*******************************************************
                 * 상세 폼
                 */
                form: {
                    target: $('#form-info'),
                    validate_target: new AXValidator(),
                    bind: function () {
                        var _this = this
                    },
                    setJSON: function (item) {
                        var _this = this;

                        fnObj.editor.setValue(item.trace);

                        $("#message-target").val(item.message);
                        $("#request-parameter-map").val(JSON.stringify((JSON.parse(item.parameterMap)), null, 4));
                        $("#request-header-map").val(JSON.stringify((JSON.parse(item.headerMap)), null, 4));
                        $("#request-user-info").val(JSON.stringify((JSON.parse(item.userInfo)), null, 4));
                        $("#error-date").html(
                                "[ " + item.path + " ] &nbsp;&nbsp;&nbsp; " +
                                item.errorDateTime.date()
                        );

                        /*
                         // 수정시 입력 방지 처리 필드 처리
                         $('#info-key').attr("readonly", "readonly");

                         var info = $.extend({}, item);
                         app.form.fillForm(_this.target, info, 'info-');
                         // 추가적인 값 수정이 필요한 경우 처리
                         // $('#info-useYn').bindSelectSetValue( info.useYn );
                         */
                    },
                    getJSON: function () {
                        return app.form.serializeObjectWithIds(this.target, 'info-');
                    },
                    clear: function () {
                        app.form.clearForm(this.target);
                        $('#info-key').removeAttr("readonly");
                    }
                }, // form
                editor: {
                    mode: "json",
                    target: null,
                    bind: function () {
                        var _this = this;
                        // code mirror
                        this.target = CodeMirror(axf.getId("trace-target"), {
                            value: "",
                            mode: "text/x-java",
                            theme: "eclipse",

                            /*
                             specialChars:/[a]/,
                             specialCharPlaceholder: function(char){
                             console.log(char);
                             return document.getElementById("test-el");
                             },
                             */

                            indentUnit: 4,
                            smartIndent: true,
                            tabSize: 4,
                            indentWithTabs: true,

                            styleActiveLine: true,
                            lineNumbers: true,
                            lineWrapping: true,
                            matchBrackets: true,
                            foldGutter: true,
                            //gutters: ["CodeMirror-lint-markers", "CodeMirror-foldgutter"],

                            //autoCloseBrackets:true,
                            //autoCloseTags:true,

                            lint: true
                        });
                    },
                    getValue: function () {
                        return this.target.getValue();
                    },
                    setValue: function (val) {
                        return this.target.setValue(val);
                    },
                    execCommand: function (cmd) {
                        return this.target.execCommand(cmd);
                    }
                }
            };
        </script>
    </ax:div>
</ax:layout>