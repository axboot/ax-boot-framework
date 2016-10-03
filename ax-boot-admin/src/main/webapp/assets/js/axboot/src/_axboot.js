/**
 * @type {Object}
 */
var axboot = {};

/**
 * axboot의 환경 변수 저장 공간
 * @type {Object}
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
 * @method axboot.init
 */
axboot.init = function () {
    axboot.pageAutoHeight.init();
    axboot.pageAutoHeight.align();

    $('[data-ax5layout]').ax5layout({
        splitter: {
            size: 6
        },
        onResize: function () {
            $('[data-fit-height-content]').each(function () {
                var $this = $(this);
                var _pHeight = $this.offsetParent().height();
                var name = this.getAttribute("data-fit-height-content");
                var _asideHeight = 0;
                $('[data-fit-height-aside="' + name + '"]').each(function () {
                    _asideHeight += $(this).outerHeight();
                });
                $this.css({height: _pHeight - _asideHeight});
            });
            if (ax5.ui.grid_instance) {
                ax5.ui.grid_instance.forEach(function (g) {
                    g.setHeight(g.$target.height());
                });
            }
        },
        onOpenTab: function () {
            var activeTabPanel = this.activePanel.$target.get(0);

            this.activePanel.$target.find('[data-fit-height-content]').each(function () {
                var $this = $(this);
                var _pHeight = $this.offsetParent().height();
                var name = this.getAttribute("data-fit-height-content");
                var _asideHeight = 0;
                $('[data-fit-height-aside="' + name + '"]').each(function () {
                    _asideHeight += $(this).outerHeight();
                });
                $this.css({height: _pHeight - _asideHeight});
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

    if (typeof parent.COMMON_CODE === "undefined" && (window.SCRIPT_SESSION && SCRIPT_SESSION.login)) {
        // API : /api/v1/commonCodes/getAllByMap
        axboot.ajax({
            url: "/api/v1/commonCodes/getAllByMap",
            callback: function(res){
                parent.COMMON_CODE = axboot.convertCode(res);
                axboot.pageStart();
            },
            options: {nomask: true}
        });
    }else{
        parent.COMMON_CODE = axboot.convertCode(parent.COMMON_CODE);
        axboot.pageStart();
    }

    $(window).resize(function () {
        axboot.pageResize();
    });
    $(document.body).on("click", function () {
        if (window.parent != window) {
            $(parent.document.body).trigger("click");
        }
    });
};

/**
 * @method axboot.pageStart
 *
 */
axboot.pageStart = function () {
    if (window[axboot.def.pageFunctionName] && window[axboot.def.pageFunctionName].pageStart) {
        window[axboot.def.pageFunctionName].pageStart();
    }
};
/**
 * @method axboot.pageResize
 */
axboot.pageResize = function () {
    axboot.pageAutoHeight.align();
    if (window[axboot.def.pageFunctionName] && window[axboot.def.pageFunctionName].pageResize) {
        window[axboot.def.pageFunctionName].pageResize();
    }
};
/**
 * @method axboot.layoutResize
 */
axboot.layoutResize = function () {
    if (window[axboot.def.pageFunctionName] && window[axboot.def.pageFunctionName].layoutResize) {
        window[axboot.def.pageFunctionName].layoutResize();
    }
};

/**
 *
 * @type {{init: axboot.pageAutoHeight.init, align: axboot.pageAutoHeight.align}}
 */
axboot.pageAutoHeight = {
    init: function () {
        this.active = $(document.body).attr("data-page-auto-height");
    },
    align: function () {
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
            $('[role="page-content"]').css({height: contentHeight});
        })();
    }
};

///// ~~~~~~~~~~~~~~~~~~~~~~
$(document.body).ready(function () {
    axboot.preparePlugin.pageStart();
    axboot.init();

    document.createElement("lang");
});
