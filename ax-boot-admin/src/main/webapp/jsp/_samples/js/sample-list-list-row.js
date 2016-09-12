var RESIZE_ELEMENTS = [
    {
        id: "page-grid-view0", adjust: function () {
        return -($(window).height() / 2);
    }
    },
    {
        id: "page-grid-view1", adjust: function () {
        return -($(window).height() / 2);
    }
    }
];

/**
 * CODE
 */
var CODE = app.CODE({
    "etc3": [
        {CD: '1', NM: "코드"},
        {CD: '2', NM: "CODE"},
        {CD: '4', NM: "VA"}
    ]
});

/**
 * actions
 */
var ACTIONS = $.extend(app.ACTIONS, {
    PAGE_SEARCH: 'PAGE_SEARCH',
    PAGE_SAVE: 'PAGE_SAVE',
    PAGE_EXCEL: 'PAGE_EXCEL',
    RECEIVE_LIST: 'RECEIVE_LIST',

    GRID0_ITEM_ADD: 'GRID0_ITEM_ADD',
    GRID0_ITEM_REMOVE: 'GRID0_ITEM_REMOVE',
    GRID0_ITEM_CLICK: 'GRID0_ITEM_CLICK',

    GRID1_ITEM_ADD: 'GRID1_ITEM_ADD',
    GRID1_ITEM_REMOVE: 'GRID1_ITEM_REMOVE',
    GRID1_ITEM_CLICK: 'GRID1_ITEM_CLICK'
});

var fnObj = {
    dispatch: function (caller, act, data) {
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                app.net.ajax({type: "GET", url: "/api/v1/samples/parent", data: data}, function (res) {
                    ACTIONS.dispatch(null, ACTIONS.RECEIVE_LIST, res);
                });
                break;

            case ACTIONS.PAGE_SAVE:
                app.net.ajax({type: "PUT", url: "/api/v1/samples/parent", data: JSON.stringify(data.parent)}, function (res) {
                    app.net.ajax({type: "PUT", url: "/api/v1/samples/child", data: JSON.stringify(data.child)}, function (res) {
                        ACTIONS.dispatch(null, ACTIONS.PAGE_SEARCH, {});
                        fnObj.gridView1.setData([]);
                    });
                });
                break;

            case ACTIONS.RECEIVE_LIST:
                fnObj.gridView0.setData(data);

                break;

            case ACTIONS.GRID0_ITEM_ADD:
                fnObj.gridView0.addItem();
                break;

            case ACTIONS.GRID0_ITEM_REMOVE:
                if (data.keyParam.length > 0) {
                    app.net.ajax({type: "DELETE", url: "/api/v1/samples/parent?" + data.keyParam.join("&"), data: ""}, function (res) {
                        fnObj.gridView0.removeItem(data.checkedList);
                    });
                }
                else {
                    fnObj.gridView0.removeItem(data.checkedList);
                }
                break;

            case ACTIONS.GRID0_ITEM_CLICK:
                app.net.ajax({type: "GET", url: "/api/v1/samples/child", data: "parentKey=" + data.key}, function (res) {
                    fnObj.gridView1.setData(res);
                });
                break;

            case ACTIONS.GRID1_ITEM_ADD:
                var parentSelectedItem = fnObj.gridView0.target.getSelectedItem();
                if (parentSelectedItem.error) {
                    alert(parentSelectedItem.description);
                }
                else {
                    fnObj.gridView1.addItem(parentSelectedItem.item);
                }

                break;

            case ACTIONS.GRID1_ITEM_REMOVE:
                if (data.keyParam.length > 0) {
                    app.net.ajax({type: "DELETE", url: "/api/v1/samples/child?" + data.keyParam.join("&"), data: ""}, function (res) {
                        fnObj.gridView1.removeItem(data.checkedList);
                    });
                }
                else {
                    fnObj.gridView1.removeItem(data.checkedList);
                }
                break;

            default:

                return false;
        }
        // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
    }
};

/**
 * pageStart
 */
fnObj.pageStart = function () {
    this.toolbarView.initView();
    this.gridView0.initView();
    this.gridView1.initView();

    ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, {});
    return false;
};

/**
 * toolbarView
 */
