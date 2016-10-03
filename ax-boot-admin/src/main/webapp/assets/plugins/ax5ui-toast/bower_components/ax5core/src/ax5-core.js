(function () {
    'use strict';

    // root of function
    var root = this, win = this;
    var doc = (win) ? win.document : null, docElem = (win) ? win.document.documentElement : null;
    var reIsJson = /^(["'](\\.|[^"\\\n\r])*?["']|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/,
        reMs = /^-ms-/,
        reSnakeCase = /[\-_]([\da-z])/gi,
        reCamelCase = /([A-Z])/g,
        reDot = /\./,
        reInt = /[-|+]?[\D]/gi,
        reNotNum = /\D/gi,
        reMoneySplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])'),
        reAmp = /&/g,
        reEq = /=/,
        reClassNameSplit = /[ ]+/g,

        /** @namespace {Object} ax5 */
        ax5 = {}, info, U, dom;

    /**
     * guid
     * @member {Number} ax5.guid
     */
    ax5.guid = 1;
    /**
     * ax5.guid를 구하고 증가시킵니다.
     * @method ax5.getGuid
     * @returns {Number} guid
     */
    ax5.getGuid = function () {
        return ax5.guid++;
    };

    /**
     * 상수모음
     * @namespace ax5.info
     */
    ax5.info = info = (function () {
        /**
         * ax5 version
         * @member {String} ax5.info.version
         */
        var version = "0.0.1";
        /**
         * ax5 library path
         * @member {String} ax5.info.baseUrl
         */
        var baseUrl = "";
        /**
         * ax5 에러 출력메세지 사용자 재 정의
         * @member {Object} ax5.info.onerror
         * @examples
         * ```
         * ax5.info.onerror = function(){
		 *  console.log(arguments);
		 * }
         * ```
         */
        var onerror = function () {
            console.error(U.toArray(arguments).join(":"));
        };

        /**
         * event keyCodes
         * @member {Object} ax5.info.eventKeys
         * @example
         * ```
         * {
		 * 	BACKSPACE: 8, TAB: 9,
		 * 	RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
		 * 	HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
		 * }
         * ```
         */
        var eventKeys = {
            BACKSPACE: 8, TAB: 9,
            RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
            HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
        };

        var weekNames = [
            {label: "SUN"},
            {label: "MON"},
            {label: "TUE"},
            {label: "WED"},
            {label: "THU"},
            {label: "FRI"},
            {label: "SAT"}
        ];

        /**
         * 사용자 브라우저 식별용 오브젝트
         * @member {Object} ax5.info.browser
         * @example
         * ```
         * console.log( ax5.info.browser );
         * //Object {name: "chrome", version: "39.0.2171.71", mobile: false}
         * ```
         */
        var browser = (function (ua, mobile, browserName, match, browser, browserVersion) {
            if (!win || !win.navigator) return {};

            ua = navigator.userAgent.toLowerCase(), mobile = (ua.search(/mobile/g) != -1), browserName, match, browser, browserVersion;

            if (ua.search(/iphone/g) != -1) {
                return {name: "iphone", version: 0, mobile: true}
            }
            else if (ua.search(/ipad/g) != -1) {
                return {name: "ipad", version: 0, mobile: true}
            }
            else if (ua.search(/android/g) != -1) {
                match = /(android)[ \/]([\w.]+)/.exec(ua) || [];
                browserVersion = (match[2] || "0");
                return {name: "android", version: browserVersion, mobile: mobile}
            }
            else {
                browserName = "";
                match = /(opr)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
                browser = (match[1] || "");
                browserVersion = (match[2] || "0");

                if (browser == "msie") browser = "ie";
                return {
                    name: browser,
                    version: browserVersion,
                    mobile: mobile
                }
            }
            ua = null, mobile = null, browserName = null, match = null, browser = null, browserVersion = null;
        })();
        /**
         * 브라우저 여부
         * @member {Boolean} ax5.info.isBrowser
         */
        var isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && win.document);
        /**
         * 브라우저에 따른 마우스 휠 이벤트이름
         * @member {Object} ax5.info.wheelEnm
         */
        var wheelEnm = (win && (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel");

        /**
         * 첫번째 자리수 동사 - (필요한것이 없을때 : 4, 실행오류 : 5)
         * 두번째 자리수 목적어 - 문자열 0, 숫자 1, 배열 2, 오브젝트 3, 함수 4, DOM 5, 파일 6, 기타 7
         * 세번째 자리수 옵션
         * @member {Object} ax5.info.errorMsg
         */
        var errorMsg = {};

        /**
         * 현재 페이지의 Url 정보를 리턴합니다.
         * @method ax5.info.urlUtil
         * @returns {Object}
         * @example
         * ```
         * console.log( ax5.util.toJson( ax5.util.urlUtil() ) );
         * {
		 *	"baseUrl": "http://ax5:2018",
		 *	"href": "http://ax5:2018/samples/index.html?a=1&b=1#abc",
		 *	"param": "a=1&b=1",
		 *	"referrer": "",
		 *	"pathname": "/samples/index.html",
		 *	"hostname": "ax5",
		 *	"port": "2018",
		 *	"url": "http://ax5:2018/samples/index.html",
		 *	"hashdata": "abc"
		 * }
         * ```
         */
        function urlUtil(url, urls) {
            url = {
                href: win.location.href,
                param: win.location.search,
                referrer: doc.referrer,
                pathname: win.location.pathname,
                hostname: win.location.hostname,
                port: win.location.port
            }, urls = url.href.split(/[\?#]/);
            url.param = url.param.replace("?", "");
            url.url = urls[0];
            if (url.href.search("#") > -1) {
                url.hashdata = U.last(urls);
            }
            urls = null;
            url.baseUrl = U.left(url.href, "?").replace(url.pathname, "");
            return url;
        }

        /**
         * ax5 error를 반환합니다.
         * @method ax5.info.getError
         * @returns {Object}
         * @example
         * ```
         * if(!this.selectedFile){
		 *      if (cfg.onEvent) {
		 *      	var that = {
		 *      		action: "error",
		 *      		error: ax5.info.getError("single-uploader", "460", "upload")
		 *      	};
		 *      	cfg.onEvent.call(that, that);
		 *      }
		 *      return this;
		 * }
         * ```
         */
        function getError(className, errorCode, methodName) {
            if (info.errorMsg && info.errorMsg[className]) {
                return {
                    className: className,
                    errorCode: errorCode,
                    methodName: methodName,
                    msg: info.errorMsg[className][errorCode]
                };
            }
            else {
                return {className: className, errorCode: errorCode, methodName: methodName};
            }
        }

        var supportTouch = (win) ? (('ontouchstart' in win) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) : false;

        return {
            errorMsg: errorMsg,
            version: version,
            baseUrl: baseUrl,
            onerror: onerror,
            eventKeys: eventKeys,
            weekNames: weekNames,
            browser: browser,
            isBrowser: isBrowser,
            supportTouch: supportTouch,
            wheelEnm: wheelEnm,
            urlUtil: urlUtil,
            getError: getError
        };
    })();

    /**
     * Refer to this by {@link ax5}.
     * @namespace ax5.util
     */
    ax5['util'] = U = (function () {
        var _toString = Object.prototype.toString;

        /**
         * Object나 Array의 아이템으로 사용자 함수를 호출합니다.
         * @method ax5.util.each
         * @param {Object|Array} O
         * @param {Function} _fn
         * @example
         * ```js
         * var axf = ax5.util;
         * axf.each([0,1,2], function(){
		 * 	// with this
		 * });
         * axf.each({a:1, b:2}, function(){
		 * 	// with this
		 * });
         * ```
         */
        function each(O, _fn) {
            if (isNothing(O)) return [];
            var key, i = 0, l = O.length,
                isObj = l === undefined || typeof O === "function";
            if (isObj) {
                for (key in O) {
                    if (typeof O[key] != "undefined")
                        if (_fn.call(O[key], key, O[key]) === false) break;
                }
            }
            else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined")
                        if (_fn.call(O[i], i, O[i++]) === false) break;
                }
            }
            return O;
        }

        // In addition to using the http://underscorejs.org : map, reduce, reduceRight, find
        /**
         * 원본 아이템들을 이용하여 사용자 함수의 리턴값으로 이루어진 새로운 배열을 만듭니다.
         * @method ax5.util.map
         * @param {Object|Array} O
         * @param {Function} _fn
         * @returns {Array}
         * @example
         * ```js
         * var myArray = [0,1,2,3,4];
         * var myObject = {a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
		 *    fn: function(abcdd){
		 *        return abcdd;
		 *    }
		 * };
         *
         * var _arr = ax5.util.map( myArray,  function(index, I){
		 *    return index+1;
		 * });
         * console.log(_arr);
         * // [1, 2, 3, 4, 5]
         *
         * var _arr = ax5.util.map( myObject,  function(k, v){
		 *    return v * 2;
		 * });
         * console.log(_arr);
         * // [2, 4, NaN, NaN]
         * ```
         */
        function map(O, _fn) {
            if (isNothing(O)) return [];
            var key, i = 0, l = O.length, results = [], fnResult;
            if (isObject(O)) {
                for (key in O) {
                    if (typeof O[key] != "undefined") {
                        fnResult = undefined;
                        if ((fnResult = _fn.call(O[key], key, O[key])) === false) break;
                        else results.push(fnResult);
                    }
                }
            }
            else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined") {
                        fnResult = undefined;
                        if ((fnResult = _fn.call(O[i], i, O[i++])) === false) break;
                        else results.push(fnResult);
                    }
                }
            }
            return results;
        }

        /**
         * 원본 아이템들을 이용하여 사용자 함수의 리턴값이 참인 아이템의 위치나 키값을 반환합니다.
         * @method ax5.util.search
         * @param {Object|Array} O
         * @param {Function|String|Number} _fn - 함수 또는 값
         * @returns {Number|String}
         * @example
         * ```js
         * var myArray = [0,1,2,3,4,5,6];
         * var myObject = {a:"123","b":"123",c:123};
         *
         * ax5.util.search(myArray,  function(){
		 *    return this > 3;
		 * });
         * // 4
         * ax5.util.search(myObject,  function(k, v){
		 *    return v === 123;
		 * });
         * // "c"
         * ax5.util.search([1,2,3,4], 3);
         * // 2
         * ax5.util.search([1,2], 4);
         * // -1
         * ax5.util.search(["name","value"], "value");
         * // 1
         * ax5.util.search(["name","value"], "values");
         * // -1
         * ax5.util.search({k1:"name",k2:"value"}, "value2");
         * // -1
         * ax5.util.search({k1:"name",k2:"value"}, "value");
         * // "k2"
         * ```
         */
        function search(O, _fn) {
            if (isNothing(O)) return -1;
            var key, i = 0, l = O.length;
            if (isObject(O)) {
                for (key in O) {
                    if (typeof O[key] != "undefined" && isFunction(_fn) && _fn.call(O[key], key, O[key])) {
                        return key;
                        break;
                    }
                    else if (O[key] == _fn) {
                        return key;
                        break;
                    }
                }
            }
            else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined" && isFunction(_fn) && _fn.call(O[i], i, O[i])) {
                        return i;
                        break;
                    }
                    else if (O[i] == _fn) {
                        return i;
                        break;
                    }
                    i++;
                }
            }
            return -1;
        }

        /**
         * @method ax5.util.sum
         * @param {Array|Object} O
         * @param {Number} [defaultValue]
         * @param {Function} _fn
         * @returns {Number}
         * @example
         * ```js
         * var arr = [
         *  {name: "122", value: 9},
         *  {name: "122", value: 10},
         *  {name: "123", value: 11}
         * ];
         *
         * var rs = ax5.util.sum(arr, function () {
         *  if(this.name == "122") {
         *      return this.value;
         *  }
         * });
         * console.log(rs); // 19
         *
         * console.log(ax5.util.sum(arr, 10, function () {
         *   return this.value;
         * }));
         * // 40
         * ```
         */
        function sum(O, defaultValue, _fn) {
            var i, l, tokenValue;
            if (isFunction(defaultValue) && typeof _fn === "undefined") {
                _fn = defaultValue;
                defaultValue = 0;
            }
            if (typeof defaultValue === "undefined") defaultValue = 0;

            if (isArray(O)) {
                i = 0;
                l = O.length;
                for (; i < l; i++) {
                    if (typeof O[i] !== "undefined") {
                        if (( tokenValue = _fn.call(O[i], O[i]) ) === false) break;
                        else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue;
            }
            else if (isObject(O)) {
                for (i in O) {
                    if (typeof O[i] != "undefined") {
                        if (( tokenValue = _fn.call(O[i], O[i]) ) === false) break;
                        else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue;
            }
            else {
                console.error("argument error : ax5.util.sum - use Array or Object");
                return defaultValue;
            }
        }


        /**
         * @method ax5.util.avg
         * @param {Array|Object} O
         * @param {Number} [defaultValue]
         * @param {Function} _fn
         * @returns {Number}
         * @example
         * ```js
         * var arr = [
         *  {name: "122", value: 9},
         *  {name: "122", value: 10},
         *  {name: "123", value: 11}
         * ];
         *
         * var rs = ax5.util.avg(arr, function () {
         *      return this.value;
         * });
         *
         * console.log(rs); // 10
         * ```
         */
        function avg(O, defaultValue, _fn) {
            var i, l, tokenValue;
            if (isFunction(defaultValue) && typeof _fn === "undefined") {
                _fn = defaultValue;
                defaultValue = 0;
            }
            if (typeof defaultValue === "undefined") defaultValue = 0;

            if (isArray(O)) {
                i = 0;
                l = O.length;
                for (; i < l; i++) {
                    if (typeof O[i] !== "undefined") {
                        if (( tokenValue = _fn.call(O[i], O[i]) ) === false) break;
                        else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue / l;
            }
            else if (isObject(O)) {
                for (i in O) {
                    if (typeof O[i] != "undefined") {
                        if (( tokenValue = _fn.call(O[i], O[i]) ) === false) break;
                        else if (typeof tokenValue !== "undefined") defaultValue += tokenValue;
                    }
                }
                return defaultValue / l;
            }
            else {
                console.error("argument error : ax5.util.sum - use Array or Object");
                return defaultValue;
            }
        }

        /**
         * 배열의 왼쪽에서 오른쪽으로 연산을 진행하는데 수행한 결과가 왼쪽 값으로 반영되어 최종 왼쪽 값을 반환합니다.
         * @method ax5.util.reduce
         * @param {Array|Object} O
         * @param {Function} _fn
         * @returns {Alltypes}
         * @example
         * ```js
         * var aarray = [5,4,3,2,1];
         * result = ax5.util.reduce( aarray, function(p, n){
		 *   return p * n;
		 * });
         * console.log(result, aarray);
         * // 120 [5, 4, 3, 2, 1]
         *
         * ax5.util.reduce({a:1, b:2}, function(p, n){
		 *    return parseInt(p|0) + parseInt(n);
		 * });
         * // 3
         * ```
         */
        function reduce(O, _fn) {
            var i, l, tokenItem;
            if (isArray(O)) {
                i = 0, l = O.length, tokenItem = O[i];
                for (; i < l - 1;) {
                    if (typeof O[i] != "undefined") {
                        if (( tokenItem = _fn.call(root, tokenItem, O[++i]) ) === false) break;
                    }
                }
                return tokenItem;
            }
            else if (isObject(O)) {
                for (i in O) {
                    if (typeof O[i] != "undefined") {
                        if (( tokenItem = _fn.call(root, tokenItem, O[i]) ) === false) break;
                    }
                }
                return tokenItem;
            }
            else {
                console.error("argument error : ax5.util.reduce - use Array or Object");
                return null;
            }
        }

        /**
         * 배열의 오른쪽에서 왼쪽으로 연산을 진행하는데 수행한 결과가 오른쪽 값으로 반영되어 최종 오른쪽 값을 반환합니다.
         * @method ax5.util.reduceRight
         * @param {Array} O
         * @param {Function} _fn
         * @returns {Alltypes}
         * @example
         * ```js
         * var aarray = [5,4,3,2,1];
         * result = ax5.util.reduceRight( aarray, function(p, n){
		 *    console.log( n );
		 *    return p * n;
		 * });
         * console.log(result, aarray);
         * 120 [5, 4, 3, 2, 1]
         * ```
         */
        function reduceRight(O, _fn) {
            var i = O.length - 1, tokenItem = O[i];
            for (; i > 0;) {
                if (typeof O[i] != "undefined") {
                    if (( tokenItem = _fn.call(root, tokenItem, O[--i]) ) === false) break;
                }
            }
            return tokenItem;
        }

        /**
         * 배열또는 오브젝트의 각 아이템을 인자로 하는 사용자 함수의 결과가 참인 아이템들의 배열을 반환합니다.
         * @method ax5.util.filter
         * @param {Object|Array} O
         * @param {Function} _fn
         * @returns {Array}
         * @example
         * ```js
         * var aarray = [5,4,3,2,1];
         * result = ax5.util.filter( aarray, function(){
		 *    return this % 2;
		 * });
         * console.log(result);
         * // [5, 3, 1]
         *
         * var filObject = {a:1, s:"string", oa:{pickup:true, name:"AXISJ"}, os:{pickup:true, name:"AX5"}};
         * result = ax5.util.filter( filObject, function(){
		 * 	return this.pickup;
		 * });
         * console.log( ax5.util.toJson(result) );
         * // [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
         * ```
         */
        function filter(O, _fn) {
            if (isNothing(O)) return [];
            var k, i = 0, l = O.length, results = [], fnResult;
            if (isObject(O)) {
                for (k in O) {
                    if (typeof O[k] != "undefined") {
                        if (fnResult = _fn.call(O[k], k, O[k])) results.push(O[k]);
                    }
                }
            }
            else {
                for (; i < l;) {
                    if (typeof O[i] != "undefined") {
                        if (fnResult = _fn.call(O[i], i, O[i])) results.push(O[i]);
                        i++;
                    }
                }
            }
            return results;
        }

        /**
         * Object를 JSONString 으로 반환합니다.
         * @method ax5.util.toJson
         * @param {Object|Array} O
         * @returns {String} JSON
         * @example
         * ```js
         * var ax = ax5.util;
         * var myObject = {
		 *    a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
		 *    fn: function(abcdd){
		 *        return abcdd;
		 *    }
		 * };
         * console.log( ax.toJson(myObject) );
         * ```
         */
        function toJson(O) {
            var jsonString = "";
            if (ax5.util.isArray(O)) {
                var i = 0, l = O.length;
                jsonString += "[";
                for (; i < l; i++) {
                    if (i > 0) jsonString += ",";
                    jsonString += toJson(O[i]);
                }
                jsonString += "]";
            }
            else if (ax5.util.isObject(O)) {
                jsonString += "{";
                var jsonObjectBody = [];
                each(O, function (key, value) {
                    jsonObjectBody.push('"' + key + '": ' + toJson(value));
                });
                jsonString += jsonObjectBody.join(", ");
                jsonString += "}";
            }
            else if (ax5.util.isString(O)) {
                jsonString = '"' + O + '"';
            }
            else if (ax5.util.isNumber(O)) {
                jsonString = O;
            }
            else if (ax5.util.isUndefined(O)) {
                jsonString = "undefined";
            }
            else if (ax5.util.isFunction(O)) {
                jsonString = '"{Function}"';
            }
            else {
                jsonString = O;
            }
            return jsonString;
        }

        /**
         * 관용의 JSON Parser
         * @method ax5.util.parseJson
         * @param {String} JSONString
         * @param {Boolean} [force] - 강제 적용 여부 (json 문자열 검사를 무시하고 오브젝트 변환을 시도합니다.)
         * @returns {Object}
         * @example
         * ```
         * console.log(ax5.util.parseJson('{"a":1}'));
         * // Object {a: 1}
         * console.log(ax5.util.parseJson("{'a':1, 'b':'b'}"));
         * // Object {a: 1, b: "b"}
         * console.log(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", true));
         * // Object {a: 1, b: function}
         * console.log(ax5.util.parseJson("{a:1}"));
         * // Object {a: 1}
         * console.log(ax5.util.parseJson("[1,2,3]"));
         * // [1, 2, 3]
         * console.log(ax5.util.parseJson("['1','2','3']"));
         * // ["1", "2", "3"]
         * console.log(ax5.util.parseJson("[{'a':'99'},'2','3']"));
         * // [Object, "2", "3"]
         * ```
         */
        function parseJson(str, force) {
            if (force || (reIsJson).test(str)) {
                try {
                    return (new Function('', 'return ' + str))();
                } catch (e) {
                    return {error: 500, msg: 'syntax error'};
                }
            }
            else {
                return {error: 500, msg: 'syntax error'};
            }
        }

        /**
         * 인자의 타입을 반환합니다.
         * @method ax5.util.getType
         * @param {Object|Array|String|Number|Element|Etc} O
         * @returns {String} window|element|object|array|function|string|number|undefined|nodelist
         * @example
         * ```js
         * var axf = ax5.util;
         * var a = 11;
         * var b = "11";
         * console.log( axf.getType(a) );
         * console.log( axf.getType(b) );
         * ```
         */
        function getType(O) {
            var typeName;
            if (O != null && O == O.window) {
                typeName = "window";
            }
            else if (!!(O && O.nodeType == 1)) {
                typeName = "element";
            }
            else if (!!(O && O.nodeType == 11)) {
                typeName = "fragment";
            }
            else if (typeof O === "undefined") {
                typeName = "undefined";
            }
            else if (_toString.call(O) == "[object Object]") {
                typeName = "object";
            }
            else if (_toString.call(O) == "[object Array]") {
                typeName = "array";
            }
            else if (_toString.call(O) == "[object String]") {
                typeName = "string";
            }
            else if (_toString.call(O) == "[object Number]") {
                typeName = "number";
            }
            else if (_toString.call(O) == "[object NodeList]") {
                typeName = "nodelist";
            }
            else if (typeof O === "function") {
                typeName = "function";
            }
            return typeName;
        }

        /**
         * 오브젝트가 window 인지 판단합니다.
         * @method ax5.util.isWindow
         * @param {Object} O
         * @returns {Boolean}
         */
        function isWindow(O) {
            return O != null && O == O.window;
        }

        /**
         * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
         * @method ax5.util.isElement
         * @param {Object} O
         * @returns {Boolean}
         */
        function isElement(O) {
            return !!(O && (O.nodeType == 1 || O.nodeType == 11));
        }

        /**
         * 오브젝트가 Object인지 판단합니다.
         * @method ax5.util.isObject
         * @param {Object} O
         * @returns {Boolean}
         */
        function isObject(O) {
            return _toString.call(O) == "[object Object]";
        }

        /**
         * 오브젝트가 Array인지 판단합니다.
         * @method ax5.util.isArray
         * @param {Object} O
         * @returns {Boolean}
         */
        function isArray(O) {
            return _toString.call(O) == "[object Array]";
        }

        /**
         * 오브젝트가 Function인지 판단합니다.
         * @method ax5.util.isFunction
         * @param {Object} O
         * @returns {Boolean}
         */
        function isFunction(O) {
            return typeof O === "function";
        }

        /**
         * 오브젝트가 String인지 판단합니다.
         * @method ax5.util.isString
         * @param {Object} O
         * @returns {Boolean}
         */
        function isString(O) {
            return _toString.call(O) == "[object String]";
        }

        /**
         * 오브젝트가 Number인지 판단합니다.
         * @method ax5.util.isNumber
         * @param {Object} O
         * @returns {Boolean}
         */
        function isNumber(O) {
            return _toString.call(O) == "[object Number]";
        }

        /**
         * 오브젝트가 NodeList인지 판단합니다.
         * @method ax5.util.isNodelist
         * @param {Object} O
         * @returns {Boolean}
         */
        function isNodelist(O) {
            return !!(_toString.call(O) == "[object NodeList]" || (typeof O !== "undefined" && O && O[0] && O[0].nodeType == 1));
        }

        /**
         * 오브젝트가 undefined인지 판단합니다.
         * @method ax5.util.isUndefined
         * @param {Object} O
         * @returns {Boolean}
         */
        function isUndefined(O) {
            return typeof O === "undefined";
        }

        /**
         * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
         * @method ax5.util.isNothing
         * @param {Object} O
         * @returns {Boolean}
         */
        function isNothing(O) {
            return (typeof O === "undefined" || O === null || O === "");
        }

        function isDate(O) {
            return (O instanceof Date && !isNaN(O.valueOf()));
        }

        function isDateFormat(O) {
            var
                result = false
                ;
            if (!O) {
            }
            else if (O instanceof Date && !isNaN(O.valueOf())) {
                result = true;
            }
            else {
                if (O.length > 7) {
                    if(date(O) instanceof Date){
                        return true;
                    }
                }
                O = O.replace(/\D/g, '');
                if (O.length > 7) {
                    var
                        mm = O.substr(4, 2),
                        dd = O.substr(6, 2)
                        ;
                    O = date(O);
                    if (O.getMonth() == (mm - 1) && O.getDate() == dd) {
                        result = true;
                    }
                }
            }
            return result;
        }

        /**
         * 오브젝트의 첫번째 아이템을 반환합니다.
         * @method ax5.util.first
         * @param {Object|Array} O
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.first({a:1, b:2});
         * // Object {a: 1}
         * ```
         */
        function first(O) {
            if (isObject(O)) {
                var keys = Object.keys(O);
                var item = {};
                item[keys[0]] = O[keys[0]];
                return item;
            }
            else if (isArray(O)) {
                return O[0];
            }
            else {
                console.error("ax5.util.object.first", "argument type error");
                return undefined;
            }
        }

        /**
         * 오브젝트의 마지막 아이템을 반환합니다.
         * @method ax5.util.last
         * @param {Object|Array} O
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.last({a:1, b:2});
         * // Object {b: 2}
         * ```
         */
        function last(O) {
            if (isObject(O)) {
                var keys = Object.keys(O);
                var item = {};
                item[keys[keys.length - 1]] = O[keys[keys.length - 1]];
                return item;
            }
            else if (isArray(O)) {
                return O[O.length - 1];
            }
            else {
                console.error("ax5.util.object.last", "argument type error");
                return undefined;
            }
        }

        /**
         * 쿠키를 설정합니다.
         * @method ax5.util.setCookie
         * @param {String} cname - 쿠키이름
         * @param {String} cvalue - 쿠키값
         * @param {Number} [exdays] - 쿠키 유지일수
         * @param {Object} [opts] - path, domain 설정 옵션
         * @example
         * ```js
         * ax5.util.setCookie("jslib", "AX5");
         * ax5.util.setCookie("jslib", "AX5", 3);
         * ax5.util.setCookie("jslib", "AX5", 3, {path:"/", domain:".axisj.com"});
         * ```
         */
        function setCookie(cn, cv, exdays, opts) {
            var expire;
            if (typeof exdays === "number") {
                expire = new Date();
                expire.setDate(expire.getDate() + exdays);
            }
            opts = opts || {};
            return (doc.cookie = [
                escape(cn), '=', escape(cv),
                expire ? "; expires=" + expire.toUTCString() : "", // use expires attribute, max-age is not supported by IE
                opts.path ? "; path=" + opts.path : "",
                opts.domain ? "; domain=" + opts.domain : "",
                opts.secure ? "; secure" : ""
            ].join(""));
        }

        /**
         * 쿠키를 가져옵니다.
         * @method ax5.util.getCookie
         * @param {String} cname
         * @returns {String} cookie value
         * @example
         * ```js
         * ax5.util.getCookie("jslib");
         * ```
         */
        function getCookie(cname) {
            var name = cname + "=";
            var ca = doc.cookie.split(';'), i = 0, l = ca.length;
            for (; i < l; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
            }
            return "";
        }

        /**
         * jsonString 으로 alert 합니다.
         * @method ax5.util.alert
         * @param {Object|Array|String|Number} O
         * @returns {Object|Array|String|Number} O
         * @example ```js
         * ax5.util.alert({a:1,b:2});
         * ax5.util.alert("정말?");
         * ```
         */
        function alert(O) {
            win.alert(toJson(O));
            return O;
        }

        /**
         * 문자열의 특정 문자열까지 잘라주거나 원하는 포지션까지 잘라줍니다.
         * @method ax5.util.left
         * @param {String} str - 문자열
         * @param {String|Number} pos - 찾을 문자열 또는 포지션
         * @returns {String}
         * @example
         * ```js
         * ax5.util.left("abcd.efd", 3);
         * // abc
         * ax5.util.left("abcd.efd", ".");
         * // abcd
         * ```
         */
        function left(str, pos) {
            if (typeof str === "undefined" || typeof pos === "undefined") return "";
            if (isString(pos)) {
                return (str.indexOf(pos) > -1) ? str.substr(0, str.indexOf(pos)) : "";
            }
            else if (isNumber(pos)) {
                return str.substr(0, pos);
            }
            else {
                return "";
            }
        }

        /**
         * 문자열의 특정 문자열까지 잘라주거나 원하는 포지션까지 잘라줍니다.
         * @method ax5.util.right
         * @param {String} str - 문자열
         * @param {String|Number} pos - 찾을 문자열 또는 포지션
         * @returns {String}
         * @example
         * ```js
         * ax5.util.right("abcd.efd", 3);
         * // efd
         * ax5.util.right("abcd.efd", ".");
         * // efd
         * ```
         */
        function right(str, pos) {
            if (typeof str === "undefined" || typeof pos === "undefined") return "";
            str = '' + str;
            if (isString(pos)) {
                return (str.lastIndexOf(pos) > -1) ? str.substr(str.lastIndexOf(pos) + 1) : "";
            }
            else if (isNumber(pos)) {
                return str.substr(str.length - pos);
            }
            else {
                return "";
            }
        }

        /**
         * css형 문자열이나 특수문자가 포함된 문자열을 카멜케이스로 바꾸어 반환합니다.
         * @method ax5.util.camelCase
         * @param {String} str
         * @returns {String}
         * @example
         * ```js
         * ax5.util.camelCase("inner-width");
         * ax5.util.camelCase("innerWidth");
         * // innerWidth
         * ```
         */
        function camelCase(str) {
            return str.replace(reMs, "ms-").replace(reSnakeCase, function (all, letter) {
                return letter.toUpperCase();
            });
        }

        /**
         * css형 문자열이나 카멜케이스문자열을 스네이크 케이스 문자열로 바꾸어 반환합니다.
         * @method ax5.util.snakeCase
         * @param {String} str
         * @returns {String}
         * @example
         * ```js
         * ax5.util.snakeCase("innerWidth");
         * ax5.util.snakeCase("inner-Width");
         * ax5.util.snakeCase("innerWidth");
         * // inner-width
         * ```
         */
        function snakeCase(str) {
            return camelCase(str).replace(reCamelCase, function (all, letter) {
                return "-" + letter.toLowerCase();
            });
        }

        /**
         * 문자열에서 -. 을 제외한 모든 문자열을 제거하고 숫자로 반환합니다. 옵션에 따라 원하는 형식의 숫자로 변환 할 수 도 있습니다.
         * @method ax5.util.number
         * @param {String|Number} str
         * @param {Object} cond - 옵션
         * @returns {String|Number}
         * @example
         * ```js
         * var cond = {
		 * 	round: {Number|Boolean} - 반올림할 자릿수,
		 * 	money: {Boolean} - 통화,
		 * 	abs: {Boolean} - 절대값,
		 * 	byte: {Boolean} - 바이트
		 * }
         *
         * console.log(ax5.util.number(123456789.678, {round:1}));
         * console.log(ax5.util.number(123456789.678, {round:1, money:true}));
         * console.log(ax5.util.number(123456789.678, {round:2, byte:true}));
         * console.log(ax5.util.number(-123456789.8888, {abs:true, round:2, money:true}));
         * console.log(ax5.util.number("A-1234~~56789.8~888PX", {abs:true, round:2, money:true}));
         *
         * //123456789.7
         * //123,456,789.7
         * //117.7MB
         * //123,456,789.89
         * //123,456,789.89
         * ```
         */
        function number(str, cond) {
            var result, pair = ('' + str).split(reDot), isMinus = (Number(pair[0]) < 0 || pair[0] == "-0"), returnValue = 0.0;
            pair[0] = pair[0].replace(reInt, "");
            if (pair[1]) {
                pair[1] = pair[1].replace(reNotNum, "");
                returnValue = Number(pair[0] + "." + pair[1]) || 0;
            }
            else {
                returnValue = Number(pair[0]) || 0;
            }
            result = (isMinus) ? -returnValue : returnValue;

            each(cond, function (k, c) {
                if (k == "round") {
                    if (isNumber(c)) {
                        if (c < 0) {
                            result = +(Math.round(result + "e-" + Math.abs(c)) + "e+" + Math.abs(c));
                        }
                        else {
                            result = +(Math.round(result + "e+" + c) + "e-" + c);
                        }
                    }
                    else {
                        result = Math.round(result);
                    }
                }
                if (k == "floor") {
                    result = Math.floor(result);
                }
                if (k == "ceil") {
                    result = Math.ceil(result);
                }
                else if (k == "money") {
                    result = (function (val) {
                        var txtNumber = '' + val;
                        if (isNaN(txtNumber) || txtNumber == "") {
                            return "";
                        }
                        else {
                            var arrNumber = txtNumber.split('.');
                            arrNumber[0] += '.';
                            do {
                                arrNumber[0] = arrNumber[0].replace(reMoneySplit, '$1,$2');
                            } while (reMoneySplit.test(arrNumber[0]));
                            if (arrNumber.length > 1) {
                                return arrNumber.join('');
                            }
                            else {
                                return arrNumber[0].split('.')[0];
                            }
                        }
                    })(result);
                }
                else if (k == "abs") {
                    result = Math.abs(Number(result));
                }
                else if (k == "byte") {
                    result = (function (val) {
                        val = Number(result);
                        var nUnit = "KB";
                        var myByte = val / 1024;
                        if (myByte / 1024 > 1) {
                            nUnit = "MB";
                            myByte = myByte / 1024;
                        }
                        if (myByte / 1024 > 1) {
                            nUnit = "GB";
                            myByte = myByte / 1024;
                        }
                        return number(myByte, {round: 1}) + nUnit;
                    })(result);
                }
            });

            return result;
        }

        /**
         * 배열 비슷한 오브젝트를 배열로 변환해줍니다.
         * @method ax5.util.toArray
         * @param {Object|Elements|Arguments} O
         * @returns {Array}
         * @example
         * ```js
         * ax5.util.toArray(arguments);
         * //
         * ```
         */
        function toArray(O) {
            if (typeof O.length != "undefined") return Array.prototype.slice.call(O);
            return [];
        }

        /**
         * 천번째 인자에 두번째 인자 아이템을 합쳐줍니다. concat과 같은 역할을 하지만. 인자가 Array타입이 아니어도 됩니다.
         * @method ax5.util.merge
         * @param {Array|ArrayLike} first
         * @param {Array|ArrayLike} second
         * @returns {Array} first
         * @example
         * ```
         *
         * ```
         */
        function merge(first, second) {
            var l = second.length,
                i = first.length,
                j = 0;

            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            }
            else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        }

        /**
         * 오브젝트를 파라미터형식으로 또는 파라미터를 오브젝트 형식으로 변환합니다.
         * @method ax5.util.param
         * @param {Object|Array|String} O
         * @param {String} [cond] - param|object
         * @returns {Object|String}
         * @example
         * ```
         * ax5.util.param({a:1,b:'1232'}, "param");
         * ax5.util.param("a=1&b=1232", "param");
         * // "a=1&b=1232"
         * ax5.util.param("a=1&b=1232");
         * // {a: "1", b: "1232"}
         * ```
         */
        function param(O, cond) {
            var p;
            if (isString(O) && typeof cond !== "undefined" && cond == "param") {
                return O;
            }
            else if ((isString(O) && typeof cond !== "undefined" && cond == "object") || (isString(O) && typeof cond === "undefined")) {
                p = {};
                each(O.split(reAmp), function () {
                    var item = this.split(reEq);
                    if (!p[item[0]]) p[item[0]] = item[1];
                    else {
                        if (isString(p[item[0]])) p[item[0]] = [p[item[0]]];
                        p[item[0]].push(item[1]);
                    }
                });
                return p;
            }
            else {
                p = [];
                each(O, function (k, v) {
                    p.push(k + "=" + escape(v));
                });
                return p.join('&');
            }
        }

        function encode(s) {
            return encodeURIComponent(s);
        }

        function decode(s) {
            return decodeURIComponent(s);
        }

        function error() {
            ax5.info.onerror.apply(this, arguments);
        }

        function localDate(yy, mm, dd, hh, mi, ss) {
            var utcD, localD;
            localD = new Date();
            if (typeof hh === "undefined") hh = 23;
            if (typeof mi === "undefined") mi = 59;
            utcD = new Date(Date.UTC(yy, mm, dd || 1, hh, mi, ss || 0));

            if (mm == 0 && dd == 1 && utcD.getUTCHours() + (utcD.getTimezoneOffset() / 60) < 0) {
                utcD.setUTCHours(0);
            }
            else {
                utcD.setUTCHours(utcD.getUTCHours() + (utcD.getTimezoneOffset() / 60));
            }
            return utcD;
        }

        /**
         * 날짜 형식의 문자열이나 Date객체를 조건에 맞게 처리 한 후 원하는 return 값으로 반환합니다.
         * @method ax5.util.date
         * @param {String|Date} d
         * @param {Object} cond
         * @returns {Date|String}
         * @example
         * ```js
         * ax5.util.date('2013-01-01'); // Tue Jan 01 2013 23:59:00 GMT+0900 (KST)
         * ax5.util.date((new Date()), {add:{d:10}, return:'yyyy/MM/dd'}); // "2015/07/01"
         * ax5.util.date('1919-03-01', {add:{d:10}, return:'yyyy/MM/dd hh:mm:ss'}); // "1919/03/11 23:59:00"
         * ```
         */
        function date(d, cond) {
            var yy, mm, dd, hh, mi,
                aDateTime, aTimes, aTime, aDate,
                utcD, localD,
                va;
            var ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;
            var ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

            if (isString(d)) {
                if (d.length == 0) {
                    d = new Date();
                }
                else if (d.length > 15) {
                    if (ISO_8601_FULL.test(d) || ISO_8601.test(d)) {
                        d = new Date(d);
                    } else {
                        aDateTime = d.split(/ /g), aTimes, aTime,
                            aDate = aDateTime[0].split(/\D/g),
                            yy = aDate[0];
                        mm = parseFloat(aDate[1]);
                        dd = parseFloat(aDate[2]);
                        aTime = aDateTime[1] || "09:00";
                        aTimes = aTime.substring(0, 5).split(":");
                        hh = parseFloat(aTimes[0]);
                        mi = parseFloat(aTimes[1]);
                        if (right(aTime, 2) === "AM" || right(aTime, 2) === "PM") hh += 12;
                        d = localDate(yy, mm - 1, dd, hh, mi);
                    }
                }
                else if (d.length == 14) {
                    va = d.replace(/\D/g, "");
                    d = localDate(va.substr(0, 4), va.substr(4, 2) - 1, number(va.substr(6, 2)), number(va.substr(8, 2)), number(va.substr(10, 2)), number(va.substr(12, 2)));
                }
                else if (d.length > 7) {
                    va = d.replace(/\D/g, "");
                    d = localDate(va.substr(0, 4), va.substr(4, 2) - 1, number(va.substr(6, 2)));
                }
                else if (d.length > 4) {
                    va = d.replace(/\D/g, "");
                    d = localDate(va.substr(0, 4), va.substr(4, 2) - 1, 1);
                }
                else if (d.length > 2) {
                    va = d.replace(/\D/g, "");
                    return localDate(va.substr(0, 4), va.substr(4, 2) - 1, 1);
                }
                else {
                    d = new Date();
                }
            }

            if (typeof cond === "undefined") {
                return d;
            }
            else {
                if (cond["add"]) {
                    d = (function (_d, opts) {
                        var
                            yy, mm, dd, mxdd,
                            DyMilli = ((1000 * 60) * 60) * 24;

                        if (typeof opts["d"] !== "undefined") {
                            _d.setTime(_d.getTime() + (opts["d"] * DyMilli));
                        }
                        else if (typeof opts["m"] !== "undefined") {
                            yy = _d.getFullYear();
                            mm = _d.getMonth();
                            dd = _d.getDate();
                            yy = yy + parseInt(opts["m"] / 12);
                            mm += opts["m"] % 12;
                            mxdd = daysOfMonth(yy, mm);
                            if (mxdd < dd) dd = mxdd;
                            _d = new Date(yy, mm, dd, 12);
                        }
                        else if (typeof opts["y"] !== "undefined") {
                            _d.setTime(_d.getTime() + ((opts["y"] * 365) * DyMilli));
                        }
                        else {
                            _d.setTime(_d.getTime() + (opts["y"] * DyMilli));
                        }
                        return _d;
                    })(new Date(d), cond["add"]);
                }
                if (cond["return"]) {
                    return (function () {
                        var fStr = cond["return"], nY, nM, nD, nH, nMM, nS, nDW;

                        nY = d.getUTCFullYear();
                        nM = setDigit(d.getMonth() + 1, 2);
                        nD = setDigit(d.getDate(), 2);
                        nH = setDigit(d.getHours(), 2);
                        nMM = setDigit(d.getMinutes(), 2);
                        nS = setDigit(d.getSeconds(), 2);
                        nDW = d.getDay();

                        var yre = /[^y]*(yyyy)[^y]*/gi;
                        yre.exec(fStr);
                        var regY = RegExp.$1;
                        var mre = /[^m]*(MM)[^m]*/g;
                        mre.exec(fStr);
                        var regM = RegExp.$1;
                        var dre = /[^d]*(dd)[^d]*/gi;
                        dre.exec(fStr);
                        var regD = RegExp.$1;
                        var hre = /[^h]*(hh)[^h]*/gi;
                        hre.exec(fStr);
                        var regH = RegExp.$1;
                        var mire = /[^m]*(mm)[^i]*/g;
                        mire.exec(fStr);
                        var regMI = RegExp.$1;
                        var sre = /[^s]*(ss)[^s]*/gi;
                        sre.exec(fStr);
                        var regS = RegExp.$1;
                        var dwre = /[^d]*(dw)[^w]*/gi;
                        dwre.exec(fStr);
                        var regDW = RegExp.$1;

                        if (regY === "yyyy") {
                            fStr = fStr.replace(regY, right(nY, regY.length));
                        }
                        if (regM === "MM") {
                            if (regM.length == 1) nM = (d.getMonth() + 1);
                            fStr = fStr.replace(regM, nM);
                        }
                        if (regD === "dd") {
                            if (regD.length == 1) nD = d.getDate();
                            fStr = fStr.replace(regD, nD);
                        }
                        if (regH === "hh") {
                            fStr = fStr.replace(regH, nH);
                        }
                        if (regMI === "mm") {
                            fStr = fStr.replace(regMI, nMM);
                        }
                        if (regS === "ss") {
                            fStr = fStr.replace(regS, nS);
                        }
                        if (regDW == "dw") {
                            fStr = fStr.replace(regDW, info.weekNames[nDW].label);
                        }
                        return fStr;
                    })();
                }
                else {
                    return d;
                }
            }
        }

        /**
         * 인자인 날짜가 오늘부터 몇일전인지 반환합니다. 또는 인자인 날짜가 가까운 미래에 몇일 후인지 반환합니다.
         * @method ax5.util.dday
         * @param {String|Data} d
         * @param {Object} cond
         * @returns {Number}
         * @example
         * ```js
         * ax5.util.dday('2016-01-29');
         * // 1
         * ax5.util.dday('2016-01-29', {today:'2016-01-28'});
         * // 1
         * ax5.util.dday('1977-03-29', {today:'2016-01-28', age:true});
         * // 39
         * ```
         */
        function dday(d, cond) {
            var memoryDay = date(d), DyMilli = ((1000 * 60) * 60) * 24, today = new Date(), diffnum, thisYearMemoryDay;

            function getDayTime(_d) {
                return Math.floor(_d.getTime() / DyMilli) * DyMilli;
            }

            if (typeof cond === "undefined") {
                diffnum = number((( getDayTime(memoryDay) - getDayTime(today) ) / DyMilli), {floor: true});
                return diffnum;
            }

            else {
                diffnum = number((( getDayTime(memoryDay) - getDayTime(today) ) / DyMilli), {floor: true});
                if (cond["today"]) {
                    today = date(cond.today);
                    diffnum = number((( getDayTime(memoryDay) - getDayTime(today) ) / DyMilli), {floor: true});
                }
                if (cond["thisYear"]) {
                    thisYearMemoryDay = new Date(today.getFullYear(), memoryDay.getMonth(), memoryDay.getDate());
                    diffnum = number((( getDayTime(thisYearMemoryDay) - getDayTime(today) ) / DyMilli), {floor: true});
                    if (diffnum < 0) {
                        thisYearMemoryDay = new Date(today.getFullYear() + 1, memoryDay.getMonth(), memoryDay.getDate());
                        diffnum = number((( getDayTime(thisYearMemoryDay) - getDayTime(today) ) / DyMilli), {floor: true});
                    }
                }
                if (cond["age"]) {
                    thisYearMemoryDay = new Date(today.getFullYear(), memoryDay.getMonth(), memoryDay.getDate());
                    diffnum = thisYearMemoryDay.getFullYear() - memoryDay.getFullYear();
                }

                return diffnum;
            }
        }

        /**
         * 인자인 날짜가 몇년 몇월의 몇번째 주차인지 반환합니다.
         * @method ax5.util.weeksOfMonth
         * @param {String|Data} d
         * @returns {Object}
         * @example
         * ```js
         * ax5.util.weeksOfMonth("2015-10-01"); // {year: 2015, month: 10, count: 1}
         * ax5.util.weeksOfMonth("2015-09-19"); // {year: 2015, month: 10, count: 1}
         * ```
         */
        function weeksOfMonth(d) {
            var myDate = date(d);
            return {
                year: myDate.getFullYear(),
                month: myDate.getMonth() + 1,
                count: parseInt(myDate.getDate() / 7 + 1)
            };
        }

        /**
         * 년월에 맞는 날자수를 반환합니다.
         * @method ax5.util.daysOfMonth
         * @param {Number} y
         * @param {Number} m
         * @returns {Number}
         * @examples
         * ```js
         * ax5.util.daysOfMonth(2015, 11); // 31
         * ax5.util.daysOfMonth(2015, 1); // 28
         * ```
         */
        function daysOfMonth(y, m) {
            if (m == 3 || m == 5 || m == 8 || m == 10) {
                return 30;
            }
            else if (m == 1) {
                return (((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0)) ? 29 : 28;
            }
            else {
                return 31;
            }
        }

        /**
         * 원하는 횟수 만큼 자릿수 맞춤 문자열을 포함한 문자열을 반환합니다.
         * @method ax5.util.setDigit
         * @param {String|Number} num
         * @param {Number} length
         * @param {String} [padder=0]
         * @param {Number} [radix]
         * @returns {String}
         */
        function setDigit(num, length, padder, radix) {
            var s = num.toString(radix || 10);
            return times((padder || '0'), (length - s.length)) + s;
        }

        function times(s, count) {
            return count < 1 ? '' : new Array(count + 1).join(s);
        }

        /**
         * 타겟엘리먼트의 부모 엘리멘트 트리에서 원하는 조건의 엘리먼트를 얻습니다.
         * @method ax5.util.findParentNode
         * @param {Element} _target - target element
         * @param {Object|Function} cond - 원하는 element를 찾을 조건
         * @returns {Element}
         * @example
         * ```
         * // cond 속성정의
         * var cond = {
		 * 	tagname: {String} - 태그명 (ex. a, div, span..),
		 * 	clazz: {String} - 클래스명
		 * 	[, 그 외 찾고 싶은 attribute명들]
		 * };
         * console.log(
         * console.log(
         *    ax5.util.findParentNode(e.target, {tagname:"a", clazz:"ax-menu-handel", "data-custom-attr":"attr_value"})
         * );
         * // cond 함수로 처리하기
         * jQuery('#id').bind("click.app_expand", function(e){
		 * 	var target = ax5.util.findParentNode(e.target, function(target){
		 * 		if($(target).hasClass("aside")){
		 * 			return true;
		 * 		}
		 * 		else{
		 * 			return true;
		 * 		}
		 * 	});
		 * 	//client-aside
		 * 	if(target.id !== "client-aside"){
		 * 		// some action
		 * 	}
		 * });
         * ```
         */

        function findParentNode(_target, cond) {
            if (_target) {
                while ((function () {
                    var result = true;
                    if (typeof cond === "undefined") {
                        _target = (_target.parentNode) ? _target.parentNode : false;
                    }
                    else if (isFunction(cond)) {
                        result = cond(_target);
                    }
                    else if (isObject(cond)) {
                        for (var k in cond) {
                            if (k === "tagname") {
                                if (_target.tagName.toLocaleLowerCase() != cond[k]) {
                                    result = false;
                                    break;
                                }
                            }
                            else if (k === "clazz" || k === "class_name") {
                                if ("className" in _target) {
                                    var klasss = _target.className.split(reClassNameSplit);
                                    var hasClass = false;
                                    for (var a = 0; a < klasss.length; a++) {
                                        if (klasss[a] == cond[k]) {
                                            hasClass = true;
                                            break;
                                        }
                                    }
                                    result = hasClass;
                                }
                                else {
                                    result = false;
                                    break;
                                }
                            }
                            else { // 그외 속성값들.
                                if (_target.getAttribute) {
                                    if (_target.getAttribute(k) != cond[k]) {
                                        result = false;
                                        break;
                                    }
                                }
                                else {
                                    result = false;
                                    break;
                                }
                            }
                        }
                    }
                    return !result;
                })()) {
                    if (_target.parentNode && _target.parentNode.parentNode) {
                        _target = _target.parentNode;
                    }
                    else {
                        _target = false;
                        break;
                    }
                }
            }
            return _target;
        }

        /**
         * @method ax5.util.cssNumber
         * @param {String|Number} val
         * @returns {String}
         * @example
         * ```
         * console.log(ax5.util.cssNumber("100px"))
         * console.log(ax5.util.cssNumber("100%"))
         * console.log(ax5.util.cssNumber("100"))
         * console.log(ax5.util.cssNumber(100))
         * console.log(ax5.util.cssNumber("!!100@#"))
         * ```
         */
        function cssNumber(val) {
            var re = /\D?(\d+)([a-zA-Z%]*)/i,
                found = ('' + val).match(re),
                unit = found[2] || "px"
                ;

            return found[1] + unit;
        }

        /**
         * @method ax5.util.css
         * @param {Object|String} val - CSSString or CSSObject
         * @returns {String|Object}
         * @example
         * ```
         * console.log(ax5.util.css({background: "#ccc", padding: "50px", width: "100px"}));
         * console.log(ax5.util.css('width:100px;padding: 50px; background: #ccc'));
         * ```
         */
        function css(val) {
            var returns;
            if (isObject(val)) {
                returns = '';
                for (var k in val) {
                    returns += k + ':' + val[k] + ';';
                }
                return returns;
            }
            else if (isString(val)) {
                returns = {};
                var valSplited = val.split(/[ ]*;[ ]*/g);
                valSplited.forEach(function (v) {
                    if ((v = v.trim()) !== "") {
                        var vSplited = v.split(/[ ]*:[ ]*/g);
                        returns[vSplited[0]] = vSplited[1];
                    }
                });
                return returns;
            }
        }

        /**
         * @method ax5.util.stopEvent
         * @param {Event} e
         * @example
         * ```
         * ax5.util.stopEvent(e);
         * ```
         */
        function stopEvent(e) {
            // 이벤트 중지 구문
            if (!e) var e = window.event;

            //e.cancelBubble is supported by IE -
            // this will kill the bubbling process.
            e.cancelBubble = true;
            e.returnValue = false;

            //e.stopPropagation works only in Firefox.
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            return false;
            // 이벤트 중지 구문 끝
        }

        /**
         * @method ax5.util.selectRange
         * @param {Element} el
         * @param {Element} offset
         * @example
         * ```
         * ax5.util.selectRange($("#select-test-0")); // selectAll
         * ax5.util.selectRange($("#select-test-0"), "selectAll"); //selectAll
         * ax5.util.selectRange($("#select-test-0"), "start"); // focus on start
         * ax5.util.selectRange($("#select-test-0"), "end"); // focus on end
         * ax5.util.selectRange($("#select-test-0"), [1, 5]); // select 1~5
         * ```
         */
        var selectRange = (function () {
            var processor = {
                'textRange': {
                    'selectAll': function (el, range, offset) {

                    },
                    'arr': function (el, range, offset) {
                        range.moveStart("character", offset[0]); // todo ie node select 체크필요
                        range.collapse();
                        range.moveEnd("character", offset[1]);
                    },
                    'start': function (el, range, offset) {
                        range.moveStart("character", 0);
                        range.collapse();
                    },
                    'end': function (el, range, offset) {
                        range.moveStart("character", range.text.length);
                        range.collapse();
                    }
                },
                'range': {
                    'selectAll': function (el, range, offset) {
                        range.selectNodeContents(el);
                    },
                    'arr': function (el, range, offset) {
                        if (isObject(offset[0])) {
                            range.setStart(offset[0].node, offset[0].offset);
                            range.setEnd(offset[1].node, offset[1].offset);
                        }
                        else {
                            range.setStart(el.firstChild, offset[0]);
                            range.setEnd(el.firstChild, offset[1]);
                        }
                    },
                    'start': function (el, range, offset) {
                        range.selectNodeContents(el);
                        range.collapse(true);
                    },
                    'end': function (el, range, offset) {
                        range.selectNodeContents(el);
                        range.collapse(false);
                    }
                }
            };
            return function (el, offset) {
                var range, rangeType, selection;

                if (el instanceof jQuery) {
                    el = el.get(0);
                }
                if (!el) return;

                // 레인지 타입 선택
                if (doc.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(el);
                    rangeType = "textRange";
                }
                else if (window.getSelection) {
                    selection = window.getSelection();
                    range = document.createRange();
                    rangeType = "range";
                }

                // range 적용
                if (typeof offset == "undefined") {
                    processor[rangeType].selectAll.call(this, el, range, offset);
                }
                else if (isArray(offset)) {
                    processor[rangeType].arr.call(this, el, range, offset);
                }
                else {
                    for (var key in processor[rangeType]) {
                        if (offset == key) {
                            processor[rangeType][key].call(this, el, range, offset);
                            break;
                        }
                    }
                }

                // 포커스 및 셀렉트
                if (doc.body.createTextRange) {
                    range.select();
                    el.focus();
                }
                else if (window.getSelection) {
                    el.focus();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }

            }
        })();

        /**
         * @method ax5.util.debounce
         * @param {Function} func
         * @param {Number} wait
         * @param {Boolean} immediately
         * @returns {debounced}
         * @example
         * ```js
         * var debounceFn = ax5.util.debounce(function( val ) { console.log(val); }, 300);
         * $(document.body).click(function(){
         *  debounceFn(new Date());
         * });
         * ```
         */
        var debounce = function (func, wait, immediately) {
            var timeout, removeTimeout;
            var debounced = function () {
                var args = toArray(arguments);

                if (removeTimeout) clearTimeout(removeTimeout);
                if (timeout) {
                    // 두번째 호출
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout((function (args) {
                        func.apply(this, args);
                    }).bind(this, args), wait);
                } else {
                    // 첫 호출
                    timeout = setTimeout((function (args) {
                        func.apply(this, args);
                    }).bind(this, args), (immediately) ? 0 : wait);
                }
                removeTimeout = setTimeout(function () {
                    clearTimeout(timeout);
                    timeout = null;
                }, wait);
            };
            debounced.cancel = function () {
                clearTimeout(timeout);
                clearTimeout(removeTimeout);
                timeout = null;
            };

            return debounced;
        };


        /**
         * @method ax5.util.deepCopy
         * @param {Object} obj
         * @returns {Object}
         * @example
         * ```js
         * var obj = [
         *  {name:"A", child:[{name:"a-1"}]},
         *  {name:"B", child:[{name:"b-1"}], callBack: function(){ console.log('callBack'); }}
         * ];
         * var copiedObj = ax5.util.deepCopy(obj)
         * ```
         */
        function deepCopy(obj) {
            var r, l;
            if (typeof obj == 'object') {
                if (U.isArray(obj)) {
                    l = obj.length;
                    r = new Array(l);
                    for (var i = 0; i < l; i++) {
                        r[i] = deepCopy(obj[i]);
                    }
                    return r;
                } else {
                    return jQuery.extend({}, obj);
                }
            }
            return obj;
        }

        return {
            alert: alert,
            each: each,
            map: map,
            search: search,
            reduce: reduce,
            reduceRight: reduceRight,
            filter: filter,
            sum: sum,
            avg: avg,
            toJson: toJson,
            parseJson: parseJson,
            first: first,
            last: last,
            deepCopy: deepCopy,

            left: left,
            right: right,
            getType: getType,
            isWindow: isWindow,
            isElement: isElement,
            isObject: isObject,
            isArray: isArray,
            isFunction: isFunction,
            isString: isString,
            isNumber: isNumber,
            isNodelist: isNodelist,
            isUndefined: isUndefined,
            isNothing: isNothing,
            setCookie: setCookie,
            getCookie: getCookie,
            camelCase: camelCase,
            snakeCase: snakeCase,
            number: number,
            toArray: toArray,
            merge: merge,
            param: param,
            error: error,
            date: date,
            dday: dday,
            daysOfMonth: daysOfMonth,
            weeksOfMonth: weeksOfMonth,
            setDigit: setDigit,
            times: times,
            findParentNode: findParentNode,
            cssNumber: cssNumber,
            css: css,
            isDate: isDate,
            isDateFormat: isDateFormat,
            stopEvent: stopEvent,
            selectRange: selectRange,
            debounce: debounce
        }
    })();

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = ax5;
    } else {
        root.ax5 = (function () {
            return ax5;
        })(); // ax5.ui에 연결
    }

}).call(typeof window !== "undefined" ? window : this);