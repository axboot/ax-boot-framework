/**
 * autocomplete jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5autocomplete
 * @param {String} methodName
 * @param [arguments]
 * @param [arguments]
 * @example
 * ```html
 * <div data-ax5autocomplete="ax1" data-ax5autocomplete-config='{
 *  multiple: true,
 *  editable: true,
 *  size: "",
 *  theme:""
 *  }'></div>
 * <script>
 * jQuery('[data-ax5autocomplete="ax1"]').ax5autocomplete();
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("getSelectedOption");
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("setValue", {value:"test", text:"test"});
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("enable");
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("disable");
 * </script>
 * ```
 */
ax5.ui.autocomplete_instance = new ax5.ui.autocomplete();
jQuery.fn.ax5autocomplete = (function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.autocomplete_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.autocomplete_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.autocomplete_instance.setValue(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "setText":
                    return ax5.ui.autocomplete_instance.setText(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "getSelectedOption":
                    return ax5.ui.autocomplete_instance.getSelectedOption(this);
                    break;
                case "enable":
                    return ax5.ui.autocomplete_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.autocomplete_instance.disable(this);
                    break;
                case "blur":
                    return ax5.ui.autocomplete_instance.blur(this);
                case "align":
                    return ax5.ui.autocomplete_instance.align(this);
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
                ax5.ui.autocomplete_instance.bind(config);
            });
        }
        return this;
    }
})();