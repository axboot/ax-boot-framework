<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<%
    request.setAttribute("callBack", request.getParameter("callBack"));
    request.setAttribute("itemIndex", request.getParameter("itemIndex"));
    request.setAttribute("id", request.getParameter("id"));
%>
<ax:layout name="modal.jsp">
    <ax:set name="title" value="공지사항 조회"/>
    <ax:set name="page_desc" value=""/>

    <ax:div name="contents">
        <ax:row>
            <ax:col size="12" wrap="true">

                <ax:form id="form-notice" name="form-notice" method="post">
                    <input type="hidden" name="id" value="${id}"/>
                    <ax:fields>
                        <ax:field label="등록일" width="150px">
                            <label id="insDate"></label>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="제목" style="width:100%">
                            <label id="title"></label>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="내용" style="width:100%">
                            <label id="content"></label>
                        </ax:field>
                    </ax:fields>
                    <ax:fields>
                        <ax:field label="팝업여부" width="150px">
                            <label id="popupYn"></label>
                        </ax:field>
                        <ax:field label="게시기간" width="150px">
                            <label id="stDt"></label>
                        </ax:field>
                    </ax:fields>


                    <ax:fields>
                        <ax:field label="표시여부" width="150px">
                            <label id="dispYn"></label>
                        </ax:field>
                    </ax:fields>

                </ax:form>

                <div id="file-attach-target"></div>

            </ax:col>
        </ax:row>
    </ax:div>
    <ax:div name="buttons">
        <button type="button" class="AXButton" onclick="fnObj.modify();">수정</button>
        <button type="button" class="AXButton" onclick="parent.myModal.close();">취소</button>
    </ax:div>

    <ax:div name="scripts">
        <script type="text/javascript">
            var fnObj = {
                pageStart: function () {
                    fnObj.dataBind();
                    app.modal.resize();
                },
                pageResize: function () {
                    app.modal.resize();
                },
                modify: function () {
                    document["form-notice"].action = "system-operation-notice-modal.jsp";
                    document["form-notice"].submit();
                },
                dataBind: function () {
                    app.ajax({
                        type: "GET",
                        url: "/api/v1/notices/" + document["form-notice"].id.value,
                        data: ""
                    }, function (res) {
                        if (res.error) {
                            alert(res.error.message);
                        }
                        else {
                            $("#insDate").html(res.insDt.date().print());
                            $("#title").html(res.title);
                            //console.log(res.content);

                            $("#content").html((res.content || "").crlf());

                            if (res.stDt) $("#stDt").html(res.stDt.date().print() + " ~ " + res.endDt.date().print());
                            $("#popupYn").html(((res.popupYn == "Y") ? "사용" : "사용안함"));
                            $("#dispYn").html(((res.dispYn == "Y") ? "표시" : "표시안함"));

                            if (res.files.length > 0) {
                                //$("#file-attach-target")
                                var po = [], i = res.files.length;
                                po.push('<h3><i class="axi axi-list-alt"></i> 첨부파일</h3>');
                                po.push('<div style="border:1px solid #6caab9;padding:10px;">');
                                while (i--) {
                                    po.push('<a href="/api/v1/notices/file/' + res.files[i].id + '" style="display:inline-block;padding:5px;font-size:12px;margin:0px 5px;"><i class="axi axi-file-download"></i> ' + res.files[i].fileName + '</a>');
                                }
                                po.push('</div>');
                                $("#file-attach-target").html(po.join(''));
                            }

                            app.modal.resize();

                            /*
                            $.each(res, function(k, v){
                              try{
                                $("#" + k).html(v);
                              }
                              catch(e){
                                fnObj.pageResize()
                              }
                            });
                            */
                        }
                    });
                },
                __end: {}
            };
        </script>
    </ax:div>
</ax:layout>