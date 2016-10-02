var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_CLOSE: "PAGE_CLOSE",
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_CHOICE: "PAGE_CHOICE",
    PAGE_DEL: "PAGE_DEL",
    FORM_CLEAR: "FORM_CLEAR",
    ITEM_CLICK: "ITEM_CLICK",
    GRID_0_PAGING: "GRID_0_PAGING",

    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_CLOSE:
                if (parent) {
                    parent.axboot.modal.close();
                }

                break;
            case ACTIONS.PAGE_SEARCH:
                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/samples/parent",
                    data: this.searchView.getData(),
                    callback: function (res) {
                        _this.gridView01.setData(res);
                    }
                });

                break;
            case ACTIONS.PAGE_CHOICE:
                var list = this.gridView01.getData("selected");
                if (list.length > 0) {
                    if (parent && parent.axboot && parent.axboot.modal) {
                        parent.axboot.modal.callback(list[0]);
                    }
                } else {
                    alert("선택된 목록이 없습니다.");
                }

                break;
            case ACTIONS.PAGE_DEL:
                if (!confirm("정말 삭제 하시겠습니까?")) return;

                var list = this.gridView01.getData("selected");
                list.forEach(function (n) {
                    n.__deleted__ = true;
                });

                axboot.ajax({
                    type: "PUT",
                    url: "/api/v1/files",
                    data: JSON.stringify(list),
                    callback: function (res) {
                        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    }
                });

                break;
            case ACTIONS.ITEM_CLICK:
                //_this.formView01.setData(data);
                ACTIONS.dispatch(ACTIONS.PAGE_CHOICE);

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
            case "choice":
                ACTIONS.dispatch(ACTIONS.PAGE_CHOICE);
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
            case "close":
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
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
    setPageNumber: function (pageNumber) {
        this.pageNumber = pageNumber;
        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
    },
    getData: function () {
        return {
            pageNumber: this.pageNumber,
            pageSize: 100, //this.pageSize,
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
                    //ACTIONS.dispatch(ACTIONS.ITEM_ADD);
                    break;
                case "delete":
                    //ACTIONS.dispatch(ACTIONS.ITEM_DEL);
                    break;
            }
        });

        this.target = axboot.gridBuilder({
            showLineNumber: false,
            showRowSelector: true,
            frozenColumnIndex: 0,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "key", label: "KEY", width: 100, align: "left"},
                {key: "value", label: "VALUE", width: 200, align: "left"},
                {key: "etc1", label: "ETC1", width: 70, align: "center"},
                {key: "ect2", label: "ETC2", width: 70, align: "center"},
                {key: "ect3", label: "ETC3", width: 70, align: "center"},
                {key: "ect4", label: "ETC4", width: 70, align: "center"}
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex);
                    ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.item);
                }
            }
        });
    }
});