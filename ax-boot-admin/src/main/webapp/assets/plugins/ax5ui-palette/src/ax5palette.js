// ax5.ui.palette
(function () {

    const UI = ax5.ui;
    const U = ax5.util;
    let PALETTE;

    UI.addClass({
        className: "palette"
    }, (function () {

        /**
         * @class ax5palette
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * ```
         */
        return function () {
            let self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.target = null;
            this.config = {
                clickEventName: "click",
                theme: 'default',
                animateTime: 100,
                colors: {
                    preview: {
                        width: 24,
                        height: 24,
                        cellWidth: 30
                    },
                    label: {
                       width: 80
                    },
                    slider: {
                        trackHeight: 8,
                        amount: 32,
                        handleWidth: 18,
                        handleHeight: 18,
                    },
                    list: [
                        {label: "red", value: "#ff0000"},
                        {label: "orange", value: "#ff9802"},
                        {label: "yellow", value: "#ffff00"},
                        {label: "green", value: "#00ff36"},
                        {label: "blue", value: "#0000ff"},
                        {label: "purple", value: "#ba00ff"},
                        //{label: "skyblue", value: "#84e4ff"},
                        //{label: "pink", value: "#ff77c4"},
                        {label: "black", value: "#000000"},
                        {label: "white", value: "#ffffff"},
                    ],
                },
                controls: {
                    height: 0,
                },
                columnKeys: {}
            };
            this.xvar = {};
            this.colors = [];

            cfg = this.config;

            const ENM = {
                "mousedown": (ax5.info.supportTouch) ? "touchstart" : "mousedown",
                "mousemove": (ax5.info.supportTouch) ? "touchmove" : "mousemove",
                "mouseup": (ax5.info.supportTouch) ? "touchend" : "mouseup"
            };

            const onStateChanged = (opts, that) => {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
            };

            /**
             * get mouse position
             * @param e
             * @returns {{clientX, clientY}}
             */
            const getMousePosition = (e) => {
                let mouseObj, originalEvent = (e.originalEvent) ? e.originalEvent : e;
                mouseObj = ('changedTouches' in originalEvent && originalEvent.changedTouches) ? originalEvent.changedTouches[0] : originalEvent;
                // clientX, Y 쓰면 스크롤에서 문제 발생
                return {
                    clientX: mouseObj.pageX,
                    clientY: mouseObj.pageY
                }
            };

            const bindHandle = (item) => {
                item.originalTrackWidth = item.$track.width();
                item.trackWidth = item.originalTrackWidth - (cfg.colors.slider.handleWidth / 5);
                let handleLeft = amountToHandleLeft(item, item._amount);

                // handleLeft 가 범위를 벗어나면?
                if (handleLeft < 0 || handleLeft > item.trackWidth) {
                    let amount;
                    handleLeft = handleLeft < 0 ? 0 : handleLeft > item.trackWidth ? item.trackWidth : handleLeft;
                    amount = handleLeftToAmount(item, handleLeft);
                    updatePreviewColor(item, amountToColor(item, amount));
                }

                item.$handle.css({left: handleLeft});
                item.$item
                    .off(ENM["mousedown"])
                    .on(ENM["mousedown"], '[data-panel="color-handle"]', function (e) {
                        let mouseObj = getMousePosition(e);
                        item._originalHandleClientX = mouseObj.clientX;
                        item._originalHandleLeft = item.$handle.position().left;
                        handleMoveEvent.on(item);
                        U.stopEvent(e.originalEvent);
                    })
                    .off("click")
                    .on("click", '[data-panel="color-label"], [data-panel="color-preview"]', function (e) {
                        if(self.onClick){
                            self.onClick.call(item, '#' + item._selectedColor.toUpperCase(), e);
                        }
                    })
                    .on("click", '[data-panel="color-track"]', function (e) {
                        if(e.target.getAttribute("data-panel") == "color-track") {
                            let mouseObj = getMousePosition(e),
                                newHandleLeft = mouseObj.clientX - item.$track.offset().left,
                                amount = handleLeftToAmount(item, newHandleLeft);

                            item.$handle.css({left: newHandleLeft});
                            updatePreviewColor(item, amountToColor(item, amount), e);

                            mouseObj = null;
                            newHandleLeft = null;
                            amount = null;
                        }
                    });
            };

            const updatePreviewColor = (item, color, event) => {
                item.$preview
                    .css({"background-color": '#' + color});
                item.$label.html('#' + color.toUpperCase());
                item._selectedColor = color;

                if(event && self.onUpdateColor){
                    self.onUpdateColor.call(item, '#' + item._selectedColor.toUpperCase());
                }
            };

            const amountToColor = (item, amount) => {
                let processor = {
                    "black"(_color, _amount){
                        return _color.lighten(cfg.colors.slider.amount / 2).darken(_amount).getHexValue();
                    },
                    "white"(_color, _amount){
                        return _color.darken(cfg.colors.slider.amount / 2).darken(_amount).getHexValue();
                    },
                    "normal"(_color, _amount){
                        return _color.darken(_amount).getHexValue();
                    }
                };

                if (item._uniqColor in processor) {
                    return processor[item._uniqColor](item._color, amount);
                } else {
                    return processor["normal"](item._color, amount);
                }
            };

            const colorToAmount = (item, color) => {
                /// todo : 색상에 가까운 색 표현.
                let processor = {
                    "black"(_color, _diffColor){
                        let color1 = _color.lighten(cfg.colors.slider.amount / 2);
                        return (color1.getHsl().l - _diffColor.getHsl().l) * 100;
                    },
                    "white"(_color, _diffColor){
                        let color1 = _color.darken(cfg.colors.slider.amount / 2);
                        return (color1.getHsl().l - _diffColor.getHsl().l) * 100;
                    },
                    "normal"(_color, _diffColor){
                        return (_color.getHsl().l - _diffColor.getHsl().l) * 100;
                    }
                };

                if (item._uniqColor in processor) {
                    return processor[item._uniqColor](item._color, color);
                } else {
                    return processor["normal"](item._color, color);
                }
            };

            const handleLeftToAmount = (item, handleLeft) => {
                return cfg.colors.slider.amount * (handleLeft - (item.trackWidth / 2)) / (item.originalTrackWidth / 2)
            };

            const amountToHandleLeft = (item, amount) => {
                return (amount * (item.originalTrackWidth / 2) / cfg.colors.slider.amount) + (item.trackWidth / 2)
            };

            const handleMoveEvent = {
                "on": (item) => {
                    jQuery(document.body)
                        .on(ENM["mousemove"] + ".ax5palette-" + this.instanceId, function (e) {
                            let mouseObj = getMousePosition(e),
                                da = mouseObj.clientX - item._originalHandleClientX,
                                newHandleLeft = item._originalHandleLeft + da,
                                amount;

                            newHandleLeft = newHandleLeft < 0 ? 0 : newHandleLeft > item.trackWidth ? item.trackWidth : newHandleLeft;
                            item.$handle.css({left: newHandleLeft});
                            amount = handleLeftToAmount(item, newHandleLeft);

                            updatePreviewColor(item, amountToColor(item, amount), e);
                            
                            mouseObj = null;
                            da = null;
                        })
                        .on(ENM["mouseup"] + ".ax5palette-" + this.instanceId, function (e) {
                            handleMoveEvent.off();
                            U.stopEvent(e);
                        })
                        .on("mouseleave.ax5palette-" + this.instanceId, function (e) {
                            handleMoveEvent.off();
                            U.stopEvent(e);
                        });

                    jQuery(document.body)
                        .attr('unselectable', 'on')
                        .css('user-select', 'none')
                        .on('selectstart', false);
                },
                "off": () => {
                    self.xvar.resizerLived = false;

                    jQuery(document.body)
                        .off(ENM["mousemove"] + ".ax5palette-" + this.instanceId)
                        .off(ENM["mouseup"] + ".ax5palette-" + this.instanceId)
                        .off("mouseleave.ax5palette-" + this.instanceId);

                    jQuery(document.body)
                        .removeAttr('unselectable')
                        .css('user-select', 'auto')
                        .off('selectstart');
                }
            };

            const repaint = (selectedColor) => {
                let box = {
                    width: this.$target.innerWidth(),
                    height: this.$target.innerHeight(),
                };

                // 패널 프레임 초기화
                this.$target.html(PALETTE.tmpl.get("frame", {}, cfg.columnKeys));

                // 각 패널들을 캐싱~
                this.$ = {
                    "root": this.$target.find('[data-ax5palette-container="root"]'),
                    "colors": this.$target.find('[data-ax5palette-container="colors"]'),
                    "controls": this.$target.find('[data-ax5palette-container="controls"]'),
                };

                // todo : controls 나중에 고민하여 구현
                // this.$["controls"].css({height: cfg.controls.height});

                /// colors.list 색상 범위 결정 / 초기화
                cfg.colors.list.forEach(function (c) {
                    c._color = U.color(c.value);
                    c._selectedColor = c._color.getHexValue();
                    if (c._color.r == 0 && c._color.g == 0 && c._color.b == 0) {
                        c._amount = cfg.colors.slider.amount;
                        c._uniqColor = "black";
                        c._color0value = "#" + c._color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color1value = "#" + c._color.lighten(cfg.colors.slider.amount / 2).getHexValue();
                        c._color2value = "#" + c._color.getHexValue();
                    } else if (c._color.r == 255 && c._color.g == 255 && c._color.b == 255) {
                        c._amount = -cfg.colors.slider.amount;
                        c._uniqColor = "white";
                        c._color0value = "#" + c._color.getHexValue();
                        c._color1value = "#" + c._color.darken(cfg.colors.slider.amount / 2).getHexValue();
                        c._color2value = "#" + c._color.darken(cfg.colors.slider.amount).getHexValue();
                    } else {
                        c._amount = 0;
                        c._color0value = "#" + c._color.lighten(cfg.colors.slider.amount).getHexValue();
                        c._color1value = "#" + c._color.getHexValue();
                        c._color2value = "#" + c._color.darken(cfg.colors.slider.amount).getHexValue();
                    }
                });

                // 색생조절 핸들의 위치 조정cfg.colors.list[minDiffColorIndex]
                cfg.colors.slider.handleLeft = -cfg.colors.slider.handleWidth / 2;
                cfg.colors.slider.handleTop = -cfg.colors.slider.handleHeight / 2;

                // 팔렛트 컬러 패널 초기화
                this.$["colors"].html(PALETTE.tmpl.get("colors", cfg, cfg.columnKeys));

                this.$["colors"].find('[data-ax5palette-color-index]').each(function () {
                    let idx = this.getAttribute("data-ax5palette-color-index");
                    let color = cfg.colors.list[idx];
                    let item = jQuery.extend({}, color);
                    item._index = idx;
                    item.$item = jQuery(this);
                    item.$preview = item.$item.find('[data-panel="color"]');
                    item.$label = item.$item.find('[data-panel="color-label"]');
                    item.$track = item.$item.find('[data-panel="color-track"]');
                    item.$handle = item.$item.find('[data-panel="color-handle"]');
                    bindHandle(item);
                    /////
                    self.colors.push(item);
                });

                if(selectedColor){
                    this.setSelectedColor(selectedColor);
                }
            };

            /**
             * Preferences of palette UI
             * @method ax5palette.setConfig
             * @param {Object} config
             * @param {Element} config.target
             * @param {String} [config.selectedColor]
             * @param {Object} [config.colors]
             * @param {Object} [config.colors.preview]
             * @param {Number} [config.colors.preview.width=24]
             * @param {Number} [config.colors.preview.height=24]
             * @param {Number} [config.colors.preview.cellWidth=30]
             * @param {Object} [config.colors.label]
             * @param {Number} [config.colors.label.width=80]
             * @param {Object} [config.colors.slider]
             * @param {Number} [config.colors.slider.trackHeight=8]
             * @param {Number} [config.colors.slider.amount=32]
             * @param {Number} [config.colors.slider.handleWidth=18]
             * @param {Number} [config.colors.slider.handleHeight=18]
             * @param {Object[]} [config.colors.list=[red,orange,yellow,green,blue,purple,black,white]]
             * @param {String} config.colors.list[].label
             * @param {String} config.colors.list[].value
             * @param {Object} [config.controls]
             * @param {Number} [config.controls.height=0]
             * @returns {ax5palette}
             * @example
             * ```js
             * myPalette = new ax5.ui.palette({
             *  target: $('[data-ax5palette="01"]'),
             *  onClick: function (hexColor) {
             *      alert(hexColor);
             *  }
             * });
             *
             * myPalette = new ax5.ui.palette({
             *  target: $('[data-ax5palette="01"]'),
             *  colors: {
             *      list: [
             *          {label: "red", value: "#ff0000"},
             *          {label: "orange", value: "#ff9802"},
             *          {label: "yellow", value: "#ffff00"},
             *          {label: "skyblue", value: "#84e4ff"},
             *          {label: "white", value: "#ffffff"}
             *      ]
             *  }
             *  onClick: function (hexColor) {
             *  }
             * });
             * ```
             */
            this.init = function () {
                // after setConfig();
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                this.onUpdateColor = cfg.onUpdateColor;

                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5palette", "401", "setConfig"));
                }
                this.$target = jQuery(cfg.target);

                setTimeout(function () {
                    repaint((cfg.selectedColor||"").trim()); // 팔렛트 그리기.
                });
            };

            /**
             * @method ax5palette.repaint
             * @returns {ax5palette}
             */
            this.repaint = function () {
                repaint();
                return this;
            };

            /**
             * @method ax5palette.setSelectedColor
             * @param selectedColor
             * @returns {ax5palette}
             */
            this.setSelectedColor = function (selectedColor) {

                let sColor = U.color(selectedColor.trim());
                // 지정된 색이 가장 가까운 파렛 검색
                let minDiffColor = 255 * 3, minDiffColorIndex = -1;

                self.colors.forEach(function (c, cidx) {
                    let c1hsl = c._color.getHsl(), c2hsl =  sColor.getHsl();
                    let diffColor = Math.abs(c1hsl.h - c2hsl.h) + Math.abs(c1hsl.s - c2hsl.s) + Math.abs(c1hsl.l - c2hsl.l);
                    if (diffColor < minDiffColor) {
                        minDiffColor = diffColor;
                        minDiffColorIndex = cidx;
                    }
                });

                if (minDiffColorIndex > -1) {
                    let amount, handleLeft,
                        item = self.colors[minDiffColorIndex];

                    item._amount = colorToAmount(item, sColor);
                    handleLeft = amountToHandleLeft(item, item._amount);
                    //handleLeft = handleLeft < 0 ? 0 : handleLeft > item.trackWidth ? item.trackWidth : handleLeft;
                    item.$handle.css({left: handleLeft});

                    amount = handleLeftToAmount(item, handleLeft);
                    updatePreviewColor(item, amountToColor(item, amount));
                }

                return this;
            };

            // 클래스 생성자
            this.main = (function () {

                UI.palette_instance = UI.palette_instance || [];
                UI.palette_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }).apply(this, arguments);
        };
    })());

    PALETTE = ax5.ui.palette;
})();