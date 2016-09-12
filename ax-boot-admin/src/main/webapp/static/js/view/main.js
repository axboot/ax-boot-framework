var page_menu_id = "dashboard";

var fnObj = {
	pageStart: function(){
		setTimeout((function(){
			this.grid.bind();
			this.grid_02.bind();
			this.chart_01.bind();
			this.chart_02.bind();
		}).bind(this), 500);
	},
	pageResize: function(){

	},
	grid: {
		target: new AXGrid(),
		pageNo: 0,
		bind: function(){
			this.target.setConfig({
				targetID : "grid-notice",
				theme : "AXGrid",
				colHeadAlign:"center",
				//fitToWidth: true,
				colGroup : [
					{key:"title", label:"제목", width:"*", align:"left"},
					{key:"insDt", label:"등록일", width:"100", formatter:function(){
						if (this.value!=""){
							return this.value.date().print();
						}
						else
							return "";
					}}
				],
				body : {
					onclick: function(){
						app.modal.open({
							url:"/jsp/system/system-operation-notice-modal-view.jsp",
							pars:"id=" + this.item.id
						});
					}
				},
				page: {
					display:true,
					paging:false,
					onchange: function(pageNo){
						_this.setPage(pageNo);
					}
				}
			});

			fnObj.grid.setPage(fnObj.grid.pageNo);
		},
		setPage: function(pageNo, searchParams) {
			var _this = this;
			_this.pageNo = pageNo;
			app.ajax({
				type: "GET",
				url: "/api/v1/notices",
				data: "pageNumber=" + (pageNo) + "&pageSize=50"
			}, function(res){
				if(res.error){
					alert(res.error.message);
				}
				else
				{
					var gridData = {
						list: res.list,
						page:{
							pageNo: res.page.currentPage.number()+1,
							pageSize: res.page.pageSize,
							pageCount: res.page.totalPages,
							listCount: res.page.totalElements
						}
					};
					_this.target.setData(gridData);
				}
			});
		},
		reload: function(){
			fnObj.grid.setPage(fnObj.grid.pageNo);
		}
	},

	grid_02: {
		target: new AXGrid(),
		get: function(){ return this.target },
		bind: function(){
			var _this = this, target = this.target;
			this.target.setConfig({
				targetID : "grid-sales-anal",
				theme : "AXGrid",
				sort: false,
				fixedColSeq: 2,
				colHeadAlign:"center",
				colGroup: (function(){
					var row = [
						{key:"index", label:"NO", width:"40", align:"center", formatter:function(){
							//this.target.index;
							//this.target.index;
							return this.index + 1;
						}},
						{key:"compNm", label:"업체명", width:"100", align:"center"},
						{key:"storNm", label:"매장명", width:"150"},
						{key:"cashAmt", label:"현금매출", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"cardAmt", label:"카드매출", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"totalAmt", label:"총판매액", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"dcAmt", label:"할인액", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"saleAmt", label:"공급가액", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"vatAmt", label:"부가세", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"saleTot", label:"매출액", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"cnt", label:"영수건수", width:"60", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"price", label:"영수단가", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},

						{key:"monSaleTot", label:"매출액", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"monCnt", label:"영수건수", width:"60", align:"right", formatter: function(){
							return this.value.money();
						}},
						{key:"monPrice", label:"영수단가", width:"100", align:"right", formatter: function(){
							return this.value.money();
						}}
					];
					return row;
				})(),

				colHead : {
					rows: (function(){
						var rows = [
							[
								{ key: 'index', rowspan: 2, valign: "middle" },
								{ key: 'compNm', rowspan: 2, valign: "middle" },
								{ key: 'storNm', rowspan: 2, valign: "middle" },
								{ colspan: 9, label: "조회일", valign: "middle" },
								{ colspan: 3, label: "조회월", valign: "middle" }
							],
							[
								{ key: 'cashAmt' },
								{ key: 'cardAmt' },

								{ key: 'totalAmt' },
								{ key: 'dcAmt' },
								{ key: 'saleAmt' },
								{ key: 'vatAmt' },
								{ key: 'saleTot' },
								{ key: 'cnt' },
								{ key: 'price' },

								{ key: 'monSaleTot' },
								{ key: 'monCnt' },
								{ key: 'monPrice' }
							]
						];
						return rows;
					})()
				},
				body: {
					onclick: function() {
						//toast.push(Object.toJSON({index:this.index, item:this.item}));
						//fnObj.modal.open("gridView", this.item);
					}
				},
				page: {
					display: true,
					paging: false,
					pageNo:1,
					pageSize:100,
					status:{formatter: null}
				}
			});

		}
	},

	chart_01: {
		graph: null,
		target: null,
		bind: function(){
			if('getContext' in axf.getId("chart-001")) {

				var _this = this;
				var params = {
					saleStartDt:"",
					saleEndDt:"",
					comparisonStartDt:"",
					comparisonEndDt:""
				};
				var weeknames = ["일","월","화","수","목","금","토"];
				var weeks = {};
				var today = new Date();
				params.saleStartDt = today.add(-today.getDay());
				params.saleEndDt = params.saleStartDt.add(6);
				params.comparisonStartDt = params.saleStartDt.add(-7);
				params.comparisonEndDt = params.comparisonStartDt.add(6);

				var __date1 = params.saleStartDt, __date2 = params.comparisonStartDt;
				for(var i=0;i<7;i++){
					weeks[__date1.print("yyyymmdd")] = {amt1:0,name:weeknames[i]};
					weeks[__date2.print("yyyymmdd")] = {amt2:0,name:weeknames[i]};
					__date1 = __date1.add(1);
					__date2 = __date2.add(1);
				}

				params.saleStartDt = params.saleStartDt.print("yyyymmdd");
				params.saleEndDt = params.saleEndDt.print("yyyymmdd");
				params.comparisonStartDt = params.comparisonStartDt.print("yyyymmdd");
				params.comparisonEndDt = params.comparisonEndDt.print("yyyymmdd");


				var res = {
					"list1":[],
					"list2":[]
				};

				__date1 = params.saleStartDt.date(),
				__date2 = params.comparisonStartDt.date();
				function get_random(){
					return parseInt(Math.random() * 100) + 10000;
				}
				for(var i=0;i<7;i++){
					res.list1.push({"saleDt":__date1.print("yyyymmdd"), "totalAmt": get_random(),"saleTot": get_random()});
					res.list2.push({"saleDt":__date2.print("yyyymmdd"), "totalAmt": get_random(),"saleTot": get_random()});
					__date1 = __date1.add(1);
					__date2 = __date2.add(1);
				}


				$.each(res.list1, function(){
					if(weeks[this.saleDt]) weeks[this.saleDt].amt1 = (this.totalAmt||0).number();
				});
				$.each(res.list2, function(){
					if(weeks[this.saleDt]) weeks[this.saleDt].amt2 = (this.totalAmt || 0).number();
				});

				_this.target = new Chart(axf.getId("chart-001").getContext("2d"));
				var data = {
					labels  : (function(){
						var arrs = [];
						$.each(weeks, function(k, v){
							if(typeof v.amt1 !== "undefined") arrs.push( k.date().print("mm/dd") + "("+ v.name+")" );
						});
						return arrs;
					})(),
					//["04/17(월)", "04/18(화)", "04/19(수)", "04/20(목)", "04/21(금)", "04/22(토)", "04/23(일)"],
					datasets: [{
						label               : "지난주",
						fillColor           : "rgba(220,220,220,0.2)",
						strokeColor         : "rgba(220,220,220,1)",
						pointColor          : "rgba(220,220,220,1)",
						pointStrokeColor    : "#fff",
						pointHighlightFill  : "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data                : (function(){
							var arrs = [];
							$.each(weeks, function(k, v){
								if(typeof v.amt2 !== "undefined") arrs.push( (v.amt2/1000 || 0).number() );
							});
							return arrs;
						})()
						//[65, 59, 80, 81, 56, 55, 40]
					}, {
						label               : "이번주",
						fillColor           : "rgba(255,162,42,0.2)",
						strokeColor         : "rgba(255,162,42,1)",
						pointColor          : "rgba(255,162,42,1)",
						pointStrokeColor    : "#fff",
						pointHighlightFill  : "#fff",
						pointHighlightStroke: "rgba(151,187,205,1)",
						data                : (function(){
							var arrs = [];
							$.each(weeks, function(k, v){
								if(typeof v.amt1 !== "undefined") arrs.push( (v.amt1/1000 || 0).number() );
							});
							return arrs;
						})()
						//[28, 48, 40, 19, 86, 27, 90]
					}]
				};

				_this.graph = _this.target.Line(data, {
					legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
				});
				$("#chart-001-legend").html(_this.graph.generateLegend());

			}else{

			}
		}
	},

	chart_02: {
		graph: null,
		target: null,
		bind: function(){
			if('getContext' in axf.getId("chart-002")) {
				var _this = this;
				_this.target = new Chart(axf.getId("chart-002").getContext("2d"));

				var data = [];
				var colors = [
					{
						color:"#F7464A",
						highlight: "#FF5A5E"
					},
					{
						color: "#46BFBD",
						highlight: "#5AD3D1"
					},
					{
						color: "#FDB45C",
						highlight: "#FFC870"
					},
					{
						color: "#949FB1",
						highlight: "#A8B3C5"
					},
					{
						color: "#4D5360",
						highlight: "#616774"
					},
					{
						color:"#F7464A",
						highlight: "#FF5A5E"
					},
					{
						color: "#46BFBD",
						highlight: "#5AD3D1"
					},
					{
						color: "#FDB45C",
						highlight: "#FFC870"
					},
					{
						color: "#949FB1",
						highlight: "#A8B3C5"
					},
					{
						color: "#4D5360",
						highlight: "#616774"
					},
				];

				var params = {
					topCount:5,
					searchStartDt:"",
					searchEndDt:""
				};
				var today = new Date();
				params.searchStartDt = today.add(-6);//.add(-today.getDay());
				params.searchEndDt = params.searchStartDt.add(6);
				params.searchStartDt = params.searchStartDt.print("yyyymmdd");
				params.searchEndDt = params.searchEndDt.print("yyyymmdd");

					var res = {"list":[{"itemCd":"900608","itemNm":"품목5","qty":11,"price":99000},{"itemCd":"900606","itemNm":"품목3","qty":12,"price":94900},{"itemCd":"900604","itemNm":"품목1","qty":39,"price":75200},{"itemCd":"900605","itemNm":"품목2","qty":19,"price":73900},{"itemCd":"900609","itemNm":"품목6","qty":9,"price":61500},{"itemCd":"10032","itemNm":"맥스파이시더블케이준버거","qty":1,"price":10000},{"itemCd":"10005","itemNm":"서비스5","qty":2,"price":10000},{"itemCd":"900607","itemNm":"품목4","qty":3,"price":4100},{"itemCd":"900610","itemNm":"품목7","qty":2,"price":2000}]};

					$.each(res.list, function(index, item){
						data.push({
							label: item.itemNm,
							value: item.price / 1000,
							color: colors[index].color,
							highlight: colors[index].highlight
						});
					});


					var options = {
						percentageInnerCutout : 20,
						animationEasing: "easeOutQuart",
						animateRotate : true,
						//animateScale : true
						legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
					};

					_this.graph = _this.target.Doughnut(data, options);
					$("#chart-002-legend").html(_this.graph.generateLegend());

			}else{

			}
		}
	}

};
jQuery(window).resize(function() {
	fnObj.pageResize()
});