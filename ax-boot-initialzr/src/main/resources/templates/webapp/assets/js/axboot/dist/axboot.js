"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * axboot 오브젝트 axboot 애플리케이션을 편리하게 사용하기 위한 오브젝트 입니다.
 * @var {Object} axboot
 */
var axboot = {};

/**
 * axboot의 환경 변수 저장 공간
 * @type {Object} axboot.def
 * @example
 * ```js
 * axboot.def.menuHeight = 20;
 * // 와 같이 원하는 속성을 저장 / 사용 할 수 있다.
 * ```
 */
axboot.def = {
    "pageFunctionName": "fnObj",
    "iframeLoadingMsg": '<i class="cqc-chequer ax-loading-icon lg"></i>',
    "dialogTitle": "CHEQUER"
};

/**
 * document ready 상태가 되었을 때 실행됩니다. 애플리케이션 초기화를 담당합니다.
 * @method axboot.init
 */
axboot.init = function () {
    axboot.pageAutoHeight.init();
    axboot.pageAutoHeight.align();

    setTimeout(function () {
        $('[data-ax5layout]').ax5layout({
            splitter: {
                size: 6
            },
            autoResize: false,
            onStateChanged: function onStateChanged() {},
            onResize: function onResize() {
                axboot.layoutResize();
            },
            onOpenTab: function onOpenTab() {
                var activeTabPanel = this.activePanel.$target.get(0);

                this.activePanel.$target.find('[data-fit-height-content]').each(function () {
                    var $this = $(this);
                    var _pHeight = $this.offsetParent().height();
                    var name = this.getAttribute("data-fit-height-content");
                    var _asideHeight = 0;
                    $('[data-fit-height-aside="' + name + '"]').each(function () {
                        _asideHeight += $(this).outerHeight();
                    });
                    $this.css({ height: _pHeight - _asideHeight });
                });

                if (ax5.ui.grid_instance) {
                    for (var gi = 0, gl = ax5.ui.grid_instance.length; gi < gl; gi++) {
                        var target = ax5.util.findParentNode(ax5.ui.grid_instance[gi].$target.get(0), function (_el) {
                            return activeTabPanel == _el;
                        });
                        if (target) {
                            ax5.ui.grid_instance[gi].setHeight(ax5.ui.grid_instance[gi].$target.height());
                        }
                    }
                }
            }
        }); // 레이아웃 플러그인 실행

        if (typeof parent.COMMON_CODE === "undefined" && window.SCRIPT_SESSION && SCRIPT_SESSION.login) {
            // API : /api/v1/commonCodes/getAllByMap
            axboot.ajax({
                url: "/api/v1/commonCodes/getAllByMap",
                callback: function callback(res) {
                    parent.COMMON_CODE = axboot.convertCode(res);
                    axboot.pageStart();
                },
                options: { nomask: true }
            });
        } else {
            parent.COMMON_CODE = axboot.convertCode(parent.COMMON_CODE);
            axboot.pageStart();
        }

        var debounceFn = ax5.util.debounce(function (val) {
            axboot.pageResize();
            axboot.pageAutoHeight.align();
            $('[data-ax5layout]').ax5layout("reset");
        }, 20);

        $(window).resize(function () {
            debounceFn();
        });
        $(document.body).on("click", function () {
            if (window.parent != window) {
                $(parent.document.body).trigger("click");
            }
        });
    });
};

/**
 * axboot.def.pageFunctionName의 pageStart를 실행해 줍니다.
 * @method axboot.pageStart
 *
 */
axboot.pageStart = function () {
    if (window[axboot.def.pageFunctionName] && window[axboot.def.pageFunctionName].pageStart) {
        // 프레임 셋에 타이머 초기화.
        if (top.fnObj && top.fnObj.activityTimerView) {
            top.fnObj.activityTimerView.update();
        }
        window[axboot.def.pageFunctionName].pageStart();
    }
};
/**
 * axboot.def.pageFunctionName의 pageResize를 실행해 줍니다.
 * @method axboot.pageResize
 */
axboot.pageResize = function () {
    if (window[axboot.def.pageFunctionName] && window[axboot.def.pageFunctionName].pageResize) {
        window[axboot.def.pageFunctionName].pageResize();
    }
};

/**
 * 페이지내부에 선언된 ax5layout안에 UI들에 강제 resize이벤트 발생시켜 줌.
 * @method axboot.layoutResize
 */
axboot.layoutResize = function (_delay) {

    $('[data-fit-height-content]').each(function () {
        var $this = $(this);
        var _pHeight = $this.offsetParent().height();
        var name = this.getAttribute("data-fit-height-content");
        var _asideHeight = 0;
        $('[data-fit-height-aside="' + name + '"]').each(function () {
            _asideHeight += $(this).outerHeight();
        });
        $this.css({ height: _pHeight - _asideHeight });
    });

    function fn() {
        if (ax5.ui.grid_instance) {
            var gi = ax5.ui.grid_instance.length;
            while (gi--) {
                ax5.ui.grid_instance[gi].setHeight(ax5.ui.grid_instance[gi].$target.height());
            }
        }
        if (ax5.ui.mask_instance) {
            var mi = ax5.ui.mask_instance.length;
            while (mi--) {
                ax5.ui.mask_instance[mi].align();
            }
        }
        if (ax5.ui.autocomplete_instance) {
            ax5.ui.autocomplete_instance.align();
        }
        if (ax5.ui.combobox_instance) {
            ax5.ui.combobox_instance.align();
        }
    }
    if (_delay) {
        setTimeout(function () {
            fn();
        }, _delay);
    } else {
        fn();
    }
};

/**
 * 페이지안에 [role="page-content"] 과 그 외의 부분의 높이를 계산하여 페이지 안에 컨텐츠의 높이들을 꽉 차게 해줍니다.
 * @Object {Object} axboot.pageAutoHeight
 */
axboot.pageAutoHeight = {
    /**
     * @method axboot.pageAutoHeight.init
     */
    init: function init() {
        this.active = $(document.body).attr("data-page-auto-height");
    },
    /**
     * @method axboot.pageAutoHeight.align
     */
    align: function align() {
        if (!this.active) return false;
        // page-content-auto-height
        (function () {
            var winHeight = $(window).height();
            var minusHeight = 0;
            $('[role^="page-"]').each(function () {
                var sectionName = this.getAttribute("role");
                if (sectionName != "page-content") {
                    minusHeight += $(this).outerHeight();
                }
            });
            var contentHeight = winHeight - minusHeight - 10;
            $('[role="page-content"]').css({ height: contentHeight });
        })();
    }
};

///// ~~~~~~~~~~~~~~~~~~~~~~
$(document.body).ready(function () {
    axboot.preparePlugin.pageStart();
    axboot.init();

    document.createElement("lang");
});

window.onError = function () {
    window.CollectGarbage && window.CollectGarbage();
};

window.onUnload = function () {
    window.CollectGarbage && window.CollectGarbage();
};
/**
 * @method axboot.ajax
 * @param {Object} http
 * @param {String} http.type
 * @param {String} http.url
 * @param {Object|String} http.data
 * @param {Function} http.callback
 * @param {Function} http.onError
 * @param {Function} http.always
 * @param {Object} [http.options]
 * @param {Boolean} [http.options.nomask = false]
 * @param {Function} [http.options.onError]
 * @param {String} [http.options.contentType]
 * @param {String} [http.options.apiType]
 * @example
 * ```js
 *  // 기본 에러가 나면 알어서 처리 함.
 *  axboot.ajax({
 *      type: "GET",
 *      url: "/api/v1/users",
 *      data : {},
 *      callback: function(response){
 *          // do something
 *      }
 *  });
 *
 *  // onError 지정
 *  axboot.ajax({
 *      type: "GET",
 *      url: "/api/v1/users",
 *      data : {},
 *      callback: function(response){
 *          // do something
 *      },
 *      options: {
 *          onError: function(err){
 *              // console.log(err);
 *          }
 *      }
 *  });
 * ```
 */

