
/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

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
 * jQuery('[data-ax5layout="ax1"]').ax5layout("align");
 * jQuery('[data-ax5layout="ax1"]').ax5layout("resize");
 * jQuery('[data-ax5layout="ax1"]').ax5layout("reset");
 * jQuery('[data-ax5layout="ax1"]').ax5layout("hide");
 * jQuery('[data-ax5layout="ax1"]').ax5layout("onResize");
 * jQuery('[data-ax5layout="ax1"]').ax5layout("tabOpen", 1);
 * ```
 */
jQuery.fn.ax5layout = (function () {
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
                case "getActiveTab":
                    return ax5.ui.layout_instance.getActiveTab(this, arguments[1]);
                    break;
                default:
                    return this;
            }
        }
        else {
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
    }
})();