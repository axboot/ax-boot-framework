var topMenu = new AXTopDownMenu();
var loginInfoModal = new AXMobileModal();
var loading_mask = new AXMask();
var fcObj = {
    pageStart: function () {
        loading_mask.setConfig();
        loading_mask.setContent(
            {
                width: 200, height: 200,
                html: '<div class="loading" style="color:#ffffff;">' +
                '<i class="axi axi-flight animated bounceOutUp" style="font-size:100px;"></i>' +
                '<div style="font-family: consolas">Data is delivered by a plane</div>' +
                '</div>'
            }
        );

        // ax-header가 존재 하는 경우
        if (jQuery(".ax-header").get(0)) {
            setTimeout(function(){
                fcObj.bindTopMenu();
            }, 1);
        }

        if (window.fnObj && fnObj.pageStart) {
            setTimeout(function () {
                fnObj.pageStart();
            }, 100);
        }

        app.modal.bind(); // app modal 초기화
    },
    pageResize: function () {
        if (window.fnObj && fnObj.pageResize) fnObj.pageResize();
    },
    openTab: function (item) {
        if (fnObj.tab && fnObj.tab.open) {
            fnObj.tab.open(item);
        }
    },
    bindTopMenu: function () {

        sideMenu_data = axf.copyObject(topMenu_data);

        $.each(topMenu_data, function () {
            this.label = this.label + ' <i class="axi axi-arrow-drop-down-circle"></i>';
        });

        topMenu.setConfig({
            //openType: "click",
            targetID: "ax-top-menu",
            parentMenu: {
                className: "parentMenu"
            },
            childMenu: {
                className: "childMenu",
                hasChildClassName: "expand", // script 방식에서만 지원 됩니다.
                align: "center",
                valign: "top",
                margin: {top: -5, left: 0},
                arrowClassName: "varrow2",
                arrowMargin: {top: 2, left: 0}
            },
            childsMenu: {
                className: "childsMenu",
                hasChildClassName: "expand",
                align: "left",
                valign: "top",
                margin: {top: -4, left: 0},
                arrowClassName: "harrow",
                arrowMargin: {top: 13, left: 2}
            },
            onComplete: function () {
                if (window.pageInfo) topMenu.setHighLightOriginID(window.pageInfo.id);
            },
            onclick: function (item) {
                if(item.href && item.href != "#" && item.href != "" && item.href != "#.jsp") {
                    if (fnObj.tab && fnObj.tab.open) {
                        fnObj.tab.open(item);

                        
                    }
                }
            }
        });
        topMenu.setTree(topMenu_data);

        loginInfoModal.setConfig({
            width: 300, height: 160,
            head: {
                close: {
                    onclick: function () {

                    }
                }
            },
            onclose: function () {
                trace("close bind");
            }
        });

        axdom("#mx-loginfo-handle").bind("click", function () {
            var obj = loginInfoModal.open();
            obj.modalHead.html('<div class="modal-log-info-title">Login Info</div>');
            obj.modalBody.html('<div class="modal-log-info-wrap"><ul class="ax-loginfo">' + axdom("#ax-loginfo").html() + '</ul><div style="clear:both;"></div></div>');
        });

    },
    open_user_info: function () {
        app.modal.open({
            url: "/jsp/modal/user-info-modal.jsp",
            pars: "callBack=fcObj.change_user_info",
            width: 400
        });
    },
    change_user_info: function () {
        toast.push("개인정보 변경완료.");
        app.modal.close();
    }
};

jQuery(document.body).ready(function () {
    fcObj.pageStart()
});
jQuery(window).resize(function () {
    fcObj.pageResize();
});