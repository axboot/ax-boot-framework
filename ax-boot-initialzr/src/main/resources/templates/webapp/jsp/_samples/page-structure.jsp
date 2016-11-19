<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_desc" value="${pageRemark}"/>
<ax:set key="page_auto_height" value="false"/>

<ax:layout name="base">
    <jsp:attribute name="js">
    <script src="/assets/plugins/prettify/prettify.js"></script>
    <script src="/assets/plugins/prettify/lang-css.js"></script>
    </jsp:attribute>
    <jsp:attribute name="css">
        <link rel="stylesheet" type="text/css" href="/assets/plugins/prettify/skins/github.css"/>
        <style>
            .sample-img-preview{
                padding: 10px;border: 1px solid #888; background: #fff; border-radius: 5px;text-align: center;margin-bottom: 10px;position: relative;
            }
            .sample-img-preview .badge{
                position: absolute;left: 10px;top: 10px;
            }
        </style>
    </jsp:attribute>
    <jsp:attribute name="script">
        <script type="text/javascript" src="<c:url value='/assets/js/view/_samples/page-structure.js' />"></script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>


        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> <ax:lang id="ax.admin.sample.layout.basic.d1"/> </h2>
            </div>
        </div>
        <pre>
&lt;%@ page contentType="text/html; charset=UTF-8" %>
&lt;%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
&lt;%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

&lt;!-- 레이아웃 전달 하고 싶은 변수를 선언합니다. -->
&lt;ax:set key="title" value="\${pageName}"/>
&lt;ax:set key="page_desc" value="\${pageRemark}"/>
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
        <div class="alert alert-info">
            AXBOOT JSP페이지는 JSTL2.0 스펙을 이용한 커스텀태그를 지원합니다.<br/>
            커스텀 태그는 WEB-INF > tags 아래에 *.tag 파일들로 원하는 태그를 직접 만들어 사용할 수 있습니다.<br/>
            AXBOOT에서는 웹 애플리케이션 개발에 필요한 커스텀 태그를 미리 만들어 제공하고 있습니다. AXBOOT의 커스텀 태그를 이용하여 개발에 날개를 달아보세요.
            다음은 몇가지 커스텀 태그 샘플을 소개 하겠습니다.
        </div>

        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> ax:tbl, ax:tr, ax:td</h2>
            </div>
        </div>

        <pre>
&lt;ax:form name="formView01">
    &lt;input type="hidden" name="hiddenValue" value=""/>
    &lt;ax:tbl clazz="ax-form-tbl" minWidth="500px">
        &lt;ax:tr>
            &lt;ax:td label="이름" width="300px">
                &lt;input type="text" name="userNm" data-ax-path="userNm" maxlength="15" title="이름" class="av-required form-control W120" value=""/>
            &lt;/ax:td>
            &lt;ax:td label="아이디" width="220px">
                &lt;input type="text" name="userCd" data-ax-path="userCd" maxlength="100" title="아이디" class="av-required form-control W150" value=""/>
            &lt;/ax:td>
        &lt;/ax:tr>
        &lt;ax:tr>
            &lt;ax:td label="내용" width="100%">
                &lt;input type="password" name="userPs" data-ax-path="userPs" maxlength="128" class="form-control W120" value="" readonly="readonly"/>
            &lt;/ax:td>
        &lt;/ax:tr>
    &lt;/ax:tbl>
&lt;/ax:form>
</pre>

        <div class="sample-img-preview">
            <div class="badge">
                ax:table 출력결과 예
            </div>
            <img src="assets/ax-table.png" width="600"/>
        </div>
        <div class="alert alert-info">
            태그의 랜더링 되는 내용은 WEB-INF아래의 파일을 직접열어서 구조를 파악하고 퍼블리싱하는게 중요합니다. 구조를 이해하고 확장해 나가면 유연하면서도 빠른 퍼블리싱이 가능합니다.<br/>
            ax:table은 반응형 테이블 퍼블리싱을 지원합니다. ax:td의 width는 라벨을 포함한 너비값이 되고 라벨의 너비를 조정해야 할 때엔 labelWidth 속성을 부여해야 합니다.
            라벨의 너비는 ax:table이 사용하는 CSS클래스에 정의되어 있으며 [data-ax-tbl] 으로 찾을 수 있습니다.
        </div>
        <div class="alert alert-warning">
            반드시 ax:form은 ax:table의 부모일 필요가 없습니다 각각 독립적으로 작용하고 필요에 따라 표준 form 태그를 사용할 수 있습니다.
        </div>

        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> ax:split-layout, ax:split-panel</h2>
            </div>
        </div>


        <pre>
&lt;ax:split-layout name="ax1" orientation="vertical">
    &lt;ax:split-panel width="300" style="padding-right: 10px;">
        너비가 300인 왼쪽 패널
    &lt;/ax:split-panel>
    &lt;!-- splitter -->
    &lt;ax:splitter>&lt;/ax:splitter>
    &lt;ax:split-panel width="*" style="padding-left: 10px;" id="split-panel-form" scroll="true">
        너비가 나머지인 오른쪽 패널 (건텐츠의 높이가 넘칠 경우 스크롤)
    &lt;/ax:split-panel>
&lt;/ax:split-layout>
</pre>

        <pre>
&lt;ax:split-layout name="ax1" orientation="horizontal">
    &lt;ax:split-panel height="300" style="padding-bottom: 10px;">
        높이가 300인 상단 패널
    &lt;/ax:split-panel>
    &lt;!-- splitter -->
    &lt;ax:splitter>&lt;/ax:splitter>
    &lt;ax:split-panel height="*" style="padding-top: 10px;" id="split-panel-form" scroll="true">
        높이가 나머지인 하단 패널 (건텐츠의 높이가 넘칠 경우 스크롤)
    &lt;/ax:split-panel>
&lt;/ax:split-layout>
</pre>
        <div class="alert alert-info">
            리사이즈가 가능한 레이아웃 시스템을 사용할 수 있습니다. 좌우/상하 레이아웃이 구현된 샘플은 [좌우레이아웃][상하레이아웃] 을 확인하세요.
        </div>


        <div class="ax-button-group">
            <div class="left">
                <h2><i class="cqc-checkmark"></i> ax:tab-layout</h2>
            </div>
        </div>

        <pre>
&lt;ax:tab-layout name="ax2" data_fit_height_content="layout-view-01" style="height:100%;">
    &lt;ax:tab-panel label="기본정보" scroll="scroll">
        &lt;p>
            기본정보
        &lt;/p>
    &lt;/ax:tab-panel>
    &lt;ax:tab-panel label="일반정보" scroll="scroll" active="true">
    	&lt;p>
            일반정보
        &lt;/p>
    &lt;/ax:tab-panel>
&lt;/ax:tab-layout>
</pre>

        <div class="alert alert-info">
            페이지의 컨텐츠를 탭으로 분리하여 표현하고 싶을 때 사용하는 레이아웃 입니다. AXBOOT로는 간단하게 태그만으로 탭 레이아웃을 사용할 수 있습니다.
        </div>
    </jsp:body>
</ax:layout>