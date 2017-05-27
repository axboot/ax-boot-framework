
/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

ax5.ui.formatter_instance = new ax5.ui.formatter();

jQuery.fn.ax5formatter = (function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "formatting":
                    return ax5.ui.formatter_instance.formatting(this);
                    break;

                case "unbind":
                    return ax5.ui.formatter_instance.unbind(this);
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
                ax5.ui.formatter_instance.bind(config);
            });
        }
        return this;
    }
})();
