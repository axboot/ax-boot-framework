var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_CHOICE: "PAGE_CHOICE",
    PAGE_DEL: "PAGE_DEL",
    FORM_CLEAR: "FORM_CLEAR",
    ITEM_CLICK: "ITEM_CLICK",
    GRID_0_PAGING: "GRID_0_PAGING",

    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/files",
                    data: this.searchView.getData()
                }, function (res) {
                    _this.gridView01.setData(res);
                });

                break;
            case ACTIONS.PAGE_CHOICE:

                break;
            case ACTIONS.PAGE_DEL:

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
            
            case ACTIONS.GRID_0_PAGING:

                this.searchView.setPageNumber(data);
                
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

    _this.pageButtonView.initView();
    _this.searchView.initView();
    _this.gridView01.initView();
    _this.formView01.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};

fnObj.pageResize = function () {

};


function selectImage(url) {
    window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, url);
    window.close();
}

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
            case "choice":
                ACTIONS.dispatch(ACTIONS.PAGE_CHOICE);
                break;
            case "excel":
                ACTIONS.dispatch(ACTIONS.PAGE_DEL);
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
    setPageNumber: function(pageNumber){
        this.pageNumber = pageNumber;
        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
    },
    getData: function () {
        return {
            pageNumber: this.pageNumber,
            pageSize: 2, //this.pageSize,
            filter: this.filter.val()
        }
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
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
        
        this.target.onPageChange = function(pageNumber){
            ACTIONS.dispatch(ACTIONS.GRID_0_PAGING, pageNumber);
        };
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

        });
    },
    initView: function () {
        this.target = $("#formView01");
        this.model = new ax5.ui.binder();
        this.model.setModel(this.getDefaultData(), this.target);
        this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
        this.initEvent();

    },
    initEvent: function () {
        var _this = this;

    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
        return $.extend({}, data);
    },
    setData: function (data) {
        data = $.extend(true, {}, this.getDefaultData(), data);

        this.model.setModel(data);
        this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
    },
    clear: function () {
        this.model.setModel(this.getDefaultData());
    }
});