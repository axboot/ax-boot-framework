/**
 * ax5.ui.picker_instance
 * @type {ax5picker}
 * @example
 * ```js
 * // picker 기본 속성을 변경해야 한다면
 * ax5.ui.picker_instance.setConfig({
 * });
 *
 * ```
 */
if (ax5 && ax5.ui && ax5.ui.picker) {
    ax5.ui.picker_instance = new ax5.ui.picker();

    jQuery.fn.ax5picker = (function () {
        return function (config) {
            if (ax5.util.isString(arguments[0])) {
                var methodName = arguments[0];

                switch (methodName) {
                    case "open":
                        return ax5.ui.picker_instance.open(this);
                        break;
                    case "close":
                        return ax5.ui.picker_instance.close(this);
                        break;
                    case "setValue":
                        return ax5.ui.picker_instance.setContentValue(this, arguments[1], arguments[2]);
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
                    config = jQuery.extend(true, config, defaultConfig);
                    ax5.ui.picker_instance.bind(config);
                });
            }
            return this;
        };
    })();
}