axboot.ajax = function () {

    var queue = [];
    var defaultOption = {
        apiType: "",
        contentType: 'application/json; charset=UTF-8'
    };

    return function (http) {
        var jqxhr, httpOpts, callback, onerror, always;
        var options = $.extend(true, {}, defaultOption, http.options);
        if (!options.nomask) axAJAXMask.open();

        httpOpts = {
            contentType: options.contentType
        };

        var url = "";

        if (ax5.util.isArray(http.url)) {
            if (http.url[0] in axboot.def["API"]) {
                http.url[0] = axboot.def["API"][http.url[0]];
                http.url = CONTEXT_PATH + http.url.join('/');
            } else {
                http.url = CONTEXT_PATH + http.url.join('/');
            }
        } else {
            http.url = CONTEXT_PATH + http.url;
        }

        if (http.single) {
            var keepGoing = true;
            queue.forEach(function (n) {
                if (n.k === http.type + "~" + http.url) {
                    keepGoing = false;
                }
            });
            if (!keepGoing) return false;
        }

        queue.push({ k: http.type + "~" + http.url });

        $.extend(http, httpOpts);

        callback = http.callback;
        always = http.always;
        onerror = http.onError || options.onError;

        jqxhr = $.ajax(http);
        jqxhr.done(function (data, textStatus, jqXHR) {
            if (typeof data == "string") {
                arguments[0] = data = data == "" ? {} : JSON.parse(data);
            }

            if (data.redirect && options.apiType != "login") {
                location.href = data.redirect;
                return;
            }

            if (data.error) {
                if (onerror) {
                    onerror(data.error);
                } else {
                    alert(data.error.message);
                    if (data.error.requiredKey) {
                        $('[data-ax-path="' + data.error.requiredKey + '"]').focus();
                    }
                }
            } else {
                var args = [].concat($.makeArray(arguments));
                if (callback) callback.apply(this, args); // callback
            }
        }).fail(function (data, textStatus, msg) {
            if (msg == "") {} else {
                if (onerror) onerror({ message: msg }); // callback
            }
        }).always(function (data, textStatus, jqXHR) {
            queue.pop();

            // 프레임 셋에 타이머 초기화.
            if (top.fnObj && top.fnObj.activityTimerView) {
                top.fnObj.activityTimerView.update();
            }

            if (always) always.apply(this, [data, textStatus, jqXHR]); // always
            if (!options.nomask) if (queue.length == 0) axAJAXMask.close(300);
        });
    };
}();
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop';
    var toggle = '[data-toggle="dropdown"]';
    var Dropdown = function Dropdown(element) {
        $(element).on('click.bs.dropdown', this.toggle);
    };

    Dropdown.VERSION = '3.3.7';

    function getParent($this) {
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        var $parent = selector && $(selector);

        return $parent && $parent.length ? $parent : $this.parent();
    }

    function clearMenus(e) {
        if (e && e.which === 3) return;
        $(backdrop).remove();
        $(toggle).each(function () {
            var $this = $(this);
            var $parent = getParent($this);
            var relatedTarget = { relatedTarget: this };

            if (!$parent.hasClass('open')) return;

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this.attr('aria-expanded', 'false');
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
        });
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this);

        if ($this.is('.disabled, :disabled')) return;

        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');

        clearMenus();

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
            }

            var relatedTarget = { relatedTarget: this };
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this.trigger('focus').attr('aria-expanded', 'true');

            $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
        }

        return false;
    };

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

        var $this = $(this);

        e.preventDefault();
        e.stopPropagation();

        if ($this.is('.disabled, :disabled')) return;

        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger('focus');
            return $this.trigger('click');
        }

        var desc = ' li:not(.disabled):visible a';
        var $items = $parent.find('.dropdown-menu' + desc);

        if (!$items.length) return;

        var index = $items.index(e.target);

        if (e.which == 38 && index > 0) index--; // up
        if (e.which == 40 && index < $items.length - 1) index++; // down
        if (!~index) index = 0;

        $items.eq(index).trigger('focus');
    };

    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.dropdown');

            if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
            if (typeof option == 'string') data[option].call($this);
        });
    }

    var old = $.fn.dropdown;

    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;

    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    };

    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
        e.stopPropagation();
    }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function Modal(element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$dialog = this.$element.find('.modal-dialog');
        this.$backdrop = null;
        this.isShown = null;
        this.originalBodyPad = null;
        this.scrollbarWidth = 0;
        this.ignoreBackdropClick = false;

        if (this.options.remote) {
            this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
                this.$element.trigger('loaded.bs.modal');
            }, this));
        }
    };

    Modal.VERSION = '3.3.7';

    Modal.TRANSITION_DURATION = 300;
    Modal.BACKDROP_TRANSITION_DURATION = 150;

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };

    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget);
    };

    Modal.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass('modal-open');

        this.escape();
        this.resize();

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

        this.$dialog.on('mousedown.dismiss.bs.modal', function () {
            that.$element.one('mouseup.dismiss.bs.modal', function (e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
            });
        });

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade');

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body); // don't move modals dom position
            }

            that.$element.show().scrollTop(0);

            that.adjustDialog();

            if (transition) {
                that.$element[0].offsetWidth; // force reflow
            }

            that.$element.addClass('in');

            that.enforceFocus();

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

            transition ? that.$dialog // wait for modal to slide in
            .one('bsTransitionEnd', function () {
                that.$element.trigger('focus').trigger(e);
            }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
        });
    };

    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault();

        e = $.Event('hide.bs.modal');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        this.escape();
        this.resize();

        $(document).off('focusin.bs.modal');

        this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

        this.$dialog.off('mousedown.dismiss.bs.modal');

        $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
    };

    Modal.prototype.enforceFocus = function () {
        $(document).off('focusin.bs.modal') // guard against infinite focus loop
        .on('focusin.bs.modal', $.proxy(function (e) {
            if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                this.$element.trigger('focus');
            }
        }, this));
    };

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide();
            }, this));
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal');
        }
    };

    Modal.prototype.resize = function () {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
        } else {
            $(window).off('resize.bs.modal');
        }
    };

    Modal.prototype.hideModal = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.$body.removeClass('modal-open');
            that.resetAdjustments();
            that.resetScrollbar();
            that.$element.trigger('hidden.bs.modal');
        });
    };

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };

    Modal.prototype.backdrop = function (callback) {
        var that = this;
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

            this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false;
                    return;
                }
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
            }, this));

            if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

            this.$backdrop.addClass('in');

            if (!callback) return;

            doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');

            var callbackRemove = function callbackRemove() {
                that.removeBackdrop();
                callback && callback();
            };
            $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
        } else if (callback) {
            callback();
        }
    };

    // these following methods are used to handle overflowing modals

    Modal.prototype.handleUpdate = function () {
        this.adjustDialog();
    };

    Modal.prototype.adjustDialog = function () {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        });
    };

    Modal.prototype.resetAdjustments = function () {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        });
    };

    Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) {
            // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        this.scrollbarWidth = this.measureScrollbar();
    };

    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || '';
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
    };

    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', this.originalBodyPad);
    };

    Modal.prototype.measureScrollbar = function () {
        // thx walsh
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };

    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.modal');
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === "undefined" ? "undefined" : _typeof(option)) == 'object' && option);

            if (!data) $this.data('bs.modal', data = new Modal(this, options));
            if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
        });
    }

    var old = $.fn.modal;

    $.fn.modal = Plugin;
    $.fn.modal.Constructor = Modal;

    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };

    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus');
            });
        });
        Plugin.call($target, option, this);
    });
}(jQuery);

