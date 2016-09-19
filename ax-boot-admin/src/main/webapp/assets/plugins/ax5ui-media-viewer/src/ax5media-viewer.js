// ax5.ui.media-viewer
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "mediaViewer",
        version: "0.4.3"
    }, (function () {
        /**
         * @class ax5mediaViewer
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myViewer = new ax5.ui.mediaViewer();
         * ```
         */
        var ax5mediaViewer = function () {
            var self = this,
                cfg,
                ENM = {
                    "mousedown": (ax5.info.supportTouch) ? "touchstart" : "mousedown",
                    "mousemove": (ax5.info.supportTouch) ? "touchmove" : "mousemove",
                    "mouseup": (ax5.info.supportTouch) ? "touchend" : "mouseup"
                },
                getMousePosition = function (e) {
                    var mouseObj = ('changedTouches' in e.originalEvent) ? e.originalEvent.changedTouches[0] : e;

                    return {
                        clientX: mouseObj.clientX,
                        clientY: mouseObj.clientY,
                        time: (new Date()).getTime()
                    }
                };

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default',
                animateTime: 250,

                columnKeys: {
                    src: 'src',
                    poster: 'poster',
                    html: 'html'
                },
                loading: {
                    icon: '',
                    text: 'Now Loading'
                },
                viewer: {
                    prevHandle: false,
                    nextHandle: false,
                    ratio: 16 / 9
                },
                media: {
                    prevHandle: '<',
                    nextHandle: '>',
                    width: 36, height: 36,
                    list: []
                }
            };
            this.queue = [];
            this.openTimer = null;
            this.closeTimer = null;
            this.selectedIndex = 0;
            this.mousePosition = {};

            cfg = this.config;

            var
                onStateChanged = function (opts, that) {
                    if (opts && opts.onStateChanged) {
                        opts.onStateChanged.call(that, that);
                    }
                    else if (this.onStateChanged) {
                        this.onStateChanged.call(that, that);
                    }
                    return true;
                },
                getFrameTmpl = function (columnKeys) {
                    return `
                    <div data-ax5-ui-media-viewer="{{id}}" class="{{theme}}">
                        <div data-media-viewer-els="viewer-holder">
                        <div data-media-viewer-els="viewer"></div>
                        </div>
                        <div data-media-viewer-els="viewer-loading">
                        <div class="ax5-ui-media-viewer-loading-holder">
                        <div class="ax5-ui-media-viewer-loading-cell">
                        {{{loading.icon}}}
                    {{{loading.text}}}
                    </div>
                    </div>
                    </div>
                    {{#media}}
                    <div data-media-viewer-els="media-list-holder">
                        <div data-media-viewer-els="media-list-prev-handle">{{{prevHandle}}}</div>
                    <div data-media-viewer-els="media-list">
                        <div data-media-viewer-els="media-list-table">
                        {{#list}}
                    <div data-media-viewer-els="media-list-table-td">
                        {{#image}}
                    <div data-media-thumbnail="{{@i}}">
                        <img src="{{${columnKeys.poster}}}" data-media-thumbnail-image="{{@i}}" />
                        </div>
                        {{/image}}
                    {{#video}}
                    <div data-media-thumbnail="{{@i}}">{{#${columnKeys.poster}}}<img src="{{.}}" data-media-thumbnail-video="{{@i}}" />>{{/${columnKeys.poster}}}{{^${columnKeys.poster}}}<a data-media-thumbnail-video="{{@i}}">{{{media.${columnKeys.poster}}}}</a>{{/${columnKeys.poster}}}</div>
                    {{/video}}
                    </div>
                        {{/list}}
                    </div>
                        </div>
                        <div data-media-viewer-els="media-list-next-handle">{{{nextHandle}}}</div>
                        </div>
                        {{/media}}
                    </div>
                        `;
                },
                getFrame = function () {
                    var
                        data = jQuery.extend(true, {}, cfg),
                        tmpl = getFrameTmpl(cfg.columnKeys);

                    data.id = this.id;

                    try {
                        return ax5.mustache.render(tmpl, data);
                    }
                    finally {
                        data = null;
                        tmpl = null;
                    }
                },
                onClick = function (e, target) {
                    var
                        result,
                        elementType = "",
                        processor = {
                            'thumbnail': function (target) {
                                this.select(target.getAttribute("data-media-thumbnail"));
                            },
                            'prev': function (target) {
                                if (this.selectedIndex > 0) {
                                    this.select(this.selectedIndex - 1);
                                } else {
                                    this.select(cfg.media.list.length - 1);
                                }
                            },
                            'next': function (target) {
                                if (this.selectedIndex < cfg.media.list.length - 1) {
                                    this.select(this.selectedIndex + 1);
                                } else {
                                    this.select(0);
                                }
                            },
                            'viewer': function (target) {
                                if (self.onClick) {
                                    self.onClick.call({
                                        media: cfg.media.list[this.selectedIndex]
                                    });
                                }
                            }
                        };

                    target = U.findParentNode(e.target, function (target) {
                        if (target.getAttribute("data-media-thumbnail")) {
                            elementType = "thumbnail";
                            return true;
                        }
                        else if (target.getAttribute("data-media-viewer-els") == "media-list-prev-handle") {
                            elementType = "prev";
                            return true;
                        }
                        else if (target.getAttribute("data-media-viewer-els") == "media-list-next-handle") {
                            elementType = "next";
                            return true;
                        }
                        else if (target.getAttribute("data-media-viewer-els") == "viewer") {
                            elementType = "viewer";
                            return true;
                        }
                        else if (self.target.get(0) == target) {
                            return true;
                        }
                    });

                    if (target) {
                        for (var key in processor) {
                            if (key == elementType) {
                                result = processor[key].call(this, target);
                                break;
                            }
                        }
                        return this;
                    }
                    return this;
                },
                getSelectedIndex = function () {
                    if (cfg.media && cfg.media.list && cfg.media.list.length > 0) {
                        var i = cfg.media.list.length, selecteIndex = 0;
                        while (i--) {
                            if (cfg.media.list[i].selected) {
                                selecteIndex = i;
                                break;
                            }
                        }

                        if (selecteIndex == 0) {
                            cfg.media.list[0].selected = true;
                        }
                        try {
                            return selecteIndex;
                        } finally {
                            i = null;
                            selecteIndex = null;
                        }
                    }
                    else {
                        return;
                    }
                },
                alignMediaList = function () {
                    var thumbnail = this.$["list"].find('[data-media-thumbnail=' + this.selectedIndex + ']'),
                        pos = thumbnail.position(), thumbnailWidth = thumbnail.outerWidth(),
                        containerWidth = this.$["list"].outerWidth(),
                        parentLeft = this.$["list-table"].position().left,
                        parentWidth = this.$["list-table"].outerWidth(),
                        newLeft = 0;

                    if (pos.left + thumbnailWidth + parentLeft > containerWidth) {
                        newLeft = containerWidth - (pos.left + thumbnailWidth);
                        if (parentLeft != newLeft) this.$["list-table"].css({left: parentLeft = newLeft});
                    }
                    else if (pos.left + parentLeft < 0) {
                        newLeft = pos.left;
                        if (newLeft > 0) newLeft = 0;
                        if (parentLeft != newLeft) this.$["list-table"].css({left: parentLeft = newLeft});
                    }

                    if (parentLeft != newLeft) {
                        if (parentLeft + parentWidth < containerWidth) {
                            newLeft = containerWidth - parentWidth;
                            if (newLeft > 0) newLeft = 0;
                            this.$["list-table"].css({left: newLeft});
                        }
                    }

                    thumbnail = null;
                    pos = null;
                    thumbnailWidth = null;
                    containerWidth = null;
                    parentLeft = null;
                    newLeft = null;
                },
                swipeMedia = {
                    "on": function (mousePosition) {
                        // console.log(mousePosition);
                        var getSwipePosition = function (e) {
                            var mouseObj = e;
                            if ('changedTouches' in e.originalEvent) {
                                mouseObj = e.originalEvent.changedTouches[0];
                            }

                            mousePosition.__dx = mouseObj.clientX - mousePosition.clientX;
                            mousePosition.__dy = mouseObj.clientY - mousePosition.clientY;
                            mousePosition.__time = (new Date()).getTime();

                            if (Math.abs(mousePosition.__dx) > Math.abs(mousePosition.__dy)) {
                                return {left: mousePosition.__dx};
                            } else {
                                return {top: mousePosition.__dy};
                            }
                        };
                        var viewerWidth = this.$["viewer"].width();

                        jQuery(document.body)
                            .bind(ENM["mousemove"] + ".ax5media-viewer-" + this.instanceId, function (e) {
                                var position = getSwipePosition(e);

                                if ('left' in position) {
                                    self.$["viewer-holder"].css(position);
                                    if (Math.abs(self.mousePosition.__dx) > viewerWidth / 3) {
                                        //console.log(self.mousePosition);
                                        // trigger nextMedia

                                        var nextIndex = 0;

                                        if (self.mousePosition.__dx > 0) {
                                            if (self.selectedIndex > 0) {
                                                nextIndex = self.selectedIndex - 1;
                                            } else {
                                                nextIndex = cfg.media.list.length - 1;
                                            }
                                        }
                                        else {
                                            if (self.selectedIndex < cfg.media.list.length - 1) {
                                                nextIndex = self.selectedIndex + 1;
                                            }
                                        }

                                        self.select(nextIndex);
                                        swipeMedia.off.call(self);


                                    }

                                    U.stopEvent(e);
                                }
                            })
                            .bind(ENM["mouseup"] + ".ax5media-viewer-" + this.instanceId, function (e) {
                                swipeMedia.off.call(self);
                            })
                            .bind("mouseleave.ax5media-viewer-" + this.instanceId, function (e) {
                                swipeMedia.off.call(self);
                            });

                        jQuery(document.body)
                            .attr('unselectable', 'on')
                            .css('user-select', 'none')
                            .on('selectstart', false);

                    },
                    "off": function () {
                        self.$["viewer-holder"].css({left: 0});
                        jQuery(document.body)
                            .unbind(ENM["mousemove"] + ".ax5media-viewer-" + this.instanceId)
                            .unbind(ENM["mouseup"] + ".ax5media-viewer-" + this.instanceId)
                            .unbind("mouseleave.ax5media-viewer-" + this.instanceId);

                        jQuery(document.body)
                            .removeAttr('unselectable')
                            .css('user-select', 'auto')
                            .off('selectstart');

                    }
                };
            /// private end

            /**
             * Preferences of mediaViewer UI
             * @method ax5mediaViewer.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5mediaViewer}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                this.id = 'ax5-media-viewer-' + ax5.getGuid();
                if (cfg.target && (cfg.media && cfg.media.list && cfg.media.list.length > 0)) {
                    this.attach(cfg.target);
                }
            };

            /**
             * @method ax5mediaViewer.attach
             * @param target
             * @param options
             * @returns {ax5mediaViewer}
             */
            this.attach = function (target, options) {
                if (!target) {
                    console.log(ax5.info.getError("ax5mediaViewer", "401", "setConfig"));
                }
                if (typeof options != "undefined") {
                    this.setConfig(options, false);
                }
                this.target = jQuery(target);
                this.target.html(getFrame.call(this));

                // 파트수집
                this.$ = {
                    "root": this.target.find('[data-ax5-ui-media-viewer]'),
                    "viewer-holder": this.target.find('[data-media-viewer-els="viewer-holder"]'),
                    "viewer": this.target.find('[data-media-viewer-els="viewer"]'),
                    "viewer-loading": this.target.find('[data-media-viewer-els="viewer-loading"]'),
                    "list-holder": this.target.find('[data-media-viewer-els="media-list-holder"]'),
                    "list-prev-handle": this.target.find('[data-media-viewer-els="media-list-prev-handle"]'),
                    "list": this.target.find('[data-media-viewer-els="media-list"]'),
                    "list-table": this.target.find('[data-media-viewer-els="media-list-table"]'),
                    "list-next-handle": this.target.find('[data-media-viewer-els="media-list-next-handle"]')
                };

                this.align();

                jQuery(window).unbind("resize.ax5media-viewer-" + this.id).bind("resize.ax5media-viewer-" + this.id, (function () {
                    this.align();
                    alignMediaList.call(this);
                }).bind(this));

                this.target.unbind("click").bind("click", (function (e) {
                    e = e || window.event;
                    onClick.call(this, e);
                    U.stopEvent(e);
                }).bind(this));

                this.$.viewer
                    .unbind(ENM["mousedown"])
                    .bind(ENM["mousedown"], (function (e) {
                        this.mousePosition = getMousePosition(e);
                        swipeMedia.on.call(this, this.mousePosition);
                    }).bind(this))
                    .unbind("dragstart")
                    .bind("dragstart", function (e) {
                        U.stopEvent(e);
                        return false;
                    });

                this.select(getSelectedIndex.call(this));
                return this;
            };

            /**
             * @method ax5mediaViewer.align
             * @returns {ax5mediaViewer}
             */
            this.align = function () {
                // viewer width, height
                this.$["viewer-holder"].css({height: this.$["viewer"].width() / cfg.viewer.ratio});
                this.$["viewer"].css({height: this.$["viewer"].width() / cfg.viewer.ratio});

                if (this.$["viewer"].data("media-type") == "image") {
                    var $img = this.$["viewer"].find("img");
                    $img.css({
                        width: this.$["viewer"].height() * this.$["viewer"].data("img-ratio"), height: this.$["viewer"].height()
                    });
                    setTimeout((function (_img) {
                        _img.css({left: (this.$["viewer"].width() - _img.width()) / 2});
                    }).bind(this, $img), 1);
                }
                else if (this.$["viewer"].data("media-type") == "video") {
                    this.$["viewer"].find("iframe").css({width: this.$["viewer"].height() * this.$["viewer"].data("img-ratio"), height: this.$["viewer"].height()});
                }
                this.$["viewer-loading"].css({height: this.$["viewer"].height()});

                var mediaThumbnailWidth = (U.right(cfg.media.width, 1) == '%') ? U.number(cfg.media.width) / 100 * this.$["viewer"].width() : U.number(cfg.media.width),
                    mediaThumbnailHeight = (U.right(cfg.media.height, 1) == '%') ? U.number(cfg.media.height) / 100 * this.$["viewer"].width() : U.number(cfg.media.height);

                mediaThumbnailWidth = Math.floor(mediaThumbnailWidth);
                mediaThumbnailHeight = Math.floor(mediaThumbnailHeight);

                this.$["list-prev-handle"].css({width: mediaThumbnailWidth * 1.5});
                this.$["list-next-handle"].css({width: mediaThumbnailWidth * 1.5});
                this.$["list"].css({height: mediaThumbnailHeight});
                this.$["list-table"].find('[data-media-thumbnail]').css({width: mediaThumbnailWidth, height: mediaThumbnailHeight});
                this.$["list-table"].find('[data-media-thumbnail-video]').css({width: mediaThumbnailWidth, height: mediaThumbnailHeight});


                return this;
            };

            /**
             * @method ax5mediaViewer.select
             * @param index
             * @returns {ax5mediaViewer}
             */
            this.select = (function () {
                var mediaView = {
                    image: function (obj, callBack) {
                        self.$["viewer-loading"].show();
                        var dim = [this.$["viewer"].width(), this.$["viewer"].height()];
                        var img = new Image();
                        img.src = obj.image[cfg.columnKeys.src];
                        img.onload = function () {
                            self.$["viewer-loading"].fadeOut();
                            var h = dim[1];
                            var w = h * img.width / img.height;
                            callBack(img, Math.floor(w), h);
                        };
                        return img;
                    },
                    video: function (obj, callBack) {
                        self.$["viewer-loading"].show();
                        var dim = [this.$["viewer"].width(), this.$["viewer"].height()];
                        var html = jQuery(obj.video[cfg.columnKeys.html]);
                        callBack(html, dim[0], dim[1]);
                        self.$["viewer-loading"].fadeOut();
                    }
                };
                var onLoad = {
                    image: function (img, w, h) {
                        img.width = w;
                        img.height = h;

                        var $img = $(img);
                        this.$["viewer"].html($img);
                        $img.css({left: (this.$["viewer"].width() - w) / 2});

                        this.$["viewer"].data("media-type", "image");
                        this.$["viewer"].data("img-ratio", w / h);
                    },
                    video: function (html, w, h) {
                        html.css({width: w, height: h});
                        this.$["viewer"].html(html);
                        this.$["viewer"].data("media-type", "video");
                        this.$["viewer"].data("img-ratio", w / h);
                    }
                };
                var select = function (index) {
                    this.$["list"].find('[data-media-thumbnail]').removeClass("selected");
                    this.$["list"].find('[data-media-thumbnail=' + index + ']').addClass("selected");
                    alignMediaList.call(this);
                };

                return function (index) {
                    if (typeof index === "undefined") return this;
                    this.selectedIndex = Number(index);
                    var media = cfg.media.list[index];
                    select.call(this, index);

                    for (var key in mediaView) {
                        if (media[key]) {
                            mediaView[key].call(this, media, onLoad[key].bind(this));
                            break;
                        }
                    }
                    return this;
                };
            })();

            /**
             * @method ax5mediaViewer.setMediaList
             * @param list
             * @returns {ax5mediaViewer}
             */
            this.setMediaList = function (list) {
                cfg.media.list = [].concat(list);
                this.attach(cfg.target);
                return this;
            };

            // 클래스 생성자
            this.main = (function () {

                UI.mediaViewer_instance = UI.mediaViewer_instance || [];
                UI.mediaViewer_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
                else {
                    this.init();
                }
            }).apply(this, arguments);
        };
        return ax5mediaViewer;
    })());

})();