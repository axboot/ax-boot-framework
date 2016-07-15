var RESIZE_ELEMENTS = [];

/**
 * CODE
 */
var CODE = app.CODE({
    "etc3": [
        {CD: '1', NM: "코드"},
        {CD: '2', NM: "CODE"},
        {CD: '4', NM: "VA"}
    ]
});

/**
 * actions
 */
var ACTIONS = $.extend(app.ACTIONS, {
    PAGE_SEARCH: 'PAGE_SEARCH',
    PAGE_SAVE: 'PAGE_SAVE',
    PAGE_EXCEL: 'PAGE_EXCEL',
    PAGE_DEL: 'PAGE_DEL',
    FORM_CLEAR: 'FORM_CLEAR',
    FORM_SAVE_OK: 'FORM_SAVE_OK',

    RECEIVE_LIST: 'RECEIVE_LIST',
    PAGING_LIST: 'PAGING_LIST',
    CLICK_LIST_ITEM: 'CLICK_LIST_ITEM'
});

var fnObj = {
    dispatch: function (caller, act, data) {
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                app.net.ajax({type: "GET", url: "/api/v1/samples/parent", data: data}, function (res) {
                    ACTIONS.dispatch(null, ACTIONS.RECEIVE_LIST, res);
                });
                break;

            case ACTIONS.PAGE_SAVE:
                if (fnObj.formView0.validate()) {
                    app.net.ajax({type: "PUT", url: "/api/v1/samples/parent", data: JSON.stringify([data])}, function (res) {
                        app.net.ajax({type: "PUT", url: "/api/v1/samples/child", data: JSON.stringify(data.childList)}, function (res) {
                            ACTIONS.dispatch(null, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
                        });
                    });
                }
                break;

            case ACTIONS.RECEIVE_LIST:
                fnObj.gridView0.setData(data);
                fnObj.formView0.reset();
                break;
            case ACTIONS.PAGING_LIST:
                fnObj.searchView0.setData({pageNumber: data - 1});
                ACTIONS.dispatch(null, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
                break;
            case ACTIONS.CLICK_LIST_ITEM:

                // get childList
                app.net.ajax({type: "GET", url: "/api/v1/samples/child", data: "parentKey=" + data.key}, function (res) {
                    data.childList = res.list;
                    fnObj.formView0.setData(data);
                });

                break;

            case ACTIONS.FORM_CLEAR:
                fnObj.formView0.reset();
                break;

            default:

                return false;
        }
        // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
    }
};

/**
 * pageStart
 */
fnObj.pageStart = function () {
    this.toolbarView.initView();
    this.searchView0.initView();
    this.gridView0.initView();
    this.tabView0.initView();
    this.formView0.initView();

    ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
    return false;
};

/**
 * toolbarView
 */
fnObj.toolbarView = {
    initView: function () {
        var _this = this;

        $("#ax-page-btn-search").bind("click", function () {
            fnObj.searchView0.setData({pageNumber: 0});
            ACTIONS.dispatch(_this, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
        });

        $("#ax-page-btn-save").bind("click", function () {
            // 저장
            ACTIONS.dispatch(_this, ACTIONS.PAGE_SAVE, fnObj.formView0.getData());
        });

        $("#ax-page-btn-excel").bind("click", function () {
            // 엑셀
        });

        $("#ax-page-btn-fn1").bind("click", function () {
            // 삭제
        });
    }
};

/**
 * searchView#0
 */
fnObj.searchView0 = {
    startDate: $('#startDate'),
    endDate: $('#endDate'),
    radioBox: $('[data-ax-id="radioBox"]'),
    checkBox: $('[data-ax-id="checkBox"]'),
    comboBox: $('#comboBox'),
    searchParams: $('#searchParams'),
    singleDate: $('#singleDate'),
    pageNumber: 0,
    pageSize: $('#pageSize'),

    initView: function () {
        $("#page-search-view").attr("onsubmit", '$("#ax-page-btn-search").trigger("click");return false;');

        var
            today = new Date(),
            _this = this
            ;

        // bind script;
        this.endDate.bindTwinDate({
            startTargetID: "startDate"
        });

        this.startDate.val(today.print());
        this.endDate.val(today.print());

        this.singleDate
            .bindDate()
            .val(today.print());

        this.comboBox
            .bindSelect();

        this.pageSize
            .bindNumber({min: 1})
            .val(10);

        // ACTIONS.registStore([this, this.onChange]);
    },
    getData: function () {
        return {
            startDate: this.startDate.val(),
            endDate: this.endDate.val(),
            radioBox: this.radioBox.filter(":checked").val(),
            checkBox: (function () {
                var vals = [];
                this.checkBox.filter(":checked").each(function () {
                    vals.push(this.value);
                });
                return vals.join(',');
            }).call(this),
            comboBox: this.comboBox.val(),
            searchParams: this.searchParams.val(),
            singleDate: this.singleDate.val(),

            pageNumber: this.pageNumber,
            pageSize: this.pageSize.val()
        };
    },
    setData: function (data) {
        for (var k in data) {
            this[k] = data[k];
        }
        return true;
    },
    onChange: function () {

    }
};

/**
 * gridView#0
 */
fnObj.gridView0 = {
    initView: function () {
        var
            _this = this
            ;

        $('#ax-grid-btn-add').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID_ITEM_ADD, null);
        });
        $('#ax-grid-btn-del').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID_ITEM_REMOVE, null);
        });

        app.builder.grid.build(this, {
            targetID: "page-grid-view0",
            pageId: '${pageId}',
            colGroup: app.builder.grid.col.build({
                "key": {
                    label: "코드", width: "80", align: "left"
                },
                "value": {
                    label: "이름", width: "100"
                },
                "etc1": {
                    label: "날짜", width: "80"
                },
                "etc2": {
                    label: "컬럼1", width: "80"
                },
                "etc3": {
                    label: "선택타입", width: "80", align: "center", formatter: function () {
                        return CODE.etc3.map[this.value];
                    }
                }
            }),
            body: {
                onclick: function () {
                    ACTIONS.dispatch(this, ACTIONS.CLICK_LIST_ITEM, this.item);
                }
            },
            page: {
                display: true,
                paging: true,
                onchange: function (pgNo) {
                    ACTIONS.dispatch(this, ACTIONS.PAGING_LIST, pgNo);
                }
            }
        });

        ACTIONS.registStore([this, this.onChange]);
    },
    getData: function () {
        return {};
    },
    setData: function (res) {
        this.target.setData(app.builder.grid.getGridData(res));
    },
    onChange: function () {

    }
};