+function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function Tooltip(element, options) {
        this.type = null;
        this.options = null;
        this.enabled = null;
        this.timeout = null;
        this.hoverState = null;
        this.$element = null;
        this.inState = null;

        this.init('tooltip', element, options);
    };

    Tooltip.VERSION = '3.3.7';

    Tooltip.TRANSITION_DURATION = 150;

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    };

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
        this.inState = { click: false, hover: false, focus: false };

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
        }

        var triggers = this.options.trigger.split(' ');

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }

        this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
    };

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS;
    };

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }

        return options;
    };

    Tooltip.prototype.getDelegateOptions = function () {
        var options = {};
        var defaults = this.getDefaults();

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value;
        });

        return options;
    };

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('bs.' + this.type, self);
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
        }

        if (self.tip().hasClass('in') || self.hoverState == 'in') {
            self.hoverState = 'in';
            return;
        }

        clearTimeout(self.timeout);

        self.hoverState = 'in';

        if (!self.options.delay || !self.options.delay.show) return self.show();

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show();
        }, self.options.delay.show);
    };

    Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true;
        }

        return false;
    };

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('bs.' + this.type, self);
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
        }

        if (self.isInStateTrue()) return;

        clearTimeout(self.timeout);

        self.hoverState = 'out';

        if (!self.options.delay || !self.options.delay.hide) return self.hide();

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide();
        }, self.options.delay.hide);
    };

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type);

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this;

            var $tip = this.tip();

            var tipId = this.getUID(this.type);

            this.setContent();
            $tip.attr('id', tipId);
            this.$element.attr('aria-describedby', tipId);

            if (this.options.animation) $tip.addClass('fade');

            var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

            $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
            this.$element.trigger('inserted.bs.' + this.type);

            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

            if (autoPlace) {
                var orgPlacement = placement;
                var viewportDim = this.getPosition(this.$viewport);

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

                $tip.removeClass(orgPlacement).addClass(placement);
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

            this.applyPlacement(calculatedOffset, placement);

            var complete = function complete() {
                var prevHoverState = that.hoverState;
                that.$element.trigger('shown.bs.' + that.type);
                that.hoverState = null;

                if (prevHoverState == 'out') that.leave(that);
            };

            $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
        }
    };

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip = this.tip();
        var width = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10);
        var marginLeft = parseInt($tip.css('margin-left'), 10);

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        offset.top += marginTop;
        offset.left += marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function using(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                });
            }
        }, offset), 0);

        $tip.addClass('in');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

        if (delta.left) offset.left += delta.left;else offset.top += delta.top;

        var isVertical = /top|bottom/.test(placement);
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
    };

    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
    };

    Tooltip.prototype.setContent = function () {
        var $tip = this.tip();
        var title = this.getTitle();

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
        $tip.removeClass('fade in top bottom left right');
    };

    Tooltip.prototype.hide = function (callback) {
        var that = this;
        var $tip = $(this.$tip);
        var e = $.Event('hide.bs.' + this.type);

        function complete() {
            if (that.hoverState != 'in') $tip.detach();
            if (that.$element) {
                // TODO: Check whether guarding this code with this `if` is really necessary.
                that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
            }
            callback && callback();
        }

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        $tip.removeClass('in');

        $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

        this.hoverState = null;

        return this;
    };

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element;
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
        }
    };

    Tooltip.prototype.hasContent = function () {
        return this.getTitle();
    };

    Tooltip.prototype.getPosition = function ($element) {
        $element = $element || this.$element;

        var el = $element[0];
        var isBody = el.tagName == 'BODY';

        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
        }
        var isSvg = window.SVGElement && el instanceof window.SVGElement;
        // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
        // See https://github.com/twbs/bootstrap/issues/20280
        var elOffset = isBody ? { top: 0, left: 0 } : isSvg ? null : $element.offset();
        var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset);
    };

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
    };

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        if (!this.$viewport) return delta;

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) {
                // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
                // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) {
                // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.right) {
                // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
        }

        return delta;
    };

    Tooltip.prototype.getTitle = function () {
        var title;
        var $e = this.$element;
        var o = this.options;

        title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

        return title;
    };

    Tooltip.prototype.getUID = function (prefix) {
        do {
            prefix += ~~(Math.random() * 1000000);
        } while (document.getElementById(prefix));
        return prefix;
    };

    Tooltip.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template);
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
            }
        }
        return this.$tip;
    };

    Tooltip.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
    };

    Tooltip.prototype.enable = function () {
        this.enabled = true;
    };

    Tooltip.prototype.disable = function () {
        this.enabled = false;
    };

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled;
    };

    Tooltip.prototype.toggle = function (e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data('bs.' + this.type, self);
            }
        }

        if (e) {
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue()) self.enter(self);else self.leave(self);
        } else {
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
        }
    };

    Tooltip.prototype.destroy = function () {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('bs.' + that.type);
            if (that.$tip) {
                that.$tip.detach();
            }
            that.$tip = null;
            that.$arrow = null;
            that.$viewport = null;
            that.$element = null;
        });
    };

    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.tooltip');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
            if (typeof option == 'string') data[option]();
        });
    }

    var old = $.fn.tooltip;

    $.fn.tooltip = Plugin;
    $.fn.tooltip.Constructor = Tooltip;

    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this;
    };
}(jQuery);
/**
 * @method axboot.buttonClick
 * @param {Object} _caller - this of function
 * @param {String} _attribute
 * @param {Object} _functionJson - 속성명과 매치되는 함수 속성값을 가진 버튼을 클릭하면 속성키에 선언된 함수가 실행됩니다.
 * @return _caller
 * @example
 * ```js
 * axboot.buttonClick(this, "data-page-btn", {
 *  "SEARCH": function(){
 *      ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
 *  }
 * });
 * ```
 */

axboot.buttonClick = function () {
    return function (_caller, _attribute, _functionJson) {
        var processor = $.extend(true, {}, _functionJson);

        $('[' + _attribute + ']').click(function () {
            var act = this.getAttribute(_attribute);
            if (act in processor) {
                processor[act].call(_caller, act, this);
            }
        });

        return this;
    };
}();
/**
 * @Object {Object} axboot.call
*/

/**
 * 여러개의 AJAX콜을 순차적으로 해야 하는 경우 callback 지옥에 빠지기 쉽다. `axboot.call & done`은 이런 상황에서 코드가 보기 어려워지는 문제를 해결 하기 위해 개발된 오브젝트 입니다
 * @method axboot.call
 * @example
 * ```js
 *   axboot
 *       .call({
 *           type: "GET", url: "/api/v1/programs", data: "",
 *           callback: function (res) {
 *               var programList = [];
 *               res.list.forEach(function (n) {
 *                   programList.push({
 *                       value: n.progCd, text: n.progNm + "(" + n.progCd + ")",
 *                       progCd: n.progCd, progNm: n.progNm,
 *                       data: n
 *                   });
 *               });
 *               this.programList = programList;
 *           }
 *       })
 *       .call(function () {
 *           this.something = 1;
 *       })
 *       .call({
 *           type: "GET", url: "/api/v1/commonCodes", data: {groupCd: "AUTH_GROUP", useYn: "Y"},
 *           callback: function (res) {
 *               var authGroup = [];
 *               res.list.forEach(function (n) {
 *                   authGroup.push({
 *                       value: n.code, text: n.name + "(" + n.code + ")",
 *                       grpAuthCd: n.code, grpAuthNm: n.name,
 *                       data: n
 *                   });
 *               });
 *               this.authGroup = authGroup;
 *           }
 *       })
 *       .done(function () {
 *           CODE = this; // this는 call을 통해 수집된 데이터들.
 *
 *           _this.pageButtonView.initView();
 *           _this.searchView.initView();
 *           _this.treeView01.initView();
 *           _this.formView01.initView();
 *           _this.gridView01.initView();
 *
 *           ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
 *       });
 * ```
 */