fnObj.toolbarView = {
    initView: function () {
        var _this = this;

        $("#ax-page-btn-search").bind("click", function () {
            ACTIONS.dispatch(_this, ACTIONS.PAGE_SEARCH, {});
        });

        $("#ax-page-btn-save").bind("click", function () {
            // 저장
            ACTIONS.dispatch(_this, ACTIONS.PAGE_SAVE, {
                parent: fnObj.gridView0.getData(),
                child: fnObj.gridView1.getData()
            });
        });

        $("#ax-page-btn-excel").bind("click", function () {
            // 엑셀
        });

        $("#ax-page-btn-fn1").bind("click", function () {
            // 삭제
        });
    }
};

/**
 * gridView#0
 */
fnObj.gridView0 = {
    initView: function () {
        var
            _this = this
            ;

        $('#ax-grid0-btn-add').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID0_ITEM_ADD, null);
        });
        $('#ax-grid0-btn-del').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID0_ITEM_REMOVE, _this.getCheckedItem());
        });

        app.builder.grid.build(this, {
            targetID: "page-grid-view0",
            pageId: '${pageId}',
            colGroup: app.builder.grid.col.build({
                "index": {
                    label: "선택", width: "35", align: "center", formatter: "checkbox"
                },
                "key": {
                    label: "코드", width: "100", align: "left",
                    editor: {
                        type: "text",
                        maxLength: 8,
                        disabled: function () {
                            return this.item._CUD != "C";
                        },
                        beforeUpdate: function (val) {
                            var hasCd = false, index = this.index;
                            _this.target.list.forEach(function (item, i) {
                                if (item.key == val && i != index) {
                                    hasCd = true;
                                    return false;
                                }
                            });
                            if (hasCd) _this.target.list[index].__edting__ = true;
                            return (hasCd) ? "" : val;
                        },
                        afterUpdate: function () {
                            if (this.item.key == "" && this.item.__edting__) toast.push("코드값이 중복됩니다. 입력이 취소 되었습니다.");
                            delete _this.target.list[this.index].__edting__;
                        }
                    }
                },
                "value": {
                    label: "이름", width: "150",
                    editor: {
                        type: "text",
                        maxLength: 50
                    }
                },
                "etc1": {
                    label: "날짜", width: "150",
                    editor: {
                        type: "calendar",
                        config: {
                            separator: "-"
                        }
                    }
                },
                "etc2": {
                    label: "컬럼1", width: "150",
                    editor: {
                        type: "text",
                        maxLength: 50
                    }
                },
                "etc3": {
                    label: "선택타입", width: "150", align: "center",
                    editor: {
                        type: "select",
                        optionValue: "CD",
                        optionText: "NM",
                        options: CODE.etc3,
                        beforeUpdate: function (val) { // 수정이 되기전 value를 처리 할 수 있음.
                            return val; // return 이 반드시 있어야 함.
                        }
                    }
                }
            }),
            body: {
                onclick: function () {
                    ACTIONS.dispatch(fnObj, ACTIONS.GRID0_ITEM_CLICK, this.item);
                }
            },
            page: {
                display: true,
                paging: true,
                onchange: function (pgNo) {
                    ACTIONS.dispatch(this, ACTIONS.PAGING_LIST, pgNo);
                }
            }
        });
    },
    addItem: function () {
        this.target.pushList({});
        this.target.setFocus(this.target.list.length - 1);
    },
    getCheckedItem: function () {
        var
            _this = this,
            checkedList = this.target.getCheckedListWithIndex(0),
            keyParams = []
            ;

        $.each(checkedList, function () {
            if (this.item._CUD != "C") {
                keyParams.push("key=" + this.item.key); // ajax delete 요청 목록 수집
            }
        });

        return {
            keyParam: keyParams,
            checkedList: checkedList
        };
    },
    removeItem: function (data) {
        this.target.removeListIndex(data);
        toast.push("삭제 되었습니다.");
        return false;
    },
    getData: function () {
        var
            liveList = [],
            removedList = []
            ;

        $.each(this.target.list, function () {
            if (this.key != "") {
                liveList.push(this);
            }
        });

        $.each(this.target.removedList, function () {
            if (this._CUD != "C") {
                this.deleted = true;
                removedList.push(this);
            }
        });

        this.setData(liveList);
        return liveList.concat(removedList);
    },
    setData: function (res) {
        this.target.setData(app.builder.grid.getGridData(res));
    },
    onChange: function () {

    }
};

