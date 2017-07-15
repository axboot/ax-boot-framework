var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["commonCodes"],
            data: caller.searchView.getData(),
            callback: function (res) {
                caller.gridView01.setData(res);
            }
        });

        return false;
    },
    PAGE_CLOSE: function (caller, act, data) {
        parent.axboot.modal.close();
    },
    PAGE_SAVE: function (caller, act, data) {
        axboot
            .call({
                type: "PUT",
                url: ["commonCodes"],
                data: JSON.stringify((function () {
                    var saveList = [].concat(caller.gridView01.getData("modified"));
                    saveList = saveList.concat(caller.gridView01.getData("deleted"));
                    return saveList;
                })()),
                callback: function (res) {

                },
                options: {}
            })
            .done(function () {
                parent.axboot.modal.callback("saved");
                parent.axToast.push(GROUP_NM + " 정보가 저장되었습니다");
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
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
            },
            "add": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_ADD);
            },
            "del": function () {
                ACTIONS.dispatch(ACTIONS.ITEM_DEL);
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

    },
    getData: function () {
        return {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            groupCd: GROUP_CD,
            useYn: "Y"
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
            multipleSelect: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "code", label: "코드", width: 100, align: "center", editor: {type: "text", disabled: "notCreated"}},
                {key: "name", label: "코드값", width: 150, align: "left", editor: "text"},
                {key: "sort", editor: "number"},
                {key: "useYn", editor: "checkYn"}
            ],
            body: {
                onClick: function () {

                }
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.code;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true, groupCd: GROUP_CD, groupNm: GROUP_NM, posUseYn: "N", useYn: "Y"}, "last");
    }
});