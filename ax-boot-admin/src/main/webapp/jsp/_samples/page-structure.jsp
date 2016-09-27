<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="base">
    <jsp:attribute name="js">
    <script src="/assets/plugins/prettify/prettify.js"></script>
    <script src="/assets/plugins/prettify/lang-css.js"></script>
    </jsp:attribute>
    <jsp:attribute name="css">
    <link rel="stylesheet" type="text/css" href="/assets/plugins/prettify/skins/github.css"/>
    </jsp:attribute>
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='js/page-structure.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>


        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> 기본 페이지 구성 </h2>
            </div>
        </div>
<pre>
&lt;%@ page contentType="text/html; charset=UTF-8" %>
&lt;%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
&lt;%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

&lt;!-- 레이아웃 전달 하고 싶은 변수를 선언합니다. -->
&lt;ax:set key="title" value="\${pageName}"/>
&lt;ax:set key="page_desc" value="\${PAGE_REMARK}"/>
&lt;ax:set key="page_auto_height" value="true"/>

&lt;!-- 사용하려는 레이아웃 명을 입력합니다. (레이아웃은 WEB-INF > tags > layout 에서 관리됩니다.) -->
&lt;ax:layout name="base">

    &lt;!-- 페이지에서 사용하는 스크립트 파일을 선언합니다. attribute script의 출력위치는 layout에서 결정합니다. -->
    &lt;jsp:attribute name="script">
        &lt;script type="text/javascript" src="&lt;c:url value='js/page-structure.js' />">&lt;/script>
    &lt;/jsp:attribute>

    &lt;!-- 페이지의 본문 영역입니다. -->
    &lt;jsp:body>

        &lt;!-- 프로그램 권한과 메뉴에서 정의한 사용권한 정보를 이용하여 프로그램에서 사용 가능한 버튼을 자동 처리 합니다. -->
        &lt;ax:page-buttons>&lt;/ax:page-buttons>

        &lt;div role="page-header">
            &lt;ax:form name="searchView0">
                &lt;ax:tbl clazz="ax-search-tbl" minWidth="500px">
                    &lt;ax:tr>
                        &lt;ax:td label='메뉴그룹' width="300px">
                            &lt;ax:common-code groupCd="MENU_GROUP" id="menuGrpCd"/>
                        &lt;/ax:td>
                    &lt;/ax:tr>
                &lt;/ax:tbl>
            &lt;/ax:form>
            &lt;div class="H10">&lt;/div>
        &lt;/div>

        &lt;!-- role="page-header" 높이를 뺀 나머지 높이를 role="page-content" 가 차지하게 됩니다 -->
        &lt;div role="page-content">

        &lt;/div>

    &lt;/jsp:body>
&lt;/ax:layout>
</pre>

        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> ax커스텀 태그</h2>
            </div>
        </div>
        <ax:markdown>
            ```
            // AXBOOT JSP페이지는 JSTL2.0 스펙을 이용한 커스텀태그를 지원합니다.
            // 커스텀 태그는 WEB-INF > tags 아래에 *.tag 파일들로 원하는 태그를 직접 만들어 사용할 수 있습니다.
            // AXBOOT에서는 웹 애플리케이션 개발에 필요한 커스텀 태그를 미리 만들어 제공하고 있습니다. AXBOOT의 커스텀 태그를 이용하여 개발에 날개를 달아보세요.
            // 다음은 몇가지 커스텀 태그 샘플을 소개 하겠습니다.
            ```
        </ax:markdown>


        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> ax:tbl, ax:tr, ax:td</h2>
            </div>
        </div>



        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> ax:split-layout, ax:split-panel</h2>
            </div>
        </div>

    </jsp:body>
</ax:layout>