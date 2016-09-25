var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_SAVE: "PAGE_SAVE",
    ITEM_CLICK: "ITEM_CLICK",
    ITEM_ADD: "ITEM_ADD",
    ITEM_DEL: "ITEM_DEL",
    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/commonCodes",
                    data: this.searchView.getData()
                }, function (res) {
                    _this.gridView01.setData(res);
                }, {
                    onError: function (err) {
                        console.log(err);
                    }
                });
                break;
            case ACTIONS.ITEM_CLICK:

                break;
            case ACTIONS.ITEM_ADD:
                this.gridView01.addRow();
                break;
            case ACTIONS.ITEM_DEL:
                this.gridView01.delRow("selected");
                break;
            case ACTIONS.PAGE_SAVE:

                var saveList = [].concat(this.gridView01.getData("modified"));
                saveList = saveList.concat(this.gridView01.getData("deleted"));

                axboot.ajax({
                    type: "PUT",
                    url: "/api/v1/commonCodes",
                    data: JSON.stringify(saveList)
                }, function (res) {
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    axToast.push("저장 되었습니다");
                });
                break;

            default:
                return false;
        }
        return false;
    }
});

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    this.pageButtonView.initView();
    this.searchView.initView();
    this.gridView01.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};

fnObj.pageResize = function () {

};


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        var _this = this;
        $('[data-page-btn]').click(function () {
            _this.onClick(this.getAttribute("data-page-btn"));
        });
    },
    onClick: function (_act) {
        var _root = fnObj;
        switch (_act) {
            case "search":
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                break;
            case "save":
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
                break;
            case "excel":
                break;
            case "fn1":
                break;
            case "fn2":
                break;
            case "fn3":
                break;
            case "fn4":
                break;
            case "fn5":
                break;
        }
    }
});

//== view 시작
/**
 * searchView
 */
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter");
    },
    getData: function () {
        return {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            filter: this.filter.val()
        }
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {

        $('[data-grid-view-01-btn]').click(function () {
            var _act = this.getAttribute("data-grid-view-01-btn");
            switch (_act) {
                case "add":
                    ACTIONS.dispatch(ACTIONS.ITEM_ADD);
                    break;
                case "delete":
                    ACTIONS.dispatch(ACTIONS.ITEM_DEL);
                    break;
            }
        });

        var _this = this;
        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 0,
            sortable: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "groupCd", label: "분류코드", width: 250, align: "center", editor: {type: "text", disabled: "notCreated"}},
                {key: "groupNm", label: "분류명", width: 200, align: "center", editor: "text"},
                {key: "code", label: "코드", width: 100, align: "center", editor: {type: "text", disabled: "notCreated"}},
                {key: "name", label: "코드값", width: 150, align: "left", editor: "text"},
                {key: "sort", editor: "number"},
                {key: "useYn", editor: "checkYn"},
                {key: "remark", label: "비고", width: 200, align: "left", editor: "text"},
                {key: "data1", label: "데이터1", width: 70, align: "left", editor: "text"},
                {key: "data2", label: "데이터2", width: 70, align: "left", editor: "text"},
                {key: "data3", label: "데이터3", width: 70, align: "left", editor: "text"},
                {key: "data4", label: "데이터4", width: 70, align: "left", editor: "text"}
            ],
            body: {
                onClick: function () {
                    // this.self.select(this.dindex);
                }
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.groupCd && this.code;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true, posUseYn: "N", useYn: "Y"}, "last");
    }
});