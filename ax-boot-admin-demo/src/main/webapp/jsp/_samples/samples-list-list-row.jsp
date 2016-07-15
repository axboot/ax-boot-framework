<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="샘플:그리드 & 그리드(위아래)"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>
    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button">

                </ax:custom>

                <div class="ax-button-group">
                    <div class="left">
                        <h2><i class="axi axi-list-alt"></i> 정보리스트</h2>
                    </div>
                    <div class="right">
                        <button type="button" class="AXButton" id="ax-grid0-btn-add"><i class="axi axi-plus-circle"></i> 추가</button>
                        <button type="button" class="AXButton" id="ax-grid0-btn-del"><i class="axi axi-minus-circle"></i> 삭제</button>
                    </div>
                    <div class="ax-clear"></div>
                </div>

                <div class="ax-grid" id="page-grid-view0" style="min-height: 300px;"></div>

                <div class="ax-layout-split"></div>

                <div class="ax-button-group">
                    <div class="left">
                        <h2><i class="axi axi-list-alt"></i> 자식리스트</h2>
                    </div>
                    <div class="right">
                        <button type="button" class="AXButton" id="ax-grid1-btn-add"><i class="axi axi-plus-circle"></i> 추가</button>
                        <button type="button" class="AXButton" id="ax-grid1-btn-del"><i class="axi axi-minus-circle"></i> 삭제</button>
                    </div>
                    <div class="ax-clear"></div>
                </div>

                <div class="ax-grid" id="page-grid-view1" style="min-height: 300px;"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript" src="js/sample-list-list-row.js"></script>
    </ax:div>
</ax:layout>