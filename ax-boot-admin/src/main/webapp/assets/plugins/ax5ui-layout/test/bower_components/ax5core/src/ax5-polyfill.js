// 필수 Ployfill 확장 구문
(function () {
    'use strict';
    
    var root = this,
        re_trim = /^\s*|\s*$/g;

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function () {
            var hwp = Object.prototype.hasOwnProperty,
                hdeb = !({toString: null}).propertyIsEnumerable('toString'),
                de = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                del = de.length;

            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) throw new TypeError('type err');
                var r = [], prop, i;
                for (prop in obj) if (hwp.call(obj, prop)) r.push(prop);
                if (hdeb) {
                    for (i = 0; i < del; i++) if (hwp.call(obj, de[i])) r.push(de[i]);
                }
                return r;
            };
        }());
    }

    // ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
    // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fun /*, thisp */) {
            if (this === void 0 || this === null) {
                throw TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") {
                throw TypeError();
            }
            var thisp = arguments[1], i;
            for (i = 0; i < len; i++) {
                if (i in t) {
                    fun.call(thisp, t[i], i, t);
                }
            }
        };
    }

    // ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (o) {
            if (typeof this !== 'function') {
                throw TypeError("function");
            }
            var slice = [].slice,
                args = slice.call(arguments, 1),
                self = this,
                bound = function () {
                    return self.apply(this instanceof nop ? this : o,
                        args.concat(slice.call(arguments)));
                };

            function nop() {}

            nop.prototype = self.prototype;
            bound.prototype = new nop();
            return bound;
        };
    }

    /*global document */
    /**
     * define document.querySelector & document.querySelectorAll for IE7
     *
     * A not very fast but small hack. The approach is taken from
     * http://weblogs.asp.net/bleroy/archive/2009/08/31/queryselectorall-on-old-ie-versions-something-that-doesn-t-work.aspx
     *
     */
    (function () {
        if (document.querySelectorAll || document.querySelector) {
            return;
        }
        if (!document.createStyleSheet) return;
        var style = document.createStyleSheet(),
            select = function (selector, maxCount) {
                var
                    all = document.all,
                    l = all.length,
                    i,
                    resultSet = [];

                style.addRule(selector, "foo:bar");
                for (i = 0; i < l; i += 1) {
                    if (all[i].currentStyle.foo === "bar") {
                        resultSet.push(all[i]);
                        if (resultSet.length > maxCount) {
                            break;
                        }
                    }
                }
                style.removeRule(0);
                return resultSet;
            };

        document.querySelectorAll = function (selector) {
            return select(selector, Infinity);
        };
        document.querySelector = function (selector) {
            return select(selector, 1)[0] || null;
        };
    }());

    if (!String.prototype.trim) {
        (function () {
            String.prototype.trim = function () {
                return this.replace(re_trim, '');
            };
        })();
    }

    if (!window.JSON) {
        window.JSON = {
            parse: function (sJSON) { return (new Function('', 'return ' + sJSON))(); },
            stringify: (function () {
                var r = /["]/g, f;
                return f = function (vContent) {
                    var result, i, j;
                    switch (result = typeof vContent) {
                        case'string':
                            return '"' + vContent.replace(r, '\\"') + '"';
                        case'number':
                        case'boolean':
                            return vContent.toString();
                        case'undefined':
                            return 'undefined';
                        case'function':
                            return '""';
                        case'object':
                            if (!vContent) return 'null';
                            result = '';
                            if (vContent.splice) {
                                for (i = 0, j = vContent.length; i < j; i++) result += ',' + f(vContent[i]);
                                return '[' + result.substr(1) + ']';
                            }
                            else {
                                for (i in vContent) if (vContent.hasOwnProperty(i) && vContent[i] !== undefined && typeof vContent[i] != 'function') result += ',"' + i + '":' + f(vContent[i]);
                                return '{' + result.substr(1) + '}';
                            }
                    }
                };
            })()
        };
    }

    // splice ie8 <= polyfill
    (function () {
        if (!document.documentMode || document.documentMode >= 9) return false;
        var _splice = Array.prototype.splice;
        Array.prototype.splice = function () {
            var args = Array.prototype.slice.call(arguments);
            if (typeof args[1] === "undefined") args[1] = this.length - args[0];
            return _splice.apply(this, args);
        };
    })();

    /**
     * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
     * on host objects like NamedNodeMap, NodeList, and HTMLCollection
     * (technically, since host objects have been implementation-dependent,
     * at least before ES6, IE hasn't needed to work this way).
     * Also works on strings, fixes IE < 9 to allow an explicit undefined
     * for the 2nd argument (as in Firefox), and prevents errors when
     * called on other DOM objects.
     */
    (function () {
        'use strict';
        var _slice = Array.prototype.slice;

        try {
            // Can't be used with DOM elements in IE < 9
            _slice.call(document.documentElement);
        } catch (e) { // Fails in IE < 9
            // This will work for genuine arrays, array-like objects,
            // NamedNodeMap (attributes, entities, notations),
            // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
            // and will not fail on other DOM objects (as do DOM elements in IE < 9)
            Array.prototype.slice = function(begin, end) {
                // IE < 9 gets unhappy with an undefined end argument
                end = (typeof end !== 'undefined') ? end : this.length;

                // For native Array objects, we use the native slice function
                if (Object.prototype.toString.call(this) === '[object Array]'){
                    return _slice.call(this, begin, end);
                }

                // For array like object we handle it ourselves.
                var i, cloned = [],
                    size, len = this.length;

                // Handle negative value for "begin"
                var start = begin || 0;
                start = (start >= 0) ? start : Math.max(0, len + start);

                // Handle negative value for "end"
                var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
                if (end < 0) {
                    upTo = len + end;
                }
 
                // Actual expected size of the slice
                size = upTo - start;

                if (size > 0) {
                    cloned = new Array(size);
                    if (this.charAt) {
                        for (i = 0; i < size; i++) {
                            cloned[i] = this.charAt(start + i);
                        }
                    } else {
                        for (i = 0; i < size; i++) {
                            cloned[i] = this[start + i];
                        }
                    }
                }

                return cloned;
            };
        }
    }());

    // Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
    // Make it safe to do console.log() always.
    (function (con) {
        var prop, method;
        var empty = {};
        var dummy = function () {};
        var properties = 'memory'.split(',');
        var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
        'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
        'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
        while (prop = properties.pop()) con[prop] = con[prop] || empty;
        while (method = methods.pop()) con[method] = con[method] || dummy;
    })(window.console || {}); // Using `this` for web workers.

    // extend innerWidth ..
    var html = document.getElementsByTagName('html')[0];
    var body = document.getElementsByTagName('body')[0];

    if (!window.innerWidth) window.innerWidth = html.clientWidth;
    if (!window.innerHeight) window.innerHeight = html.clientHeight;
    if (!window.scrollX) window.scrollX = window.pageXOffset || html.scrollLeft;
    if (!window.scrollY) window.scrollY = window.pageYOffset || html.scrollTop;

}.call(window));