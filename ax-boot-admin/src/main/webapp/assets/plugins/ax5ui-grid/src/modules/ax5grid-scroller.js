// ax5.ui.grid.scroller
(function () {

    const GRID = ax5.ui.grid;

    const U = ax5.util;

    const convertScrollPosition = {
        "vertical": function (css, _var) {
            let _content_height = _var._content_height - _var._panel_height,
                _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight,
                top = (_content_height * css.top) / _scroller_height;

            if (top < 0) top = 0;
            else if (_content_height < top) {
                top = _content_height;
            }
            return {
                top: -top
            }
        },
        "horizontal": function (css, _var) {
            let _content_width = _var._content_width - _var._panel_width,
                _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth,
                left = (_content_width * css.left) / _scroller_width;

            if (left < 0) left = 0;
            else if (_content_width < left) {
                left = _content_width;
            }
            return {
                left: -left
            }
        }
    };

    const convertScrollBarPosition = {
        "vertical": function (_top, _var) {

            let self = this,
                type = "vertical",
                _content_height = _var._content_height - _var._panel_height,
                _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight,
                top = (_scroller_height * _top) / _content_height,
                scrollPositon;

            if (-top > _scroller_height) {
                top = -_scroller_height;

                scrollPositon = convertScrollPosition[type].call(this, {top: -top}, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.body.scrollTo.call(self, scrollPositon);
            }

            return -top
        },
        "horizontal": function (_left, _var) {
            let self = this,
                type = "horizontal",
                _content_width = _var._content_width - _var._panel_width,
                _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth,
                left = (_scroller_width * _left) / _content_width,
                scrollPositon;

            if (-left > _scroller_width) {
                left = -_scroller_width;
                scrollPositon = convertScrollPosition[type].call(this, {left: -left}, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.header.scrollTo.call(self, scrollPositon);
                GRID.body.scrollTo.call(self, scrollPositon);
            }

            return -left
        }
    };

    const scrollBarMover = {
        "click": function (track, bar, type, e) {

            // 마우스 무브 완료 타임과 클릭타임 차이가 20 보다 작으면 클릭이벤트 막기.
            if ((new Date()).getTime() - GRID.scroller.moveout_timer < 20) {
                return false;
            }

            let self = this,
                trackOffset = track.offset(),
                barBox = {
                    width: bar.outerWidth(), height: bar.outerHeight()
                },
                trackBox = {
                    width: track.innerWidth(), height: track.innerHeight()
                },
                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].outerHeight(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].outerWidth(),
                getScrollerPosition = {
                    "vertical": function (e) {
                        let mouseObj = GRID.util.getMousePosition(e);
                        // track을 벗어 나지 안도록 범위 체크
                        let newTop = mouseObj.clientY - trackOffset.top;
                        if (newTop < 0) {
                            newTop = 0;
                        }
                        else if ((newTop + barBox.height) > trackBox.height) {
                            newTop = trackBox.height - barBox.height;
                        }
                        return {top: newTop};
                    },
                    "horizontal": function (e) {
                        let mouseObj = GRID.util.getMousePosition(e);
                        // track을 벗어 나지 안도록 범위 체크
                        let newLeft = mouseObj.clientX - trackOffset.left;
                        if (newLeft < 0) {
                            newLeft = 0;
                        }
                        else if ((newLeft + barBox.width) > trackBox.width) {
                            newLeft = trackBox.width - barBox.width;
                        }
                        return {left: newLeft};
                    }
                },
                css = getScrollerPosition[type](e);

            bar.css(css);

            let scrollPositon = convertScrollPosition[type].call(self, css, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            });
            if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);
            GRID.body.scrollTo.call(self, scrollPositon);

            scrollPositon = null;
        },
        "on": function (track, bar, type, e) {
            let self = this,
                barOffset = bar.position(),
                barBox = {
                    width: bar.outerWidth(), height: bar.outerHeight()
                },
                trackBox = {
                    width: track.innerWidth(), height: track.innerHeight()
                },

                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].outerHeight(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].outerWidth(),

                getScrollerPosition = {
                    "vertical": function (e) {
                        var mouseObj = GRID.util.getMousePosition(e);
                        self.xvar.__da = mouseObj.clientY - self.xvar.mousePosition.clientY;
                        // track을 벗어 나지 안도록 범위 체크
                        var newTop = barOffset.top + self.xvar.__da;
                        if (newTop < 0) {
                            newTop = 0;
                        }
                        else if ((newTop + barBox.height) > trackBox.height) {
                            newTop = trackBox.height - barBox.height;
                        }
                        return {top: newTop};
                    },
                    "horizontal": function (e) {
                        var mouseObj = GRID.util.getMousePosition(e);
                        self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                        // track을 벗어 나지 안도록 범위 체크
                        var newLeft = barOffset.left + self.xvar.__da;
                        if (newLeft < 0) {
                            newLeft = 0;
                        }
                        else if ((newLeft + barBox.width) > trackBox.width) {
                            newLeft = trackBox.width - barBox.width;
                        }
                        return {left: newLeft};
                    }
                };

            self.xvar.__da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)

            jQuery(document.body)
                .bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                    let css = getScrollerPosition[type](e);
                    bar.css(css);

                    let scrollPositon = convertScrollPosition[type].call(self, css, {
                        _content_width: _content_width,
                        _content_height: _content_height,
                        _panel_width: _panel_width,
                        _panel_height: _panel_height,
                        _horizontal_scroller_width: _horizontal_scroller_width,
                        _vertical_scroller_height: _vertical_scroller_height,
                        verticalScrollBarHeight: verticalScrollBarHeight,
                        horizontalScrollBarWidth: horizontalScrollBarWidth
                    });

                    if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);

                    GRID.body.scrollTo.call(self, scrollPositon);
                })
                .bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                    scrollBarMover.off.call(self, e);
                })
                .bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                    scrollBarMover.off.call(self, e);
                });

            jQuery(document.body)
                .attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

        },
        "off": function (e) {
            ax5.util.stopEvent(e.originalEvent);
            GRID.scroller.moveout_timer = (new Date()).getTime();

            jQuery(document.body)
                .unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId)
                .unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId)
                .unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body)
                .removeAttr('unselectable')
                .css('user-select', 'auto')
                .off('selectstart');
        }
    };

    const scrollContentMover = {
        "wheel": function (delta) {
            let self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.xvar.body_panel_height,
                _panel_width = self.xvar.body_panel_width,
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth;

            if (isNaN(_content_height) || isNaN(_content_width)) {
                return false;
            }

            let newLeft, newTop,
                _top_is_end = false,
                _left_is_end = false;

            newLeft = _body_scroll_position.left - delta.x;
            newTop = _body_scroll_position.top - delta.y;

            // newTop이 범위를 넘었는지 체크
            if (newTop >= 0) {
                newTop = 0;
                _top_is_end = true;
            } else if (newTop <= _panel_height - _content_height) {
                newTop = _panel_height - _content_height;
                if (newTop >= 0) newTop = 0;
                _top_is_end = true;
            } else {
                if (delta.y == 0) _top_is_end = true;
            }

            // newLeft이 범위를 넘었는지 체크
            if (newLeft >= 0) {
                newLeft = 0;
                _left_is_end = true;
            } else if (newLeft <= _panel_width - _content_width) {
                newLeft = _panel_width - _content_width;
                if (newLeft >= 0) newLeft = 0;
                _left_is_end = true;
            } else {
                if (delta.x == 0) _left_is_end = true;
            }

            GRID.header.scrollTo.call(self, {left: newLeft});
            GRID.body.scrollTo.call(self, {left: newLeft, top: newTop}, {
                callback: function () {
                    resize.call(self);
                }
            });

            return !_top_is_end || !_left_is_end;
        },
        "on": function () {
            let self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.xvar.body_panel_height,
                _panel_width = self.xvar.body_panel_width,
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                getContentPosition = function (e) {
                    let mouseObj = GRID.util.getMousePosition(e), newLeft, newTop;

                    self.xvar.__x_da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                    self.xvar.__y_da = mouseObj.clientY - self.xvar.mousePosition.clientY;

                    newLeft = _body_scroll_position.left + self.xvar.__x_da;
                    newTop = _body_scroll_position.top + self.xvar.__y_da;

                    // newTop이 범위를 넘었는지 체크
                    if (newTop >= 0) {
                        newTop = 0;
                    } else if (newTop <= _panel_height - _content_height) {
                        newTop = _panel_height - _content_height;
                        if (newTop >= 0) newTop = 0;
                    }

                    // newLeft이 범위를 넘었는지 체크
                    if (newLeft >= 0) {
                        newLeft = 0;
                    } else if (newLeft <= _panel_width - _content_width) {
                        newLeft = _panel_width - _content_width;
                        if (newLeft >= 0) newLeft = 0;
                    }

                    return {
                        left: newLeft, top: newTop
                    }
                };

            this.xvar.__x_da = 0; // 이동량 변수 초기화
            this.xvar.__y_da = 0; // 계산이 잘못 될까바
            this.xvar.touchmoved = false;

            jQuery(document.body)
                .on("touchmove" + ".ax5grid-" + this.instanceId, function (e) {
                    let css = getContentPosition(e);

                    resize.call(self);
                    GRID.header.scrollTo.call(self, {left: css.left});
                    GRID.body.scrollTo.call(self, css, {noRepaint: "noRepaint"});
                    U.stopEvent(e.originalEvent);
                    self.xvar.touchmoved = true;
                })
                .on("touchend" + ".ax5grid-" + this.instanceId, function (e) {
                    if (self.xvar.touchmoved) {
                        let css = getContentPosition(e);

                        resize.call(self);
                        GRID.header.scrollTo.call(self, {left: css.left});
                        GRID.body.scrollTo.call(self, css);
                        U.stopEvent(e.originalEvent);
                        scrollContentMover.off.call(self);
                    }
                });

            jQuery(document.body)
                .attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);
        },
        "off": function () {

            jQuery(document.body)
                .off("touchmove" + ".ax5grid-" + this.instanceId)
                .off("touchend" + ".ax5grid-" + this.instanceId);

            jQuery(document.body)
                .removeAttr('unselectable')
                .css('user-select', 'auto')
                .off('selectstart');
        }
    };

    const init = function () {
        let self = this,
            margin = this.config.scroller.trackPadding;

        if (margin == 0) {
            this.$["scroller"]["vertical-bar"].css({width: this.config.scroller.size, left: -1});
            this.$["scroller"]["horizontal-bar"].css({height: this.config.scroller.size, top: -1});
        } else {
            this.$["scroller"]["vertical-bar"].css({width: this.config.scroller.size - (margin + 1), left: margin / 2});
            this.$["scroller"]["horizontal-bar"].css({height: this.config.scroller.size - (margin + 1), top: margin / 2});
        }

        this.$["scroller"]["vertical-bar"]
            .on(GRID.util.ENM["mousedown"], (function (e) {
                this.xvar.mousePosition = GRID.util.getMousePosition(e);
                scrollBarMover.on.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical", e);
            }).bind(this))
            .on("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });

        this.$["scroller"]["vertical"]
            .on("click", (function (e) {
                if (e.target.getAttribute("data-ax5grid-scroller") == "vertical") {
                    scrollBarMover.click.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical", e);
                }
            }).bind(this));

        this.$["scroller"]["horizontal-bar"]
            .on(GRID.util.ENM["mousedown"], (function (e) {
                this.xvar.mousePosition = GRID.util.getMousePosition(e);
                scrollBarMover.on.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal", e);
            }).bind(this))
            .on("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });

        this.$["scroller"]["horizontal"]
            .on("click", (function (e) {
                if (e.target.getAttribute("data-ax5grid-scroller") == "horizontal") {
                    scrollBarMover.click.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal", e);
                }
            }).bind(this));

        this.$["container"]["body"].on('mousewheel DOMMouseScroll', (function (e) {
            let E = e.originalEvent, delta = {x: 0, y: 0};

            if (E.detail) {
                delta.y = E.detail * 10;
            } else {
                if (typeof E.deltaY === "undefined") {
                    delta.y = -E.wheelDelta;
                    delta.x = 0;
                } else {
                    delta.y = E.deltaY;
                    delta.x = E.deltaX;
                }
            }

            if (scrollContentMover.wheel.call(this, delta)) {
                U.stopEvent(e);
            }
        }).bind(this));

        if (ax5.info.supportTouch) {
            this.$["container"]["body"]
                .on("touchstart", '[data-ax5grid-panel]', function (e) {
                    self.xvar.mousePosition = GRID.util.getMousePosition(e);
                    scrollContentMover.on.call(self);
                });
        }

        this.xvar.body_panel_height = this.$["panel"]["body"].height();
        this.xvar.body_panel_width = this.$["panel"]["body"].width();
    };

    const resize = function () {
        let _vertical_scroller_height = this.$["scroller"]["vertical"].height(),
            _horizontal_scroller_width = this.$["scroller"]["horizontal"].width(),
            _panel_height = this.$["panel"]["body"].height(),
            _panel_width = this.$["panel"]["body"].width(),
            _content_height = this.xvar.scrollContentHeight,
            _content_width = this.xvar.scrollContentWidth,
            verticalScrollBarHeight = _panel_height * _vertical_scroller_height / _content_height,
            horizontalScrollBarWidth = _panel_width * _horizontal_scroller_width / _content_width;

        if (verticalScrollBarHeight < this.config.scroller.barMinSize) verticalScrollBarHeight = this.config.scroller.barMinSize;
        if (horizontalScrollBarWidth < this.config.scroller.barMinSize) horizontalScrollBarWidth = this.config.scroller.barMinSize;

        this.$["scroller"]["vertical-bar"].css({
            top: convertScrollBarPosition.vertical.call(this, this.$.panel["body-scroll"].position().top, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            height: verticalScrollBarHeight
        });

        this.$["scroller"]["horizontal-bar"].css({
            left: convertScrollBarPosition.horizontal.call(this, this.$.panel["body-scroll"].position().left, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            width: horizontalScrollBarWidth
        });

        this.xvar.body_panel_height = _panel_height;
        this.xvar.body_panel_width = _panel_width;

        _vertical_scroller_height = null;
        _horizontal_scroller_width = null;
        _panel_height = null;
        _panel_width = null;
        _content_height = null;
        _content_width = null;
        verticalScrollBarHeight = null;
        horizontalScrollBarWidth = null;
    };

    GRID.scroller = {
        // 타이머
        moveout_timer: (new Date()).getTime(),
        init: init,
        resize: resize
    };

})();