/**
 * gridView#1
 */
fnObj.gridView1 = {
    initView: function () {
        var
            _this = this
            ;

        $('#ax-grid1-btn-add').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID1_ITEM_ADD, null);
        });
        $('#ax-grid1-btn-del').click(function () {
            ACTIONS.dispatch(null, ACTIONS.GRID1_ITEM_REMOVE, _this.getCheckedItem());
        });

        app.builder.grid.build(this, {
            targetID: "page-grid-view1",
            pageId: '${pageId}',
            colGroup: app.builder.grid.col.build({
                "index": {
                    label: "선택", width: "35", align: "center", formatter: "checkbox"
                },
                "key": {
                    label: "코드", width: "100", align: "left",
                    editor: {
                        type: "text",
                        maxLength: 8,
                        disabled: function () {
                            return this.item._CUD != "C";
                        },
                        beforeUpdate: function (val) {
                            var hasCd = false, index = this.index;
                            _this.target.list.forEach(function (item, i) {
                                if (item.key == val && i != index) {
                                    hasCd = true;
                                    return false;
                                }
                            });
                            if (hasCd) _this.target.list[index].__edting__ = true;
                            return (hasCd) ? "" : val;
                        },
                        afterUpdate: function () {
                            if (this.item.key == "" && this.item.__edting__) toast.push("코드값이 중복됩니다. 입력이 취소 되었습니다.");
                            delete _this.target.list[this.index].__edting__;
                        }
                    }
                },
                "value": {
                    label: "이름", width: "150",
                    editor: {
                        type: "text",
                        maxLength: 50
                    }
                },
                "etc1": {
                    label: "날짜", width: "150",
                    editor: {
                        type: "calendar",
                        config: {
                            separator: "-"
                        }
                    }
                },
                "etc2": {
                    label: "컬럼1", width: "150",
                    editor: {
                        type: "text",
                        maxLength: 50
                    }
                },
                "etc3": {
                    label: "선택타입", width: "150", align: "center",
                    editor: {
                        type: "select",
                        optionValue: "CD",
                        optionText: "NM",
                        options: CODE.etc3,
                        beforeUpdate: function (val) { // 수정이 되기전 value를 처리 할 수 있음.
                            return val; // return 이 반드시 있어야 함.
                        }
                    }
                }
            }),
            body: {
                onclick: function () {
                    ACTIONS.dispatch(fnObj, ACTIONS.GRID1_ITEM_CLICK, this.item);
                }
            },
            page: {
                display: true,
                paging: true,
                onchange: function (pgNo) {
                    ACTIONS.dispatch(this, ACTIONS.PAGING_LIST, pgNo);
                }
            }
        });
    },
    addItem: function (parentItem) {
        if (!parentItem) return;
        this.target.pushList({
            parentKey: parentItem.key
        });
        this.target.setFocus(this.target.list.length - 1);
    },
    getCheckedItem: function () {
        var
            _this = this,
            checkedList = this.target.getCheckedListWithIndex(0),
            keyParams = []
            ;

        $.each(checkedList, function () {
            if (this.item._CUD != "C") {
                keyParams.push("key=" + this.item.key); // ajax delete 요청 목록 수집
            }
        });

        return {
            keyParam: keyParams,
            checkedList: checkedList
        };
    },
    removeItem: function (data) {
        this.target.removeListIndex(data);
        toast.push("삭제 되었습니다.");
        return false;
    },
    getData: function () {
        var
            liveList = [],
            removedList = []
            ;

        $.each(this.target.list, function () {
            if (this.key != "") {
                liveList.push(this);
            }
        });

        $.each(this.target.removedList, function () {
            if (this._CUD != "C") {
                this.deleted = true;
                removedList.push(this);
            }
        });

        this.setData(liveList);
        return liveList.concat(removedList);
    },
    setData: function (res) {
        this.target.setData(app.builder.grid.getGridData(res));
    },
    onChange: function () {

    }
};