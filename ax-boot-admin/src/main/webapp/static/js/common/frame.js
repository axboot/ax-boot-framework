/**
 * Created by tom on 15. 12. 3..
 */
var fnObj = {
    pageStart: function () {
        var _this = this;
        this.tab.init();

        // 레이아웃 사이즈 조절
        _this.resizeLayout();
        jQuery(window).resize(function () {
            _this.resizeLayout();
        });
    },
    resizeLayout: function () {
        this.tab.frameTarget.css({height: $.getDocHeight() - 93});
        this.tab.resize();
    }
};

fnObj.tab = {
    target: null,
    frameTarget: null,
    limitCount: 10,
    list: [
        {menuId: "", label: '홈', url: '/jsp/dashboard.jsp', id: "fi-" + (new Date()).getTime(), status: "on", fixed: true}
        //{menuId: "", label: '기초정보관리', url: '/jsp/main.jsp', id: "fi-" + (new Date()).getTime(), status: ""}
    ],
    init: function () {
        this.target = $("#header-tab-container");
        this.frameTarget = $("#content-frame-container");
        this.print();

        AXContextMenu.bind({
            id:"header-tab-container-menu",
            theme:"AXContextMenu", // 선택항목
            width:"150", // 선택항목
            menu:[
                {userType:0, label:'<i class="axi axi-ion-refresh"></i> 현재 탭 새로고침', className:"", onclick:function(){
                    $.each(fnObj.tab.list, function (idx, _item) {
                        if(_item.status == "on"){
                            window[_item.id].location.reload();
                            return false;
                        }
                    });
                }},
                {userType:0, label:'<i class="axi axi-ion-close"></i> 현재 탭 닫기', className:"", onclick:function(id){
                    $.each(fnObj.tab.list, function (idx, _item) {
                        if(_item.status == "on"){
                            fnObj.tab.close(_item.id);
                            return false;
                        }
                    });

                }},
                {userType:1, label:'<i class="axi axi-ion-close" style="color: #ff3300;"></i> 모든 탭 닫기', className:"", onclick:function(){
                    $.each(fnObj.tab.list, function (idx, _item) {
                        if(idx > 0) {
                            fnObj.tab.target.find('[data-tab-id="' + _item.id + '"]').remove();
                            fnObj.tab.frameTarget.find('[data-tab-id="' + _item.id + '"]').remove();
                        }
                    });

                    fnObj.tab.target.find('[data-tab-id="' + fnObj.tab.list[0].id + '"]').addClass("on");
                    fnObj.tab.frameTarget.find('[data-tab-id="' + fnObj.tab.list[0].id + '"]').addClass("on");
                    fnObj.tab.resize();
                }}
            ]
        });

        $(".ax-header-tab").bind("contextmenu", function(e){

            AXContextMenu.open({id:"header-tab-container-menu"}, event);

            if (event.stopPropagation) event.stopPropagation();
            if (event.preventDefault) event.preventDefault();
            return false;
        });
    },
    _getItem: function (item) {
        var po = [];
        po.push('<div class="tab-item ' + item.status + '" data-tab-id="' + item.id + '">');
        po.push(item.label);
        if(!item.fixed) po.push('<i class="axi axi-close2" data-tab-close="true" data-tab-id="' + item.id + '"></i>');
        po.push('</div>');
        return po.join('');
    },
    _getFrame: function (item) {
        var po = [];
        po.push('<iframe class="frame-item ' + item.status + '" data-tab-id="' + item.id + '" name="' + item.id + '" src="' + item.url + '" frameborder="0" framespacing="0"></iframe>');
        return po.join('');
    },
    print: function () {
        var _this = this;

        var po = [], fo = [], active_item;
        this.list.forEach(function (_item, idx) {
            po.push(_this._getItem(_item));
            fo.push(_this._getFrame(_item));
            if (_item.status == "on") {
                active_item = _item;
            }
        });

        this.target.html(po.join(''));
        this.frameTarget.html(fo.join(''));
        // event bind
        this.bindEvent();

        if (active_item) {
            topMenu.setHighLightOriginID(active_item.menuId || "");
        }
    },
    open: function (item) {
        // {href, id}
        
        var _item;

        if (item.href == "#" || item.href == "") return;

        var findedIndex = -1;
        this.list.forEach(function (o, idx) {
            o.status = '';
            if (o.url == item.href) {
                findedIndex = idx;
            }
        });
        this.target.find('.tab-item').removeClass("on");
        this.frameTarget.find('.frame-item').removeClass("on");

        if (findedIndex < 0) {
            this.list.push({
                menuId: item.id,
                label: item.label,
                url: item.href,
                id: "fi-" + (new Date()).getTime(), status: "on"
            });
            _item = this.list.last();
            this.target.append(this._getItem(_item));
            this.frameTarget.append(this._getFrame(_item));

        }
        else {
            _item = this.list[findedIndex];
            this.target.find('[data-tab-id="' + _item.id + '"]').addClass("on");
            this.frameTarget.find('[data-tab-id="' + _item.id + '"]').addClass("on");
        }

        if (_item) {
            //topMenu.setHighLightOriginID(_item.menuId || "");
        }

        if (this.list.length > this.limitCount) {
            var remove_item = this.list.splice(1, 1);
            this.target.find('[data-tab-id="' + remove_item[0].id + '"]').remove();
            this.frameTarget.find('[data-tab-id="' + remove_item[0].id + '"]').remove();
        }

        this.bindEvent();
        this.resize();
    },
    click: function (id, e) {
        this.list.forEach(function (_item) {
            if (_item.id == id) {
                _item.status = 'on';
                if (event.shiftKey) {
                    window.open(_item.url);
                }

                if (_item) {
                    //topMenu.setHighLightOriginID(_item.menuId || "");
                }
            }
            else _item.status = '';
        });
        this.target.find('.tab-item').removeClass("on");
        this.frameTarget.find('.frame-item').removeClass("on");

        this.target.find('[data-tab-id="' + id + '"]').addClass("on");
        this.frameTarget.find('[data-tab-id="' + id + '"]').addClass("on");
    },
    close: function (id) {
        var newList = [], removeItem;
        this.list.forEach(function (_item) {
            if (_item.id != id) newList.push(_item);
            else removeItem = _item;
        });
        if (newList.length == 0) {
            alert("마지막 탭을 닫을 수 없습니다");
            return false;
        }
        this.list = newList;
        this.target.find('[data-tab-id="' + id + '"]').remove();
        this.frameTarget.find('[data-tab-id="' + id + '"]').remove();

        if (removeItem.status == 'on') {
            var lastIndex = this.list.length - 1;
            this.list[lastIndex].status = 'on';
            this.target.find('[data-tab-id="' + this.list[lastIndex].id + '"]').addClass("on");
            this.frameTarget.find('[data-tab-id="' + this.list[lastIndex].id + '"]').addClass("on");
        }

        // check status = "on"
        var hasStatusOn = false;
        this.list.forEach(function (_item) {
            if(_item.status == "on") hasStatusOn = true;
        });
        if(!hasStatusOn){
            var lastIndex = this.list.length - 1;
            this.list[lastIndex].status = 'on';
            this.target.find('[data-tab-id="' + this.list[lastIndex].id + '"]').addClass("on");
            this.frameTarget.find('[data-tab-id="' + this.list[lastIndex].id + '"]').addClass("on");
        }

        this.resize();
    },
    bindEvent: function () {
        var _this = this;
        this.target.find('.tab-item').unbind("click").bind("click", function (e) {
            if (e.target.tagName == "I") {
                _this.close(this.getAttribute("data-tab-id"));
            }
            else {
                _this.click(this.getAttribute("data-tab-id"), e);
            }
        });
    },
    resize: function () {
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout((function () {
            var ctWidth = this.target.parent().width();
            var tabsWidth = this.target.outerWidth();

            if (ctWidth < tabsWidth) {
                this.target.find('.tab-item').css({'min-width': 'auto', width: (ctWidth / this.list.length) - 4});
            }
            else {
                this.target.find('.tab-item').css({'min-width': '120px', width: "auto"});

                tabsWidth = this.target.outerWidth();
                if (ctWidth < tabsWidth) {
                    this.target.find('.tab-item').css({'min-width': 'auto', width: (ctWidth / this.list.length) - 4});
                }
            }
        }).bind(this), 100);

    }
};

