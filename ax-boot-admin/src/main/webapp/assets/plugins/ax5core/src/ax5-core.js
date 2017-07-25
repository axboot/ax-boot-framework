(function () {
    'use strict';

    // root of function
    let root = this, win = this,
        doc = (win) ? win.document : null, docElem = (win) ? win.document.documentElement : null,
        reIsJson = /^(["'](\\.|[^"\\\n\r])*?["']|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/,
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
    ax5.getGuid = () => {
        return ax5.guid++
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
        const version = "${VERSION}";

        /**
         * ax5 library path
         * @member {String} ax5.info.baseUrl
         */
        const baseUrl = "";

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
        let onerror = () => {
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
        const eventKeys = {
            BACKSPACE: 8, TAB: 9,
            RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
            HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
        };

        /**
         * week names
         * @member {Object[]} weekNames
         * @member {string} weekNames[].label
         *
         * @example
         * ```
         * [
         *  {label: "SUN"},{label: "MON"},{label: "TUE"},{label: "WED"},{label: "THU"},{label: "FRI"},{label: "SAT"}
         * ]
         * console.log( weekNames[0] );
         * console.log( ax5.info.weekNames[(new Date()).getDay()].label )
         * ```
         */
        let weekNames = [
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
        let browser = (function (ua, mobile, browserName, match, browser, browserVersion) {
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
        let isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && win.document);

        /**
         * 브라우저에 따른 마우스 휠 이벤트이름
         * @member {Object} ax5.info.wheelEnm
         */
        let wheelEnm = (win && (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel");

        /**
         * 첫번째 자리수 동사 - (필요한것이 없을때 : 4, 실행오류 : 5)
         * 두번째 자리수 목적어 - 문자열 0, 숫자 1, 배열 2, 오브젝트 3, 함수 4, DOM 5, 파일 6, 기타 7
         * 세번째 자리수 옵션
         * @member {Object} ax5.info.errorMsg
         */
        let errorMsg = {};

        /**
         * 현재 페이지의 Url 정보를 리턴합니다.
         * @method ax5.info.urlUtil
         * @returns {Object}
         * @example
         * ```
         * console.log( ax5.util.toJson( ax5.info.urlUtil() ) );
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
         * ax5-error-msg.js 에 정의된 ax5 error를 반환합니다.
         * @method ax5.info.getError
         * @returns {Object}
         * @example
         * ```
         * console.log( ax5.info.getError("single-uploader", "460", "upload") );
         *
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

        /**
         * 브라우져의 터치 기능 유무를 확인합니다.
         * @method ax5.info.supportTouch
         * @returns {boolean}
         * @example
         * ```
         * var chkFlag = ax5.info.supportTouch;
         */
        let supportTouch = (win) ? (('ontouchstart' in win) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) : false;

        let supportFileApi = (win) ? ( win.FileReader && win.File && win.FileList && win.Blob ) : false;

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
            supportFileApi: supportFileApi,
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
        const _toString = Object.prototype.toString;

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
            let key, i = 0, l = O.length,
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
            let key, i = 0, l = O.length, results = [], fnResult;
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
            if (isObject(O)) {
                for (let key in O) {
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
                for (let i = 0, l = O.length; i < l; i++) {
                    if (typeof O[i] != "undefined" && isFunction(_fn) && _fn.call(O[i], i, O[i])) {
                        return i;
                        break;
                    }
                    else if (O[i] == _fn) {
                        return i;
                        break;
                    }
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
            let i, l, tokenValue;
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
            let i, l, tokenValue;
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
                l = 0;
                for (i in O) {
                    if (typeof O[i] != "undefined") {
                        if (( tokenValue = _fn.call(O[i], O[i]) ) === false) break;
                        else if (typeof tokenValue !== "undefined") defaultValue += tokenValue; ++l;
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
            else if (O === null) {
                typeName = "null";
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

        /**
         * 오브젝트가 날자값인지 판단합니다.
         * @method ax5.util.isDate
         * @param {Date} O
         * @returns {Boolean}
         * @example
         * ```js
         * ax5.util.isDate('2016-09-30');
         * // false
         * ax5.util.isDate( new Date('2016-09-30') );
         * // true
         * ```
         */
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
                    if (date(O) instanceof Date) {
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
         * ax5.util.first([1,2,3,4]);
         * // 1
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
         * ax5.util.last([1,2,3,4]);
         * // 4
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
            var result, pair = ('' + str).split(reDot), isMinus, returnValue;

            isMinus = (Number(pair[0].replace(/,/g, "")) < 0 || pair[0] == "-0");
            returnValue = 0.0;
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
         * 첫번째 인자에 두번째 인자 아이템을 합쳐줍니다. concat과 같은 역할을 하지만. 인자가 Array타입이 아니어도 됩니다.
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
            if (mm < 0) mm = 0;
            if (typeof hh === "undefined") hh = 12;
            if (typeof mi === "undefined") mi = 0;
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
            let yy, mm, dd, hh, mi,
                aDateTime, aTimes, aTime, aDate,
                va,
                ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i,
                ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

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
            if (typeof cond === "undefined" || typeof d === "undefined") {
                return d;
            }
            else {
                if ("add" in cond) {
                    d = (function (_d, opts) {
                        let yy, mm, dd, mxdd,
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
                        else if (typeof opts["h"] !== "undefined") {
                            _d.setTime(_d.getTime() + (opts["h"] * 1000 * 60 * 60));
                        }

                        return _d;
                    })(new Date(d), cond["add"]);
                }
                if ("set" in cond) {
                    d = (function (_d, opts) {
                        let yy, mm, dd,
                            processor = {
                                "firstDayOfMonth": function (date) {
                                    yy = date.getFullYear();
                                    mm = date.getMonth();
                                    dd = 1;
                                    return new Date(yy, mm, dd, 12);
                                },
                                "lastDayOfMonth": function (date) {
                                    yy = date.getFullYear();
                                    mm = date.getMonth();
                                    dd = daysOfMonth(yy, mm);
                                    return new Date(yy, mm, dd, 12);
                                }
                            };
                        if (opts in processor) {
                            return processor[opts](_d);
                        } else {
                            return _d;
                        }
                    })(new Date(d), cond["set"]);
                }
                if ("return" in cond) {
                    return (function () {

                        let fStr = cond["return"], nY, nM, nD, nH, nMM, nS, nDW,
                            yre, regY, mre, regM, dre, regD, hre, regH, mire, regMI, sre, regS, dwre, regDW;

                        nY = d.getUTCFullYear();
                        nM = setDigit(d.getMonth() + 1, 2);
                        nD = setDigit(d.getDate(), 2);
                        nH = setDigit(d.getHours(), 2);
                        nMM = setDigit(d.getMinutes(), 2);
                        nS = setDigit(d.getSeconds(), 2);
                        nDW = d.getDay();

                        yre = /[^y]*(yyyy)[^y]*/gi;
                        yre.exec(fStr);
                        regY = RegExp.$1;
                        mre = /[^m]*(MM)[^m]*/g;
                        mre.exec(fStr);
                        regM = RegExp.$1;
                        dre = /[^d]*(dd)[^d]*/gi;
                        dre.exec(fStr);
                        regD = RegExp.$1;
                        hre = /[^h]*(hh)[^h]*/gi;
                        hre.exec(fStr);
                        regH = RegExp.$1;
                        mire = /[^m]*(mm)[^i]*/g;
                        mire.exec(fStr);
                        regMI = RegExp.$1;
                        sre = /[^s]*(ss)[^s]*/gi;
                        sre.exec(fStr);
                        regS = RegExp.$1;
                        dwre = /[^d]*(dw)[^w]*/gi;
                        dwre.exec(fStr);
                        regDW = RegExp.$1;

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
         * ax5.util.weeksOfMonth("2015-09-19"); // {year: 2015, month: 9, count: 3}
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
         * (new Date()).getMonth() 기준으로 월값을 보냅니다. "2월" 인경우 "1" 을 넘기게 됩니다.
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
         * 문자열 길이보다 작은값을 보내면 무시됩니다.
         * @method ax5.util.setDigit
         * @param {String|Number} num
         * @param {Number} length
         * @param {String} [padder=0]
         * @param {Number} [radix]
         * @returns {String}
         * @example
         * ```
         * ax5.util.setDigit(2016, 6)
         * // "002016"
         * ax5.util.setDigit(2016, 2)
         * // "2016"
         * ```
         */
        function setDigit(num, length, padder, radix) {
            var s = num.toString(radix || 10);
            return times((padder || '0'), (length - s.length)) + s;
        }

        /**
         * 문자열을 지정된 수만큼 반복 합니다.
         * @param {String} s
         * @param {Number} count
         * @returns {string}
         * @example
         * ```
         * ax5.util.times(2016, 2)
         * //"20162016"
         * ```
         */
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
         * css string 및 object 를 넘기면 object 및 string 으로 변환되어 리턴됩니다.
         * @method ax5.util.css
         * @param {Object|String} val - CSS String or CSS Object
         * @returns {String|Object}
         * @example
         * ```
         * console.log(ax5.util.css({background: "#ccc", padding: "50px", width: "100px"}));
         * //"background:#ccc;padding:50px;width:100px;"
         * console.log(ax5.util.css('width:100px;padding: 50px; background: #ccc'));
         * // object {width: "100px", padding: "50px", background: "#ccc"}
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
        const selectRange = (function () {
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
         * 지정한 시간을 지연시켜 함수를 실행합니다.
         * @method ax5.util.debounce
         * @param {Function} func
         * @param {Number} wait
         * @param {Object} options
         * @returns {debounced}
         * @example
         * ```js
         * var debounceFn = ax5.util.debounce(function( val ) { console.log(val); }, 300);
         * $(document.body).click(function(){
         *  debounceFn(new Date());
         * });
         * ```
         */
        // https://github.com/lodash/lodash/blob/master/debounce.js
        function debounce(func, wait, options) {
            let lastArgs,
                lastThis,
                maxWait,
                result,
                timerId,
                lastCallTime;

            let lastInvokeTime = 0;
            let leading = false;
            let maxing = false;
            let trailing = true;

            if (typeof func != 'function') {
                throw new TypeError('Expected a function')
            }
            wait = +wait || 0;
            if (isObject(options)) {
                leading = !!options.leading;
                maxing = 'maxWait' in options;
                maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
                trailing = 'trailing' in options ? !!options.trailing : trailing;
            }

            function invokeFunc(time) {
                const args = lastArgs;
                const thisArg = lastThis;

                lastArgs = lastThis = undefined;
                lastInvokeTime = time;
                result = func.apply(thisArg, args);
                return result
            }

            function leadingEdge(time) {
                // Reset any `maxWait` timer.
                lastInvokeTime = time;
                // Start the timer for the trailing edge.
                timerId = setTimeout(timerExpired, wait);
                // Invoke the leading edge.
                return leading ? invokeFunc(time) : result;
            }

            function remainingWait(time) {
                const timeSinceLastCall = time - lastCallTime;
                const timeSinceLastInvoke = time - lastInvokeTime;
                const result = wait - timeSinceLastCall;

                return maxing ? Math.min(result, maxWait - timeSinceLastInvoke) : result;
            }

            function shouldInvoke(time) {
                const timeSinceLastCall = time - lastCallTime;
                const timeSinceLastInvoke = time - lastInvokeTime;

                // Either this is the first call, activity has stopped and we're at the
                // trailing edge, the system time has gone backwards and we're treating
                // it as the trailing edge, or we've hit the `maxWait` limit.
                return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
                    (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
            }

            function timerExpired() {
                const time = Date.now();
                if (shouldInvoke(time)) {
                    return trailingEdge(time);
                }
                // Restart the timer.
                timerId = setTimeout(timerExpired, remainingWait(time));
            }

            function trailingEdge(time) {
                timerId = undefined;

                // Only invoke if we have `lastArgs` which means `func` has been
                // debounced at least once.
                if (trailing && lastArgs) {
                    return invokeFunc(time)
                }
                lastArgs = lastThis = undefined;
                return result
            }

            function cancel() {
                if (timerId !== undefined) {
                    clearTimeout(timerId);
                }
                lastInvokeTime = 0;
                lastArgs = lastCallTime = lastThis = timerId = undefined
            }

            function flush() {
                return timerId === undefined ? result : trailingEdge(Date.now())
            }

            function debounced(...args) {
                const time = Date.now();
                const isInvoking = shouldInvoke(time);

                lastArgs = args;
                lastThis = this;
                lastCallTime = time;

                if (isInvoking) {
                    if (timerId === undefined) {
                        return leadingEdge(lastCallTime)
                    }
                    if (maxing) {
                        // Handle invocations in a tight loop.
                        timerId = setTimeout(timerExpired, wait);
                        return invokeFunc(lastCallTime)
                    }
                }
                if (timerId === undefined) {
                    timerId = setTimeout(timerExpired, wait)
                }
                return result
            }
            debounced.cancel = cancel;
            debounced.flush = flush;
            return debounced
        }

        /**
         * @method ax5.util.throttle
         * @param func
         * @param wait
         * @param options
         * @return {debounced}
         */
        //https://github.com/lodash/lodash/blob/master/throttle.js
        function throttle(func, wait, options) {
            let leading = true;
            let trailing = true;

            if (typeof func != 'function') {
                throw new TypeError('Expected a function');
            }
            if (isObject(options)) {
                leading = 'leading' in options ? !!options.leading : leading;
                trailing = 'trailing' in options ? !!options.trailing : trailing;
            }
            return debounce(func, wait, {
                'leading': leading,
                'maxWait': wait,
                'trailing': trailing
            });
        }

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

        /**
         * HTML 문자열을 escape 처리합니다.
         * "&lt;" represents the < sign.
         * "&gt;" represents the > sign.
         * "&amp;" represents the & sign.
         * "&quot; represents the " mark.
         * [Character entity references](https://www.w3.org/TR/html401/charset.html#h-5.3)
         * @method ax5.util.escapeHtml
         * @param {String} s
         * @returns {string}
         * @example
         * ```
         * ax5.util.escapeHtml('HTML <span>string</span> & "escape"')
         * //"HTML &lt;span&gt;string&lt;/span&gt; &amp; &quot;escape&quot;"
         * ```
         */
        function escapeHtml(s) {
            if (_toString.call(s) != "[object String]") return s;
            if (!s) return "";
            return s.replace(/[\<\>\&\"]/gm, function (match) {
                switch (match) {
                    case "<":
                        return "&lt;";
                    case ">":
                        return "&gt;";
                    case "&":
                        return "&amp;";
                    case "\"":
                        return "&quot;";
                    default:
                        return match;
                }
            });
        }

        /**
         * HTML 문자열을 unescape 처리합니다.
         * escapeHtml를 참고하세요.
         * @method ax5.util.unescapeHtml
         * @param {String} s
         * @returns {string}
         * @example
         * ```
         * ax5.util.unescapeHtml('HTML &lt;span&gt;string&lt;/span&gt; &amp; &quot;escape&quot;')
         * //"HTML <span>string</span> & "escape""
         * ```
         */
        function unescapeHtml(s) {
            if (_toString.call(s) != "[object String]") return s;
            if (!s) return "";
            return s.replace(/(&lt;)|(&gt;)|(&amp;)|(&quot;)/gm, function (match) {
                switch (match) {
                    case "&lt;":
                        return "<";
                    case "&gt;":
                        return ">";
                    case "&amp;":
                        return "&";
                    case "&quot;":
                        return "\"";
                    default:
                        return match;
                }
            });
        }

        /**
         * @method ax5.util.string
         * @param {String} tmpl
         * @param {*} args
         * @return {ax5string}
         * @example
         * ```js
         * ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format("ASP", "ASP.NET");
         * ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format(["ASP", "ASP.NET"]);
         * ax5.util.stinrg("{0} counts").format(100);
         * ```
         */
        function string(_string) {
            return new (function (_string) {
                this.value = _string;
                this.toString = function () {
                    return this.value;
                };
                /**
                 * @method ax5.util.string.format
                 * @returns {*}
                 */
                this.format = function () {
                    var args = [];
                    for (var i = 0, l = arguments.length; i < l; i++) {
                        args = args.concat(arguments[i]);
                    }
                    return this.value.replace(/{(\d+)}/g, function (match, number) {
                        return typeof args[number] != 'undefined' ? args[number] : match;
                    });
                };
                /**
                 * @method ax5.util.string.escape
                 * @returns {*}
                 */
                this.escape = function () {
                    return escapeHtml(this.value);
                };
                /**
                 * @method ax5.util.string.unescape
                 * @returns {*}
                 */
                this.unescape = function () {
                    return unescapeHtml(this.value);
                };
                /**
                 * @method ax5.util.string.encode
                 * @returns {*}
                 */
                this.encode = function () {
                    return encode(this.value);
                };
                /**
                 * @method ax5.util.string.decode
                 * @returns {*}
                 */
                this.decode = function () {
                    return decode(this.value);
                };
                /**
                 * @method ax5.util.string.left
                 * @param {String|Number} pos - 찾을 문자열 또는 포지션
                 * @returns {*}
                 */
                this.left = function (_pos) {
                    return left(this.value, _pos);
                };
                /**
                 * @method ax5.util.string.right
                 * @param {String|Number} pos - 찾을 문자열 또는 포지션
                 * @returns {*}
                 */
                this.right = function (_pos) {
                    return right(this.value, _pos);
                };
                /**
                 * @method ax5.util.string.camelCase
                 * @returns {*}
                 */
                this.camelCase = function () {
                    return camelCase(this.value);
                };
                /**
                 * @method ax5.util.string.snakeCase
                 * @returns {*}
                 */
                this.snakeCase = function () {
                    return snakeCase(this.value);
                };
            })(_string);
        }

        /**
         * @method ax5.util.color
         * @param _hexColor
         * @return {ax5color}
         * @example
         * ```js
         * ax5.util.color("#ff3300").lighten(10).getHexValue()
         * console.log(ax5.util.color("#ff3300").darken(10).getHexValue());
         * ```
         */
        function color(_hexColor) {

            const matchers = (function () {

                // <http://www.w3.org/TR/css3-values/#integers>
                const CSS_INTEGER = "[-\\+]?\\d+%?";

                // <http://www.w3.org/TR/css3-values/#number-value>
                const CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

                // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
                const CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

                // Actual matching.
                // Parentheses and commas are optional, but not required.
                // Whitespace can take the place of commas or opening paren
                const PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
                const PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

                return {
                    CSS_UNIT: new RegExp(CSS_UNIT),
                    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
                    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
                };
            })();

            const convertObject = function (_color) {
                let match;
                if ((match = matchers.rgb.exec(_color))) {
                    return {r: match[1], g: match[2], b: match[3]};
                }
                if ((match = matchers.rgba.exec(_color))) {
                    return {r: match[1], g: match[2], b: match[3], a: match[4]};
                }
                if ((match = matchers.hsl.exec(_color))) {
                    return {h: match[1], s: match[2], l: match[3]};
                }
                if ((match = matchers.hsla.exec(_color))) {
                    return {h: match[1], s: match[2], l: match[3], a: match[4]};
                }
                if ((match = matchers.hsv.exec(_color))) {
                    return {h: match[1], s: match[2], v: match[3]};
                }
                if ((match = matchers.hsva.exec(_color))) {
                    return {h: match[1], s: match[2], v: match[3], a: match[4]};
                }
                if ((match = matchers.hex8.exec(_color))) {
                    return {
                        r: parseInt(match[1], 16),
                        g: parseInt(match[2], 16),
                        b: parseInt(match[3], 16),
                        a: parseInt((match[4]) / 255, 16),
                        format: "hex8"
                    };
                }
                if ((match = matchers.hex6.exec(_color))) {
                    return {
                        r: parseInt(match[1], 16),
                        g: parseInt(match[2], 16),
                        b: parseInt(match[3], 16),
                        format: "hex"
                    };
                }
                if ((match = matchers.hex4.exec(_color))) {
                    return {
                        r: parseInt(match[1] + '' + match[1], 16),
                        g: parseInt(match[2] + '' + match[2], 16),
                        b: parseInt(match[3] + '' + match[3], 16),
                        a: parseInt(match[4] + '' + match[4], 16),
                        format: "hex8"
                    };
                }
                if ((match = matchers.hex3.exec(_color))) {
                    return {
                        r: parseInt(match[1] + '' + match[1], 16),
                        g: parseInt(match[2] + '' + match[2], 16),
                        b: parseInt(match[3] + '' + match[3], 16),
                        format: "hex"
                    };
                }

                return false;
            };

            function isOnePointZero(n) {
                return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
            }

            function isPercentage(n) {
                return typeof n === "string" && n.indexOf('%') != -1;
            }

            function convertToPercentage(n) {
                if (n <= 1) {
                    n = (n * 100) + "%";
                }

                return n;
            }

            function convertTo255(n) {
                return ax5.util.number(Math.min(255, Math.max(n, 0)), {'round': 2});
            }

            function convertToHex(n) {
                return setDigit(Math.round(n).toString(16), 2)
            }

            function bound01(n, max) {
                if (isOnePointZero(n)) {
                    n = "100%";
                }

                var processPercent = isPercentage(n);
                n = Math.min(max, Math.max(0, parseFloat(n)));

                // Automatically convert percentage into number
                if (processPercent) {
                    n = parseInt(n * max, 10) / 100;
                }

                // Handle floating point rounding errors
                if ((Math.abs(n - max) < 0.000001)) {
                    return 1;
                }

                // Convert into [0, 1] range if it isn't already
                return (n % max) / parseFloat(max);
            }

            function rgbToHsl(r, g, b) {
                r = bound01(r, 255);
                g = bound01(g, 255);
                b = bound01(b, 255);

                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if (max == min) {
                    h = s = 0; // achromatic
                }
                else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
                    }

                    h /= 6;
                }

                return {h: h, s: s, l: l};
            }

            function hslToRgb(h, s, l) {
                let r, g, b;

                h = bound01(h, 360);
                s = bound01(s, 100);
                l = bound01(l, 100);

                function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                if (s === 0) {
                    r = g = b = l; // achromatic
                }
                else {
                    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    let p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }

                return {r: r * 255, g: g * 255, b: b * 255};
            }

            return new (function (_color) {
                this._originalValue = _color;
                _color = convertObject(_color);
                this.r = _color.r;
                this.g = _color.g;
                this.b = _color.b;
                this.a = _color.a || 1;
                this._format = _color.format;
                this._hex = convertToHex(this.r) + convertToHex(this.g) + convertToHex(this.b);

                this.getHexValue = function () {
                    return this._hex;
                };

                this.lighten = function (amount) {
                    amount = (amount === 0) ? 0 : (amount || 10);
                    let hsl = rgbToHsl(this.r, this.g, this.b), rgb = {};

                    hsl.l += amount / 100;
                    hsl.l = Math.min(1, Math.max(0, hsl.l));
                    hsl.h = hsl.h * 360;

                    rgb = hslToRgb(hsl.h, convertToPercentage(hsl.s), convertToPercentage(hsl.l));

                    return color('rgba(' + convertTo255(rgb.r) + ', ' + convertTo255(rgb.g)+ ', ' + convertTo255(rgb.b) + ', ' + this.a + ')');
                };

                this.darken = function (amount) {
                    amount = (amount === 0) ? 0 : (amount || 10);
                    let hsl = rgbToHsl(this.r, this.g, this.b), rgb = {};

                    hsl.l -= amount / 100;
                    hsl.l = Math.min(1, Math.max(0, hsl.l));
                    hsl.h = hsl.h * 360;

                    rgb = hslToRgb(hsl.h, convertToPercentage(hsl.s), convertToPercentage(hsl.l));

                    return color('rgba(' + convertTo255(rgb.r) + ', ' + convertTo255(rgb.g)+ ', ' + convertTo255(rgb.b) + ', ' + this.a + ')');
                };

                this.getBrightness = function () {
                    return (this.r * 299 + this.g * 587 + this.b * 114) / 1000;
                };

                this.isDark = function() {
                    return this.getBrightness() < 128;
                };

                this.isLight = function() {
                    return !this.isDark();
                };

                this.getHsl = function () {
                    let hsl = rgbToHsl(this.r, this.g, this.b);
                    hsl.l = Math.min(1, Math.max(0, hsl.l));
                    hsl.h = hsl.h * 360;
                    return {
                        h: hsl.h,
                        s: hsl.s,
                        l: hsl.l
                    }
                };

            })(_hexColor);
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
            debounce: debounce,
            throttle: throttle,
            escapeHtml: escapeHtml,
            unescapeHtml: unescapeHtml,

            string: string,
            color: color
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
