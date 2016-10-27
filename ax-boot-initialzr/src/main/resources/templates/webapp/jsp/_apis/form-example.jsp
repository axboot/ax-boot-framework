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
    </jsp:attribute>
    <jsp:attribute name="script">
    <script>
        $(document.body).ready(function () {
            $(document.body).find("pre").addClass("prettyprint linenums lang-js");
            if (window["prettyPrint"]) window["prettyPrint"]();
        });
    </script>
    </jsp:attribute>
    <jsp:body>

        <ax:page-buttons></ax:page-buttons>

        <div class="panel panel-default">
            <div class="panel-body">
                <div class="ax-button-group">
                    <div class="left">
                        <h2><i class="cqc-checkmark"></i> data-ax-path의 사용</h2>
                    </div>
                </div>

                <ax:markdown>
                    ```html
                    // HTML form과 API의 Object는 data-ax-path값을로 2Way binding 됩니다.
                    <form name="myForm" id="formView01">
                        <input type="text" class="form-control" value="" data-ax-path="hpNo"/>
                        <input type="text" class="form-control" value="" data-ax-path="companyJson.이름"/>
                    </form>
                    ```
                    웹 애플리케이션을 개발하다보면 폼컨트롤 요소와 API의 JSON오브젝트간에 데이터맵핑, 폼컨트롤 데이터수집, 그리고 검증에 대부분의 시간을 쓰게 됩니다.
                    AXBOOT 프레임워크에서는 `ax5.ui.binder`를 이용하여 한줄로 JSON오브젝트 데이터를 폼에 맵핑하고, 수집, 검증 할 수 있습니다.
                    **JS**
                    ```js
                    this.target = $("#formView01");
                    this.model = new ax5.ui.binder();
                    this.model.setModel(this.getDefaultData(), this.target);

                    // setData
                    this.model.setModel(data);

                    // getData
                    return this.modelFormatter.getClearData(this.model.get()); // 모델의 값을 포멧팅 전 값으로 치환.
                    ```
                    실제 구현된 샘플은 `레이아 샘플 > 그리드&폼 템플릿` 페이지 소스를 확인 해 보세요.
                </ax:markdown>


                <div class="ax-button-group">
                    <div class="left">
                        <h2><i class="cqc-checkmark"></i> 폼 컨트롤 부가기능</h2>
                    </div>
                </div>

                <ax:markdown>
                    ```html
                    // 필수입력 필드
                    <input type="text" class="form-control" value="" data-ax-validate="required" title="매장코드" data-ax-path="storCd"/>
                    ```
                    속성 `data-ax-validate="required"` `title="매장코드"`를 이용하여 폼컨트롤에 값이 비어 있는지 검증 해줍니다.


                    ```html
                    // formatter
                    <input type="text" class="form-control W120" value="" data-ax-path="hpNo" data-ax5formatter="phone"/>
                    // 달력선택
                    <input type="text" class="form-control" value="" data-ax-path="closeDt" data-ax5formatter="date" data-ax5picker="date"/>
                    // 기간 선택 달력
                    <div class="form-group" data-ax5picker="date">
                        <div class="input-group">
                            <input type="text" class="form-control" data-ax-path="storeInfoJson.계약시작일" data-ax5formatter="date"/>
                            <span class="input-group-addon">~</span>
                            <input type="text" class="form-control" data-ax-path="storeInfoJson.계약종료일" data-ax5formatter="date"/>
                            <span class="input-group-addon"><i class="cqc-calendar"></i></span>
                        </div>
                    </div>
                    ```

                    #### data-ax5formatter

                    [ax5formatter pattern API](http://ax5.io/ax5ui-formatter/api/index.html#doc-pattern-4) 에서 정의된 formatter패턴을 기본 사용 할 수 있습니다.
                    하지만 개발을 하다보면 예외의 패턴들이 필요 할 때가 있습니다. 그런 경우를 대비하여 ax5ui는 formatter패턴을 확장 할 수 있도록 설계되었습니다.
                    패턴 확장에 대해서는 [pattern-extend](http://ax5.io/ax5ui-formatter/demo/pattern-extend.html) 에서 샘플을 확인 할 수 있습니다.

                    #### data-ax5picker
                    폼컨트롤의 값을 입력하는데. 외부 컨트롤 UI가 필요한 경우 `data-ax5picker` 속성을 이용하여 정의합니다.
                    picker에 대한 내용은 http://ax5.io/ax5ui-picker/ 에서 확인 할 수 있습니다.

                    ```html
                    // inline input
                    <input type="text" class="form-control W250 inline-block" value="" placeholder="주소" readonly="readonly" data-ax-path="storeInfoJson.주소"/>
                    <input type="text" class="form-control W250 inline-block" value="" placeholder="기타주소" maxlength="50" data-ax-path="storeInfoJson.기타주소"/>
                    ```
                </ax:markdown>
            </div>
        </div>
    </jsp:body>
</ax:layout>