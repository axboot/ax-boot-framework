var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_SAVE: "PAGE_SAVE",
    ITEM_CLICK: "ITEM_CLICK",
    ITEM_REMOVE: "ITEM_REMOVE",
    ITEM_REMOVEALL: "ITEM_REMOVEALL",
    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/errorLogs",
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
                this.formView01.setData(data);
                break;
            case ACTIONS.ITEM_REMOVE:
                var _this = this;
                var delete_queue = this.gridView01.getData("selected");
                if (delete_queue.length == 0) {
                    alert("삭제할 목록을 선택해주세요");
                    return;
                }
                if (!confirm("정말 삭제하시겠습니까?")) return;

                var delQueue = function () {
                    var pars;
                    if (pars = delete_queue.shift()) {
                        axboot.ajax({
                            type: "DELETE",
                            url: "/api/v1/errorLogs/" + pars.id,
                            data: ""
                        }, function (res) {
                            delQueue();
                        }, {
                            onError: function (err) {
                                alert("삭제작업에 실패하였습니다.");
                                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                            }
                        });
                    } else {
                        axToast.push("삭제 처리 되었습니다.");
                        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    }
                };

                delQueue();

                break;
            case ACTIONS.ITEM_REMOVEALL:

                if (!confirm("정말 삭제하시겠습니까?")) return;
                axboot.ajax({
                        type: "DELETE",
                        url: "/api/v1/errorLogs/events/all",
                        data: ""
                    },
                    function (res) {
                        axToast.push("삭제 처리 되었습니다.");
                        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    });

                break;
            case ACTIONS.ITEM_DEL:
                this.gridView01.delRow("selected");
                break;
            case ACTIONS.PAGE_SAVE:
                var saveList = [].concat(this.gridView01.getData("modified"));
                saveList = saveList.concat(this.gridView01.getData("deleted"));

                axboot.ajax({
                    type: "PUT",
                    url: "/api/v1/programs",
                    data: JSON.stringify(saveList)
                }, function (res) {
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    axToast.push("저장 되었습니다");
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
        return false;
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
            filter: this.filter.val(),
            sort: "id,desc"
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
                case "remove":
                    ACTIONS.dispatch(ACTIONS.ITEM_REMOVE);
                    break;
                case "removeAll":
                    ACTIONS.dispatch(ACTIONS.ITEM_REMOVEALL);
                    break;
            }
        });

        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 0,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "id", label: "ID", width: 60, align: "center"},
                {key: "phase", label: "빌드단계", width: 80, align: "center"},
                {key: "system", label: "시스템명", width: 70, align: "center"},
                {key: "serverName", label: "서버명", width: 100, align: "center"},
                {key: "hostName", label: "호스트명", width: 100, align: "center"},
                {key: "path", label: "URL", width: 100, align: "center"},
                {key: "message", label: "에러 메시지", width: 400, align: "left"},
                {
                    key: "errorDatetime", label: "발생시간", width: 140, align: "center", formatter: function () {
                    return ax5.util.date(this.value || "", {"return": 'yyyy/MM/dd hh:mm:ss'});
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
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList();
        if (_type == "selected") {
            list = ax5.util.filter(_list, function () {
                return this.__selected__;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true, useYn: "N"}, "last");
    }
});


/**
 * formView01
 */
fnObj.formView01 = axboot.viewExtend(axboot.formView, {
    getDefaultData: function () {
        return {};
    },
    initView: function () {
        this.target = $("#formView01");
        this.model = new ax5.ui.binder();
        this.model.setModel(this.getDefaultData(), this.target);
        this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
        this.initEvent();
    },
    initEvent: function () {

    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
        return $.extend({}, data);
    },
    setData: function (data) {
        if (typeof data === "undefined") data = this.getDefaultData();
        data = $.extend({}, data);

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
