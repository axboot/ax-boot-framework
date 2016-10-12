var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: "/api/v1/samples/parent",
            data: this.searchView.getData(),
            callback: function (res) {
                caller.gridView01.setData(res);
            },
            options: {
                // axboot.ajax 함수에 2번째 인자는 필수가 아닙니다. ajax의 옵션을 전달하고자 할때 사용합니다.
                onError: function (err) {
                    console.log(err);
                }
            }
        });

        return false;
    },
    PAGE_SAVE: function (caller, act, data) {
        var saveList = [].concat(this.gridView01.getData("modified"));
        saveList = saveList.concat(this.gridView01.getData("deleted"));

        axboot.ajax({
            type: "PUT",
            url: "/api/v1/samples/parent",
            data: JSON.stringify(saveList),
            callback: function (res) {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                axToast.push("저장 되었습니다");
            }
        });
    },
    ITEM_CLICK: function (caller, act, data) {

    },
    ITEM_ADD: function (caller, act, data) {
        this.gridView01.addRow();
    },
    ITEM_DEL: function (caller, act, data) {
        this.gridView01.delRow("selected");
    },
    dispatch: function (caller, act, data) {
        var result = ACTIONS.exec(caller, act, data);
        if (result != "error") {
            return result;
        } else {
            // 직접코딩
            return false;
        }
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
        var _this = this;

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

        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 0,
            multipleSelect: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "key", label: "KEY", width: 160, align: "left", editor: "text"},
                {key: "value", label: "VALUE", width: 350, align: "left", editor: "text"},
                {key: "etc1", label: "ETC1", width: 100, align: "center", editor: "text"},
                {key: "ect2", label: "ETC2", width: 100, align: "center", editor: "text"},
                {key: "ect3", label: "ETC3", width: 100, align: "center", editor: "text"},
                {key: "ect4", label: "ETC4", width: 100, align: "center", editor: "text"}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex);
                }
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.key;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true}, "last");
    }
});