/**
 * axboot.call 참조
 * @method axboot.call.done
 */
axboot.call = function () {

    var callClass = function callClass(_obj) {
        this.queue = [];

        var self = this;
        var processor = function processor(callback) {
            var item = self.queue.shift();
            if (ax5.util.isFunction(item)) {
                item.call(this);
                processor.call(this, callback);
            } else if (item) {
                axboot.ajax({
                    type: item.type,
                    url: item.url,
                    data: item.data,
                    callback: function (res) {
                        item.callback.call(this, res);
                        processor.call(this, callback);
                    }.bind(this),
                    options: { nomask: false }
                });
            } else {
                callback.call(this);
            }
        };

        this.call = function (_obj) {
            this.queue.push(_obj);
            return this;
        };
        this.done = function (callback) {
            processor.call({}, callback);
        };
        this.call(_obj);
    };

    return function (obj) {
        return new callClass(obj);
    };
}();
axboot.convertCode = function () {
    var BASIC_CODE = {};
    var mapKeys = {
        key: "code", value: "name"
    };
    return function () {
        var codes,
            return_code = {};

        if (arguments.length == 1) {
            codes = arguments[0];
        } else {
            BASIC_CODE = arguments[0];
            codes = arguments[1];
        }

        codes = $.extend(true, BASIC_CODE, codes);

        for (var k in codes) {
            if (codes.hasOwnProperty(k)) {
                return_code[k] = codes[k];
                return_code[k].map = function () {
                    var i = this.length,
                        map = {};

                    while (i--) {
                        map[this[i][mapKeys.key]] = this[i][mapKeys.value];
                    }
                    return map;
                }.call(return_code[k]);
            }
        }

        return return_code;
    };
}();
/**
 * @function axboot.gridBuilder
 * @param {Object} _config
 * @example
 * ```js
 * this.target = axboot.gridBuilder({
 *    showLineNumber: false,
 *    showRowSelector: false,
 *    frozenColumnIndex: 0,
 *    target: $('[data-ax5grid="grid-view-01"]'),
 *    columns: [
 *        //menuId
 *        {key: "grpAuthCd", label: "권한그룹코드", width: 80, align: "center"},
 *        {key: "grpAuthNm", label: "권한그룹명", width: 160, align: "left"},
 *        {key: "useYn", label: "권한적용", editor: "checkYn"},
 *        {key: "schAh", label: "조회", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
 *        /// --> 이것들을 list로 담아서  [PUT] "/api/v2/menu/auth"
 *    ],
 *    body: {
 *        onClick: function () {
 *            // this.self.select(this.dindex);
 *        }
 *    }
 * });
 * ```
 */
axboot.gridBuilder = function () {
    var defaultGridConfig = {
        showLineNumber: true,
        lineNumberColumnWidth: 50,
        rowSelectorColumnWidth: 28,
        multipleSelect: false,
        header: {
            align: "center",
            columnHeight: 28
        },
        body: {
            columnHeight: 28,
            onClick: function onClick() {
                this.self.select(this.dindex);
            }
        },
        page: {
            navigationItemCount: 9,
            height: 30,
            display: true,
            firstIcon: '<i class="cqc-controller-jump-to-start"></i>',
            prevIcon: '<i class="cqc-triangle-left"></i>',
            nextIcon: '<i class="cqc-triangle-right"></i>',
            lastIcon: '<i class="cqc-controller-next"></i>'
        }
    };

    return function (_config) {
        var myGridConfig = $.extend(true, {}, defaultGridConfig, _config);

        var convertColumn = function convertColumn(columns) {

            for (var i = 0, l = columns.length; i < l; i++) {
                if (axboot.gridBuilder.preDefineColumns[columns[i].key]) {
                    columns[i] = $.extend({}, axboot.gridBuilder.preDefineColumns[columns[i].key], columns[i]);
                }
                if (columns[i].columns) {
                    columns[i].columns = convertColumn(columns[i].columns);
                }
                if (ax5.util.isString(columns[i].editor)) {
                    if (columns[i].editor in axboot.gridBuilder.preDefineEditor) {
                        if (ax5.util.isFunction(axboot.gridBuilder.preDefineEditor[columns[i].editor])) {
                            columns[i].editor = axboot.gridBuilder.preDefineEditor[columns[i].editor]();
                        } else {
                            columns[i].editor = $.extend({}, axboot.gridBuilder.preDefineEditor[columns[i].editor]);
                        }
                    }
                }

                if (columns[i].editor && ax5.util.isString(columns[i].editor.disabled)) {
                    columns[i].editor.disabled = axboot.gridBuilder.preDefineEditorDisabled[columns[i].editor.disabled];
                }
            }
            return columns;
        };

        myGridConfig.columns = convertColumn(myGridConfig.columns);
        myGridConfig.page.onChange = function () {
            myGridConfig.onPageChange(this.page.selectPage);
        };

        return new ax5.ui.grid(myGridConfig);
    };
}();

axboot.gridBuilder.preDefineColumns = {
    "insDt": { width: 100, label: "등록일", align: "center" },
    "compCd": { width: 70, label: "업체코드", align: "center" },
    "compNm": { width: 110, label: "업체명", align: "left" },
    "storCd": { width: 70, label: "매장코드", align: "center" },
    "storNm": { width: 200, label: "매장명", align: "left" },
    "userNm": { width: 100, label: "이름", align: "center" },
    "itemCd": { width: 80, label: "품목코드", align: "center" },
    "itemNm": { width: 150, label: "품목명", align: "left" },
    "posItemNm": { width: 150, label: "POS단축명", align: "left" },
    "delYn": {
        width: 50, label: "삭제", align: "center", formatter: function formatter() {
            return parent.COMMON_CODE["DEL_YN"].map[this.value];
        }
    },
    "useYn": {
        width: 70, label: "사용여부", align: "center", formatter: function formatter() {
            return parent.COMMON_CODE["USE_YN"].map[this.value];
        }
    },
    "posUseYn": {
        width: 90, label: "포스사용여부", align: "center", formatter: function formatter() {
            return parent.COMMON_CODE["USE_YN"].map[this.value];
        }
    },
    "sort": { width: 50, label: "정렬", align: "center" },
    "companyJson.대표자명": { width: 100, label: "대표자명", align: "center" },
    "companyJson.사업자등록번호": {
        label: "사업자등록번호",
        width: 120,
        align: "center",
        formatter: "bizno"
    },
    "storeInfoJson.대표자명": { width: 100, label: "대표자명", align: "center" },
    "storeInfoJson.사업자등록번호": {
        label: "사업자등록번호",
        width: 120,
        align: "center",
        formatter: "bizno"
    },
    "storeInfoJson.영업시작시간": {
        label: "영업시작시간",
        width: 100,
        align: "center"
    },
    "storeInfoJson.영업종료시간": {
        label: "영업종료시간",
        width: 100,
        align: "center"
    },
    "storeInfoJson.담당자": {
        label: "담당자",
        width: 70,
        align: "center"
    },
    "storeInfoJson.연락처": {
        label: "연락처",
        width: 100,
        align: "center"
    }
};

