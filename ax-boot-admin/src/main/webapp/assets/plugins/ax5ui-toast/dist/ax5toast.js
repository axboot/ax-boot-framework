"use strict";

// ax5.ui.toast
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var TOAST;

    UI.addClass({
        className: "toast"
    }, function () {
        /**
         * @class ax5toast
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * ```js
         * var toast = new ax5.ui.toast();
         * toast.setConfig({
         *     icon: '<i class="fa fa-bug"></i>',
         *     containerPosition: "bottom-right",
         *     closeIcon: '<i class="fa fa-times"></i>'
         * });
         *
         * toast.onStateChanged = function(){
         *     console.log(this);
         * };
         *
         * toast.push({
         *     icon: '<i class="fa fa-book"></i>',
         *     msg:"999999"
         * });
         *
         * toast.push({
         *     theme: theme,
         *     msg: 'toast message'
         * });
         * ```
         */
        var ax5toast = function ax5toast() {
            var self = this,
                cfg,
                toastSeq = 0,
                toastSeqClear = null;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
                theme: 'default',
                width: 300,
                icon: '',
                closeIcon: '',
                msg: '',
                lang: {
                    "ok": "ok", "cancel": "cancel"
                },
                displayTime: 3000,
                animateTime: 250,
                containerPosition: "bottom-left"
            };
            this.toastContainer = null;
            this.queue = [];

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
            },

            /**
             * @method ax5toast.getContent
             * @param {String} toastId
             * @param {Object} opts
             * @returns toastDisplay
             * @example
             * ```js
             * ax5toast.getContent('ax5-toast-3-1', opts);
             * ```
             */
            getContent = function getContent(toastId, opts) {

                var data = {
                    toastId: toastId,
                    theme: opts.theme,
                    icon: opts.icon,
                    msg: (opts.msg || "").replace(/\n/g, "<br/>"),
                    btns: opts.btns,
                    closeIcon: opts.closeIcon
                };

                try {
                    return TOAST.tmpl.get.call(this, "toastDisplay", data);
                } finally {
                    toastId = null;
                    data = null;
                }
            },

            /**
             * @method ax5toast.open
             * @param opts
             * @param callBack
             * @returns {ax5toast}
             */
            open = function open(opts, callBack) {
                if (toastSeqClear) clearTimeout(toastSeqClear);

                var toastBox,
                    box = {
                    width: opts.width
                };

                opts.id = 'ax5-toast-' + self.containerId + '-' + ++toastSeq;
                if (jQuery('#' + opts.id).get(0)) return this;

                if (U.left(cfg.containerPosition, '-') == 'bottom') {
                    this.toastContainer.append(getContent(opts.id, opts));
                } else {
                    this.toastContainer.prepend(getContent(opts.id, opts));
                }

                toastBox = jQuery('#' + opts.id);
                toastBox.css({ width: box.width });
                opts.toastBox = toastBox;
                this.queue.push(opts);

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "open",
                    toastId: opts.id
                });

                if (opts.toastType === "push") {
                    // 자동 제거 타이머 시작
                    setTimeout(function () {
                        this.close(opts, callBack);
                    }.bind(this), cfg.displayTime);

                    toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName, function (e) {
                        btnOnClick.call(this, e || window.event, opts, toastBox, callBack);
                    }.bind(this));
                } else if (opts.toastType === "confirm") {
                    toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName, function (e) {
                        btnOnClick.call(this, e || window.event, opts, toastBox, callBack);
                    }.bind(this));
                }

                box = null;
            },
                btnOnClick = function btnOnClick(e, opts, toastBox, callBack, target, k) {
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-ax-toast-btn")) {
                        return true;
                    }
                });

                if (target) {
                    k = target.getAttribute("data-ax-toast-btn");

                    var that = {
                        key: k, value: opts.btns ? opts.btns[k] : k,
                        toastId: opts.id,
                        btn_target: target
                    };

                    if (opts.btns && opts.btns[k].onClick) {
                        opts.btns[k].onClick.call(that, k);
                    } else if (opts.toastType === "push") {
                        if (callBack) callBack.call(that, k);
                        this.close(opts, callBack);
                    } else if (opts.toastType === "confirm") {
                        if (callBack) callBack.call(that, k);
                        this.close(opts, callBack);
                    }
                }

                e = null;
                opts = null;
                toastBox = null;
                callBack = null;
                target = null;
                k = null;
            };

            /**
             * Preferences of toast UI
             * @method ax5toast.set_config
             * @param {Object} config - 클래스 속성값
             * @returns {ax5toast}
             * @example
             * ```
             * ```
             */
            //== class body start
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                // after set_config();
                self.containerId = ax5.getGuid();
                var styles = [];
                if (cfg.zIndex) {
                    styles.push("z-index:" + cfg.zIndex);
                }
                jQuery(document.body).append('<div class="ax5-ui-toast-container ' + cfg.containerPosition + '" data-toast-container="' + '' + self.containerId + '" style="' + styles.join(";") + '"></div>');
                this.toastContainer = jQuery('[data-toast-container="' + self.containerId + '"]');
            };

            /**
             * @method ax5toast.push
             * @param opts
             * @param callBack
             * @returns {ax5toast}
             */
            this.push = function (opts, callBack) {
                if (!self.containerId) {
                    this.init();
                }
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }
                opts.toastType = "push";

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                open.call(this, opts, callBack);

                opts = null;
                callBack = null;
                return this;
            };

            /**
             * @method ax5toast.confirm
             * @param opts
             * @param callBack
             * @returns {ax5toast}
             */
            this.confirm = function (opts, callBack) {
                if (!self.containerId) {
                    this.init();
                }
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }
                opts.toastType = "confirm";

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme }
                    };
                }
                open.call(this, opts, callBack);

                opts = null;
                callBack = null;
                return this;
            };

            /**
             * close the toast
             * @method ax5toast.close
             * @returns {ax5toast}
             * @example
             * ```
             * my_toast.close();
             * ```
             */
            this.close = function (opts, callBack) {
                if (typeof opts === "undefined") {
                    opts = U.last(this.queue);
                }

                var toastBox = opts.toastBox;
                toastBox.addClass(opts.toastType == "push" ? "removed" : "destroy");
                this.queue = U.filter(this.queue, function () {
                    return opts.id != this.id;
                });
                setTimeout(function () {
                    var that = {
                        toastId: opts.id
                    };

                    toastBox.remove();
                    if (callBack) callBack.call(that);

                    that = {
                        self: this,
                        state: "close",
                        toastId: opts.id
                    };
                    onStateChanged.call(this, opts, that);

                    // 3초후에도 아무 일이 없다면 완전히 제거
                    if (this.queue.length === 0) {
                        if (toastSeqClear) clearTimeout(toastSeqClear);
                        toastSeqClear = setTimeout(function () {
                            /// console.log("try clear seq");
                            if (this.queue.length === 0) toastSeq = 0;
                        }.bind(this), 3000);
                    }

                    that = null;
                    opts = null;
                    callBack = null;
                    toastBox = null;
                }.bind(this), cfg.animateTime);

                return this;
            };

            // 클래스 생성자
            this.main = function () {

                UI.toast_instance = UI.toast_instance || [];
                UI.toast_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5toast;
    }());
    TOAST = ax5.ui.toast;
})();
// ax5.ui.toast.tmpl
(function () {

    var TOAST = ax5.ui.toast;

    var toastDisplay = function toastDisplay(columnKeys) {
        return "\n        <div id=\"{{toastId}}\" data-ax5-ui=\"toast\" class=\"ax5-ui-toast {{theme}}\">\n            {{#icon}}\n            <div class=\"ax-toast-icon\">{{{.}}}</div>\n            {{/icon}}\n            <div class=\"ax-toast-body\">{{{msg}}}</div>\n            {{#btns}}\n            <div class=\"ax-toast-buttons\">\n                <div class=\"ax-button-wrap\">\n                    {{#@each}}\n                    <button type=\"button\" data-ax-toast-btn=\"{{@key}}\" class=\"btn btn-{{@value.theme}}\">{{{@value.label}}}</button>\n                    {{/@each}}\n                </div>\n            </div>\n            {{/btns}}\n            {{^btns}}\n                <a class=\"ax-toast-close\" data-ax-toast-btn=\"ok\">{{{closeIcon}}}</a>\n            {{/btns}}\n            <div style=\"clear:both;\"></div>\n        </div>";
    };

    TOAST.tmpl = {
        "toastDisplay": toastDisplay,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(TOAST.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();