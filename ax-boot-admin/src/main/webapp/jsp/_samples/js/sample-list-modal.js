var RESIZE_ELEMENTS = [
    {
        id: "page-grid-view0"
    }
];

/**
 * ACTIONS
 */
var ACTIONS = $.extend(app.ACTIONS, {
    PAGE_SEARCH: 'PAGE_SEARCH',
    PAGE_SAVE: 'PAGE_SAVE',
    PAGE_EXCEL: 'PAGE_EXCEL',
    PAGE_DEL: 'PAGE_DEL',

    RECEIVE_LIST: 'RECEIVE_LIST',
    CLICK_LIST_ITEM: 'CLICK_LIST_ITEM',

    GRID_ITEM_ADD: 'GRID_ITEM_ADD',
    GRID_ITEM_REMOVE: 'GRID_ITEM_REMOVE'
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

var fnObj = {
    dispatch: function (caller, act, data) {
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                app.net.ajax({type: "GET", url: "/api/v1/samples/parent", data: data}, function (res) {
                    ACTIONS.dispatch(null, ACTIONS.RECEIVE_LIST, res);
                });
                break;

            case ACTIONS.PAGE_SAVE:
                app.net.ajax({type: "PUT", url: "/api/v1/samples/parent", data: JSON.stringify(data)}, function (res) {
                    ACTIONS.dispatch(null, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
                });
                break;

            case ACTIONS.RECEIVE_LIST:
                this.gridView0.setData(data);
                break;

            case ACTIONS.CLICK_LIST_ITEM:
                app.modal.open({
                    url:"samples-modal-01.jsp",
                    pars:"callBack=fnObj.modalCallback&itemIndex=" + data
                    //width:500, // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                    //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                });
                break;

            default:

                return false;
        }
        // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
    },
    modalCallback: function(){
        console.log(arguments);
        app.modal.close();
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
            ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
        });

        $("#ax-page-btn-save").bind("click", function () {
            // 저장
            ACTIONS.dispatch(this, ACTIONS.PAGE_SAVE, fnObj.gridView0.getData());
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
    autoCompleteCode: $('#autoCompleteCode'),
    autoComplete: $('#autoComplete'),

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

        this.autoComplete
            .bindSelector({
                appendable: true,
                options: [
                    {optionValue: 1, optionText: "Seoul"},
                    {optionValue: 2, optionText: "대구"},
                    {optionValue: 3, optionText: "대전"},
                    {optionValue: 4, optionText: "(창원"},
                    {optionValue: 5, optionText: "[마산"},
                    {optionValue: 6, optionText: "구례"},
                    {optionValue: 7, optionText: "제주도"},
                    {optionValue: 8, optionText: "전주"},
                    {optionValue: 4, optionText: "창원"},
                    {optionValue: 5, optionText: "마산"},
                    {optionValue: 6, optionText: "구례"},
                    {optionValue: 7, optionText: "제주도"},
                    {optionValue: 8, optionText: "전주"},
                    {optionValue: 9, optionText: "Gwangju"}
                ],
                onchange: function () {
                    if (this.selectedOption) {
                        _this.autoCompleteCode.val(this.selectedOption.optionValue);
                    }
                }
            });

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
            autoCompleteCode: this.autoCompleteCode.val(),
            autoComplete: this.autoComplete.val()
        };
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
                    ACTIONS.dispatch(this, ACTIONS.CLICK_LIST_ITEM, this.index);
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