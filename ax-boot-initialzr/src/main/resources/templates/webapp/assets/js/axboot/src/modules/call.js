/**
 * @Object {Object} axboot.call
*/

/**
 * 여러개의 AJAX콜을 순차적으로 해야 하는 경우 callback 지옥에 빠지기 쉽다. `axboot.call & done`은 이런 상황에서 코드가 보기 어려워지는 문제를 해결 하기 위해 개발된 오브젝트 입니다
 * @method axboot.call
 * @example
 * ```js
 *   axboot
 *       .call({
 *           type: "GET", url: "/api/v1/programs", data: "",
 *           callback: function (res) {
 *               var programList = [];
 *               res.list.forEach(function (n) {
 *                   programList.push({
 *                       value: n.progCd, text: n.progNm + "(" + n.progCd + ")",
 *                       progCd: n.progCd, progNm: n.progNm,
 *                       data: n
 *                   });
 *               });
 *               this.programList = programList;
 *           }
 *       })
 *       .call(function () {
 *           this.something = 1;
 *       })
 *       .call({
 *           type: "GET", url: "/api/v1/commonCodes", data: {groupCd: "AUTH_GROUP", useYn: "Y"},
 *           callback: function (res) {
 *               var authGroup = [];
 *               res.list.forEach(function (n) {
 *                   authGroup.push({
 *                       value: n.code, text: n.name + "(" + n.code + ")",
 *                       grpAuthCd: n.code, grpAuthNm: n.name,
 *                       data: n
 *                   });
 *               });
 *               this.authGroup = authGroup;
 *           }
 *       })
 *       .done(function () {
 *           CODE = this; // this는 call을 통해 수집된 데이터들.
 *
 *           _this.pageButtonView.initView();
 *           _this.searchView.initView();
 *           _this.treeView01.initView();
 *           _this.formView01.initView();
 *           _this.gridView01.initView();
 *
 *           ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
 *       });
 * ```
 */

/**
 * axboot.call 참조
 * @method axboot.call.done
 */
axboot.call = (function () {

    var callClass = function (_obj) {
        this.queue = [];

        var self = this;
        var processor = function (callback) {
            var item = self.queue.shift();
            if (ax5.util.isFunction(item)) {
                item.call(this);
                processor.call(this, callback);
            } else if (item) {
                axboot.ajax({
                    type: item.type,
                    url: item.url,
                    data: item.data,
                    callback: (function(res){
                        item.callback.call(this, res);
                        processor.call(this, callback);
                    }).bind(this),
                    options: {nomask: false}
                });
            } else {
                callback.call(this);
            }
        };

        this.call = function (_obj) {
            this.queue.push(_obj);
            return this;
        };
        this.done = function (callback) {
            processor.call({}, callback);
        };
        this.call(_obj);
    };

    return function (obj) {
        return new callClass(obj);
    }

})();