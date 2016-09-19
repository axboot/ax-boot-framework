var topMenu = new AXTopDownMenu();
var mobileMenu = new AXMobileMenu();
var loginInfoModal = new AXMobileModal();
var loading_mask = new AXMask();
var AXGrid_instances = [];
var AXTree_instances = [];
var fcObj = {
	pageStart: function(){
		loading_mask.setConfig();
		loading_mask.setContent(
			{
				width:200, height:200,
				html: '<div class="loading" style="color:#ffffff;">' +
				'<i class="axi axi-ion-gear-a animated bounceOutUp" style="font-size:100px;display:block;"></i>' +
				'<div style="font-family: consolas">Data is delivered</div>' +
				'</div>'
			}
		);
		fcObj.ax_aside = jQuery(".ax-aside");
		fcObj.ax_aside_box = jQuery(".ax-aside-box");
		fcObj.ax_aside_menu = axdom(".ax-aside-menu");
		fcObj.ax_content = jQuery(".ax-content");
		fcObj.cx_page_title = jQuery("#cx-page-title");

		// ax-header가 존재 하는 경우
		if(jQuery(".ax-header").get(0)) {
			fcObj.bindEvent();
			fcObj.bindTopMenu();
			fcObj.bindSideMenu();
		}

		if(window.fnObj && fnObj.pageStart) {
			setTimeout(function(){
				fnObj.pageStart();
				fcObj.resize_elements();
			}, 100);
		}

		//this.theme.init();
		app.modal.bind(); // app modal 초기화

		fcObj.ax_aside_box.data("status", (axf.getCookie("new-asidestatus") || "open"));
		fcObj.setAsideMenu("first");



		$(".td-layout:last-child").css({"padding-right":"0px"});
	},
	pageResize: function(){
		if(window.fnObj && fnObj.pageResize) fnObj.pageResize();
		this.resize_elements();
		fcObj.setAsideMenu();
	},

	setAsideMenu: function(first){
		if(axf.clientWidth() < 1160) {
			fcObj.ax_content.addClass("expand");
			fcObj.ax_aside.hide();
			fcObj.cx_page_title.css({"margin-left":"0px"});
		}else{
			if(fcObj.ax_aside) fcObj.ax_aside.show();

			if(fcObj.ax_aside_box.data("status") == "open") {
				fcObj.ax_content.removeClass("expand");
				fcObj.cx_page_title.css({"margin-left": "0px"});
				//fcObj.ax_aside_menu.removeClass("on");
				//fcObj.ax_aside_box.show();
			}
			else
			if(fcObj.ax_aside_box.data("status") == "close") {
				fcObj.ax_content.addClass("expand");
				fcObj.cx_page_title.css({"margin-left": "30px"});
				fcObj.ax_aside_menu.addClass("on");
				fcObj.ax_aside_box.hide();
			}
		}
	},
	resize_elements: function(){
		if (window.RESIZE_ELEMENTS && window.RESIZE_ELEMENTS.length > 0) {
			for (var i = 0, l = RESIZE_ELEMENTS.length, adjust; i < l; i++) {
				if (RESIZE_ELEMENTS[i].id) {
					if (!RESIZE_ELEMENTS[i].dom) RESIZE_ELEMENTS[i].dom = $("#" + RESIZE_ELEMENTS[i].id);
					if(typeof RESIZE_ELEMENTS[i].adjust == "undefined"){
						adjust = -$("#page-header").height();
					}
					else if (typeof RESIZE_ELEMENTS[i].adjust == "function") {
						adjust = (RESIZE_ELEMENTS[i].adjust() || 0).number();
					}
					else {
						adjust = (RESIZE_ELEMENTS[i].adjust || 0).number();
					}
					RESIZE_ELEMENTS[i].dom.css({height: axf.clientHeight() + adjust - 110});
					// AXPage 안에 AXBox의 높이가 적절히 표시되기 위한 조건
				}
			}

			if (AXGrid_instances.length > 0) {
				for (var i = 0, l = AXGrid_instances.length; i < l; i++) {
					AXGrid_instances[i].resetHeight();
				}
			}
			if (AXTree_instances.length > 0) {
				for (var i = 0, l = AXTree_instances.length; i < l; i++) {
					AXTree_instances[i].resetHeight();
				}
			}
			//AXGrid_instances
			//AXTree_instances
		}
	},
	bindEvent: function(){
		fcObj.ax_aside_menu.bind("click", function(){
			var elem = fcObj.ax_aside_box;


			if(elem.data("status") == "close"){
				elem.data("status", "open");
				axf.setCookie("new-asidestatus", "open", 10, {
					path  : "/",             // {String} [현재 페이지의 path]
					domain: window.location.host,
					secure: true
				});

				fcObj.ax_content.removeClass("expand");
				jQuery(this).removeClass("on");
				elem.show();
				fcObj.cx_page_title.css({"margin-left":"0px"});
			}else{
				elem.data("status", "close");
				axf.setCookie("new-asidestatus", "close", 10, {
					path  : "/",             // {String} [현재 페이지의 path]
					domain: window.location.host,
					secure: true
				});
				fcObj.ax_content.addClass("expand");
				jQuery(this).addClass("on");
				elem.hide();
				fcObj.cx_page_title.css({"margin-left":"30px"});
			}
			axdom(window).resize();
		});
	},
	bindTopMenu: function(){

		sideMenu_data = axf.copyObject(topMenu_data);

		$.each(topMenu_data, function() {
			this.label = this.label + ' <i class="axi axi-arrow-drop-down-circle"></i>';
		});


		topMenu.setConfig({
			targetID:"ax-top-menu",
			parentMenu:{
				className:"parentMenu"
			},
			childMenu:{
				className:"childMenu",
				hasChildClassName:"expand", // script 방식에서만 지원 됩니다.
				align:"center",
				valign:"top",
				margin:{top:0, left:0},
				arrowClassName:"varrow2",
				arrowMargin:{top:2, left:0}
			},
			childsMenu:{
				className:"childsMenu",
				hasChildClassName:"expand",
				align:"left",
				valign:"top",
				margin:{top:-4, left:0},
				arrowClassName:"harrow",
				arrowMargin:{top:13, left:2}
			},
			onComplete: function(){
				if(window.pageInfo) topMenu.setHighLightOriginID( window.pageInfo.id );
			}
		});
		topMenu.setTree(topMenu_data);

		axdom("#mx-top-menu-handle").bind("click", function(){
			mobileMenu.open();
		});

		mobileMenu.setConfig({
			reserveKeys:{
				primaryKey:"parent_srl",
				labelKey:"label",
				urlKey:"link",
				targetKey:"target",
				addClassKey:"ac",
				subMenuKey:"cn"
			},
			onclick: function(){ // 메뉴 클릭 이벤트
				mobileMenu.close();
				location.href = this.url;
			}
		});
		mobileMenu.setTree(topMenu_data);

		loginInfoModal.setConfig({
			width:300, height:160,
			head:{
				close:{
					onclick:function(){

					}
				}
			},
			onclose: function(){
				trace("close bind");
			}
		});
		axdom("#mx-loginfo-handle").bind("click", function(){
			var obj = loginInfoModal.open();
			obj.modalHead.html( '<div class="modal-log-info-title">Login Info</div>' );
			obj.modalBody.html( '<div class="modal-log-info-wrap"><ul class="ax-loginfo">' + axdom("#ax-loginfo").html() + '</ul><div style="clear:both;"></div></div>' );
		});

	},
	bindSideMenu: function(){
		var po = [], _target = axdom("#ax-aside-ul"), on_menu_id = (function() {
			if(window.pageInfo) return window.pageInfo.id;
			return "";
		})(), script_on_id;

		// 부모메뉴 클릭 이벤트
		fcObj.onclick_parent_menu = function(id){

			var jdom = $("#ax-menu-ul-"+id), pjdom = $("#ax-menu-"+id);
			//$("#ax-menu-ul-"+id).toggleClass("on");

			if(typeof fcObj.sidemenu_click_id !== "undefined"){
				if(id != fcObj.sidemenu_click_id) {
					var _jdom = $("#ax-menu-ul-" + fcObj.sidemenu_click_id), _pjdom = $("#ax-menu-" + fcObj.sidemenu_click_id);
					_jdom.slideUp({
						duration: 200, easing: "cubicInOut", complete: function () {
							_jdom.removeClass("on");
							_pjdom.removeClass("open");
						}
					});
				}
			}

			jdom.slideToggle({duration:200, easing:"cubicInOut", complete:function(){
				if(jdom.css("display") == "block"){
					jdom.addClass("on");
					pjdom.addClass("open");
					fcObj.sidemenu_click_id = id;

				}else{
					jdom.removeClass("on");
					pjdom.removeClass("open");
					delete fcObj.sidemenu_click_id;
				}
			}});

		};
		for(var mi=0;mi<sideMenu_data.length;mi++){
			var child_on = false;
			po.push('<li id="ax-menu-'+ sideMenu_data[mi]._id +'" class="parent'+(
				function(){
					if(sideMenu_data[mi]._id == on_menu_id){
						return ' on open"'
					}else{
						return '';
					}
				}
			)()+'">');
			if(sideMenu_data[mi].url == "" || sideMenu_data[mi].url == "#"){
				po.push('<a href="javascript:fcObj.onclick_parent_menu(\'' + sideMenu_data[mi]._id + '\')">');
			}
			else
			{
				po.push('<a href="' + sideMenu_data[mi].url + '" target="' + (sideMenu_data[mi].target||"_self") + '">');
			}

			po.push('<i class="axi axi-web"></i> ');
			po.push(sideMenu_data[mi].label);
			
			if( sideMenu_data[mi].cn && sideMenu_data[mi].cn.length > 0 ) {
				po.push('<div class="is-on"></div>');
			}
			
			po.push('</a>');
			// --- 2단계
			if( sideMenu_data[mi].cn && sideMenu_data[mi].cn.length > 0 ){
				po.push('<ul id="ax-menu-ul-'+ sideMenu_data[mi]._id +'" class="child'+(
					function(){
						if(sideMenu_data[mi]._id == on_menu_id){
							return ' on open'
						}else{
							return '';
						}
					}
				)()+'">');
				$.each(sideMenu_data[mi].cn, function(){
					var item = this;
					var _this_id = this._id;
					var sub_child_on = false;

					po.push('<li id="ax-menu-'+ _this_id +'" class="child'+(
						function(){
							if(_this_id == on_menu_id){
								child_on = true;
								return ' on'
							}else{
								return '';
							}
						}
					)()+'"><a href="'+ this.url +'" target="'+ (this.target||"_self") +'">');
					po.push(this.label);

					po.push('</a>');

					//--- 3단계

					if( item.cn && item.cn.length > 0 ){
						po.push('<ul id="ax-menu-ul-'+ item._id +'" class="child on sub_child'+(
							function(){
								if(item._id == on_menu_id){
									return ' open'
								}else{
									return '';
								}
							}
						)()+'">');
						$.each(item.cn, function(){
							var _this_id = this._id;
							po.push('<li id="ax-menu-'+ _this_id +'" class="child sub_child'+(
								function(){
									if(_this_id == on_menu_id){
										sub_child_on = true;
										return ' on'
									}else{
										return '';
									}
								}
							)()+'"><a href="'+ this.url +'" target="'+ (this.target||"_self") +'">', this.label, '</a></li>');

							//--- 4단계



							//--- 4단계
						});
						po.push('</ul>');
					}
					// -- 2단계
					if(sub_child_on){
						script_on_id = sideMenu_data[mi]._id;
					}
					//--- 3단계
					po.push('</li>');
				});
				po.push('</ul>');
			}
			// -- 2단계
			if(child_on){
				script_on_id = sideMenu_data[mi]._id;
			}
			po.push('</li>');
		}
		_target.empty();
		_target.append(po.join(''));
		
		if(script_on_id){
			_target.find("#ax-menu-" + script_on_id).addClass("on").addClass("open");
			_target.find("#ax-menu-ul-" + script_on_id).addClass("on");
			fcObj.sidemenu_click_id = script_on_id;
		}
	},
	theme: {
		sel: null,
		init: function(){
			return;
			var themes = [
				["taeyoung","cocker"],
				["cocker","cocker"],
				["cocker-dark","bulldog"],
				["cocker-dark-red","cocker"],
				["cacao","kakao"],
				["cacao-dark","kakao"]
			];
			var po = [];
			$.each(themes, function(){
				po.push('<option value="', this[0],'/', this[1],'">', this[0],'</option>');
			});
			fcObj.theme.sel = jQuery("#theme-select");
			fcObj.theme.sel.html( po.join('') );
			
			var _theme;
			if((_theme = axf.getCookie("axutheme"))){
				fcObj.theme.sel.val(_theme);
				fcObj.theme.change(_theme);
			}
			fcObj.theme.sel.bind("change", function(e) {
				fcObj.theme.change(e.target.value);
			});
		},
		change: function(theme){
			var t = theme.split("/");
			jQuery("#axu-theme-admin").attr("href", "ui/"+t[0]+"/admin.css");
			jQuery("#axu-theme-axisj").attr("href", "/plugins/axisj/ui/"+ t[1] +"/AXJ.min.css?v="+axf.timekey());
			axf.setCookie("axutheme", theme);
		}
	},
	open_user_info: function(){
		app.modal.open({
			url:"/jsp/modal/user-info-modal.jsp",
			pars:"callBack=fcObj.change_user_info",
			width: 400
		});
	},
	change_user_info: function(){
		toast.push("개인정보 변경완료.");
		app.modal.close();
	}
};
// app app.js 로 이사~~

jQuery(document.body).ready(function() {
	fcObj.pageStart()
});
jQuery(window).resize(function() {
	fcObj.pageResize();
});

// 2014-12-26 AXU, admin.js add script
jQuery(document.body).ready(function() {
	//jQuery(document.body).append('<div class="ax-scroll-top"><a href="javascript:window.scroll(0, 0);"><i class="axi axi-ion-arrow-up-c"></i> TOP</a></div>');
	//window.scroll_top_handle = jQuery(".ax-scroll-top");
	window.common_buttons = jQuery(".cx-common-btns");
});

jQuery(window).bind("scroll", function() {
	if(jQuery(window).scrollTop() > 40){
		//window.scroll_top_handle.addClass("on");
		if(window.common_buttons) window.common_buttons.addClass("on");
	}else{
		//window.scroll_top_handle.removeClass("on");
		if(window.common_buttons) window.common_buttons.removeClass("on");
	}
});