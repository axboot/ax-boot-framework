<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j"%>
<ax:layout name="modal.jsp">

    <ax:set name="title" value="모달창"/>
    <ax:div name="css"></ax:div>

    <ax:div name="contents">

        <ax:row>
            <ax:col size="12" wrap="true">
                <ax:form name="table-form" method="get">
                    <ax:fields>
                        <ax:field label="번호">
                            <input type="text" name="user_key" title="" placeholder="" value="" class="AXInput" style="width:50px;" readonly="readonly"/>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="이메일" item-css="fullWidth">
                            <input type="text" name="email_id" title="" placeholder="" value="" class="AXInput av-email av-required"/>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="비밀번호">
                            <input type="password" name="passwd" title="" placeholder="" value="" class="AXInput av-required" style="width:150px;"/>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="레벨">
                            <select name="user_lvl" class="AXSelect">
                                <option value="1">최고관리자</option>
                                <option value="2">관리자</option>
                            </select>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="만든 날짜">
                            <input type="text" name="reg_dt" title="" placeholder="" value="" class="AXInput" style="width:120px;" readonly="readonly"/>
                        </ax:field>
                    </ax:fields>
                </ax:form>
            </ax:col>
        </ax:row>

        <ax:row>
            <ax:col size="12" wrap="true">
                <ax:custom customid="table">
                    <ax:custom customid="tr">
                        <ax:custom customid="td">
                            <h2>업체정보</h2>

                            <%-- %%%%%%%%%% 그리드 (업체정보) %%%%%%%%%% --%>
                            <div class="ax-grid" id="page-grid-box"></div>
                        </ax:custom>

                        <%-- %%%%%%%%%% 신규 버튼 (업체등록) %%%%%%%%%% --%>
                        <ax:custom customid="td">
                            <div class="ax-button-group">
                                <div class="left">
                                    <h2>업체등록</h2>
                                </div>
                                <div class="right">
                                    <button type="button" class="AXButton" id="ax-grid-btn-add"><i class="axi axi-plus-circle"></i> 신규</button>
                                </div>
                                <div class="ax-clear"></div>
                            </div>
                            <p>
                                내용을 입력합니다.
                            </p>

                        </ax:custom>
                    </ax:custom>
                </ax:custom>
            </ax:col>
        </ax:row>

    </ax:div>
    <ax:div name="buttons">
        <button type="button" class="AXButton" onclick="parent.myModal.close();">확인</button>
        <button type="button" class="AXButton" onclick="parent.myModal.close();">취소</button>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var fnObj = {
                pageStart: function () {

                },
                pageResize: function () {
                    parent.myModal.resize();
                }
            };
        </script>
    </ax:div>
</ax:layout>