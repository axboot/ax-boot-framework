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
    var ax5ModelFormatter = function (_model) {
        this.target = _model.view_target;

        if (!(this.target instanceof jQuery)) {
            console.log("모델 뷰 타겟이 jQuery 오브젝트가 아니라서 modelFormatter 초기화에 실패 하였습니다");
            return;
        }

        this.formatting = function () {
            this.target.find('[data-ax-path][data-ax5formatter]').ax5formatter();
        };
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