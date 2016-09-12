<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
    request.setAttribute("callBack", request.getParameter("callBack"));
    request.setAttribute("itemIndex", request.getParameter("itemIndex"));
    request.setAttribute("id", request.getParameter("id"));

    if (request.getParameter("id") == null) {
        request.setAttribute("pageTitle", "공지사항 등록");
    } else {
        request.setAttribute("pageTitle", "공지사항 수정");
    }
%>
<ax:layout name="modal.jsp">
    <ax:set name="title" value="${pageTitle}"/>
    <ax:set name="page_desc" value=""/>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12" wrap="true">

                <ax:form id="form-notice" name="form-notice" method="get">
                    <input type="hidden" name="id" value="${id}"/>
                    <input type="hidden" name="noticeId" value="${id}"/>
                    <ax:fields>
                        <ax:field label="제목" style="width:100%">
                            <label class="AXInputLabel fullWidth">
                                <input type="text" name="title" id="title" maxlength="200" title="제목" class="AXInput av-required" value=""/>
                            </label>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="내용" style="width:100%">
                            <textarea name="content" id="content" class="AXTextarea" style="box-shadow:inset 0px 0px 3px #ccc;width:100%;height:385px;ime-mode:active;box-sizing: border-box;"
                                      title="내용"></textarea>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="팝업여부" width="150px">
                            <select class="AXSelect W100" id="popupYn" name="popupYn">
                                <option value="N" selected="selected">사용안함</option>
                                <option value="Y">사용</option>
                            </select>
                        </ax:field>
                        <ax:field label="게시기간" width="300px">
                            <input type="text" name="stDt" id="stDt" maxlength="10" title="시작일" class="AXInput W100" value=""/>
                            ~
                            <input type="text" name="endDt" id="endDt" maxlength="10" title="종료일" class="AXInput W100" value=""/>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="표시여부" width="150px">
                            <select class="AXSelect W100" id="dispYn" name="dispYn">
                                <option value="Y" selected="selected">표시</option>
                                <option value="N">표시안함</option>
                            </select>
                        </ax:field>
                    </ax:fields>

                </ax:form>

                <div id="file-attach-target"></div>

                <ax:custom customid="form-file" id="form-file" name="form-file" method="post">
                    <input type="hidden" name="noticeId" id="noticeId"/>

                    <div class="H10"></div>
                    <ax:fields>
                        <ax:field label="파일 첨부1" style="width:100%">
                            <label class="AXInputLabel fullWidth">
                                <input type="file" name="file1" id="file1" maxlength="200" class="AXInput" value="" style="height:19px;"/>
                            </label>
                        </ax:field>
                    </ax:fields>

                    <div class="H10"></div>
                    <ax:fields>
                        <ax:field label="파일 첨부2" style="width:100%">
                            <label class="AXInputLabel fullWidth">
                                <input type="file" name="file2" id="file2" maxlength="200" class="AXInput" value="" style="height:19px;"/>
                            </label>
                        </ax:field>
                    </ax:fields>

                </ax:custom>

                <div id="temp-div-container"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="buttons">
        <button type="button" class="AXButton" onclick="fnObj.dataForm.save();">저장</button>
        <button type="button" class="AXButton" onclick="parent.myModal.close();">취소</button>
    </ax:div>

    <ax:div name="js">
        <!--
        <script src="/static/plugins/ckeditor_3.4.2/ckeditor.js" type="text/javascript"></script>
        <script src="/static/plugins/ckeditor_3.4.2/_samples/sample.js" type="text/javascript"></script>
        <link href="/static/plugins/ckeditor_3.4.2/_samples/sample.css" rel="stylesheet" type="text/css" />
        -->
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var myValidator = new AXValidator();
            var fnObj = {
                pageStart: function () {
                    app.modal.resize();
                },
                pageResize: function () {
                    app.modal.resize();
                },
                dataForm: {
                    target: $(document["form-notice"]),
                    validate_target: new AXValidator(),
                    bind: function () {
                        this.validate_target.setConfig({
                            targetFormName: "form-notice"
                        });

                        $("#popupYn").bindSelect();
                        $("#posYn").bindSelect();
                        $("#dispYn").bindSelect();

                        $("#endDt").bindTwinDate({
                            align: "right", valign: "bottom", separator: "-", startTargetID: "stDt", selectType: "d", onChange: function () {
                            }
                        });

                        $("#popupYn").bind("change", function () {
                            if (this.value == "Y") {
                                $("#stDt").addClass("av-required");
                                $("#endDt").addClass("av-required");
                            }
                            else {
                                $("#stDt").removeClass("av-required");
                                $("#endDt").removeClass("av-required");
                            }
                        });

                        //CKEDITOR.replace('content', {filebrowserUploadUrl:'/common/editupload.asp?type=1',toolbar: "Basic",enterMode : '2',shiftEnterMode: '1', width: '100%', height: '300px;'});

                        if (document["form-notice"].id.value != "") {
                            app.ajax({
                                type: "GET",
                                url: "/api/v1/notices/" + document["form-notice"].id.value,
                                data: ""
                            }, function (res) {
                                if (res.error) {
                                    alert(res.error.message);
                                }
                                else {
                                    app.form.fillForm($('#form-notice'), res);
                                    if (res.files.length > 0) {
                                        var po = [], i = res.files.length;
                                        po.push('<h3><i class="axi axi-list-alt"></i> 첨부된 파일 목록</h3>');
                                        po.push('<div style="border:1px solid #6caab9;padding:10px;">');
                                        while (i--) {
                                            po.push('<a style="display:inline-block;padding:5px;font-size:12px;margin:0px 5px;color:#ff3300;" id="att-file-' + res.files[i].id + '" href="#ax" onclick="fnObj.dataForm.file_delete(' + res.files[i].id + ');"><i class="axi axi-minus-circle"></i> ' + res.files[i].fileName + '</a>');
                                        }
                                        po.push('</div>');
                                        $("#file-attach-target").html(po.join(''));
                                    }

                                    if (res.stDt) {
                                        $("#stDt").val(res.stDt.date().print());
                                        $("#endDt").val(res.endDt.date().print());
                                    }
                                    //CKEDITOR.instances.content.setData(res.content);

                                    app.modal.resize();
                                }
                            });
                        }

                    },
                    init: function () {
                        document["form-notice"].reset();
                        $(document["form-notice"]).find(".AXSelect").each(function () {
                            $(this).bindSelectSetValue("");
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

                        //if ($("#popupYn").val()=="Y"){
                        if ($("#stDt").val() == "") {
                            alert("시작일자를 선택하세요.");
                            $("#stDt").focus();
                            return;
                        }

                        if ($("#endDt").val() == "") {
                            alert("종료일을 선택하세요.");
                            $("#endDt").focus();
                            return;
                        }
                        //}

                        //$('#content').val(CKEDITOR.instances.content.getData());

                        var obj = app.form.serializeObjectWithIds($("#form-notice"));
                        if (obj.stDt && obj.stDt != "") obj.stDt = obj.stDt.replace(/\-/g, "");
                        if (obj.endDt && obj.endDt != "") obj.endDt = obj.endDt.replace(/\-/g, "");

                        if (document["form-notice"].id.value != "") obj.id = document["form-notice"].id.value;

                        $("#temp-div-container").empty();

                        var fileFn = function (id) {
                            var frm = document["form-file"];
                            var target_name = "submitwin";
                            frm.noticeId.value = id;
                            frm.target = target_name;
                            frm.action = "/api/v1/notices/file";

                            if (frm.file1.value || frm.file2.value) {
                                // iframe 생성
                                var iframe = $('<iframe src="javascript:false;" name="' + target_name + '" style="display:none;"></iframe>');
                                $(document.body).append(iframe);

                                // onload 이벤트 핸들러
                                // action에서 파일을 받아 처리한 결과값을 텍스트로 출력한다고 가정하고 iframe의 내부 데이터를 결과값으로 callback 호출
                                iframe.load(function () {
                                    var doc = this.contentWindow ? this.contentWindow.document : (this.contentDocument ? this.contentDocument : this.document);
                                    var root = doc.documentElement ? doc.documentElement : doc.body;
                                    var result = root.textContent ? root.textContent : root.innerText;
                                    var res = result.object();

                                    if (res.error) {
                                        axf.alert(res.error);
                                        loading_mask.close();
                                    }
                                    else {
                                        fnObj.dataForm.fileSaveEnd();
                                        //parent.myModal.close();
                                    }
                                    iframe.remove();
                                });

                                loading_mask.open();
                                frm.submit();
                            }
                            else {
                                fnObj.dataForm.fileSaveEnd();
                            }
                        };

                        //console.log(obj);
                        //console.log(JSON.stringify(obj));
                        //console.log(Object.toJSON(obj));
                        //return;
                        app.net.ajax({
                            //type: document["form-notice"].id.value=="" ? "POST" : "PUT",
                            type: "POST",
                            url: "/api/v1/notices",
                            data: Object.toJSON(obj)
                        }, function (res) {
                            if (res.error) {
                                alert(res.error.message);
                            }
                            else {
                                var id = res.id;
                                fileFn(id);
                            }
                        });

                    },
                    fileSaveEnd: function () {
                        parent.toast.push("저장되었습니다.");
                        parent.fnObj.grid.setPage(parent.fnObj.grid.pageNo);
                        app.modal.close();
                    },
                    edit: function (item) {
                        this.init();

                        $("#itemCd").attr("readonly", "readonly");
                        item = $.extend({}, item);
                        //delete item.userPs;
                        //item.password_change = "사용안함";

                        app.form.fillForm(this.target, item);

                        $("#hcatCd").bindSelectSetValue(item.bcatCd + "$" + item.hcatCd);
                        $("#mcatCd").bindSelectSetValue(item.bcatCd + "$" + item.hcatCd + "$" + item.mcatCd);
                        $("#lcatCd").bindSelectSetValue(item.bcatCd + "$" + item.hcatCd + "$" + item.mcatCd + "$" + item.lcatCd);
                        $("#reason").bindSelectSetValue("P000");

                    },
                    file_delete: function (id) {
                        if (!confirm("정말 삭제 하시겠습니까?")) return;
                        app.net.ajax({
                            type: "DELETE",
                            url: "/api/v1/notices/file/" + id,
                            data: ""
                        }, function (res) {
                            if (res.error) {
                                alert(res.error.message);
                            }
                            else {
                                toast.push("삭제 되었습니다.");
                                $("#att-file-" + id).remove();
                            }
                        });
                    }
                },
                __end: {}
            };
        </script>
    </ax:div>
</ax:layout>