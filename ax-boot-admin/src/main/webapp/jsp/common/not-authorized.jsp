<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<ax:layout name="blank.jsp">
    <jsp:body>
        <div class="ax-body">
            <div class="ax-wrap" style="max-width:400px;_width:400px;">
                <div style="height:50px;"></div>
                <div class="ax-layer ax-title">
                    <div class="ax-col-12 ax-content expand">
                        <!-- @@@@@@@@@@@@@@@@@@@@@@ header begin @@@@@@@@@@@@@@@@@@@@@@ -->

                        <h1><i class="axi axi-block"></i> Not authorized. </h1>

                        <!-- @@@@@@@@@@@@@@@@@@@@@@ header end   @@@@@@@@@@@@@@@@@@@@@@ -->
                    </div>
                    <div class="ax-clear"></div>
                </div>

                <div class="ax-layer cx-content-layer">
                    <div class="ax-col-12 ax-content expand">
                        <!-- s.CXPage -->
                        <div id="CXPage">


                            <h2>요청하신 페이지에 대한 접근권한이 없습니다.</h2>

                            <p>이전 페이지로 돌아가시려면 "돌아가기" 버튼을 클릭하세요</p>
                            <button class="AXButton Blue" onclick="history.go(-1);"><i class="axi axi-history2"></i> 이전
                                페이지로 돌아가기
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </jsp:body>
</ax:layout>
