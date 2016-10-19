<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="${pageName}"/>
<ax:set key="page_auto_height" value="true"/>

<ax:layout name="modal">
    <jsp:attribute name="js">
        <script src="//dmaps.daum.net/map_js_init/postcode.v2.js"></script>
    </jsp:attribute>

    <jsp:attribute name="css">
    </jsp:attribute>

    <jsp:attribute name="script">
        <script type="text/javascript">
            //http://postcode.map.daum.net/guide
            var elementZipCode = document.getElementById('duam-zip-search-box');

            var fnObj = {};
            var ACTIONS = axboot.actionExtend(fnObj, {
                SET_ADDRESS: "SET_ADDRESS",
                CLOSE_ADDRESS: "CLOSE_ADDRESS",
                dispatch: function (caller, act, data) {
                    var _this = this;
                    switch (act) {
                        case ACTIONS.SET_ADDRESS:
                            ACTIONS.dispatch(ACTIONS.CLOSE_ADDRESS, data);
                            break;

                        case ACTIONS.CLOSE_ADDRESS:
                            if (parent && parent.axboot && parent.axboot.modal) {
                                parent.axboot.modal.callback(data);
                            }
                            break;

                        default:
                            return false;
                    }
                }
            });

            fnObj.pageStart = function () {
                //window.resizeTo(630, 700);
                this.zipcodeView.initView();
            };

            fnObj.zipcodeView = axboot.viewExtend({}, {
                initView: function () {
                    // 현재 scroll 위치를 저장해놓는다.
                    var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                    new daum.Postcode({
                        oncomplete: function (data) {
                            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                            // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
                            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                            var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
                            var extraRoadAddr = ''; // 도로명 조합형 주소 변수

                            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                                extraRoadAddr += data.bname;
                            }
                            // 건물명이 있고, 공동주택일 경우 추가한다.
                            if (data.buildingName !== '' && data.apartment === 'Y') {
                                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                            }
                            // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                            if (extraRoadAddr !== '') {
                                extraRoadAddr = ' (' + extraRoadAddr + ')';
                            }
                            // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
                            if (fullRoadAddr !== '') {
                                fullRoadAddr += extraRoadAddr;
                            }

                            //onSelect 에 받은 데이터 전부와 기본 우편번호 및 도로명, 지번 주소를 넘겨줌
                            ACTIONS.dispatch(ACTIONS.SET_ADDRESS, {zipcodeData: data, zipcode: data.zonecode || data.postcode, roadAddress: fullRoadAddr, jibunAddress: data.jibunAddress});

                            // 우편번호와 주소 정보를 해당 필드에 넣는다.
                            // document.getElementById('sample4_postcode').value = data.zonecode; //5자리 새우편번호 사용
                            // document.getElementById('sample4_roadAddress').value = fullRoadAddr;
                            // document.getElementById('sample4_jibunAddress').value = data.jibunAddress;
                            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)

                            // iframe을 넣은 element를 안보이게 한다.
                            elementZipCode.style.display = 'none';
                            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                            document.body.scrollTop = currentScroll;
                        },
                        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분.
                        // iframe을 넣은 element의 높이값을 조정한다.
                        onresize: function (size) {
                            /*
                             var height = size.height < 696 ? 696 : size.height;
                             elementZipCode.style.height = height + "px";
                             */
                        },
                        width: '100%',
                        height: '100%'
                    }).embed(elementZipCode);

                    // iframe을 넣은 element를 보이게 한다.
                    elementZipCode.style.display = 'block';
                }
            });

        </script>
    </jsp:attribute>

    <jsp:body>
        <!-- 우편번호 API [S] -->
        <div id="duam-zip-search-box" style="height:600px;margin:0;position:relative;-webkit-overflow-scrolling:touch;"></div>
        <!-- 우편번호 API [E] -->
    </jsp:body>
</ax:layout>