
/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

/**
 * ax5combobox jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5combobox
 * @param {String} methodName
 * @param [arguments]
 * @param [arguments]
 * @example
 * ```html
 * <div data-ax5combobox="ax1" data-ax5combobox-config='{
 *  multiple: true,
 *  editable: true,
 *  size: "",
 *  theme:""
 *  }'></div>
 * <script>
 * jQuery('[data-ax5combobox="ax1"]').ax5combobox();
 * $('[data-ax5combobox="ax1"]').ax5combobox("getSelectedOption");
 * $('[data-ax5combobox="ax1"]').ax5combobox("setValue", ["string", "number"]);
 * $('[data-ax5combobox="ax1"]').ax5combobox("enable");
 * $('[data-ax5combobox="ax1"]').ax5combobox("disable");
 * </script>
 * ```
 */

ax5.ui.combobox_instance = new ax5.ui.combobox();
jQuery.fn.ax5combobox = (function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.combobox_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.combobox_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.combobox_instance.setValue(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "setText":
                    return ax5.ui.combobox_instance.setText(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "getSelectedOption":
                    return ax5.ui.combobox_instance.getSelectedOption(this);
                    break;
                case "enable":
                    return ax5.ui.combobox_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.combobox_instance.disable(this);
                    break;
                case "blur":
                    return ax5.ui.combobox_instance.blur(this);
                case "clear":
                    return ax5.ui.combobox_instance.clear(this);
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
                ax5.ui.combobox_instance.bind(config);
            });
        }
        return this;
    }
})();