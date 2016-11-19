// ax5.ui.mediaViewer.tmpl
(function () {
    var MEDIAVIEWER = ax5.ui.mediaViewer;

    var frame = function (columnKeys) {
        return `
            <div data-ax5-ui-media-viewer="{{id}}" class="{{theme}}">
                <div data-media-viewer-els="viewer-holder">
                <div data-media-viewer-els="viewer"></div>
                </div>
                <div data-media-viewer-els="viewer-loading">
                <div class="ax5-ui-media-viewer-loading-holder">
                <div class="ax5-ui-media-viewer-loading-cell">
                {{{loading.icon}}}
            {{{loading.text}}}
            </div>
            </div>
            </div>
            {{#media}}
            <div data-media-viewer-els="media-list-holder">
                <div data-media-viewer-els="media-list-prev-handle">{{{prevHandle}}}</div>
            <div data-media-viewer-els="media-list">
                <div data-media-viewer-els="media-list-table">
                {{#list}}
            <div data-media-viewer-els="media-list-table-td">
                {{#image}}
            <div data-media-thumbnail="{{@i}}">
                <img src="{{${columnKeys.poster}}}" data-media-thumbnail-image="{{@i}}" />
                </div>
                {{/image}}
            {{#video}}
            <div data-media-thumbnail="{{@i}}">{{#${columnKeys.poster}}}<img src="{{.}}" data-media-thumbnail-video="{{@i}}" />>{{/${columnKeys.poster}}}{{^${columnKeys.poster}}}<a data-media-thumbnail-video="{{@i}}">{{{media.${columnKeys.poster}}}}</a>{{/${columnKeys.poster}}}</div>
            {{/video}}
            </div>
                {{/list}}
            </div>
                </div>
                <div data-media-viewer-els="media-list-next-handle">{{{nextHandle}}}</div>
                </div>
                {{/media}}
            </div>
        `;
    };

    MEDIAVIEWER.tmpl = {
        "frame": frame,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(MEDIAVIEWER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();