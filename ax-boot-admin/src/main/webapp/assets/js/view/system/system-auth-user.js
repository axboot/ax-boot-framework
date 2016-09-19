var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_SAVE: "PAGE_SAVE",
    FORM_CLEAR: "FORM_CLEAR",
    ITEM_CLICK: "ITEM_CLICK",

    ROLE_GRID_DATA_INIT: "ROLE_GRID_DATA_INIT",
    ROLE_GRID_DATA_GET: "ROLE_GRID_DATA_GET",
    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/users",
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

                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/users",
                    data: {userCd: data.userCd}
                }, function (res) {
                    //ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    _this.formView01.setData(res);
                });

                break;
            case ACTIONS.PAGE_SAVE:
                if (this.formView01.validate()) {
                    axboot.ajax({
                        type: "PUT",
                        url: "/api/v1/users",
                        data: JSON.stringify([this.formView01.getData()])
                    }, function (res) {
                        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    });
                }
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
            case ACTIONS.ROLE_GRID_DATA_INIT:

                var list = [];
                CODE.userRole.forEach(function (n) {
                    var item = {roleCd: n.roleCd, roleNm: n.roleNm, hasYn: "N", userCd: data.userCd};

                    if (data && data.roleList) {
                        data.roleList.forEach(function (r) {
                            if (item.roleCd == r.roleCd) {
                                item.hasYn = "Y";
                            }
                        });
                    }
                    list.push(item);
                });
                
                this.gridView02.setData(list);

                break;
            case ACTIONS.ROLE_GRID_DATA_GET:

                return this.gridView02.getData("Y");

                break;
            default:
                return false;
        }
        return false;
    }
});

var CODE = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    axboot
        .call({
            type: "GET", url: "/api/v1/commonCodes", data: {groupCd: "USER_ROLE", useYn: "Y"},
            callBack: function (res) {
                var userRole = [];
                res.list.forEach(function (n) {
                    userRole.push({
                        value: n.code, text: n.name + "(" + n.code + ")",
                        roleCd: n.code, roleNm: n.name,
                        data: n
                    });
                });
                this.userRole = userRole;
            }
        })
        .done(function () {

            CODE = this; // this는 call을 통해 수집된 데이터들.

            _this.pageButtonView.initView();
            _this.searchView.initView();
            _this.gridView01.initView();
            _this.gridView02.initView();
            _this.formView01.initView();

            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
        });
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
            pageNumber: 0,
            pageSize: 99999,
            filter: this.filter.val()
        }
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    userType: {
        R: "시스템 관리자",
        A: "ASP 관리자",
        C: "업체 관리자",
        B: "브랜드 관리자",
        S: "매장 관리자"
    },
    useYn: {
        Y: "사용",
        N: "사용안함"
    },
    initView: function () {

        var _this = this;
        this.target = axboot.gridBuilder({
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {
                    key: "compCd",
                    label: "업체코드",
                    width: 70,
                    align: "center"
                },
                {
                    key: "userCd",
                    label: "아이디",
                    width: 120
                },
                {
                    key: "userNm",
                    label: "이름",
                    width: 120
                },
                {
                    key: "locale",
                    label: "국가",
                    width: 120
                },
                {
                    key: "useYn",
                    label: "사용여부",
                    width: 80,
                    formatter: function () {
                        return _this.useYn[this.value];
                    }
                }
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
        return {
            "compCd": "S0001",
            roleList: [],
            authList: []
        };
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
        });

        ACTIONS.dispatch(ACTIONS.ROLE_GRID_DATA_INIT, {});
    },
    initEvent: function () {
        var _this = this;
        this.model.onChange("password_change", function () {
            if (this.value == "Y") {
                _this.target.find('[data-ax-path="userPs"]').removeAttr("readonly");
                _this.target.find('[data-ax-path="userPs_chk"]').removeAttr("readonly");
            } else {
                _this.target.find('[data-ax-path="userPs"]').attr("readonly", "readonly");
                _this.target.find('[data-ax-path="userPs_chk"]').attr("readonly", "readonly");
            }
        });
    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.

        data.authList = [];
        if (data.grpAuthCd) {
            data.grpAuthCd.forEach(function (n) {
                data.authList.push({
                    userCd: data.userCd,
                    grpAuthCd: n
                });
            });
        }

        data.roleList = ACTIONS.dispatch(ACTIONS.ROLE_GRID_DATA_GET);

        return $.extend({}, data);
    },
    setData: function (data) {

        if (typeof data === "undefined") data = this.getDefaultData();
        data = $.extend({}, data);

        if (data.authList) {
            data.grpAuthCd = [];
            data.authList.forEach(function (n) {
                data.grpAuthCd.push(n.grpAuthCd);
            });
        }
        ACTIONS.dispatch(ACTIONS.ROLE_GRID_DATA_INIT, {userCd: data.userCd, roleList: data.roleList});

        data.userPs = "";
        data.password_change = "";
        this.target.find('[data-ax-path="userPs"]').attr("readonly", "readonly");
        this.target.find('[data-ax-path="userPs_chk"]').attr("readonly", "readonly");
        this.model.setModel(data);
        this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경


    },
    validate: function () {
        var rs = this.model.validate();
        if (rs.error) {
            alert(rs.error[0].jquery.attr("title") + '을(를) 입력해주세요.');
            rs.error[0].jquery.focus();
            return false;
        }
        return true;
    },
    clear: function () {
        this.model.setModel(this.getDefaultData());
    }
});


/**
 * gridView
 */
fnObj.gridView02 = axboot.viewExtend(axboot.gridView, {
    initView: function () {

        var _this = this;
        this.target = axboot.gridBuilder({
            showLineNumber: false,
            target: $('[data-ax5grid="grid-view-02"]'),
            columns: [
                {key: "hasYn", label: "선택", width: 50, align: "center", editor: "checkYn"},
                {key: "roleCd", label: "역할코드", width: 150},
                {key: "roleNm", label: "역할명", width: 180},
            ],
            body: {
                onClick: function () {
                    //this.self.select(this.dindex);
                    //ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.list[this.dindex]);
                }
            }
        });
    },
    setData: function (_data) {
        this.target.setData(_data);
    },
    getData: function (hasYn) {
        hasYn = hasYn || "Y";
        var list = ax5.util.filter(this.target.getList(), function () {
            return this.hasYn == hasYn;
        });
        return list;
    },
    align: function () {
        this.target.align();
    }
});