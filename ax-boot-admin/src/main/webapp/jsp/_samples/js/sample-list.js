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
                //this.formView0.setData(data);
                break;

            case ACTIONS.GRID_ITEM_ADD:
                this.gridView0.addItem();
                break;

            case ACTIONS.GRID_ITEM_REMOVE:
                if(data.keyParam.length > 0) {
                    app.net.ajax({type: "DELETE", url: "/api/v1/samples/parent?" + data.keyParam.join("&"), data: ""}, function (res) {
                        fnObj.gridView0.removeItem(data.checkedList);
                    });
                }
                else{
                    fnObj.gridView0.removeItem(data.checkedList);
                }
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

        $('#ax-grid0-btn-add').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID_ITEM_ADD, null);
        });
        $('#ax-grid0-btn-del').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID_ITEM_REMOVE, _this.getCheckedItem());
        });

        app.builder.grid.build(this, {
            targetID: "page-grid-view0",
            pageId: '${pageId}',
            colGroup: app.builder.grid.col.build({
                "index": {
                    label: "선택", width: "35", align: "center", formatter: "checkbox"
                },
                "key": {
                    label: "코드", width: "100", align: "left",
                    editor: {
                        type: "text",
                        maxLength: 8,
                        disabled: function () {
                            return this.item._CUD != "C";
                        },
                        beforeUpdate: function (val) {
                            var hasCd = false, index = this.index;
                            _this.target.list.forEach(function (item, i) {
                                if (item.key == val && i != index) {
                                    hasCd = true;
                                    return false;
                                }
                            });
                            if (hasCd) _this.target.list[index].__edting__ = true;
                            return (hasCd) ? "" : val;
                        },
                        afterUpdate: function () {
                            if (this.item.key == "" && this.item.__edting__) toast.push("코드값이 중복됩니다. 입력이 취소 되었습니다.");
                            delete _this.target.list[this.index].__edting__;
                        }
                    }
                },
                "value": {
                    label: "이름", width: "150",
                    editor: {
                        type: "text",
                        maxLength: 50
                    }
                },
                "etc1": {
                    label: "날짜", width: "150",
                    editor: {
                        type: "calendar",
                        config: {
                            separator: "-"
                        }
                    }
                },
                "etc2": {
                    label: "컬럼1", width: "150",
                    editor: {
                        type: "text",
                        maxLength: 50
                    }
                },
                "etc3": {
                    label: "선택타입", width: "150", align: "center",
                    editor: {
                        type: "select",
                        optionValue: "CD",
                        optionText: "NM",
                        options: CODE.etc3,
                        beforeUpdate: function (val) { // 수정이 되기전 value를 처리 할 수 있음.
                            return val; // return 이 반드시 있어야 함.
                        }
                    }
                }
            }),
            body: {
                onclick: function () {
                    ACTIONS.dispatch(this, ACTIONS.CLICK_LIST_ITEM, this.item);
                }
            }
        });


        $("#target").click(function(){
           console.log(this);
            _this.addItem();
            fnObj.gridView0.addItem();
        });

        //ACTIONS.registStore([this, this.onChange]);
    },
    addItem: function () {
        this.target.pushList({});
        this.target.setFocus(this.target.list.length - 1);
    },
    getCheckedItem: function(){
        var
            _this = this,
            checkedList = this.target.getCheckedListWithIndex(0),
            keyParams = []
        ;
        
        $.each(checkedList, function () {
            if (this.item._CUD != "C") {
                keyParams.push("key=" + this.item.key); // ajax delete 요청 목록 수집
            }
        });

        return {
            keyParam: keyParams,
            checkedList: checkedList
        };
    },
    removeItem: function (data) {
        this.target.removeListIndex(data);
        toast.push("삭제 되었습니다.");
        return false;
    },
    getData: function () {
        var
            liveList = [],
            removedList = []
            ;

        $.each(this.target.list, function(){
            if(this.key != ""){
                liveList.push(this);
            }
        });

        $.each(this.target.removedList, function(){
            if(this._CUD != "C") {
                this.deleted = true;
                removedList.push(this);
            }
        });

        this.setData(liveList);
        return liveList.concat(removedList);
    },
    setData: function (res) {
        this.target.setData(app.builder.grid.getGridData(res));
    },
    onChange: function () {
        //console.log(arguments);
        toast.push(arguments[1]);
    }
};