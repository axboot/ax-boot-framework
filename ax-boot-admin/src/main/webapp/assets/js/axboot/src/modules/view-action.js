/**
 * commonView
 * @Object {Object} axboot.commonView
 */
axboot.commonView = {};

/**
 * searchView
 * @Object {Object} axboot.searchView
 */
axboot.searchView = {
    setData: function (_obj) {
        for (var k in _obj) {
            if (k in this) {
                this[k].val(_obj[k]);
            }
        }
    },
    getCheckedValue: function ($inp) {
        if ($inp[0].type == "radio") {
            return $inp.filter(":checked").val();
        } else if ($inp[0].type == "checkbox") {
            return (function (_$inp) {
                var vals = [];
                _$inp.filter(":checked").each(function () {
                    vals.push(this.value);
                });
                return vals.join(',');
            }).call(this, $inp);
        }
    }
};

/**
 * treeView
 * @Object {Object} axboot.treeView
 */
axboot.treeView = {};

/**
 * gridView
 * @Object {Object} axboot.gridView
 */
axboot.gridView = {
    page: {
        pageNumber: 0,
        pageSize: 99999
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
    addRow: function () {
        this.target.addRow({__created__: true}, "last", {focus: "END"});
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
    },
    setPageData: function (_page) {
        this.page = $.extend(this.page, _page);
    },
    getPageData: function () {
        return this.page;
    }
};

/**
 * formView
 * @Object {Object} axboot.formView
 */
axboot.formView = {
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

/**
 * formView.defaultData
 * @Object {Object} axboot.formView.defaultData
 */
axboot.formView.defaultData = {
    masterCompCd: ""
};

/**
 * 1, 2를 믹스한 새로운 오브젝트를 반환
 * @param _obj1
 * @param _obj2
 */
axboot.extend = function (_obj1, _obj2) {
    return $.extend({}, _obj1, _obj2);
};
axboot.viewExtend = function (_obj1, _obj2) {
    if (typeof _obj2 === "undefined") {
        return $.extend({}, axboot.commonView, _obj1);
    } else {
        return $.extend({}, _obj1, _obj2);
    }
};

/**
 * 페이지에서 사용하는
 * @method axboot.actionExtend
 * @param {Object} [_actionThis]
 * @param {Object} _action
 * @example
 * ```js
 *
 * // ACTION 이름은 키로 사용하고 dispatch에서 처리하는 방식.
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
 * // ACTION 이름에 함수를 구현하는 방식
 * var ACTION = axboot.actionExtend(fnObj, {
 *  PAGE_SEARCH: function(caller, act, data){
 *
 *  },
 *  dispatch: function(caller, act, data){
 *      var result = ACTIONS.exec(caller, act, data);
 *      if(result != "error"){
 *          return result;
 *      } else {
 *          return false;
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
            } else if (ax5.util.isFunction(_action[k])) {
                myAction[k] = k;
                myAction["__EXEC__" + k] = _action[k];
            }
        }

        // dispatch 조작하기
        if ("dispatch" in _action) {
            myAction["page_dispatch"] = _action["dispatch"];
        }

        myAction["exec"] = function (caller, act, data) {
            if (_action[act]) {
                return _action[act].call(caller, caller, act, data);
            } else {
                return "error";
            }
        };

        if (!myAction["page_dispatch"]) {
            myAction["page_dispatch"] = function (caller, act, data) {

                var result = (function(){
                    return (caller.ACTIONS) ? caller.ACTIONS : window.ACTIONS;
                })().exec(caller, act, data);

                if (result != "error") {
                    return result;
                } else {
                    return false;
                }
            }
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