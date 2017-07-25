"use strict";

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.modal
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var MODAL = void 0;

    UI.addClass({
        className: "modal"
    }, function () {
        /**
         * @class ax5modal
         * @alias ax5.ui.modal
         * @author tom@axisj.com
         */
        return function () {
            var self = this,
                cfg = void 0,
                ENM = {
                "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
                "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
                "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
            },
                getMousePosition = function getMousePosition(e) {
                var mouseObj = e;
                if ('changedTouches' in e && e.changedTouches) {
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
                clickEventName: 'ontouchstart' in document.documentElement ? "touchstart" : "click",
                theme: 'default',
                width: 300,
                height: 400,
                closeToEsc: true,
                disableDrag: false,
                disableResize: false,
                animateTime: 250,
                iframe: false
            };
            this.activeModal = null;
            this.watingModal = false;
            this.$ = {}; // UI inside of the jQuery object store

            cfg = this.config; // extended config copy cfg

            var onStateChanged = function onStateChanged(opts, that) {
                var eventProcessor = {
                    "resize": function resize(that) {
                        if (opts && opts.onResize) {
                            opts.onResize.call(that, that);
                        } else if (this.onResize) {
                            this.onResize.call(that, that);
                        }
                    },
                    "move": function move() {}
                };
                if (that.state in eventProcessor) {
                    eventProcessor[that.state].call(this, that);
                }

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
                    iframeLoadingMsg: opts.iframeLoadingMsg,
                    disableResize: opts.disableResize
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
                var that = void 0;
                jQuery(document.body).append(getContent.call(this, opts.id, opts));

                this.activeModal = jQuery('#' + opts.id);
                // 파트수집
                this.$ = {
                    "root": this.activeModal,
                    "header": this.activeModal.find('[data-modal-els="header"]'),
                    "body": this.activeModal.find('[data-modal-els="body"]')
                };

                if (opts.iframe) {
                    this.$["iframe-wrap"] = this.activeModal.find('[data-modal-els="iframe-wrap"]');
                    this.$["iframe"] = this.activeModal.find('[data-modal-els="iframe"]');
                    this.$["iframe-form"] = this.activeModal.find('[data-modal-els="iframe-form"]');
                    this.$["iframe-loading"] = this.activeModal.find('[data-modal-els="iframe-loading"]');
                } else {
                    this.$["body-frame"] = this.activeModal.find('[data-modal-els="body-frame"]');
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

                if (callback) callback.call(that, that);

                if (!this.watingModal) {
                    onStateChanged.call(this, opts, that);
                }

                // bind key event
                if (opts.closeToEsc) {
                    jQuery(window).bind("keydown.ax-modal", function (e) {
                        onkeyup.call(this, e || window.event);
                    }.bind(this));
                }

                jQuery(window).bind("resize.ax-modal", function (e) {
                    this.align(null, e || window.event);
                }.bind(this));

                this.$.header.off(ENM["mousedown"]).off("dragstart").on(ENM["mousedown"], function (e) {
                    /// 이벤트 필터링 추가 : 버튼엘리먼트로 부터 발생된 이벤트이면 moveModal 시작하지 않도록 필터링
                    var isButton = U.findParentNode(e.target, function (_target) {
                        if (_target.getAttribute("data-modal-header-btn")) {
                            return true;
                        }
                    });

                    if (!opts.isFullScreen && !isButton && opts.disableDrag != true) {
                        self.mousePosition = getMousePosition(e);
                        moveModal.on.call(self);
                    }
                    if (isButton) {
                        btnOnClick.call(self, e || window.event, opts);
                    }
                }).on("dragstart", function (e) {
                    U.stopEvent(e.originalEvent);
                    return false;
                });

                this.activeModal.off(ENM["mousedown"]).off("dragstart").on(ENM["mousedown"], "[data-ax5modal-resizer]", function (e) {
                    if (opts.disableDrag || opts.isFullScreen) return false;
                    self.mousePosition = getMousePosition(e);
                    resizeModal.on.call(self, this.getAttribute("data-ax5modal-resizer"));
                }).on("dragstart", function (e) {
                    U.stopEvent(e.originalEvent);
                    return false;
                });
            },
                btnOnClick = function btnOnClick(e, opts, callback, target, k) {
                var that = void 0;
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
                    var modalZIndex = this.activeModal.css("z-index"),
                        modalOffset = this.activeModal.position(),
                        modalBox = {
                        width: this.activeModal.outerWidth(), height: this.activeModal.outerHeight()
                    },
                        windowBox = {
                        width: jQuery(window).width(),
                        height: jQuery(window).height(),
                        scrollLeft: self.modalConfig.absolute ? 0 : jQuery(document).scrollLeft(),
                        scrollTop: self.modalConfig.absolute ? 0 : jQuery(document).scrollTop()
                    },
                        getResizerPosition = function getResizerPosition(e) {
                        self.__dx = e.clientX - self.mousePosition.clientX;
                        self.__dy = e.clientY - self.mousePosition.clientY;

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
                            left: modalOffset.left + self.__dx + windowBox.scrollLeft,
                            top: modalOffset.top + self.__dy + windowBox.scrollTop
                        };
                    };

                    var minX = 0,
                        maxX = windowBox.width - modalBox.width,
                        minY = 0,
                        maxY = windowBox.height - modalBox.height;

                    self.__dx = 0; // 변화량 X
                    self.__dy = 0; // 변화량 Y

                    // self.resizerBg : body 가 window보다 작을 때 문제 해결을 위한 DIV
                    self.resizerBg = jQuery('<div class="ax5modal-resizer-background" ondragstart="return false;"></div>');
                    self.resizer = jQuery('<div class="ax5modal-resizer" ondragstart="return false;"></div>');
                    self.resizerBg.css({ zIndex: modalZIndex });
                    self.resizer.css({
                        left: modalOffset.left + windowBox.scrollLeft,
                        top: modalOffset.top + windowBox.scrollTop,
                        width: modalBox.width,
                        height: modalBox.height,
                        zIndex: modalZIndex + 1
                    });

                    jQuery(document.body).append(self.resizerBg).append(self.resizer);
                    self.activeModal.addClass("draged");

                    jQuery(document.body).on(ENM["mousemove"] + ".ax5modal-move-" + this.instanceId, function (e) {
                        self.resizer.css(getResizerPosition(e));
                    }).on(ENM["mouseup"] + ".ax5modal-move-" + this.instanceId, function (e) {
                        moveModal.off.call(self);
                    }).on("mouseleave.ax5modal-move-" + this.instanceId, function (e) {
                        moveModal.off.call(self);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
                },
                "off": function off() {
                    var setModalPosition = function setModalPosition() {
                        var box = this.resizer.offset();
                        if (!this.modalConfig.absolute) {
                            box.left -= jQuery(document).scrollLeft();
                            box.top -= jQuery(document).scrollTop();
                        }
                        this.activeModal.css(box);
                        this.modalConfig.left = box.left;
                        this.modalConfig.top = box.top;

                        box = null;
                    };

                    this.activeModal.removeClass("draged");
                    setModalPosition.call(this);

                    this.resizer.remove();
                    this.resizer = null;
                    this.resizerBg.remove();
                    this.resizerBg = null;
                    //this.align();

                    jQuery(document.body).off(ENM["mousemove"] + ".ax5modal-move-" + this.instanceId).off(ENM["mouseup"] + ".ax5modal-move-" + this.instanceId).off("mouseleave.ax5modal-move-" + this.instanceId);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');

                    onStateChanged.call(this, self.modalConfig, {
                        self: this,
                        state: "move"
                    });
                }
            },
                resizeModal = {
                "on": function on(resizerType) {
                    var modalZIndex = this.activeModal.css("z-index"),
                        modalOffset = this.activeModal.position(),
                        modalBox = {
                        width: this.activeModal.outerWidth(), height: this.activeModal.outerHeight()
                    },
                        windowBox = {
                        width: jQuery(window).width(),
                        height: jQuery(window).height(),
                        scrollLeft: this.modalConfig.absolute ? 0 : jQuery(document).scrollLeft(),
                        scrollTop: this.modalConfig.absolute ? 0 : jQuery(document).scrollTop()
                    },
                        resizerProcessor = {
                        "top": function top(e) {

                            if (minHeight > modalBox.height - self.__dy) {
                                self.__dy = modalBox.height - minHeight;
                            }

                            if (e.shiftKey) {

                                if (minHeight > modalBox.height - self.__dy * 2) {
                                    self.__dy = (modalBox.height - minHeight) / 2;
                                }

                                return {
                                    left: modalOffset.left,
                                    top: modalOffset.top + self.__dy,
                                    width: modalBox.width,
                                    height: modalBox.height - self.__dy * 2
                                };
                            } else if (e.altKey) {

                                if (minHeight > modalBox.height - self.__dy * 2) {
                                    self.__dy = (modalBox.height - minHeight) / 2;
                                }

                                return {
                                    left: modalOffset.left + self.__dy,
                                    top: modalOffset.top + self.__dy,
                                    width: modalBox.width - self.__dy * 2,
                                    height: modalBox.height - self.__dy * 2
                                };
                            } else {
                                return {
                                    left: modalOffset.left,
                                    top: modalOffset.top + self.__dy,
                                    width: modalBox.width,
                                    height: modalBox.height - self.__dy
                                };
                            }
                        },
                        "bottom": function bottom(e) {

                            if (minHeight > modalBox.height + self.__dy) {
                                self.__dy = -modalBox.height + minHeight;
                            }

                            if (e.shiftKey) {

                                if (minHeight > modalBox.height + self.__dy * 2) {
                                    self.__dy = (-modalBox.height + minHeight) / 2;
                                }

                                return {
                                    left: modalOffset.left,
                                    top: modalOffset.top - self.__dy,
                                    width: modalBox.width,
                                    height: modalBox.height + self.__dy * 2
                                };
                            } else if (e.altKey) {

                                if (minHeight > modalBox.height + self.__dy * 2) {
                                    self.__dy = (-modalBox.height + minHeight) / 2;
                                }

                                return {
                                    left: modalOffset.left - self.__dy,
                                    top: modalOffset.top - self.__dy,
                                    width: modalBox.width + self.__dy * 2,
                                    height: modalBox.height + self.__dy * 2
                                };
                            } else {
                                return {
                                    left: modalOffset.left,
                                    top: modalOffset.top,
                                    width: modalBox.width,
                                    height: modalBox.height + self.__dy
                                };
                            }
                        },
                        "left": function left(e) {

                            if (minWidth > modalBox.width - self.__dx) {
                                self.__dx = modalBox.width - minWidth;
                            }

                            if (e.shiftKey) {

                                if (minWidth > modalBox.width - self.__dx * 2) {
                                    self.__dx = (modalBox.width - minWidth) / 2;
                                }

                                return {
                                    left: modalOffset.left + self.__dx,
                                    top: modalOffset.top,
                                    width: modalBox.width - self.__dx * 2,
                                    height: modalBox.height
                                };
                            } else if (e.altKey) {

                                if (minWidth > modalBox.width - self.__dx * 2) {
                                    self.__dx = (modalBox.width - minWidth) / 2;
                                }

                                return {
                                    left: modalOffset.left + self.__dx,
                                    top: modalOffset.top + self.__dx,
                                    width: modalBox.width - self.__dx * 2,
                                    height: modalBox.height - self.__dx * 2
                                };
                            } else {
                                return {
                                    left: modalOffset.left + self.__dx,
                                    top: modalOffset.top,
                                    width: modalBox.width - self.__dx,
                                    height: modalBox.height
                                };
                            }
                        },
                        "right": function right(e) {

                            if (minWidth > modalBox.width + self.__dx) {
                                self.__dx = -modalBox.width + minWidth;
                            }

                            if (e.shiftKey) {

                                if (minWidth > modalBox.width + self.__dx * 2) {
                                    self.__dx = (-modalBox.width + minWidth) / 2;
                                }

                                return {
                                    left: modalOffset.left - self.__dx,
                                    top: modalOffset.top,
                                    width: modalBox.width + self.__dx * 2,
                                    height: modalBox.height
                                };
                            } else if (e.altKey) {

                                if (minWidth > modalBox.width + self.__dx * 2) {
                                    self.__dx = (-modalBox.width + minWidth) / 2;
                                }

                                return {
                                    left: modalOffset.left - self.__dx,
                                    top: modalOffset.top - self.__dx,
                                    width: modalBox.width + self.__dx * 2,
                                    height: modalBox.height + self.__dx * 2
                                };
                            } else {
                                return {
                                    left: modalOffset.left,
                                    top: modalOffset.top,
                                    width: modalBox.width + self.__dx,
                                    height: modalBox.height
                                };
                            }
                        },
                        "top-left": function topLeft(e) {

                            if (minWidth > modalBox.width - self.__dx) {
                                self.__dx = modalBox.width - minWidth;
                            }

                            if (minHeight > modalBox.height - self.__dy) {
                                self.__dy = modalBox.height - minHeight;
                            }

                            if (e.shiftKey || e.altKey) {

                                if (minHeight > modalBox.height - self.__dy * 2) {
                                    self.__dy = (modalBox.height - minHeight) / 2;
                                }
                                if (minWidth > modalBox.width - self.__dx * 2) {
                                    self.__dx = (modalBox.width - minWidth) / 2;
                                }

                                return {
                                    left: modalOffset.left + self.__dx,
                                    top: modalOffset.top + self.__dy,
                                    width: modalBox.width - self.__dx * 2,
                                    height: modalBox.height - self.__dy * 2
                                };
                            } else {

                                if (minHeight > modalBox.height - self.__dy * 2) {
                                    self.__dy = (modalBox.height - minHeight) / 2;
                                }
                                if (minWidth > modalBox.width - self.__dx * 2) {
                                    self.__dx = (modalBox.width - minWidth) / 2;
                                }

                                return {
                                    left: modalOffset.left + self.__dx,
                                    top: modalOffset.top + self.__dy,
                                    width: modalBox.width - self.__dx,
                                    height: modalBox.height - self.__dy
                                };
                            }
                        },
                        "top-right": function topRight(e) {

                            if (minWidth > modalBox.width + self.__dx) {
                                self.__dx = -modalBox.width + minWidth;
                            }

                            if (minHeight > modalBox.height - self.__dy) {
                                self.__dy = modalBox.height - minHeight;
                            }

                            if (e.shiftKey || e.altKey) {

                                if (minHeight > modalBox.height - self.__dy * 2) {
                                    self.__dy = (modalBox.height - minHeight) / 2;
                                }
                                if (minWidth > modalBox.width + self.__dx * 2) {
                                    self.__dx = (-modalBox.width + minWidth) / 2;
                                }

                                return {
                                    left: modalOffset.left - self.__dx,
                                    top: modalOffset.top + self.__dy,
                                    width: modalBox.width + self.__dx * 2,
                                    height: modalBox.height - self.__dy * 2
                                };
                            } else {
                                return {
                                    left: modalOffset.left,
                                    top: modalOffset.top + self.__dy,
                                    width: modalBox.width + self.__dx,
                                    height: modalBox.height - self.__dy
                                };
                            }
                        },
                        "bottom-left": function bottomLeft(e) {

                            if (minWidth > modalBox.width - self.__dx) {
                                self.__dx = modalBox.width - minWidth;
                            }

                            if (minHeight > modalBox.height + self.__dy) {
                                self.__dy = -modalBox.height + minHeight;
                            }

                            if (e.shiftKey || e.altKey) {
                                if (minWidth > modalBox.width - self.__dx * 2) {
                                    self.__dx = (modalBox.width - minWidth) / 2;
                                }
                                if (minHeight > modalBox.height + self.__dy * 2) {
                                    self.__dy = (-modalBox.height + minHeight) / 2;
                                }
                                return {
                                    left: modalOffset.left + self.__dx,
                                    top: modalOffset.top - self.__dy,
                                    width: modalBox.width - self.__dx * 2,
                                    height: modalBox.height + self.__dy * 2
                                };
                            } else {
                                return {
                                    left: modalOffset.left + self.__dx,
                                    top: modalOffset.top,
                                    width: modalBox.width - self.__dx,
                                    height: modalBox.height + self.__dy
                                };
                            }
                        },
                        "bottom-right": function bottomRight(e) {

                            if (minWidth > modalBox.width + self.__dx) {
                                self.__dx = -modalBox.width + minWidth;
                            }

                            if (minHeight > modalBox.height + self.__dy) {
                                self.__dy = -modalBox.height + minHeight;
                            }

                            if (e.shiftKey || e.altKey) {
                                if (minWidth > modalBox.width + self.__dx * 2) {
                                    self.__dx = (-modalBox.width + minWidth) / 2;
                                }
                                if (minHeight > modalBox.height + self.__dy * 2) {
                                    self.__dy = (-modalBox.height + minHeight) / 2;
                                }
                                return {
                                    left: modalOffset.left - self.__dx,
                                    top: modalOffset.top - self.__dy,
                                    width: modalBox.width + self.__dx * 2,
                                    height: modalBox.height + self.__dy * 2
                                };
                            } else {
                                return {
                                    left: modalOffset.left,
                                    top: modalOffset.top,
                                    width: modalBox.width + self.__dx,
                                    height: modalBox.height + self.__dy
                                };
                            }
                        }
                    },
                        getResizerPosition = function getResizerPosition(e) {
                        self.__dx = e.clientX - self.mousePosition.clientX;
                        self.__dy = e.clientY - self.mousePosition.clientY;

                        return resizerProcessor[resizerType](e);
                    };

                    if (!this.modalConfig.absolute) {
                        modalOffset.left += windowBox.scrollLeft;
                        modalOffset.top += windowBox.scrollTop;
                    }

                    var minWidth = 100,
                        minHeight = 100;

                    var cursorType = {
                        "top": "row-resize",
                        "bottom": "row-resize",
                        "left": "col-resize",
                        "right": "col-resize",
                        "top-left": "nwse-resize",
                        "top-right": "nesw-resize",
                        "bottom-left": "nesw-resize",
                        "bottom-right": "nwse-resize"
                    };

                    self.__dx = 0; // 변화량 X
                    self.__dy = 0; // 변화량 Y

                    // self.resizerBg : body 가 window보다 작을 때 문제 해결을 위한 DIV
                    self.resizerBg = jQuery('<div class="ax5modal-resizer-background" ondragstart="return false;"></div>');
                    self.resizer = jQuery('<div class="ax5modal-resizer" ondragstart="return false;"></div>');
                    self.resizerBg.css({
                        zIndex: modalZIndex,
                        cursor: cursorType[resizerType]
                    });
                    self.resizer.css({
                        left: modalOffset.left,
                        top: modalOffset.top,
                        width: modalBox.width,
                        height: modalBox.height,
                        zIndex: modalZIndex + 1,
                        cursor: cursorType[resizerType]
                    });
                    jQuery(document.body).append(self.resizerBg).append(self.resizer);
                    self.activeModal.addClass("draged");

                    jQuery(document.body).bind(ENM["mousemove"] + ".ax5modal-resize-" + this.instanceId, function (e) {
                        self.resizer.css(getResizerPosition(e));
                    }).bind(ENM["mouseup"] + ".ax5modal-resize-" + this.instanceId, function (e) {
                        resizeModal.off.call(self);
                    }).bind("mouseleave.ax5modal-resize-" + this.instanceId, function (e) {
                        resizeModal.off.call(self);
                    });

                    jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').bind('selectstart', false);
                },
                "off": function off() {
                    var setModalPosition = function setModalPosition() {
                        var box = this.resizer.offset();
                        jQuery.extend(box, {
                            width: this.resizer.width(),
                            height: this.resizer.height()
                        });
                        if (!this.modalConfig.absolute) {
                            box.left -= jQuery(document).scrollLeft();
                            box.top -= jQuery(document).scrollTop();
                        }
                        this.activeModal.css(box);

                        this.modalConfig.left = box.left;
                        this.modalConfig.top = box.top;
                        this.modalConfig.width = box.width;
                        this.modalConfig.height = box.height;
                        this.$["body"].css({ height: box.height - this.modalConfig.headerHeight });
                        if (this.modalConfig.iframe) {
                            this.$["iframe-wrap"].css({ height: box.height - this.modalConfig.headerHeight });
                            this.$["iframe"].css({ height: box.height - this.modalConfig.headerHeight });
                        }

                        box = null;
                    };

                    this.activeModal.removeClass("draged");
                    setModalPosition.call(this);

                    this.resizer.remove();
                    this.resizer = null;
                    this.resizerBg.remove();
                    this.resizerBg = null;

                    onStateChanged.call(this, self.modalConfig, {
                        self: this,
                        state: "resize"
                    });

                    jQuery(document.body).unbind(ENM["mousemove"] + ".ax5modal-resize-" + this.instanceId).unbind(ENM["mouseup"] + ".ax5modal-resize-" + this.instanceId).unbind("mouseleave.ax5modal-resize-" + this.instanceId);

                    jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').unbind('selectstart');
                }
            };

            /// private end

            /**
             * Preferences of modal UI
             * @method ax5modal.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Number} [config.zIndex]
             * @param {Object} [config.position]
             * @param {String} [config.position.left="center"]
             * @param {String} [config.position.top="middle"]
             * @param {Number} [config.position.margin=10]
             * @param {String} [config.minimizePosition="bottom-right"]
             * @param {Number} [config.width=300]
             * @param {Number} [config.height=400]
             * @param {Boolean} [config.closeToEsc=true]
             * @param {Boolean} [config.absolute=false]
             * @param {Boolean} [config.disableDrag=false]
             * @param {Boolean} [config.disableResize=false]
             * @param {Number} [config.animateTime=250]
             * @param {Function} [config.fullScreen]
             * @param {Function} [config.onStateChanged] - `onStateChanged` function can be defined in setConfig method or new ax5.ui.modal initialization method. However, you can us to define an event function after initialization, if necessary
             * @param {Function} [config.onResize]
             * @returns {ax5modal}
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
             *     },
             *     onStateChanged: function(){
             *          console.log(this);
             *     },
             *     onResize: function(){
             *          console.log(this);
             *     }
             * });
             * ```
             */
            //== class body start
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onResize = cfg.onResize;
            };

            /**
             * open the modal
             * @method ax5modal.open
             * @returns {ax5modal}
             * @example
             * ```
             * modal.open();
             * modal.open({
             *  width: 500,
             *  height: 500
             * });
             * moaal.open({}, function(){
             *  console.log(this);
             * });
             * ```
             */
            this.open = function (opts, callback, tryCount) {
                if (typeof tryCount === "undefined") tryCount = 0;
                if (!this.activeModal) {
                    opts = self.modalConfig = jQuery.extend(true, {}, cfg, opts);
                    open.call(this, opts, callback);
                    this.watingModal = false;
                } else if (tryCount < 3) {
                    // 3번까지 재 시도
                    this.watingModal = true;
                    setTimeout(function () {
                        this.open(opts, callback, tryCount + 1);
                    }.bind(this), cfg.animateTime);
                } else {
                    // 열기 시도 종료
                    this.watingModal = false;
                }
                return this;
            };

            /**
             * close the modal
             * @method ax5modal.close
             * @param _option
             * @returns {ax5modal}
             * @example
             * ```
             * my_modal.close();
             * my_modal.close({callback: function(){
             *  // on close event
             * });
             * // close 함수에 callback을 전달하면 정확한 close 타이밍을 캐치할 수 있습니다
             * ```
             */

            this.close = function (_option) {
                var opts = void 0,
                    that = void 0;

                if (this.activeModal) {
                    opts = self.modalConfig;
                    this.activeModal.addClass("destroy");
                    jQuery(window).unbind("keydown.ax-modal");
                    jQuery(window).unbind("resize.ax-modal");

                    setTimeout(function () {
                        // 프레임 제거
                        if (opts.iframe) {
                            var $iframe = this.$["iframe"]; // iframe jQuery Object
                            if ($iframe) {
                                var iframeObject = $iframe.get(0),
                                    idoc = iframeObject.contentDocument ? iframeObject.contentDocument : iframeObject.contentWindow.document;

                                try {
                                    $(idoc.body).children().each(function () {
                                        $(this).remove();
                                    });
                                } catch (e) {}
                                idoc.innerHTML = "";
                                $iframe.attr('src', 'about:blank').remove();

                                // force garbarge collection for IE only
                                window.CollectGarbage && window.CollectGarbage();
                            }
                        }

                        this.activeModal.remove();
                        this.activeModal = null;

                        // 모달 오픈 대기중이면 닫기 상태 전달 안함.
                        if (!this.watingModal) {
                            onStateChanged.call(this, opts, {
                                self: this,
                                state: "close"
                            });
                        }

                        if (_option && U.isFunction(_option.callback)) {
                            that = {
                                self: this,
                                id: opts.id,
                                theme: opts.theme,
                                width: opts.width,
                                height: opts.height,
                                state: "close",
                                $: this.$
                            };
                            _option.callback.call(that, that);
                        }
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
             * @method ax5modal.restore
             * @returns {ax5modal}
             */
            this.restore = function () {
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
                    if (typeof css.width !== "undefined") {
                        self.modalConfig.width = css.width;
                    }
                    if (typeof css.height !== "undefined") {
                        self.modalConfig.height = css.height;
                    }

                    this.align();
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
             * @example
             * ```js
             * modal.align({left:"center", top:"middle"});
             * modal.align({left:"left", top:"top", margin: 20});
             * ```
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
                        if (opts.header) {
                            opts.headerHeight = this.$.header.outerHeight();
                            box.height += opts.headerHeight;
                        } else {
                            opts.headerHeight = 0;
                        }
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
                    this.$["body"].css({ height: box.height - (opts.headerHeight || 0) });

                    if (opts.iframe) {
                        this.$["iframe-wrap"].css({ height: box.height - opts.headerHeight });
                        this.$["iframe"].css({ height: box.height - opts.headerHeight });
                    } else {}
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
    }());

    MODAL = ax5.ui.modal;
})();

// ax5.ui.modal.tmpl
(function () {
    var MODAL = ax5.ui.modal;

    var content = function content() {
        return " \n        <div id=\"{{modalId}}\" data-modal-els=\"root\" class=\"ax5modal {{theme}} {{fullscreen}}\" style=\"{{styles}}\">\n            {{#header}}\n            <div class=\"ax-modal-header\" data-modal-els=\"header\">\n                {{{title}}}\n                {{#btns}}\n                    <div class=\"ax-modal-header-addon\">\n                    {{#@each}}\n                    <button tabindex=\"-1\" data-modal-header-btn=\"{{@key}}\" class=\"{{@value.theme}}\">{{{@value.label}}}</button>\n                    {{/@each}}\n                    </div>\n                {{/btns}}\n            </div>\n            {{/header}}\n            <div class=\"ax-modal-body\" data-modal-els=\"body\">\n            {{#iframe}}\n                <div data-modal-els=\"iframe-wrap\" style=\"-webkit-overflow-scrolling: touch; overflow: auto;position: relative;\">\n                    <table data-modal-els=\"iframe-loading\" style=\"width:100%;height:100%;\"><tr><td style=\"text-align: center;vertical-align: middle\">{{{iframeLoadingMsg}}}</td></tr></table>\n                    <iframe name=\"{{modalId}}-frame\" src=\"\" width=\"100%\" height=\"100%\" frameborder=\"0\" data-modal-els=\"iframe\" style=\"position: absolute;left:0;top:0;\"></iframe>\n                </div>\n                <form name=\"{{modalId}}-form\" data-modal-els=\"iframe-form\">\n                <input type=\"hidden\" name=\"modalId\" value=\"{{modalId}}\" />\n                {{#param}}\n                {{#@each}}\n                <input type=\"hidden\" name=\"{{@key}}\" value=\"{{@value}}\" />\n                {{/@each}}\n                {{/param}}\n                </form>\n            {{/iframe}}\n            {{^iframe}}\n                <div data-modal-els=\"body-frame\" style=\"position: absolute;left:0;top:0;width:100%;height:100%;\"></div>\n            {{/iframe}}\n            </div>\n            {{^disableResize}}\n            <div data-ax5modal-resizer=\"top\"></div>\n            <div data-ax5modal-resizer=\"right\"></div>\n            <div data-ax5modal-resizer=\"bottom\"></div>\n            <div data-ax5modal-resizer=\"left\"></div>\n            <div data-ax5modal-resizer=\"top-left\"></div>\n            <div data-ax5modal-resizer=\"top-right\"></div>\n            <div data-ax5modal-resizer=\"bottom-left\"></div>\n            <div data-ax5modal-resizer=\"bottom-right\"></div>\n            {{/disableResize}}\n        </div>\n        ";
    };

    MODAL.tmpl = {
        "content": content,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(MODAL.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();