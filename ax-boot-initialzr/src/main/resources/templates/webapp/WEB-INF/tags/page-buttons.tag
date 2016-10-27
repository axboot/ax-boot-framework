<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="function3Label" required="false" %>
<%@ attribute name="function4Label" required="false" %>
<%@ attribute name="function5Label" required="false" %>

<div data-page-buttons="">
    <div class="button-warp">
        <c:if test="${authGroupMenu.schAh eq 'Y'}">
            <button type="button" class="btn btn-info" data-page-btn="search"><i class="axi axi-ion-android-search"></i> 조회</button>
        </c:if>

        <c:if test="${authGroupMenu.savAh eq 'Y'}">
            <button type="button" class="btn btn-info" data-page-btn="save"><i class="axi axi-save"></i> 저장</button>
        </c:if>

        <c:if test="${authGroupMenu.exlAh eq 'Y'}">
            <button type="button" class="btn btn-info" data-page-btn="excel"><i class="axi axi-file-excel-o"></i> 엑셀</button>
        </c:if>

        <c:if test="${authGroupMenu.delAh eq 'Y'}">
            <button type="button" class="btn btn-fn1" data-page-btn="fn1"><i class="axi axi-minus-circle"></i> 삭제</button>
        </c:if>

        <c:if test="${authGroupMenu.fn1Ah eq 'Y'}">
            <button type="button" class="btn btn-fn1" data-page-btn="fn1"><i class="axi axi-minus-circle"></i> ${function1Label}</button>
        </c:if>

        <c:if test="${authGroupMenu.fn2Ah eq 'Y'}">
            <button type="button" class="btn btn-info" data-page-btn="fn2"><i class="axi axi-plus-circle"></i> ${function2Label}</button>
        </c:if>

        <c:if test="${authGroupMenu.fn3Ah eq 'Y'}">
            <button type="button" class="btn btn-info" data-page-btn="fn3"> ${function3Label}
            </button>
        </c:if>

        <c:if test="${authGroupMenu.fn4Ah eq 'Y'}">
            <button type="button" class="btn btn-info" data-page-btn="fn4"> ${function4Label}
            </button>
        </c:if>

        <c:if test="${authGroupMenu.fn5Ah eq 'Y'}">
            <button type="button" class="btn btn-info" data-page-btn="fn5">${function5Label}
            </button>
        </c:if>

        <jsp:doBody/>
    </div>
</div>