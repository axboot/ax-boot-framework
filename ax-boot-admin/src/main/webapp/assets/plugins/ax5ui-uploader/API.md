<a name="ax5uploader"></a>

## ax5uploader
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5uploader](#ax5uploader)
    * [.setConfig(_config)](#ax5uploader.setConfig) ⇒ <code>[ax5uploader](#ax5uploader)</code>
    * [.send()](#ax5uploader.send) ⇒ <code>[ax5uploader](#ax5uploader)</code>
    * [.abort()](#ax5uploader.abort) ⇒ <code>[ax5uploader](#ax5uploader)</code>
    * [.setUploadedFiles(_files)](#ax5uploader.setUploadedFiles) ⇒ <code>[ax5uploader](#ax5uploader)</code>
    * [.clear()](#ax5uploader.clear) ⇒ <code>[ax5uploader](#ax5uploader)</code>
    * [.removeFile(_index)](#ax5uploader.removeFile) ⇒ <code>[ax5uploader](#ax5uploader)</code>
    * [.removeFileAll()](#ax5uploader.removeFileAll) ⇒ <code>[ax5uploader](#ax5uploader)</code>
    * [.selectFile()](#ax5uploader.selectFile) ⇒ <code>Boolean</code>

<a name="ax5uploader.setConfig"></a>

### ax5uploader.setConfig(_config) ⇒ <code>[ax5uploader](#ax5uploader)</code>
Preferences of uploader UI

**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| _config | <code>Object</code> |  | 클래스 속성값 |
| _config.target | <code>Element</code> |  |  |
| _config.form | <code>Object</code> |  |  |
| _config.form.action | <code>String</code> |  | upload URL |
| _config.form.fileName | <code>String</code> |  | The name key of the upload file |
| [_config.multiple] | <code>Boolean</code> | <code>false</code> | Whether multiple files. In a browser where fileApi is not supported (eg IE9), it only works with false. |
| [_config.accept] | <code>String</code> | <code>&quot;&quot;</code> | accept mimeType (http://www.w3schools.com/TAgs/att_input_accept.asp) |
| [_config.manualUpload] | <code>Boolean</code> | <code>false</code> | Whether to automatically upload when a file is selected. |
| [_config.progressBox] | <code>Boolean</code> | <code>true</code> | Whether to use progressBox |
| [_config.progressBoxDirection] | <code>String</code> | <code>auto</code> | ProgressBox display direction |
| [_config.dropZone] | <code>Object</code> |  |  |
| [_config.dropZone.target] | <code>Element</code> |  |  |
| [_config.dropZone.onclick] | <code>function</code> |  |  |
| [_config.dropZone.ondragover] | <code>function</code> |  |  |
| [_config.dropZone.ondragout] | <code>function</code> |  |  |
| [_config.dropZone.ondrop] | <code>function</code> |  |  |
| [_config.uploadedBox] | <code>Object</code> |  |  |
| [_config.uploadedBox.target] | <code>Element</code> |  |  |
| [_config.uploadedBox.icon] | <code>Element</code> |  |  |
| [_config.uploadedBox.columnKeys] | <code>Object</code> |  |  |
| [_config.uploadedBox.columnKeys.name] | <code>String</code> |  |  |
| [_config.uploadedBox.columnKeys.type] | <code>String</code> |  |  |
| [_config.uploadedBox.columnKeys.size] | <code>String</code> |  |  |
| [_config.uploadedBox.columnKeys.uploadedName] | <code>String</code> |  |  |
| [_config.uploadedBox.columnKeys.downloadPath] | <code>String</code> |  |  |
| [_config.uploadedBox.lang] | <code>Object</code> |  |  |
| [_config.uploadedBox.lang.supportedHTML5_emptyListMsg] | <code>String</code> |  |  |
| [_config.uploadedBox.lang.emptyListMsg] | <code>String</code> |  |  |
| [_config.uploadedBox.onchange] | <code>function</code> |  |  |
| [_config.uploadedBox.onclick] | <code>function</code> |  |  |
| [_config.validateSelectedFiles] | <code>function</code> |  |  |
| [_config.onprogress] | <code>function</code> |  | return loaded, total |
| [_config.onuploaded] | <code>function</code> |  | return self |
| [_config.onuploaderror] | <code>function</code> |  | return self, error |
| [_config.onuploadComplete] | <code>function</code> |  | return self |

**Example**  
```js

```
<a name="ax5uploader.send"></a>

### ax5uploader.send() ⇒ <code>[ax5uploader](#ax5uploader)</code>
**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  
<a name="ax5uploader.abort"></a>

### ax5uploader.abort() ⇒ <code>[ax5uploader](#ax5uploader)</code>
**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  
<a name="ax5uploader.setUploadedFiles"></a>

### ax5uploader.setUploadedFiles(_files) ⇒ <code>[ax5uploader](#ax5uploader)</code>
**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _files | <code>Array</code> | JSON formatting can all be overridden in columnKeys. |

**Example**  
```js
var upload1 = new ax5.ui.uploader();
upload1.setConfig({
 ...
});


$.ajax({
    url: "api/fileListLoad.php",
    success: function (res) {
        // res JSON format
        // [{
        // "name": "barcode-scan-ani.gif",
        // "saveName": "barcode-scan-ani.gif",
        // "type": "file",
        // "fileSize": "3891664",
        // "uploadedPath": "/ax5ui-uploader/test/api/files",
        // "thumbUrl": ""
        // }]
        upload1.setUploadedFiles(res);
    }
});
```
<a name="ax5uploader.clear"></a>

### ax5uploader.clear() ⇒ <code>[ax5uploader](#ax5uploader)</code>
clear uploadedFiles

**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  
<a name="ax5uploader.removeFile"></a>

### ax5uploader.removeFile(_index) ⇒ <code>[ax5uploader](#ax5uploader)</code>
Removes the object corresponding to the index passed to the argument from uploadedFiles.

**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  

| Param | Type |
| --- | --- |
| _index | <code>Number</code> | 

**Example**  
```js
// The actual file is not deleted
upload1.removeFile(fileIndex);
```
<a name="ax5uploader.removeFileAll"></a>

### ax5uploader.removeFileAll() ⇒ <code>[ax5uploader](#ax5uploader)</code>
Empty uploadedFiles

**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  
**Example**  
```js

```
<a name="ax5uploader.selectFile"></a>

### ax5uploader.selectFile() ⇒ <code>Boolean</code>
**Kind**: static method of <code>[ax5uploader](#ax5uploader)</code>  
