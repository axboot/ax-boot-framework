var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    dispatch: function (caller, act, data) {
        switch (act) {
            case ACTIONS.PAGE_SEARCH:

                console.log("PAGE_SEARCH");
                console.log(arguments);

                break;

            default:
                return false;
        }
    }
});

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {

};

fnObj.pageResize = function () {

};

//== view 시작
/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend({
    initView: function () {

    }
});
