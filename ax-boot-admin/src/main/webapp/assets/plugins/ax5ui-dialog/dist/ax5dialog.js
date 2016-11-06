"use strict";

// ax5.ui.dialog
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var DIALOG;

    UI.addClass({
        className: "dialog",
        version: "1.3.22"
    }, function () {
        /**
         * @class ax5dialog
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * var dialog = new ax5.ui.dialog();
         * var mask = new ax5.ui.mask();
         * dialog.setConfig({
         *     zIndex: 5000,
         *     onStateChanged: function () {
         *         if (this.state === "open") {
         *             mask.open();
         *         }
         *         else if (this.state === "close") {
         *             mask.close();
         *         }
         *     }
         * });
         *
         * dialog.alert({
         *     theme: 'default',
         *     title: 'Alert default',
         *     msg: theme + ' color'
         * }, function () {
         *     console.log(this);
         * });
         * ```
         */
        var ax5dialog = function ax5dialog() {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                id: 'ax5-dialog-' + this.instanceId,
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                width: 300,
                title: '',
                msg: '',
                lang: {
                    "ok": "ok", "cancel": "cancel"
                },
                animateTime: 150
            };
            this.activeDialog = null;
            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
                return true;
            },

            /**
             * @method ax5dialog.getContent
             * @param {String} dialogId
             * @param {Object} opts
             * @returns dialogDisplay
             */
            getContent = function getContent(dialogId, opts) {
                var data = {
                    dialogId: dialogId,
                    title: opts.title || cfg.title || "",
                    msg: (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>"),
                    input: opts.input,
                    btns: opts.btns,
                    '_crlf': function _crlf() {
                        return this.replace(/\n/g, "<br/>");
                    }
                };

                try {
                    return DIALOG.tmpl.get.call(this, "dialogDisplay", data);
                } finally {
                    data = null;
                }
            },

            /**
             * @method ax5dialog.open
             * @param {Object} opts
             * @param callback
             */
            open = function open(opts, callback) {
                var pos = {},
                    box;

                opts.id = opts.id || cfg.id;

                box = {
                    width: opts.width
                };
                jQuery(document.body).append(getContent.call(this, opts.id, opts));

                this.activeDialog = jQuery('#' + opts.id);
                this.activeDialog.css({ width: box.width });

                // dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
                opts.height = box.height = this.activeDialog.height();

                //- position 정렬
                if (typeof opts.position === "undefined" || opts.position === "center") {
                    pos.top = jQuery(window).height() / 2 - box.height / 2;
                    pos.left = jQuery(window).width() / 2 - box.width / 2;
                } else {
                    pos.left = opts.position.left || 0;
                    pos.top = opts.position.top || 0;
                }
                if (cfg.zIndex) {
                    pos["z-index"] = cfg.zIndex;
                }
                this.activeDialog.css(pos);

                // bind button event
                if (opts.dialogType === "prompt") {
                    this.activeDialog.find("[data-dialog-prompt]").get(0).focus();
                } else {
                    this.activeDialog.find("[data-dialog-btn]").get(0).focus();
                }

                this.activeDialog.find("[data-dialog-btn]").on(cfg.clickEventName, function (e) {
                    btnOnClick.call(this, e || window.event, opts, callback);
                }.bind(this));

                // bind key event
                jQuery(window).bind("keydown.ax5dialog", function (e) {
                    onKeyup.call(this, e || window.event, opts, callback);
                }.bind(this));

                jQuery(window).bind("resize.ax5dialog", function (e) {
                    align.call(this, e || window.event);
                }.bind(this));

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "open"
                });

                pos = null;
                box = null;
            },
                align = function align(e) {
                if (!this.activeDialog) return this;
                var opts = self.dialogConfig,
                    box = {
                    width: opts.width,
                    height: opts.height
                };
                //- position 정렬
                if (typeof opts.position === "undefined" || opts.position === "center") {
                    box.top = window.innerHeight / 2 - box.height / 2;
                    box.left = window.innerWidth / 2 - box.width / 2;
                } else {
                    box.left = opts.position.left || 0;
                    box.top = opts.position.top || 0;
                }
                if (box.left < 0) box.left = 0;
                if (box.top < 0) box.top = 0;

                this.activeDialog.css(box);

                opts = null;
                box = null;

                return this;
            },
                btnOnClick = function btnOnClick(e, opts, callback, target, k) {
                var that;
                if (e.srcElement) e.target = e.srcElement;

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-dialog-btn")) {
                        return true;
                    }
                });

                if (target) {
                    k = target.getAttribute("data-dialog-btn");

                    that = {
                        self: this,
                        key: k, value: opts.btns[k],
                        dialogId: opts.id,
                        btnTarget: target
                    };
                    if (opts.dialogType === "prompt") {
                        var emptyKey = null;
                        for (var oi in opts.input) {
                            that[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                            if (that[oi] == "" || that[oi] == null) {
                                emptyKey = oi;
                                break;
                            }
                        }
                    }
                    if (opts.btns[k].onClick) {
                        opts.btns[k].onClick.call(that, k);
                    } else if (opts.dialogType === "alert") {
                        if (callback) callback.call(that, k);
                        this.close({ doNotCallback: true });
                    } else if (opts.dialogType === "confirm") {
                        if (callback) callback.call(that, k);
                        this.close({ doNotCallback: true });
                    } else if (opts.dialogType === "prompt") {
                        if (k === 'ok') {
                            if (emptyKey) {
                                this.activeDialog.find('[data-dialog-prompt="' + emptyKey + '"]').get(0).focus();
                                return false;
                            }
                        }
                        if (callback) callback.call(that, k);
                        this.close({ doNotCallback: true });
                    }
                }

                that = null;
                opts = null;
                callback = null;
                target = null;
                k = null;
            },
                onKeyup = function onKeyup(e, opts, callback, target, k) {
                var that,
                    emptyKey = null;

                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                }
                if (opts.dialogType === "prompt") {
                    if (e.keyCode == ax5.info.eventKeys.RETURN) {
                        that = {
                            self: this,
                            key: k, value: opts.btns[k],
                            dialogId: opts.id,
                            btnTarget: target
                        };

                        for (var oi in opts.input) {
                            that[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                            if (that[oi] == "" || that[oi] == null) {
                                emptyKey = oi;
                                break;
                            }
                        }
                        if (emptyKey) {
                            that = null;
                            emptyKey = null;
                            return false;
                        }
                        if (callback) callback.call(that, k);
                        this.close({ doNotCallback: true });
                    }
                }

                that = null;
                emptyKey = null;
                opts = null;
                callback = null;
                target = null;
                k = null;
            };

            /**
             * Preferences of dialog UI
             * @method ax5dialog.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Number} [config.zIndex]
             * @returns {ax5dialog}
             * @example
             * ```
             * ```
             */
            //== class body start
            this.init = function () {

                this.onStateChanged = cfg.onStateChanged;
                // this.onLoad = cfg.onLoad;
            };

            /**
             * open the dialog of alert type
             * @method ax5dialog.alert
             * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.alert({
             *  title: 'app title',
             *  msg: 'alert'
             * }, function(){});
             * ```
             */
            this.alert = function (opts, callback, tryCount) {
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }

                if (this.activeDialog) {
                    // try one more
                    if (!tryCount) {
                        setTimeout(function () {
                            this.alert(opts, callback, 1);
                        }.bind(this), Number(cfg.animateTime) + 100);
                    } else {
                        console.log(ax5.info.getError("ax5dialog", "501", "alert"));
                    }
                    return this;
                }

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                opts.dialogType = "alert";
                opts.theme = opts.theme || cfg.theme || "";
                opts.callback = callback;

                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme }
                    };
                }
                open.call(this, opts, callback);

                return this;
            };

            /**
             * open the dialog of confirm type
             * @method ax5dialog.confirm
             * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.confirm({
             *  title: 'app title',
             *  msg: 'confirm'
             * }, function(){});
             * ```
             */
            this.confirm = function (opts, callback, tryCount) {
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }

                if (this.activeDialog) {
                    // try one more
                    if (!tryCount) {
                        setTimeout(function () {
                            this.confirm(opts, callback, 1);
                        }.bind(this), Number(cfg.animateTime) + 100);
                    } else {
                        console.log(ax5.info.getError("ax5dialog", "501", "confirm"));
                    }
                    return this;
                }

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;

                opts.dialogType = "confirm";
                opts.theme = opts.theme || cfg.theme || "";
                opts.callback = callback;

                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme },
                        cancel: { label: cfg.lang["cancel"] }
                    };
                }
                open.call(this, opts, callback);

                return this;
            };

            /**
             * open the dialog of prompt type
             * @method ax5dialog.prompt
             * @param {Object|String} [{theme, title, msg, btns, input}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.prompt({
             *  title: 'app title',
             *  msg: 'alert'
             * }, function(){});
             * ```
             */
            this.prompt = function (opts, callback, tryCount) {
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    };
                }

                if (this.activeDialog) {
                    // try one more
                    if (!tryCount) {
                        setTimeout(function () {
                            this.prompt(opts, callback, 1);
                        }.bind(this), Number(cfg.animateTime) + 100);
                    } else {
                        console.log(ax5.info.getError("ax5dialog", "501", "prompt"));
                    }
                    return this;
                }

                self.dialogConfig = {};
                jQuery.extend(true, self.dialogConfig, cfg, opts);
                opts = self.dialogConfig;
                opts.dialogType = "prompt";
                opts.theme = opts.theme || cfg.theme || "";
                opts.callback = callback;

                if (typeof opts.input === "undefined") {
                    opts.input = {
                        value: { label: "" }
                    };
                }
                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: { label: cfg.lang["ok"], theme: opts.theme },
                        cancel: { label: cfg.lang["cancel"] }
                    };
                }
                open.call(this, opts, callback);

                return this;
            };

            /**
             * close the dialog
             * @method ax5dialog.close
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.close();
             * ```
             */
            this.close = function (_option) {
                var opts, that;
                if (this.activeDialog) {
                    opts = self.dialogConfig;
                    this.activeDialog.addClass("destroy");
                    jQuery(window).unbind("keydown.ax5dialog");
                    jQuery(window).unbind("resize.ax5dialog");

                    setTimeout(function () {
                        if (this.activeDialog) {
                            this.activeDialog.remove();
                            this.activeDialog = null;
                        }

                        that = {
                            self: this,
                            state: "close",
                            dialogId: opts.id
                        };

                        if (opts.callback && (!_option || !_option.doNotCallback)) {
                            opts.callback.call(that);
                        }

                        if (opts && opts.onStateChanged) {
                            opts.onStateChanged.call(that, that);
                        } else if (this.onStateChanged) {
                            this.onStateChanged.call(that, that);
                        }

                        opts = null;
                        that = null;
                    }.bind(this), cfg.animateTime);
                }
                return this;
            };

            // 클래스 생성자
            this.main = function () {

                UI.dialog_instance = UI.dialog_instance || [];
                UI.dialog_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
        return ax5dialog;
    }());
    DIALOG = ax5.ui.dialog;
})();

