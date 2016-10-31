/**
 * @Object {Object} axboot.modelFormatter
 */
axboot.modelFormatter = (function () {
    var get_real_path = function (dataPath) {
        var path = [];
        var _path = [].concat(dataPath.split(/[\.\[\]]/g));
        _path.forEach(function (n) {
            if (n !== "") path.push(n);
        });
        _path = null;
        return "'" + path.join("']['") + "'";
    };

    /**
     * @class ax5ModelFormatter
     * @param _model
     * @example
     * ```js
     * this.model = new ax5.ui.binder();
     * this.model.setModel(this.getDefaultData(), this.target);
     * this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
     * ```
     */
    var ax5ModelFormatter = function (_model) {
        this.target = _model.view_target;

        if (!(this.target instanceof jQuery)) {
            console.log("모델 뷰 타겟이 jQuery 오브젝트가 아니라서 modelFormatter 초기화에 실패 하였습니다");
            return;
        }

        /**
         * @method ax5ModelFormatter.formatting
         * @example
         * ```js
         * this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
         * ```
         */
        this.formatting = function () {
            this.target.find('[data-ax-path][data-ax5formatter]').ax5formatter();
        };

        /**
         * @method ax5ModelFormatter.getClearData
         * @param _data
         * @example
         * ```js
         * var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
         * return data;
         * ```
         */
        this.getClearData = function (_data) {
            var myData = $.extend({}, _data);
            this.target.find('[data-ax-path]').each(function () {
                var dataPath = this.getAttribute("data-ax-path");
                var pattern = this.getAttribute("data-ax5formatter");
                var value = (Function("", "return this[" + get_real_path(dataPath) + "];")).call(myData);
                if (typeof value !== "undefined") {
                    if (pattern in axboot.modelFormatter.clearProcessor) value = axboot.modelFormatter.clearProcessor[pattern].call(this, value);
                    (Function("val", "this[" + get_real_path(dataPath) + "] = val;")).call(myData, value);
                }
            });
            return myData;
        };

        this.formatting();
    };
    return ax5ModelFormatter;
})();

axboot.modelFormatter.clearProcessor = {
    "money": function (_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "number": function (_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "date": function (_v) {
        return ax5.util.date(("" + _v), {"return": 'yyyy-MM-dd'});
    },
    "time": function (_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "bizno": function (_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "phone": function (_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "customPattern": function (_v) {
        return _v;
    }
};

/**포멧터의 포멧터 패턴 확장**/
ax5.ui.formatter.formatter["chequer"] = {
    getEnterableKeyCodes: function (_opts) {
        var enterableKeyCodes = {
            '189': '-' // eventKeyCode
        };
        return jQuery.extend(
            enterableKeyCodes,
            ax5.ui.formatter.formatter.ctrlKeys,
            ax5.ui.formatter.formatter.numKeys
        );
    },
    getPatternValue: function (_opts, optIdx, e, val, eType) {
        val = val.replace(/\D/g, "");
        var regExpPattern = /^([0-9]{2})\-?([0-9]{2})?\-?([0-9]{2})?\-?([0-9]{2})?/;
        return val.replace(regExpPattern, function (a, b) {
            var nval = [arguments[1]];
            if (arguments[2]) nval.push(arguments[2]);
            if (arguments[3]) nval.push(arguments[3]);
            if (arguments[4]) nval.push(arguments[4]);
            return nval.join("-");
        });
    }
};

/**
 * @Object {Object} axboot.formFormatter
 */
axboot.formFormatter = (function(){
    /**
     * @class ax5FormFormatter
     * @param _model
     * @example
     * ```js
     * this.formFormatter = new axboot.formFormatter(this.$target); // 폼 포메터 시작
     * ```
     */
    var ax5FormFormatter = function (_$target) {
        this.target = _$target;

        if (!(this.target instanceof jQuery)) {
            console.log("target이 jQuery 오브젝트가 아니라서 formFormatter 초기화에 실패 하였습니다");
            return;
        }

        /**
         * @method ax5FormFormatter.formatting
         * @example
         * ```js
         * this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
         * ```
         */
        this.formatting = function () {
            this.target.find('[data-ax5formatter]').ax5formatter();
        };

        this.formatting();
    };
    return ax5FormFormatter;
})();