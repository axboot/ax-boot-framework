<%@ page import="com.chequer.axboot.admin.domain.user.User" %>
<%@ page import="com.chequer.axboot.admin.utils.SessionUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
	request.setAttribute("callBack", request.getParameter("callBack"));
	request.setAttribute("callBack", request.getParameter("callBack"));

	User user = SessionUtils.getCurrentUser();

	pageContext.setAttribute("name", user.getUserNm());
	pageContext.setAttribute("email", user.getEmail());
	pageContext.setAttribute("hpNo", user.getHpNo());
	pageContext.setAttribute("userCd", user.getUserCd());
%>
<ax:layout name="modal.jsp">
	<ax:set name="title" value="\"${name}\"님 정보 변경"/>
	<ax:set name="page_desc" value=""/>
	<ax:div name="contents">
		<ax:row>
			<ax:col size="12" wrap="true">

				<ax:form name="table-form" id="table-form" method="post">
					<ax:fields>
						<ax:field label="이름" width="220px">
							<input type="text" name="userNm" id="userNm" maxlength="15" title="이름"
								   class="av-required AXInput W120" value="${name}"/>
						</ax:field>
					</ax:fields>
					<ax:fields>
						<ax:field label="새 비밀번호" width="220px">
							<input type="password" name="userPs" id="userPs" title="새 비밀번호" maxlength="128"
								   class="AXInput W120" value=""/>
						</ax:field>
						<ax:field label="새 비밀번호 확인" width="220px">
							<input type="password" name="userPs_chk" id="userPs_chk" title="새 비밀번호 확인" maxlength="128"
								   class="AXInput W120" value=""/>
						</ax:field>
					</ax:fields>
					<ax:fields>
						<ax:field label="이메일" width="220px">
							<input type="text" name="email" id="email" maxlength="50" title="이메일"
								   placeholder="abc@abc.com" class="av-email AXInput W180" value="${email}"/>
						</ax:field>
					</ax:fields>
					<ax:fields>
						<ax:field label="핸드폰번호" width="220px">
							<input type="text" name="hpNo" id="hpNo" maxlength="15" placeholder=""
								   class="av-phone AXInput W120" value="${hpNo}"/>
						</ax:field>
					</ax:fields>
				</ax:form>

			</ax:col>
		</ax:row>
	</ax:div>

	<ax:div name="buttons">
		<button type="button" class="AXButton Red" onclick="fnObj.control.save();"><i class="axi axi-pencil"></i> 정보변경
		</button>
		<button type="button" class="AXButton" onclick="fnObj.control.cancel();">닫기</button>
	</ax:div>

	<ax:div name="scripts">
		<script type="text/javascript">
			var callBackName = "${callBack}";
			var fnObj = {
				pageStart: function () {
					this.bindEvent();
					this.control.bind();
					app.modal.resize();
				},
				pageResize: function () {
					app.modal.resize();
				},
				bindEvent: function () {

				},
				control: {
					validate_target: new AXValidator(),
					bind: function () {
						this.validate_target.setConfig({
							targetFormName: "table-form"
						});
					},
					save: function () {

						var validateResult = this.validate_target.validate();
						if (!validateResult) {
							var msg = this.validate_target.getErrorMessage();
							AXUtil.alert(msg);
							this.validate_target.getErrorElement().focus();
							return false;
						}

						var item = app.form.serializeObjectWithIds($(document["table-form"]));
						if (item.userPs != "" && item.userPs != item.userPs_chk) {
							alert("비밀번호를 다시 확인해 주세요. 일치하지 않습니다.");
							return;
						}
						console.log(item);

						app.ajax({
							method: "PUT",
							url: "/api/v1/users/updateMyInfo",
							data: Object.toJSON(item)
						}, function (res) {
							if (res.error) {
								alert(res.error.message);
							}
							else {
								app.modal.save(window.callBackName);
							}
						});
						//parent.app.excel_uploaded();
					},
					cancel: function () {
						app.modal.cancel();
					}
				}
			};
		</script>
	</ax:div>
</ax:layout>
