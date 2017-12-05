describe('ax5uploader TEST', function () {
    var upload1;

    var tmpl = '<div data-ax5uploader="upload1">' +
        '<input type="hidden" name="param1" value="value1"/>' +
        '<input type="hidden" name="param2" value="value2"/>' +
        '<button data-ax5uploader-button="selector" class="btn btn-primary">파일선택 (*/*)</button>' +
        '<div data-uploaded-box="upload1" data-ax5uploader-uploaded-box="inline"></div>' +
        '</div>';

    $(document.body).append(tmpl);

    it('new ax5uploader', function (done) {
        try {
            upload1 = new ax5.ui.uploader();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('uploader setConfig check target', function (done) {

        upload1.setConfig({
            //debug: true,
            target: $('[data-ax5uploader="upload1"]'),
            form: {
                action: "api/fileUpload.php",
                fileName: "fileData"
            },
            multiple: true,
            manualUpload: false,

            progressBox: true,
            progressBoxDirection: "left",

            dropZone: {
                target: $('[data-uploaded-box="upload1"]')
            },
            uploadedBox: {
                target: $('[data-uploaded-box="upload1"]'),
                icon: {
                    "download": '<i class="fa fa-download" aria-hidden="true"></i>',
                    "delete": '<i class="fa fa-minus-circle" aria-hidden="true"></i>'
                },
                columnKeys: {
                    name: "name",
                    type: "type",
                    size: "fileSize",
                    uploadedName: "uploadedName",
                    uploadedPath: "uploadedPath",
                    downloadPath: "downloadPath",
                    previewPath: "previewPath",
                    thumbnail: "thumbnail"
                },
                lang: {
                    supportedHTML5_emptyListMsg: '<div class="text-center">Drop files here or click to upload.</div>',
                    emptyListMsg: '<div class="text-center">Empty of List.</div>'
                },
                onchange: function () {

                },
                onclick: function () {
                    // console.log(this.cellType);
                    var fileIndex = this.fileIndex;
                    var file = this.uploadedFiles[fileIndex];
                    switch (this.cellType) {
                        case "delete":
                            dialog.confirm({
                                title: "AX5UI",
                                msg: "정말 삭제 하시겠습니까?"
                            }, function () {
                                if (this.key == "ok") {
                                    $.ajax({
                                        method: "post",
                                        url: "api/fileDelete.php",
                                        data: {
                                            uploadedPath: file.uploadedPath,
                                            saveName: file.saveName
                                        },
                                        success: function (res) {
                                            upload1.removeFile(fileIndex);
                                        }
                                    });
                                }
                            });
                            break;

                        case "download":
                            window.open(file.uploadedPath + "/" + file.saveName, "_blank", "width=600, height=600");
                            break;
                    }
                }
            },

            validateSelectedFiles: function () {
                return true;
            },
            onprogress: function () {

            },
            onuploaded: function () {

            },
            onuploadComplete: function () {

            }
        });

        done(upload1.$target instanceof jQuery ? "" : "$target find error");
    });

    it('uploader setConfig check dropZone', function (done) {
        done(upload1.$dropZone instanceof jQuery ? "" : "dropZone find error");
    });

    it('uploader setConfig check uploadedBox', function (done) {
        done(upload1.$uploadedBox instanceof jQuery ? "" : "uploadedBox find error");
    });

    it('uploader API send()', function (done) {
        done(upload1.send() == upload1 ? "" : "send API error");
    });
    it('uploader API abort()', function (done) {
        done(upload1.abort() == upload1 ? "" : "abort API error");
    });
    it('uploader API setUploadedFiles()', function (done) {
        done(upload1.setUploadedFiles() == upload1 ? "" : "setUploadedFiles API error");
    });
    it('uploader API removeFile()', function (done) {
        done(upload1.removeFile() == upload1 ? "" : "removeFile API error");
    });
    it('uploader API removeFileAll()', function (done) {
        done(upload1.removeFileAll() == upload1 ? "" : "removeFileAll API error");
    });

});