var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: function (caller, act, data) {
        var searchData = caller.searchView.getData();
        var searchUrl = ["manual"];
        if(searchData.filter){
            searchUrl.push("search");
        }
        axboot.ajax({
            type: "GET",
            url: searchUrl,
            data: caller.searchView.getData(),
            callback: function (res) {
                caller.uploadView02.setData(searchData);
                caller.treeView01.setData(searchData, res.list);
            }
        });
        return false;
    },
    PAGE_SAVE: function (caller, act, data) {

        var obj = {
            list: caller.treeView01.getData(),
            deletedList: caller.treeView01.getDeletedList()
        };

        axboot
            .call({
                type: "PUT",
                url: ["manual"],
                data: JSON.stringify(obj),
                callback: function () {
                    caller.treeView01.clearDeletedList();
                    axToast.push("목차가 저장 되었습니다");
                }
            })
            .done(function () {
                var data = caller.formView01.getData();

                if (data.manualId) {
                    axboot.ajax({
                        type: "PUT",
                        url: ["manual", "detail"],
                        data: JSON.stringify(data),
                        callback: function (res) {
                            axToast.push("매뉴얼 내용이 저장 되었습니다");
                            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                        }
                    })
                    ;
                } else {
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                }

            });

    },
    TREEITEM_CLICK: function (caller, act, data) {
        if (typeof data.manualId === "undefined") {
            caller.formView01.clear();
            if (confirm("신규 생성된 목차는 저장 후 편집 할수 있습니다. 지금 저장 하시겠습니까? (저장 후에 다시 선택해주세요)")) {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            }
            return;
        }

        caller.uploadView02.setManualId(data.manualId);
        caller.searchView.toggleHandle(false);

        axboot.ajax({
            type: "GET",
            url: ["manual", data.manualId],
            data: "",
            callback: function (res) {
                caller.formView01.setData(res);
                caller.uploadView02.setData(res);
            }
        });
    },
    TREEITEM_DESELECTE: function (caller, act, data) {

    },
    TREE_ROOTNODE_ADD: function (caller, act, data) {
        caller.treeView01.addRootNode();
    },
    MANUAL_GROUP_MNG: function (caller, act, data) {
        axboot.modal.open({
            modalType: "COMMON_CODE_MODAL",
            param: "GROUP_CD=MANUAL_GROUP&GROUP_NM=매뉴얼 그룹",
            modalSendData: function () {
                return {};
            },
            callback: function (data) {
                if (data == "saved") {
                    if (confirm("매뉴얼 그룹 정보가 변경 되었습니다. 페이지를 새로고침 하시겠습니까?")) {
                        window.location.reload();
                    }
                }
                this.close();
            }
        });
    },
    FORM_DOWNLOAD: function (caller, act, data) {
        location.href = axboot.getURL(["manual_downloadForm"]);
    },
    UPLOAD_1_OK: function (caller, act, data) {
        window.location.reload();
    },
    UPLOAD_2_OK: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["manual", caller.uploadView02.manualId],
            data: "",
            callback: function (res) {
                // caller.formView01.setData(res);
                caller.uploadView02.setData(res);
            }
        });
    },
    OPEN_BOOK: function (caller, act, data) {
        var searchData = caller.searchView.getData();
        window.open(axboot.getURL(["manual_viewer"]) + "?manualGrpCd=" + searchData.manualGrpCd, "MANUAL_VIEW", "width=1024, height=600");
    }
});
var CODE = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;
    axboot
        .call({
            type: "GET", url: ["commonCodes"], data: {groupCd: "MANUAL_GROUP", useYn: "Y"},
            callback: function (res) {
                var manualGroup = [];
                res.list.forEach(function (n) {
                    manualGroup.push({
                        value: n.code, text: n.name + "(" + n.code + ")",
                        grpAuthCd: n.code, grpAuthNm: n.name,
                        data: n
                    });
                });
                this.authGroup = manualGroup;
            }
        })
        .done(function () {
            CODE = this; // this는 call을 통해 수집된 데이터들.

            //_this.pageButtonView.initView();
            _this.searchView.initView();
            _this.treeView01.initView();
            _this.formView01.initView();
            //_this.uploadView01.initView();
            //_this.uploadView02.initView();

            ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
        });
    this.contentResize();
};

