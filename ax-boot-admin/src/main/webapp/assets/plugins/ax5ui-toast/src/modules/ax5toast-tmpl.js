// ax5.ui.toast.tmpl
(function () {

    var TOAST = ax5.ui.toast;

    var toastDisplay = function(columnKeys) {
        return `
        <div id="{{toastId}}" data-ax5-ui="toast" class="ax5-ui-toast {{theme}}">
            {{#icon}}
            <div class="ax-toast-icon">{{{.}}}</div>
            {{/icon}}
            <div class="ax-toast-body">{{{msg}}}</div>
            {{#btns}}
            <div class="ax-toast-buttons">
                <div class="ax-button-wrap">
                    {{#@each}}
                    <button type="button" data-ax-toast-btn="{{@key}}" class="btn btn-{{@value.theme}}">{{{@value.label}}}</button>
                    {{/@each}}
                </div>
            </div>
            {{/btns}}
            {{^btns}}
                <a class="ax-toast-close" data-ax-toast-btn="ok">{{{closeIcon}}}</a>
            {{/btns}}
            <div style="clear:both;"></div>
        </div>`;
    };

    TOAST.tmpl = {
        "toastDisplay": toastDisplay,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(TOAST.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();