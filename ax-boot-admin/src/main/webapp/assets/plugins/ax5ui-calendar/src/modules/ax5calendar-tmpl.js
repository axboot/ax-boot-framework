// ax5.ui.calendar.tmpl
(function () {

    var CALENDAR = ax5.ui.calendar;

    var frameTmpl = function (columnKeys) {
        return `
                <div class="ax5-ui-calendar {{theme}}" data-calendar-els="root" onselectstart="return false;">
                    {{#control}}
                    <div class="calendar-control" data-calendar-els="control" style="{{controlCSS}}">
                        <a class="date-move-left" data-calendar-move="left" style="{{controlButtonCSS}}">{{{left}}}</a>
                        <div class="date-display" data-calendar-els="control-display" style="{{controlCSS}}"></div>
                        <a class="date-move-right" data-calendar-move="right" style="{{controlButtonCSS}}">{{{right}}}</a>
                    </div>
                    {{/control}}
                    <div class="calendar-body" data-calendar-els="body"></div>
                </div>
                `;
    };
    var dayTmpl = function (columnKeys) {
        return `
                <table data-calendar-table="day" cellpadding="0" cellspacing="0" style="width:100%;">
                    <thead>
                        <tr>
                        {{#weekNames}}
                            <td class="calendar-col-{{col}}" style="height: {{colHeadHeight}}">
                            {{label}}
                            </td>
                        {{/weekNames}}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {{#list}}    
                            {{#isStartOfWeek}}
                            {{^@first}}
                        </tr>
                        <tr>
                            {{/@first}}
                            {{/isStartOfWeek}}
                            <td class="calendar-col-{{col}}" style="{{itemStyles}}">
                                <a class="calendar-item-day {{addClass}}" data-calendar-item-date="{{thisDate}}">
                                    <span class="addon addon-header"></span>
                                    {{thisDataLabel}}
                                    <span class="addon addon-footer"></span>
                                </a>
                            </td>
                            {{/list}}
                        </tr>
                    </tbody>
                </table>
                `;
    };
    var monthTmpl = function (columnKeys) {
        return `
                <table data-calendar-table="month" cellpadding="0" cellspacing="0" style="width:100%;">
                    <thead>
                        <tr>
                            <td class="calendar-col-0" colspan="3" style="height: {{colHeadHeight}}">
                            {{colHeadLabel}}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {{#list}}    
                            {{#isStartOfRow}}
                            {{^@first}}
                        </tr>
                        <tr>
                            {{/@first}}
                            {{/isStartOfRow}}
                            <td class="calendar-col-{{col}}" style="{{itemStyles}}">
                                <a class="calendar-item-month {{addClass}}" data-calendar-item-month="{{thisMonth}}">
                                    <span class="addon"></span>
                                    {{thisMonthLabel}}
                                    <span class="lunar"></span>
                                </a>
                            </td>
                            {{/list}}
                        </tr>
                    </tbody>
                </table>
                `;
    };
    var yearTmpl = function (columnKeys) {
        return `
                <table data-calendar-table="year" cellpadding="0" cellspacing="0" style="width:100%;">
                    <thead>
                        <tr>
                            <td class="calendar-col-0" colspan="4" style="height: {{colHeadHeight}}">
                            {{colHeadLabel}}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {{#list}}    
                            {{#isStartOfRow}}
                            {{^@first}}
                        </tr>
                        <tr>
                            {{/@first}}
                            {{/isStartOfRow}}
                            <td class="calendar-col-{{col}}" style="{{itemStyles}}">
                                <a class="calendar-item-year {{addClass}}" data-calendar-item-year="{{thisYear}}">
                                    <span class="addon"></span>
                                    {{thisYearLabel}}
                                    <span class="lunar"></span>
                                </a>
                            </td>
                            {{/list}}
                        </tr>
                    </tbody>
                </table>
                `;
    };

    CALENDAR.tmpl = {
        "frameTmpl": frameTmpl,
        "dayTmpl": dayTmpl,
        "monthTmpl": monthTmpl,
        "yearTmpl": yearTmpl,
        
        get: function (tmplName, data, columnKeys) {
            return ax5.mustache.render(CALENDAR.tmpl[tmplName].call(this, columnKeys), data);
        }
    };

})();