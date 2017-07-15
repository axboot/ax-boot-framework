var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["samples", "parent"],
            data: $.extend({}, this.searchView.getData(), this.gridView01.getPageData()),
            callback: function (res) {
                caller.gridView01.setData(res);
            },
            options: {
                onError: function (err) {
                    console.log(err);
                }
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
        caller.formView01.setData(data);
    },
    MODAL_OPEN: function (caller, act, data) {
        axboot.modal.open({
            modalType: "SAMPLE-MODAL",
            param: "",
            sendData: function () {
                return {
                    "sendData": "AX5UI"
                };
            },
            callback: function (data) {
                caller.formView01.setEtc3Value({
                    key: data.key,
                    value: data.value
                });
                this.close();
            }
        });
    }
});

var CODE = {};

// fnObj 기본 함수 스타트와 리사이즈
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

        this.target.find('[data-ax5picker="date"]').ax5picker({
            direction: "auto",
            content: {
                type: 'date'
            }
        });

        axboot.buttonClick(this, "data-searchview-btn", {
            "modal": function () {
                ACTIONS.dispatch(ACTIONS.MODAL_OPEN)
            }
        });
    },
    getData: function () {
        return {
            filter: this.filter.val()
        }
    }
});


/**
 * gridView
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
                },
                onDBLClick: function () {
                    alert("DBLClick grid : row " + this.dindex);
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

        this.target.find('[data-ax5picker="numpad"]').ax5picker({
            direction: "auto",
            content: {
                width: 200,
                margin: 10,
                type: 'numpad',
                config: {
                    btnWrapStyle: "padding:3px;width:25%;",
                    btnStyle: "width:100%",
                    btnTheme: "primary",
                    specialBtnWrapStyle: "padding:3px;width:25%;",
                    specialBtnStyle: "width:100%;padding-left:0px;padding-right:0px;",
                    specialBtnTheme: ""
                },
                formatter: {
                    pattern: 'number'
                }
            }
        });

        $('[data-ax5select]').ax5select({
            columnKeys: {
                optionValue: "optionValue", optionText: "optionText"
            },
            options: [
                {optionValue: 2, optionText: "Number"},
                {optionValue: 3, optionText: "substr"},
                {optionValue: 4, optionText: "substring"},
                {optionValue: 1, optionText: "String"},
                {optionValue: 5, optionText: "search"},
                {optionValue: 6, optionText: "parseInt"},
                {optionValue: 7, optionText: "toFixed"}
            ]
        });

        var options = [];
        options.push({value: "1", text: "string"});
        options.push({value: "2", text: "number"});
        options.push({value: "3", text: "substr"});
        options.push({value: "4", text: "substring"});
        options.push({value: "5", text: "search"});
        options.push({value: "6", text: "parseInt"});
        options.push({value: "7", text: "toFixed"});
        options.push({value: "8", text: "min"});
        options.push({value: "9", text: "max"});
        options.push({value: "10", text: "장기영"});
        options.push({value: "11", text: "장서우"});
        options.push({value: "12", text: "이영희"});
        options.push({value: "13", text: "황인서"});
        options.push({value: "14", text: "황세진"});
        options.push({value: "15", text: "이서연"});
        options.push({value: "16", text: "액시스제이"});
        options.push({value: "17", text: "ax5"});
        options.push({value: "18", text: "ax5grid"});
        options.push({value: "19", text: "ax5combobox"});
        options.push({value: "20", text: "ax5autocomplete"});
        options.push({value: "21", text: "ax5binder"});
        options.push({value: "22", text: "ax5select"});
        options.push({value: "23", text: "ax5mask"});
        options.push({value: "24", text: "ax5toast"});
        options.push({value: "25", text: "ax5dialog"});
        options.push({value: "26", text: "ax5modal"});

        $('[data-ax5autocomplete]').ax5autocomplete({
            multiple: true,
            removeIcon: '<i class="cqc-cancel3"></i>',
            onSearch: function (callBack) {
                var searchWord = this.searchWord;
                setTimeout(function () {
                    var regExp = new RegExp(searchWord);
                    var myOptions = [];
                    options.forEach(function (n) {
                        if (n.text.match(regExp)) {
                            myOptions.push({
                                value: n.value,
                                text: n.text
                            })
                        }
                    });
                    callBack({
                        options: myOptions
                    });
                }, 150);

            }
        });
        $('[data-ax5autocomplete]').ax5autocomplete("setText", ["substring", "search"]);

        $('[data-ax5combobox]').ax5combobox({
            multiple: true,
            options: options
        });
        $('[data-ax5combobox]').ax5combobox("setValue", ["1", "2"]);

        var myCalendar = new ax5.ui.calendar({
            control: {
                left: '<i class="cqc-chevron-left"></i>',
                yearTmpl: '%s',
                monthTmpl: '%s',
                right: '<i class="cqc-chevron-right"></i>',
                yearFirst: true
            },
            target: document.getElementById("calendar-target"),
            displayDate: (new Date()),
            onClick: function () {
                //console.log(this);
                //console.log(myCalendar.getSelection());
            },
            onStateChanged: function () {
                //console.log(this);
            }
        });

        myCalendar.setSelection([(new Date())]);

        axboot.layoutResize(1);

        //$('[data-ui-btn]').click
        axboot.buttonClick(this, "data-ui-btn", {
            "toast": function () {
                axToast.push(LANG("ax.script.toast.test"));
            },
            "toast-confirm": function () {
                axToast.confirm({
                    theme: "danger",
                    msg: LANG("ax.script.toast.test")
                });
            },
            "dialog-alert": function () {
                axDialog.alert({
                    theme: "primary",
                    msg: LANG("ax.script.alert.test")
                });
            },
            "dialog-confirm": function () {
                axDialog.confirm({
                    theme: "primary",
                    msg: LANG("ax.script.alert.test")
                });
            },
            "dialog-prompt": function () {
                axDialog.prompt({
                    theme: "primary",
                    msg: LANG("ax.script.alert.test")
                });
            }
        });
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