fnObj.tabView0 = {
    target: $("#cx-tab-01"),
    selecteValue: "tab-content-01",
    initView: function () {
        var _this = this;
        this.target.bindTab({
            theme : "AXTabs",
            options:[
                {optionValue:"tab-content-01", optionText:"기본정보"},
                {optionValue:"tab-content-02", optionText:"상세정보"}
            ],
            onchange: function(selectedObject, value) {
                $("#"+_this.selecteValue).hide();
                _this.selecteValue = value;
                $("#"+_this.selecteValue).show();
                $(window).resize(); // axisj 각요소의 정렬을 위해 resize 이벤트 강제 발생
            }
        });
        this.target.setValueTab(this.selecteValue);
    }
};

/**
 * formView#0
 */
fnObj.formView0 = {
    modelTarget: $("#model-form"),
    model: new AXBinder(),
    getBasicData: function () {
        var data = {
            key: "",
            childList: []
        };
        return data;
    },
    initView: function (data) {
        var
            _this = this
            ;

        $("#ax-form-btn-new").bind("click", function () {
            ACTIONS.dispatch(this, ACTIONS.FORM_CLEAR, null);
        });

        $("#ax-form-period-add").bind("click", function () {
            _this.model.add("childList", {"@isNew": true, key: "", value: ""});
        });

        data = $.extend(true, {}, this.getBasicData());
        this.model.set_model(data, this.modelTarget);

        this.model.onclick("childList", function () {
            if (this.value == "remove") {
                _this.model.remove(this.repeat_path, this.item_index);
            }
        });

        $('#date-etc1').bindDate();
        $('#selector-etc3').bindSelector({
            reserveKeys: {
                optionVaue: "CD",
                optionText: "NM"
            },
            options: CODE.etc3,
            onchange: function () {
                //console.log(this);
                if (this.selectedOption) {
                    _this.model.set("etc3", this.selectedOption.CD);
                }
            }
        });

        ACTIONS.registStore([this, this.onChange]);
    },
    getData: function () {
        var data = this.model.get();

        // childList 에 부모키 주입
        data.childList.forEach(function (n) {
            n.parentKey = data.key;
        });

        return data;
    },
    setData: function (data) {
        if (typeof data == "undefined") {
            $('[data-ax-path="key"]').removeAttr("readonly");
        }
        else {
            $('[data-ax-path="key"]').attr("readonly", "readonly");
            if (data.etc3) {
                data.etc3label = CODE.etc3.map[data.etc3];
            }
            if (!data.childList || data.childList.length == 0) {
                data.childList = this.getBasicData().childList;
            }
        }
        this.model.set_model(data || this.getBasicData());
    },
    validate: function () {
        var rs = this.model.validate();
        if (rs.error) {
            alert(rs.error[0].jquery.attr("title") + '을(를) 입력해주세요.');
            rs.error[0].jquery.focus();
            return false;
        }
        return true;
    },
    reset: function () {
        this.setData();
    },
    onChange: function () {
        console.log(arguments);
    }
};