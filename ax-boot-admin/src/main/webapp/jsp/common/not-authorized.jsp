<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>

<ax:set key="title" value="ERROR"/>
<ax:set key="page_desc" value="${PAGE_REMARK}"/>
<ax:set key="page_auto_height" value="true"/>
<ax:set key="axbody_class" value="error-page"/>

<ax:layout name="empty">
    <jsp:attribute name="css">
        <link href="https://fonts.googleapis.com/css?family=Unica+One" rel="stylesheet">
    </jsp:attribute>
    <jsp:attribute name="script">
        <script>
            var isHeadless = true;
        </script>
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/common/brokebot.min.js' />"></script>
        <script>
            determineErrorTxt(401);
        </script>
    </jsp:attribute>
    <jsp:body>

        <div class="robotpage-top-half">
            <div id="robot_holder">
                <?xml version="1.0" encoding="utf-8"?>
                <!-- Generator: Adobe Illustrator 18.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
                <svg id="brokebotSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 551 239" enable-background="new 0 0 551 239" xml:space="preserve" preserveAspectRatio="xMidYMax">
					<text id="errorCodeTxt" transform="matrix(1 0 0 1 6.7231 240.0011)" class="error_code" ></text>
                    <g id="robotHead">
                        <rect x="359.2" y="173.1" class="robot_limbs_and_ears" width="6.4" height="23.3"/>
                        <rect x="348.1" y="185.4" class="robot_body" width="28.5" height="11"/>
                        <path class="robot_limbs_and_ears" d="M392,197.7h-59.2l0,0c0-3.7,3-6.8,6.8-6.8h45.6C388.9,190.9,392,193.9,392,197.7L392,197.7z"/>
                        <rect x="288.5" y="207.5" class="robot_limbs_and_ears" width="147.7" height="18.7"/>
                        <path class="robot_body" d="M419.3,238.9H305.5c-5.5,0-10-4.5-10-10V207c0-5.5,4.5-10,10-10h113.8c5.5,0,10,4.5,10,10v21.9
							C429.3,234.4,424.8,238.9,419.3,238.9z"/>
                        <circle class="robot_eye_whites" cx="317" cy="216.4" r="11.7"/>
                        <circle class="robot_eye_whites" cx="407.7" cy="216.4" r="11.7"/>
                        <g id="eyesMove">
                            <g id="eyesBlink">
                                <rect x="311" y="210.4" class="robot_eyes" width="12.1" height="12.1"/>
                                <polygon class="robot_eyes_highlight" points="323.1,210.4 311,210.4 323.1,222.5 			"/>
                                <rect x="401.7" y="210.4" class="robot_eyes" width="12.1" height="12.1"/>
                                <polygon class="robot_eyes_highlight" points="413.7,210.4 401.7,210.4 413.7,222.5 			"/>
                            </g>
                        </g>
                        <rect x="339" y="219.9" class="robot_limbs_and_ears" width="5.3" height="9.8"/>
                        <rect x="347.3" y="219.9" class="robot_limbs_and_ears" width="5.3" height="9.8"/>
                        <rect x="355.6" y="219.9" class="robot_limbs_and_ears" width="5.3" height="9.8"/>
                        <rect x="363.9" y="219.9" class="robot_limbs_and_ears" width="5.3" height="9.8"/>
                        <rect x="372.2" y="219.9" class="robot_limbs_and_ears" width="5.3" height="9.8"/>
                        <rect x="380.5" y="219.9" class="robot_limbs_and_ears" width="5.3" height="9.8"/>
                        <circle class="robot_antenna" cx="362.4" cy="167.9" r="10"/>
                        <circle class="robot_antenna_highlight" cx="363.4" cy="165.9" r="5.5"/>
                    </g>
                    <g id="robotbody">
                        <rect x="154.3" y="184.1" class="robot_limbs_and_ears" width="7" height="16.7"/>
                        <path class="robot_limbs_and_ears" d="M162.6,234.1h-9.7c-2.8,0-5-2.2-5-5v-22.7c0-2.8,2.2-5,5-5h9.7c2.8,0,5,2.2,5,5v22.7
							C167.6,231.8,165.3,234.1,162.6,234.1z"/>
                        <path class="robot_hands_feet" d="M172.7,238.9c0-8.2-6.7-14.9-14.9-14.9c-8.2,0-14.9,6.7-14.9,14.9H172.7z"/>
                        <circle class="robot_joints_and_belly" cx="157.8" cy="203.1" r="5.1"/>
                        <path class="robot_limbs_and_ears" d="M221.3,234.1h-9.7c-2.8,0-5-2.2-5-5v-22.7c0-2.8,2.2-5,5-5h9.7c2.8,0,5,2.2,5,5v22.7
							C226.3,231.8,224,234.1,221.3,234.1z"/>
                        <path class="robot_hands_feet" d="M231.3,238.9c0-8.2-6.7-14.9-14.9-14.9c-8.2,0-14.9,6.7-14.9,14.9H231.3z"/>
                        <circle id="leftKnee" class="robot_joints_and_belly" cx="216.4" cy="203.1" r="5.1"/>

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
	</ax:div>
</ax:layout>
