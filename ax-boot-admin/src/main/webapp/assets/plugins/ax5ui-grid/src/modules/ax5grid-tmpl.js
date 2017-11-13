// ax5.ui.grid.tmpl
(function () {

    const GRID = ax5.ui.grid;

    const main = function () {
        return `<div data-ax5grid-container="root" data-ax5grid-instance="{{instanceId}}">
            <div data-ax5grid-container="hidden">
                <textarea data-ax5grid-form="clipboard"></textarea>
            </div>
            <div data-ax5grid-container="header">
                <div data-ax5grid-panel="aside-header"></div>
                <div data-ax5grid-panel="left-header"></div>
                <div data-ax5grid-panel="header">
                    <div data-ax5grid-panel-scroll="header"></div>
                </div>
                <div data-ax5grid-panel="right-header"></div>
            </div>
            <div data-ax5grid-container="body">
                <div data-ax5grid-panel="top-aside-body"></div>
                <div data-ax5grid-panel="top-left-body"></div>
                <div data-ax5grid-panel="top-body">
                    <div data-ax5grid-panel-scroll="top-body"></div>
                </div>
                <div data-ax5grid-panel="top-right-body"></div>
                <div data-ax5grid-panel="aside-body">
                    <div data-ax5grid-panel-scroll="aside-body"></div>
                </div>
                <div data-ax5grid-panel="left-body">
                    <div data-ax5grid-panel-scroll="left-body"></div>
                </div>
                <div data-ax5grid-panel="body">
                    <div data-ax5grid-panel-scroll="body"></div>
                </div>
                <div data-ax5grid-panel="right-body">
                  <div data-ax5grid-panel-scroll="right-body"></div>
                </div>
                <div data-ax5grid-panel="bottom-aside-body"></div>
                <div data-ax5grid-panel="bottom-left-body"></div>
                <div data-ax5grid-panel="bottom-body">
                    <div data-ax5grid-panel-scroll="bottom-body"></div>
                </div>
                <div data-ax5grid-panel="bottom-right-body"></div>
            </div>
            <div data-ax5grid-container="page">
                <div data-ax5grid-page="holder">
                    <div data-ax5grid-page="navigation"></div>
                    <div data-ax5grid-page="status"></div>
                </div>
            </div>
            <div data-ax5grid-container="scroller">
                <div data-ax5grid-scroller="vertical">
                    <div data-ax5grid-scroller="vertical-bar"></div>    
                </div>
                <div data-ax5grid-scroller="horizontal">
                    <div data-ax5grid-scroller="horizontal-bar"></div>
                </div>
                <div data-ax5grid-scroller="corner"></div>
            </div>
            <div data-ax5grid-resizer="vertical"></div>
            <div data-ax5grid-resizer="horizontal"></div>
        </div>`;
    };

    const page_navigation = function(){
        return `<div data-ax5grid-page-navigation="holder">
            {{#hasPage}}
            <div data-ax5grid-page-navigation="cell">    
                {{#firstIcon}}<button type="button" data-ax5grid-page-move="first">{{{firstIcon}}}</button>{{/firstIcon}}
                <button type="button" data-ax5grid-page-move="prev">{{{prevIcon}}}</button>
            </div>
            <div data-ax5grid-page-navigation="cell-paging">
                {{#@paging}}
                <button type="button" data-ax5grid-page-move="{{pageNo}}" data-ax5grid-page-selected="{{selected}}">{{pageNo}}</button>
                {{/@paging}}
            </div>
            <div data-ax5grid-page-navigation="cell">
                <button type="button" data-ax5grid-page-move="next">{{{nextIcon}}}</button>
                {{#lastIcon}}<button type="button" data-ax5grid-page-move="last">{{{lastIcon}}}</button>{{/lastIcon}}
            </div>
            {{/hasPage}}
        </div>`;
    };

    const page_status = function(){
        return `<span>{{{progress}}} {{fromRowIndex}} - {{toRowIndex}} of {{dataRowCount}} {{#totalElements}}&nbsp; Total {{.}}{{/totalElements}}</span>`;
    };

    GRID.tmpl = {
        "main": main,
        "page_navigation": page_navigation,
        "page_status": page_status,

        get: function (tmplName, data, columnKeys) {
            let template = GRID.tmpl[tmplName].call(this, columnKeys);
            ax5.mustache.parse(template);
            return ax5.mustache.render(template, data);
        }
    };


})();