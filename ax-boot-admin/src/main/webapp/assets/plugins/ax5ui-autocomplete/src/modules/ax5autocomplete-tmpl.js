// ax5.ui.autocomplete.tmpl
(function () {
    var AUTOCOMPLETE = ax5.ui.autocomplete;
    var U = ax5.util;

    var optionGroup = function (columnKeys) {
        return `
<div class="ax5autocomplete-option-group {{theme}} {{size}}" data-ax5autocomplete-option-group="{{id}}">
    <div class="ax-autocomplete-body">
        <div class="ax-autocomplete-option-group-content" data-els="content"></div>
    </div>
    <div class="ax-autocomplete-arrow"></div> 
</div>
`;
    };

    var autocompleteDisplay = function (columnKeys) {
        return ` 
<input tabindex="-1" type="text" data-input-dummy="" style="display: none;" />
<div class="form-control {{formSize}} ax5autocomplete-display {{theme}}" 
data-ax5autocomplete-display="{{id}}" data-ax5autocomplete-instance="{{instanceId}}">
    <div class="ax5autocomplete-display-table" data-els="display-table">
        <div data-ax5autocomplete-display="label-holder"> 
        <a {{^tabIndex}}{{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}
        data-ax5autocomplete-display="label"
        spellcheck="false"><input type="text"data-ax5autocomplete-display="input" style="border:0px none;" /></a>
        </div>
        <div data-ax5autocomplete-display="addon"> 
            {{#multiple}}{{#reset}}
            <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>
            {{/reset}}{{/multiple}}
        </div>
    </div>
</a>
`;
    };

    var formSelect = function (columnKeys) {
        return `
<select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" multiple="multiple"></select>
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
    <div class="ax-autocomplete-option-item">
            <div class="ax-autocomplete-option-item-holder">
                <span class="ax-autocomplete-option-item-cell ax-autocomplete-option-item-label">
                    {{{lang.loading}}}
                </span>
            </div>
        </div>
{{/waitOptions}}
{{^waitOptions}}
    {{#options}}
        {{^hide}}
        <div class="ax-autocomplete-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{${columnKeys.optionValue}}}" {{#${columnKeys.optionSelected}}}data-option-selected="true"{{/${columnKeys.optionSelected}}}>
            <div class="ax-autocomplete-option-item-holder">
                <span class="ax-autocomplete-option-item-cell ax-autocomplete-option-item-label">{{${columnKeys.optionText}}}</span>
            </div>
        </div>
        {{/hide}}
    {{/options}}
    {{^options}}
        <div class="ax-autocomplete-option-item">
            <div class="ax-autocomplete-option-item-holder">
                <span class="ax-autocomplete-option-item-cell ax-autocomplete-option-item-label">
                    {{{lang.noOptions}}}
                </span>
            </div>
        </div>
    {{/options}}
{{/waitOptions}}
`;
    };

    var label = function (columnKeys) {
        return `{{#selected}}
<div tabindex="-1" data-ax5autocomplete-selected-label="{{@i}}" data-ax5autocomplete-selected-text="{{text}}">
<div data-ax5autocomplete-remove="true" data-ax5autocomplete-remove-index="{{@i}}">{{{removeIcon}}}</div>
<span>{{${columnKeys.optionText}}}</span>
</div>{{/selected}}`;
    };

    AUTOCOMPLETE.tmpl = {
        "autocompleteDisplay": autocompleteDisplay,
        "formSelect": formSelect,
        "formSelectOptions": formSelectOptions,
        "optionGroup": optionGroup,
        "options": options,
        "label": label,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(AUTOCOMPLETE.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();