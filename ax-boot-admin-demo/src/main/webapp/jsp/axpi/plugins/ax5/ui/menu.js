/**
 * @class ax5.ui.menu
 * @classdesc
 * @version v0.0.1
 * @author tom@axisj.com
 * @logs
 * 2014-04-21 tom : 시작
 * @example
 * ```
 * var my_menu = new ax5.ui.menu();
 * ```
 */

(function(root, ax_super) {

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				keys: {
					value:"value",
					text:"text",
					shortcut:"shortcut",
					data:"data",
					menu:"menu"
				}
			};

		}).apply(this, arguments);

		var cfg = this.config;
		/**
		 * Preferences of Menu UI
		 * @method ax5.ui.menu.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.menu}
		 * @example
		 * ```
		 * set_config({
		 *      target : {Element|AX5 nodelist}, // 메뉴 UI를 출력할 대상
		 *      keys : { // keys 는 menu ui 내부에서 사용되는 키값을 사용자가 변경 할 수 있는 환경설정값 이다. 개발환경에 맞게 커스트마이징 할 수 있다.
		 *          value: {String} ['value'] 메뉴의 값
		 *          text: {String} ['text'] 메뉴의 텍스트 라벨
		 *          shotcut: {String} ['shotcut'] 메뉴의 단축키
		 *          data: {String} ['data'],
		 *          menu: {String} ['menu'] 메뉴키 - 자식아이템도 이 키 값으로 인식한다.
		 *      },
		 *      menu : {Array} menu item
		 *      onclick: {Function} [onclick] - 메뉴 아이템 클릭이벤트 처리자
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target || !cfg.menu){
				U.error("aui_menu_400", "[ax5.ui.menu] config.target, config.menu is required");
			}
			cfg.target = ax5.dom(cfg.target);
			this.print_list();
		};

		this.print_list = function(){
			var cfg = this.config, po = [];
			po.push('<ul class="ax-item-group">');
			for(var i= 0,l=cfg[cfg.keys.menu].length;i<l;i++){
				po.push('<a class="ax-item" data-menu-item="'+ i +'">');
					po.push(cfg[cfg.keys.menu][i][cfg.keys.text]);

				po.push('</a>');
			}
			po.push('</ul>');
			cfg.target.html( po.join('') );
			cfg.target.find('[data-menu-item]').on("click", (function(e){
				this.onclick(e||window.event);
			}).bind(this));
		};

		this.onclick = function(e, target, index){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-menu-item")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-menu-item");
				if(this.config.onclick){
					this.config.onclick.call({
						menu: this.config[cfg.keys.menu],
						item: this.config[cfg.keys.menu][index],
						target: cfg.target.elements[0],
						item_target: target
					});
				}
			}
		};
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.menu = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_menu", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);