// 컬럼 확장 구문
axboot.gridBuilder.preDefineColumns["locale"] = function () {
    return {
        width: 120, label: "국가", align: "center", formatter: function formatter() {
            return parent.COMMON_CODE["LOCALE"].map[this.value];
        }
    };
}();

axboot.gridBuilder.preDefineColumns["printerType"] = function () {
    return {
        width: 100, label: "프린터 타입", align: "center",
        formatter: function formatter() {
            return parent.COMMON_CODE["PRINTER_TYPE"].map[this.value];
        }
    };
}();

axboot.gridBuilder.preDefineEditor = {
    "useYn": {
        type: "select", config: {
            columnKeys: {
                optionValue: "CD", optionText: "NM"
            },
            options: [{ CD: "Y", NM: "사용" }, { CD: "N", NM: "사용안함" }]
        }
    },
    "checkYn": {
        type: "checkbox", config: { trueValue: "Y", falseValue: "N" }
    },
    "menu-program-auth-checkYn": {
        type: "checkbox", config: { trueValue: "Y", falseValue: "N" },
        disabled: function disabled() {
            return this.item["program_" + this.key] == "N";
        }
    },
    "number": {
        type: "number"
    },
    "text": {
        type: "text"
    },
    "PRINTER_TYPE": function PRINTER_TYPE() {
        return {
            type: "select", config: {
                columnKeys: {
                    optionValue: "code", optionText: "name"
                },
                options: parent.COMMON_CODE["PRINTER_TYPE"]
            }
        };
    }
};

axboot.gridBuilder.preDefineEditorDisabled = {
    "notCreated": function notCreated() {
        return !this.item.__created__;
    }
};

ax5.ui.grid.formatter["bizno"] = function () {
    var val = (this.value || "").replace(/\D/g, "");
    var regExpPattern = /^([0-9]{3})\-?([0-9]{1,2})?\-?([0-9]{1,5})?.*$/,
        returnValue = val.replace(regExpPattern, function (a, b) {
        var nval = [arguments[1]];
        if (arguments[2]) nval.push(arguments[2]);
        if (arguments[3]) nval.push(arguments[3]);
        return nval.join("-");
    });
    return returnValue;
};

ax5.ui.grid.formatter["phone"] = function () {
    var val = this.value.replace(/\D/g, "");
    var regExpPattern3 = /^([0-9]{3})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/,
        returnValue = val.replace(regExpPattern3, function (a, b) {
        var nval = [arguments[1]];
        if (arguments[2]) nval.push(arguments[2]);
        if (arguments[3]) nval.push(arguments[3]);
        if (arguments[4]) nval.push(arguments[4]);
        if (arguments[5]) nval.push(arguments[5]);
        return nval.join("-");
    });
    return returnValue;
};

/**
 * @Class axboot.lang
 *
 * @method axboot.lang.get
 * @param {String} _message
 * @param {*} [args]
 * @return {String}
 */
axboot.lang = function () {
    function langClass(_json) {

        this.json = _json;

        this.get = function (_message) {
            var args = [];
            for (var i = 1, l = arguments.length; i < l; i++) {
                args = args.concat(arguments[i]);
            }

            if (_message in this.json) {
                return ax5.util.string(this.json[_message]).format(args);
            } else {
                for (var k in this.json) {
                    if (ax5.util.right(k, _message.length) == _message) {
                        return ax5.util.string(this.json[k]).format(args);
                        break;
                    }
                }
            }
        };
    }

    return langClass;
}();
/**
 * @Object {Object} axboot.modal
 */
axboot.modal = function () {
    var modalCallback = {};

    var defaultCss = {
        width: 400,
        height: 400,
        position: {
            left: "center",
            top: "middle"
        }
    };

    var defaultOption = $.extend(true, {}, defaultCss, {
        iframeLoadingMsg: "",
        iframe: {
            method: "post",
            url: "#"
        },
        closeToEsc: true,
        onStateChanged: function onStateChanged() {
            // mask
            if (this.state === "open") {
                window.axMask.open();
            } else if (this.state === "close") {
                window.axMask.close();
            }
        },
        animateTime: 100,
        zIndex: 5000,
        absolute: true,
        fullScreen: false,
        header: {
            title: "",
            btns: {
                close: {
                    label: '<i class="cqc-circle-with-cross"></i>', onClick: function onClick() {
                        window.axModal.close();
                    }
                }
            }
        }
    });

    /**
     * 지정한 조건으로 ax5 modal을 엽니다. modalConfig 를 넘기지 않으면 지정된 기본값으로 엽니다.
     * @method axboot.modal.open
     * @param {Object} modalConfig
     * @param {Number} modalConfig.width
     * @param {Number} modalConfig.height
     * @param {Object} modalConfig.position
     * @param {String} modalConfig.position.left
     * @param {String} modalConfig.position.top
     * @param {String} modalConfig.iframeLoadingMsg
     * @param {String} modalConfig.iframe.method
     * @param {String} modalConfig.iframe.url
     * @param {Boolean} modalConfig.closeToEsc
     * @param {Number} modalConfig.animateTime
     * @param {Number} modalConfig.zIndex
     * @param {Boolean} modalConfig.fullScreen
     * @param {Object} modalConfig.header
     * @param {String} modalConfig.header.title
     * @param {Function} modalConfig.sendData - 모달창에서 parent.axboot.modal.getData() 하여 호출합니다. 전달하고 싶은 변수를 return 하면 됩니다
     * @param {Function} modalConfig.callback - 모달창에서 parant.axboot.modal.callback() 으로 호출합니다.
     *
     * @example
     * ```js
     *  axboot.modal.open({
     *      width: 400,
     *      height: 400,
     *      header: false,
     *      iframe: {
     *          url: "open url"
     *          param: "param"
     *      },
     *      sendData: function(){
     *
     *      },
     *      callback: function(){
     *          axboot.modal.close();
     *      }
     *  });
     * ```
     */
    var open = function open(modalConfig) {

        modalConfig = $.extend(true, {}, defaultOption, modalConfig);
        if (modalConfig.modalType) {

            if (axboot.def.MODAL && axboot.def.MODAL[modalConfig.modalType]) {
                if (modalConfig.param) {
                    $.extend(true, modalConfig, { iframe: { param: modalConfig.param } });
                }
                modalConfig = $.extend(true, {}, modalConfig, axboot.def.MODAL[modalConfig.modalType]);
            }
        }

        $(document.body).addClass("modalOpened");

        this.modalCallback = modalConfig.callback;
        this.modalSendData = modalConfig.sendData;

        window.axModal.open(modalConfig);
    };

    /**
     * ax5 modal css 를 적용합니다.
     * @method axboot.modal.css
     * @param modalCss
     */
    var css = function css(modalCss) {
        modalCss = $.extend(true, {}, defaultCss, modalCss);
        window.axModal.css(modalCss);
    };
    /**
     * ax5 modal을 정렬합니다.
     * @method axboot.modal.align
     * @param modalAlign
     */
    var align = function align(modalAlign) {
        window.axModal.align(modalAlign);
    };
    /**
     * ax5 modal을 닫습니다.
     * @method axboot.modal.close
     */
    var close = function close(data) {
        window.axModal.close();
        setTimeout(function () {
            $(document.body).removeClass("modalOpened");
        }, 500);
    };
    /**
     * ax5 modal을 최소화 합니다.
     * @method axboot.modal.minimize
     */
    var minimize = function minimize() {
        window.axModal.minimize();
    };
    /**
     * ax5 modal을 최대화 합니다.
     * @methid axboot.modal.maximize
     */
    var maximize = function maximize() {
        window.axModal.maximize();
    };

    /**
     * callback 으로 정의된 함수에 전달된 파라메터를 넘겨줍니다.
     * @method axboot.modal.callback
     * @param {Object|String} data
     */
    var callback = function callback(data) {
        if (this.modalCallback) {
            this.modalCallback(data);
        }
    };

    var getData = function getData() {
        if (this.modalSendData) {
            return this.modalSendData();
        }
    };

    return {
        "open": open,
        "css": css,
        "align": align,
        "close": close,
        "minimize": minimize,
        "maximize": maximize,
        "callback": callback,
        "modalCallback": modalCallback,
        "getData": getData
    };
}();
/**
 * @Object {Object} axboot.modelFormatter
 */
