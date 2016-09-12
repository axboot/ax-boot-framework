<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="${PAGE_NAME}" />
    <ax:set name="page_desc" value="${PAGE_REMARK}" />

	<ax:div name="contents">
		<ax:row>
			<ax:col size="12">
                <ax:custom customid="page-button" pageId="${PAGE_ID}" searchAuth="${SEARCH_AUTH}" saveAuth="${SAVE_AUTH}" excelAuth="${EXCEL_AUTH}" function1Auth="${FUNCTION_1_AUTH}" function2Auth="${FUNCTION_2_AUTH}" function3Auth="${FUNCTION_3_AUTH}" function4Auth="${FUNCTION_4_AUTH}" function5Auth="${FUNCTION_5_AUTH}"></ax:custom>

                <div class="ax-search" id="page-search-box"></div>
				<div class="ax-button-group">
				    <div class="right">
				        <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 등록</button>
				    </div>
				    <div class="ax-clear"></div>
				</div>
				<div class="ax-grid" id="page-grid-box"></div>

			</ax:col>
		</ax:row>
	</ax:div>
	<ax:div name="scripts">
	    <script type="text/javascript">
        var RESIZE_ELEMENTS = [
            {id:"page-grid-box", adjust:-97}
        ];
	    var fnObj = {
	        pageStart: function(){
	            this.search.bind();
	            this.grid.bind();
	            this.bindEvent();
	        },
	        bindEvent: function(){
	            var _this = this;
                $("#ax-page-btn-search").bind("click", function(){
                    _this.search.submit();
                });
                $("#ax-page-btn-save").bind("click", function(){
                    setTimeout(function(){
                        _this.save();
                    }, 500);
                });
                $("#ax-page-btn-excel").bind("click", function(){
                    app.modal.excel({
                        pars:"target=${className}"
                    });
                });

                $("#ax-grid-btn-add").bind("click", function(){
                    app.modal.open({
                        url:"/jsp/system/system-operation-notice-modal.jsp",
                        pars:""
                    });
                });
	        },
            save: function(){

            },
            excel: function(){

            },
	        search: {
	            target: new AXSearch(),
	            bind: function(){
	                var _this = this;
	                this.target.setConfig({
	                    targetID:"page-search-box",
	                    theme : "AXSearch",
	                    mediaQuery: {
	                        mx:{min:0, max:767}, dx:{min:767}
	                    },
	                    onsubmit: function(){
	                        // 버튼이 선언되지 않았거나 submit 개체가 있는 경우 발동 합니다.
	                    },
	                    rows:[
                            {display:true, addClass:"", style:"", list:[
                                {label:"검색구분", labelWidth:"100", type:"selectBox", width:"", key:"option_sc", addClass:"", valueBoxStyle:"", value:"1",
                                    options:[{optionValue:"", optionText:"제목"}
                                        , {optionValue:"", optionText:"내용"}
                                        , {optionValue:"", optionText:"등록자"}],
                                    AXBind:{
                                        type:"select", config:{
                                            onChange:function(){
                                                //toast.push(Object.toJSON(this));

                                            }
                                        }
                                    }
                                },
                                {label:"", labelWidth:"", type:"inputText", width:"150", key:"keyword_sc", addClass:"secondItem", valueBoxStyle:"padding-left:0px;", value:"",
                                    onChange: function(changedValue){

                                    }
                                }
                            ]}
	                    ]
	                });
	            },

	            submit: function(){
	                var pars = this.target.getParam();
	                //toast.push("콘솔창에 파라미터 정보를 출력하였습니다.");
	                //trace(pars);
                    fnObj.grid.setPage( 1, pars );
	            }
	        },
	        grid: {
	            target: new AXGrid(),
                pageNo: 1,
	            bind: function(){
	                this.target.setConfig({
	                    targetID : "page-grid-box",
	                    theme : "AXGrid",
                        colHeadAlign:"center",
                        /*
	                    mediaQuery: {
	                        mx:{min:0, max:767}, dx:{min:767}
	                    },
	                    */
	                    colGroup : [
	                        {key:"title", label:"제목", width:"*", align:"left"},
	                        {key:"insDt", label:"등록일", width:"80", align:"center", formatter:function(){
                                if (this.value!=""){
                                    return this.value.date().print();
                                }
                                else
                                    return "";
                            }},
                            {key:"dspYn", label:"표시여부", width:"70", align:"center", formatter:function(){
                                if (this.value=="Y")
                                    return "사용";
                                else
                                    return "사용안함";
                            }},
	                        {key:"popupYn", label:"팝업여부", width:"70", align:"center", formatter:function(){
                                if (this.value=="Y")
                                    return "사용";
                                else
                                    return "사용안함";
                            }},
	                        {key:"stDt", label:"게시시간", width:"160", align:"center", formatter:function(){
                                if (this.value==undefined || this.value=="")
                                    return "";
                                else
                                    return this.value.date().print() + " ~ " + this.item.endDt.date().print();
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
                        data: "pageNumber=" + (pageNo-1) + "&pageSize=50&" + (searchParams||fnObj.search.target.getParam())
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
                }
	        }
	    };
	    </script>
	</ax:div>
</ax:layout>