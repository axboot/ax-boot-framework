/**
 * @method axboot.ajax
 * @param {Object} http
 * @param {String} http.type
 * @param {String} http.url
 * @param {Object|String} http.data
 * @param {Function} http.callback
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
axboot.ajax = (function () {

    var queue = [];
    var defaultOption = {
        apiType: "",
        contentType: 'application/json'
    };

    return function (http) {
        var jqxhr, httpOpts, callback;
        var options = $.extend(true, {}, defaultOption, http.options);
        if (!options.nomask) axAJAXMask.open();

        queue.push("1");

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

        $.extend(http, httpOpts);

        callback = http.callback;

        jqxhr = $.ajax(http);
        jqxhr.done(function (data, textStatus, jqXHR) {
            if (typeof data == "string") arguments[0] = (data == "") ? {} : (data).object();
            if (data.redirect && options.apiType != "login") {
                location.href = data.redirect;
                return;
            }

            if (data.error) {
                if (options.onError) {
                    options.onError(data.error);
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
            if (msg == "") {

            }
            else {
                if (callback) callback.apply(this, [{
                    error: {message: msg}
                }]); // callback
            }
        }).always(function (data, textStatus, jqXHR) {
            queue.pop();
            if (!options.nomask) if (queue.length == 0) axAJAXMask.close(300);
        });
    }
})();