axboot.convertCode = (function () {
    var BASIC_CODE = {};
    var mapKeys = {
        key: "code", value: "name"
    };
    return function () {
        var
            codes,
            return_code = {}
            ;

        if (arguments.length == 1) {
            codes = arguments[0];
        }
        else {
            BASIC_CODE = arguments[0];
            codes = arguments[1];
        }

        codes = $.extend(true, BASIC_CODE, codes);

        for (var k in codes) {
            if (codes.hasOwnProperty(k)) {
                return_code[k] = codes[k];
                return_code[k].map = (function () {
                    var i = this.length,
                        map = {};

                    while (i--) {
                        map[this[i][mapKeys.key]] = this[i][mapKeys.value];
                    }
                    return map;
                }).call(return_code[k]);
            }
        }

        return return_code;
    };
})();