// ax5.ui.calendar.tmpl
(function () {

    const PALETTE = ax5.ui.palette;

    const tmpl_frame = function (columnKeys) {
        return `
<div data-ax5palette-container="root">
    <div data-ax5palette-container="colors"></div>
    <div data-ax5palette-container="controls"></div>
</div>
`;
    };

    const tmpl_colors = function (columnKeys) {
        return `
{{#colors}}
{{#list}}
<div data-ax5palette-color="{{label}}" data-ax5palette-color-index="{{@i}}">
    <div data-panel="color-preview" style="padding:{{preview.cellPadding}}px;width:{{preview.cellWidth}}px;">
        <div data-panel="color-box" style="width:{{preview.width}}px;height:{{preview.height}}px;"><div data-panel="color" style="background-color:{{value}};"></div></div>
    </div>
    <div data-panel="color-label" style="width:{{label.width}}px;">{{label}}</div>
    <div data-panel="color-slider">
        <div data-panel="color-track" style="height:{{slider.trackHeight}}px;background: linear-gradient(90deg, {{_color0value}}, {{_color1value}}, {{_color2value}}); ">
            <div data-panel="color-handle">
                <div data-panel="color-handle-after" style="width:{{slider.handleWidth}}px;height:{{slider.handleWidth}}px;left:{{slider.handleLeft}}px;top:{{slider.handleLeft}}px;"></div>
            </div>
        </div>
    </div>
</div>
{{/list}}
{{/colors}}
`;
    };


    PALETTE.tmpl = {
        "frame": tmpl_frame,
        "colors": tmpl_colors,

        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(PALETTE.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();