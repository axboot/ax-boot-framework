/**
 * @method axboot.ajax
 * @param {Object} http
 * @param {Function} callback
 * @param {Object} [options]
 * @param {Fundtion} [options.onError]
 * @param {String} [options.contentType]
 * @param {String} [options.apiType]
 * @example
 * ```js
 *  // 기본 에러가 나면 알어서 처리 함.
 *  axboot.ajax({
 *      type: "GET",
 *      url: "/api/v1/users",
 *      data : {}
 *  }, function(response){
 *      // do something
 *  });
 *
 *  // onError 지정
 *  axboot.ajax({
 *      type: "GET",
 *      url: "/api/v1/users",
 *      data : {}
 *  }, function(response){
 *      // do something
 *  }, {
 *      onError: function(err){
 *          // console.log(err);
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

    return function (http, callback, options) {
        options = $.extend(true, {}, defaultOption, options);
        if (!options.nomask) axAJAXMask.open();

        queue.push("1");

        var jqxhr, httpOpts = {
            contentType: options.contentType
        };
        http.url = CONTEXT_PATH + http.url;
        $.extend(http, httpOpts);
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
            }else{
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