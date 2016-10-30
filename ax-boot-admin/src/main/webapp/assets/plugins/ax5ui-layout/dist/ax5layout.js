"use strict";

// ax5.ui.layout
(function () {
    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "layout",
        version: "1.3.8"
    }, function () {
        /**
         * @class ax5layout
         * @alias ax5.ui.layout
         * @author tom@axisj.com
         * @example
         * ```js
         * jQuery('[data-ax5layout="ax1"]').ax5layout({
         *     onResize: function () {
         *     }
         * });
         *
         * jQuery('[data-ax5layout="ax1"]').ax5layout("resize", {
         *     top: {height: 100},
         *     bottom: 100,
         *     left: 100,
         *     right: 100
         * });
         * ```
         */
        var ax5layout = function ax5layout() {
            var self = this,
                cfg,
                ENM = {
                "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
                "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
                "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
            },
                getMousePosition = function getMousePosition(e) {
                var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;
                return {
                    clientX: mouseObj.clientX,
                    clientY: mouseObj.clientY
                };
            };

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                splitter: {
                    size: 4
                },
                autoResize: true
            };
            this.queue = [];

            this.openTimer = null;
            this.closeTimer = null;
            this.resizer = null;

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }
                return true;
            },
                alignLayoutAll = function alignLayoutAll() {
                var i = this.queue.length;
                while (i--) {
                    if (typeof this.queue[i].parentQueIdx === "undefined" && this.queue[i].autoResize) {
                        alignLayout.call(this, i, null, "windowResize");
                    }
                }
            },
                getDockPanelOuterSize = {
                "width": function width(item, panel) {
                    return panel ? panel.__width + (panel.split ? item.splitter.size : 0) : 0;
                },
                "height": function height(item, panel) {
                    return panel ? panel.__height + (panel.split ? item.splitter.size : 0) : 0;
                }
            },
                getPixel = function getPixel(size, parentSize) {
                if (size == "*") {
                    return;
                } else if (U.right(size, 1) == "%") {
                    return parentSize * U.number(size) / 100;
                } else {
                    return Number(size);
                }
            },
                alignLayout = function () {

                var beforeSetCSS = {
                    "split": {
                        "horizontal": function horizontal(item, panel, panelIndex) {
                            if (panel.splitter) {
                                panel.__height = item.splitter.size;
                            } else {
                                if (panelIndex == item.splitPanel.length - 1) {
                                    if (item.splitPanel.asteriskLength == 0) {
                                        panel.height = "*";
                                        panel.__height = undefined;
                                        item.splitPanel.asteriskLength++;
                                    } else {
                                        if (panel.height == "*") {
                                            item.splitPanel.asteriskLength++;
                                        } else {
                                            //panel.__height = getPixel(panel.height, item.targetDimension.height);
                                        }
                                    }
                                } else {
                                    if (panel.height == "*") {
                                        item.splitPanel.asteriskLength++;
                                    } else {
                                        //panel.__height = getPixel(panel.height, item.targetDimension.height);
                                    }
                                }
                            }
                        },
                        "vertical": function vertical(item, panel, panelIndex) {
                            if (panel.splitter) {
                                panel.__width = item.splitter.size;
                            } else {
                                if (panelIndex == item.splitPanel.length - 1) {
                                    if (item.splitPanel.asteriskLength == 0) {
                                        panel.width = "*";
                                        panel.__width = undefined;
                                        item.splitPanel.asteriskLength++;
                                    } else {
                                        if (panel.width == "*") {
                                            item.splitPanel.asteriskLength++;
                                        }
                                    }
                                } else {
                                    if (panel.width == "*") {
                                        item.splitPanel.asteriskLength++;
                                    } else {
                                        //panel.__width = getPixel(panel.width, item.targetDimension.width);
                                    }
                                }
                            }
                        }
                    }
                };
                var setCSS = {
                    "top": function top(item, panel) {
                        panel.$target.css({ height: panel.__height || 0 });
                        if (panel.split) {
                            panel.$splitter.css({ height: item.splitter.size, top: panel.__height || 0 });
                        }
                    },
                    "bottom": function bottom(item, panel) {
                        panel.$target.css({ height: panel.__height || 0 });
                        if (panel.split) {
                            panel.$splitter.css({ height: item.splitter.size, bottom: panel.__height || 0 });
                        }
                    },
                    "left": function left(item, panel) {
                        var css = {
                            width: panel.__width || 0,
                            height: item.targetDimension.height
                        };

                        if (item.dockPanel.top) {
                            css.height -= item.dockPanel.top.__height;
                            css.top = item.dockPanel.top.__height;
                            if (item.dockPanel.top.split) {
                                css.height -= item.splitter.size;
                                css.top += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.bottom) {
                            css.height -= item.dockPanel.bottom.__height;
                            if (item.dockPanel.bottom.split) {
                                css.height -= item.splitter.size;
                            }
                        }

                        panel.$target.css(css);

                        if (panel.split) {
                            panel.$splitter.css({ width: item.splitter.size, height: css.height, top: css.top, left: css.width });
                        }
                    },
                    "right": function right(item, panel) {
                        var css = {
                            width: panel.__width || 0,
                            height: item.targetDimension.height
                        };

                        if (item.dockPanel.top) {
                            css.height -= item.dockPanel.top.__height;
                            css.top = item.dockPanel.top.__height;
                            if (item.dockPanel.top.split) {
                                css.height -= item.splitter.size;
                                css.top += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.bottom) {
                            css.height -= item.dockPanel.bottom.__height;
                            if (item.dockPanel.bottom.split) {
                                css.height -= item.splitter.size;
                            }
                        }

                        panel.$target.css(css);

                        if (panel.split) {
                            panel.$splitter.css({ width: item.splitter.size, height: css.height, top: css.top, right: css.width });
                        }
                    },
                    "center": function center(item, panel) {
                        var css = {
                            width: item.targetDimension.width,
                            height: item.targetDimension.height
                        };

                        if (item.dockPanel.top) {
                            css.height -= item.dockPanel.top.__height || 0;
                            css.top = item.dockPanel.top.__height || 0;
                            if (item.dockPanel.top.split) {
                                css.height -= item.splitter.size;
                                css.top += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.bottom) {
                            css.height -= item.dockPanel.bottom.__height || 0;
                            if (item.dockPanel.bottom.split) {
                                css.height -= item.splitter.size;
                            }
                        }
                        if (item.dockPanel.left) {
                            css.width -= item.dockPanel.left.__width || 0;
                            css.left = item.dockPanel.left.__width || 0;
                            if (item.dockPanel.left.split) {
                                css.width -= item.splitter.size;
                                css.left += item.splitter.size;
                            }
                        }
                        if (item.dockPanel.right) {
                            css.width -= item.dockPanel.right.__width || 0;
                            if (item.dockPanel.right.split) {
                                css.width -= item.splitter.size;
                            }
                        }

                        var minWidth = panel.minWidth || 0;
                        var minHeight = panel.minHeight || 0;

                        // 레이아웃의 최소 너비 높이를 주어 레이아웃 덕패널이 겹치는 일이 없게 합니다
                        if (css.width < minWidth) {
                            css.width = minWidth;
                            item.$target.css({ minWidth: minWidth + getDockPanelOuterSize["width"](item.dockPanel.left, item.splitter.size) + getDockPanelOuterSize["width"](item.dockPanel.right, item.splitter.size) });
                        }
                        if (css.height < minHeight) {
                            css.height = minHeight;
                            item.$target.css({ minHeight: minHeight + getDockPanelOuterSize["height"](item.dockPanel.top, item.splitter.size) + getDockPanelOuterSize["height"](item.dockPanel.bottom, item.splitter.size) });
                        }

                        panel.$target.css(css);
                    },
                    "split": {
                        "horizontal": function horizontal(item, panel, panelIndex, withoutAsteriskSize, windowResize) {
                            var css = {
                                display: "block"
                            };
                            var prevPosition = panelIndex ? Number(item.splitPanel[panelIndex - 1].offsetEnd) : 0;
                            if (panel.splitter) {
                                css.height = item.splitter.size;
                            } else {
                                if (panel.height == "*" && (typeof panel.__height === "undefined" || windowResize)) {
                                    // 남은 전체 공간을 사용
                                    css.height = panel.__height = (item.targetDimension.height - withoutAsteriskSize) / item.splitPanel.asteriskLength;
                                } else {
                                    css.height = panel.__height || 0;
                                }
                            }
                            css.top = prevPosition;
                            panel.offsetStart = prevPosition;
                            panel.offsetEnd = Number(prevPosition) + Number(css.height);
                            panel.$target.css(css);
                        },
                        "vertical": function vertical(item, panel, panelIndex, withoutAsteriskSize, windowResize) {
                            var css = {
                                display: "block"
                            };
                            var prevPosition = panelIndex ? Number(item.splitPanel[panelIndex - 1].offsetEnd) : 0;

                            if (panel.splitter) {
                                css.width = item.splitter.size;
                            } else {
                                if (panel.width == "*" && (typeof panel.__width === "undefined" || windowResize)) {
                                    // 남은 전체 공간을 사용
                                    css.width = panel.__width = (item.targetDimension.width - withoutAsteriskSize) / item.splitPanel.asteriskLength;
                                } else {
                                    css.width = panel.__width || 0;
                                }
                            }
                            css.left = prevPosition;
                            panel.offsetStart = prevPosition;
                            panel.offsetEnd = Number(prevPosition) + Number(css.width);

                            panel.$target.css(css);
                        }
                    }
                };
                var layoutProcessor = {
                    "dock-panel": function dockPanel(item) {
                        for (var panel in item.dockPanel) {
                            if (item.dockPanel[panel].$target && item.dockPanel[panel].$target.get(0)) {
                                if (panel in setCSS) {
                                    setCSS[panel].call(this, item, item.dockPanel[panel]);
                                }
                            }
                        }
                    },
                    "split-panel": function splitPanel(item, windowResize) {
                        //console.log(item.splitPanel);
                        var withoutAsteriskSize;
                        item.splitPanel.asteriskLength = 0;
                        item.splitPanel.forEach(function (panel, panelIndex) {
                            beforeSetCSS["split"][item.orientation].call(this, item, panel, panelIndex);
                        });

                        if (item.orientation == "horizontal") {
                            withoutAsteriskSize = U.sum(item.splitPanel, function (n) {
                                if (n.height != "*") return U.number(n.__height);
                            });
                        } else {
                            withoutAsteriskSize = U.sum(item.splitPanel, function (n) {
                                if (n.width != "*") return U.number(n.__width);
                            });
                        }

                        item.splitPanel.forEach(function (panel, panelIndex) {
                            setCSS["split"][item.orientation].call(this, item, panel, panelIndex, withoutAsteriskSize, windowResize);
                        });
                    }
                };
                var childResize = function childResize(item) {
                    var i = item.childQueIdxs.length;
                    while (i--) {
                        alignLayout.call(this, item.childQueIdxs[i]);
                    }
                };

                return function (queIdx, callback, windowResize) {
                    var item = this.queue[queIdx];

                    // 레이아웃 타겟의 CSS속성을 미리 저장해 둡니다. 왜? 패널별로 크기 계산 할 때 쓰려고
                    item.targetDimension = {
                        height: item.$target.innerHeight(),
                        width: item.$target.innerWidth()
                    };

                    if (item.layout in layoutProcessor) {
                        layoutProcessor[item.layout].call(this, item, windowResize);
                    }

                    if (item.childQueIdxs) childResize.call(this, item, windowResize);
                    if (item.onResize) {
                        setTimeout(function () {
                            this.onResize.call(this, this);
                        }.bind(item), 1);
                    }
                    if (callback) {
                        callback.call(item, item);
                    }
                };
            }(),
                resizeSplitter = {
                "on": function on(queIdx, panel, $splitter) {
                    var item = this.queue[queIdx];
                    var splitterOffset = $splitter.position();
                    var splitterBox = {
                        width: $splitter.width(), height: $splitter.height()
                    };
                    var getResizerPosition = {
                        "left": function left(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientX - panel.mousePosition.clientX;
                            var minWidth = panel.minWidth || 0;
                            var maxWidth = panel.maxWidth || item.targetDimension.width - getDockPanelOuterSize["width"](item, item.dockPanel.left) - getDockPanelOuterSize["width"](item, item.dockPanel.right);

                            if (panel.__width + panel.__da < minWidth) {
                                panel.__da = -panel.__width + minWidth;
                            } else if (maxWidth < panel.__width + panel.__da) {
                                panel.__da = maxWidth - panel.__width;
                            }
                            return { left: panel.$splitter.position().left + panel.__da };
                        },
                        "right": function right(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientX - panel.mousePosition.clientX;
                            var minWidth = panel.minWidth || 0;
                            var maxWidth = panel.maxWidth || item.targetDimension.width - getDockPanelOuterSize["width"](item, item.dockPanel.left) - getDockPanelOuterSize["width"](item, item.dockPanel.right);

                            if (panel.__width - panel.__da < minWidth) {
                                panel.__da = panel.__width - minWidth;
                            } else if (maxWidth < panel.__width - panel.__da) {
                                panel.__da = -maxWidth + panel.__width;
                            }
                            return { left: panel.$splitter.position().left + panel.__da };
                        },
                        "top": function top(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientY - panel.mousePosition.clientY;
                            var minHeight = panel.minHeight || 0;
                            var maxHeight = panel.maxHeight || item.targetDimension.height - getDockPanelOuterSize["height"](item, item.dockPanel.top) - getDockPanelOuterSize["height"](item, item.dockPanel.bottom);

                            if (panel.__height + panel.__da < minHeight) {
                                panel.__da = -panel.__height + minHeight;
                            } else if (maxHeight < panel.__height + panel.__da) {
                                panel.__da = maxHeight - panel.__height;
                            }
                            return { top: panel.$splitter.position().top + panel.__da };
                        },
                        "bottom": function bottom(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            panel.__da = mouseObj.clientY - panel.mousePosition.clientY;
                            var minHeight = panel.minHeight || 0;
                            var maxHeight = panel.maxHeight || item.targetDimension.height - getDockPanelOuterSize["height"](item, item.dockPanel.top) - getDockPanelOuterSize["height"](item, item.dockPanel.bottom);

                            if (panel.__height - panel.__da < minHeight) {
                                panel.__da = panel.__height - minHeight;
                            } else if (maxHeight < panel.__height - panel.__da) {
                                panel.__da = -maxHeight + panel.__height;
                            }
                            return { top: panel.$splitter.position().top + panel.__da };
                        },
                        "split": function split(e) {
                            var mouseObj = 'changedTouches' in e.originalEvent ? e.originalEvent.changedTouches[0] : e;

                            if (item.orientation == "horizontal") {
                                panel.__da = mouseObj.clientY - panel.mousePosition.clientY;

                                var prevPanel = item.splitPanel[panel.panelIndex - 1];
                                var nextPanel = item.splitPanel[panel.panelIndex + 1];

                                var prePanelMinHeight = prevPanel.minHeight || 0;
                                var nextPanelMinHeight = nextPanel.minHeight || 0;

                                if (panel.offsetStart + panel.__da < prevPanel.offsetStart + prePanelMinHeight) {
                                    panel.__da = prevPanel.offsetStart - panel.offsetStart + prePanelMinHeight;
                                } else if (panel.offsetStart + panel.__da > nextPanel.offsetEnd - nextPanelMinHeight) {
                                    panel.__da = nextPanel.offsetEnd - panel.offsetEnd - nextPanelMinHeight;
                                }

                                return { top: panel.$target.position().top + panel.__da };
                            } else {
                                /// todo : min & max 범위 정하기
                                panel.__da = mouseObj.clientX - panel.mousePosition.clientX;

                                var prevPanel = item.splitPanel[panel.panelIndex - 1];
                                var nextPanel = item.splitPanel[panel.panelIndex + 1];
                                var prePanelMinWidth = prevPanel.minWidth || 0;
                                var nextPanelMinWidth = nextPanel.minWidth || 0;

                                if (panel.offsetStart + panel.__da < prevPanel.offsetStart + prePanelMinWidth) {
                                    panel.__da = prevPanel.offsetStart - panel.offsetStart + prePanelMinWidth;
                                } else if (panel.offsetStart + panel.__da > nextPanel.offsetEnd - nextPanelMinWidth) {
                                    panel.__da = nextPanel.offsetEnd - panel.offsetEnd - nextPanelMinWidth;
                                }
                                return { left: Number(panel.$target.position().left) + Number(panel.__da) };
                            }
                        }
                    };
                    panel.__da = 0; // 패널의 변화량

                    jQuery(document.body).bind(ENM["mousemove"] + ".ax5layout-" + this.instanceId, function (e) {
                        if (!self.resizer) {

                            self.resizer = jQuery('<div class="ax5layout-resizer panel-' + panel.resizerType + '" ondragstart="return false;"></div>');
                            self.resizer.css({
                                left: splitterOffset.left,
                                top: splitterOffset.top,
                                width: splitterBox.width,
                                height: splitterBox.height
                            });
                            item.$target.append(self.resizer);
                        }
                        self.resizer.css(getResizerPosition[panel.resizerType](e));
                    }).bind(ENM["mouseup"] + ".ax5layout-" + this.instanceId, function (e) {
                        resizeSplitter.off.call(self, queIdx, panel, $splitter);
                    }).bind("mouseleave.ax5layout-" + this.instanceId, function (e) {
                        resizeSplitter.off.call(self, queIdx, panel, $splitter);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
                },
                "off": function off(queIdx, panel, $splitter) {
                    var item = this.queue[queIdx];
                    var setPanelSize = {
                        "dock-panel": {
                            "left": function left(queIdx, panel) {
                                panel.__width += panel.__da;
                            },
                            "right": function right() {
                                panel.__width -= panel.__da;
                            },
                            "top": function top() {
                                panel.__height += panel.__da;
                            },
                            "bottom": function bottom() {
                                panel.__height -= panel.__da;
                            }
                        },
                        "split-panel": {
                            "split": function split() {
                                if (item.orientation == "horizontal") {
                                    // 앞과 뒤의 높이 조절
                                    item.splitPanel[panel.panelIndex - 1].__height += panel.__da;
                                    item.splitPanel[panel.panelIndex + 1].__height -= panel.__da;
                                } else {
                                    // 앞과 뒤의 높이 조절

                                    item.splitPanel[panel.panelIndex - 1].__width += panel.__da;
                                    item.splitPanel[panel.panelIndex + 1].__width -= panel.__da;
                                }
                            }
                        },
                        "tab-panel": {}
                    };

                    if (self.resizer) {
                        self.resizer.remove();
                        self.resizer = null;
                        setPanelSize[this.queue[queIdx].layout][panel.resizerType].call(this, queIdx, panel);
                        alignLayout.call(this, queIdx);
                    }

                    jQuery(document.body).unbind(ENM["mousemove"] + ".ax5layout-" + this.instanceId).unbind(ENM["mouseup"] + ".ax5layout-" + this.instanceId).unbind("mouseleave.ax5layout-" + this.instanceId);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
                }
            },
                tabControl = {
                "open": function open(queIdx, layout, panelIndex) {
                    if (layout.activePanelIndex != panelIndex) {
                        layout.tabPanel[panelIndex].active = true;
                        layout.tabPanel[layout.activePanelIndex].active = false;
                        layout.$target.find('[data-tab-panel-label="' + panelIndex + '"]').attr("data-tab-active", "true");
                        layout.$target.find('[data-tab-panel-label="' + layout.activePanelIndex + '"]').removeAttr("data-tab-active");
                        layout.tabPanel[panelIndex].$target.attr("data-tab-active", "true");
                        layout.tabPanel[layout.activePanelIndex].$target.removeAttr("data-tab-active");
                        layout.activePanelIndex = panelIndex;

                        if (layout.onOpenTab) {
                            var that = {
                                '$target': layout.$target,
                                name: layout.name,
                                id: layout.id,
                                layout: layout.layout,
                                activePanelIndex: layout.activePanelIndex,
                                activePanel: layout.tabPanel[layout.activePanelIndex],
                                tabPanel: layout.tabPanel
                            };
                            layout.onOpenTab.call(that);
                        }
                    }
                }
            },
                getTabLabesTmpl = function getTabLabesTmpl() {
                return "\n<div data-tab-panel-label-holder=\"{{id}}\">\n    <div data-tab-panel-label-border=\"{{id}}\"></div>\n    <div data-tab-panel-label-table=\"{{id}}\">\n        <div data-tab-panel-aside=\"left\"></div>\n    {{#tabPanel}}\n        <div data-tab-panel-label=\"{{panelIndex}}\" data-tab-active=\"{{active}}\">\n            <div data-tab-label=\"{{panelIndex}}\">{{{label}}}</div>\n        </div>\n    {{/tabPanel}}\n        <div data-tab-panel-aside=\"right\"></div>\n    </div>\n</div>\n";
            },
                bindLayoutTarget = function () {

                var applyLayout = {
                    "dock-panel": function dockPanel(queIdx) {
                        var item = this.queue[queIdx];
                        item.dockPanel = {};
                        item.$target.find('>[data-dock-panel]').each(function () {

                            var panelInfo = {};
                            (function (data) {
                                if (U.isObject(data) && !data.error) {
                                    panelInfo = jQuery.extend(true, panelInfo, data);
                                }
                            })(U.parseJson(this.getAttribute("data-dock-panel"), true));

                            if ('dock' in panelInfo) {
                                panelInfo.$target = jQuery(this);
                                panelInfo.$target.addClass("dock-panel-" + panelInfo.dock);

                                if (panelInfo.split = panelInfo.split && panelInfo.split.toString() == "true") {
                                    panelInfo.$splitter = jQuery('<div data-splitter="" class="dock-panel-' + panelInfo.dock + '"></div>');
                                    panelInfo.$splitter.bind(ENM["mousedown"], function (e) {
                                        panelInfo.mousePosition = getMousePosition(e);
                                        resizeSplitter.on.call(self, queIdx, panelInfo, panelInfo.$splitter);
                                    }).bind("dragstart", function (e) {
                                        U.stopEvent(e);
                                        return false;
                                    });
                                    item.$target.append(panelInfo.$splitter);
                                }

                                if (panelInfo.dock == "top" || panelInfo.dock == "bottom") {
                                    panelInfo.__height = getPixel(panelInfo.height, item.targetDimension.height);
                                } else {
                                    panelInfo.__width = getPixel(panelInfo.width, item.targetDimension.width);
                                }
                                panelInfo.resizerType = panelInfo.dock;
                                item.dockPanel[panelInfo.dock] = panelInfo;
                            }
                        });
                    },
                    "split-panel": function splitPanel(queIdx) {
                        var item = this.queue[queIdx];
                        item.splitPanel = [];
                        item.$target.find('>[data-split-panel], >[data-splitter]').each(function (ELIndex) {

                            var panelInfo = {};
                            (function (data) {
                                if (U.isObject(data) && !data.error) {
                                    panelInfo = jQuery.extend(true, panelInfo, data);
                                }
                            })(U.parseJson(this.getAttribute("data-split-panel") || this.getAttribute("data-splitter"), true));

                            panelInfo.$target = jQuery(this);
                            panelInfo.$target.addClass("split-panel-" + item.orientation);
                            panelInfo.panelIndex = ELIndex;

                            if (this.getAttribute("data-splitter")) {

                                panelInfo.splitter = true;
                                panelInfo.$target.bind(ENM["mousedown"], function (e) {
                                    if (panelInfo.panelIndex > 0 && panelInfo.panelIndex < item.splitPanel.length - 1) {
                                        panelInfo.mousePosition = getMousePosition(e);
                                        resizeSplitter.on.call(self, queIdx, panelInfo, panelInfo.$target);
                                    }
                                }).bind("dragstart", function (e) {
                                    U.stopEvent(e);
                                    return false;
                                });
                                panelInfo.resizerType = "split";
                            } else {

                                if (item.orientation == "horizontal") {
                                    panelInfo.__height = getPixel(panelInfo.height, item.targetDimension.height);
                                } else {
                                    item.orientation = "vertical";
                                    panelInfo.__width = getPixel(panelInfo.width, item.targetDimension.width);
                                }
                            }

                            item.splitPanel.push(panelInfo);
                        });
                    },
                    "tab-panel": function tabPanel(queIdx) {
                        var item = this.queue[queIdx];

                        var hasActivePanel = false;
                        var activePanelIndex = -1;
                        item.tabPanel = [];
                        item.$target.find('>[data-tab-panel]').each(function (ELIndex) {
                            var panelInfo = {};
                            (function (data) {
                                if (U.isObject(data) && !data.error) {
                                    panelInfo = jQuery.extend(true, panelInfo, data);
                                }
                            })(U.parseJson(this.getAttribute("data-tab-panel"), true));

                            if (hasActivePanel) {
                                panelInfo.active = false;
                            }

                            panelInfo.$target = jQuery(this);

                            if (panelInfo.active && panelInfo.active != "false") {
                                hasActivePanel = true;
                                item.activePanelIndex = ELIndex;
                                panelInfo.$target.attr("data-tab-active", "true");
                            }

                            panelInfo.panelIndex = ELIndex;
                            item.tabPanel.push(panelInfo);
                        });

                        if (!hasActivePanel) {
                            item.tabPanel[0].active = true;
                            item.tabPanel[0].$target.attr("data-tab-active", "true");
                            item.activePanelIndex = 0;
                        }

                        // make tabLabel
                        item.$target.append(jQuery(ax5.mustache.render(getTabLabesTmpl.call(this, queIdx), item)));
                        item.$target.on("click", '[data-tab-panel-label]', function (e) {
                            var index = this.getAttribute("data-tab-panel-label");
                            tabControl.open.call(self, queIdx, item, index);
                        });
                    }
                };

                return function (queIdx) {
                    var item = this.queue[queIdx];
                    var data = {};

                    // 레이아웃 타겟의 CSS속성을 미리 저장해 둡니다. 왜? 패널별로 크기 계산 할 때 쓰려고
                    item.targetDimension = {
                        height: item.$target.innerHeight(),
                        width: item.$target.innerWidth()
                    };

                    // 부모 컨테이너가 ax5layout인지 판단 필요.
                    if (item.$target.parents("[data-ax5layout]").get(0)) {
                        hooksResizeLayout.call(this, item.$target.parents("[data-ax5layout]").get(0), queIdx);
                    }

                    if (item.layout in applyLayout) {
                        applyLayout[item.layout].call(this, queIdx);
                    }
                    alignLayout.call(this, queIdx);
                };
            }(),
                getQueIdx = function getQueIdx(boundID) {
                if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-ax5layout-id");
                }
                if (!U.isString(boundID)) {
                    //console.log(ax5.info.getError("ax5layout", "402", "getQueIdx"));
                    return -1;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            },
                hooksResizeLayout = function hooksResizeLayout(boundID, childQueIdx) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (!this.queue[queIdx].childQueIdxs) this.queue[queIdx].childQueIdxs = [];
                this.queue[queIdx].childQueIdxs.push(childQueIdx);
                this.queue[childQueIdx].parentQueIdx = queIdx;
            };
            /// private end
            /**
             * Preferences of layout UI
             * @method ax5layout.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Number} [config.animateTime=250]
             * @param {Object} [config.splitter]
             * @param {Number} [config.splitter.size=4]
             * @param {Boolean} [config.autoResize=true]
             * @returns {ax5layout}
             * @example
             * ```js
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                jQuery(window).bind("resize.ax5layout-" + this.instanceId, function () {
                    alignLayoutAll.call(this);
                }.bind(this));
            };

            /**
             * @method ax5layout.bind
             * @param {Object} item
             * @param {String} [item.layout]
             * @param {String} [item.theme]
             * @param {Element} item.target
             * @param {Object[]} item.options
             * @param {Object} [item.splitter]
             * @param {Number} [item.splitter.size=4]
             * @param {Boolean} [item.autoResize=true]
             * @returns {ax5layout}
             */
            this.bind = function (item) {
                var UIConfig = {},
                    queIdx;

                item = jQuery.extend(true, UIConfig, cfg, item);
                if (!item.target) {
                    console.log(ax5.info.getError("ax5layout", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5layout-id");
                if (!item.id) {
                    item.id = 'ax5layout-' + ax5.getGuid();
                    item.$target.data("data-ax5layout-id", item.id);
                }
                item.name = item.$target.attr("data-ax5layout");
                if (item.options) {
                    item.options = JSON.parse(JSON.stringify(item.options));
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindLayoutTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindLayoutTarget.call(this, queIdx);
                }

                UIConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * @method ax5layout.align
             * @param boundID
             * @param {Function} [callback]
             * @param {String} [windowResize]
             * @returns {ax5layout}
             */
            this.align = function (boundID, windowResize) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);

                if (queIdx === -1) {
                    var i = this.queue.length;
                    while (i--) {
                        alignLayout.call(this, i, null, windowResize);
                    }
                } else {
                    alignLayout.call(this, queIdx, null, windowResize);
                }
                return this;
            };

            /**
             * @method ax5layout.onResize
             * @param boundID
             * @param fn
             * @returns {ax5layout}
             */
            this.onResize = function (boundID, fn) {
                var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5layout", "402", "onResize"));
                    return;
                }
                this.queue[queIdx].onResize = fn;
                return this;
            };

            /**
             * @method ax5layout.resize
             * @param boundID
             * @param {Object} resizeOption
             * @param {Function} [callback]
             * @returns {ax5layout}
             */
            this.resize = function () {

                var resizeLayoutPanel = {
                    "dock-panel": function dockPanel(item, resizeOption) {
                        ["top", "bottom", "left", "right"].forEach(function (dock) {
                            if (resizeOption[dock] && item.dockPanel[dock]) {
                                if (dock == "top" || dock == "bottom") {
                                    item.dockPanel[dock].__height = U.isObject(resizeOption[dock]) ? resizeOption[dock].height : resizeOption[dock];
                                } else if (dock == "left" || dock == "right") {
                                    item.dockPanel[dock].__width = U.isObject(resizeOption[dock]) ? resizeOption[dock].width : resizeOption[dock];
                                }
                            }
                        });
                    },
                    "split-panel": function splitPanel() {},
                    "tab-panel": function tabPanel() {}
                };

                return function (boundID, resizeOption, callback) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        var i = this.queue.length;
                        while (i--) {
                            resizeLayoutPanel[this.queue[i].layout].call(this, this.queue[i], resizeOption);
                            alignLayout.call(this, i, callback);
                        }
                    } else {
                        if (this.queue[queIdx]) {
                            resizeLayoutPanel[this.queue[queIdx].layout].call(this, this.queue[queIdx], resizeOption);
                            alignLayout.call(this, queIdx, callback);
                        }
                    }

                    return this;
                };
            }();

            this.reset = function () {

                var resetLayoutPanel = {
                    "dock-panel": function dockPanel(item) {
                        ["top", "bottom", "left", "right"].forEach(function (dock) {
                            if (item.dockPanel[dock]) {
                                if (dock == "top" || dock == "bottom") {
                                    item.dockPanel[dock].__height = item.dockPanel[dock].height;
                                } else if (dock == "left" || dock == "right") {
                                    item.dockPanel[dock].__width = item.dockPanel[dock].width;
                                }
                            }
                        });
                    },
                    "split-panel": function splitPanel(item) {
                        item.splitPanel.forEach(function (panel) {
                            if (item.orientation == "vertical") {
                                panel.__width = getPixel(panel.width, item.targetDimension.width);
                            } else if (item.orientation == "horizontal") {
                                panel.__height = getPixel(panel.height, item.targetDimension.height);
                            }
                        });
                    },
                    "tab-panel": function tabPanel() {}
                };

                return function (boundID, callback) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {} else {
                        resetLayoutPanel[this.queue[queIdx].layout].call(this, this.queue[queIdx]);
                        alignLayout.call(this, queIdx, callback);
                    }

                    return this;
                };
            }();

            this.hide = function () {};

            /**
             * @method ax5layout.tabOpen
             * @param boundID
             * @param tabIndex
             * @returns {ax5.ui.ax5layout}
             */
            this.tabOpen = function () {
                return function (boundID, tabIndex) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5layout", "402", "tabOpen"));
                        return;
                    }

                    tabControl.open.call(this, queIdx, this.queue[queIdx], tabIndex);
                    return this;
                };
            }();

            /// 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    this.init();
                }
            }.apply(this, arguments);
        };
        return ax5layout;
    }());
})();

ax5.ui.layout_instance = new ax5.ui.layout();

/**
 * ax5layout jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5layout
 * @param {String} methodName
 * @example
 * ```js
 * jQuery('[data-ax5layout="ax1"]').ax5layout();
 * ```
 */

jQuery.fn.ax5layout = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "align":
                    return ax5.ui.layout_instance.align(this, arguments[1]);
                    break;
                case "resize":
                    return ax5.ui.layout_instance.resize(this, arguments[1], arguments[2]);
                    break;
                case "reset":
                    return ax5.ui.layout_instance.reset(this, arguments[1]);
                    break;
                case "hide":
                    return ax5.ui.layout_instance.hide(this, arguments[1]);
                    break;
                case "onResize":
                    return ax5.ui.layout_instance.onResize(this, arguments[1]);
                    break;
                case "tabOpen":
                    return ax5.ui.layout_instance.tabOpen(this, arguments[1]);
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
                ax5.ui.layout_instance.bind(config);
            });
        }
        return this;
    };
}();