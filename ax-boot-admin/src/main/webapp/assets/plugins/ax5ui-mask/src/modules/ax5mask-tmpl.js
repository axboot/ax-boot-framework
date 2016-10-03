// ax5.ui.mask.tmpl
(function () {

    var MASK = ax5.ui.mask;

    var defaultMask = function(columnKeys) {
        return `
            <div class="ax-mask {{theme}}" id="{{maskId}}">
                <div class="ax-mask-bg"></div>
                <div class="ax-mask-content">
                    <div class="ax-mask-body">
                    {{{body}}}
                    </div>
                </div>
            </div>
        `;
    };

    MASK.tmpl = {
        "defaultMask": defaultMask,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(MASK.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();