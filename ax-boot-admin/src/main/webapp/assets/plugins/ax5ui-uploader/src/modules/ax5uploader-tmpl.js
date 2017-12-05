// ax5.ui.uploader.tmpl
(function () {

    let UPLOADER = ax5.ui.uploader;

    let uploadProgress = function (columnKeys) {
        return `
        `;
    };

    let inputFile = function (columnKeys) {
        return `<input type="file" data-ax5uploader-input="{{instanceId}}" name="{{name}}" {{#multiple}}multiple{{/multiple}} accept="{{accept}}" />`;
    };

    let inputFileForm = function (columnKeys) {
        return `<form data-ax5uploader-form="{{instanceId}}" name="ax5uploader-{{instanceId}}-form" method="post" enctype="multipart/form-data"></form>`;
    };

    let progressBox = function (columnKeys) {
        return `
<div data-ax5uploader-progressbox="{{instanceId}}" class="{{theme}}">
    <div class="ax-progressbox-body">
        <div class="ax-pregressbox-content">
            <div class="progress">
              <div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 0">
                <span class="sr-only">0% Complete</span>
              </div>
            </div>
        </div>
        {{#btns}}
            <div class="ax-progressbox-buttons">
            {{#btns}}
                {{#@each}}
                <button data-pregressbox-btn="{{@key}}" class="btn btn-default {{@value.theme}}">{{@value.label}}</button>
                {{/@each}}
            {{/btns}}
            </div>
        {{/btns}}
    </div>
    <div class="ax-progressbox-arrow"></div>
</div>
`;
    };

    let upoadedBox = function (columnKeys) {
        return `
{{#uploadedFiles}}<div data-ax5uploader-uploaded-item="{{@i}}">
    <div class="uploaded-item-preview">
        {{#${columnKeys.thumbnail}}}<img src="${columnKeys.apiServerUrl}{{${columnKeys.thumbnail}}}">{{/${columnKeys.thumbnail}}}
    </div>
    <div class="uploaded-item-holder">
        <div class="uploaded-item-cell" data-uploaded-item-cell="download">{{{icon.download}}}</div>
        <div class="uploaded-item-cell" data-uploaded-item-cell="filename">{{${columnKeys.name}}}</div>
        <div class="uploaded-item-cell" data-uploaded-item-cell="filesize">({{#@fn_get_byte}}{{${columnKeys.size}}}{{/@fn_get_byte}})</div>
        <div class="uploaded-item-cell" data-uploaded-item-cell="delete">{{{icon.delete}}}</div>
    </div>
</div>{{/uploadedFiles}}
{{^uploadedFiles}}
{{#supportFileApi}}{{{lang.supportedHTML5_emptyListMsg}}}{{/supportFileApi}}
{{^supportFileApi}}{{{lang.emptyListMsg}}}{{/supportFileApi}}
{{/uploadedFiles}}
`;
    };

    UPLOADER.tmpl = {
        "uploadProgress": uploadProgress,
        "inputFile": inputFile,
        "inputFileForm": inputFileForm,
        "progressBox": progressBox,
        "upoadedBox": upoadedBox,

        get: function (tmplName, data, columnKeys) {
            data["@fn_get_byte"] = function() {
                return function (text, render) {
                    return ax5.util.number(render(text), {round: 2, byte: true});
                }
            };
            return ax5.mustache.render(UPLOADER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();