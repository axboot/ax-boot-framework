<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<ax:layout name="blank.jsp">
	<ax:div name="header">

	</ax:div>
	<ax:div name="contents">

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
	</ax:div>
	<ax:div name="scripts">
		<script type="text/javascript">
			var fnObj = {
				pageStart: function () {
					this.bindEvent();
					this.form.bind();
				},
				bindEvent: function () {
					$("#ax-form-btn-send").click(function () {
						fnObj.form.send();
					});

					$("#ax-form-btn-login").click(function () {
						fnObj.form.login();
					});
				},
				form: {
					target: $(document["send-form"]),
					validate_target: new AXValidator(),
					bind: function () {
						this.validate_target.setConfig({
							targetFormName: "send-form"
						});
						$("#Hp").bindPattern({
							pattern: "phone"
						});
					},
					send: function () {
						var validateResult = this.validate_target.validate();
						if (!validateResult) {
							var msg = this.validate_target.getErrorMessage();
							AXUtil.alert(msg);
							this.validate_target.getErrorElement().focus();
							return false;
						}

						var item = app.form.serializeObjectWithIds(this.target);

						app.ajax({
							type: "POST",
							url: "/api/v1/libraryDevelop/developers",
							data: Object.toJSON(item)
						}, function (res) {
							if (res.error) {
								alert(res.error.message);
							}
							else {
								location.href = "/library/download";
							}
						});
					},
					login: function () {
						var validateResult = this.validate_target.validate();
						if (!validateResult) {
							var msg = this.validate_target.getErrorMessage();
							AXUtil.alert(msg);
							this.validate_target.getErrorElement().focus();
							return false;
						}
						var item = app.form.serializeObjectWithIds(this.target);
						app.ajax({
							type: "POST",
							url: "/api/v1/libraryDevelop/login",
							data: Object.toJSON(item)
						}, function (res) {
							if (res.error) {
								alert(res.error.message);
							}
							else {
								location.href = "/library/download";
							}
						});
					}
				}
			};

			$(document.body).ready(function () {
				fnObj.pageStart();
			});
		</script>
	</ax:div>
</ax:layout>
