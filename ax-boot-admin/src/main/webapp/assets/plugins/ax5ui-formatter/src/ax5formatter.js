// ax5.ui.formatter
(function () {
    const UI = ax5.ui;
    const U = ax5.util;
    let FORMATTER;

    UI.addClass({
        className: "formatter"
    }, (function () {
        const TODAY = new Date();
        const setSelectionRange = function (input, pos) {
            if (typeof pos == "undefined") {
                pos = input.value.length;
            }
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(pos, pos);
            }
            else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
            else if (input.selectionStart) {
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

            const formatterEvent = {
                    'focus': function (opts, optIdx, e) {
                        if (!opts.$input.data("__originValue__")) opts.$input.data("__originValue__", opts.$input.val());
                    },
                    /* 키 다운 이벤트에서 입력할 수 없는 키 입력을 방어 */
                    'keydown': function (opts, optIdx, e) {
                        var isStop = false;
                        if (!opts.enterableKeyCodes) {

                        }
                        else if (e.which && opts.enterableKeyCodes[e.which]) {

                        }
                        else if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                            //console.log(e.which, opts.enterableKeyCodes);
                            isStop = true;
                        }
                        if (isStop) ax5.util.stopEvent(e);
                    },
                    /* 키 업 이벤트에서 패턴을 적용 */
                    'keyup': function (opts, optIdx, e) {
                        var elem = opts.$input.get(0),
                            elemFocusPosition,
                            beforeValue,
                            newValue,
                            selection, selectionLength
                            ;

                        if ('selectionStart' in elem) {
                            // Standard-compliant browsers
                            elemFocusPosition = elem.selectionStart;
                        }
                        else if (document.selection) {
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
                            newValue = beforeValue
                        }

                        if (newValue != beforeValue) {
                            opts.$input.val(newValue).trigger("change");
                            setSelectionRange(elem, elemFocusPosition + newValue.length - beforeValue.length);
                        }
                    },
                    'blur': function (opts, optIdx, e, _force) {
                        var elem = opts.$input.get(0),
                            beforeValue,
                            newValue
                            ;

                        opts.$input.removeData("__originValue__");

                        beforeValue = elem.value;
                        if (opts.pattern in FORMATTER.formatter) {
                            newValue = FORMATTER.formatter[opts.pattern].getPatternValue.call(this, opts, optIdx, e, elem.value, 'blur');
                        } else {
                            newValue = beforeValue
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

            const bindFormatterTarget = function (opts, optIdx) {

                    if (!opts.pattern) {
                        if (opts.$target.get(0).tagName == "INPUT") {
                            opts.pattern = opts.$target
                                .attr('data-ax5formatter');
                        }
                        else {
                            opts.pattern = opts.$target
                                .find('input[type="text"]')
                                .attr('data-ax5formatter');
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

                    opts.$input
                        .unbind('focus.ax5formatter')
                        .bind('focus.ax5formatter', formatterEvent.focus.bind(this, this.queue[optIdx], optIdx));

                    opts.$input
                        .unbind('keydown.ax5formatter')
                        .bind('keydown.ax5formatter', formatterEvent.keydown.bind(this, this.queue[optIdx], optIdx));

                    opts.$input
                        .unbind('keyup.ax5formatter')
                        .bind('keyup.ax5formatter', formatterEvent.keyup.bind(this, this.queue[optIdx], optIdx));

                    opts.$input
                        .unbind('blur.ax5formatter')
                        .bind('blur.ax5formatter', formatterEvent.blur.bind(this, this.queue[optIdx], optIdx));

                    formatterEvent.blur.call(this, this.queue[optIdx], optIdx);

                    return this;

            };

            const getQueIdx = function (boundID) {
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
            this.init = function () {

            };

            this.bind = function (opts) {
                let formatterConfig = {},
                    optIdx;

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
                }
                else {
                    opts.$input = opts.$target.find('input[type="text"]');
                    if (opts.$input.length > 1) {
                        opts.$input.each(function () {
                            opts.target = this;
                            self.bind(opts);
                        });
                        return this;
                    }
                }

                opts.$input = (opts.$target.get(0).tagName == "INPUT") ? opts.$target : opts.$target.find('input[type="text"]');
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
                }
                else {
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
                let queIdx = (U.isNumber(boundID)) ? boundID : getQueIdx.call(this, boundID);
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
            this.main = (function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);
        };
    })());

    FORMATTER = ax5.ui.formatter;
})();