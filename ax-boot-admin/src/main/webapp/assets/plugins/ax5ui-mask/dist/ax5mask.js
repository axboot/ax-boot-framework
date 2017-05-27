'use strict';

// ax5.ui.mask
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var MASK = void 0;

    UI.addClass({
        className: "mask"
    }, function () {
        /**
         * @class ax5mask
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * var customMask = function customMask() {
         *     var cTmpl = '' +
         *         '<div class="ax-mask" id="{{maskId}}" >' +
         *         '    <div class="ax-mask-bg" style="background-color:red !important;"></div>' +
         *         '    <div class="ax-mask-content">' +
         *         '        {{{body}}}' +
         *         '    </div>' +
         *         '</div>';
         *     return cTmpl;
         * };
         * ax5.ui.mask.tmpl.customMask = customMask;
         *
         * var mask = new ax5.ui.mask();
         *
         * mask.open({
         *     templateName: 'customMask',
         *     content: 'custom MASK on target',
         *     target: $("#user-content").get(0),
         *     onClick: function(){
         *         console.log(this);
         *     }
         * });
         * ```
         */
        return function () {
            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: '',
                target: jQuery(document.body).get(0),
                animateTime: 250
            };
            this.maskContent = '';
            this.status = "off";

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                opts = null;
                that = null;
                return true;
            };
            var getBodyTmpl = function getBodyTmpl(data) {
                if (typeof data.templateName === "undefined") data.templateName = "defaultMask";
                return MASK.tmpl.get.call(this, data.templateName, data);
            };
            var setBody = function setBody(content) {
                this.maskContent = content;
            };

            /**
             * Preferences of Mask UI
             * @method ax5mask.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5mask}
             * @example
             * ```
             * setConfig({
             *      target : {Element|AX5 nodelist}, // 마스크 처리할 대상
             *      content : {String}, // 마스크안에 들어가는 내용물
             *      onStateChanged: function(){} // 마스크 상태변경 시 호출되는 함수 this.type으로 예외처리 가능
             * }
             * ```
             */
            this.init = function () {
                // after setConfig();
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                if (this.config.content) setBody.call(this, this.config.content);
            };

            /**
             * open mask
             * target 을 주지 않으면 기본적으로 body 에 마스크가 적용되고 원하는 타겟을 지정해서 마스크를 씌울 수 있습니다.
             * 기본 정의된 마스크 외에 사용자가 템플릿을 정의해서 마스크를 사용 가능합니다.
             * @method ax5mask.open
             * @param {Object} config
             * @param {String} config
             * @returns {ax5mask}
             * @example
             * ```js
             * my_mask.open({
             *     target: document.body,
             *     content: "<h1>Loading..</h1>",
             *     onStateChanged: function () {
             *
             *     }
             * });
             *
             * my_mask.open({
             *     target: $("#mask-target").get(0), // dom Element
             *     content: "<h1>Loading..</h1>",
             *     onStateChanged: function () {
             *
             *     }
             * });
             *
             *
             * var customMask = function customMask() {
             *     var cTmpl = '' +
             *             '<div class="ax-mask" id="{{maskId}}" >' +
             *             '    <div class="ax-mask-bg" style="background-color:red   !important;"></div>' +
             *             '    <div class="ax-mask-content">' +
             *             '        {{{body}}}' +
             *             '    </div>' +
             *             '</div>';
             *     return cTmpl;
             * };
             * ax5.ui.mask.tmpl.customMask = customMask;
             *
             * my_mask.open({
             *     target: $("#mask-target").get(0), // dom Element
             *     content: "<h1>Loading..</h1>",
             *     
             *     onStateChanged: function () {
             *
             *     }
             * });
             * ```
             */
            this.open = function (options) {

                if (this.status === "on") this.close();
                if (options && options.content) setBody.call(this, options.content);
                if (options && typeof options.templateName === "undefined") options.templateName = "defaultMask";
                self.maskConfig = jQuery.extend(true, {}, this.config, options);

                var _cfg = self.maskConfig,
                    target = _cfg.target,
                    $target = jQuery(target),
                    maskId = 'ax-mask-' + ax5.getGuid(),
                    $mask = void 0,
                    css = {},
                    that = {},
                    templateName = _cfg.templateName,
                    body = getBodyTmpl({
                    theme: _cfg.theme,
                    maskId: maskId,
                    body: this.maskContent,
                    templateName: templateName
                });

                jQuery(document.body).append(body);

                // 마스크의 타겟이 html body 가 아니라면
                if (target && target !== jQuery(document.body).get(0)) {
                    css = {
                        position: _cfg.position || "absolute",
                        left: $target.offset().left,
                        top: $target.offset().top,
                        width: $target.outerWidth(),
                        height: $target.outerHeight()
                    };

                    $target.addClass("ax-masking");

                    // 마스크의 타겟이 html body가 아닌경우 window resize 이벤트를 추적하여 엘리먼트 마스크의 CSS 속성 변경
                    jQuery(window).on("resize.ax5mask-" + this.instanceId, function (_$target) {
                        this.align();
                    }.bind(this));
                }

                if (typeof self.maskConfig.zIndex !== "undefined") {
                    css["z-index"] = self.maskConfig.zIndex;
                }

                this.$mask = $mask = jQuery("#" + maskId);
                this.$target = $target;
                this.status = "on";
                $mask.css(css);

                if (_cfg.onClick) {
                    $mask.on("click", function (e) {
                        that = {
                            self: self,
                            state: "open",
                            type: "click"
                        };
                        self.maskConfig.onClick.call(that, that);
                    });
                }

                onStateChanged.call(this, null, {
                    self: this,
                    state: "open"
                });

                options = null;
                _cfg = null;
                target = null;
                $target = null;
                maskId = null;
                $mask = null;
                css = null;
                that = null;
                templateName = null;
                body = null;

                return this;
            };

            /**
             * close mask
             * @method ax5mask.close
             * @param {Number} [_delay=0]
             * @returns {ax5mask}
             * @example
             * ```
             * my_mask.close();
             * ```
             */
            this.close = function (_delay) {
                if (this.$mask) {
                    var _close = function _close() {
                        this.status = "off";
                        this.$mask.remove();
                        this.$target.removeClass("ax-masking");

                        onStateChanged.call(this, null, {
                            self: this,
                            state: "close"
                        });

                        jQuery(window).off("resize.ax5mask-" + this.instanceId);
                    };

                    if (_delay) {
                        setTimeout(function () {
                            _close.call(this);
                        }.bind(this), _delay);
                    } else {
                        _close.call(this);
                    }
                }
                return this;
            };

            /**
             * @method ax5mask.fadeOut
             * @returns {ax5mask}
             */
            this.fadeOut = function () {
                if (this.$mask) {
                    var _close = function _close() {
                        this.status = "off";
                        this.$mask.remove();
                        this.$target.removeClass("ax-masking");

                        onStateChanged.call(this, null, {
                            self: this,
                            state: "close"
                        });

                        jQuery(window).off("resize.ax5mask-" + this.instanceId);
                    };

                    this.$mask.addClass("fade-out");
                    setTimeout(function () {
                        _close.call(this);
                    }.bind(this), cfg.animateTime);
                }
                return this;
            };

            /**
             * @method ax5mask.align
             * @returns {ax5mask}
             */
            this.align = function () {
                if (this.maskConfig && this.maskConfig.target && this.maskConfig.target !== jQuery(document.body).get(0)) {
                    try {
                        var css = {
                            position: this.maskConfig.position || "absolute",
                            left: this.$target.offset().left,
                            top: this.$target.offset().top,
                            width: this.$target.outerWidth(),
                            height: this.$target.outerHeight()
                        };
                        this.$mask.css(css);
                    } catch (e) {}
                }
                return this;
            };

            this.pullRequest = function () {
                console.log("test pullRequest01");
                console.log("test pullRequest02");
            };

            // 클래스 생성자
            this.main = function () {

                UI.mask_instance = UI.mask_instance || [];
                UI.mask_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());
    MASK = ax5.ui.mask;
})();
// ax5.ui.mask.tmpl
(function () {

    var MASK = ax5.ui.mask;

    var defaultMask = function defaultMask(columnKeys) {
        return '\n            <div class="ax-mask {{theme}}" id="{{maskId}}">\n                <div class="ax-mask-bg"></div>\n                <div class="ax-mask-content">\n                    <div class="ax-mask-body">\n                    {{{body}}}\n                    </div>\n                </div>\n            </div>\n        ';
    };

    MASK.tmpl = {
        "defaultMask": defaultMask,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(MASK.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();