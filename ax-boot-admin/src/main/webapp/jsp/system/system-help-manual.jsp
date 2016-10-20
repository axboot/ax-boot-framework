<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    RequestUtils requestUtils = RequestUtils.of(request);
    long menuId = requestUtils.getLong("menuId");
    request.setAttribute("menuId", menuId);
%>

<ax:set key="system-help-manual-version" value="1.0.0"/>
<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="css">

    </jsp:attribute>
    <jsp:attribute name="js">
        <script type="text/javascript">
            var menuId = ${menuId};
        </script>
        <script src="/assets/plugins/ckeditor/ckeditor.js"></script>
    </jsp:attribute>
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/system/system-help-manual.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons>
            <button type="button" class="btn btn-default" data-page-btn="form-download"><i class="cqc-download"></i> 목차 양식 다운로드</button>
        </ax:page-buttons>

        <div role="page-header">
            <ax:form name="searchView0">
                <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    <ax:tr>
                        <ax:td label='매뉴얼 그룹' width="400px">

                            <ax:common-code groupCd="MANUAL_GROUP" id="manualGrpCd" clazz="inline-block W150"/>

                            <button type="button" class="btn btn-default" data-search-view-0-btn="manualGroupMng">그룹설정</button>

                        </ax:td>

                    </ax:tr>
                </ax:tbl>
            </ax:form>
            <div class="H10"></div>
        </div>


        <ax:split-layout name="ax1" oriental="vertical">
            <ax:split-panel width="350" style="padding-right: 10px;">

                <div class="ax-button-group" data-fit-height-aside="tree-view-01">
                    <div class="left">
                        <h2>
                            <i class="cqc-list"></i>
                            목차 </h2>
                    </div>
                    <div class="right">
                        <button type="button" class="btn btn-default" data-tree-view-01-btn="add"><i class="cqc-circle-with-plus"></i> 추가</button>
                    </div>
                </div>

                <div data-z-tree="tree-view-01" data-fit-height-content="tree-view-01" style="height: 300px;" class="ztree"></div>


                <div data-fit-height-aside="tree-view-01">
                    <div class="H10"></div>
                    <form name="manualUploadListForm" method="POST" enctype="multipart/form-data">
                        <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                            <ax:tr>
                                <ax:td label='목차업로드' width="100%" labelStyle="background: #616161;color: #fff;">
                                    <input type="hidden" name="manualGrpCd" value=""/>
                                    <div class="input-group">
                                        <input type="file" name="file" class="form-control" />
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
            <ax:split-panel width="*" style="padding-left: 10px;" id="split-panel-form">

                <ax:form name="formView01">
                    <div data-fit-height-aside="form-view-01">
                        <div class="ax-button-group">
                            <div class="left">
                                <h2>
                                    <i class="cqc-news"></i>
                                    매뉴얼 내용 </h2>
                            </div>
                            <div class="right">

                            </div>
                        </div>

                        <ax:tbl clazz="ax-form-tbl" minWidth="500px">
                            <ax:tr>
                                <ax:td label="호출 아이디">
                                    <input type="hidden" data-ax-path="manualId"/>
                                    <input type="text" data-ax-path="manualKey" class="form-control" value=""/>
                                </ax:td>
                            </ax:tr>
                        </ax:tbl>
                        <div class="H10"></div>
                    </div>
                    <div data-fit-height-content="form-view-01">
                        <textarea data-ax-path="content" id="editor1"></textarea>
                    </div>
                </ax:form>

                <form name="manualUploadForm" method="POST" enctype="multipart/form-data" data-fit-height-aside="form-view-01">
                    <input type="hidden" name="manualGrpCd" value=""/>

                    <ax:tbl clazz="ax-search-tbl" minWidth="500px">
                        <ax:tr>
                            <ax:td label="원본파일" width="350px">
                                <div class="input-group">
                                    <input type="file" name="file" class="form-control" />
                                    <span class="input-group-btn">
                                        <button type="submit" name="Upload" class="btn btn-primary"><i class="cqc-upload"></i> 업로드</button>
                                    </span>
                                </div><!-- /input-group -->
                            </ax:td>
                            <ax:td label="등록된 파일" width="300px">
                                <button type="button" class="btn btn-default" data-form-view-01-btn="file"><small>등록된 파일이 없습니다.</small></button>
                            </ax:td>
                        </ax:tr>
                    </ax:tbl>
                </form>

            </ax:split-panel>
        </ax:split-layout>
    </jsp:body>
</ax:layout>