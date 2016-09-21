<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>


<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <script type="text/javascript">
            var __fnObj = {
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
                    //target: new AXSearch(),
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

                grid: {
                    pageNo: 1,
                    //target: new AXGrid(),
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
                    //validate_target: new AXValidator(),
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
        <script type="text/javascript" src="<c:url value='/assets/js/view/system/system-operation-log.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                        <ax:td label='<lang data-id="검색"></lang>' width="300px">
                            <input type="text" name="filter" id="filter" class="form-control" value="" placeholder="검색어를 입력하세요."/>
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>


        <ax:split-layout name="ax1" oriental="vertical">
            <ax:split-panel height="300" style="padding-bottom: 10px;">
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>
                            에러목록
                        </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="remove"><i class="cqc-circle-with-minus"></i> 삭제</button>
                        <button type="button" class="btn btn-default" data-grid-view-01-btn="removeAll"><i class="cqc-circle-with-minus"></i> 전체삭제</button>
                    </div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>
            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel height="*" style="padding-top: 10px;" scroll="scroll">

                <div class="H20"></div>

                <ax:form name="formView01">
                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="cqc-classic-computer"></i> Stack Trace</h2>
                        </div>
                    </div>

                    <div class="form-control" data-ax-path="trace" style="height:auto;"></div>

                    <div class="ax-button-group">
                        <div class="left">
                            <h3><i class="cqc-info-with-circle"></i> 에러 메시지</h3>
                        </div>
                    </div>

                    <textarea class="form-control" data-ax-path="message"
                              style="width:100%;box-sizing: border-box;height:50px;font-size: 12px;line-height: 1.6;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>

                    <div class="ax-button-group">
                        <div class="left">
                            <h3><i class="cqc-info-with-circle"></i> Request 파라미터 정보</h3>
                        </div>
                    </div>

                    <textarea class="form-control" data-ax-path="parameterMap"
                              style="width:100%;box-sizing: border-box;height:150px;font-size: 12px;line-height: 1.3;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>

                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="cqc-info-with-circle"></i> Request 헤더 정보</h2>
                        </div>
                        <div class="right">
                            <!--<button type="button" class="AXButton" id="ax-form-btn-new"><i class="axi axi-plus-circle"></i> 신규</button>-->
                        </div>
                    </div>

                    <textarea class="form-control" data-ax-path="headerMap"
                              style="width:100%;box-sizing: border-box;height:150px;font-size: 12px;line-height: 1.3;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>

                    <div class="ax-button-group">
                        <div class="left">
                            <h2><i class="cqc-info-with-circle"></i> Request 사용자 정보</h2>
                        </div>
                    </div>

                    <textarea class="form-control" data-ax-path="userInfo"
                              style="width:100%;box-sizing: border-box;height:150px;font-size: 12px;line-height: 1.3;font-family:'Monaco', 'Consolas';padding:10px;"></textarea>
                </ax:form>


            </ax:split-panel>
        </ax:split-layout>




    </jsp:body>
</ax:layout>