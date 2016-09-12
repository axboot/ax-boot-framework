<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="샘플:파일업로드"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>
    <ax:div name="contents">
        <ax:row>
            <ax:col size="12">
                <ax:custom customid="page-button">

                </ax:custom>

                <div id="uploadQueueBox" class="AXUpload5QueueBox" style="height:180px;border-radius: 7px;border: 1px solid #4387bb;background-color: #fff;overflow: hidden;"></div>
                <div class="H10"></div>
                <div class="AXUpload5" id="AXUpload5"></div>

            </ax:col>
        </ax:row>
        <div class="H10"></div>
    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            /**
             * actions
             */
            var ACTIONS = $.extend(app.ACTIONS, {

            });

            var fnObj = {
                dispatch: function (caller, act, data) {
                    var _this = this;
                    switch (act) {


                        default:
                            return false;

                    }
                    // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
                }
            };

            /**
             * pageStart
             */
            fnObj.pageStart = function () {
                fnObj.upload.initView();

                return false;
            };

            fnObj.upload = {
                target: new AXUpload5(),
                initView: function () {

                    this.target.setConfig({
                        targetID: "AXUpload5",
                        targetButtonClass: "Green",
                        uploadFileName: "file",
                        file_types: "image/*",  //audio/*|video/*|image/*|MIME_type (accept)
                        dropBoxID: "uploadQueueBox",
                        queueBoxID: "uploadQueueBox", // upload queue targetID
                        queueBoxAppendType: "prepend",

                        // html 5를 지원하지 않는 브라우저를 위한 swf upload 설정 원치 않는 경우엔 선언 하지 않아도 됩니다. ------- s
                        flash_url: "lib/swfupload.swf",
                        flash9_url: "lib/swfupload_fp9.swf",
                        flash_file_types: "*.jpg;*.jpeg;*.gif;*.bmp;*.png",
                        flash_file_types_description: "image",
                        // --------- e

                        onClickUploadedItem: function () { // 업로드된 목록을 클릭했을 때.
                            location.href = "/api/v1/files/download?id=" + this.id;
                        },

                        uploadMaxFileSize: (1000 * 1024 * 1024), // 업로드될 개별 파일 사이즈 (클라이언트에서 제한하는 사이즈 이지 서버에서 설정되는 값이 아닙니다.)
                        uploadMaxFileCount: 1, // 업로드될 파일갯수 제한 0 은 무제한
                        uploadUrl: "/api/v1/largeFileUpload",
                        uploadPars: {},
                        deleteMethod: "GET",
                        deleteUrl: "/api/v1/files/delete",
                        deletePars: {},

                        buttonTxt: "Select File",

                        fileKeys: { // 서버에서 리턴하는 json key 정의 (id는 예약어 사용할 수 없음)
                            //id:"id",
                            name: "fileNm",
                            type: "extension",
                            saveName: "saveNm",
                            fileSize: "fileSize",
                            uploadedPath: "",
                            thumbPath: "preview" // 서버에서 키값을 다르게 설정 할 수 있다는 것을 확인 하기 위해 이름을 다르게 처리한 예제 입니다.
                        },

                        // onbeforeFileSelect: function () { return true; },
                        // onUpload: function () { },
                        onError: function (errorType, extData) { }
                    });
                    // changeConfig

                },
                setData: function(item){
                    if(item) this.target.setUploadedList([item]);
                }
            };
        </script>
    </ax:div>
</ax:layout>