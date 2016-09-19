// ax5.ui.mask
(function (root, _SUPER_) {
    /**
     * @class ax5.ui.mask
     * @classdesc
     * @version v0.0.1
     * @author tom@axisj.com
     * @logs
     * 2014-04-01 tom : 시작
     * 2015-12-27 tom : refactoring
     * @example
     * ```
     * var my_mask = new ax5.ui.mask();
     * ```
     */
    var U = ax5.util;

    var axClass = function () {
        var
            self = this
            ;

        if (_SUPER_) _SUPER_.call(this); // 부모호출
        this.maskContent = '';
        this.status = "off";
        this.config = {
            theme: '',
            target: jQuery(document.body).get(0)
        };
        var cfg = this.config;


        /**
         * Preferences of Mask UI
         * @method ax5.ui.mask.setConfig
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.mask}
         * @example
         * ```
         * setConfig({
		 *      target : {Element|AX5 nodelist}, // 마스크 처리할 대상
		 *      content : {String}, // 마스크안에 들어가는 내용물
		 *      onStateChanged: function(){} // 마스크 상태변경 시 호출되는 함수 this.type으로 예외처리 가능
		 * }
         * ```
         */
        this.init = function () {
            // after setConfig();
            if (this.config.content) this.setBody(this.config.content);
        };

        this.setBody = function (content) {
            this.maskContent = content;
        };

        this.getBody = function () {
            return this.maskContent;
        };

        /**
         * open mask
         * @method ax5.ui.mask.open
         * @param {Object} config
         * @returns {ax5.ui.mask}
         * @example
         * ```js
         * my_mask.open({
		 *     target: document.body,
		 *     content: "<h1>Loading..</h1>",
		 *     onStateChanged: function () {
		 *
		 *     }
		 * });
         *
         * my_mask.open({
		 *     target: $("#mask-target").get(0), // dom Element
		 *     content: "<h1>Loading..</h1>",
		 *     onStateChanged: function () {
		 *
		 *     }
		 * });
         * ```
         */
        this.open = function (config) {

            if (this.status === "on") this.close();
            if (config && config.content) this.setBody(config.content);
            self.maskConfig = {};
            jQuery.extend(true, self.maskConfig, this.config);
            jQuery.extend(true, self.maskConfig, config);

            var config = self.maskConfig,
                target = config.target, $target = jQuery(target),
                po = [], css, maskId = 'ax-mask-' + ax5.getGuid(), $mask, css = {},
                that = {};

            po.push('<div class="ax-mask ' + config.theme + '" id="' + maskId + '">');
            po.push('<div class="ax-mask-bg"></div>');
            po.push('<div class="ax-mask-content">');
            po.push('<div class="ax-mask-body">');
            po.push(self.getBody());
            po.push('</div>');
            po.push('</div>');
            po.push('</div>');

            jQuery(document.body).append(po.join(''));

            if (target !== document.body) {
                css = {
                    position: "absolute",
                    left: $target.offset().left,
                    top: $target.offset().top,
                    width: $target.outerWidth(),
                    height: $target.outerHeight()
                };
                if(typeof self.maskConfig.zIndex !== "undefined"){
                    css["z-index"] = self.maskConfig.zIndex;
                }
                $target.addClass("ax-masking");
            }
            this.$mask = $mask = jQuery("#" + maskId);

            this.$target = $target;
            this.status = "on";
            $mask.css(css);

            if (config.onStateChanged) {
                that = {
                    state: "open"
                };
                config.onStateChanged.call(that, that);
            }
            return this;
        };

        /**
         * close mask
         * @method ax5.ui.mask.close
         * @returns {ax5.ui.mask}
         * @example
         * ```
         * my_mask.close();
         * ```
         */
        this.close = function () {
            var config = this.maskConfig, that;
            this.$mask.remove();
            this.$target.removeClass("ax-masking");
            if (config && config.onStateChanged) {
                that = {
                    state: "close"
                };
                config.onStateChanged.call(that, that);
            }
            return this;
        };
        //== class body end


        // 클래스 생성자
        this.main = (function () {
            if(arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };

    //== ui class 공통 처리 구문
    if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
    root.mask = axClass; // ax5.ui에 연결
    //== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);