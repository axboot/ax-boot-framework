// ax5.ui.combobox.tmpl
(function () {

    var COMBOBOX = ax5.ui.combobox;
    var U = ax5.util;

    var optionGroup = function (columnKeys) {
        return `
            <div class="ax5combobox-option-group {{theme}} {{size}}" data-ax5combobox-option-group="{{id}}">
                <div class="ax-combobox-body">
                    <div class="ax-combobox-option-group-content" data-els="content"></div>
                </div>
                <div class="ax-combobox-arrow"></div> 
            </div>
        `;
    };

    var comboboxDisplay = function (columnKeys) {
        return `
<div class="form-control {{formSize}} ax5combobox-display {{theme}}" 
data-ax5combobox-display="{{id}}" data-ax5combobox-instance="{{instanceId}}">
    <div class="ax5combobox-display-table" data-els="display-table">
        <div data-ax5combobox-display="label-holder"> 
            <a {{^tabIndex}}{{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}
            data-ax5combobox-display="label"
            spellcheck="false"><input type="text"data-ax5combobox-display="input" style="border:0 none;" /></a>
        </div>
        <div data-ax5combobox-display="addon"> 
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
</div>
        `;
    };

    var formSelect = function (columnKeys) {
        return `
            <select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>
        `;
    };

    var formSelectOptions = function (columnKeys) {
        return `
{{#selected}}
<option value="{{${columnKeys.optionValue}}}" selected="true">{{${columnKeys.optionText}}}</option>
{{/selected}}
`;
    };

    var options = function (columnKeys) {
        return `
            {{#waitOptions}}
                <div class="ax-combobox-option-item">
                        <div class="ax-combobox-option-item-holder">
                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">
                                {{{lang.loading}}}
                            </span>
                        </div>
                    </div>
            {{/waitOptions}}
            {{^waitOptions}}
                {{#options}}
                    {{#optgroup}}
                        <div class="ax-combobox-option-group">
                            <div class="ax-combobox-option-item-holder">
                                <span class="ax-combobox-option-group-label">
                                    {{{.}}}
                                </span>
                            </div>
                            {{#options}}
                            {{^hide}}
                            <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" 
                            data-option-value="{{${columnKeys.optionValue}}}" 
                            {{#${columnKeys.optionSelected}}}data-option-selected="true"{{/${columnKeys.optionSelected}}}>
                                <div class="ax-combobox-option-item-holder">
                                    {{#multiple}}
                                    <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">
                                        <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>
                                    </span>
                                    {{/multiple}}
                                    <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{${columnKeys.optionText}}}</span>
                                </div>
                            </div>
                            {{/hide}}
                            {{/options}}
                        </div>                            
                    {{/optgroup}}
                    {{^optgroup}}
                    {{^hide}}
                    <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{${columnKeys.optionValue}}}" {{#${columnKeys.optionSelected}}}data-option-selected="true"{{/${columnKeys.optionSelected}}}>
                        <div class="ax-combobox-option-item-holder">
                            {{#multiple}}
                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">
                                <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>
                            </span>
                            {{/multiple}}
                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{${columnKeys.optionText}}}</span>
                        </div>
                    </div>
                    {{/hide}}
                    {{/optgroup}}
                {{/options}}
                {{^options}}
                    <div class="ax-combobox-option-item">
                        <div class="ax-combobox-option-item-holder">
                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">
                                {{{lang.noOptions}}}
                            </span>
                        </div>
                    </div>
                {{/options}}
            {{/waitOptions}}
        `;
    };

    var label = function (columnKeys) {
        return `{{#selected}}<div tabindex="-1" data-ax5combobox-selected-label="{{@i}}" data-ax5combobox-selected-text="{{text}}"><div data-ax5combobox-remove="true" 
data-ax5combobox-remove-index="{{@i}}">{{{removeIcon}}}</div><span>{{${columnKeys.optionText}}}</span></div>{{/selected}}`;
    };


    COMBOBOX.tmpl = {
        "comboboxDisplay": comboboxDisplay,
        "formSelect": formSelect,
        "formSelectOptions": formSelectOptions,
        "optionGroup": optionGroup,
        "options": options,
        "label": label,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(COMBOBOX.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();