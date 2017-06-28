"use strict";

// ax5.ui.menu
(function () {
    var UI = ax5.ui;
    var U = ax5.util;
    var MENU;

    UI.addClass({
        className: "menu"
    }, function () {
        /**
         * @class ax5.ui.menu
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * var menu = new ax5.ui.menu({
         *     theme: 'primary',
         *     iconWidth: 20,
         *     acceleratorWidth: 100,
         *     itemClickAndClose: false,
         *     icons: {
         *         'arrow': '<i class="fa fa-caret-right"></i>'
         *     },
         *     columnKeys: {
         *         label: 'name',
         *         items: 'chidren'
         *     },
         *     items: [
         *         {
         *             icon: '<i class="fa fa-archive"></i>',
         *             name: "Menu Parent 0",
         *             chidren: [
         *                 {
         *                     check: {
         *                         type: 'checkbox',
         *                         name: 'A',
         *                         value: '0',
         *                         checked: false
         *                     },
         *                     name: "Menu Z",
         *                     data: {},
         *                     role: "",
         *                     accelerator: "CmdOrCtrl+Z"
         *                 },
         *                 {
         *                     check: {
         *                         type: 'checkbox',
         *                         name: 'A',
         *                         value: '1',
         *                         checked: true
         *                     },
         *                     name: "Menu A",
         *                     data: {},
         *                     role: ""
         *                 }
         *             ],
         *             filterType: "A"
         *         },
         *         {
         *             divide: true,
         *             filterType: "A"
         *         },
         *         {
         *             icon: '<i class="fa fa-mixcloud"></i>',
         *             name: "Menu Parent 1",
         *             chidren: [
         *                 {
         *                     name: "Menu Z",
         *                     data: {},
         *                     role: "",
         *                     chidren: [
         *                         {
         *                             name: "Menu Z",
         *                             data: {},
         *                             role: ""
         *                         },
         *                         {
         *                             name: "Menu A",
         *                             data: {},
         *                             role: ""
         *                         }
         *                     ]
         *                 },
         *                 {
         *                     name: "Menu A",
         *                     data: {},
         *                     role: ""
         *                 }
         *             ],
         *             filterType: "A"
         *         },
         *         {
         *             check: {
         *                 type: 'radio',
         *                 name: 'radioName',
         *                 value: '1',
         *                 checked: false
         *             },
         *             icon: '<i class="fa fa-bluetooth"></i>',
         *             name: "Menu Parent 2"
         *         },
         *         {
         *             check: {
         *                 type: 'radio',
         *                 name: 'radioName',
         *                 value: '2',
         *                 checked: false
         *             },
         *             name: "Menu Parent 3"
         *         },
         *         {
         *             check: {
         *                 type: 'radio',
         *                 name: 'radioName',
         *                 value: '3',
         *                 checked: false
         *             },
         *             name: "Menu Parent 4"
         *         },
         *         {divide: true},
         *         {
         *             html: function () {
         *                 return '<div style="text-align: center;">' +
         *                     '<button class="btn btn-primary" data-menu-btn="OK">OK</button> ' +
         *                     '<button class="btn btn-danger" data-menu-btn="CANCEL">CANCEL</button>' +
         *                     '</div>';
         *             }
         *         }
         *     ]
         * });
         * ```
         */
        return function () {
            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: "default",
                iconWidth: 22,
                acceleratorWidth: 100,
                menuBodyPadding: 5,
                //direction: "top", // top|bottom
                offset: { left: 0, top: 0 },
                position: "fixed",
                animateTime: 250,
                items: [],
                itemClickAndClose: true,
                columnKeys: {
                    label: 'label',
                    items: 'items'
                }
            };

            this.openTimer = null;
            this.closeTimer = null;
            this.queue = [];
            this.menuBar = {};
            this.state = undefined;

            cfg = this.config;

            var appEventAttach = function appEventAttach(active, opt) {
                if (active) {
                    jQuery(document.body).off("click.ax5menu-" + this.instanceId).on("click.ax5menu-" + this.instanceId, clickItem.bind(this, opt));

                    jQuery(window).off("keydown.ax5menu-" + this.instanceId).on("keydown.ax5menu-" + this.instanceId, function (e) {
                        if (e.which == ax5.info.eventKeys.ESC) {
                            self.close();
                        }
                    });

                    jQuery(window).on("resize.ax5menu-" + this.instanceId).on("resize.ax5menu-" + this.instanceId, function (e) {
                        self.close();
                    });
                } else {
                    jQuery(document.body).off("click.ax5menu-" + this.instanceId);
                    jQuery(window).off("keydown.ax5menu-" + this.instanceId);
                    jQuery(window).off("resize.ax5menu-" + this.instanceId);
                }
            };

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                self.state = that.state;
                opts = null;
                that = null;
                return true;
            };

            var onLoad = function onLoad(that) {
                if (this.onLoad) {
                    this.onLoad.call(that, that);
                }

                that = null;
                return true;
            };

            var popup = function popup(opt, items, depth, path) {
                var data = opt,
                    activeMenu = void 0,
                    removed = void 0;

                data.theme = opt.theme || cfg.theme;
                data.cfg = {
                    icons: jQuery.extend({}, cfg.icons),
                    iconWidth: opt.iconWidth || cfg.iconWidth,
                    acceleratorWidth: opt.acceleratorWidth || cfg.acceleratorWidth
                };

                items.forEach(function (n) {
                    if (n.html || n.divide) {
                        n['@isMenu'] = false;
                        if (n.html) {
                            n['@html'] = n.html.call({
                                item: n,
                                config: cfg,
                                opt: opt
                            });
                        }
                    } else {
                        n['@isMenu'] = true;
                    }
                });

                data[cfg.columnKeys.items] = items;
                data['@depth'] = depth;
                data['@path'] = path || "root";
                data['@hasChild'] = function () {
                    return this[cfg.columnKeys.items] && this[cfg.columnKeys.items].length > 0;
                };
                activeMenu = jQuery(MENU.tmpl.get.call(this, "tmpl", data, cfg.columnKeys));
                jQuery(document.body).append(activeMenu);

                // remove queue

                removed = this.queue.splice(depth);
                removed.forEach(function (n) {
                    n.$target.remove();
                });

                this.queue.push({
                    '$target': activeMenu,
                    'data': jQuery.extend({}, data)
                });

                activeMenu.find('[data-menu-item-index]').bind("mouseover", function () {
                    var depth = this.getAttribute("data-menu-item-depth"),
                        index = this.getAttribute("data-menu-item-index"),
                        path = this.getAttribute("data-menu-item-path"),
                        $this = void 0,
                        offset = void 0,
                        scrollTop = void 0,
                        childOpt = void 0,
                        _items = void 0,
                        _activeMenu = void 0;

                    if (depth != null && typeof depth != "undefined") {
                        _items = self.queue[depth].data[cfg.columnKeys.items][index][cfg.columnKeys.items];
                        _activeMenu = self.queue[depth].$target;
                        _activeMenu.find('[data-menu-item-index]').removeClass("hover");
                        jQuery(this).addClass("hover");

                        if (_activeMenu.attr("data-selected-menu-item-index") != index) {
                            _activeMenu.attr("data-selected-menu-item-index", index);

                            if (_items && _items.length > 0) {

                                $this = jQuery(this);
                                offset = $this.offset();
                                scrollTop = cfg.position == "fixed" ? jQuery(document).scrollTop() : 0;
                                childOpt = {
                                    '@parent': {
                                        left: offset.left,
                                        top: offset.top,
                                        width: $this.outerWidth(),
                                        height: $this.outerHeight()
                                    },
                                    left: offset.left + $this.outerWidth() - cfg.menuBodyPadding,
                                    top: offset.top - cfg.menuBodyPadding - 1 - scrollTop
                                };

                                childOpt = jQuery.extend(true, opt, childOpt);
                                popup.call(self, childOpt, _items, Number(depth) + 1, path);
                            } else {
                                self.queue.splice(Number(depth) + 1).forEach(function (n) {
                                    n.$target.remove();
                                });
                            }
                        }
                    }

                    depth = null;
                    index = null;
                    path = null;
                    $this = null;
                    offset = null;
                    scrollTop = null;
                    childOpt = null;
                    _items = null;
                    _activeMenu = null;
                });

                // mouse out
                activeMenu.find('[data-menu-item-index]').bind("mouseout", function () {
                    var depth = this.getAttribute("data-menu-item-depth"),
                        index = this.getAttribute("data-menu-item-index"),
                        path = this.getAttribute("data-menu-item-path"),
                        _items = void 0;

                    if (path) {
                        _items = self.queue[depth].data[cfg.columnKeys.items][index][cfg.columnKeys.items];
                    }
                    if (_items && _items.length > 0) {} else {
                        jQuery(this).removeClass("hover");
                    }
                });

                // is Root
                if (depth == 0) {
                    if (data.direction) activeMenu.addClass("direction-" + data.direction);
                    onStateChanged.call(this, null, {
                        self: this,
                        items: items,
                        parent: function (path) {
                            if (!path) return false;
                            var item = null;
                            try {
                                item = Function("", "return this.config.items[" + path.substring(5).replace(/\./g, '].items[') + "];").call(self);
                            } catch (e) {}
                            return item;
                        }(data['@path']),
                        state: "popup"
                    });
                }

                align.call(this, activeMenu, data);
                onLoad.call(this, {
                    self: this,
                    items: items,
                    element: activeMenu.get(0)
                });

                data = null;
                activeMenu = null;
                removed = null;
                opt = null;
                items = null;
                depth = null;
                path = null;

                return this;
            };

            var clickItem = function clickItem(opt, e) {
                var target = void 0,
                    item = void 0;

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-menu-item-index")) {
                        return true;
                    }
                });
                if (target) {
                    if (typeof opt === "undefined") opt = {};
                    item = function (path) {
                        if (!path) return false;
                        var item = void 0;

                        try {
                            item = Function("", "return this[" + path.substring(5).replace(/\./g, '].' + cfg.columnKeys.items + '[') + "];").call(opt.items || cfg.items);
                        } catch (e) {
                            console.log(ax5.info.getError("ax5menu", "501", "menuItemClick"));
                        }

                        try {
                            return item;
                        } finally {
                            item = null;
                        }
                    }(target.getAttribute("data-menu-item-path"));

                    if (!item) return this;

                    if (item.check) {
                        (function (items) {
                            var setValue = {
                                'checkbox': function checkbox(value) {
                                    this.checked = !value;
                                },
                                'radio': function radio(value) {
                                    var name = this.name;
                                    items.forEach(function (n) {
                                        if (n.check && n.check.type === 'radio' && n.check.name == name) {
                                            n.check.checked = false;
                                        }
                                    });
                                    this.checked = !value;
                                }
                            };
                            if (setValue[this.type]) setValue[this.type].call(this, this.checked);
                            setValue = null;
                        }).call(item.check, cfg.items);

                        if (!cfg.itemClickAndClose) {
                            self.queue.forEach(function (n) {
                                n.$target.find('[data-menu-item-index]').each(function () {
                                    var item = n.data[cfg.columnKeys.items][this.getAttribute("data-menu-item-index")];
                                    if (item.check) {
                                        jQuery(this).find(".item-checkbox-wrap").attr("data-item-checked", item.check.checked);
                                    }
                                });
                            });
                        }
                    }

                    if (self.onClick) {
                        if (self.onClick.call(item, item, opt.param)) {
                            self.close();
                        }
                    }
                    if ((!item[cfg.columnKeys.items] || item[cfg.columnKeys.items].length == 0) && cfg.itemClickAndClose) self.close();
                } else {
                    self.close();
                }

                target = null;
                item = null;
                return this;
            };

            var align = function align(activeMenu, data) {
                var $window = jQuery(window),
                    $document = jQuery(document),
                    wh = cfg.position == "fixed" ? $window.height() : $document.height(),
                    ww = $window.width(),
                    h = activeMenu.outerHeight(),
                    w = activeMenu.outerWidth(),
                    l = data.left,
                    t = data.top,
                    position = cfg.position || "fixed";

                if (l + w > ww) {
                    if (data['@parent']) {
                        l = data['@parent'].left - w + cfg.menuBodyPadding;
                    } else {
                        l = ww - w;
                    }
                }

                if (t + h > wh) {
                    t = wh - h;
                }

                activeMenu.css({ left: l, top: t, position: position });

                activeMenu = null;
                data = null;
                $window = null;
                $document = null;
                wh = null;
                ww = null;
                h = null;
                w = null;
                l = null;
                t = null;
                position = null;
                return this;
            };

            /// private end

            this.init = function () {
                /**
                 * config에 선언된 이벤트 함수들을 this로 이동시켜 주어 나중에 인스턴스.on... 으로 처리 가능 하도록 변경
                 */
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                this.onLoad = cfg.onLoad;

                onStateChanged.call(this, null, {
                    self: this,
                    state: "init"
                });
            };

            /**
             * @method ax5.ui.menu.popup
             * @param {Event|Object} e - Event or Object
             * @param {Object} [opt]
             * @param {String} [opt.theme]
             * @param {Function} [opt.filter]
             * @returns {ax5.ui.menu} this
             */
            this.popup = function () {

                var getOption = {
                    'event': function event(e, opt) {
                        //var xOffset = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                        //var yOffset = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                        //console.log(e.pageY);

                        e = {
                            left: e.clientX,
                            top: cfg.position == "fixed" ? e.clientY : e.pageY,
                            width: cfg.width,
                            theme: cfg.theme
                        };

                        e.left -= 5;
                        e.top -= 5;

                        if (cfg.offset) {
                            if (cfg.offset.left) e.left += cfg.offset.left;
                            if (cfg.offset.top) e.top += cfg.offset.top;
                        }
                        opt = jQuery.extend(true, e, opt);

                        try {
                            return opt;
                        } finally {
                            e = null;
                            //opt = null;
                        }
                    },
                    'object': function object(e, opt) {
                        e = {
                            left: e.left,
                            top: e.top,
                            width: e.width || cfg.width,
                            theme: e.theme || cfg.theme
                        };

                        if (cfg.offset) {
                            if (cfg.offset.left) e.left += cfg.offset.left;
                            if (cfg.offset.top) e.top += cfg.offset.top;
                        }

                        opt = jQuery.extend(true, e, opt);

                        try {
                            return opt;
                        } finally {
                            e = null;
                            //opt = null;
                        }
                    }
                },
                    updateTheme = function updateTheme(theme) {
                    if (theme) cfg.theme = theme;
                };

                return function (e, opt) {

                    if (!e) return this;
                    opt = getOption[typeof e.clientX == "undefined" ? "object" : "event"].call(this, e, opt);
                    updateTheme(opt.theme);

                    var items = [].concat(cfg.items),
                        _filteringItem = void 0;
                    opt.items = items;

                    if (opt.filter) {
                        _filteringItem = function filteringItem(_items) {
                            var arr = [];
                            _items.forEach(function (n) {
                                if (n.items && n.items.length > 0) {
                                    n.items = _filteringItem(n.items);
                                }
                                if (opt.filter.call(n)) {
                                    arr.push(n);
                                }
                            });
                            return arr;
                        };
                        opt.items = items = _filteringItem(items);
                    }

                    if (items.length) {
                        appEventAttach.call(this, false);
                        popup.call(this, opt, items, 0); // 0 is seq of queue

                        if (this.popupEventAttachTimer) clearTimeout(this.popupEventAttachTimer);
                        this.popupEventAttachTimer = setTimeout(function () {
                            appEventAttach.call(this, true, opt); // 이벤트 연결
                        }.bind(this), 500);
                    }

                    e = null;
                    return this;
                };
            }();

            /**
             * @method ax5.ui.menu.attach
             * @param {Element|jQueryObject} el
             * @returns {ax5.ui.menu} this
             */
            this.attach = function () {

                var getOption = {
                    'object': function object(e, opt) {
                        e = {
                            left: e.left,
                            top: e.top,
                            width: e.width || cfg.width,
                            theme: e.theme || cfg.theme,
                            direction: e.direction || cfg.direction
                        };
                        opt = jQuery.extend(true, opt, e);

                        try {
                            return opt;
                        } finally {
                            e = null;
                            opt = null;
                        }
                    }
                };

                var popUpChildMenu = function popUpChildMenu(target, opt, eType) {
                    var $target = jQuery(target),
                        offset = $target.offset(),
                        height = $target.outerHeight(),
                        index = Number(target.getAttribute("data-menu-item-index")),
                        scrollTop = cfg.position == "fixed" ? jQuery(document).scrollTop() : 0;

                    if (cfg.items && cfg.items[index][cfg.columnKeys.items] && cfg.items[index][cfg.columnKeys.items].length) {

                        if (self.menuBar.openedIndex == index) {
                            if (eType == "click") self.close();
                            return false;
                        }

                        self.menuBar.target.find('[data-menu-item-index]').removeClass("hover");
                        self.menuBar.opened = true;
                        self.menuBar.openedIndex = index;

                        $target.attr("data-menu-item-opened", "true");
                        $target.addClass("hover");

                        if (cfg.offset) {
                            if (cfg.offset.left) offset.left += cfg.offset.left;
                            if (cfg.offset.top) offset.top += cfg.offset.top;
                        }

                        opt = getOption["object"].call(this, { left: offset.left, top: offset.top + height - scrollTop }, opt);

                        popup.call(self, opt, cfg.items[index][cfg.columnKeys.items], 0, 'root.' + target.getAttribute("data-menu-item-index")); // 0 is seq of queue
                        appEventAttach.call(self, true, {}); // 이벤트 연결
                    }

                    target = null;
                    opt = null;
                    $target = null;
                    offset = null;
                    height = null;
                    index = null;
                    scrollTop = null;
                };
                var clickParentMenu = function clickParentMenu(target, opt, eType) {
                    var $target = jQuery(target),
                        offset = $target.offset(),
                        height = $target.outerHeight(),
                        index = Number(target.getAttribute("data-menu-item-index")),
                        scrollTop = cfg.position == "fixed" ? jQuery(document).scrollTop() : 0;
                    if (cfg.items && (!cfg.items[index][cfg.columnKeys.items] || cfg.items[index][cfg.columnKeys.items].length == 0)) {
                        if (self.onClick) {
                            self.onClick.call(cfg.items[index], cfg.items[index]);
                        }
                    }
                };

                return function (el, opt) {
                    var data = {},
                        items = cfg.items,
                        activeMenu;

                    if (typeof opt === "undefined") opt = {};

                    data.theme = opt.theme || cfg.theme;
                    data.cfg = {
                        icons: jQuery.extend({}, cfg.icons),
                        iconWidth: opt.iconWidth || cfg.iconWidth,
                        acceleratorWidth: opt.acceleratorWidth || cfg.acceleratorWidth
                    };

                    items.forEach(function (n) {
                        if (n.html || n.divide) {
                            n['@isMenu'] = false;
                            if (n.html) {
                                n['@html'] = n.html.call({
                                    item: n,
                                    config: cfg,
                                    opt: opt
                                });
                            }
                        } else {
                            n['@isMenu'] = true;
                        }
                    });

                    data[cfg.columnKeys.items] = items;

                    activeMenu = jQuery(MENU.tmpl.get.call(this, "tmplMenubar", data, cfg.columnKeys));
                    self.menuBar = {
                        target: jQuery(el),
                        opened: false
                    };
                    self.menuBar.target.html(activeMenu);

                    // click, mouseover
                    self.menuBar.target.bind("click", function (e) {
                        if (!e) return this;
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-menu-item-index")) {
                                return true;
                            }
                        });
                        if (target) {
                            clickParentMenu(target, opt, "click");
                            popUpChildMenu(target, opt, "click");
                        }

                        target = null;
                    });
                    self.menuBar.target.bind("mouseover", function (e) {
                        if (!self.menuBar.opened) return false;
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-menu-item-index")) {
                                return true;
                            }
                        });
                        if (target) popUpChildMenu(target, opt, "mouseover");

                        target = null;
                    });

                    el = null;
                    opt = null;
                    data = null;
                    items = null;
                    activeMenu = null;

                    return this;
                };
            }();

            /**
             * @method ax5.ui.menu.close
             * @returns {ax5.ui.menu} this
             */
            this.close = function () {

                if (self.menuBar && self.menuBar.target) {
                    self.menuBar.target.find('[data-menu-item-index]').removeClass("hover");
                    self.menuBar.opened = false;
                    self.menuBar.openedIndex = null;
                }

                appEventAttach.call(this, false); // 이벤트 제거

                this.queue.forEach(function (n) {
                    n.$target.remove();
                });
                this.queue = [];

                onStateChanged.call(this, null, {
                    self: this,
                    state: "close"
                });

                return this;
            };

            /**
             * @method ax5.ui.menu.getCheckValue
             * @returns {Object} statusCheckItem
             */
            this.getCheckValue = function () {
                var checkItems = {},
                    _collectItem = function collectItem(items) {
                    var i = items.length;
                    while (i--) {
                        if (items[i].check && items[i].check.checked) {
                            if (!checkItems[items[i].check.name]) checkItems[items[i].check.name] = items[i].check.value;else {
                                if (U.isString(checkItems[items[i].check.name])) checkItems[items[i].check.name] = [checkItems[items[i].check.name]];
                                checkItems[items[i].check.name].push(items[i].check.value);
                            }
                        }
                        if (items[i].items && items[i].items.length > 0) _collectItem(items[i].items);
                    }
                };

                _collectItem(cfg.items);

                try {
                    return checkItems;
                } finally {
                    checkItems = null;
                    _collectItem = null;
                }
            };

            // 클래스 생성자
            this.main = function () {

                UI.menu_instance = UI.menu_instance || [];
                UI.menu_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());

    MENU = ax5.ui.menu;
})();

