/**
 * @Object {Object} axboot.modal
 */
axboot.modal = (function () {
    var modalCallback = {};

    var defaultCss = {
        width: 400,
        height: 400,
        position: {
            left: "center",
            top: "middle"
        }
    };

    var defaultOption = $.extend(true, {}, defaultCss,
        {
            iframeLoadingMsg: "",
            iframe: {
                method: "post",
                url: "#"
            },
            closeToEsc: true,
            onStateChanged: function () {
                // mask
                if (this.state === "open") {
                    window.axMask.open();
                }
                else if (this.state === "close") {
                    window.axMask.close();
                }
            },
            animateTime: 100,
            zIndex: 5000,
            absolute: true,
            fullScreen: false,
            header: {
                title: "",
                btns: {
                    close: {
                        label: '<i class="cqc-circle-with-cross"></i>', onClick: function () {
                            window.axModal.close();
                        }
                    }
                }
            }
        }
    );

    /**
     * 지정한 조건으로 ax5 modal을 엽니다. modalConfig 를 넘기지 않으면 지정된 기본값으로 엽니다.
     * @method axboot.modal.open
     * @param {Object} modalConfig
     * @param {Number} modalConfig.width
     * @param {Number} modalConfig.height
     * @param {Object} modalConfig.position
     * @param {String} modalConfig.position.left
     * @param {String} modalConfig.position.top
     * @param {String} modalConfig.iframeLoadingMsg
     * @param {String} modalConfig.iframe.method
     * @param {String} modalConfig.iframe.url
     * @param {Boolean} modalConfig.closeToEsc
     * @param {Number} modalConfig.animateTime
     * @param {Number} modalConfig.zIndex
     * @param {Boolean} modalConfig.fullScreen
     * @param {Object} modalConfig.header
     * @param {String} modalConfig.header.title
     * @param {Function} modalConfig.sendData - 모달창에서 parent.axboot.modal.getData() 하여 호출합니다. 전달하고 싶은 변수를 return 하면 됩니다
     * @param {Function} modalConfig.callback - 모달창에서 parant.axboot.modal.callback() 으로 호출합니다.
     *
     * @example
     * ```js
     *  axboot.modal.open({
     *      width: 400,
     *      height: 400,
     *      header: false,
     *      iframe: {
     *          url: "open url"
     *          param: "param"
     *      },
     *      sendData: function(){
     *
     *      },
     *      callback: function(){
     *          axboot.modal.close();
     *      }
     *  });
     * ```
     */
    var open = function (modalConfig) {

        modalConfig = $.extend(true, {}, defaultOption, modalConfig);
        if (modalConfig.modalType) {

            if (axboot.def.MODAL && axboot.def.MODAL[modalConfig.modalType]) {
                if (modalConfig.param) {
                    $.extend(true, modalConfig, {iframe: {param: modalConfig.param}});
                }
                modalConfig = $.extend(true, {}, modalConfig, axboot.def.MODAL[modalConfig.modalType]);
            }
        }

        $(document.body).addClass("modalOpened");

        this.modalCallback = modalConfig.callback;
        this.modalSendData = modalConfig.sendData;

        window.axModal.open(modalConfig);
    };

    /**
     * ax5 modal css 를 적용합니다.
     * @method axboot.modal.css
     * @param modalCss
     */
    var css = function (modalCss) {
        modalCss = $.extend(true, {}, defaultCss, modalCss);
        window.axModal.css(modalCss);
    };
    /**
     * ax5 modal을 정렬합니다.
     * @method axboot.modal.align
     * @param modalAlign
     */
    var align = function (modalAlign) {
        window.axModal.align(modalAlign);
    };
    /**
     * ax5 modal을 닫습니다.
     * @method axboot.modal.close
     */
    var close = function (data) {
        window.axModal.close();
        setTimeout(function () {
            $(document.body).removeClass("modalOpened");
        }, 500);

    };
    /**
     * ax5 modal을 최소화 합니다.
     * @method axboot.modal.minimize
     */
    var minimize = function () {
        window.axModal.minimize();
    };
    /**
     * ax5 modal을 최대화 합니다.
     * @methid axboot.modal.maximize
     */
    var maximize = function () {
        window.axModal.maximize();
    };

    /**
     * callback 으로 정의된 함수에 전달된 파라메터를 넘겨줍니다.
     * @method axboot.modal.callback
     * @param {Object|String} data
     */
    var callback = function (data) {
        if (this.modalCallback) {
            this.modalCallback(data);
        }
    };

    var getData = function () {
        if (this.modalSendData) {
            return this.modalSendData();
        }
    };

    return {
        "open": open,
        "css": css,
        "align": align,
        "close": close,
        "minimize": minimize,
        "maximize": maximize,
        "callback": callback,
        "modalCallback": modalCallback,
        "getData": getData
    };
})();