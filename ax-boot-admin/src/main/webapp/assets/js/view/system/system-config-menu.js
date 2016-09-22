var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_SAVE: "PAGE_SAVE",
    TREEITEM_CLICK: "TREEITEM_CLICK",
    TREEITEM_DESELECTE: "TREEITEM_DESELECTE",
    TREE_ROOTNODE_ADD: "TREE_ROOTNODE_ADD",
    SELECT_PROG: "SELECT_PROG",
    SEARCH_AUTH: "SEARCH_AUTH",
    MENU_AUTH_CLEAR: "MENU_AUTH_CLEAR",
    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                var searchData = this.searchView.getData();
                axboot.ajax({
                    type: "GET",
                    url: "/api/v2/menu",
                    data: this.searchView.getData()
                }, function (res) {
                    _this.treeView01.setData(searchData, res.list);

                }, {
                    onError: function (err) {
                        console.log(err);
                    }
                });
                break;
            case ACTIONS.TREEITEM_CLICK:
                if (typeof data.menuId === "undefined") {
                    this.formView01.clear();
                    if(confirm("신규 생성된 메뉴는 저장 후 편집 할수 있습니다. 지금 저장 하시겠습니까?")){
                        ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
                    }
                    return;
                }

                this.formView01.setData(data);
                break;
            case ACTIONS.TREEITEM_DESELECTE:
                this.formView01.clear();
                break;
            case ACTIONS.ITEM_ADD:
                this.gridView01.addRow();
                break;
            case ACTIONS.ITEM_DEL:
                this.gridView01.delRow("selected");
                break;
            case ACTIONS.TREE_ROOTNODE_ADD:
                this.treeView01.addRootNode();
                break;
            case ACTIONS.SELECT_PROG:
                this.treeView01.updateNode(data);

                var _data = this.formView01.getData();
                var obj = {
                    list: this.treeView01.getData(),
                    deletedList: this.treeView01.getDeletedList()
                };

                axboot
                    .call({
                        type: "PUT",
                        url: "/api/v2/menu",
                        data: JSON.stringify(obj),
                        callback: function (res) {
                            _this.treeView01.clearDeletedList();
                            axToast.push("메뉴 카테고리가 저장 되었습니다");
                        }
                    })
                    .call({
                        type: "GET",
                        url: "/api/v2/menu",
                        data: this.searchView.getData(),
                        callback: function (res) {
                            _this.treeView01.setData(searchData, res.list);
                        }
                    })
                    .done(function () {
                        //console.log(_data);
                        ACTIONS.dispatch(ACTIONS.SEARCH_AUTH, {menuId: _data.menuId});
                    });

                break;
            case ACTIONS.PAGE_SAVE:

                var obj = {
                    list: this.treeView01.getData(),
                    deletedList: this.treeView01.getDeletedList()
                };

                axboot.ajax({
                    type: "PUT",
                    url: "/api/v2/menu",
                    data: JSON.stringify(obj)
                }, function (res) {

                    _this.treeView01.clearDeletedList();
                    axToast.push("메뉴 카테고리가 저장 되었습니다");

                    if (data && data.callback) {
                        data.callback();
                    } else {
                        ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    }
                });

                if (data && data.callback) {

                } else {

                    var formData = this.formView01.getData();
                    if (formData.progCd) {
                        axboot.ajax({
                            type: "PUT",
                            url: "/api/v2/menu/auth",
                            data: JSON.stringify(this.gridView01.getData())
                        }, function (res) {
                            axToast.push("메뉴 권한그룹 정보가 저장 되었습니다");
                            ACTIONS.dispatch(ACTIONS.SEARCH_AUTH, {menuId: _this.formView01.getData().menuId});
                        });
                    } else {

                    }
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
            case ACTIONS.MENU_AUTH_CLEAR:
                this.gridView01.clear();
                break;
            case ACTIONS.SEARCH_AUTH:
                axboot.ajax({
                        type: "GET",
                        url: "/api/v2/menu/auth",
                        data: data
                    },
                    function (res) {

                        var list = [];
                        if (res.program) {
                            _this.formView01.authGroup.forEach(function (g) {
                                var item = {
                                    grpAuthCd: g.grpAuthCd,
                                    grpAuthNm: g.grpAuthNm,
                                    useYn: "N",
                                    schAh: "N",
                                    savAh: "N",
                                    exlAh: "N",
                                    delAh: "N",
                                    fn1Ah: "N",
                                    fn2Ah: "N",
                                    fn3Ah: "N",
                                    fn4Ah: "N",
                                    fn5Ah: "N",
                                    menuId: data.menuId
                                };

                                res.list.forEach(function (n) {
                                    if (n.grpAuthCd == item.grpAuthCd) {
                                        $.extend(item, {
                                            useYn: "Y",
                                            schAh: n.schAh || "N",
                                            savAh: n.savAh || "N",
                                            exlAh: n.exlAh || "N",
                                            delAh: n.delAh || "N",
                                            fn1Ah: n.fn1Ah || "N",
                                            fn2Ah: n.fn2Ah || "N",
                                            fn3Ah: n.fn3Ah || "N",
                                            fn4Ah: n.fn4Ah || "N",
                                            fn5Ah: n.fn5Ah || "N"
                                        });
                                    }
                                });

                                if (res.program) {
                                    $.extend(item, {
                                        program_schAh: res.program.schAh || "N",
                                        program_savAh: res.program.savAh || "N",
                                        program_exlAh: res.program.exlAh || "N",
                                        program_delAh: res.program.delAh || "N",
                                        program_fn1Ah: res.program.fn1Ah || "N",
                                        program_fn2Ah: res.program.fn2Ah || "N",
                                        program_fn3Ah: res.program.fn3Ah || "N",
                                        program_fn4Ah: res.program.fn4Ah || "N",
                                        program_fn5Ah: res.program.fn5Ah || "N"
                                    });
                                }
                                list.push(item);
                            });
                        }
                        _this.gridView01.setData(list);

                    }, {
                        onError: function (err) {
                            console.log(err);
                        }
                    });
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
            type: "GET", url: "/api/v1/programs", data: "",
            callback: function (res) {
                var programList = [];
                res.list.forEach(function (n) {
                    programList.push({
                        value: n.progCd, text: n.progNm + "(" + n.progCd + ")",
                        progCd: n.progCd, progNm: n.progNm,
                        data: n
                    });
                });
                this.programList = programList;
            }
        })
        .call(function () {
            this.something = 1;
        })
        .call({
            type: "GET", url: "/api/v1/commonCodes", data: {groupCd: "AUTH_GROUP", useYn: "Y"},
            callback: function (res) {
                var authGroup = [];
                res.list.forEach(function (n) {
                    authGroup.push({
                        value: n.code, text: n.name + "(" + n.code + ")",
                        grpAuthCd: n.code, grpAuthNm: n.name,
                        data: n
                    });
                });
                this.authGroup = authGroup;
            }
        })
        .done(function () {
            CODE = this; // this는 call을 통해 수집된 데이터들.

            _this.pageButtonView.initView();
            _this.searchView.initView();
            _this.treeView01.initView();
            _this.formView01.initView();
            _this.gridView01.initView();

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
        this.menuGrpCd = $("#menuGrpCd");
    },
    getData: function () {
        return {
            pageNumber: 0,
            pageSize: 99999,
            menuGrpCd: this.menuGrpCd.val()
        }
    }
});


