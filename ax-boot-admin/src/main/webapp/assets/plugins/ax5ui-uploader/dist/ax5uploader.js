"use strict";

// ax5.ui.uploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var UPLOADER = void 0;

    UI.addClass({
        className: "uploader"
    }, function () {

        var ax5uploader = function ax5uploader() {
            /**
             * @class ax5uploader
             * @classdesc
             * @author tom@axisj.com
             * @example
             * ```js
             *
             * ```
             */
            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default', // theme of uploader
                lang: { // 업로더 버튼 랭귀지 설정
                    "upload": "Upload",
                    "abort": "Abort"
                },
                uploadedBox: {
                    columnKeys: {
                        name: "name",
                        type: "type",
                        size: "size",
                        uploadedName: "uploadedName",
                        uploadedPath: "uploadedPath",
                        downloadPath: "downloadPath",
                        previewPath: "previewPath",
                        thumbnail: "thumbnail"
                    }
                },
                animateTime: 100,
                accept: "*/*", // 업로드 선택 파일 타입 설정
                multiple: false, // 다중 파일 업로드
                manualUpload: false, // 업로딩 시작 수동처리 여부
                progressBox: true // 업로드 프로그래스 박스 사용여부 false 이면 업로드 진행바를 표시 하지 않습니다. 개발자가 onprogress 함수를 이용하여 직접 구현 해야 합니다.
            };
            this.defaultBtns = {
                "upload": { label: this.config.lang["upload"], theme: "btn-primary" },
                "abort": { label: this.config.lang["abort"], theme: this.config.theme }
            };

            /// 업로드된 파일 큐
            this.uploadedFiles = [];
            /// 업로더 타겟
            this.$target = null;
            /// 업로드된 파일 정보들의 input 태그를 담아두는 컨테이너
            this.$inputContainer = null;
            /// input file 태그
            this.$inputFile = null;
            this.$inputFileForm = null;
            /// 파일 선택버튼
            this.$fileSelector = null;
            /// 파일 드랍존
            this.$dropZone = null;
            /// 파일 목록 표시박스
            this.$uploadedBox = null;

            this.__uploading = false;
            this.selectedFiles = [];
            this.selectedFilesTotal = 0;
            this.__loaded = 0;

            cfg = this.config;

            /**
             * UI 상태변경 이벤트 처리자
             * UI의 상태변경 : open, close, upload 등의 변경사항이 발생되면 onStateChanged 함수를 후출하여 이벤트를 처리
             */
            var bound_onStateChanged = function (that) {

                var state = {
                    "open": function open() {},
                    "close": function close() {},
                    "upload": function upload() {}
                };

                if (cfg.onStateChanged) {
                    cfg.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
                return true;
            }.bind(this);

            var bound_onSelectFile = function (_evt) {
                var files = void 0;

                if (!ax5.info.supportFileApi) {
                    // file API 지원 안되는 브라우저.
                    // input file에 multiple 지원 안됨 그러므로 단일 파일 처리만 하면 됨.
                    files = { path: _evt.target.value };
                } else if ('dataTransfer' in _evt) {
                    files = _evt.dataTransfer.files;
                } else if ('target' in _evt) {
                    files = _evt.target.files;
                } else if (_evt) {
                    files = _evt;
                }

                if (!files) return false;

                /// selectedFiles에 현재 파일 정보 담아두기
                if (length in files) {
                    if (files.length == 1) {
                        this.selectedFiles = [files[0]];
                    } else {
                        this.selectedFiles = U.toArray(files);
                    }
                } else {
                    this.selectedFiles = [files];
                }

                if (cfg.progressBox) {
                    bound_openProgressBox();
                }
                if (!cfg.manualUpload) {
                    this.send();
                }

                if (!ax5.info.supportFileApi) {
                    bound_alignLayout(false);
                }
            }.bind(this);

            var bound_bindEvent = function () {
                this.$fileSelector.off("click.ax5uploader").on("click.ax5uploader", function () {
                    this.$inputFile.trigger("click");
                }.bind(this));

                if (!ax5.info.supportFileApi) {
                    this.$fileSelector.off("mouseover.ax5uploader").on("mouseover.ax5uploader", function () {
                        bound_alignLayout(true);
                    }.bind(this));

                    this.$inputFile.off("mouseover.ax5uploader").on("mouseover.ax5uploader", function () {
                        this.$fileSelector.addClass("active");
                    }.bind(this));

                    this.$inputFile.off("mouseout.ax5uploader").on("mouseout.ax5uploader", function () {
                        this.$fileSelector.removeClass("active");

                        bound_alignLayout(false);
                    }.bind(this));
                }

                (function () {
                    if (!this.$uploadedBox || !this.$uploadedBox.get(0)) return false;

                    this.$uploadedBox.on("click", "[data-uploaded-item-cell]", function () {
                        var $this = jQuery(this),
                            cellType = $this.attr("data-uploaded-item-cell"),
                            uploadedItemIndex = Number($this.parents('[data-ax5uploader-uploaded-item]').attr('data-ax5uploader-uploaded-item')),
                            that = {};

                        if (cfg.uploadedBox && cfg.uploadedBox.onclick) {
                            that = {
                                self: self,
                                cellType: cellType,
                                uploadedFiles: self.uploadedFiles,
                                fileIndex: uploadedItemIndex
                            };
                            cfg.uploadedBox.onclick.call(that, that);
                        }

                        $this = null;
                        cellType = null;
                        uploadedItemIndex = null;
                        that = null;
                    });

                    this.$uploadedBox.on("dragstart", function (e) {
                        U.stopEvent(e);
                        return false;
                    });
                }).call(this);

                (function () {
                    // dropZone 설정 방식 변경
                    if (!ax5.info.supportFileApi) return false;
                    if (!this.$dropZone || !this.$dropZone.get(0)) return false;

                    var timer = void 0;

                    this.$dropZone.parent().on("click", "[data-ax5uploader-dropzone]", function (e) {
                        var $target = jQuery(e.target);
                        if ($target.parents('[data-ax5uploader-uploaded-item]').length == 0 && !$target.attr('data-ax5uploader-uploaded-item')) {
                            if (this == e.target || $.contains(this, e.target)) {
                                if (U.isFunction(cfg.dropZone.onclick)) {
                                    cfg.dropZone.onclick.call({
                                        self: self
                                    });
                                } else {
                                    self.$inputFile.trigger("click");
                                }
                            }
                        }
                    });

                    this.$dropZone.get(0).addEventListener('dragover', function (e) {
                        U.stopEvent(e);

                        if (U.isFunction(cfg.dropZone.ondragover)) {
                            cfg.dropZone.ondragover.call({
                                self: self
                            });
                        } else {
                            self.$dropZone.addClass("dragover");
                        }
                    }, false);

                    this.$dropZone.get(0).addEventListener('dragleave', function (e) {
                        U.stopEvent(e);

                        if (U.isFunction(cfg.dropZone.ondragover)) {
                            cfg.dropZone.ondragout.call({
                                self: self
                            });
                        } else {
                            self.$dropZone.removeClass("dragover");
                        }
                    }, false);

                    this.$dropZone.get(0).addEventListener('drop', function (e) {
                        U.stopEvent(e);

                        if (U.isFunction(cfg.dropZone.ondrop)) {
                            cfg.dropZone.ondrop.call({
                                self: self
                            });
                        } else {
                            self.$dropZone.removeClass("dragover");
                        }

                        bound_onSelectFile(e || window.event);
                    }, false);
                }).call(this);
            }.bind(this);

            var bound_alignLayout = function (_TF) {
                // 상황이 좋지 않은경우 (만약 버튼 클릭으로 input file click이 되지 않는 다면 z-index값을 높여서 버튼위를 덮는다.)
                if (_TF) {
                    if (!ax5.info.supportFileApi) {
                        // ie9에서 inputFile을 직접 클릭하지 않으면 submit 오류발생함. submit access denied
                        // 그래서 버튼위에 inputFile을 올려두어야 함. (position값을 이용하면 편하지만..)
                        // 그런데 form을 안에두면 또 다른 이중폼 문제 발생소지 ㅜㅜ 불가피하게 버튼의 offset 값을 이용.
                        var box = this.$fileSelector.offset();
                        box.width = this.$fileSelector.outerWidth();
                        box.height = this.$fileSelector.outerHeight();
                        this.$inputFile.css(box);
                    }
                } else {
                    this.$inputFile.css({
                        left: -1000, top: -1000
                    });
                }
            }.bind(this);

            var bound_alignProgressBox = function (append) {
                var _alignProgressBox = function _alignProgressBox() {
                    var $window = jQuery(window),
                        $body = jQuery(document.body);
                    var pos = {},
                        positionMargin = 6,
                        dim = {},
                        pickerDim = {},
                        pickerDirection = void 0;

                    // cfg.viewport.selector

                    pos = this.$progressBox.parent().get(0) == this.$target.get(0) ? this.$fileSelector.position() : this.$fileSelector.offset();
                    dim = {
                        width: this.$fileSelector.outerWidth(),
                        height: this.$fileSelector.outerHeight()
                    };
                    pickerDim = {
                        winWidth: Math.max($window.width(), $body.width()),
                        winHeight: Math.max($window.height(), $body.height()),
                        width: this.$progressBox.outerWidth(),
                        height: this.$progressBox.outerHeight()
                    };

                    // picker css(width, left, top) & direction 결정
                    if (!cfg.progressBoxDirection || cfg.progressBoxDirection === "" || cfg.progressBoxDirection === "auto") {
                        // set direction
                        pickerDirection = "top";
                        if (pos.top - pickerDim.height - positionMargin < 0) {
                            pickerDirection = "top";
                        } else if (pos.top + dim.height + pickerDim.height + positionMargin > pickerDim.winHeight) {
                            pickerDirection = "bottom";
                        }
                    } else {
                        pickerDirection = cfg.progressBoxDirection;
                    }

                    if (append) {
                        this.$progressBox.addClass("direction-" + pickerDirection);
                    }

                    var positionCSS = function () {
                        var css = { left: 0, top: 0 };
                        switch (pickerDirection) {
                            case "top":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top + dim.height + positionMargin;
                                break;
                            case "bottom":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top - pickerDim.height - positionMargin;
                                break;
                            case "left":
                                css.left = pos.left + dim.width + positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                            case "right":
                                css.left = pos.left - pickerDim.width - positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                        }
                        return css;
                    }();

                    (function () {
                        if (pickerDirection == "top" || pickerDirection == "bottom") {
                            if (positionCSS.left < 0) {
                                positionCSS.left = positionMargin;
                                this.$progressBoxArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            } else if (positionCSS.left + pickerDim.width > pickerDim.winWidth) {
                                positionCSS.left = pickerDim.winWidth - pickerDim.width - positionMargin;
                                this.$progressBoxArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            }
                        }
                    }).call(this);

                    this.$progressBox.css(positionCSS);
                };

                this.$progressBox.css({ top: -999 });
                if (append) {
                    // progressBox를 append 할 타겟 엘리먼트 펀단 후 결정.
                    (function () {
                        if (cfg.viewport) {
                            return jQuery(cfg.viewport.selector);
                        } else {
                            return this.$target;
                        }
                    }).call(this).append(this.$progressBox);

                    // progressBox 버튼에 이벤트 연결.
                    this.$progressBox.off("click.ax5uploader").on("click.ax5uploader", "button", function (_evt) {
                        var act = _evt.target.getAttribute("data-pregressbox-btn");
                        var processor = {
                            "upload": function upload() {
                                this.send();
                            },
                            "abort": function abort() {
                                this.abort();
                            }
                        };
                        if (processor[act]) processor[act].call(this);
                    }.bind(this));
                }

                setTimeout(function () {
                    _alignProgressBox.call(this);
                }.bind(this));
            }.bind(this);

            var bound_openProgressBox = function () {
                this.$progressBox.removeClass("destroy");
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.removeAttr("disabled");

                // apend & align progress box
                bound_alignProgressBox("append");

                // state change
                bound_onStateChanged({
                    self: this,
                    state: "open"
                });
            }.bind(this);

            var bound_closeProgressBox = function () {
                this.$progressBox.addClass("destroy");
                setTimeout(function () {
                    this.$progressBox.remove();
                }.bind(this), cfg.animateTime);
            }.bind(this);

            var bound_startUpload = function () {

                var processor = {
                    "html5": function html5() {

                        var uploadFile = this.selectedFiles.shift();
                        if (!uploadFile) {
                            // 업로드 종료
                            bound_uploadComplete();
                            return this;
                        }

                        if (uploadFile[0]) uploadFile = uploadFile[0];

                        var formData = new FormData();
                        //서버로 전송해야 할 추가 파라미터 정보 설정

                        this.$target.find("input").each(function () {
                            formData.append(this.name, this.value);
                        });
                        // 파일 아이템 추가
                        formData.append(cfg.form.fileName, uploadFile);

                        this.xhr = new XMLHttpRequest();
                        this.xhr.open("post", cfg.form.action, true);
                        this.xhr.onload = function (e) {
                            var res = e.target.response;
                            try {
                                if (typeof res == "string") res = U.parseJson(res);
                            } catch (e) {
                                return false;
                            }
                            if (cfg.debug) console.log(res);

                            if (res.error) {
                                if (cfg.debug) console.log(res.error);
                                if (U.isFunction(cfg.onuploaderror)) {
                                    cfg.onuploaderror.call({
                                        self: this,
                                        error: res.error
                                    }, res);
                                }
                                self.send();
                                return false;
                            }

                            bound_uploaded(res);
                            self.send();
                        };
                        this.xhr.upload.onprogress = function (e) {
                            // console.log(e.loaded, e.total);
                            bound_updateProgressBar(e);
                            if (U.isFunction(cfg.onprogress)) {
                                cfg.onprogress.call({
                                    loaded: e.loaded,
                                    total: e.total
                                }, e);
                            }
                        };
                        this.xhr.send(formData); // multipart/form-data
                    },
                    "form": function form() {

                        /// i'm busy
                        this.__uploading = true;

                        // 폼과 iframe을 만들어 페이지 아래에 삽입 후 업로드
                        var $iframe = jQuery('<iframe src="javascript:false;" name="ax5uploader-' + this.instanceId + '-iframe" style="display:none;"></iframe>');
                        jQuery(document.body).append($iframe);

                        // onload 이벤트 핸들러
                        // action에서 파일을 받아 처리한 결과값을 텍스트로 출력한다고 가정하고 iframe의 내부 데이터를 결과값으로 callback 호출
                        $iframe.load(function () {
                            var doc = this.contentWindow ? this.contentWindow.document : this.contentDocument ? this.contentDocument : this.document,
                                root = doc.documentElement ? doc.documentElement : doc.body,
                                result = root.textContent ? root.textContent : root.innerText,
                                res = void 0;

                            try {
                                res = JSON.parse(result);
                            } catch (e) {
                                res = {
                                    error: "Syntax error",
                                    body: result
                                };
                            }

                            if (cfg.debug) console.log(res);
                            if (res.error) {
                                console.log(res);
                            } else {
                                bound_uploaded(res);
                                $iframe.remove();

                                setTimeout(function () {
                                    bound_uploadComplete();
                                }, 300);
                            }
                        });

                        this.$inputFileForm.attr("target", 'ax5uploader-' + this.instanceId + '-iframe').attr("action", cfg.form.action).submit();

                        this.selectedFilesTotal = 1;
                        bound_updateProgressBar({
                            loaded: 1,
                            total: 1
                        });
                    }
                };

                if (this.__uploading === false) {
                    // 전체 파일 사이즈 구하기
                    var filesTotal = 0;
                    this.selectedFiles.forEach(function (n) {
                        filesTotal += n.size;
                    });
                    this.selectedFilesTotal = filesTotal;
                    this.__loaded = 0;

                    this.__uploading = true; // 업로드 시작 상태 처리
                    this.$progressUpload.attr("disabled", "disabled");
                    this.$progressAbort.removeAttr("disabled");
                }

                processor[ax5.info.supportFileApi ? "html5" : "form"].call(this);
            }.bind(this);

            var bound_updateProgressBar = function (e) {
                this.__loaded += e.loaded;
                this.$progressBar.css({ width: U.number(this.__loaded / this.selectedFilesTotal * 100, { round: 2 }) + '%' });
                if (e.lengthComputable) {
                    if (e.loaded >= e.total) {}
                }
            }.bind(this);

            var bound_uploaded = function (res) {
                if (cfg.debug) console.log(res);
                this.uploadedFiles.push(res);
                bound_repaintUploadedBox(); // 업로드된 파일 출력

                if (U.isFunction(cfg.onuploaded)) {
                    cfg.onuploaded.call({
                        self: this
                    }, res);
                }
            }.bind(this);

            var bound_uploadComplete = function () {
                this.__uploading = false; // 업로드 완료 상태처리
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.attr("disabled", "disabled");

                if (cfg.progressBox) {
                    bound_closeProgressBox();
                }
                if (U.isFunction(cfg.onuploadComplete)) {
                    cfg.onuploadComplete.call({
                        self: this
                    });
                }
                // update uploadedFiles display

                /// reset inputFile
                bound_attachFileTag();
            }.bind(this);

            var bound_cancelUpload = function () {

                var processor = {
                    "html5": function html5() {
                        if (this.xhr) {
                            this.xhr.abort();
                        }
                    },
                    "form": function form() {}
                };

                this.__uploading = false; // 업로드 완료 상태처리
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.attr("disabled", "disabled");

                processor[ax5.info.supportFileApi ? "html5" : "form"].call(this);

                if (cfg.progressBox) {
                    bound_closeProgressBox();
                }

                //this.$inputFile.val("");
                /// reset inputFile
                bound_attachFileTag();

                if (cfg.debug) console.log("cancelUpload");
                // update uploadedFiles display
            }.bind(this);

            var bound_repaintUploadedBox = function () {
                // uploadedBox 가 없다면 아무일도 하지 않음.
                // onuploaded 함수 이벤트를 이용하여 개발자가 직접 업로드디 박스를 구현 한다고 이해 하자.
                if (this.$uploadedBox === null) return this;

                this.$uploadedBox.html(UPLOADER.tmpl.get("upoadedBox", {
                    uploadedFiles: this.uploadedFiles,
                    icon: cfg.uploadedBox.icon,
                    lang: cfg.uploadedBox.lang,
                    supportFileApi: !!ax5.info.supportFileApi
                }, cfg.uploadedBox.columnKeys));
                this.$uploadedBox.find("img").on("error", function () {
                    //this.src = "";
                    $(this).parent().addClass("no-image");
                });
            }.bind(this);

            var bound_attachFileTag = function () {
                if (this.$inputFile && this.$inputFile.get(0)) {
                    this.$inputFile.remove();
                }
                if (this.$inputFileForm && this.$inputFileForm.get(0)) {
                    this.$inputFileForm.remove();
                }

                this.$inputFile = jQuery(UPLOADER.tmpl.get.call(this, "inputFile", {
                    instanceId: this.instanceId,
                    multiple: cfg.multiple,
                    accept: cfg.accept,
                    name: cfg.form.fileName
                }));

                if (ax5.info.supportFileApi) {
                    jQuery(document.body).append(this.$inputFile);
                } else {
                    this.$fileSelector.attr("tabindex", -1);
                    this.$inputFileForm = jQuery(UPLOADER.tmpl.get.call(this, "inputFileForm", {
                        instanceId: this.instanceId
                    }));

                    this.$inputFileForm.append(this.$inputFile);
                    jQuery(document.body).append(this.$inputFileForm);
                }

                this.$inputFile.off("change.ax5uploader").on("change.ax5uploader", function (_evt) {
                    bound_onSelectFile(_evt);
                }.bind(this));
            }.bind(this);

            /**
             * Preferences of uploader UI
             * @method ax5uploader.setConfig
             * @param {Object} _config - 클래스 속성값
             * @param {Element} _config.target
             * @param {Object} _config.form
             * @param {String} _config.form.action - upload URL
             * @param {String} _config.form.fileName - The name key of the upload file
             * @param {Boolean} [_config.multiple=false] - Whether multiple files. In a browser where fileApi is not supported (eg IE9), it only works with false.
             * @param {String} [_config.accept=""] - accept mimeType (http://www.w3schools.com/TAgs/att_input_accept.asp)
             * @param {Boolean} [_config.manualUpload=false] - Whether to automatically upload when a file is selected.
             * @param {Boolean} [_config.progressBox=true] - Whether to use progressBox
             * @param {String} [_config.progressBoxDirection=auto] - ProgressBox display direction
             * @param {Object} [_config.dropZone]
             * @param {Element} [_config.dropZone.target]
             * @param {Function} [_config.dropZone.onclick]
             * @param {Function} [_config.dropZone.ondragover]
             * @param {Function} [_config.dropZone.ondragout]
             * @param {Function} [_config.dropZone.ondrop]
             * @param {Object} [_config.uploadedBox]
             * @param {Element} [_config.uploadedBox.target]
             * @param {Element} [_config.uploadedBox.icon]
             * @param {Object} [_config.uploadedBox.columnKeys]
             * @param {String} [_config.uploadedBox.columnKeys.name]
             * @param {String} [_config.uploadedBox.columnKeys.type]
             * @param {String} [_config.uploadedBox.columnKeys.size]
             * @param {String} [_config.uploadedBox.columnKeys.uploadedName]
             * @param {String} [_config.uploadedBox.columnKeys.downloadPath]
             * @param {Object} [_config.uploadedBox.lang]
             * @param {String} [_config.uploadedBox.lang.supportedHTML5_emptyListMsg]
             * @param {String} [_config.uploadedBox.lang.emptyListMsg]
             * @param {Function} [_config.uploadedBox.onchange]
             * @param {Function} [_config.uploadedBox.onclick]
             * @param {Function} [_config.validateSelectedFiles]
             * @param {Function} [_config.onprogress] - return loaded, total
             * @param {Function} [_config.onuploaded] - return self
             * @param {Function} [_config.onuploaderror] - return self, error
             * @param {Function} [_config.onuploadComplete] - return self
             * @returns {ax5uploader}
             * @example
             * ```js
             *
             * ```
             */
            this.init = function (_config) {
                cfg = jQuery.extend(true, {}, cfg, _config);
                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5uploader", "401", "init"));
                    return this;
                }

                this.$target = jQuery(cfg.target);

                // 파일 드랍존은 옵션 사항.
                if (cfg.dropZone && cfg.dropZone.target && ax5.info.supportFileApi) {
                    this.$dropZone = jQuery(cfg.dropZone.target);
                    this.$dropZone.attr("data-ax5uploader-dropzone", this.instanceId);
                }

                // uploadedBox 옵션 사항
                if (cfg.uploadedBox && cfg.uploadedBox.target) {
                    this.$uploadedBox = jQuery(cfg.uploadedBox.target);
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        cfg = jQuery.extend(true, cfg, data);
                    }
                }).call(this, U.parseJson(this.$target.attr("data-ax5uploader-config"), true));

                // detect element
                /// fileSelector 수집
                this.$fileSelector = this.$target.find('[data-ax5uploader-button="selector"]');

                if (this.$fileSelector.length === 0) {
                    console.log(ax5.info.getError("ax5uploader", "402", "can not find file selector"));
                    return this;
                }

                // input file 추가
                bound_attachFileTag();

                // btns 확인
                cfg.btns = jQuery.extend({}, this.defaultBtns, cfg.btns);

                this.$progressBox = jQuery(UPLOADER.tmpl.get.call(this, "progressBox", {
                    instanceId: this.instanceId,
                    btns: cfg.btns
                }));
                this.$progressBar = this.$progressBox.find('[role="progressbar"]');
                this.$progressBoxArrow = this.$progressBox.find(".ax-progressbox-arrow");
                this.$progressUpload = this.$progressBox.find('[data-pregressbox-btn="upload"]');
                this.$progressAbort = this.$progressBox.find('[data-pregressbox-btn="abort"]');

                // file API가 지원되지 않는 브라우저는 중지 기능 제공 못함.
                if (!ax5.info.supportFileApi) {
                    this.$progressAbort.hide();
                }
                // 파일버튼 등에 이벤트 연결.
                bound_bindEvent();

                bound_repaintUploadedBox();
                return this;
            };

            /**
             * @method ax5uploader.send
             * @returns {ax5uploader}
             *
             */
            this.send = function () {
                return function () {
                    // 업로드 시작
                    if (U.isFunction(cfg.validateSelectedFiles)) {
                        var that = {
                            self: this,
                            uploadedFiles: this.uploadedFiles,
                            selectedFiles: this.selectedFiles
                        };
                        if (!cfg.validateSelectedFiles.call(that, that)) {
                            bound_cancelUpload();
                            return false;
                            // 전송처리 안함.
                        }
                    }

                    bound_startUpload();
                    return this;
                };
            }();

            /**
             * @method ax5uploader.abort
             * @returns {ax5uploader}
             */
            this.abort = function () {
                return function () {
                    if (!ax5.info.supportFileApi) {
                        alert("This browser not supported abort method");
                        return this;
                    }
                    bound_cancelUpload();
                    return this;
                };
            }();

            /**
             * @method ax5uploader.setUploadedFiles
             * @param {Array} _files - JSON formatting can all be overridden in columnKeys.
             * @returns {ax5uploader}
             * @example
             * ```js
             * var upload1 = new ax5.ui.uploader();
             * upload1.setConfig({
             *  ...
             * });
             *
             *
             * $.ajax({
             *     url: "api/fileListLoad.php",
             *     success: function (res) {
             *         // res JSON format
             *         // [{
             *         // "name": "barcode-scan-ani.gif",
             *         // "saveName": "barcode-scan-ani.gif",
             *         // "type": "file",
             *         // "fileSize": "3891664",
             *         // "uploadedPath": "/ax5ui-uploader/test/api/files",
             *         // "thumbUrl": ""
             *         // }]
             *         upload1.setUploadedFiles(res);
             *     }
             * });
             * ```
             */
            this.setUploadedFiles = function (_files) {
                if (U.isArray(_files)) {
                    this.uploadedFiles = _files;
                }
                if (U.isString(_files)) {
                    try {
                        this.uploadedFiles = JSON.parse(_files);
                    } catch (e) {}
                }

                bound_repaintUploadedBox();
                return this;
            };

            /**
             * clear uploadedFiles
             * @method ax5uploader.clear
             * @returns {ax5uploader}
             */
            this.clear = function () {
                this.setUploadedFiles([]);
                return this;
            };

            /**
             * Removes the object corresponding to the index passed to the argument from uploadedFiles.
             * @method ax5uploader.removeFile
             * @param {Number} _index
             * @returns {ax5uploader}
             * @example
             * ```js
             * // The actual file is not deleted
             * upload1.removeFile(fileIndex);
             * ```
             */
            this.removeFile = function (_index) {
                if (!isNaN(Number(_index))) {
                    this.uploadedFiles.splice(_index, 1);
                }
                bound_repaintUploadedBox();
                return this;
            };

            /**
             * Empty uploadedFiles
             * @method ax5uploader.removeFileAll
             * @returns {ax5uploader}
             * @example
             * ```js
             *
             * ```
             */
            this.removeFileAll = function () {
                this.uploadedFiles = [];
                bound_repaintUploadedBox();
                return this;
            };

            /**
             * @method ax5uploader.selectFile
             * @returns {Boolean}
             */
            this.selectFile = function () {
                if (ax5.info.supportFileApi) {
                    this.$inputFile.trigger("click");
                    return true;
                }
                return false;
            };

            // 클래스 생성자
            this.main = function () {
                UI.uploader_instance = UI.uploader_instance || [];
                UI.uploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    //this.init();
                }
            }.apply(this, arguments);
        };
        return ax5uploader;
    }());

    UPLOADER = ax5.ui.uploader;
})();
// ax5.ui.uploader.tmpl
(function () {

    var UPLOADER = ax5.ui.uploader;

    var uploadProgress = function uploadProgress(columnKeys) {
        return "\n        ";
    };

    var inputFile = function inputFile(columnKeys) {
        return "<input type=\"file\" data-ax5uploader-input=\"{{instanceId}}\" name=\"{{name}}\" {{#multiple}}multiple{{/multiple}} accept=\"{{accept}}\" />";
    };

    var inputFileForm = function inputFileForm(columnKeys) {
        return "<form data-ax5uploader-form=\"{{instanceId}}\" name=\"ax5uploader-{{instanceId}}-form\" method=\"post\" enctype=\"multipart/form-data\"></form>";
    };

    var progressBox = function progressBox(columnKeys) {
        return "\n<div data-ax5uploader-progressbox=\"{{instanceId}}\" class=\"{{theme}}\">\n    <div class=\"ax-progressbox-body\">\n        <div class=\"ax-pregressbox-content\">\n            <div class=\"progress\">\n              <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width: 0\">\n                <span class=\"sr-only\">0% Complete</span>\n              </div>\n            </div>\n        </div>\n        {{#btns}}\n            <div class=\"ax-progressbox-buttons\">\n            {{#btns}}\n                {{#@each}}\n                <button data-pregressbox-btn=\"{{@key}}\" class=\"btn btn-default {{@value.theme}}\">{{@value.label}}</button>\n                {{/@each}}\n            {{/btns}}\n            </div>\n        {{/btns}}\n    </div>\n    <div class=\"ax-progressbox-arrow\"></div>\n</div>\n";
    };

    var upoadedBox = function upoadedBox(columnKeys) {
        return "\n{{#uploadedFiles}}<div data-ax5uploader-uploaded-item=\"{{@i}}\">\n    <div class=\"uploaded-item-preview\">\n        {{#" + columnKeys.thumbnail + "}}<img src=\"" + columnKeys.apiServerUrl + "{{" + columnKeys.thumbnail + "}}\">{{/" + columnKeys.thumbnail + "}}\n    </div>\n    <div class=\"uploaded-item-holder\">\n        <div class=\"uploaded-item-cell\" data-uploaded-item-cell=\"download\">{{{icon.download}}}</div>\n        <div class=\"uploaded-item-cell\" data-uploaded-item-cell=\"filename\">{{" + columnKeys.name + "}}</div>\n        <div class=\"uploaded-item-cell\" data-uploaded-item-cell=\"filesize\">({{#@fn_get_byte}}{{" + columnKeys.size + "}}{{/@fn_get_byte}})</div>\n        <div class=\"uploaded-item-cell\" data-uploaded-item-cell=\"delete\">{{{icon.delete}}}</div>\n    </div>\n</div>{{/uploadedFiles}}\n{{^uploadedFiles}}\n{{#supportFileApi}}{{{lang.supportedHTML5_emptyListMsg}}}{{/supportFileApi}}\n{{^supportFileApi}}{{{lang.emptyListMsg}}}{{/supportFileApi}}\n{{/uploadedFiles}}\n";
    };

    UPLOADER.tmpl = {
        "uploadProgress": uploadProgress,
        "inputFile": inputFile,
        "inputFileForm": inputFileForm,
        "progressBox": progressBox,
        "upoadedBox": upoadedBox,

        get: function get(tmplName, data, columnKeys) {
            data["@fn_get_byte"] = function () {
                return function (text, render) {
                    return ax5.util.number(render(text), { round: 2, byte: true });
                };
            };
            return ax5.mustache.render(UPLOADER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();