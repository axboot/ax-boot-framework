/**
 * @Class axboot.lang
 *
 * @method axboot.lang.get
 * @param {String} _message
 * @param {*} [args]
 * @return {String}
 */
axboot.lang = (function () {
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
})();