// 필수 Ployfill 확장 구문
(function(){
    'use strict';
    
	var root = this,
        re_trim = /^\s*|\s*$/g;

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = (function() {
			var hwp = Object.prototype.hasOwnProperty,
                hdeb = !({ toString: null }).propertyIsEnumerable('toString'),
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

			return function(obj) {
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
			if (this === void 0 || this === null) { throw TypeError(); }
			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function") { throw TypeError(); }
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
			if (typeof this !== 'function') { throw TypeError("function"); }
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
		if(!document.createStyleSheet) return;
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
		(function() {
			String.prototype.trim = function() {
				return this.replace(re_trim, '');
			};
		})();
	}

	if (!window.JSON) {
		window.JSON = {
			parse: function (sJSON) { return (new Function('', 'return ' + sJSON))(); },
			stringify:(function(){
				var r = /["]/g, f;
				return f = function(vContent){
					var result, i, j;
					switch( result = typeof vContent ){
					case'string':return '"' + vContent.replace( r, '\\"' ) + '"';
					case'number':case'boolean':return vContent.toString();
					case'undefined':return 'undefined';
					case'function':return '""';
					case'object':
						if(!vContent) return 'null';
						result = '';
						if(vContent.splice){
							for(i = 0, j = vContent.length ; i < j ; i++) result += ',' + f(vContent[i]);
							return '[' + result.substr(1) + ']';
						}else{
							for(i in vContent) if(vContent.hasOwnProperty(i) && vContent[i] !== undefined && typeof vContent[i] != 'function') result += ',"'+i+'":' + f(vContent[i]);
							return '{' + result.substr(1) + '}';
						}
					}
				};
			})()
		};
	}

	// Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
	// Make it safe to do console.log() always.
	(function(con) {
		var prop, method;
		var empty = {};
		var dummy = function() {};
		var properties = 'memory'.split(',');
		var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
		'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
		'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
		while (prop = properties.pop()) con[prop] = con[prop] || empty;
		while (method = methods.pop()) con[method] = con[method] || dummy;
	})(root.console = root.console || {}); // Using `this` for web workers.

}.call(this));