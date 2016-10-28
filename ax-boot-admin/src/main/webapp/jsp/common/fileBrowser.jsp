<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    RequestUtils requestUtils = RequestUtils.of(request);
    requestUtils.setAttribute("CKEditorFuncNum", requestUtils.getInt("CKEditorFuncNum"));
    requestUtils.setAttribute("targetId", requestUtils.getString("targetId"));
%>
<ax:set key="pageName" value="File Browser"/>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="baseStyle"/>

<ax:layout name="modal">
    <jsp:attribute name="css">
    </jsp:attribute>
    <jsp:attribute name="script">
        <script>
            var CKEditorFuncNum = ${CKEditorFuncNum};
        </script>
        <script type="text/javascript" src="<c:url value='/assets/js/common/fileBrowser.js' />"></script>
    </jsp:attribute>
    <jsp:attribute name="header">
        <h1 class="title">
            <i class="cqc-browser"></i>
            파일 브라우저
        </h1>
    </jsp:attribute>
    <jsp:body>
        <ax:page-buttons>
            <button type="button" class="btn btn-default" data-page-btn="close">창닫기</button>
            <button type="button" class="btn btn-info" data-page-btn="search">조회</button>
            <button type="button" class="btn btn-fn1" data-page-btn="choice">선택</button>

            <button type="button" class="btn btn-fn1" data-page-btn="fn1">삭제</button>
        </ax:page-buttons>

        <ax:split-layout name="ax1" orientation="vertical">
            <ax:split-panel width="*" style="padding-right: 10px;">

                <div data-fit-height-aside="grid-view-01">
                    <ax:form name="searchView0">
                        <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                            <ax:tr>
                                <ax:td label='검색어' width="100%">
                                    <input type="text" name="filter" id="filter" class="form-control inline-block W200" value="" placeholder="검색어를 입력하세요."/>
                                </ax:td>
                            </ax:tr>
                        </ax:tbl>
                    </ax:form>
                    <div class="H10"></div>
                </div>

                <div data-ax5grid="grid-view-01" data-fit-height-content="grid-view-01" style="height: 300px;"></div>

                <div data-fit-height-aside="grid-view-01">
                    <div class="H10"></div>
                    <form name="uploadForm" action="/ckeditor/uploadImage" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="targetId" value="${targetId}"/>
                        <input type="hidden" name="targetType" value="CKEDITOR"/>

                        <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                            <ax:tr>
                                <ax:td label='파일업로드' width="100%" labelStyle="background: #616161;color: #fff;">
                                    <div class="input-group">
                                        <input type="file" name="upload" class="form-control" />
                                        <span class="input-group-btn">
                                            <button type="submit" name="Upload" class="btn btn-primary"><i class="cqc-upload"></i> 업로드</button>
                                        </span>
                                    </div><!-- /input-group -->
                                </ax:td>
                            </ax:tr>
                        </ax:tbl>
                    </form>
                </div>

            </ax:split-panel>
            <ax:splitter></ax:splitter>
            <ax:split-panel width="400" style="padding-left: 10px;" id="split-panel-form" scroll="true">

                <ax:form name="formView01">
                    <div data-fit-height-aside="form-view-01">
                        <div class="ax-button-group">
                            <div class="left">
                                <h2>
                                    <i class="cqc-blackboard"></i>
                                    파일 뷰어 </h2>
                            </div>
                            <div class="right">

                            </div>
                        </div>

                        <ax:tbl clazz="ax-form-tbl">
                            <ax:tr labelWidth="80px">
                                <ax:td label="파일명" width="100%">
                                    <input type="text" data-ax-path="fileNm" class="form-control" value=""/>
                                </ax:td>
                            </ax:tr>
                            <ax:tr labelWidth="80px">
                                <ax:td label="타입" width="100%">
                                    <input type="text" data-ax-path="fileType" class="form-control" value=""/>
                                </ax:td>
                            </ax:tr>
                            <ax:tr labelWidth="80px">
                                <ax:td label="URL" width="100%">
                                    <input type="text" data-ax-path="preview" class="form-control" value=""/>
                                </ax:td>
                            </ax:tr>
                        </ax:tbl>

                    </div>
                    <div class="H10"></div>
                    <div id="preview-target"></div>
                </ax:form>

            </ax:split-panel>
        </ax:split-layout>

    </jsp:body>
</ax:layout>