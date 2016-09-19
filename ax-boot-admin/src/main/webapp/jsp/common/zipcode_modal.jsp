<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<%
    request.setAttribute("callBack", request.getParameter("callBack"));
%>

<ax:layout name="blank.jsp">
    <ax:div name="css">
        <style>
            .daumclose {
                background-repeat: repeat-y;
                width: 450px;
                height: 50px;
                border: 0px solid #000000;
                background-color: #FFFFFF;
                position: absolute; bottom:10px;left: 150px;
            }
        </style>
    </ax:div>
    <ax:div name="contents">
        <div class="bodyHeightDiv" style="height:600px;">
        <!-- 우편번호 API [S] -->
        <div id="duam-zip-search-box" style="height:600px;margin:0px 0;position:relative;-webkit-overflow-scrolling:touch;">
            <img src="//i1.daumcdn.net/localimg/localimages/07/postcode/320/close.png" id="btnFoldWrap" style="cursor:pointer;position:absolute;right:0px;top:-1px" onclick="fnObj.onClose()" alt="닫기버튼">
            <div class="daumclose"></div>
        </div>
        <!-- 우편번호 API [E] -->
        </div>

    </ax:div>

    <ax:div name="scripts">
        <script src="https://spi.maps.daum.net/imap/map_js_init/postcode.v2.js"></script>
        <script type="text/javascript">
            var callBackName = "${callBack}";
            var elementZipCode = document.getElementById('duam-zip-search-box');
            var fnObj = {
                pageStart: function() {
                    //화면 최적 사이즈
                    //window.resizeTo(630, 700);
                    fnObj.zipcode.bind();
                },
                zipcode: {
                    bind:function () {
                        // 현재 scroll 위치를 저장해놓는다.
                        var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                        new daum.Postcode({
                            oncomplete: function(data) {
                                // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                                // 우편번호와 주소 및 영문주소 정보를 해당 필드에 넣는다.

                                //전체 주소에서 연결 번지 및 ()로 묶여 있는 부가정보를 제거하고자 할 경우,
                                //아래와 같은 정규식을 사용해도 된다. 정규식은 개발자의 목적에 맞게 수정해서 사용 가능하다.
                                var zip_no = data.postcode1 + data.postcode2;
                                var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
                                var road_all_nm = addr;
                                fnObj.onSelect({zip_no:zip_no, road_all_nm:road_all_nm});

                                // iframe을 넣은 element를 안보이게 한다.
                                elementZipCode.style.display = 'none';
                                // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                                document.body.scrollTop = currentScroll;
                            },
                            // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분.
                            // iframe을 넣은 element의 높이값을 조정한다.
                            onresize : function(size) {
                                /*
                                var height = size.height < 696 ? 696 : size.height;
                                elementZipCode.style.height = height + "px";
                                */
                            },
                            width : '100%',
                            height : '100%'
                        }).embed(elementZipCode);

                        // iframe을 넣은 element를 보이게 한다.
                        elementZipCode.style.display = 'block';
                    }
                },
                onSelect:function(items) {

                    var fn = eval("opener." + callBackName);
                    fn(items);
                    fnObj.onClose();
                },
                onClose: function() {
                    try {
                        self.close();
                        window.close();
                        window.open('', '_self').close();
                    } catch(e) {}
                }
            };
            axdom(document.body).ready(function() {
                fnObj.pageStart();
            });
        </script>
    </ax:div>
</ax:layout>