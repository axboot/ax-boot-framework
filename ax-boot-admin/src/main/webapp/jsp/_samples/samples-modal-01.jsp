<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
	request.setAttribute("callBack", request.getParameter("callBack"));
	request.setAttribute("itemIndex", request.getParameter("itemIndex"));
%>
<ax:layout name="modal.jsp">
	<ax:set name="title" value="정보등록" />
	<ax:set name="page_desc" value="" />

	<ax:div name="contents">
		<ax:row>
			<ax:col size="12" wrap="true">


                <%-- %%%%%%%%%% 신규 버튼 (업체등록) %%%%%%%%%% --%>
                <div class="ax-button-group">
                    <div class="left">
                        <h2><i class="axi axi-table"></i> 정보등록</h2>
                    </div>
                    <div class="right">

                    </div>
                    <div class="ax-clear"></div>
                </div>

                <%-- %%%%%%%%%% 폼 (info) %%%%%%%%%% --%>
                <form id="model-form" name="model-form" class="ax-form" method="get" onsubmit="return false;">

                    <div class="ax-rwd-table">
                        <ax:fields>
                            <ax:field label="코드" width="100px">
                                <input type="text" class="AXInput W90" data-ax-path="key" data-ax-validate="required" title="코드"/>
                            </ax:field>
                            <ax:field label="날짜" width="100px">
                                <input type="text" class="AXInput W90" data-ax-path="etc1" id="date-etc1" title="장소"/>
                            </ax:field>
                        </ax:fields>
                        <ax:fields>
                            <ax:field label="이름" width="200px">
                                <input type="text" class="AXInput W200" data-ax-path="value" data-ax-validate="required" title="이름"/>
                            </ax:field>
                        </ax:fields>
                        <ax:fields>
                            <ax:field label="컬럼1" width="100px">
                                <input type="text" class="AXInput W90" data-ax-path="etc2" title="컬럼1"/>
                            </ax:field>
                            <ax:field label="선택타입" width="100px">
                                <input type="text" class="AXInput W40" data-ax-path="etc3" readonly="readonly"/>
                                <input type="text" class="AXInput W90" data-ax-path="etc3label" id="selector-etc3"/>
                            </ax:field>
                        </ax:fields>
                    </div>

                    <h3>종속된 리스트 &nbsp;&nbsp;
                        <button class="AXButton" id="ax-form-period-add">ADD</button>
                    </h3>

                    <table cellpadding="0" cellspacing="0" class="AXGridTable">
                        <colgroup>
                            <col width="60"/>
                            <col width="120"/>
                            <col/>
                        </colgroup>
                        <thead>
                        <tr>
                            <td></td>
                            <td>코드</td>
                            <td>이름</td>
                        </tr>
                        </thead>
                        <tbody data-ax-repeat="childList">
                        <script type="text/html">
                            <tr>
                                <td align="center">
                                    <button class="AXButton" data-ax-repeat-click="remove">del</button>
                                    {{^@first}}
                                    {{/@first}}
                                </td>
                                <td>
                                    <input type="text" name="input-text" id="key-{{@i}}" placeholder="key-{{@i}}"
                                           data-ax-item-path="key" data-ax-validate="required" title="코드"
                                           class="AXInput W100"
                                           {{^@isNew}}
                                           readonly="readonly"
                                           {{/@isNew}}
                                    />
                                </td>
                                <td>
                                    <input type="text" name="input-text" id="value-{{@i}}" placeholder="value-{{@i}}" data-ax-item-path="value" data-ax-validate="required" title="이름"
                                           class="AXInput W100"/>
                                </td>
                            </tr>
                        </script>
                        </tbody>
                    </table>

                </form>

			</ax:col>
		</ax:row>

	</ax:div>
	<ax:div name="buttons">
        <button type="button" class="AXButton" id="ax-page-btn-save">저장</button>
        <button type="button" class="AXButton Red" id="ax-page-btn-del" style="display: none;">삭제</button>
        <button type="button" class="AXButton" id="ax-page-btn-cancel">취소</button>
	</ax:div>

	<ax:div name="scripts">
		<script type="text/javascript">
			var CALLBACK_NAME = "${callBack}";
			var ITEM_INDEX = "${itemIndex}";

            var RESIZE_ELEMENTS = [];

            /**
             * CODE
             */
            var CODE = app.CODE({
                "etc3": [
                    {CD: '1', NM: "코드"},
                    {CD: '2', NM: "CODE"},
                    {CD: '4', NM: "VA"}
                ]
            });

            /**
             * actions
             */
            var ACTIONS = $.extend(app.ACTIONS, {
                PAGE_SEARCH: 'PAGE_SEARCH',
                PAGE_SAVE: 'PAGE_SAVE',
                PAGE_CANCEL: 'PAGE_CANCEL',
                PAGE_DEL: 'PAGE_DEL'
            });

            var fnObj = {
                dispatch: function (caller, act, data) {
                    var _this = this;
                    switch (act) {
                        case ACTIONS.PAGE_SEARCH:
                            data = parent.fnObj.gridView0.target.list[ITEM_INDEX];
                            app.net.ajax({type: "GET", url: "/api/v1/samples/child", data: "parentKey=" + data.key}, function (res) {
                                data.childList = res.list;
                                fnObj.formView0.setData(data);
                            });
                            break;

                        case ACTIONS.PAGE_SAVE:
                            if (fnObj.formView0.validate()) {
                                app.net.ajax({type: "PUT", url: "/api/v1/samples/parent", data: JSON.stringify([data])}, function (res) {
                                    app.net.ajax({type: "PUT", url: "/api/v1/samples/child", data: JSON.stringify(data.childList)}, function (res) {
                                        _this.save();
                                    });
                                });
                            }
                            break;

                        case ACTIONS.PAGE_CANCEL:
                            this.cancel();
                            break;

                        case ACTIONS.PAGE_DEL:

                            break;

                        default:

                            return false;
                    }
                    // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
                },
                save: function (data) {
                    app.modal.save(window.CALLBACK_NAME, data);
                },
                cancel: function () {
                    app.modal.cancel();
                }
            };

            /**
             * pageStart
             */
            fnObj.pageStart = function () {
                fnObj.toolbarView.initView();
                fnObj.formView0.initView();

                ACTIONS.dispatch(fnObj, ACTIONS.PAGE_SEARCH, null);

                app.modal.resize();
                return false;
            };

            /**
             * toolbarView
             */
            fnObj.toolbarView = {
                initView: function () {
                    $("#ax-page-btn-save").click(function () {
                        ACTIONS.dispatch(fnObj, ACTIONS.PAGE_SAVE, fnObj.formView0.getData());
                    });
                    $("#ax-page-btn-cancel").click(function () {
                        ACTIONS.dispatch(fnObj, ACTIONS.PAGE_CANCEL, null);
                    });

                    if (window.ITEM_INDEX) {
                        $("#ax-page-btn-del").show().click(function () {
                            ACTIONS.dispatch(fnObj, ACTIONS.PAGE_DEL, null);
                        });
                    }
                }
            };

            /**
             * formView#0
             */
            fnObj.formView0 = {
                modelTarget: $("#model-form"),
                model: new AXBinder(),
                getBasicData: function () {
                    var data = {
                        key: "",
                        childList: []
                    };
                    return data;
                },
                initView: function (data) {
                    var
                            _this = this
                            ;

                    $("#ax-form-period-add").bind("click", function () {
                        _this.model.add("childList", {"@isNew": true, key: "", value: ""});
                    });

                    data = $.extend(true, {}, this.getBasicData());
                    this.model.set_model(data, this.modelTarget);

                    this.model.onclick("childList", function () {
                        if (this.value == "remove") {
                            _this.model.remove(this.repeat_path, this.item_index);
                        }
                    });
                    this.model.onupdate("childList", function () {
                        app.modal.resize();
                    });

                    $('#date-etc1').bindDate();
                    $('#selector-etc3').bindSelector({
                        reserveKeys: {
                            optionVaue: "CD",
                            optionText: "NM"
                        },
                        options: CODE.etc3,
                        onchange: function () {
                            //console.log(this);
                            if (this.selectedOption) {
                                _this.model.set("etc3", this.selectedOption.CD);
                            }
                        }
                    });
                },
                getData: function () {
                    var data = this.model.get();

                    // childList 에 부모키 주입
                    data.childList.forEach(function (n) {
                        n.parentKey = data.key;
                    });

                    return data;
                },
                setData: function (data) {
                    if (typeof data == "undefined") {
                        $('[data-ax-path="key"]').removeAttr("readonly");
                    }
                    else {
                        $('[data-ax-path="key"]').attr("readonly", "readonly");
                        if(data.etc3){
                            data.etc3label = CODE.etc3.map[data.etc3];
                        }
                        if (!data.childList || data.childList.length == 0) {
                            data.childList = this.getBasicData().childList;
                        }
                    }
                    this.model.set_model(data || this.getBasicData());
                },
                validate: function () {
                    var rs = this.model.validate();
                    if (rs.error) {
                        alert(rs.error[0].jquery.attr("title") + '을(를) 입력해주세요.');
                        rs.error[0].jquery.focus();
                        return false;
                    }
                    return true;
                },
                reset: function () {
                    this.setData();
                },
                onChange: function () {
                    console.log(arguments);
                }
            };

		</script>
	</ax:div>
</ax:layout>