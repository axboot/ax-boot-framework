<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
    request.setAttribute("callBack", request.getParameter("callBack"));
    request.setAttribute("callBackType", request.getParameter("callBackType"));
    request.setAttribute("searchParams", request.getParameter("searchParams"));
    request.setAttribute("itemIndex", request.getParameter("itemIndex"));
%>
<ax:layout name="modal.jsp">

    <ax:set name="title" value="모달창"/>
    <ax:div name="css"></ax:div>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12" wrap="true">
                <div id="page-header">
                    <form id="page-search-view">
                        <div class="ax-sbar">
                            <span class="sitem">
                                <span class="slabel">국가코드</span>
                                <input type="text" id="searchParams" class="AXInput W150" value="${searchParams}"/>
                                <button class="AXButton" type="button" id="search-view0-search"><i
                                        class="axi axi-search3"></i></button>
                            </span>
                        </div>
                    </form>
                </div>
                <div class="H10"></div>
                <div id="page-grid-view0" style="position:relative;height:200px;"></div>
            </ax:col>
        </ax:row>


    </ax:div>
    <ax:div name="buttons">
        <button type="button" class="AXButton" id="ax-page-btn-cancel">취소</button>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var CALLBACK_NAME = "${callBack}";
            var CALLBACK_TYPE = "${callBackType}";
            var ITEM_INDEX = "${itemIndex}";

            /**
             * actions
             */
            var ACTIONS = $.extend(app.ACTIONS, {
                PAGE_SEARCH: 'PAGE_SEARCH',
                PAGE_SELECT: 'PAGE_SELECT',
                PAGE_CANCEL: 'PAGE_CANCEL',

                RECEIVE_LIST: 'RECEIVE_LIST',

                GRID_ITEM_CLICK: 'GRID_ITEM_CLICK'
            });

            var fnObj = {
                dispatch: function (caller, act, data) {
                    switch (act) {
                        case ACTIONS.PAGE_SEARCH:
                            app.net.ajax({type: "GET", url: "/api/v1/samples/parent", data: data}, function (res) {
                                ACTIONS.dispatch(null, ACTIONS.RECEIVE_LIST, res);
                            });
                            break;

                        case ACTIONS.RECEIVE_LIST:
                            fnObj.gridView0.setData(data);

                            break;

                        case ACTIONS.GRID_ITEM_CLICK:
                            this.save(data);
                            break;

                        case ACTIONS.PAGE_SELECT:
                            //console.log(this.gridView0.getCheckedItem());
                            this.save(this.gridView0.getCheckedItem().checkedList);
                            break;

                        case ACTIONS.PAGE_CANCEL:
                            this.cancel();
                            break;

                        default:

                            return false;
                    }
                    // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
                },
                save: function (data) {
                    data.itemIndex = ITEM_INDEX;
                    app.modal.save(window.CALLBACK_NAME, window.CALLBACK_TYPE, data);
                },
                cancel: function () {
                    app.modal.cancel();
                }
            };

            /**
             * pageStart
             */
            fnObj.pageStart = function () {
                this.toolbarView.initView();
                this.searchView0.initView();
                this.gridView0.initView();

                ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, {});
                return false;
            };

            /**
             * toolbarView
             */
            fnObj.toolbarView = {
                initView: function () {
                    var _this = this;

                    $("#ax-page-btn-search").bind("click", function () {
                        ACTIONS.dispatch(_this, ACTIONS.PAGE_SEARCH, {});
                    });

                    $("#ax-page-btn-cancel").click(function () {
                        ACTIONS.dispatch(fnObj, ACTIONS.PAGE_CANCEL, null);
                    });
                }
            };


            /**
             * searchView#0
             */
            fnObj.searchView0 = {
                searchParams: $('#searchParams'),

                initView: function () {
                    $("#page-search-view").attr("onsubmit", '$("#ax-page-btn-search").trigger("click");return false;');

                },
                getData: function () {
                    return {
                        searchParams: this.searchParams.val()
                    };
                },
                setData: function (data) {
                    for (var k in data) {
                        this[k] = data[k];
                    }
                    return true;
                },
                onChange: function () {

                }
            };

            /**
             * gridView#0
             */
            fnObj.gridView0 = {
                initView: function () {
                    var
                            _this = this
                            ;

                    app.builder.grid.build(this, {
                        targetID: "page-grid-view0",
                        pageId: '${pageId}',
                        colGroup: app.builder.grid.col.build({
                            "key": {
                                label: "코드", width: "100", align: "left",
                                editor: {
                                    type: "text",
                                    maxLength: 8,
                                    disabled: function () {
                                        return this.item._CUD != "C";
                                    },
                                    beforeUpdate: function (val) {
                                        var hasCd = false, index = this.index;
                                        _this.target.list.forEach(function (item, i) {
                                            if (item.key == val && i != index) {
                                                hasCd = true;
                                                return false;
                                            }
                                        });
                                        if (hasCd) _this.target.list[index].__edting__ = true;
                                        return (hasCd) ? "" : val;
                                    },
                                    afterUpdate: function () {
                                        if (this.item.key == "" && this.item.__edting__) toast.push("코드값이 중복됩니다. 입력이 취소 되었습니다.");
                                        delete _this.target.list[this.index].__edting__;
                                    }
                                }
                            },
                            "value": {
                                label: "이름", width: "150",
                                editor: {
                                    type: "text",
                                    maxLength: 50
                                }
                            },
                            "etc1": {
                                label: "날짜", width: "150",
                                editor: {
                                    type: "calendar",
                                    config: {
                                        separator: "-"
                                    }
                                }
                            },
                            "etc2": {
                                label: "컬럼1", width: "150",
                                editor: {
                                    type: "text",
                                    maxLength: 50
                                }
                            }
                        }),
                        body: {
                            onclick: function () {
                                ACTIONS.dispatch(fnObj, ACTIONS.GRID_ITEM_CLICK, this.item);
                            }
                        },
                        page: {
                            display: true,
                            paging: true,
                            onchange: function (pgNo) {
                                ACTIONS.dispatch(this, ACTIONS.PAGING_LIST, pgNo);
                            }
                        }
                    });
                },
                addItem: function () {
                    this.target.pushList({});
                    this.target.setFocus(this.target.list.length - 1);
                },
                getCheckedItem: function () {
                    var
                            _this = this,
                            checkedList = this.target.getCheckedListWithIndex(0),
                            keyParams = []
                            ;

                    $.each(checkedList, function () {
                        if (this.item._CUD != "C") {
                            keyParams.push("key=" + this.item.key); // ajax delete 요청 목록 수집
                        }
                    });

                    return {
                        keyParam: keyParams,
                        checkedList: checkedList
                    };
                },
                removeItem: function (data) {
                    this.target.removeListIndex(data);
                    toast.push("삭제 되었습니다.");
                    return false;
                },
                getData: function () {
                    var
                            liveList = [],
                            removedList = []
                            ;

                    $.each(this.target.list, function () {
                        if (this.key != "") {
                            liveList.push(this);
                        }
                    });

                    $.each(this.target.removedList, function () {
                        if (this._CUD != "C") {
                            this.deleted = true;
                            removedList.push(this);
                        }
                    });

                    this.setData(liveList);
                    return liveList.concat(removedList);
                },
                setData: function (res) {
                    this.target.setData(app.builder.grid.getGridData(res));
                },
                onChange: function () {

                }
            };
        </script>
    </ax:div>
</ax:layout>