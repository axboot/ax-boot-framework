var parent_window = parent||opener||window;
var loading_mask = new AXMask();
var AXGrid_instances = [];
var AXTree_instances = [];
var TMPL = {};

var fcObj = {
	pageStart: function () {
		loading_mask.setConfig();
		loading_mask.setContent({
			width: 200, height: 200,
			html: '<div class="loading" style="color:#ffffff;">' +
			'<i class="axi axi-cog pulse" style="font-size:100px;display:block;"></i>' +
			'<div style="font-family: consolas">Data is delivered</div>' +
			'</div>'
		});

		if (window.fnObj && fnObj.pageStart) {
			setTimeout(function () {
				fnObj.pageStart();
				fcObj.resize_elements();
			}, 100);
		}

		// 템플릿 수집
		if((TMPL["tmpl-target"] = $("#tmpl-target")).get(0)){
			app.tmpl.collect(TMPL["tmpl-target"]);
		}
	},
	pageResize: function () {
		if (window.fnObj && fnObj.pageResize) fnObj.pageResize();
		this.resize_elements();
	},

	resize_elements: function () {
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
					RESIZE_ELEMENTS[i].dom.css({height: axf.clientHeight() + adjust - 190});
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
	}
};
// app app.js 로 이사~~

jQuery(document.body).ready(function () {
	fcObj.pageStart()
	window.common_buttons = jQuery(".cx-common-btns");
});
jQuery(window).resize(function () {
	fcObj.pageResize();
});