// ax5.ui.dialog.tmpl
(function () {

    var DIALOG = ax5.ui.dialog;

    var dialogDisplay = function dialogDisplay(columnKeys) {
        return " \n        <div id=\"{{dialogId}}\" data-ax5-ui=\"dialog\" class=\"ax5-ui-dialog {{theme}}\">\n            <div class=\"ax-dialog-header\">\n                {{{title}}}\n            </div>\n            <div class=\"ax-dialog-body\">\n                <div class=\"ax-dialog-msg\">{{{msg}}}</div>\n                \n                {{#input}}\n                <div class=\"ax-dialog-prompt\">\n                    {{#@each}}\n                    <div class=\"form-group\">\n                    {{#@value.label}}\n                    <label>{{#_crlf}}{{{.}}}{{/_crlf}}</label>\n                    {{/@value.label}}\n                    <input type=\"{{@value.type}}\" placeholder=\"{{@value.placeholder}}\" class=\"form-control {{@value.theme}}\" data-dialog-prompt=\"{{@key}}\" style=\"width:100%;\" value=\"{{@value.value}}\" />\n                    {{#@value.help}}\n                    <p class=\"help-block\">{{#_crlf}}{{.}}{{/_crlf}}</p>\n                    {{/@value.help}}\n                    </div>\n                    {{/@each}}\n                </div>\n                {{/input}}\n                \n                <div class=\"ax-dialog-buttons\">\n                    <div class=\"ax-button-wrap\">\n                    {{#btns}}\n                        {{#@each}}\n                        <button type=\"button\" data-dialog-btn=\"{{@key}}\" class=\"btn btn-{{@value.theme}}\">{{@value.label}}</button>\n                        {{/@each}}\n                    {{/btns}}\n                    </div>\n                </div>\n            </div>\n        </div>  \n        ";
    };

    DIALOG.tmpl = {
        "dialogDisplay": dialogDisplay,
        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(DIALOG.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();