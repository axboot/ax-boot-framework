var RESIZE_ELEMENTS = [
    {
        id: "page-grid-view0"
    }
];

/**
 * actions
 */
var ACTIONS = $.extend(app.ACTIONS, {
    PAGE_SEARCH: 'PAGE_SEARCH',
    PAGE_SAVE: 'PAGE_SAVE',
    PAGE_EXCEL: 'PAGE_EXCEL',
    PAGE_DEL: 'PAGE_DEL',

    RECEIVE_LIST: 'RECEIVE_LIST',
    PAGING_LIST: 'PAGING_LIST',
    CLICK_LIST_ITEM: 'CLICK_LIST_ITEM'
});

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

    /// CODE에 새로운 코드를 확장해야 한다면 app.CODE의 처번째 인자로 생성된 CODE를 전달하고 두번째 인자로 추가할 코드 오브젝트를 추가합니다.
    CODE = app.CODE(CODE, {
        "etc1": [
            {CD: '1', NM: "코드"},
            {CD: '2', NM: "CODE"},
            {CD: '4', NM: "VA"}
        ]
    });


var fnObj = {
    CODE: {
        "etc3": [
            {CD: '1', NM: "코드"},
            {CD: '2', NM: "CODE"},
            {CD: '3', NM: "CODE"},
            {CD: '4', NM: "VA"}
        ]
    },
    dispatch: function (caller, act, data) {
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                app.net.ajax({type: "GET", url: "/api/v1/samples/parent", data: data}, function (res) {
                    ACTIONS.dispatch(null, ACTIONS.RECEIVE_LIST, res);
                });
                break;

            case ACTIONS.PAGE_SAVE:

                break;

            case ACTIONS.RECEIVE_LIST:
                this.gridView0.setData(data);
                break;
            case ACTIONS.PAGING_LIST:
                fnObj.searchView0.setData({pageNumber: data - 1});
                ACTIONS.dispatch(null, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
                break;
            case ACTIONS.CLICK_LIST_ITEM:
                //this.formView0.setData(data);
                toast.push( JSON.stringify(data) );
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

    ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
    return false;
};

/**
 * toolbarView
 */
fnObj.toolbarView = {
    initView: function () {

        $("#ax-page-btn-search").bind("click", function () {
            fnObj.searchView0.setData({pageNumber: 0});
            ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
        });

        $("#ax-page-btn-save").bind("click", function () {
            // 저장
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
                "indexDesc": {
                    label: "indexDesc", width: "70", align: "center", formatter: function () {
                        return this.page.listCount - ((this.index) + (this.page.pageNo - 1) * this.page.pageSize);
                    }
                },
                "indexAsc": {
                    label: "indexAsc", width: "70", align: "center", formatter: function () {
                        return (this.index + 1) + (this.page.pageNo - 1) * this.page.pageSize;
                    }
                },
                "key": {
                    label: "코드", width: "100", align: "left"
                },
                "value": {
                    label: "이름", width: "150"
                },
                "etc1": {
                    label: "날짜", width: "150"
                },
                "etc2": {
                    label: "컬럼1", width: "150"
                },
                "etc3": {
                    label: "선택타입", width: "150", align: "center", formatter: function(){
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