axboot.modelFormatter = function () {
    var get_real_path = function get_real_path(dataPath) {
        var path = [];
        var _path = [].concat(dataPath.split(/[\.\[\]]/g));
        _path.forEach(function (n) {
            if (n !== "") path.push(n);
        });
        _path = null;
        return "'" + path.join("']['") + "'";
    };

    /**
     * @class ax5ModelFormatter
     * @param _model
     * @example
     * ```js
     * this.model = new ax5.ui.binder();
     * this.model.setModel(this.getDefaultData(), this.target);
     * this.modelFormatter = new axboot.modelFormatter(this.model); // 모델 포메터 시작
     * ```
     */
    var ax5ModelFormatter = function ax5ModelFormatter(_model) {
        this.target = _model.view_target;

        if (!(this.target instanceof jQuery)) {
            console.log("모델 뷰 타겟이 jQuery 오브젝트가 아니라서 modelFormatter 초기화에 실패 하였습니다");
            return;
        }

        /**
         * @method ax5ModelFormatter.formatting
         * @example
         * ```js
         * this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
         * ```
         */
        this.formatting = function () {
            this.target.find('[data-ax-path][data-ax5formatter]').ax5formatter();
        };

        /**
         * @method ax5ModelFormatter.getClearData
         * @param _data
         * @example
         * ```js
         * var data = this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
         * return data;
         * ```
         */
        this.getClearData = function (_data) {
            var myData = $.extend({}, _data);
            this.target.find('[data-ax-path]').each(function () {
                var dataPath = this.getAttribute("data-ax-path");
                var pattern = this.getAttribute("data-ax5formatter");
                var value = Function("", "return this[" + get_real_path(dataPath) + "];").call(myData);
                if (typeof value !== "undefined") {
                    if (pattern in axboot.modelFormatter.clearProcessor) value = axboot.modelFormatter.clearProcessor[pattern].call(this, value);
                    Function("val", "this[" + get_real_path(dataPath) + "] = val;").call(myData, value);
                }
            });
            return myData;
        };

        this.formatting();
    };
    return ax5ModelFormatter;
}();

