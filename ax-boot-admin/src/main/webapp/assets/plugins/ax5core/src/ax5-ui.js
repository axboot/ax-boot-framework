/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.ui
 */

/**
 * @class ax5.ui.root
 * @classdesc ax5 ui class
 * @author tom@axisj.com
 * @example
 * ```
 * var myui = new ax5.ui.root();
 * ```
 */
ax5.ui = (function () {

    function axUi() {
        this.config = {};
        this.name = "root";

        /**
         * 클래스의 속성 정의 메소드 속성 확장후에 내부에 init 함수를 호출합니다.
         * @method ax5.ui.root.setConfig
         * @param {Object} config - 클래스 속성값
         * @param {Boolean} [callInit=true] - init 함수 호출 여부
         * @returns {ax5.ui.axUi}
         * @example
         * ```
         * var myui = new ax5.ui.root();
         * myui.setConfig({
		 * 	id:"abcd"
		 * });
         * ```
         */
        this.setConfig = function (cfg, callInit) {
            jQuery.extend(true, this.config, cfg);
            if (typeof callInit == "undefined" || callInit === true) {
                this.init();
            }
            return this;
        };
        this.init = function () {
            console.log(this.config);
        };

        this.bindWindowResize = function (callBack) {
            setTimeout((function () {
                jQuery(window).resize((function () {
                    if (this.bindWindowResize__) clearTimeout(this.bindWindowResize__);
                    this.bindWindowResize__ = setTimeout((function () {
                        callBack.call(this);
                    }).bind(this), 10);
                }).bind(this));
            }).bind(this), 100);
        };

        this.stopEvent = function (e) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
            return false;
        };

        this.toString = function () {
            return this.name + '@' + this.version;
        };

        // instance init
        this.main = (function () {

        }).apply(this, arguments);

    }

    /**
     * @method ax5.ui.addClass
     * @param {Object} config
     * @param {String} config.className - name of Class
     * @param {Object} [config.classStore=ax5.ui] - 클래스가 저장될 경로
     * @param {Function} [config.superClass=ax5.ui.root]
     * @param {Function} cls - Class Function
     */
    function addClass(config, cls) {
        if (!config || !config.className) throw 'invalid call';
        var classStore = (config.classStore) ? config.classStore : ax5.ui;
        if (!classStore)  throw 'invalid classStore';

        // make ui definition variable
        ax5.def[config.className] = {
            version: ax5.info.version
        };

        var factory = function (cls, arg) {
            switch (arg.length) {
                case 0:
                    return new cls();
                    break;
                case 1:
                    return new cls(arg[0]);
                    break;
                case 2:
                    return new cls(arg[0], arg[1]);
                    break;
                case 3:
                    return new cls(arg[0], arg[1], arg[2]);
                    break;
            }
        };
        var initInstance = function (name, version, instance) {
            instance.name = name;
            instance.version = version;
            instance.instanceId = ax5.getGuid();
            return instance;
        };
        var initPrototype = function (cls) {
            var superClass = (config.superClass) ? config.superClass : ax5.ui.root;
            if (!ax5.util.isFunction(superClass)) throw 'invalid superClass';
            superClass.call(this); // 부모호출
            cls.prototype = new superClass(); // 상속
        };
        var wrapper = function () {
            if (!this || !(this instanceof wrapper)) throw 'invalid call';
            var instance = factory(cls, arguments);
            return initInstance(config.className, config.version || "", instance);
        };
        initPrototype.call(this, cls);
        classStore[config.className] = wrapper;
    }

    return {
        root: axUi,
        addClass: addClass
    }
})();