fnObj.pageResize = function () {
    setTimeout(function () {
        fnObj.contentResize();
    });
};

fnObj.contentResize = function () {
    $('[data-fit-height-content]').each(function () {
        var $this = $(this);
        var _pHeight = $this.offsetParent().height();
        var name = this.getAttribute("data-fit-height-content");
        var _asideHeight = 0;
        $('[data-fit-height-aside="' + name + '"]').each(function () {
            _asideHeight += $(this).outerHeight();
        });
        $this.css({height: _pHeight - _asideHeight});
    });
    if (ax5.ui.grid_instance) {
        ax5.ui.grid_instance.forEach(function (g) {
            g.setHeight(g.$target.height());
        });
    }

    /*
     setTimeout(function () {
     fnObj.formView01.resize();
     }, 100);
     */
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
            "form-download": function () {
                ACTIONS.dispatch(ACTIONS.FORM_DOWNLOAD);
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
        var _this = this;

        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter");

        $('[data-manual-menu-handle]').click(function () {
            _this.toggleHandle();
        });
    },
    getData: function () {
        return {
            manualGrpCd: manualGrpCd,
            filter: this.filter.val()
        }
    },
    toggleHandle: function (TF) {
        if (typeof TF === "undefined") {
            if ($(document.body).hasClass("menu-opened")) {
                $(document.body).removeClass("menu-opened");
            } else {
                $(document.body).addClass("menu-opened");
            }
        } else {
            if (TF) {
                $(document.body).addClass("menu-opened");
            } else {
                $(document.body).removeClass("menu-opened");
            }
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
            name: "새 목차",
            __created__: true,
            manualGrpCd: _this.param.manualGrpCd
        });

        if (treeNode) {
            _this.target.zTree.editName(treeNode[0]);
        }
        fnObj.treeView01.deselectNode();
    },
    initView: function () {
        var _this = this;

        axboot.buttonClick(this, "data-tree-view-01-btn", {
            "add": function () {
                ACTIONS.dispatch(ACTIONS.TREE_ROOTNODE_ADD);
            }
        });

        this.target = axboot.treeBuilder($('[data-z-tree="tree-view-01"]'), {
            view: {
                dblClickExpand: false
                /*
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
                 name: "새 목차",
                 __created__: true,
                 manualGrpCd: _this.param.manualGrpCd
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
                 */
            },
            edit: {
                enable: false,
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
                }
            }
        }, []);
    },
    setData: function (_searchData, _tree) {
        var _this = this;
        this.param = $.extend({}, _searchData);
        this.target.setData(_tree);

        var nodes = this.target.zTree.getNodes();
        var findedManualId, findedManual;
        var findNode = function (_arr) {
            var i = _arr.length;
            while (i--) {
                if (_arr[i].manualKey == manualKey) {
                    _this.target.zTree.selectNode(_arr[i]);
                    findedManualId = _arr[i].manualId;
                    findedManual = _arr[i];
                }
                if (_arr[i].children && _arr[i].children.length > 0) {
                    findNode(_arr[i].children);
                }
            }
        };
        findNode(nodes);
        
        if(ax5.util.isNumber(findedManualId)){
            console.log(findedManual);
            ACTIONS.dispatch(ACTIONS.TREEITEM_CLICK, findedManual);
        }
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
                        manualId: n.manualId,
                        manualGrpCd: _this.param.manualGrpCd,
                        manualNm: n.name,
                        parentId: n.parentId,
                        sort: nidx,
                        progCd: n.progCd,
                        level: n.level
                    };
                } else {
                    item = {
                        manualId: n.manualId,
                        manualGrpCd: n.manualGrpCd,
                        manualNm: n.name,
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
        this.manualGroup = CODE.manualGroup;
        this.tmpl = $('[data-manual-content="tmpl"]').html();
        this.$view = $('[data-manual-content="view"]');
    },
    initEvent: function () {
        var _this = this;
    },
    setData: function (data) {
        this.$view.html(ax5.mustache.render(this.tmpl, data));
    },
    clear: function () {
        //this.model.setModel(this.getDefaultData());
    }
});

