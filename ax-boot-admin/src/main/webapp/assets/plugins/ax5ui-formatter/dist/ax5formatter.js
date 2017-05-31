"use strict";

// ax5.ui.formatter
(function () {
    var UI = ax5.ui;
    var U = ax5.util;
    var FORMATTER = void 0;

    UI.addClass({
        className: "formatter"
    }, function () {
        var TODAY = new Date();
        var setSelectionRange = function setSelectionRange(input, pos) {
            if (typeof pos == "undefined") {
                pos = input.value.length;
            }
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(pos, pos);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            } else if (input.selectionStart) {
                input.focus();
                input.selectionStart = pos;
                input.selectionEnd = pos;
            }
        };

        /**
         * @class ax5formatter
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * $('#idInputTime').attr('data-ax5formatter', 'time').ax5formatter();
         * $('#idInputMoney').attr('data-ax5formatter', 'money').ax5formatter();
         * $('#idInputPhone').attr('data-ax5formatter', 'phone').ax5formatter();
         * $('#idInputDate').attr('data-ax5formatter', 'date').ax5formatter();
         *
         * $('#ax5formatter-custom').ax5formatter({
         *     pattern: "custom",
         *     getEnterableKeyCodes: function(){
         *         return {
         *             '65':'a',
         *             '66':'b',
         *             '67':'c',
         *             '68':'d',
         *             '69':'e',
         *             '70':'f'
         *         };
         *     },
         *     getPatternValue: function(obj){
         *         return obj.value.replace(/./g, "*");
         *     }
         * });
         * ```
         */
        return function () {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                animateTime: 250
            };

            this.queue = [];
            this.openTimer = null;
            this.closeTimer = null;

            cfg = this.config;

            var formatterEvent = {
                'focus': function focus(opts, optIdx, e) {
                    if (!opts.$input.data("__originValue__")) opts.$input.data("__originValue__", opts.$input.val());
                },
                /* 키 다운 이벤트에서 입력할 수 없는 키 입력을 방어 */
                'keydown': function keydown(opts, optIdx, e) {
                    var isStop = false;
                    if (!opts.enterableKeyCodes) {} else if (e.which && opts.enterableKeyCodes[e.which]) {} else if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                        //console.log(e.which, opts.enterableKeyCodes);
                        isStop = true;
                    }
                    if (isStop) ax5.util.stopEvent(e);
                },
                /* 키 업 이벤트에서 패턴을 적용 */
                'keyup': function keyup(opts, optIdx, e) {
                    var elem = opts.$input.get(0),
                        elemFocusPosition,
                        beforeValue,
                        newValue,
                        selection,
                        selectionLength;

                    if ('selectionStart' in elem) {
                        // Standard-compliant browsers
                        elemFocusPosition = elem.selectionStart;
                    } else if (document.selection) {
                        // IE
                        //elem.focus();
                        selection = document.selection.createRange();
                        selectionLength = document.selection.createRange().text.length;
                        selection.moveStart('character', -elem.value.length);
                        elemFocusPosition = selection.text.length - selectionLength;
                    }

                    beforeValue = elem.value;
                    if (opts.pattern in FORMATTER.formatter) {
                        newValue = FORMATTER.formatter[opts.pattern].getPatternValue.call(this, opts, optIdx, e, elem.value);
                    } else {
                        newValue = beforeValue;
                    }

                    if (newValue != beforeValue) {
                        opts.$input.val(newValue).trigger("change");
                        setSelectionRange(elem, elemFocusPosition + newValue.length - beforeValue.length);
                    }
                },
                'blur': function blur(opts, optIdx, e, _force) {
                    var elem = opts.$input.get(0),
                        beforeValue,
                        newValue;

                    opts.$input.removeData("__originValue__");

                    beforeValue = elem.value;
                    if (opts.pattern in FORMATTER.formatter) {
                        newValue = FORMATTER.formatter[opts.pattern].getPatternValue.call(this, opts, optIdx, e, elem.value, 'blur');
                    } else {
                        newValue = beforeValue;
                    }

                    if (_force) {
                        opts.$input.val(newValue);
                    } else {
                        if (newValue != beforeValue) {
                            opts.$input.val(newValue).trigger("change");
                        }
                    }
                }
            };

            var bindFormatterTarget = function bindFormatterTarget(opts, optIdx) {

                if (!opts.pattern) {
                    if (opts.$target.get(0).tagName == "INPUT") {
                        opts.pattern = opts.$target.attr('data-ax5formatter');
                    } else {
                        opts.pattern = opts.$target.find('input[type="text"]').attr('data-ax5formatter');
                    }
                    if (!opts.pattern) {
                        console.log(ax5.info.getError("ax5formatter", "501", "bind"));
                        console.log(opts.target);
                        return this;
                    }
                }

                var re = /[^\(^\))]+/gi,
                    matched = opts.pattern.match(re);

                opts.pattern = matched[0];
                opts.patternArgument = matched[1] || "";

                // 함수타입
                if (opts.pattern in FORMATTER.formatter) {
                    opts.enterableKeyCodes = FORMATTER.formatter[opts.pattern].getEnterableKeyCodes.call(this, opts, optIdx);
                }

                opts.$input.unbind('focus.ax5formatter').bind('focus.ax5formatter', formatterEvent.focus.bind(this, this.queue[optIdx], optIdx));

                opts.$input.unbind('keydown.ax5formatter').bind('keydown.ax5formatter', formatterEvent.keydown.bind(this, this.queue[optIdx], optIdx));

                opts.$input.unbind('keyup.ax5formatter').bind('keyup.ax5formatter', formatterEvent.keyup.bind(this, this.queue[optIdx], optIdx));

                opts.$input.unbind('blur.ax5formatter').bind('blur.ax5formatter', formatterEvent.blur.bind(this, this.queue[optIdx], optIdx));

                formatterEvent.blur.call(this, this.queue[optIdx], optIdx);

                return this;
            };

            var getQueIdx = function getQueIdx(boundID) {
                if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-formatter");
                }
                /*
                 if (!U.isString(boundID)) {
                 console.log(ax5.info.getError("ax5formatter", "402", "getQueIdx"));
                 return;
                 }
                 */
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            };

            /**
             * Preferences of formatter UI
             * @method ax5formatter.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5.ui.formatter}
             * @example
             * ```
             * ```
             */
            this.init = function () {};

            this.bind = function (opts) {
                var formatterConfig = {},
                    optIdx = void 0;

                jQuery.extend(true, formatterConfig, cfg);
                if (opts) jQuery.extend(true, formatterConfig, opts);
                opts = formatterConfig;

                if (!opts.target) {
                    console.log(ax5.info.getError("ax5formatter", "401", "bind"));
                    return this;
                }
                opts.$target = jQuery(opts.target);

                if (opts.$target.get(0).tagName == "INPUT") {
                    opts.$input = opts.$target;
                } else {
                    opts.$input = opts.$target.find('input[type="text"]');
                    if (opts.$input.length > 1) {
                        opts.$input.each(function () {
                            opts.target = this;
                            self.bind(opts);
                        });
                        return this;
                    }
                }

                opts.$input = opts.$target.get(0).tagName == "INPUT" ? opts.$target : opts.$target.find('input[type="text"]');
                if (!opts.id) opts.id = opts.$input.data("ax5-formatter");

                if (!opts.id) {
                    opts.id = 'ax5-formatter-' + ax5.getGuid();
                    opts.$input.data("ax5-formatter", opts.id);
                }
                optIdx = U.search(this.queue, function () {
                    return this.id == opts.id;
                });

                if (optIdx === -1) {
                    this.queue.push(opts);
                    bindFormatterTarget.call(this, this.queue[this.queue.length - 1], this.queue.length - 1);
                } else {
                    this.queue[optIdx] = opts;
                    bindFormatterTarget.call(this, this.queue[optIdx], optIdx);
                }

                return this;
            };

            /**
             * formatter value 를 다시 적용합니다.
             * @method ax5formatter.formatting
             * @returns {ax5formatter}
             * @example
             * ```js
             * $('[data-ax5formatter="time"]').ax5formatter("formatting"); // 하나만
             * $('[data-ax5formatter]').ax5formatter("formatting"); // 모두
             * ```
             */
            this.formatting = function (boundID) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    var i = this.queue.length;
                    while (i--) {
                        formatterEvent.blur.call(this, this.queue[i], i, null, true);
                    }
                } else {
                    formatterEvent.blur.call(this, this.queue[queIdx], queIdx, null, true);
                }
                return this;
            };

            this.unbind = function () {
                // 구현해야함.
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());

    FORMATTER = ax5.ui.formatter;
})();
// ax5.ui.formatter.formatter
(function () {

    var FORMATTER = ax5.ui.formatter;
    var U = ax5.util;
    var TODAY = new Date();

    var ctrlKeys = {
        "18": "KEY_ALT",
        "8": "KEY_BACKSPACE",
        "17": "KEY_CONTROL",
        "46": "KEY_DELETE",
        "40": "KEY_DOWN",
        "35": "KEY_END",
        "187": "KEY_EQUAL",
        "27": "KEY_ESC",
        "36": "KEY_HOME",
        "45": "KEY_INSERT",
        "37": "KEY_LEFT",
        "189": "KEY_MINUS",
        "34": "KEY_PAGEDOWN",
        "33": "KEY_PAGEUP",
        // "190": "KEY_PERIOD",
        "13": "KEY_RETURN",
        "39": "KEY_RIGHT",
        "16": "KEY_SHIFT",
        // "32": "KEY_SPACE",
        "9": "KEY_TAB",
        "38": "KEY_UP",
        "91": "KEY_WINDOW"
        //"107" : "NUMPAD_ADD",
        //"194" : "NUMPAD_COMMA",
        //"110" : "NUMPAD_DECIMAL",
        //"111" : "NUMPAD_DIVIDE",
        //"12" : "NUMPAD_EQUAL",
        //"106" : "NUMPAD_MULTIPLY",
        //"109" : "NUMPAD_SUBTRACT"
    };
    var numKeys = {
        '48': 1, '49': 1, '50': 1, '51': 1, '52': 1, '53': 1, '54': 1, '55': 1, '56': 1, '57': 1,
        '96': 1, '97': 1, '98': 1, '99': 1, '100': 1, '101': 1, '102': 1, '103': 1, '104': 1, '105': 1
    };
    var pattern_money = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '188': ','
            };
            if (_opts.patternArgument == "int") {
                // 소수점 입력 안됨
            } else {
                enterableKeyCodes['190'] = "."; // 소수점 입력 허용
            }
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/[^0-9^\.^\-]/g, "");
            var regExpPattern = new RegExp('([0-9])([0-9][0-9][0-9][,.])'),
                arrNumber = val.split('.'),
                returnValue;

            arrNumber[0] += '.';

            do {
                arrNumber[0] = arrNumber[0].replace(regExpPattern, '$1,$2');
            } while (regExpPattern.test(arrNumber[0]));

            if (arrNumber.length > 1) {
                if (U.isNumber(_opts.maxRound)) {
                    returnValue = arrNumber[0] + U.left(arrNumber[1], _opts.maxRound);
                } else {
                    returnValue = arrNumber.join('');
                }
            } else {
                returnValue = arrNumber[0].split('.')[0];
            }

            return returnValue;
        }
    };

    var pattern_number = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '190': '.',
                '110': '.'

            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/[^0-9^\.^\-]/g, "");
            var arrNumber = val.split('.'),
                returnValue;

            arrNumber[0] += ".";

            if (arrNumber.length > 1) {
                if (U.isNumber(_opts.maxRound)) {
                    returnValue = arrNumber[0] + U.left(arrNumber[1], _opts.maxRound);
                } else {
                    returnValue = arrNumber.join('');
                }
            } else {
                returnValue = arrNumber[0].split('.')[0];
            }

            return returnValue;
        }
    };

    var pattern_date = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-', '191': '/'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            if (val == "") return val;
            var regExpPattern = /^([0-9]{4})\-?([0-9]{1,2})?\-?([0-9]{1,2})?.*$/;

            if (_opts.patternArgument == "time") {
                regExpPattern = /^([0-9]{4})\-?([0-9]{1,2})?\-?([0-9]{1,2})? ?([0-9]{1,2})?:?([0-9]{1,2})?:?([0-9]{1,2})?.*$/;
            } else if (_opts.patternArgument == "year") {
                regExpPattern = /^([0-9]{0,4})?.*$/;
            } else if (_opts.patternArgument == "month") {
                regExpPattern = /^([0-9]{4})\-?([0-9]{1,2})?.*$/;
            }

            var matchedPattern = val.match(regExpPattern),
                returnValue = "",
                inspectValue = function inspectValue(val, format, inspect, data) {
                var _val = {
                    'Y': function Y(v) {
                        if (typeof v == "undefined") v = TODAY.getFullYear();
                        if (v == '' || v == '0000') v = TODAY.getFullYear();
                        return v.length < 4 ? U.setDigit(v, 4) : v;
                    },
                    'M': function M(v) {
                        if (typeof v == "undefined") v = TODAY.getMonth() + 1;
                        return v > 12 ? 12 : v == 0 ? '01' : U.setDigit(v, 2);
                    },
                    'D': function D(v) {
                        if (typeof v == "undefined") v = TODAY.getDate() + 1;
                        var dLen = U.daysOfMonth(data[1], data[2] - 1);
                        return v > dLen ? dLen : v == 0 ? '01' : U.setDigit(v, 2);
                    },
                    'h': function h(v) {
                        if (!v) v = 0;
                        return v > 23 ? 23 : U.setDigit(v, 2);
                    },
                    'm': function m(v) {
                        if (!v) v = 0;
                        return v > 59 ? 59 : U.setDigit(v, 2);
                    },
                    's': function s(v) {
                        if (!v) v = 0;
                        return v > 59 ? 59 : U.setDigit(v, 2);
                    }
                };
                return inspect ? _val[format](val) : val;
            };

            returnValue = val.replace(regExpPattern, function (a, b) {
                var nval = [];

                if (_opts.patternArgument == "year") {
                    nval.push(inspectValue(arguments[1], "Y", eType));
                } else if (_opts.patternArgument == "month") {
                    nval.push(inspectValue(arguments[1], "Y", eType));
                    if (arguments[2] || eType) nval.push('-' + inspectValue(arguments[2], "M", eType));
                } else if (_opts.patternArgument == "time") {
                    nval.push(inspectValue(arguments[1], "Y", eType));
                    if (arguments[2] || eType) nval.push('-' + inspectValue(arguments[2], "M", eType));
                    if (arguments[3] || eType) nval.push('-' + inspectValue(arguments[3], "D", eType, arguments));
                    if (arguments[4] || eType) nval.push(' ' + inspectValue(arguments[4], "h", eType));
                    if (arguments[5] || eType) nval.push(':' + inspectValue(arguments[5], "m", eType));
                    if (arguments[6] || eType) nval.push(':' + inspectValue(arguments[6], "s", eType));
                } else {
                    nval.push(inspectValue(arguments[1], "Y", eType));
                    if (arguments[2] || eType) nval.push('-' + inspectValue(arguments[2], "M", eType));
                    if (arguments[3] || eType) nval.push('-' + inspectValue(arguments[3], "D", eType, arguments));
                }
                return nval.join('');
            });

            if (eType == 'blur' && !matchedPattern) {
                returnValue = function () {
                    var nval = [];

                    if (_opts.patternArgument == "year") {
                        nval.push(inspectValue(0, "Y", eType));
                    } else if (_opts.patternArgument == "month") {
                        nval.push(inspectValue(0, "Y", eType));
                        nval.push('-' + inspectValue(0, "M", eType));
                    } else if (_opts.patternArgument == "time") {
                        nval.push(inspectValue(0, "Y", eType));
                        nval.push('-' + inspectValue(0, "M", eType));
                        nval.push('-' + inspectValue(0, "D", eType, arguments));
                        nval.push(' ' + inspectValue(0, "h", eType));
                        nval.push(':' + inspectValue(0, "m", eType));
                        nval.push(':' + inspectValue(0, "s", eType));
                    } else {
                        nval.push(inspectValue(0, "Y", eType));
                        nval.push('-' + inspectValue(0, "M", eType));
                        nval.push('-' + inspectValue(0, "D", eType, arguments));
                    }
                    return nval.join('');
                }();
            } else if (!matchedPattern) returnValue = returnValue.length > 4 ? U.left(returnValue, 4) : returnValue;

            return returnValue;
        }
    };

    var pattern_time = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '186': ':'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            var regExpPattern = /^([0-9]{1,2})?:?([0-9]{1,2})?:?([0-9]{1,2})?.*$/;

            var matchedPattern = val.match(regExpPattern),
                returnValue = val.replace(regExpPattern, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(':' + arguments[2]);
                if (arguments[3]) nval.push(':' + arguments[3]);
                return nval.join('');
            });

            if (!matchedPattern) returnValue = returnValue.length > 2 ? U.left(returnValue, 2) : returnValue;

            return returnValue;
        }
    };

    var pattern_bizno = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            var regExpPattern = /^([0-9]{3})\-?([0-9]{1,2})?\-?([0-9]{1,5})?.*$/,
                returnValue = val.replace(regExpPattern, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(arguments[2]);
                if (arguments[3]) nval.push(arguments[3]);
                return nval.join("-");
            });

            return returnValue;
        }
    };

    var pattern_phone = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-', '188': ','
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "");
            var regExpPattern3 = /^([0-9]{3})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
            if (val.substr(0, 2) == "02") {
                regExpPattern3 = /^([0-9]{2})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
            }

            var returnValue = val.replace(regExpPattern3, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(arguments[2]);
                if (arguments[3]) nval.push(arguments[3]);
                if (arguments[4]) nval.push(arguments[4]);
                if (arguments[5]) nval.push(arguments[5]);
                return nval.join("-");
            });
            return returnValue;
        }
    };

    var pattern_credit = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            var enterableKeyCodes = {
                '189': '-'
            };
            return jQuery.extend(enterableKeyCodes, FORMATTER.formatter.ctrlKeys, FORMATTER.formatter.numKeys);
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            val = val.replace(/\D/g, "").substring(0, 16);

            var regExpPattern3 = /^([0-9]{4})\-?([0-9]{4})?\-?([0-9]{4})?\-?([0-9]{4})?/,
                returnValue = val.replace(regExpPattern3, function (a, b) {
                var nval = [arguments[1]];
                if (arguments[2]) nval.push(arguments[2]);
                if (arguments[3]) nval.push(arguments[3]);
                if (arguments[4]) nval.push(arguments[4]);
                return nval.join("-");
            });
            return returnValue;
        }
    };

    var pattern_custom = {
        getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
            if (_opts.getEnterableKeyCodes) {
                return _opts.getEnterableKeyCodes.call(_opts, { $input: _opts.$input });
            } else {
                return null;
            }
        },
        getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
            if (_opts.getPatternValue) {
                return _opts.getPatternValue.call(_opts, { event: e, $input: _opts.$input, value: val });
            }
        }
    };

    FORMATTER.formatter = {
        ctrlKeys: ctrlKeys,
        numKeys: numKeys,
        money: pattern_money,
        number: pattern_number,
        date: pattern_date,
        time: pattern_time,
        bizno: pattern_bizno,
        phone: pattern_phone,
        credit: pattern_credit,
        custom: pattern_custom
    };
})();

/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

ax5.ui.formatter_instance = new ax5.ui.formatter();

jQuery.fn.ax5formatter = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "formatting":
                    return ax5.ui.formatter_instance.formatting(this);
                    break;

                case "unbind":
                    return ax5.ui.formatter_instance.unbind(this);
                    break;

                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.formatter_instance.bind(config);
            });
        }
        return this;
    };
}();