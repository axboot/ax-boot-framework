/**
 * 각 뷰에 원형
 * @type {Object}
 */
axboot.commonView = {};
axboot.searchView = {
    pageNumber: 0,
    pageSize: 9999,
    setPageNumber: function(pageNumber){
        this.pageNumber = pageNumber;

    },
    setData: function (_obj) {
        for (var k in _obj) {
            if (k in this) {
                this[k].val(_obj[k]);
            }
        }
    }
    /* 라디오와 checkbox 타입 값 가져오기.
     radioBox: this.radioBox.filter(":checked").val(),
     checkBox: (function () {
     var vals = [];
     this.checkBox.filter(":checked").each(function () {
     vals.push(this.value);
     });
     return vals.join(',');
     }).call(this),
     */
};
axboot.treeView = {};
axboot.gridView = {
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
    addRow: function () {
        this.target.addRow({__created__: true}, "last");
    },
    delRow: function (_type) {
        this.target.deleteRow(_type);
    },
    align: function () {
        this.target.align();
    },
    clear: function () {
        this.target.setData({
            list: [],
            page: {
                currentPage: 0,
                pageSize: 0,
                totalElements: 0,
                totalPages: 0
            }
        });
    }
};
axboot.formView = {
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
        $('[data-ax5formatter]').ax5formatter("formatting");
    },
    validate: function () {
        var rs = this.model.validate();
        if (rs.error) {
            alert(rs.error[0].jquery.attr("title") + '을(를) 입력해주세요.');
            rs.error[0].jquery.focus();
            return false;
        }
        return true;
    }
};
axboot.formView.defaultData = {
    masterCompCd: "AXBOOT"
};

/**
 * 페이지에서 사용하는
 * @method axboot.actionExtend
 * @param {Object} [_actionThis]
 * @param {Object} _action
 * @example
 * ```js
 * var ACTION = axboot.actionExtend(fnObj, {
 *  PAGE_SEARCH: "PAGE_SEARCH",
 *  dispatch: function(caller, act, data){
 *      switch (act) {
 *          case ACTIONS.PAGE_SEARCH:
 *              // call view method
 *          break;
 *          default
 *              return false;
 *      }
 *  }
 * });
 *
 * // 액션의 실행
 * fnObj.sampleView = axboot.viewExtend({
 *  initView: function(){
 *      ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
 *  }
 * });
 * ```
 */
axboot.actionExtend = (function () {
    return function (_actionThis, _action) {
        var myAction = {};

        // 액션 명령어는 수집하여 담기
        for (var k in _action) {
            if (ax5.util.isString(_action[k])) {
                myAction[k] = _action[k];
            }
        }

        // dispatch 조작하기
        if ("dispatch" in _action) {
            myAction["page_dispatch"] = _action["dispatch"];
        }

        myAction["dispatch"] = function () {
            var fnArgs = [];

            fnArgs = ax5.util.toArray(arguments);
            if (ax5.util.isString(fnArgs[0])) {
                // 첫번째 아규먼트가 문자열이라면. action 이름이 왔다고 보자.
                // 첫번째 아규먼트에 _actionThis 삽입
                fnArgs.splice(0, 0, _actionThis);
            }
            return myAction["page_dispatch"].apply(_actionThis, fnArgs);
        };

        return myAction;
    };

})();