/**
 * @method axboot.buttonClick
 * @param {Object} _caller - this of function
 * @param {String} _attribute
 * @param {Object} _functionJson - 속성명과 매치되는 함수 속성값을 가진 버튼을 클릭하면 속성키에 선언된 함수가 실행됩니다.
 * @return _caller
 * @example
 * ```js
 * axboot.buttonClick(this, "data-page-btn", {
 *  "SEARCH": function(){
 *      ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
 *  }
 * });
 * ```
 */

axboot.buttonClick = (function () {
    return function (_caller, _attribute, _functionJson) {
        var processor = $.extend(true, {}, _functionJson);

        $('[' + _attribute + ']').click(function () {
            var act = this.getAttribute(_attribute);
            if (act in processor) {
                processor[act].call(_caller, act, this);
            }
        });

        return this;
    }
})();