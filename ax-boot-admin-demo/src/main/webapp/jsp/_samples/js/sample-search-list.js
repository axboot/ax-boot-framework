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
    GRID_ITEM_REMOVE: 'GRID_ITEM_REMOVE',

    SEARCH_COUNTRY_FIND: 'SEARCH_COUNTRY_FIND',
    GRID_CELL_CLICKED: 'GRID_CELL_CLICKED'
});

/**
 * CODE
 */
var CODE = app.CODE({
    "CATEGORY": [
        {code: '1', codeNm: "코드 01"},
        {code: '2', codeNm: "코드 02"},
        {code: '3', codeNm: "코드 03"},
        {code: '11', codeNm: "코드 11", parentCode:'1'},
        {code: '12', codeNm: "코드 12", parentCode:'1'},
        {code: '13', codeNm: "코드 13", parentCode:'1'},
        {code: '111', codeNm: "코드 111", parentCode:'11'},
        {code: '112', codeNm: "코드 112", parentCode:'11'},
        {code: '113', codeNm: "코드 113", parentCode:'11'}
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

            case ACTIONS.PAGE_EXCEL:

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
                fnObj.gridView0.removeItem();
                break;

            case ACTIONS.SEARCH_COUNTRY_FIND:
                app.modal.open({
                    url: "samples-modal-03.jsp",
                    pars: "callBack=fnObj.modalCallback&callBackType=국가코드선택&searchParams=" + data,
                    width: 600
                    //width:500, // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                    //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                });
                break;
            case ACTIONS.GRID_CELL_CLICKED:
                //console.log(data);
                app.modal.open({
                    url: "samples-modal-03.jsp",
                    pars: "callBack=fnObj.modalCallback&callBackType=regCode&searchParams=" + data.value + "&itemIndex=" + data.itemIndex,
                    width: 600
                    //width:500, // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                    //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                });
                break;
            default:

                return false;
        }
        // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
    },
    modalCallback: function (type, data) {

        if(type == "국가코드선택"){

            fnObj.searchView0.setData({
                countryCD: data.key,
                countryNM: data.value
            });
        }else{
            fnObj.gridView0.setValue({
                itemIndex: data.itemIndex,
                columnName: "regCode",
                value: data.key
            });
        }
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
            ACTIONS.dispatch(fnObj, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
        });

        $("#ax-page-btn-save").bind("click", function () {
            // 저장
            ACTIONS.dispatch(fnObj, ACTIONS.PAGE_SAVE, fnObj.gridView0.getData());
        });

        $("#ax-page-btn-excel").bind("click", function () {
            // 엑셀
            ACTIONS.dispatch(fnObj, ACTIONS.PAGE_EXCEL, null);
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
    singleDate: $('#singleDate'),
    dateType: $('[data-ax-id="dateType"]'),
    startDate: $('#startDate'),
    endDate: $('#endDate'),
    country: $('[data-ax-id="country"]'),
    singleYM: $('#singleYM'),
    startYM: $('#startYM'),
    endYM: $('#endYM'),
    group: $('#group'),
    category1: $('#category1'),
    category2: $('#category2'),
    category3: $('#category3'),
    countryCD: $('#countryCD'),
    countryFinder: $('#countryFinder'),
    countryNM: $('#countryNM'),

    initView: function () {
        $("#page-search-view").attr("onsubmit", '$("#ax-page-btn-search").trigger("click");return false;');

        var
            today = new Date(),
            _this = this;

        //접수일자
        this.singleDate
            .bindDate()
            .val(today.print());

        //접수일자 다음 라디오
        //app.form.setValue(this.dateType, "F");

        //기간
        this.endDate.bindTwinDate({
            startTargetID: "startDate"
        });
        this.startDate.val(today.print());
        this.endDate.val(today.print());

        //국가선택
        //app.form.setValue(this.country, ["USA", "CHINA"]);

        //접수년월
        this.singleYM
            .bindDate({selectType: "m"})
            .val(today.print("yyyy-mm"));

        //년월기간
        this.endYM.bindTwinDate({
            selectType: "m",
            startTargetID: "startYM"
        });
        this.startYM.val(today.print("yyyy-mm"));
        this.endYM.val(today.print("yyyy-mm"));

        this.setGroupValue();
        this.setCategoryValue();

        //국가코드선택
        this.countryFinder.click(function () {
            ACTIONS.dispatch(fnObj, ACTIONS.SEARCH_COUNTRY_FIND, _this.countryNM.val());
        });

    },
    getData: function () {
        return {
            singleDate: this.singleDate.val(),
            dateType: this.dateType.filter(":checked").val(),
            startDate: this.startDate.val(),
            endDate: this.endDate.val(),
            country: (
                function () {
                    var vals = [];
                    this.country.filter(":checked").each(function () {
                        vals.push(this.value);
                    });
                    return vals.join(',');
                }).call(this),
            singleYM: this.singleYM.val(),
            startYM: this.startYM.val(),
            endYM: this.endYM.val(),
            group: this.group.val(),
            category1: this.category1.val(),
            category2: this.category2.val(),
            category3: this.category3.val(),
            countryCD: this.countryCD.val(),
            countryNM: this.countryNM.val()
        };
    },
    onChange: function () {

    },
    setData: function(data){
        for(var k in data){
            this[k].val(data[k]);
        }
    },
    setGroupValue: function(v1){
        var _this = this,
            groupOptions1 = [];

        this.group.unbindSelect().empty();
        this.group.bindSelect({
            reserveKeys: {
                optionValue: "code",
                optionText: "codeNm"
            },
            isspace: true, isspaceTitle: "전체선택",
            options: groupOptions1,
            setValue: v1,
            onchange: function () {
                //_this.setCategoryValue(this.value);
            }
        });
    },
    setCategoryValue: function (v1, v2, v3) {
        var _this = this,
            categoryOptions1 = [],
            categoryOptions2 = [],
            categoryOptions3 = [];

        CODE.CATEGORY.forEach(function (n) {
            if (!n.parentCode) categoryOptions1.push(n);
            if (typeof v1 != "undefined") {
                if (n.parentCode == v1) categoryOptions2.push(n);
            }
            if (typeof v2 != "undefined") {
                if (n.parentCode == v2) categoryOptions3.push(n);
            }
        });
        
        this.category1.unbindSelect().empty();
        this.category1.bindSelect({
            reserveKeys: {
                optionValue: "code",
                optionText: "codeNm"
            },
            isspace: true, isspaceTitle: "전체선택",
            options: categoryOptions1,
            setValue: v1,
            onchange: function () {
                _this.setCategoryValue(this.value);
            }
        });
        this.category2.unbindSelect().empty();
        this.category2.bindSelect({
            reserveKeys: {
                optionValue: "code",
                optionText: "codeNm"
            },
            isspace: true, isspaceTitle: "전체선택",
            options: categoryOptions2,
            setValue: v2,
            onchange: function () {
                _this.setCategoryValue(v1, this.value);
            }
        });
        this.category3.unbindSelect().empty();
        this.category3.bindSelect({
            reserveKeys: {
                optionValue: "code",
                optionText: "codeNm"
            },
            isspace: true, isspaceTitle: "전체선택",
            options: categoryOptions3,
            setValue: v3,
            onchange: function () {
                _this.setCategoryValue(v1, v2, this.value);
            }
        });
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



