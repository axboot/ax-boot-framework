var fnObj = {}, CODE = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["samples", "parent"],
            data: $.extend({}, this.searchView.getData(), this.gridView01.getPageData()),
            callback: function (res) {
                caller.gridView01.setData(res);
            }
        });

        return false;
    },
    PAGE_SAVE: function (caller, act, data) {
        if (caller.formView01.validate()) {
            var parentData = caller.formView01.getData();
            var childList = [].concat(caller.gridView02.getData("modified"));
            childList = childList.concat(caller.gridView02.getData("deleted"));

            // childList에 parentKey 삽입
            childList.forEach(function (n) {
                n.parentKey = parentData.key;
            });

            axboot.promise()
                .then(function (ok, fail, data) {
                    axboot.ajax({
                        type: "PUT", url: ["samples", "parent"], data: JSON.stringify([parentData]),
                        callback: function (res) {
                            ok(res);
                        }
                    });
                })
                .then(function (ok, fail, data) {
                    axboot.ajax({
                        type: "PUT", url: ["samples", "child"], data: JSON.stringify(childList),
                        callback: function (res) {
                            ok(res);
                        }
                    });
                })
                .then(function (ok) {
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                })
                .catch(function () {

                });
        }

    },
    FORM_CLEAR: function (caller, act, data) {
        axDialog.confirm({
            msg: LANG("ax.script.form.clearconfirm")
        }, function () {
            if (this.key == "ok") {
                caller.formView01.clear();
                caller.gridView02.clear();
            }
        });
    },
    ITEM_CLICK: function (caller, act, data) {
        console.log(act);
        caller.formView01.setData(data);
        axboot.ajax({
            type: "GET",
            url: "/api/v1/samples/child",
            data: "parentKey=" + data.key,
            callback: function (res) {
                caller.gridView02.setData(res);
            }
        });
    }
});

fnObj.pageStart = function () {
    var _this = this;

    axboot.promise()
        .then(function (ok, fail, data) {
            axboot.ajax({
                type: "GET", url: ["commonCodes"], data: {groupCd: "USER_ROLE", useYn: "Y"},
                callback: function (res) {
                    var userRole = [];
                    res.list.forEach(function (n) {
                        userRole.push({
                            value: n.code, text: n.name + "(" + n.code + ")",
                            roleCd: n.code, roleNm: n.name,
                            data: n
                        });
                    });
                    CODE.userRole = userRole;

                    ok();
                }
            });
        })
        .then(function (ok) {
            _this.pageButtonView.initView();
            _this.searchView.initView();
            _this.gridView01.initView();
            _this.gridView02.initView();
            _this.formView01.initView();

            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
        })
        .catch(function () {

        });
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
            "excel": function () {

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
            filter: this.filter.val()
        }
    }
});

/**
 * gridView01
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    page: {
        pageNumber: 0,
        pageSize: 10
    },
    initView: function () {
        var _this = this;

        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 0,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "key", label: "KEY", width: 80, align: "left"},
                {key: "value", label: "VALUE", width: 120, align: "left"},
                {key: "etc1", label: "ETC1", width: 70, align: "center"},
                {key: "etc2", label: "ETC2", width: 70, align: "center"},
                {key: "etc3", label: "ETC3", width: 70, align: "center"},
                {key: "etc4", label: "ETC4", width: 70, align: "center"}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex);
                    ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.item);
                }
            },
            onPageChange: function (pageNumber) {
                _this.setPageData({pageNumber: pageNumber});
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
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

/**
 * formView01
 */
fnObj.formView01 = axboot.viewExtend(axboot.formView, {
    getDefaultData: function () {
        return $.extend({}, axboot.formView.defaultData, {});
    },
    initView: function () {
        this.target = $("#formView01");
        this.model = new ax5.ui.binder();
        this.model.setModel(this.getDefaultData(), this.target);
        this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
        this.initEvent();

        axboot.buttonClick(this, "data-form-view-01-btn", {
            "form-clear": function () {
                ACTIONS.dispatch(ACTIONS.FORM_CLEAR);
            }
        });
    },
    initEvent: function () {
        var _this = this;
    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
        return $.extend({}, data);
    },
    setData: function (data) {

        if (typeof data === "undefined") data = this.getDefaultData();
        data = $.extend({}, data);

        this.target.find('[data-ax-path="key"]').attr("readonly", "readonly");

        this.model.setModel(data);
        this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
    },
    validate: function () {
        var rs = this.model.validate();
        if (rs.error) {
            alert(LANG("ax.script.form.validate", rs.error[0].jquery.attr("title")));
            rs.error[0].jquery.focus();
            return false;
        }
        return true;
    },
    clear: function () {
        this.model.setModel(this.getDefaultData());
        this.target.find('[data-ax-path="key"]').removeAttr("readonly");
    }
});

/**
 * gridView02
 */
fnObj.gridView02 = axboot.viewExtend(axboot.gridView, {
    initView: function () {

        var _this = this;

        this.target = axboot.gridBuilder({
            showLineNumber: false,
            showRowSelector: true,
            multipleSelect: true,
            target: $('[data-ax5grid="grid-view-02"]'),
            columns: [
                {key: "key", label: "KEY", width: 80, align: "left", editor: "text"},
                {key: "value", label: "VALUE", width: 120, align: "left", editor: "text"},
                {key: "etc1", label: "ETC1", width: 70, align: "center", editor: "text"},
                {key: "etc2", label: "ETC2", width: 70, align: "center", editor: "text"},
                {key: "etc3", label: "ETC3", width: 70, align: "center", editor: "text"},
                {key: "etc4", label: "ETC4", width: 70, align: "center", editor: "text"}
            ],
            body: {
                onClick: function () {
                    //this.self.select(this.dindex);
                    //ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.list[this.dindex]);
                }
            }
        });

        axboot.buttonClick(this, "data-grid-view-02-btn", {
            "item-add": function () {
                this.addRow();
            },
            "item-remove": function () {
                this.delRow();
            }
        });
    },
    setData: function (_data) {
        this.target.setData(_data);
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
    align: function () {
        this.target.align();
    }
});