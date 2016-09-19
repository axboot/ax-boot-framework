/**
 * @type {Object} axboot.call
 * @example
 * ```js

 * ```
 */
axboot.call = (function () {

    var callClass = function (_obj) {
        this.queue = [];

        var self = this;
        var processor = function (callBack) {
            var item = self.queue.shift();
            if (ax5.util.isFunction(item)) {
                item.call(this);
                processor.call(this, callBack);
            } else if (item) {
                axboot.ajax({
                    type: item.type,
                    url: item.url,
                    data: item.data
                }, (function (res) {
                    item.callBack.call(this, res);
                    processor.call(this, callBack);
                }).bind(this), {nomask: false});
            } else {
                callBack.call(this);
            }
        };

        this.call = function (_obj) {
            this.queue.push(_obj);
            return this;
        };
        this.done = function (callBack) {
            processor.call({}, callBack);
        };
        this.call(_obj);
    };

    return function (obj) {
        return new callClass(obj);
    }

})();