// todo : menu 드랍다운 아이콘 설정 기능 추가
// ax5.ui.menu.tmpl
(function () {
    var MENU = ax5.ui.menu;

    var tmpl = function tmpl(columnKeys) {
        return "\n        <div class=\"ax5-ui-menu {{theme}}\" {{#width}}style=\"width:{{width}}px;\"{{/width}}>\n            <div class=\"ax-menu-body\">\n                {{#" + columnKeys.items + "}}\n                    {{^@isMenu}}\n                        {{#divide}}\n                        <div class=\"ax-menu-item-divide\" data-menu-item-index=\"{{@i}}\"></div>\n                        {{/divide}}\n                        {{#html}}\n                        <div class=\"ax-menu-item-html\" data-menu-item-index=\"{{@i}}\">{{{@html}}}</div>\n                        {{/html}}\n                    {{/@isMenu}}\n                    {{#@isMenu}}\n                    <div class=\"ax-menu-item\" data-menu-item-depth=\"{{@depth}}\" data-menu-item-index=\"{{@i}}\" data-menu-item-path=\"{{@path}}.{{@i}}\">\n                        <span class=\"ax-menu-item-cell ax-menu-item-checkbox\">\n                            {{#check}}\n                            <span class=\"item-checkbox-wrap useCheckBox\" {{#checked}}data-item-checked=\"true\"{{/checked}}></span>\n                            {{/check}}\n                            {{^check}}\n                            <span class=\"item-checkbox-wrap\"></span>\n                            {{/check}}\n                        </span>\n                        {{#icon}}\n                        <span class=\"ax-menu-item-cell ax-menu-item-icon\" style=\"width:{{cfg.iconWidth}}px;\">{{{.}}}</span>\n                        {{/icon}}\n                        <span class=\"ax-menu-item-cell ax-menu-item-label\">{{{" + columnKeys.label + "}}}</span>\n                        {{#accelerator}}\n                        <span class=\"ax-menu-item-cell ax-menu-item-accelerator\" style=\"width:{{cfg.acceleratorWidth}}px;\"><span class=\"item-wrap\">{{.}}</span></span>\n                        {{/accelerator}}\n                        {{#@hasChild}}\n                        <span class=\"ax-menu-item-cell ax-menu-item-handle\">{{{cfg.icons.arrow}}}</span>\n                        {{/@hasChild}}\n                    </div>\n                    {{/@isMenu}}\n\n                {{/" + columnKeys.items + "}}\n            </div>\n            <div class=\"ax-menu-arrow\"></div>\n        </div>\n        ";
    };
    var tmplMenubar = function tmplMenubar(columnKeys) {
        return "\n        <div class=\"ax5-ui-menubar {{theme}}\">\n            <div class=\"ax-menu-body\">\n                {{#" + columnKeys.items + "}}\n                    {{^@isMenu}}\n                        {{#divide}}\n                        <div class=\"ax-menu-item-divide\" data-menu-item-index=\"{{@i}}\"></div>\n                        {{/divide}}\n                        {{#html}}\n                        <div class=\"ax-menu-item-html\" data-menu-item-index=\"{{@i}}\">{{{@html}}}</div>\n                        {{/html}}\n                    {{/@isMenu}}\n                    {{#@isMenu}}\n                    <div class=\"ax-menu-item\" data-menu-item-index=\"{{@i}}\">\n                        {{#icon}}\n                        <span class=\"ax-menu-item-cell ax-menu-item-icon\" style=\"width:{{cfg.iconWidth}}px;\">{{{.}}}</span>\n                        {{/icon}}\n                        <span class=\"ax-menu-item-cell ax-menu-item-label\">{{{" + columnKeys.label + "}}}</span>\n                    </div>\n                    {{/@isMenu}}\n                {{/" + columnKeys.items + "}}\n            </div>\n        </div>\n        ";
    };

    MENU.tmpl = {
        "tmpl": tmpl,
        "tmplMenubar": tmplMenubar,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(MENU.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();