var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_CLOSE: function (caller, act, data) {
        window.close();
    },
    PAGE_SEARCH: function (caller, act, data) {
        axboot.ajax({
            type: "GET",
            url: ["files"],
            data: $.extend({}, this.searchView.getData(), this.gridView01.getPageData()),
            callback: function (res) {
                caller.gridView01.setData(res);
            }
        });
        return false;
    },
    PAGE_CHOICE: function (caller, act, data) {
        data = this.formView01.getData();

        if (data.id) {
            var image_tag = "<img src=\"" + data.preview + "\"/>";
            var doctarget = opener.CKEDITOR.instances.editor1;
            doctarget.insertHtml(image_tag);
            window.close();
        } else {
            alert("선택된 파일이 없습니다.");
        }
    },
    PAGE_DEL: function (caller, act, data) {
        if (!confirm("정말 삭제 하시겠습니까?")) return;

        var list = this.gridView01.getData("selected");
        list.forEach(function (n) {
            n.__deleted__ = true;
        });

        axboot.ajax({
            type: "PUT",
            url: ["files"],
            data: JSON.stringify(list),
            callback: function (res) {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            }
        });
    },
    ITEM_CLICK: function (caller, act, data) {
        caller.formView01.setData(data);
    }
});

var CODE = {};

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    var _this = this;

    _this.pageButtonView.initView();
    _this.searchView.initView();
    _this.gridView01.initView();
    _this.uploadView.initView();
    _this.formView01.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};

fnObj.pageResize = function () {

};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "search": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            },
            "choice": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CHOICE);
            },
            "fn1": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_DEL);
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
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
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    page: {
        pageNumber: 0,
        pageSize: 20
    },
    useYn: {
        Y: "사용",
        N: "사용안함"
    },
    initView: function () {

        var _this = this;
        this.target = axboot.gridBuilder({
            showRowSelector: true,
            showLineNumber: true,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {
                    key: "fileNm",
                    label: "파일명",
                    width: 300
                },
                {
                    key: "fileType",
                    label: "타입",
                    align: "center",
                    width: 60
                },
                {
                    key: "fileSize",
                    label: "크기",
                    align: "right",
                    width: 80, formatter: function () {
                    return ax5.util.number(this.value, {"byte": true});
                }
                },
                {
                    key: "createdAt",
                    label: "등록일자",
                    width: 180
                }
            ],
            body: {
                onClick: function () {
                    this.self.select(this.dindex);
                    ACTIONS.dispatch(ACTIONS.ITEM_CLICK, this.list[this.dindex]);
                }
            },
            page: {
                navigationItemCount: 5
            },
            onPageChange: function (pageNumber) {
                _this.setPageData({pageNumber: pageNumber});
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
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
                return true;
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


fnObj.uploadView = axboot.viewExtend(axboot.commonView, {
    initView: function () {
        this.target = document["uploadForm"];
        $(this.target).attr("onsubmit", "return fnObj.uploadView.onSubmit();");
    },
    onSubmit: function () {
        if (this.target.upload.value == "") {
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
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
            }
            iframe.remove();
            axMask.close();
        });
        this.target.target = target_name;
        this.target.submit();
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
        this.previewTarget = $("#preview-target");
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

        var po = [];
        po.push('<div><button class="btn btn-default" onclick="location.href=\'' + data.download + '\';"><i class="cqc-download"></i> 다운로드</button></div>');
        po.push('<div class="H10"></div>');
        if (data.fileType == "IMAGE") {
            po.push('<div><img src="' + data.preview + '" class="img-responsive"/></div>');
        }
        this.previewTarget.html(po.join(''));
    },
    clear: function () {
        this.model.setModel(this.getDefaultData());
        this.previewTarget.empty();
    }
});