// ax5.ui.menu.tmpl
(function () {
    var MENU = ax5.ui.menu;
    
    var tmpl = function (columnKeys) {
        return `
        <div class="ax5-ui-menu {{theme}}" {{#width}}style="width:{{width}}px;"{{/width}}>
            <div class="ax-menu-body">
                {{#${columnKeys.items}}}
                    {{^@isMenu}}
                        {{#divide}}
                        <div class="ax-menu-item-divide" data-menu-item-index="{{@i}}"></div>
                        {{/divide}}
                        {{#html}}
                        <div class="ax-menu-item-html" data-menu-item-index="{{@i}}">{{{@html}}}</div>
                        {{/html}}
                    {{/@isMenu}}
                    {{#@isMenu}}
                    <div class="ax-menu-item" data-menu-item-depth="{{@depth}}" data-menu-item-index="{{@i}}" data-menu-item-path="{{@path}}.{{@i}}">
                        <span class="ax-menu-item-cell ax-menu-item-checkbox">
                            {{#check}}
                            <span class="item-checkbox-wrap useCheckBox" {{#checked}}data-item-checked="true"{{/checked}}></span>
                            {{/check}}
                            {{^check}}
                            <span class="item-checkbox-wrap"></span>
                            {{/check}}
                        </span>
                        {{#icon}}
                        <span class="ax-menu-item-cell ax-menu-item-icon" style="width:{{cfg.iconWidth}}px;">{{{.}}}</span>
                        {{/icon}}
                        <span class="ax-menu-item-cell ax-menu-item-label">{{{${columnKeys.label}}}}</span>
                        {{#accelerator}}
                        <span class="ax-menu-item-cell ax-menu-item-accelerator" style="width:{{cfg.acceleratorWidth}}px;"><span class="item-wrap">{{.}}</span></span>
                        {{/accelerator}}
                        {{#@hasChild}}
                        <span class="ax-menu-item-cell ax-menu-item-handle">{{{cfg.icons.arrow}}}</span>
                        {{/@hasChild}}
                    </div>
                    {{/@isMenu}}

                {{/${columnKeys.items}}}
            </div>
            <div class="ax-menu-arrow"></div>
        </div>
        `;
    };
    var tmplMenubar =  function (columnKeys) {
        return `
        <div class="ax5-ui-menubar {{theme}}">
            <div class="ax-menu-body">
                {{#${columnKeys.items}}}
                    {{^@isMenu}}
                        {{#divide}}
                        <div class="ax-menu-item-divide" data-menu-item-index="{{@i}}"></div>
                        {{/divide}}
                        {{#html}}
                        <div class="ax-menu-item-html" data-menu-item-index="{{@i}}">{{{@html}}}</div>
                        {{/html}}
                    {{/@isMenu}}
                    {{#@isMenu}}
                    <div class="ax-menu-item" data-menu-item-index="{{@i}}">
                        {{#icon}}
                        <span class="ax-menu-item-cell ax-menu-item-icon" style="width:{{cfg.iconWidth}}px;">{{{.}}}</span>
                        {{/icon}}
                        <span class="ax-menu-item-cell ax-menu-item-label">{{{${columnKeys.label}}}}</span>
                    </div>
                    {{/@isMenu}}
                {{/${columnKeys.items}}}
            </div>
        </div>
        `;
    };

    MENU.tmpl = {
        "tmpl" : tmpl,
        "tmplMenubar" : tmplMenubar,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(MENU.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();