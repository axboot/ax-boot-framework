<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="system-auth-user-version" value="1.0.0"/>
<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="script">
        <ax:script-lang key="ax.script" var="LANG" />
        <ax:script-lang key="ax.admin" var="COL" />
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-auth-user.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <!-- 검색바 -->
        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                        <ax:td label="ax.admin.search" width="300px">
                            <input type="text" name="filter" id="filter" class="form-control" value="" placeholder="<ax:lang id="ax.admin.input.search"/>"/>
                        </ax:td>
                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="40%" style="padding-right: 10px;">

                <!-- 목록 -->
                <div class="ax-button-group" data-fit-height-aside="grid-view-01">
                    <div class="left">
                        <h2><i class="cqc-list"></i>
                            <ax:lang id="ax.admin.user.title"/>
                        </h2>
                    </div>
                    <div class="right"></div>
                </div>
                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel width="*" style="padding-left: 10px;" scroll="scroll">

                <!-- 폼 -->
                <div class="ax-button-group" role="panel-header">
                    <div class="left">
                        <h2><i class="cqc-news"></i>
                            <ax:lang id="ax.admin.user.information"/>
                        </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-form-view-01-btn="form-clear">
                            <i class="cqc-erase"></i>
                            <ax:lang id="ax.admin.clear"/>
                        </button>
                    </div>
                </div>

                <ax:form name="formView01">
                    <input type="hidden" name="act_tp" id="act_tp" value=""/>
                    <ax:tbl clazz="ax-form-tbl" minWidth="500px">
                        <ax:tr labelWidth="120px">
                            <ax:td label="ax.admin.user.name" width="300px">
                                <input type="text" name="userNm" data-ax-path="userNm" maxlength="15" title="이름" class="av-required form-control W120" value=""/>
                            </ax:td>
                            <ax:td label="ax.admin.user.id" width="220px">
                                <input type="text" name="userCd" data-ax-path="userCd" maxlength="100" title="아이디" class="av-required form-control W150" value=""/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr labelWidth="120px">
                            <ax:td label="ax.admin.user.password" width="300px">
                                <input type="password" name="userPs" data-ax-path="userPs" maxlength="128" class="form-control W120" value="" readonly="readonly"/>
                            </ax:td>
                            <ax:td label="ax.admin.user.password.confirm" width="460px">
                                <input type="password" name="userPs_chk" data-ax-path="userPs_chk" maxlength="128" class="form-control inline-block W120" value="" readonly="readonly"/>
                                &nbsp;
                                <label>
                                    <input type="checkbox" data-ax-path="password_change" name="password_change" value="Y"/>
                                    <ax:lang id="ax.admin.user.password.change"/>
                                </label>
                            </ax:td>
                        </ax:tr>
                        <ax:tr labelWidth="120px">
                            <ax:td label="ax.admin.user.email" width="300px">
                                <input type="text" name="email" data-ax-path="email" maxlength="50" title="이메일" placeholder="abc@abc.com" class="av-email form-control" value=""/>
                            </ax:td>
                            <ax:td label="ax.admin.user.hp" width="220px" labelWidth="120px">
                                <input type="text" name="hpNo" data-ax-path="hpNo" maxlength="15" placeholder="" class="av-phone form-control W120" data-ax5formatter="phone" value=""/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr labelWidth="120px">
                            <ax:td label="ax.admin.user.language" width="300px">
                                <ax:common-code groupCd="LOCALE" dataPath="locale" clazz="form-control W100"/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr labelWidth="120px">
                            <ax:td label="ax.admin.use.or.not" width="300px">
                                <ax:common-code groupCd="USE_YN" dataPath="useYn" clazz="form-control W100"/>
                            </ax:td>
                            <ax:td label="ax.admin.user.account.status" width="220px" labelWidth="120px">
                                <ax:common-code groupCd="USER_STATUS" dataPath="userStatus"/>
                            </ax:td>
                        </ax:tr>
                        <ax:tr labelWidth="120px">
                            <ax:td label="ax.admin.remark" width="100%">
                                <input type="text" name="remark" data-ax-path="remark" maxlength="100" class="form-control" value=""/>
                            </ax:td>
                        </ax:tr>
                    </ax:tbl>

                    <div class="H5"></div>
                    <div class="ax-button-group sm">
                        <div class="left">
                            <h3><ax:lang id="ax.admin.user.menu.group.setting"/></h3>
                        </div>
                    </div>
                    <ax:tbl clazz="ax-form-tbl">
                        <ax:tr>
                            <ax:td label="ax.admin.user.menu.group" width="250px">
                                <ax:common-code groupCd="MENU_GROUP" dataPath="menuGrpCd"/>
                            </ax:td>
                        </ax:tr>
                    </ax:tbl>

                    <div class="H5"></div>
                    <div class="ax-button-group sm">
                        <div class="left">
                            <h3><ax:lang id="ax.admin.user.auth.group.setting"/></h3>
                        </div>
                    </div>
                    <ax:tbl clazz="ax-form-tbl">
                        <ax:tr>
                            <ax:td label="ax.admin.user.auth.group" width="100%">
                                <ax:common-code groupCd="AUTH_GROUP" dataPath="grpAuthCd" name="grpAuthCd" type="checkbox"/>
                            </ax:td>
                        </ax:tr>
                    </ax:tbl>

                    <div class="H5"></div>
                    <div class="ax-button-group sm">
                        <div class="left">
                            <h3><ax:lang id="ax.admin.user.role.setting"/></h3>
                        </div>
                    </div>

                    <div data-ax5grid="grid-view-02" style="height: 300px;"></div>

                </ax:form>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>