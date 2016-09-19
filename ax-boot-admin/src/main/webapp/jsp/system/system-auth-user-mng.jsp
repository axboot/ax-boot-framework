<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="${PAGE_NAME}" />
    <ax:set name="page_desc" value="${PAGE_REMARK}" />

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customId="page-button" pageId="${PAGE_ID}" searchAuth="${SEARCH_AUTH}" saveAuth="${SAVE_AUTH}" excelAuth="${EXCEL_AUTH}" function1Auth="${FUNCTION_1_AUTH}" function2Auth="${FUNCTION_2_AUTH}" function3Auth="${FUNCTION_3_AUTH}" function4Auth="${FUNCTION_4_AUTH}" function5Auth="${FUNCTION_5_AUTH}"></ax:custom>

                <ax:custom customId="table">
                    <ax:custom customId="tr">
                        <ax:custom customId="td">
                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-list-alt"></i> 권한그룹 목록</h2>
                                </div>
                                <div class="right"></div>
                                <div class="ax-clear"></div>
                            </div>

                            <div class="ax-grid" id="page-grid-box"></div>

                        </ax:custom>
                        <ax:custom customId="td" style="width:30px;text-align:center;vertical-align:middle;">
                            <div>
                                <div class="center"><button type="button" class="AXButton" id="ax-grid-btn-del" ><i class="axi axi-chevron-left2"></i> </button></div>
                                <div class="H10"></div>
                                <div class="center"><button type="button" class="AXButton" id="ax-grid-btn-add" ><i class="axi axi-chevron-right2"></i> </button></div>
                            </div>
                        </ax:custom>
                        <ax:custom customId="td">
                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-list-alt"></i> 사용자 목록</h2>
                                </div>
                                <div class="right"></div>
                                <div class="ax-clear"></div>
                            </div>

                            <form id="page-search-box">
                                <div class="ax-sbar">
                                    <span class="sitem">
                                        <span class="slabel">사용자</span>
                                        <input type="text" name="" id="userCd" class="AXInput W50" value="" readonly="readonly" />
                                        <input type="text" name="" id="userNm" class="AXInput W100" value="" />
                                        <button type="button" class="AXButton" id="user-find"><i class="axi axi-ion-android-search"></i> </button>
                                    </span>
                                </div>
                            </form>
                            <div class="ax-grid" id="page-grid2-box"></div>

                            <div class="ax-button-group">
                                <div class="left">
                                    <h2><i class="axi axi-copy"></i> 권한그룹 복사</h2>
                                </div>
                                <div class="right">
                                    <input type="text" name="ax-auth-copy" id="ax-auth-copy" class="AXInput W50" value="OFF" />
                                </div>
                                <div class="ax-clear"></div>
                            </div>

                            <form id="page-search-bottom-box">
                                <div class="ax-sbar">
                                    <span class="sitem">
                                        <span class="slabel">복사 사용자</span>
                                        <input type="text" name="userCd" id="copy-userCd" class="AXInput W50" value="" disabled="disabled" readonly="readonly" />
                                        <input type="text" name="userNm" id="copy-userNm" class="AXInput W100" value="" disabled="disabled"  />
                                        <button type="button" class="AXButton" id="copy-user-find" disabled="disabled" ><i class="axi axi-ion-android-search"></i> </button>
                                    </span>
                                </div>
                            </form>
                        </ax:custom>
                    </ax:custom>
                </ax:custom>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var RESIZE_ELEMENTS = [
                {id:"page-grid-box", adjust:function(){
                    return -40;
                }},
                {id:"page-grid2-box", adjust:function(){
                    return -150;
                }}
            ];
            var fnObj = {
                pageStart: function(){
                    this.grid.bind();
                    this.grid2.bind();
                    this.grid2.reset();
                    this.bindEvent();
                },
                bindEvent: function(){
                    var _this = this;
                    $("#ax-page-btn-search").bind("click", function(){
                        _this.grid.load();
                    });
                    $("#ax-page-btn-save").bind("click", function(){
                        setTimeout(function() {
                            _this.grid2.save();
                        }, 500);
                    });
                    $("#ax-page-btn-excel").bind("click", function(){
                        app.modal.excel({
                            pars:"target=${className}"
                        });
                    });

                    $("#ax-grid-btn-del").bind("click", function(){
                        _this.grid.del();
                    });

                    $("#ax-grid-btn-add").bind("click", function(){
                        _this.grid.add();
                    });

                    $("#user-find").click(function(){
                        app.modal.open({
                            url:"/jsp/system/system-user-search-modal-01.jsp",
                            pars:"callBack=fnObj.grid2.setUser", // callBack 말고
                            width:600 // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                            //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                        });
                    });
                    $("#copy-user-find").click(function(){
                        app.modal.open({
                            url:"/jsp/system/system-user-search-modal-01.jsp",
                            pars:"callBack=fnObj.grid2.setCopyUser", // callBack 말고
                            width:600 // 모달창의 너비 - 필수값이 아닙니다. 없으면 900
                            //top:100 // 모달창의 top 포지션 - 필수값이 아닙니다. 없으면 axdom(window).scrollTop() + 30
                        });
                    });

                    $("#ax-auth-copy").bindSwitch({on:"ON", off:"OFF", onchange:function(){
                        if(this.value == "OFF"){
                            $("#copy-userCd").attr("disabled", "disabled");
                            $("#copy-userNm").attr("disabled", "disabled");
                            $("#copy-user-find").attr("disabled", "disabled");
                        }else{
                            $("#copy-userCd").removeAttr("disabled");
                            $("#copy-userNm").removeAttr("disabled");
                            $("#copy-user-find").removeAttr("disabled");
                        }

                    }});
                },
                search: {
                    target: new AXSearch(),
                    get: function(){ return this.target },
                    bind: function(){

                    },
                    save: function(){
                        var listDTO = [];
                        var grid2_list = fnObj.grid2.target.list;
                        if(grid2_list.length > 0){
                            axf.each(grid2_list, function(i, d){
                                var item = {
                                    no: (d.no || ""),
                                    no1: (d.no1 || ""),
                                    no2: (d.no2 || ""),
                                    no3: (d.no3 || ""),
                                    no4: (d.no4 || ""),
                                    no5: (d.no5 || ""),
                                    no6: (d.no6 || "")
                                }
                                listDTO.push(item);
                            });
                        }

                        var frm = this.target;
                        //mask.open();
                        //var url = pageUrl + "/Save";
                        var pars = [];
                        pars.push("listDTO=" + Object.toJSON(listDTO));
                        trace(pars.join("&"));

                        alert("저장되었습니다.");
                    },
                    excel: function(){

                    },
                    submit: function(){
                        var pars = this.target.getParam();
                        //toast.push("콘솔창에 파라미터 정보를 출력하였습니다.");
                        //trace(pars);

                        fnObj.grid.target.setList({
                            ajaxUrl:"<c:url value='/list.json' />", ajaxPars:pars, onLoad:function(){
                                //trace(this);
                            }
                        });
                    }
                },
                grid: {
                    pageNo: 0,
                    target: new AXGrid(),
                    get: function(){ return this.target },
                    bind: function(){
                        var _this = this;
                        _this.target.setConfig({
                            targetID : "page-grid-box",
                            theme : "AXGrid",
                            colHeadAlign:"center",
                            /*
                            mediaQuery: {
                                mx:{min:0, max:767}, dx:{min:767}
                            },
                            */
                            colGroup : [
                                {key:"grpAuthCd", label:"그룹코드", width:"70", align:"center"},
                                {key:"grpAuthNm", label:"그룹명", width:"140"},
                                {key:"remark", label:"비고", width:"*"}
                            ],
                            body : {
                                onclick: function(){
                                    //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                    //fnObj.form.edit(this.item);
                                }
                            },
                            page:{
                                display:true,
                                paging:false,
                                onchange: function(pageNo){
                                    _this.setPage(pageNo-1);
                                }
                            }
                        });
                        this.load();
                    },
                    load: function() {
                        var _this = this;
                        //_this.pageNo = pageNo;
                        app.ajax({
                            type: "GET",
                            url: "/api/v1/auth/groups",
                            data: "pageNumber=" + (0) + "&pageSize=10000"
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
                    add: function(){
                        var items = this.target.getSelectedItem();
                        if(items.error) return false;
                        fnObj.grid2.add(items);
                    },
                    del: function(){
                        fnObj.grid2.del();
                    }
                },
                grid2: {
                    target: new AXGrid(),
                    reset: function(){
                        // 사용자 선택 또는 페이지 시작시 호출
                        $("#ax-auth-copy").setValueInput("OFF");
                        $("#copy-userCd").attr("disabled", "disabled");
                        $("#copy-userNm").attr("disabled", "disabled");
                        $("#copy-user-find").attr("disabled", "disabled");
                        $("#copy-userCd").val("");
                        $("#copy-userNm").val("");
                    },
                    bind: function(){
                        this.target.setConfig({
                            targetID : "page-grid2-box",
                            theme : "AXGrid",
                            colHeadAlign:"center",
                            mediaQuery: {
                                mx:{min:0, max:767}, dx:{min:767}
                            },
                            colGroup : [
                                {key:"grpAuthCd", label:"그룹코드", width:"70", align:"center"},
                                {key:"grpAuthNm", label:"그룹명", width:"140"}
                            ],
                            body : {
                                onclick: function(){
                                    //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                    //alert(this.list);
                                    //클릭시 0번째 체크박스 토글 처리
                                    //fnObj.grid2.get().checkedColSeq(0, null, this.index);
                                }
                            },
                            page:{
                                display:true,
                                paging:false
                            }
                        });
                    },
                    add: function(list){
                        if($("#userCd").val() == ""){
                            alert("사용자를 선택해주세요.");
                            return;
                        }

                        list = [].concat(list);
                        var collect = [];
                        var hasItem = false;
                        for(var i= 0,l=list.length;i<l;i++){
                            hasItem = false;
                            for(var ii= 0,ll=this.target.list.length;ii<ll;ii++) {
                                if(this.target.list[ii].grpAuthCd == list[i].item.grpAuthCd){
                                    hasItem = true;
                                    break;
                                }
                            }
                            if(!hasItem){
                                list[i].item.userCd = $("#userCd").val();
                                list[i].item.userNm = $("#userNm").val();
                                list[i].item.remark = "";
                                list[i].item.useYn = "Y";
                                collect.push(list[i].item);
                            }
                        }
                        if(collect.length > 0) this.target.pushList(collect);
                    },
                    del: function(){
                        var items = this.target.getSelectedItem();
                        if(items.error) return false;
                        this.target.removeListIndex([].concat(items));
                    },
                    setUser: function(item){
                        $("#userCd").val(item.userCd);
                        $("#userNm").val(item.userNm);
                        app.ajax({
                            type: "GET",
                            url: "/api/v1/auth/users",
                            data: "userCd=" + item.userCd + "&pageNumber=0&pageSize=10000"
                        }, function(res){
                            if(res.error){
                                alert(res.error.message);
                            }
                            else
                            {
                                fnObj.grid2.target.setList(res.list);
                            }
                        });
                        app.modal.close();
                    },
                    setCopyUser: function(item){
                        $("#copy-userCd").val(item.userCd);
                        $("#copy-userNm").val(item.userNm);
                        app.modal.close();
                    },
                    save: function(){

                        var list = this.target.list.concat([]), isCopy = false;

                        if($("#userCd").val() == ""){
                            alert("사용자를 선택해주세요.");
                            return;
                        }

                        if($("#ax-auth-copy").val() == "ON"){
                            if($("#copy-userCd").val() == ""){
                                alert("복사 사용자를 선택해주세요.");
                                return;
                            }

                            for(var i= 0,l=list.length;i<l;i++){
                                list[i].userCd = $("#copy-userCd").val();
                                list[i].userNm = $("#copy-userNm").val();
                            }

                            isCopy = true;
                        }

                        app.ajax({
                            type: "PUT",
                            url: "/api/v1/auth/users",
                            data: Object.toJSON(list)
                        }, function(res){
                            if(res.error){
                                alert(res.error.message);
                            }
                            else
                            {
                                toast.push("저장 되었습니다.");
                                if(isCopy){
                                    fnObj.grid2.setUser({userCd:$("#copy-userCd").val(), userNm:$("#copy-userNm").val()});
                                    fnObj.grid2.reset();
                                }else{
                                    fnObj.grid2.setUser({userCd:$("#userCd").val(), userNm:$("#userNm").val()});
                                }

                            }
                        });
                    }
                }
            };
        </script>
    </ax:div>
</ax:layout>