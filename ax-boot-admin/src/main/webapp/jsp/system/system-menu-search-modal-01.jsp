<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
    request.setAttribute("callBack", request.getParameter("callBack"));
    request.setAttribute("itemIndex", request.getParameter("itemIndex"));
%>
<ax:layout name="modal.jsp">
    <ax:set name="title" value="메뉴 선택"/>
    <ax:set name="page_desc" value=""/>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12" wrap="true">

                <div class="ax-tree" id="page-tree-box" style="height:500px;"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="buttons">
        <button type="button" class="AXButton" onclick="fnObj.control.save();">확인</button>
        <button type="button" class="AXButton" onclick="fnObj.control.cancel();">취소</button>
    </ax:div>

    <ax:div name="scripts">
        <script type="text/javascript">
            var getRequestValue = function (val) {
                return val;
            };
            var callBackName = "${callBack}";
            var itemIndex = getRequestValue(${itemIndex});
            var fnObj = {
                pageStart: function () {
                    this.tree.bind();
                    this.bindEvent();
                    app.modal.resize();
                },
                pageResize: function () {
                    app.modal.resize();
                },
                bindEvent: function () {

                },

                tree: {
                    clickIndex: 0,
                    target: new AXTree(),
                    bind: function () {
                        var _this = this;
                        this.target.setConfig({
                            targetID: "page-tree-box",
                            theme: "AXTree_none",
                            relation: {
                                parentKey: "mnuUpCd",
                                childKey: "mnuCd"
                            },
                            reserveKeys: {
                                parentHashKey: "pHash", // 부모 트리 포지션
                                hashKey: "hash", // 트리 포지션
                                openKey: "open", // 확장여부
                                subTree: "cn", // 자식개체키
                                displayKey: "display" // 표시여부
                            },
                            iconWidth: 15,
                            indentRatio: 0.7,
                            colGroup: [
                                {
                                    key: "mnuCd", label: "번호", width: "30", align: "center", formatter: "checkbox",
                                    disabled: function () {
                                        return false;
                                    },
                                    checked: function () {
                                        return false;
                                        //return (this.item.ckd == 1) ? true : false;
                                    }
                                },
                                {
                                    key: "mnuNm", label: "제목", width: "*", align: "left", indent: true,
                                    getIconClass: function () {
                                        if (this.item.__subTreeLength > 0) {
                                            return {
                                                addClass: "userHtml",
                                                html: "<i class='axi axi-folder-open-o'></i>"
                                            };
                                        }
                                        else {
                                            return {
                                                addClass: "userHtml",
                                                html: "<i class='axi axi-file-o'></i>"
                                            };
                                        }
                                    },
                                    formatter: function () {
                                        //return "<b>"+this.item.no.setDigit(2) + "</b> : " + this.item.nodeName + " (" + this.item.writer + ")";
                                        return (this.item.useYn == "N") ? '<s>' + this.item.mnuNm + '</s>' : this.item.mnuNm;
                                    }
                                }
                            ],
                            body: {
                                onclick: function (idx, item) {
                                    fnObj.tree.clickIndex = this.index;
                                }
                            }
                        });

                        this.load();
                    },
                    load: function () {
                        var _this = this;
                        app.ajax(
                                {
                                    type: "GET",
                                    url: "/api/v1/menus",
                                    data: {pageNumber: 0, pageSize: 10000}
                                },
                                function (res) {
                                    //trace(res.list);

                                    var list_pointer = {};
                                    res.list.forEach(function (item) {
                                        if (item.mnuLv == 1) {
                                            item.mnuUpCd = "__root__";
                                        }
                                        item.open = true;
                                        //item.open = true;
                                    });

                                    res.list.splice(0, 0, {
                                        mnuCd: "__root__",
                                        mnuNm: "메뉴",
                                        open: true
                                    });

                                    fnObj.tree.target.setList(res.list);
                                    fnObj.tree.target.click(_this.clickIndex, "open");
                                }
                        );
                    }
                },

                control: {
                    save: function () {
                        if(typeof itemIndex != "undefined") {
                            var item = fnObj.tree.target.list[fnObj.tree.clickIndex];
                            if (!item.progCd) {
                                alert("선택할 수 없는 메뉴 입니다. 하위 아이템을 선택해보세요.");
                                return;
                            }
                            app.modal.save(window.callBackName, item, itemIndex);
                        }
                        else{
                            // 멀티선택
                            app.modal.save(window.callBackName, fnObj.tree.target.getCheckedList(0));
                        }
                    },
                    cancel: function () {
                        app.modal.cancel();
                    }
                }
            };
        </script>
    </ax:div>
</ax:layout>