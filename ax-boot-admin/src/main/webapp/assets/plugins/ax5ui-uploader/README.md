[![Build Status](https://travis-ci.org/ax5ui/ax5ui-uploader.svg?branch=master)](https://travis-ci.org/ax5ui/ax5ui-uploader)
[![npm version](https://badge.fury.io/js/ax5ui-uploader.svg)](https://badge.fury.io/js/ax5ui-uploader)
[![](https://img.shields.io/npm/dm/ax5ui-uploader.svg)](https://www.npmjs.com/package/ax5ui-uploader)

# ax5ui-uploader
"uploader" allows users to upload single or multiple files with item selection.

![ax5uploader](src/ax5uploader.gif)

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_

### Install with bower
```sh
bower install ax5ui-uploader
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
When you install `bower`, it will be installed under the `bower_components` folder to resolve the plug-in dependencies.  
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using `bower`. 
If you've never used bower, please refer to [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Install with npm
If you do not use bower, it also can be installed by using npm as an alternative.
In case of npm, which is the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
npm install ax5ui-uploader
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-uploader Github releases](https://github.com/ax5ui/ax5ui-uploader/releases)


### Insert "ax5uploader" in HTML HEAD.

Folder location can be any for your project. However, please be sure to assign the right path in the project.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-uploader/master/dist/ax5uploader.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-uploader/master/dist/ax5uploader.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5ui-uploader. ax5ui offers the CDN services through rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-uploader/master/dist/ax5uploader.css
https://cdn.rawgit.com/ax5ui/ax5ui-uploader/master/dist/ax5uploader.js
https://cdn.rawgit.com/ax5ui/ax5ui-uploader/master/dist/ax5uploader.min.js
```

### Basic Usage
```html
<div data-ax5uploader="upload1">
    <input type="hidden" name="param1" value="value1"/>
    <input type="hidden" name="param2" value="value2"/>
    <button data-ax5uploader-button="selector" class="btn btn-primary">파일선택 (*/*)</button>
    <div data-uploaded-box="upload1" data-ax5uploader-uploaded-box="inline"></div>
</div>
```

```js
$(function () {
    var upload1 = new ax5.ui.uploader();
    upload1.setConfig({
        //debug: true,
        target: $('[data-ax5uploader="upload1"]'),
        form: {
            action: "api/fileUpload.php",
            fileName: "fileData"
        },
        multiple: true,
        manualUpload: false,
        direction: "left",
        progressBox: true,
        dropZone: $('[data-uploaded-box="upload1"]'),
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
        onprogress: function () {

        },
        onuploaded: function () {

        },
        onuploadComplete: function () {

        }
    });

    $.ajax({
        url: "api/fileListLoad.php",
        success: function (res) {
            upload1.setUploadedFiles(res);
        }
    });
});
```

- - -

### Preview
- [See Demonstration](http://ax5.io/ax5ui-uploader/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)

## Question
- https://jsdev.kr/c/axisj/ax5ui
- https://github.com/ax5ui/ax5ui-kernel/issues

[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)
