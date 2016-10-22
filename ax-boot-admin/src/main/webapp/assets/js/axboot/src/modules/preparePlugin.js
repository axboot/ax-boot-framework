/**
 * @object {Object} axboot.preparePlugin
 */
axboot.preparePlugin = (function () {
    /**
     * js가 실행되는 타임. 페이지 레디 전에 미리 선언 하는 경우
     * @method axboot.preparePlugin.define
     */
    var define = function () {

        /**
         * 기본 마스크
         * @var {ax5ui} axMask
         * @example
         * ```js
         * appMask.open();
         * appMask.close();
         * appMask.close(1000); // 1초 지연 후 마스크 닫기
         * ```
         */
        window.axMask = new ax5.ui.mask();
        /**
         * 다이얼로그용 마스크
         * @var {ax5ui} axDialogMask
         */
        window.axDialogMask = new ax5.ui.mask();
        /**
         * ajax용 마스크
         * @var {ax5ui} axAJAXMask
         */
        window.axAJAXMask = new ax5.ui.mask({
            content: '<i class="cqc-chequer cqc-50x cqc-zoom-in-out" style="color: #ccc;"></i>',
        });
        /**
         * 프로그래스바 형태의 마스크
         * @var {ax5ui} axProgressMask
         */
        window.axProgressMask = new ax5.ui.mask({
            theme: "progress-mask",
            content: '<div class="progress">'+
            '<div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" style="width: 0%">'+
            '</div>'+
            '</div>'
        });
        /**
         * 기본 모달
         * @var {ax5ui} axModal
         */
        window.axModal = new ax5.ui.modal({
            absolute: true,
            iframeLoadingMsg: '<i class="cqc-chequer ax-loading-icon lg"></i>'
        });

        ax5.ui.picker_instance.setConfig({
            animateTime: 100,
            calendar: {
                control: {
                    left: '<i class="cqc-chevron-left"></i>',
                    yearTmpl: '%s',
                    monthTmpl: '%s',
                    right: '<i class="cqc-chevron-right"></i>',
                    yearFirst: true
                }
                /*
                 dimensions: {
                 itemPadding: 1,
                 height: 200
                 }
                 lang: {
                 year: "%s",
                 month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                 day: "%s"
                 },
                 */
            }
        });
        ax5.ui.combobox_instance.setConfig({
            removeIcon: '<i class="cqc-cancel3"></i>'
        });
    };

    /**
     * 페이지가 레디된 다음 선언하는 경우.
     * 경우에 따라 페이지가 준비완료 상태일 때 선언해야하는 플러그인을 위해.
     * @method axboot.preparePlugin.pageStart
     */
    var pageStart = function () {

        /**
         *
         * @var {ax5ui} axDialog
         */
        window.axDialog = new ax5.ui.dialog({
            title: axboot.def.dialogTitle,
            lang: {
                "ok": "확인", "cancel": "취소"
            },
            onStateChanged: function () {
                if (this.state === "open") {
                    axDialogMask.open();
                }
                else if (this.state === "close") {
                    axDialogMask.close();
                }
            }
        });
        /**
         *
         * @var {ax5ui} axWarningDialog
         */
        window.axWarningDialog = new ax5.ui.dialog({
            title: axboot.def.dialogTitle,
            theme: "warning",
            lang: {
                "ok": "확인", "cancel": "취소"
            },
            onStateChanged: function () {
                if (this.state === "open") {
                    axDialogMask.open({theme: 'danger'});
                }
                else if (this.state === "close") {
                    axDialogMask.close();
                }
            }
        });
        /**
         *
         * @var {ax5ui} axToast
         * @example
         * ```js
         * toast.push('Toast message', function () {
         *  // closed toast
         *  console.log(this);
         * });
         * ```
         */
        window.axToast = new ax5.ui.toast({
            icon: '<i class="cqc-megaphone"></i>',
            containerPosition: "bottom-right",
            onStateChanged: function () {

            }
        });
        /**
         * @var {ax5ui} axWarningToast
         *
         */
        window.axWarningToast = new ax5.ui.toast({
            theme: "danger",
            icon: '<i class="cqc-warning2"></i>',
            containerPosition: "bottom-left",
            onStateChanged: function () {

            }
        });
    };

    define();

    return {
        define: define,
        pageStart: pageStart
    }

})();