axboot.modelFormatter.clearProcessor = {
    "money": function money(_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "number": function number(_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "date": function date(_v) {
        return ax5.util.date("" + _v, { "return": 'yyyy-MM-dd' });
    },
    "time": function time(_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "bizno": function bizno(_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "phone": function phone(_v) {
        return ("" + _v).replace(/\D/g, "");
    },
    "customPattern": function customPattern(_v) {
        return _v;
    }
};

/**포멧터의 포멧터 패턴 확장**/
ax5.ui.formatter.formatter["chequer"] = {
    getEnterableKeyCodes: function getEnterableKeyCodes(_opts) {
        var enterableKeyCodes = {
            '189': '-' // eventKeyCode
        };
        return jQuery.extend(enterableKeyCodes, ax5.ui.formatter.formatter.ctrlKeys, ax5.ui.formatter.formatter.numKeys);
    },
    getPatternValue: function getPatternValue(_opts, optIdx, e, val, eType) {
        val = val.replace(/\D/g, "");
        var regExpPattern = /^([0-9]{2})\-?([0-9]{2})?\-?([0-9]{2})?\-?([0-9]{2})?/;
        return val.replace(regExpPattern, function (a, b) {
            var nval = [arguments[1]];
            if (arguments[2]) nval.push(arguments[2]);
            if (arguments[3]) nval.push(arguments[3]);
            if (arguments[4]) nval.push(arguments[4]);
            return nval.join("-");
        });
    }
};

/**
 * @Object {Object} axboot.formFormatter
 */
axboot.formFormatter = function () {
    /**
     * @class ax5FormFormatter
     * @param _model
     * @example
     * ```js
     * this.formFormatter = new axboot.formFormatter(this.$target); // 폼 포메터 시작
     * ```
     */
    var ax5FormFormatter = function ax5FormFormatter(_$target) {
        this.target = _$target;

        if (!(this.target instanceof jQuery)) {
            console.log("target이 jQuery 오브젝트가 아니라서 formFormatter 초기화에 실패 하였습니다");
            return;
        }

        /**
         * @method ax5FormFormatter.formatting
         * @example
         * ```js
         * this.modelFormatter.formatting(); // 입력된 값을 포메팅 된 값으로 변경
         * ```
         */
        this.formatting = function () {
            this.target.find('[data-ax5formatter]').ax5formatter();
        };

        this.formatting();
    };
    return ax5FormFormatter;
}();
/**
 * @object {Object} axboot.preparePlugin
 */
axboot.preparePlugin = function () {
    /**
     * js가 실행되는 타임. 페이지 레디 전에 미리 선언 하는 경우
     * @method axboot.preparePlugin.define
     */
    var define = function define() {

        /**
         * 기본 마스크
         * @var {ax5ui} axMask
         * @example
         * ```js
         * appMask.open();
         * appMask.close();
         * appMask.close(1000); // 1초 지연 후 마스크 닫기
         * ```
         */
        window.axMask = new ax5.ui.mask();
        /**
         * 다이얼로그용 마스크
         * @var {ax5ui} axDialogMask
         */
        window.axDialogMask = new ax5.ui.mask();
        /**
         * ajax용 마스크
         * @var {ax5ui} axAJAXMask
         */
        window.axAJAXMask = new ax5.ui.mask({
            content: '<i class="cqc-chequer cqc-50x cqc-zoom-in-out" style="color: #ccc;"></i>'
        });
        /**
         * 프로그래스바 형태의 마스크
         * @var {ax5ui} axProgressMask
         */
        window.axProgressMask = new ax5.ui.mask({
            theme: "progress-mask",
            content: '<div class="progress">' + '<div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" style="width: 0%">' + '</div>' + '</div>'
        });
        /**
         * 기본 모달
         * @var {ax5ui} axModal
         */
        window.axModal = new ax5.ui.modal({
            absolute: true,
            iframeLoadingMsg: '<i class="cqc-chequer ax-loading-icon lg"></i>'
        });

        ax5.ui.picker_instance.setConfig({
            animateTime: 100,
            calendar: {
                control: {
                    left: '<i class="cqc-chevron-left"></i>',
                    yearTmpl: '%s',
                    monthTmpl: '%s',
                    right: '<i class="cqc-chevron-right"></i>',
                    yearFirst: true
                    /*
                     dimensions: {
                     itemPadding: 1,
                     height: 200
                     }
                     lang: {
                     year: "%s",
                     month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                     day: "%s"
                     },
                     */
                } }
        });
        ax5.ui.combobox_instance.setConfig({
            removeIcon: '<i class="cqc-cancel3"></i>'
        });
    };

    /**
     * 페이지가 레디된 다음 선언하는 경우.
     * 경우에 따라 페이지가 준비완료 상태일 때 선언해야하는 플러그인을 위해.
     * @method axboot.preparePlugin.pageStart
     */
    var pageStart = function pageStart() {

        /**
         *
         * @var {ax5ui} axDialog
         */
        window.axDialog = new ax5.ui.dialog({
            title: axboot.def.dialogTitle,
            lang: {
                "ok": "확인", "cancel": "취소"
            },
            onStateChanged: function onStateChanged() {
                if (this.state === "open") {
                    axDialogMask.open();
                } else if (this.state === "close") {
                    axDialogMask.close();
                }
            }
        });
        /**
         *
         * @var {ax5ui} axWarningDialog
         */
        window.axWarningDialog = new ax5.ui.dialog({
            title: axboot.def.dialogTitle,
            theme: "warning",
            lang: {
                "ok": "확인", "cancel": "취소"
            },
            onStateChanged: function onStateChanged() {
                if (this.state === "open") {
                    axDialogMask.open({ theme: 'danger' });
                } else if (this.state === "close") {
                    axDialogMask.close();
                }
            }
        });
        /**
         *
         * @var {ax5ui} axToast
         * @example
         * ```js
         * toast.push('Toast message', function () {
         *  // closed toast
         *  console.log(this);
         * });
         * ```
         */
        window.axToast = new ax5.ui.toast({
            icon: '<i class="cqc-megaphone"></i>',
            containerPosition: "bottom-right",
            onStateChanged: function onStateChanged() {}
        });
        /**
         * @var {ax5ui} axWarningToast
         *
         */
        window.axWarningToast = new ax5.ui.toast({
            theme: "danger",
            icon: '<i class="cqc-warning2"></i>',
            containerPosition: "bottom-left",
            onStateChanged: function onStateChanged() {}
        });
    };

    define();

    return {
        define: define,
        pageStart: pageStart
    };
}();
axboot.promise = function () {
    /**
     * @Class axboot.promise
     * @example
     * ```js
     * axboot.promise()
     *      .then(function (ok, fail, data) {
      *             $.ajax({
      *                 url: "/api/v1/connections",
      *                 callback: function (res) {
      *                     ok(res); // data 로 전달
      *                 },
      *                 onError: function (res) {
      *                     fail(res);
      *                 }
      *             });
      *         })
     *      .then(function (ok, fail, data) {
      *             $.ajax({
      *                 url: "/api/v1/login",
      *                 data: data,
      *                 callback: function (res) {
      *                     ok(res);
      *                 },
      *                 onError: function (res) {
      *                     fail(res);
      *                 }
      *             });
      *         })
     *      .then(function (ok, fail, data) {
      *             console.log("success");
      *         })
     *      .catch(function (res) {
      *              alert(res.message);
      *      });
     * ```
     */
    var myClass = function myClass() {
        this.busy = false;
        this.queue = [];
        this.then = function (fn) {
            this.queue.push(fn);
            this.exec({});
            return this;
        };
        this.exec = function (data) {
            if (this.busy) return this;
            var Q = this.queue.shift(),
                self = this;

            if (Q) {
                this.busy = true;

                try {
                    Q(function (a) {
                        self.busy = false;
                        self.exec(a);
                    }, function (e) {
                        self._catch(e);
                    }, data || {});
                } catch (e) {
                    this._catch(e);
                }
            } else {
                this.busy = false;
            }
        };
        this.catch = function (fn) {
            this._catch = fn;
        };
    };

    return new myClass();
};
axboot.requireSession = function (_cookieName) {
    if (!ax5.util.getCookie(_cookieName)) {
        if (window.opener) {
            window.close();
            window.opener.top.location.href = "/";
        } else if (top != window) {
            top.location.href = "/";
        }
    }
};
axboot.treeBuilder = function () {
    /* http://www.treejs.cn/v3/api.php 를 참고하세요. */

    var defaultTreeSetting = {};

    var treeClass = function treeClass(_target, _setting, _zNodes) {
        this.targetId = "";
        this.$target = null;
        this.setting = {};
        this.zNodes = [];
        var callbackFlag = true;

        this.setData = function (_zNodes) {
            if (typeof _zNodes !== "undefined") this.zNodes = ax5.util.deepCopy(_zNodes);
            $.fn.zTree.init(this.$target, this.setting, this.zNodes);
        };
        this.getData = function () {
            return this.zTree.getNodes();
        };
        this.selectNode = function (_treeNode) {
            this.zTree.selectNode(_treeNode);
        };
        this.cancelSelectedNode = function () {
            this.zTree.cancelSelectedNode();
        };
        this.getSelectedNodes = function () {
            return this.zTree.getSelectedNodes();
        };
        this.editName = function () {
            var nodes = this.zTree.getSelectedNodes();
            if (nodes.length == 0) {
                alert("Please select one node at first...");
                return;
            }
            this.zTree.editName(nodes[0]);
        };
        this.removeNode = function (treeNode) {
            var nodes = this.zTree.getSelectedNodes();
            if (nodes.length == 0) {
                alert("Please select one node at first...");
                return;
            }
            zTree.removeNode(nodes[0], callbackFlag);
        };
        this.addNode = function () {};
        this.convertList2Tree = function (_list, _config) {
            _list = JSON.parse(JSON.stringify(_list));

            var childKey = _config.childKey;
            var parentKey = _config.parentKey;
            var childrenKey = _config.childrenKey || "children";
            var labelKey = _config.labelKey;
            var seq = 0;
            var hashDigit = 3;
            var tree = [];
            var pointer = {};
            for (var i = 0, l = _list.length; i < l; i++) {
                pointer[_list[i][childKey]] = i;
                if (!_list[i][parentKey]) {
                    var item = _list[i];
                    item.pHash = ax5.util.setDigit("0", hashDigit);
                    item.hash = ax5.util.setDigit("0", hashDigit) + "_" + ax5.util.setDigit(seq, hashDigit);

                    var pushItem = {
                        id: item[childKey],
                        name: item[labelKey],
                        label: item[labelKey],
                        pHash: ax5.util.setDigit("0", hashDigit),
                        hash: ax5.util.setDigit("0", hashDigit) + "_" + ax5.util.setDigit(seq, hashDigit),
                        data: $.extend({}, item),
                        __subTreeLength: 0
                    };
                    pushItem[childrenKey] = [];

                    tree.push(pushItem);
                    seq++;
                }
            }
            for (var i = 0, l = _list.length; i < l; i++) {
                if (_list[i][parentKey]) {
                    var item = _list[i];

                    var pItem = _list[pointer[item[parentKey]]];
                    var pHash = pItem["hash"];
                    var pHashs = pHash.split(/_/g);
                    var pTree = tree;
                    var pTreeItem = {};
                    var __subTreeLength = typeof pItem.__subTreeLength !== "undefined" ? pItem.__subTreeLength : 0;

                    pHashs.forEach(function (T, idx) {
                        if (idx > 0) {
                            pTreeItem = pTree[Number(T)];
                            pTree = pTree[Number(T)][childrenKey];
                        }
                    });

                    item[childrenKey] = [];
                    item["pHash"] = pHash;
                    item["hash"] = pHash + "_" + ax5.util.setDigit(__subTreeLength, hashDigit);

                    var pushItem = {
                        name: item[labelKey],
                        label: item[labelKey],
                        pHash: pHash,
                        hash: pHash + "_" + ax5.util.setDigit(__subTreeLength, hashDigit),
                        data: $.extend({}, item)
                    };
                    pushItem[childrenKey] = [];
                    pTree.push(pushItem);

                    if (typeof pItem.__subTreeLength === "undefined") pItem.__subTreeLength = 1;else pItem.__subTreeLength++;

                    pTreeItem.__subTreeLength = pItem.__subTreeLength;
                }
            }
            return tree;
        };

        this.$target = _target;
        if (!this.$target.get(0).id) {
            this.$target.get(0).id = "axboot-tree-" + ax5.getGuid();
        }
        this.targetId = this.$target.get(0).id;
        this.setting = $.extend(true, {}, defaultTreeSetting, _setting);
        if (typeof _zNodes !== "undefined") this.zNodes = ax5.util.deepCopy(_zNodes);

        $.fn.zTree.init(this.$target, this.setting, this.zNodes);
        this.zTree = $.fn.zTree.getZTreeObj(this.targetId);
    };

    return function (_target, _setting, _zNodes) {
        return new treeClass(_target, _setting, _zNodes);
    };
}();
/**
 * Created by tom on 2016. 9. 2..
 */

axboot.addressPopup = {
    open: function open(cb) {
        //alert("open");
        var modalConfig = {
            width: 500,
            height: 600,
            iframe: {
                url: "/jsp/common/zipcode.jsp"
            },
            header: {
                title: "우편번호 찾기"
            },
            callback: cb
        };
        axboot.modal.open(modalConfig);
    },
    close: function close() {
        axboot.modal.close();
    }
};

axboot.util = function () {
    var setSelectionRange = function setSelectionRange(input, pos) {
        if (typeof pos == "undefined") {
            pos = input.value.length;
        }
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(pos, pos);
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        } else if (input.selectionStart) {
            input.focus();
            input.selectionStart = pos;
            input.selectionEnd = pos;
        }
    };

    return {
        setFocusPosition: setSelectionRange
    };
}();
/**
 * commonView
 * @Object {Object} axboot.commonView
 */
axboot.commonView = {};

/**
 * searchView
 * @Object {Object} axboot.searchView
 */
axboot.searchView = {
    setData: function setData(_obj) {
        for (var k in _obj) {
            if (k in this) {
                this[k].val(_obj[k]);
            }
        }
    },
    getCheckedValue: function getCheckedValue($inp) {
        if ($inp[0].type == "radio") {
            return $inp.filter(":checked").val();
        } else if ($inp[0].type == "checkbox") {
            return function (_$inp) {
                var vals = [];
                _$inp.filter(":checked").each(function () {
                    vals.push(this.value);
                });
                return vals.join(',');
            }.call(this, $inp);
        }
    }
};

/**
 * treeView
 * @Object {Object} axboot.treeView
 */
axboot.treeView = {};

/**
 * gridView
 * @Object {Object} axboot.gridView
 */
axboot.gridView = {
    page: {
        pageNumber: 0,
        pageSize: 99999
    },
    setData: function setData(_data) {
        this.target.setData(_data);
    },
    getData: function getData(_type) {
        var list = [];
        var _list = this.target.getList(_type);
        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return true;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function addRow() {
        this.target.addRow({ __created__: true }, "last", { focus: "END" });
    },
    delRow: function delRow(_type) {
        this.target.deleteRow(_type);
    },
    align: function align() {
        this.target.align();
    },
    clear: function clear() {
        this.target.setData({
            list: [],
            page: {
                currentPage: 0,
                pageSize: 0,
                totalElements: 0,
                totalPages: 0
            }
        });
    },
    setPageData: function setPageData(_page) {
        this.page = $.extend(this.page, _page);
    },
    getPageData: function getPageData() {
        return this.page;
    }
};

/**
 * formView
 * @Object {Object} axboot.formView
 */
axboot.formView = {
    clear: function clear() {
        this.model.setModel(this.getDefaultData());
        $('[data-ax5formatter]').ax5formatter("formatting");
    },
    validate: function validate() {
        var rs = this.model.validate();
        if (rs.error) {
            alert(rs.error[0].jquery.attr("title") + '을(를) 입력해주세요.');
            rs.error[0].jquery.focus();
            return false;
        }
        return true;
    }
};

/**
 * formView.defaultData
 * @Object {Object} axboot.formView.defaultData
 */
axboot.formView.defaultData = {
    masterCompCd: ""
};

/**
 * 1, 2를 믹스한 새로운 오브젝트를 반환
 * @param _obj1
 * @param _obj2
 */
axboot.extend = function (_obj1, _obj2) {
    return $.extend({}, _obj1, _obj2);
};
axboot.viewExtend = function (_obj1, _obj2) {
    if (typeof _obj2 === "undefined") {
        return $.extend({}, axboot.commonView, _obj1);
    } else {
        return $.extend({}, _obj1, _obj2);
    }
};

/**
 * 페이지에서 사용하는
 * @method axboot.actionExtend
 * @param {Object} [_actionThis]
 * @param {Object} _action
 * @example
 * ```js
 *
 * // ACTION 이름은 키로 사용하고 dispatch에서 처리하는 방식.
 * var ACTION = axboot.actionExtend(fnObj, {
 *  PAGE_SEARCH: "PAGE_SEARCH",
 *  dispatch: function(caller, act, data){
 *      switch (act) {
 *          case ACTIONS.PAGE_SEARCH:
 *              // call view method
 *          break;
 *          default
 *              return false;
 *      }
 *  }
 * });
 *
 * // ACTION 이름에 함수를 구현하는 방식
 * var ACTION = axboot.actionExtend(fnObj, {
 *  PAGE_SEARCH: function(caller, act, data){
 *
 *  },
 *  dispatch: function(caller, act, data){
 *      var result = ACTIONS.exec(caller, act, data);
 *      if(result != "error"){
 *          return result;
 *      } else {
 *          return false;
 *      }
 *  }
 * });
 *
 * // 액션의 실행
 * fnObj.sampleView = axboot.viewExtend({
 *  initView: function(){
 *      ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
 *  }
 * });
 * ```
 */
axboot.actionExtend = function () {
    return function (_actionThis, _action) {
        var myAction = {};

        // 액션 명령어는 수집하여 담기
        for (var k in _action) {
            if (ax5.util.isString(_action[k])) {
                myAction[k] = _action[k];
            } else if (ax5.util.isFunction(_action[k])) {
                myAction[k] = k;
                myAction["__EXEC__" + k] = _action[k];
            }
        }

        // dispatch 조작하기
        if ("dispatch" in _action) {
            myAction["page_dispatch"] = _action["dispatch"];
        }

        myAction["exec"] = function (caller, act, data) {
            if (_action[act]) {
                return _action[act].call(caller, caller, act, data);
            } else {
                return "error";
            }
        };

        if (!myAction["page_dispatch"]) {
            myAction["page_dispatch"] = function (caller, act, data) {

                var result = function () {
                    return caller.ACTIONS ? caller.ACTIONS : window.ACTIONS;
                }().exec(caller, act, data);

                if (result != "error") {
                    return result;
                } else {
                    return false;
                }
            };
        }

        myAction["dispatch"] = function () {
            var fnArgs = [];

            fnArgs = ax5.util.toArray(arguments);
            if (ax5.util.isString(fnArgs[0])) {
                // 첫번째 아규먼트가 문자열이라면. action 이름이 왔다고 보자.
                // 첫번째 아규먼트에 _actionThis 삽입
                fnArgs.splice(0, 0, _actionThis);
            }
            return myAction["page_dispatch"].apply(_actionThis, fnArgs);
        };

        return myAction;
    };
}();