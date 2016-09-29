var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_SAVE: "PAGE_SAVE",
    PAGE_DEL: "PAGE_DEL",
    FORM_CLEAR: "FORM_CLEAR",
    ITEM_CLICK: "ITEM_CLICK",
    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/companies",
                    data: this.searchView.getData(),
                    callback: function (res) {
                        _this.gridView01.setData(res);
                    },
                    options: {
                        onError: function (err) {
                            console.log(err);
                        }
                    }
                });
                break;
            case ACTIONS.ITEM_CLICK:
                this.formView01.setData(data);
                break;
            case ACTIONS.PAGE_SAVE:
                if (this.formView01.validate()) {
                    axboot.ajax({
                        type: "PUT",
                        url: "/api/v1/companies",
                        data: JSON.stringify(this.formView01.getData()),
                        callback: function (res) {
                            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                            ACTIONS.dispatch(ACTIONS.FORM_CLEAR);
                            axToast.push("저장 되었습니다.")
                        }
                    });
                }
                break;
            case ACTIONS.PAGE_DEL:

                var _this = this;
                axDialog.confirm({
                    msg: "정말 삭제 하시겠습니까?"
                }, function () {
                    if (this.key == "ok") {

                        axboot.ajax({
                            type: "PUT",
                            url: "/api/v1/companies",
                            data: JSON.stringify($.extend({}, _this.formView01.getData(), {delYn: "Y"})),
                            callback: function (res) {
                                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                                ACTIONS.dispatch(ACTIONS.FORM_CLEAR);
                                axToast.push("삭제 되었습니다.");
                            }
                        });

                    }
                    else if (this.key == "cancel") {

                    }
                });

                break;
            case ACTIONS.FORM_CLEAR:
                var _this = this;
                axDialog.confirm({
                    msg: "정말 양식을 초기화 하시겠습니까?"
                }, function () {
                    if (this.key == "ok") {
                        _this.formView01.clear();
                    }
                });
                break;
            default:
                return false;
        }
    }
});

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    this.pageButtonView.initView();
    this.searchView.initView();
    this.gridView01.initView();
    this.formView01.initView();

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
                ACTIONS.dispatch(ACTIONS.PAGE_DEL);
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
        this.filter = $("#filter");
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.containsDeleted = $("#containsDeleted");
    },
    getData: function () {
        return {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            filter: this.filter.val(),
            containsDeleted: (function () {
                var vals = [];
                this.containsDeleted.filter(":checked").each(function () {
                    vals.push(this.value);
                });
                return vals.join(',');
            }).call(this)
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
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "compCd"},
                {key: "compNm"},
                {key: "companyJson.대표자명"},
                {key: "companyJson.사업자등록번호"},
                {key: "delYn"}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex);
                    ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.list[this.dindex]);
                }
            }
        });
    },
    setData: function (_data) {
        this.target.setData(_data);
    },
    getData: function () {
        return this.target.getData();
    },
    align: function () {
        this.target.align();
    }
});


/**
 * formView01
 */
fnObj.formView01 = axboot.viewExtend(axboot.formView, {
    getDefaultData: function () {
        return $.extend({}, axboot.formView.defaultData, {
            companyJson: {
                //compRegno: "2011773671",
                //telNo : "01088819137"
            }
        });
    },
    initView: function () {
        this.target = $("#formView01");
        this.model = new ax5.ui.binder();
        this.model.setModel(this.getDefaultData(), this.target);
        this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
        this.initEvent();

        $('[data-form-view-01-btn]').click(function () {
            var _root = fnObj;
            switch (this.getAttribute("data-form-view-01-btn")) {
                case "form-clear":
                    ACTIONS.dispatch(ACTIONS.FORM_CLEAR);
                    break;
            }
        })
    },
    initEvent: function () {
        var _this = this;
    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
        return data;
    },
    setData: function (data) {
        if (typeof data === "undefined") data = this.getDefaultData();
        data = $.extend({}, data);

        data.userPs = "";
        data.password_change = "";
        this.target.find('[data-ax-path="userPs"]').attr("readonly", "readonly");
        this.target.find('[data-ax-path="userPs_chk"]').attr("readonly", "readonly");

        this.model.setModel(data);
        this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
    }
});