/**
 * uploadView01
 */
fnObj.uploadView01 = axboot.viewExtend(axboot.commonView, {
    initView: function () {
        this.target = document["manualUploadListForm"];

        $(this.target).attr("onsubmit", "return fnObj.uploadView01.onSubmit();");
    },
    setData: function (_data) {
        for (var k in _data) {
            if (this.target[k]) this.target[k].value = _data[k];
        }
    },
    onSubmit: function () {
        if (this.target.file.value == "") {
            alert("파일을 선택해주세요.");
            return false;
        }

        if (!confirm("목차 업로드시에 \"기존에 구성한 목차가 모두 삭제되고, 업로드한 목차로 재구성됩니다. 업로드하시겠습니까?\"")) return false;

        this.upload();
        return false;
    },
    upload: function () {
        axMask.open();
        var target_name = "submitwin";

        // iframe 생성
        var iframe = $('<iframe src="javascript:false;" name="' + target_name + '" style="display:none;"></iframe>');
        $(document.body).append(iframe);

        // onload 이벤트 핸들러
        // action에서 파일을 받아 처리한 결과값을 텍스트로 출력한다고 가정하고 iframe의 내부 데이터를 결과값으로 callback 호출
        iframe.load(function () {
            var doc = this.contentWindow ? this.contentWindow.document : (this.contentDocument ? this.contentDocument : this.document);
            var root = doc.documentElement ? doc.documentElement : doc.body;
            var result = root.textContent ? root.textContent : root.innerText;
            var res = JSON.parse(result);

            if (res.error) {
                alert(res.error);
            }
            else {
                ACTIONS.dispatch(ACTIONS.UPLOAD_1_OK);
            }
            iframe.remove();
            axMask.close();
        });
        this.target.target = target_name;
        this.target.action = axboot.getURL("/api/v1/manual/excel/uploadList");
        this.target.submit();
    }
});


/**
 * uploadView02
 */
fnObj.uploadView02 = axboot.viewExtend(axboot.commonView, {
    manualId: "",
    initView: function () {
        this.target = document["manualUploadForm"];

        $(this.target).attr("onsubmit", "return fnObj.uploadView02.onSubmit();");
    },
    setData: function (_data) {
        //this.target.file.value = "";

        if (_data.file) {
            $('[data-form-view-01-btn="file"]').html('<i class="cqc-download"></i> ' + _data.file.fileNm);
            $('[data-form-view-01-btn="file"]').on("click", (function () {
                var url = _data.file.download;
                return function () {
                    location.href = url;
                }
            })());
        } else {
            $('[data-form-view-01-btn="file"]').html('<small>등록된 파일이 없습니다.</small>');
            $('[data-form-view-01-btn="file"]').off("click");
        }
    },
    setManualId: function (manualId) {
        this.manualId = manualId;
    },
    onSubmit: function () {
        if (this.target.file.value == "") {
            alert("파일을 선택해주세요.");
            return false;
        }

        this.upload();
        return false;
    },
    upload: function () {
        axMask.open();
        var target_name = "submitwin";

        // iframe 생성
        var iframe = $('<iframe src="javascript:false;" name="' + target_name + '" style="display:none;"></iframe>');
        $(document.body).append(iframe);

        // onload 이벤트 핸들러
        // action에서 파일을 받아 처리한 결과값을 텍스트로 출력한다고 가정하고 iframe의 내부 데이터를 결과값으로 callback 호출
        iframe.load(function () {
            var doc = this.contentWindow ? this.contentWindow.document : (this.contentDocument ? this.contentDocument : this.document);
            var root = doc.documentElement ? doc.documentElement : doc.body;
            var result = root.textContent ? root.textContent : root.innerText;
            var res = JSON.parse(result);

            if (res.error) {
                alert(res.error);
            }
            else {
                ACTIONS.dispatch(ACTIONS.UPLOAD_2_OK);
            }
            iframe.remove();
            axMask.close();
        });

        this.target.target = target_name;
        this.target.action = axboot.getURL("/api/v1/manual/" + this.manualId + "/file");
        this.target.submit();
    }
});