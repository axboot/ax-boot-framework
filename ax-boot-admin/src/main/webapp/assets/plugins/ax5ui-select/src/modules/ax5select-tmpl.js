// ax5.ui.select.tmpl
(function () {

    var SELECT = ax5.ui.select;

    var optionGroupTmpl = function (columnKeys) {
        return `
<div class="ax5select-option-group {{theme}} {{size}}" data-ax5select-option-group="{{id}}">
    <div class="ax-select-body">
        <div class="ax-select-option-group-content" data-els="content"></div>
    </div>
    <div class="ax-select-arrow"></div> 
</div>
`;
    };
    var tmpl = function (columnKeys) {
            return `
<a {{^tabIndex}}href="#ax5select-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}class="form-control {{formSize}} ax5select-display {{theme}}" 
data-ax5select-display="{{id}}" data-ax5select-instance="{{instanceId}}">
    <div class="ax5select-display-table" data-els="display-table">
        <div data-ax5select-display="label">{{label}}</div>
        <div data-ax5select-display="addon"> 
            {{#multiple}}{{#reset}}
            <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>
            {{/reset}}{{/multiple}}
            {{#icons}}
            <span class="addon-icon-closed">{{clesed}}</span>
            <span class="addon-icon-opened">{{opened}}</span>
            {{/icons}}
            {{^icons}}
            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>
            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>
            {{/icons}}
        </div>
    </div>
    <input type="text" tabindex="-1" data-ax5select-display="input" 
    style="position:absolute;z-index:0;left:0px;top:0px;font-size:1px;opacity: 0;width:1px;border: 0px none;color : transparent;text-indent: -9999em;" />
</a>
`;
        };
    var selectTmpl = function (columnKeys) {
            return `
<select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>
`;
        };
    var optionsTmpl = function (columnKeys) {
            return `
{{#waitOptions}}
    <div class="ax-select-option-item">
            <div class="ax-select-option-item-holder">
                <span class="ax-select-option-item-cell ax-select-option-item-label">
                    {{{lang.loading}}}
                </span>
            </div>
        </div>
{{/waitOptions}}
{{^waitOptions}}
    {{#options}}
        {{#optgroup}}
            <div class="ax-select-option-group">
                <div class="ax-select-option-item-holder">
                    <span class="ax-select-option-group-label">
                        {{{.}}}
                    </span>
                </div>
                {{#options}}
                <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" 
                data-option-value="{{${columnKeys.optionValue}}}" 
                {{#${columnKeys.optionSelected}}}data-option-selected="true"{{/${columnKeys.optionSelected}}}>
                    <div class="ax-select-option-item-holder">
                        {{#multiple}}
                        <span class="ax-select-option-item-cell ax-select-option-item-checkbox">
                            <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>
                        </span>
                        {{/multiple}}
                        <span class="ax-select-option-item-cell ax-select-option-item-label">{{{${columnKeys.optionText}}}}</span>
                    </div>
                </div>
                {{/options}}
            </div>                            
        {{/optgroup}}
        {{^optgroup}}
        <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{${columnKeys.optionValue}}}" {{#${columnKeys.optionSelected}}}data-option-selected="true"{{/${columnKeys.optionSelected}}}>
            <div class="ax-select-option-item-holder">
                {{#multiple}}
                <span class="ax-select-option-item-cell ax-select-option-item-checkbox">
                    <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>
                </span>
                {{/multiple}}
                <span class="ax-select-option-item-cell ax-select-option-item-label">{{{${columnKeys.optionText}}}}</span>
            </div>
        </div>
        {{/optgroup}}
    {{/options}}
    {{^options}}
        <div class="ax-select-option-item">
            <div class="ax-select-option-item-holder">
                <span class="ax-select-option-item-cell ax-select-option-item-label">
                    {{{lang.noOptions}}}
                </span>
            </div>
        </div>
    {{/options}}
{{/waitOptions}}
`;
        };

    SELECT.tmpl = {
        "optionGroupTmpl": optionGroupTmpl,
        "tmpl": tmpl,
        "selectTmpl": selectTmpl,
        "optionsTmpl": optionsTmpl,

        get: function (tmplName, data, columnKeys) {
            return jQuery(ax5.mustache.render(SELECT.tmpl[tmplName].call(this, columnKeys), data));
        }
    };

})();