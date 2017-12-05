/**
 * @method axboot.ajax
 * @param {Object} http
 * @param {String} http.type
 * @param {String} http.url
 * @param {Object|String} http.data
 * @param {Function} http.callback
 * @param {Function} http.onError
 * @param {Function} http.always
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
    contentType: 'application/json; charset=UTF-8'
  };

  return function (http) {
    var jqxhr, httpOpts, callback, onerror, always;
    var options = $.extend(true, {}, defaultOption, http.options);
    if (!options.nomask) axAJAXMask.open();

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

    if (http.single) {
      var keepGoing = true;
      queue.forEach(function (n) {
        if (n.k === http.type + "~" + http.url) {
          keepGoing = false;
        }
      });
      if (!keepGoing) return false;
    }

    queue.push({k: http.type + "~" + http.url});

    $.extend(http, httpOpts);

    callback = http.callback;
    always = http.always;
    onerror = http.onError || options.onError;

    jqxhr = $.ajax(http);
    jqxhr
      .done(function (data, textStatus, jqXHR) {
        if (typeof data == "string") {
          arguments[0] = data = (data == "") ? {} : JSON.parse(data);
        }

        if (data.redirect && options.apiType != "login") {
          location.href = data.redirect;
          return;
        }

        if (data.error) {
          if (onerror) {
            onerror(data.error);
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

      })
      .fail(function (data, textStatus, msg) {
        if (msg == "") {

        }
        else {
          if (onerror) onerror({message: msg}); // callback
        }
      })
      .always(function (data, textStatus, jqXHR) {
        queue.pop();

        // 프레임 셋에 타이머 초기화.
        if (top.fnObj && top.fnObj.activityTimerView) {
          top.fnObj.activityTimerView.update();
        }

        if (always) always.apply(this, [data, textStatus, jqXHR]); // always
        if (!options.nomask) if (queue.length == 0) axAJAXMask.close(300);
      });
  }
})();