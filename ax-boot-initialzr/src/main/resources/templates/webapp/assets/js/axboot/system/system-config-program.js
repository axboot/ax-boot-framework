var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["programs"],
            data: caller.searchView.getData(),
            callback: function (res) {
                caller.gridView01.setData(res);
            }
        });

        return false;
    },
    PAGE_SAVE: function (caller, act, data) {
        var saveList = [].concat(caller.gridView01.getData());
        saveList = saveList.concat(caller.gridView01.getData("deleted"));

        axboot.ajax({
            type: "PUT",
            url: ["programs"],
            data: JSON.stringify(saveList),
            callback: function (res) {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                axToast.push(LANG("onsave"));
            }
        });
    },
    ITEM_ADD: function (caller, act, data) {
        caller.gridView01.addRow();
    },
    ITEM_DEL: function (caller, act, data) {
        caller.gridView01.delRow("selected");
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
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            }
        });
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
        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 2,
            multipleSelect: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "progNm", label: COL("ax.admin.program.name"), width: 160, align: "left", editor: "text"},
                {key: "progPh", label: COL("ax.admin.program.progPh"), width: 350, align: "left", editor: "text"},
                {key: "authCheck", label: COL("ax.admin.program.auth.check.or.not"), width: 80, align: "center", editor: "checkYn"},
                {key: "schAh", label: COL("ax.admin.program.auth.inquery"), width: 50, align: "center", editor: "checkYn"},
                {key: "savAh", label: COL("ax.admin.program.auth.save"), width: 50, align: "center", editor: "checkYn"},
                {key: "exlAh", label: COL("ax.admin.program.auth.excel"), width: 50, align: "center", editor: "checkYn"},
                {key: "delAh", label: COL("ax.admin.program.auth.delete"), width: 50, align: "center", editor: "checkYn"},
                {key: "fn1Ah", label: "FN1", width: 50, align: "center", editor: "checkYn"},
                {key: "fn2Ah", label: "FN2", width: 50, align: "center", editor: "checkYn"},
                {key: "fn3Ah", label: "FN3", width: 50, align: "center", editor: "checkYn"},
                {key: "fn4Ah", label: "FN4", width: 50, align: "center", editor: "checkYn"},
                {key: "fn5Ah", label: "FN5", width: 50, align: "center", editor: "checkYn"},
                {key: "remark", label: COL("ax.admin.remark"), width: 300, editor: "text"}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex, {selectedClear: true});
                }
            }
        });

        axboot.buttonClick(this, "data-grid-view-01-btn", {
            "add": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_ADD);
            },
            "delete": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_DEL);
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.progNm && this.progPh;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true, useYn: "N", authCheck: "N"}, "last");
    }
});