/**
 * treeView
 */
fnObj.treeView01 = axboot.viewExtend(axboot.treeView, {
    param: {},
    deletedList: [],
    newCount: 0,
    addRootNode: function () {
        var _this = this;
        var nodes = _this.target.zTree.getSelectedNodes();
        var treeNode = nodes[0];

        // root
        treeNode = _this.target.zTree.addNodes(null, {
            id: "_isnew_" + (++_this.newCount),
            pId: 0,
            name: "새 메뉴",
            __created__: true,
            menuGrpCd: _this.param.menuGrpCd
        });

        if (treeNode) {
            _this.target.zTree.editName(treeNode[0]);
        }
        fnObj.treeView01.deselectNode();
    },
    initView: function () {
        var _this = this;

        $('[data-tree-view-01-btn]').click(function () {
            var _act = this.getAttribute("data-tree-view-01-btn");
            switch (_act) {
                case "add":
                    ACTIONS.dispatch(ACTIONS.TREE_ROOTNODE_ADD);
                    break;
                case "delete":
                    //ACTIONS.dispatch(ACTIONS.ITEM_DEL);
                    break;
            }
        });

        this.target = axboot.treeBuilder($('[data-z-tree="tree-view-01"]'), {
            view: {
                dblClickExpand: false,
                addHoverDom: function (treeId, treeNode) {
                    var sObj = $("#" + treeNode.tId + "_span");
                    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                        + "' title='add node' onfocus='this.blur();'></span>";
                    sObj.after(addStr);
                    var btn = $("#addBtn_" + treeNode.tId);
                    if (btn) {
                        btn.bind("click", function () {
                            _this.target.zTree.addNodes(
                                treeNode,
                                {
                                    id: "_isnew_" + (++_this.newCount),
                                    pId: treeNode.id,
                                    name: "새 메뉴",
                                    __created__: true,
                                    menuGrpCd: _this.param.menuGrpCd
                                }
                            );
                            _this.target.zTree.selectNode(treeNode.children[treeNode.children.length - 1]);
                            _this.target.editName();
                            fnObj.treeView01.deselectNode();
                            return false;
                        });
                    }
                },
                removeHoverDom: function (treeId, treeNode) {
                    $("#addBtn_" + treeNode.tId).unbind().remove();
                }
            },
            edit: {
                enable: true,
                editNameSelectAll: true
            },
            callback: {
                beforeDrag: function () {
                    //return false;
                },
                onClick: function (e, treeId, treeNode, isCancel) {
                    ACTIONS.dispatch(ACTIONS.TREEITEM_CLICK, treeNode);
                },
                onRename: function (e, treeId, treeNode, isCancel) {
                    treeNode.__modified__ = true;
                },
                onRemove: function (e, treeId, treeNode, isCancel) {
                    if (!treeNode.__created__) {
                        treeNode.__deleted__ = true;
                        _this.deletedList.push(treeNode);
                    }
                    fnObj.treeView01.deselectNode();
                }
            }
        }, []);
    },
    setData: function (_searchData, _tree) {
        this.param = $.extend({}, _searchData);
        this.target.setData(_tree);
    },
    getData: function () {
        var _this = this;
        var tree = this.target.getData();

        var convertList = function (_tree) {
            var _newTree = [];
            _tree.forEach(function (n, nidx) {
                var item = {};
                if (n.__created__ || n.__modified__) {
                    item = {
                        __created__: n.__created__,
                        __modified__: n.__modified__,
                        menuId: n.menuId,
                        menuGrpCd: _this.param.menuGrpCd,
                        menuNm: n.name,
                        parentId: n.parentId,
                        sort: nidx,
                        progCd: n.progCd,
                        level: n.level
                    };
                } else {
                    item = {
                        menuId: n.menuId,
                        menuGrpCd: n.menuGrpCd,
                        menuNm: n.name,
                        parentId: n.parentId,
                        sort: nidx,
                        progCd: n.progCd,
                        level: n.level
                    };
                }
                if (n.children && n.children.length) {
                    item.children = convertList(n.children);
                }
                _newTree.push(item);
            });
            return _newTree;
        };
        var newTree = convertList(tree);
        return newTree;
    },
    getDeletedList: function () {
        return this.deletedList;
    },
    clearDeletedList: function () {
        this.deletedList = [];
        return true;
    },
    updateNode: function (data) {
        var treeNodes = this.target.getSelectedNodes();
        if (treeNodes[0]) {
            treeNodes[0].progCd = data.progCd;
        }
    },
    deselectNode: function () {
        ACTIONS.dispatch(ACTIONS.TREEITEM_DESELECTE);
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
        var _this = this;
        this.programList = CODE.programList;
        this.authGroup = CODE.authGroup;

        this.target = $("#formView01");
        this.model = new ax5.ui.binder();
        this.model.setModel(this.getDefaultData(), this.target);
        this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
        this.mask = new ax5.ui.mask({
            theme: "form-mask",
            target: $('#split-panel-form'),
            content: '좌측 메뉴를 선택해주세요.'
        });
        this.mask.open();

        this.initEvent();

        $('[data-form-view-01-btn]').click(function () {
            var _root = fnObj;
            switch (this.getAttribute("data-form-view-01-btn")) {
                case "form-clear":
                    ACTIONS.dispatch(ACTIONS.FORM_CLEAR);
                    break;
            }
        });

        this.combobox = $('[data-ax5combobox]').ax5combobox({
            options: this.programList,
            onChange: function () {
                if (this.value[0]) {
                    _this.model.set("progCd", this.value[0].progCd);
                    _this.model.set("progNm", this.value[0].progNm);
                    // console.log(this.value[0].data);

                    ACTIONS.dispatch(ACTIONS.MENU_AUTH_CLEAR);
                    ACTIONS.dispatch(ACTIONS.SELECT_PROG, this.value[0]);
                } else {
                    if (_this.model.get("progCd")) {
                        _this.model.set("progCd", "");
                        _this.model.set("progNm", "");
                        _this.combobox.ax5combobox("close");

                        ACTIONS.dispatch(ACTIONS.SELECT_PROG, "");
                        ACTIONS.dispatch(ACTIONS.MENU_AUTH_CLEAR);
                    }
                }
            }
        });
    },
    initEvent: function () {
        var _this = this;
    },
    getData: function () {
        var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
        return data;
    },
    setData: function (data) {
        this.mask.close();
        var _data = this.getDefaultData();
        this.combobox.ax5combobox("setValue", []);

        ACTIONS.dispatch(ACTIONS.MENU_AUTH_CLEAR);
        _data.menuId = data.menuId;

        if (data.progCd) {
            var progIndex = ax5.util.search(this.programList, function () {
                return this.progCd == data.progCd;
            });
            var prog = this.programList[progIndex];

            _data.progCd = prog.progCd;
            _data.progNm = prog.progNm;

            this.combobox.ax5combobox("setValue", _data.progCd);
            ACTIONS.dispatch(ACTIONS.SEARCH_AUTH, {menuId: data.menuId});
        }

        //this.combobox.ax5combobox("blur");
        this.model.setModel(_data);
        this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
    },
    clear: function () {
        this.mask.open();
        this.model.setModel(this.getDefaultData());
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
                    ACTIONS.dispatch(ACTIONS.ITEM_ADD);
                    break;
                case "delete":
                    ACTIONS.dispatch(ACTIONS.ITEM_DEL);
                    break;
            }
        });

        this.target = axboot.gridBuilder({
            showLineNumber: false,
            showRowSelector: false,
            frozenColumnIndex: 0,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                //menuId
                {key: "grpAuthCd", label: "권한그룹코드", width: 80, align: "center"},
                {key: "grpAuthNm", label: "권한그룹명", width: 160, align: "left"},
                {key: "useYn", label: "권한적용", editor: "checkYn"},
                {key: "schAh", label: "조회", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "savAh", label: "저장", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "exlAh", label: "엑셀", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "delAh", label: "삭제", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "fn1Ah", label: "FN1", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "fn2Ah", label: "FN2", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "fn3Ah", label: "FN3", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "fn4Ah", label: "FN4", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
                {key: "fn5Ah", label: "FN5", width: 50, align: "center", editor: "menu-program-auth-checkYn"}
                /// --> 이것들을 list로 담아서  [PUT] "/api/v2/menu/auth"
            ],
            body: {
                onClick: function () {
                    // this.self.select(this.dindex);
                }
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
        this.target.addRow({__created__: true, useYn: "N"}, "last");
    }
});