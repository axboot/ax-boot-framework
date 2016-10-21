"use strict";

// ax5.ui.modal
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var MODAL;

    UI.addClass({
        className: "modal",
        version: "1.3.2"
    }, function () {
        /**
         * @class ax5modal
         * @alias ax5.ui.modal
         * @author tom@axisj.com
         * @example
         * ```js
         * var modal = new ax5.ui.modal({
         *     iframeLoadingMsg: '<i class="fa fa-spinner fa-5x fa-spin" aria-hidden="true"></i>',
         *     header: {
         *         title: "MODAL TITLE",
         *         btns: {
         *             minimize: {
         *                 label: '<i class="fa fa-minus-circle" aria-hidden="true"></i>', onClick: function () {
         *                     modal.minimize();
         *                 }
         *             },
         *             maximize: {
         *                 label: '<i class="fa fa-plus-circle" aria-hidden="true"></i>', onClick: function () {
         *                     modal.maximize();
         *                 }
         *             },
         *             close: {
         *                 label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function () {
         *                     modal.close();
         *                 }
         *             }
         *         }
         *     }
         * });
         *
         * modal.open({
         *     width: 800,
         *     height: 600,
         *     fullScreen: function(){
         *         return ($(window).width() < 600);
         *     },
         *     iframe: {
         *         method: "get",
         *         url: "http://chequer-app:2017/html/login.html",
         *         param: "callback=modalCallback"
         *     }
         * });
         * ```
         */
        var ax5modal = function ax5modal() {
            var self = this,
                cfg,
                ENM = {
                "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
                "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
                "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
            },
                getMousePosition = function getMousePosition(e) {
                var mouseObj = e;
                if ('changedTouches' in e) {
                    mouseObj = e.changedTouches[0];
                }
                return {
                    clientX: mouseObj.clientX,
                    clientY: mouseObj.clientY
                };
            };

            this.instanceId = ax5.getGuid();
            this.config = {
                id: 'ax5-modal-' + this.instanceId,
                position: {
                    left: "center",
                    top: "middle",
                    margin: 10
                },
                minimizePosition: "bottom-right",
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
                theme: 'default',
                width: 300,
                height: 400,
                closeToEsc: true,
                animateTime: 250
            };
            this.activeModal = null;
            this.$ = {}; // UI inside of the jQuery object store

            cfg = this.config; // extended config copy cfg

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
                getContent = function getContent(modalId, opts) {
                var data = {
                    modalId: modalId,
                    theme: opts.theme,
                    header: opts.header,
                    fullScreen: opts.fullScreen ? "fullscreen" : "",
                    styles: "",
                    iframe: opts.iframe,
                    iframeLoadingMsg: opts.iframeLoadingMsg
                };

                if (opts.zIndex) {
                    data.styles += "z-index:" + opts.zIndex + ";";
                }
                if (opts.absolute) {
                    data.styles += "position:absolute;";
                }

                if (data.iframe && typeof data.iframe.param === "string") {
                    data.iframe.param = ax5.util.param(data.iframe.param);
                }

                return MODAL.tmpl.get.call(this, "content", data, {});
            },
                open = function open(opts, callback) {
                var that;
                jQuery(document.body).append(getContent.call(this, opts.id, opts));

                this.activeModal = jQuery('#' + opts.id);

                // 파트수집
                this.$ = {
                    "root": this.activeModal.find('[data-modal-els="root"]'),
                    "header": this.activeModal.find('[data-modal-els="header"]'),
                    "body": this.activeModal.find('[data-modal-els="body"]')
                };

                if (opts.iframe) {
                    this.$["iframe-wrap"] = this.activeModal.find('[data-modal-els="iframe-wrap"]');
                    this.$["iframe"] = this.activeModal.find('[data-modal-els="iframe"]');
                    this.$["iframe-form"] = this.activeModal.find('[data-modal-els="iframe-form"]');
                    this.$["iframe-loading"] = this.activeModal.find('[data-modal-els="iframe-loading"]');
                }

                //- position 정렬
                this.align();

                that = {
                    self: this,
                    id: opts.id,
                    theme: opts.theme,
                    width: opts.width,
                    height: opts.height,
                    state: "open",
                    $: this.$
                };

                if (opts.iframe) {
                    this.$["iframe-wrap"].css({ height: opts.height });
                    this.$["iframe"].css({ height: opts.height });

                    // iframe content load
                    this.$["iframe-form"].attr({ "method": opts.iframe.method });
                    this.$["iframe-form"].attr({ "target": opts.id + "-frame" });
                    this.$["iframe-form"].attr({ "action": opts.iframe.url });
                    this.$["iframe"].on("load", function () {
                        that.state = "load";
                        if (opts.iframeLoadingMsg) {
                            this.$["iframe-loading"].hide();
                        }
                        onStateChanged.call(this, opts, that);
                    }.bind(this));
                    if (!opts.iframeLoadingMsg) {
                        this.$["iframe"].show();
                    }
                    this.$["iframe-form"].submit();
                }

                if (callback) callback.call(that);
                onStateChanged.call(this, opts, that);

                // bind key event
                if (opts.closeToEsc) {
                    jQuery(window).bind("keydown.ax-modal", function (e) {
                        onkeyup.call(this, e || window.event);
                    }.bind(this));
                }
                jQuery(window).bind("resize.ax-modal", function (e) {
                    this.align(null, e || window.event);
                }.bind(this));

                this.activeModal.find("[data-modal-header-btn]").on(cfg.clickEventName, function (e) {
                    btnOnClick.call(this, e || window.event, opts);
                }.bind(this));

                this.$.header.bind(ENM["mousedown"], function (e) {
                    if (opts.isFullScreen) return false;

                    /// 이벤트 필터링 추가 : 버튼엘리먼트로 부터 발생된 이벤트이면 moveModal 시작하지 않도록 필터링
                    var isButton = U.findParentNode(e.target, function (_target) {
                        if (_target.getAttribute("data-modal-header-btn")) {
                            return true;
                        }
                    });

                    if (!isButton) {
                        self.mousePosition = getMousePosition(e);
                        moveModal.on.call(self);
                    }
                }).bind("dragstart", function (e) {
                    U.stopEvent(e);
                    return false;
                });
            },
                btnOnClick = function btnOnClick(e, opts, callback, target, k) {
                var that;
                if (e.srcElement) e.target = e.srcElement;

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-modal-header-btn")) {
                        return true;
                    }
                });

                if (target) {
                    k = target.getAttribute("data-modal-header-btn");

                    that = {
                        self: this,
                        key: k, value: opts.header.btns[k],
                        dialogId: opts.id,
                        btnTarget: target
                    };

                    if (opts.header.btns[k].onClick) {
                        opts.header.btns[k].onClick.call(that, k);
                    }
                }

                that = null;
                opts = null;
                callback = null;
                target = null;
                k = null;
            },
                onkeyup = function onkeyup(e) {
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                }
            },
                alignProcessor = {
                "top-left": function topLeft() {
                    this.align({ left: "left", top: "top" });
                },
                "top-right": function topRight() {
                    this.align({ left: "right", top: "top" });
                },
                "bottom-left": function bottomLeft() {
                    this.align({ left: "left", top: "bottom" });
                },
                "bottom-right": function bottomRight() {
                    this.align({ left: "right", top: "bottom" });
                },
                "center-middle": function centerMiddle() {
                    this.align({ left: "center", top: "middle" });
                }
            },
                moveModal = {
                "on": function on() {
                    var modalZIndex = this.activeModal.css("z-index");
                    var modalOffset = this.activeModal.position();
                    var modalBox = {
                        width: this.activeModal.outerWidth(), height: this.activeModal.outerHeight()
                    };
                    var windowBox = {
                        width: jQuery(window).width(),
                        height: jQuery(window).height()
                    };
                    var getResizerPosition = function getResizerPosition(e) {
                        self.__dx = e.clientX - self.mousePosition.clientX;
                        self.__dy = e.clientY - self.mousePosition.clientY;

                        var minX = 0;
                        var maxX = windowBox.width - modalBox.width;
                        var minY = 0;
                        var maxY = windowBox.height - modalBox.height;

                        if (minX > modalOffset.left + self.__dx) {
                            self.__dx = -modalOffset.left;
                        } else if (maxX < modalOffset.left + self.__dx) {
                            self.__dx = maxX - modalOffset.left;
                        }

                        if (minY > modalOffset.top + self.__dy) {
                            self.__dy = -modalOffset.top;
                        } else if (maxY < modalOffset.top + self.__dy) {
                            self.__dy = maxY - modalOffset.top;
                        }

                        return {
                            left: modalOffset.left + self.__dx + $(document).scrollLeft(),
                            top: modalOffset.top + self.__dy + $(document).scrollTop()
                        };
                    };

                    self.__dx = 0; // 변화량 X
                    self.__dy = 0; // 변화량 Y

                    jQuery(document.body).bind(ENM["mousemove"] + ".ax5modal-" + cfg.id, function (e) {
                        if (!self.resizer) {
                            // self.resizerBg : body 가 window보다 작을 때 문제 해결을 위한 DIV
                            self.resizerBg = jQuery('<div class="ax5modal-resizer-background" ondragstart="return false;"></div>');
                            self.resizer = jQuery('<div class="ax5modal-resizer" ondragstart="return false;"></div>');
                            self.resizerBg.css({ zIndex: modalZIndex });
                            self.resizer.css({
                                left: modalOffset.left,
                                top: modalOffset.top,
                                width: modalBox.width,
                                height: modalBox.height,
                                zIndex: modalZIndex + 1
                            });
                            jQuery(document.body).append(self.resizerBg).append(self.resizer);
                            self.activeModal.addClass("draged");
                        }
                        self.resizer.css(getResizerPosition(e));
                    }).bind(ENM["mouseup"] + ".ax5layout-" + this.instanceId, function (e) {
                        moveModal.off.call(self);
                    }).bind("mouseleave.ax5layout-" + this.instanceId, function (e) {
                        moveModal.off.call(self);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
                },
                "off": function off() {
                    var setModalPosition = function setModalPosition() {
                        //console.log(this.activeModal.offset(), this.__dx);
                        var box = this.activeModal.offset();
                        box.left += this.__dx - $(document).scrollLeft();
                        box.top += this.__dy - $(document).scrollTop();
                        this.activeModal.css(box);
                    };

                    if (this.resizer) {
                        this.activeModal.removeClass("draged");
                        this.resizer.remove();
                        this.resizer = null;
                        this.resizerBg.remove();
                        this.resizerBg = null;
                        setModalPosition.call(this);
                        //this.align();
                    }

                    jQuery(document.body).unbind(ENM["mousemove"] + ".ax5modal-" + cfg.id).unbind(ENM["mouseup"] + ".ax5modal-" + cfg.id).unbind("mouseleave.ax5modal-" + cfg.id);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
                }
            };

            /// private end

            /**
             * Preferences of modal UI
             * @method ax5modal.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Number} [config.zIndex]
             * @param {Boolean} [config.absolute=false]
             * @returns {ax5modal}
             * @example
             * ```
             * ```
             */
            //== class body start
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
            };

            /**
             * open the modal
             * @method ax5modal.open
             * @returns {ax5modal}
             * @example
             * ```
             * my_modal.open();
             * ```
             */
            this.open = function (opts, callback) {
                if (!this.activeModal) {
                    opts = self.modalConfig = jQuery.extend(true, {}, cfg, opts);
                    open.call(this, opts, callback);
                }
                return this;
            };

            /**
             * close the modal
             * @method ax5modal.close
             * @returns {ax5modal}
             * @example
             * ```
             * my_modal.close();
             * ```
             */
            this.close = function (opts) {
                if (this.activeModal) {
                    opts = self.modalConfig;
                    this.activeModal.addClass("destroy");
                    jQuery(window).unbind("keydown.ax-modal");
                    jQuery(window).unbind("resize.ax-modal");

                    setTimeout(function () {
                        if (this.activeModal) {
                            this.activeModal.remove();
                            this.activeModal = null;
                        }
                        onStateChanged.call(this, opts, {
                            self: this,
                            state: "close"
                        });
                    }.bind(this), cfg.animateTime);
                }

                this.minimized = false; // hoksi

                return this;
            };

            /**
             * @method ax5modal.minimize
             * @returns {ax5modal}
             */
            this.minimize = function () {

                return function (minimizePosition) {

                    if (this.minimized !== true) {

                        var opts = self.modalConfig;
                        if (typeof minimizePosition === "undefined") minimizePosition = cfg.minimizePosition;

                        this.minimized = true;
                        this.$.body.hide();
                        self.modalConfig.originalHeight = opts.height;
                        self.modalConfig.height = 0;
                        alignProcessor[minimizePosition].call(this);

                        onStateChanged.call(this, opts, {
                            self: this,
                            state: "minimize"
                        });
                    }

                    return this;
                };
            }();

            /**
             * @method ax5modal.maximize
             * @returns {ax5modal}
             */
            this.maximize = function () {
                var opts = self.modalConfig;
                if (this.minimized) {
                    this.minimized = false;
                    this.$.body.show();
                    self.modalConfig.height = self.modalConfig.originalHeight;
                    self.modalConfig.originalHeight = undefined;

                    this.align({ left: "center", top: "middle" });
                    onStateChanged.call(this, opts, {
                        self: this,
                        state: "restore"
                    });
                }
                return this;
            };

            /**
             * setCSS
             * @method ax5modal.css
             * @param {Object} css -
             * @returns {ax5modal}
             */
            this.css = function (css) {
                if (this.activeModal && !self.fullScreen) {
                    this.activeModal.css(css);
                    if (css.width) {
                        self.modalConfig.width = this.activeModal.width();
                    }
                    if (css.height) {
                        self.modalConfig.height = this.activeModal.height();
                        if (this.$["iframe"]) {
                            this.$["iframe-wrap"].css({ height: self.modalConfig.height });
                            this.$["iframe"].css({ height: self.modalConfig.height });
                        }
                    }
                }
                return this;
            };

            /**
             * @method ax5modal.setModalConfig
             * @param _config
             * @returns {ax5.ui.ax5modal}
             */
            this.setModalConfig = function (_config) {
                self.modalConfig = jQuery.extend({}, self.modalConfig, _config);
                this.align();
                return this;
            };

            /**
             * @method ax5modal.align
             * @param position
             * @param e
             * @returns {ax5modal}
             */
            this.align = function () {

                return function (position, e) {
                    if (!this.activeModal) return this;

                    var opts = self.modalConfig,
                        box = {
                        width: opts.width,
                        height: opts.height
                    };

                    var fullScreen = opts.isFullScreen = function (_fullScreen) {
                        if (typeof _fullScreen === "undefined") {
                            return false;
                        } else if (U.isFunction(_fullScreen)) {
                            return _fullScreen();
                        }
                    }(opts.fullScreen);

                    if (fullScreen) {
                        if (opts.header) this.$.header.show();
                        box.width = jQuery(window).width();
                        box.height = opts.height;
                        box.left = 0;
                        box.top = 0;
                    } else {
                        if (opts.header) this.$.header.show();
                        if (position) {
                            jQuery.extend(true, opts.position, position);
                        }

                        if (opts.header) {
                            opts.headerHeight = this.$.header.outerHeight();
                            box.height += opts.headerHeight;
                        } else {
                            opts.headerHeight = 0;
                        }

                        //- position 정렬
                        if (opts.position.left == "left") {
                            box.left = opts.position.margin || 0;
                        } else if (opts.position.left == "right") {
                            // window.innerWidth;
                            box.left = jQuery(window).width() - box.width - (opts.position.margin || 0);
                        } else if (opts.position.left == "center") {
                            box.left = jQuery(window).width() / 2 - box.width / 2;
                        } else {
                            box.left = opts.position.left || 0;
                        }

                        if (opts.position.top == "top") {
                            box.top = opts.position.margin || 0;
                        } else if (opts.position.top == "bottom") {
                            box.top = jQuery(window).height() - box.height - (opts.position.margin || 0);
                        } else if (opts.position.top == "middle") {
                            box.top = jQuery(window).height() / 2 - box.height / 2;
                        } else {
                            box.top = opts.position.top || 0;
                        }
                        if (box.left < 0) box.left = 0;
                        if (box.top < 0) box.top = 0;
                    }

                    this.activeModal.css(box);

                    if (opts.iframe) {
                        this.$["iframe-wrap"].css({ height: box.height - opts.headerHeight });
                        this.$["iframe"].css({ height: box.height - opts.headerHeight });
                    }
                    return this;
                };
            }();

            // 클래스 생성자
            this.main = function () {

                UI.modal_instance = UI.modal_instance || [];
                UI.modal_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5modal;
    }());

    MODAL = ax5.ui.modal;
})();
// ax5.ui.modal.tmpl
(function () {
    var MODAL = ax5.ui.modal;

    var content = function content() {
        return " \n        <div id=\"{{modalId}}\" data-modal-els=\"root\" class=\"ax5modal {{theme}} {{fullscreen}}\" style=\"{{styles}}\">\n            {{#header}}\n            <div class=\"ax-modal-header\" data-modal-els=\"header\">\n                {{{title}}}\n                {{#btns}}\n                    <div class=\"ax-modal-header-addon\">\n                    {{#@each}}\n                    <button tabindex=\"-1\" data-modal-header-btn=\"{{@key}}\" class=\"{{@value.theme}}\">{{{@value.label}}}</button>\n                    {{/@each}}\n                    </div>\n                {{/btns}}\n            </div>\n            {{/header}}\n            <div class=\"ax-modal-body\" data-modal-els=\"body\">\n            {{#iframe}}\n            \n                <div data-modal-els=\"iframe-wrap\" style=\"-webkit-overflow-scrolling: touch; overflow: auto;position: relative;\">\n                    <table data-modal-els=\"iframe-loading\" style=\"width:100%;height:100%;\"><tr><td style=\"text-align: center;vertical-align: middle\">{{{iframeLoadingMsg}}}</td></tr></table>\n                    <iframe name=\"{{modalId}}-frame\" src=\"\" width=\"100%\" height=\"100%\" frameborder=\"0\" data-modal-els=\"iframe\" style=\"position: absolute;left:0;top:0;\"></iframe>\n                </div>\n                <form name=\"{{modalId}}-form\" data-modal-els=\"iframe-form\">\n                <input type=\"hidden\" name=\"modalId\" value=\"{{modalId}}\" />\n                {{#param}}\n                {{#@each}}\n                <input type=\"hidden\" name=\"{{@key}}\" value=\"{{@value}}\" />\n                {{/@each}}\n                {{/param}}\n                </form>\n            {{/iframe}}\n            </div>\n            <div class=\"ax-modal-body-mask\"></div>\n        </div>\n        ";
    };

    MODAL.tmpl = {
        "content": content,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(MODAL.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();