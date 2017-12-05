// ax5.ui.dialog
(function () {

    let UI = ax5.ui;
    let U = ax5.util;
    let DIALOG;

    UI.addClass({
        className: "dialog"
    }, (function () {
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
        let ax5dialog = function () {
            let self = this, cfg;

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
                animateTime: 150,
                autoCloseTime: 0
            };
            this.activeDialog = null;
            this.autoCloseTimer = null;
            this.queue = [];

            cfg = this.config;

            const onStateChanged = function (opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
                return true;
            };
            /**
             * @private ax5dialog.getContent
             * @param {String} dialogId
             * @param {Object} opts
             * @returns dialogDisplay
             */
            const getContent = function (dialogId, opts) {

                let data = {
                    dialogId: dialogId,
                    title: (opts.title || cfg.title || ""),
                    msg: (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>"),
                    input: opts.input,
                    btns: opts.btns,
                    '_crlf': function () {
                        return this.replace(/\n/g, "<br/>");
                    },
                    additionalContent: (function (additionalContent) {
                        if (U.isFunction(additionalContent)) {
                            return additionalContent.call(opts);
                        }
                        else {
                            return additionalContent;
                        }
                    })(opts.additionalContent)
                };

                try {
                    return DIALOG.tmpl.get.call(this, "dialogDisplay", data);
                }
                finally {
                    data = null;
                }
            };
            /**
             * @private ax5dialog.open
             * @param {Object} opts
             * @param callback
             */
            const open = function (opts, callback) {
                let pos = {}, box;

                opts.id = (opts.id || cfg.id);

                box = {
                    width: opts.width
                };
                jQuery(document.body).append(getContent.call(this, opts.id, opts));

                this.dialogConfig = opts;
                this.activeDialog = jQuery('#' + opts.id);
                this.activeDialog.css({width: box.width});

                if (typeof callback === "undefined") {
                    callback = opts.callback;
                }

                // dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
                opts.height = box.height = this.activeDialog.height();

                //- position 정렬
                if (typeof opts.position === "undefined" || opts.position === "center") {
                    pos.top = jQuery(window).height() / 2 - box.height / 2;
                    pos.left = jQuery(window).width() / 2 - box.width / 2;
                }
                else {
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
                }
                else {
                    this.activeDialog.find("[data-dialog-btn]").get(0).focus();
                }

                this.activeDialog.find("[data-dialog-btn]").on(cfg.clickEventName, (function (e) {
                    btnOnClick.call(this, e || window.event, opts, callback);
                }).bind(this));

                // bind key event
                jQuery(window).bind("keydown.ax5dialog", (function (e) {
                    onKeyup.call(this, e || window.event, opts, callback);
                }).bind(this));

                jQuery(window).bind("resize.ax5dialog", (function (e) {
                    align.call(this, e || window.event);
                }).bind(this));

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "open"
                });

                if (opts.autoCloseTime) {
                    this.autoCloseTimer = setTimeout(function () {
                        self.close();
                    }, opts.autoCloseTime);
                }

                pos = null;
                box = null;
            };
            const align = function (e) {
                if (!this.activeDialog) return this;
                let opts = self.dialogConfig,
                    box = {
                        width: opts.width,
                        height: opts.height
                    };

                //- position 정렬
                if (typeof opts.position === "undefined" || opts.position === "center") {
                    box.top = window.innerHeight / 2 - box.height / 2;
                    box.left = window.innerWidth / 2 - box.width / 2;
                }
                else {
                    box.left = opts.position.left || 0;
                    box.top = opts.position.top || 0;
                }
                if (box.left < 0) box.left = 0;
                if (box.top < 0) box.top = 0;

                this.activeDialog.css(box);

                opts = null;
                box = null;

                return this;
            };
            const btnOnClick = function (e, opts, callback, target, k) {
                let that,
                    emptyKey = null;

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
                        that.input = {};
                        for (let oi in opts.input) {
                            that.input[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                            if (opts.input[oi].required && (that.input[oi] == "" || that.input[oi] == null)) {
                                emptyKey = oi;
                                break;
                            }
                        }
                    }
                    if (opts.btns[k].onClick) {
                        opts.btns[k].onClick.call(that, k);
                    }
                    else if (opts.dialogType === "alert") {
                        if (callback) callback.call(that, k);
                        this.close({doNotCallback: true});
                    }
                    else if (opts.dialogType === "confirm") {
                        if (callback) callback.call(that, k);
                        this.close({doNotCallback: true});
                    }
                    else if (opts.dialogType === "prompt") {
                        if (k === 'ok') {
                            if (emptyKey) {
                                this.activeDialog.find('[data-dialog-prompt="' + emptyKey + '"]').get(0).focus();
                                return false;
                            }
                        }
                        if (callback) callback.call(that, k);
                        this.close({doNotCallback: true});
                    }
                }

                that = null;
                opts = null;
                callback = null;
                target = null;
                k = null;
            };
            const onKeyup = function (e, opts, callback, target, k) {
                let that,
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
                        that.input = {};

                        for (let oi in opts.input) {
                            that.input[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                            if (opts.input[oi].required && (that.input[oi] == "" || that.input[oi] == null)) {
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
                        this.close({doNotCallback: true});
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
             * @param {String} [config.theme="default"]
             * @param {Number} [config.width=300]
             * @param {String} [config.title=""]
             * @param {Number} [config.zIndex]
             * @param {Function} [config.onStateChanged] - `onStateChanged` function can be defined in setConfig method or new ax5.ui.dialog initialization method. However, you can us to define an
             * event function after initialization, if necessary
             * @param {Object} [config.lang]
             * @param {String} [config.lang.ok="ok"]
             * @param {String} [config.lang.cancel="cancel"]
             * @param {Number} [config.animateTime=150]
             * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
             * @returns {ax5dialog}
             * @example
             * ```
             * var dialog = new ax5.ui.dialog();
             * dialog.setConfig({
             *      title: "app dialog title",
             *      zIndex: 5000,
             *      onStateChanged: function () {
             *          if (this.state === "open") {
             *              mask.open();
             *          }
             *          else if (this.state === "close") {
             *              mask.close();
             *          }
             *      }
             * });
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
             * @param {Object|String} config - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {String} [config.theme="default"]
             * @param {Number} [config.width=300]
             * @param {String} [config.title=""]
             * @param {Number} [config.zIndex]
             * @param {Function} [config.onStateChanged]
             * @param {Object} [config.lang]
             * @param {String} [config.lang.ok="ok"]
             * @param {String} [config.lang.cancel="cancel"]
             * @param {Number} [config.animateTime=150]
             * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
             * @param {Function|String} [config.additionalContent]
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
                    }
                }

                opts = jQuery.extend(true, {}, cfg, opts);
                opts.dialogType = "alert";
                opts.theme = (opts.theme || cfg.theme || "");
                opts.callback = callback;

                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: {label: cfg.lang["ok"], theme: opts.theme}
                    };
                }

                if (this.activeDialog) {
                    this.queue.push(opts);
                } else {
                    open.call(this, opts, callback);
                }
                return this;
            };

            /**
             * open the dialog of confirm type
             * @method ax5dialog.confirm
             * @param {Object|String} config - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {String} [config.theme="default"]
             * @param {Number} [config.width=300]
             * @param {String} [config.title=""]
             * @param {Number} [config.zIndex]
             * @param {Function} [config.onStateChanged]
             * @param {Object} [config.lang]
             * @param {String} [config.lang.ok="ok"]
             * @param {String} [config.lang.cancel="cancel"]
             * @param {Number} [config.animateTime=150]
             * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
             * @param {Function|String} [config.additionalContent]
             * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
             * @returns {ax5dialog}
             * @example
             * ```
             * myDialog.confirm({
             *      title: 'app title',
             *      msg: 'confirm',
             *      additionalContent: function () {
             *          return "<div style='border:1px solid #ccc;border-radius: 5px;background: #eee;padding: 10px;'>추가정보</div>";
             *      }
             * }, function(){});
             * ```
             */
            this.confirm = function (opts, callback, tryCount) {
                if (U.isString(opts)) {
                    opts = {
                        title: cfg.title,
                        msg: opts
                    }
                }

                opts = jQuery.extend(true, {}, cfg, opts);
                opts.dialogType = "confirm";
                opts.theme = (opts.theme || cfg.theme || "");
                opts.callback = callback;

                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: {label: cfg.lang["ok"], theme: opts.theme},
                        cancel: {label: cfg.lang["cancel"]}
                    };
                }

                if (this.activeDialog) {
                    this.queue.push(opts);
                } else {
                    open.call(this, opts, callback);
                }

                return this;
            };

            /**
             * open the dialog of prompt type
             * @method ax5dialog.prompt
             * @param {Object|String} config - dialog 속성을 json으로 정의하거나 msg만 전달
             * @param {String} [config.theme="default"]
             * @param {Number} [config.width=300]
             * @param {String} [config.title=""]
             * @param {Number} [config.zIndex]
             * @param {Function} [config.onStateChanged]
             * @param {Object} [config.lang]
             * @param {String} [config.lang.ok="ok"]
             * @param {String} [config.lang.cancel="cancel"]
             * @param {Number} [config.animateTime=150]
             * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
             * @param {Function|String} [config.additionalContent]
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
                    }
                }

                opts = jQuery.extend(true, {}, cfg, opts);
                opts.dialogType = "prompt";
                opts.theme = (opts.theme || cfg.theme || "");
                opts.callback = callback;

                if (typeof opts.input === "undefined") {
                    opts.input = {
                        value: {label: ""}
                    };
                }
                if (typeof opts.btns === "undefined") {
                    opts.btns = {
                        ok: {label: cfg.lang["ok"], theme: opts.theme},
                        cancel: {label: cfg.lang["cancel"]}
                    };
                }

                if (this.activeDialog) {
                    this.queue.push(opts);
                } else {
                    open.call(this, opts, callback);
                }

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
                let opts, that;

                if (this.activeDialog) {
                    if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);

                    opts = self.dialogConfig;

                    this.activeDialog.addClass("destroy");
                    jQuery(window).unbind("keydown.ax5dialog");
                    jQuery(window).unbind("resize.ax5dialog");

                    setTimeout((function () {
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
                        }
                        else if (this.onStateChanged) {
                            this.onStateChanged.call(that, that);
                        }

                        if (this.queue && this.queue.length) {
                            open.call(this, this.queue.shift());
                        }

                        opts = null;
                        that = null;
                    }).bind(this), cfg.animateTime);
                }
                return this;
            };

            // 클래스 생성자
            this.main = (function () {

                UI.dialog_instance = UI.dialog_instance || [];
                UI.dialog_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);
        };
        return ax5dialog;
    })());

    DIALOG = ax5.ui.dialog;
})();
