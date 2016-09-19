<%@ page import="com.chequer.axboot.core.utils.SessionUtils" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    String lastNavigatedPage = null;

    if (SessionUtils.isLoggedIn()) {
        lastNavigatedPage = "/jsp/main.jsp";
    }

    request.setAttribute("redirect", lastNavigatedPage);
%>
<c:if test="${redirect!=null}">
    <c:redirect url="${redirect}"/>
</c:if>

<ax:set key="axbody_class" value="login"/>

<ax:layout name="empty">
    <jsp:attribute name="css">
    </jsp:attribute>

    <jsp:attribute name="js">
        <script type="text/javascript" src="<c:url value='/assets/js/axboot/dist/good-words.js' />"></script>
    </jsp:attribute>

    <jsp:attribute name="script">
        <script type="text/javascript">
            var fnObj = {
                pageStart: function () {
                    $("#good_words").html(goodWords.get());
                },
                login: function () {
                    axboot.ajax({
                                method: "POST",
                                url: "/api/login",
                                data: JSON.stringify({
                                    "userCd": $("#userCd").val(),
                                    "userPs": $("#userPs").val()
                                })
                            }, function (res) {
                                if (res && res.error) {
                                    if (res.error.message == "Unauthorized") {
                                        alert("로그인에 실패 하였습니다. 계정정보를 확인하세요");
                                    }
                                    else {
                                        alert(res.error.message);
                                    }
                                    return;
                                }
                                else {

                                    location.reload();
                                }
                            },
                            {nomask: false, apiType: "login"});
                    return false;
                }
            };
        </script>
    </jsp:attribute>

    <jsp:body>
        <ax:flex-layout valign="middle" align="center" style="width:100%;height:100%;">
            <div>
                <img src="/assets/images/login-logo.png" class="img-logo">
            </div>

            <div class="panel">
                <div class="panel-heading">아이디와 패스워드를 입력해주세요.</div>
                <div class="panel-body">
                    <form name="login-form" class="" method="post" action="/api/login" onsubmit="return fnObj.login();" autocomplete="off">

                        <div class="form-group">
                            <label for="userCd"><i class="cqc-new-message"></i> ID</label>
                            <input type="text" name="userCd" id="userCd" value="system" class="form-control ime-false" placeholder="" />
                        </div>

                        <div class="form-group">
                            <label for="password"><i class="cqc-key"></i> Password</label>
                            <input type="password" name="userPs" id="userPs" value="1234" class="form-control ime-false" placeholder="" />
                        </div>

                        <input type="hidden"
                               name="${_csrf.parameterName}" value="${_csrf.token}"/>

                        <div class="ax-padding-box" style="text-align: right;">
                            <button type="submit" class="btn">&nbsp;&nbsp;로그인&nbsp;&nbsp;</button>
                        </div>

                    </form>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">
                        <a href="#">아이디 찾기</a>
                        &nbsp;
                        &nbsp;
                        <a href="#">비밀번호 찾기</a>
                    </li>

                </ul>
            </div>

            <div class="txt-copyrights">
                AXBOOT 2.0 - Full Stack Web Application Framework © 2010-2016
            </div>

            <div class="txt-good-words" id="good_words">

            </div>
        </ax:flex-layout>
    </jsp:body>

</ax:layout>
