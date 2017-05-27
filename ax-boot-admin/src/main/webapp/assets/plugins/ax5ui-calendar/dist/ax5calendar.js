"use strict";

// ax5.ui.calendar
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var CALENDAR = void 0;

    UI.addClass({
        className: "calendar"
    }, function () {

        /**
         * @class ax5calendar
         * @classdesc
         * @author tom@axisj.com
         * @logs
         * 2014-06-21 tom : 시작
         * @example
         * ```js
         * ax5.info.months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월"];
         * ax5.info.weekNames = [
         *     {label: "일"},
         *     {label: "월"},
         *     {label: "화"},
         *     {label: "수"},
         *     {label: "목"},
         *     {label: "금"},
         *     {label: "토"}
         * ];
         *
         * var myCalendar = new ax5.ui.calendar({
         *     control: {
         *         left: '≪',
         *         yearTmpl: '%s',
         *         monthTmpl: '%s',
         *         right: '≫',
         *         yearFirst: true
         *     },
         *
         *     dimensions: {
         *         itemPadding: 1,
         *         height: 200
         *     },
         *
         *         target: document.getElementById("calendar-target"),
         *         displayDate: (new Date()),
         *         mode: "day",
         *         selectMode: "day",
         *
         *         marker: (function () {
         *             var marker = {};
         *             marker[_c_date(today, {'return': 'yyyy-MM-dd', 'add': {d: -1}})] = true;
         *             marker[_c_date(today, {'return': 'yyyy-MM-dd', 'add': {d: 0}})] = true;
         *             marker[_c_date(today, {'return': 'yyyy-MM-dd', 'add': {d: 1}})] = true;
         *
        *             return marker;
         *         })(),
         *         onClick: function () {
         *             console.log(myCalendar.getSelection());
         *         },
         *         onStateChanged: function () {
         *             console.log(this);
         *         }
         *         , multipleSelect: 2
         *     });
         * ```
         */
        return function () {
            var self = this,
                cfg = void 0,
                selectableCount = 1;

            this.instanceId = ax5.getGuid();
            this.target = null;
            this.selection = [];
            this.selectionMap = {};
            this.selectableMap = {};
            this.markerMap = {};
            this.printedDay = {
                start: "", end: ""
            };
            this.config = {
                clickEventName: "click",
                theme: 'default',
                startOfWeek: 0,
                mode: 'day', // day|month|year,
                dateFormat: 'yyyy-MM-dd',
                displayDate: new Date(),
                animateTime: 100,
                dimensions: {
                    controlHeight: '40',
                    controlButtonWidth: '40',
                    colHeadHeight: '30',
                    itemPadding: 2
                },
                lang: {
                    yearHeading: "Choose the year",
                    monthHeading: "Choose the month",
                    yearTmpl: "%s",
                    months: ax5.info.months || ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                    dayTmpl: "%s"
                },
                multipleSelect: false,
                selectMode: 'day',
                defaultMarkerTheme: 'holiday',
                defaultPeriodTheme: 'period'
            };

            cfg = this.config;

            var onStateChanged = function onStateChanged(opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
            };
            var getFrame = function getFrame() {
                var data = jQuery.extend(true, {}, cfg, {
                    controlCSS: {},
                    controlButtonCSS: {}
                });

                data.controlButtonCSS["height"] = data.controlCSS["height"] = U.cssNumber(cfg.dimensions.controlHeight);
                data.controlButtonCSS["line-height"] = data.controlCSS["line-height"] = U.cssNumber(cfg.dimensions.controlHeight);
                data.controlButtonCSS["width"] = U.cssNumber(cfg.dimensions.controlHeight);

                data.controlCSS = U.css(data.controlCSS);
                data.controlButtonCSS = U.css(data.controlButtonCSS);

                try {
                    return CALENDAR.tmpl.get.call(this, "frameTmpl", data);
                } finally {
                    data = null;
                }
            };
            var setDisplay = function setDisplay() {
                var myDate = U.date(cfg.displayDate),
                    yy = "",
                    mm = "",
                    yy1,
                    yy2;

                if (cfg.control) {
                    if (cfg.mode == "day" || cfg.mode == "d") {
                        yy = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear()) : myDate.getFullYear();
                        mm = cfg.control.monthTmpl ? cfg.control.monthTmpl.replace('%s', cfg.lang.months[myDate.getMonth()]) : cfg.lang.months[myDate.getMonth()];

                        this.$["control-display"].html(function () {
                            if (cfg.control.yearFirst) {
                                return '<span data-calendar-display="year">' + yy + '</span>' + '<span data-calendar-display="month">' + mm + '</span>';
                            } else {
                                return '<span data-calendar-display="month">' + mm + '</span>' + '<span data-calendar-display="year">' + yy + '</span>';
                            }
                        }());
                    } else if (cfg.mode == "month" || cfg.mode == "m") {
                        yy = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear()) : myDate.getFullYear();
                        this.$["control-display"].html('<span data-calendar-display="year">' + yy + '</span>');
                    } else if (cfg.mode == "year" || cfg.mode == "y") {
                        yy1 = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', myDate.getFullYear() - 10) : myDate.getFullYear() - 10;
                        yy2 = cfg.control.yearTmpl ? cfg.control.yearTmpl.replace('%s', Number(myDate.getFullYear()) + 9) : Number(myDate.getFullYear()) + 9;
                        this.$["control-display"].html(yy1 + ' ~ ' + yy2);
                    }

                    this.$["control-display"].find('[data-calendar-display]').on(cfg.clickEventName, function (e) {
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-calendar-display")) {
                                return true;
                            }
                        }),
                            mode;
                        if (target) {
                            mode = target.getAttribute("data-calendar-display");
                            this.changeMode(mode);
                        }
                        target = null;
                        mode = null;
                    }.bind(this));
                }

                myDate = null;
                yy = null;
                mm = null;
                yy1 = null;
                yy2 = null;
                return this;
            };
            var printDay = function printDay(nowDate) {
                var dotDate = U.date(nowDate),
                    monthStratDate = new Date(dotDate.getFullYear(), dotDate.getMonth(), 1, 12),
                    _today = cfg.displayDate,
                    tableStartDate = function () {
                    var day = monthStratDate.getDay();
                    if (day == 0) day = 7;
                    day -= cfg.startOfWeek;

                    try {
                        return U.date(monthStratDate, { add: { d: -day } });
                    } finally {
                        day = null;
                    }
                }(),
                    loopDate,
                    thisMonth = dotDate.getMonth(),
                    itemStyles = {},
                    i,
                    k,
                    _k,
                    frameWidth = this.$["body"].width(),
                    frameHeight = Math.floor(frameWidth * (6 / 7)),
                    // 1week = 7days, 1month = 6weeks
                data,
                    tmpl;

                if (cfg.dimensions.height) {
                    frameHeight = U.number(cfg.dimensions.height) - U.number(cfg.dimensions.colHeadHeight);
                }

                itemStyles['height'] = Math.floor(frameHeight / 6) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
                itemStyles['line-height'] = itemStyles['height'];
                itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

                data = {
                    weekNames: [].concat(ax5.info.weekNames),
                    list: []
                };

                if (cfg.startOfWeek) {
                    data.weekNames = data.weekNames.concat(data.weekNames.slice(0, cfg.startOfWeek)).splice(cfg.startOfWeek);
                }

                data.weekNames.forEach(function (n) {
                    n.colHeadHeight = U.cssNumber(cfg.dimensions.colHeadHeight);
                });

                loopDate = tableStartDate;
                i = 0;
                while (i < 6) {
                    k = 0;
                    while (k < 7) {
                        _k = (7 + (k - cfg.startOfWeek)) % 7;
                        var thisDate = '' + U.date(loopDate, { "return": cfg.dateFormat }),
                            _date = {
                            'row': i,
                            'col': k,
                            isStartOfWeek: k == 0,
                            thisDate: '' + thisDate,
                            thisDataLabel: cfg.lang.dayTmpl.replace('%s', loopDate.getDate()),
                            itemStyles: U.css(itemStyles),
                            addClass: function () {

                                var classNames = "";

                                if (cfg.selectable) {
                                    if (self.selectableMap[thisDate]) {
                                        classNames += loopDate.getMonth() == thisMonth ? " live" : "";
                                    } else {
                                        classNames += " disable";
                                    }
                                } else {
                                    if (loopDate.getMonth() == thisMonth) {
                                        if (thisDate == U.date(_today, { "return": "yyyyMMdd" })) {
                                            classNames += " focus";
                                        } else {
                                            classNames += " live";
                                        }

                                        if (loopDate.getDay() == 0) {
                                            classNames += " sunday";
                                        }
                                        if (loopDate.getDay() == 6) {
                                            classNames += " saturday";
                                        }
                                    }
                                }

                                return classNames;
                            }() + ' ' + function () {
                                return self.markerMap[thisDate] ? self.markerMap[thisDate].theme || cfg.defaultMarkerTheme : '';
                            }() + ' ' + function () {
                                return self.selectionMap[thisDate] ? "selected-day" : '';
                            }()
                        };
                        data.list.push(_date);

                        k++;
                        loopDate = U.date(loopDate, { add: { d: 1 } });

                        thisDate = null;
                        _date = null;
                    }
                    i++;
                }
                tmpl = CALENDAR.tmpl.get.call(this, "dayTmpl", data);
                this.$["body"].html(tmpl);
                this.$["body"].find('[data-calendar-item-date]').on(cfg.clickEventName, function (e) {
                    e = e || window.event;
                    onclick.call(self, e, 'date');
                    U.stopEvent(e);
                });

                this.printedDay = {
                    start: tableStartDate, end: loopDate
                };

                onStateChanged.call(this, null, {
                    self: this,
                    action: "printDay",
                    printedDay: this.printedDay
                });
                setDisplay.call(this);

                dotDate = null;
                monthStratDate = null;
                _today = null;
                tableStartDate = null;
                loopDate = null;
                thisMonth = null;
                itemStyles = null;
                i = null;
                k = null;
                frameWidth = null;
                frameHeight = null;
                data = null;
                tmpl = null;
            };
            var printMonth = function printMonth(nowDate) {
                var dotDate = U.date(nowDate),
                    nMonth = dotDate.getMonth(),
                    itemStyles = {},
                    i,
                    k,
                    m,
                    tableStartMonth,
                    frameWidth = this.$["body"].width(),
                    frameHeight = Math.floor(frameWidth * (6 / 7)),
                    data,
                    tmpl;

                if (cfg.dimensions.height) {
                    frameHeight = U.number(cfg.dimensions.height) - U.number(cfg.dimensions.colHeadHeight);
                }

                itemStyles['height'] = Math.floor(frameHeight / 4) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
                itemStyles['line-height'] = itemStyles['height'];
                itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

                data = {
                    colHeadHeight: U.cssNumber(cfg.dimensions.colHeadHeight),
                    colHeadLabel: cfg.lang.monthHeading,
                    list: []
                };

                tableStartMonth = 0;
                m = 0;
                i = 0;
                while (i < 4) {
                    k = 0;
                    while (k < 3) {
                        var _month = {
                            row: i,
                            col: k,
                            isStartOfRow: k == 0,
                            thisMonth: dotDate.getFullYear() + '-' + U.setDigit(m + 1, 2) + '-' + U.setDigit(dotDate.getDate(), 2),
                            thisMonthLabel: cfg.lang.months[m],
                            itemStyles: U.css(itemStyles),
                            addClass: function () {
                                if (cfg.selectable) {
                                    return self.selectableMap[m] ? 'live' : 'disable';
                                } else {
                                    return 'live';
                                }
                            }() + ' ' + function () {
                                return m == nMonth ? "focus" : "";
                            }() + ' ' + function () {
                                return self.markerMap[m] ? self.markerMap[m].theme || cfg.defaultMarkerTheme : '';
                            }()
                        };
                        data.list.push(_month);
                        m++;
                        k++;
                        _month = null;
                    }
                    i++;
                }
                tmpl = CALENDAR.tmpl.get.call(this, "monthTmpl", data);
                this.$["body"].html(tmpl);
                this.$["body"].find('[data-calendar-item-month]').on(cfg.clickEventName, function (e) {
                    e = e || window.event;
                    onclick.call(self, e, 'month');
                    U.stopEvent(e);
                });

                this.printedDay = {
                    start: dotDate.getFullYear() + '-' + U.setDigit(tableStartMonth + 1, 2),
                    end: dotDate.getFullYear() + '-' + U.setDigit(m, 2)
                };

                onStateChanged.call(this, null, {
                    self: this,
                    action: "printMonth",
                    printedDay: this.printedDay
                });
                setDisplay.call(this);

                dotDate = null;
                nMonth = null;
                itemStyles = null;
                i = null;
                k = null;
                m = null;
                tableStartMonth = null;
                frameWidth = null;
                frameHeight = null;
                data = null;
                tmpl = null;
            };
            var printYear = function printYear(nowDate) {
                var dotDate = U.date(nowDate),
                    nYear = dotDate.getFullYear(),
                    itemStyles = {},
                    i,
                    k,
                    y,
                    tableStartYear,
                    frameWidth = this.$["body"].width(),
                    frameHeight = Math.floor(frameWidth * (6 / 7)),
                    data,
                    tmpl;

                if (cfg.dimensions.height) {
                    frameHeight = U.number(cfg.dimensions.height) - U.number(cfg.dimensions.colHeadHeight);
                }

                itemStyles['height'] = Math.floor(frameHeight / 5) - U.number(cfg.dimensions.itemPadding) * 2 + 'px';
                itemStyles['line-height'] = itemStyles['height'];
                itemStyles['padding'] = U.cssNumber(cfg.dimensions.itemPadding);

                data = {
                    colHeadHeight: U.cssNumber(cfg.dimensions.colHeadHeight),
                    colHeadLabel: cfg.lang.yearHeading,
                    list: []
                };

                tableStartYear = nYear - 10;
                y = nYear - 10;
                i = 0;
                while (i < 5) {
                    k = 0;
                    while (k < 4) {
                        var _year = {
                            row: i,
                            col: k,
                            isStartOfRow: k == 0,
                            thisYear: y + '-' + U.setDigit(dotDate.getMonth() + 1, 2) + '-' + U.setDigit(dotDate.getDate(), 2),
                            thisYearLabel: cfg.lang.yearTmpl.replace('%s', y),
                            itemStyles: U.css(itemStyles),
                            addClass: function () {
                                if (cfg.selectable) {
                                    return self.selectableMap[y] ? 'live' : 'disable';
                                } else {
                                    return 'live';
                                }
                            }() + ' ' + function () {
                                return y == nYear ? "focus" : "";
                            }() + ' ' + function () {
                                return self.selectableMap[y] ? self.selectableMap[y].theme || cfg.defaultMarkerTheme : '';
                            }()
                        };
                        data.list.push(_year);
                        y++;
                        k++;
                        _year = null;
                    }
                    i++;
                }
                tmpl = CALENDAR.tmpl.get.call(this, "yearTmpl", data);
                this.$["body"].html(tmpl);
                this.$["body"].find('[data-calendar-item-year]').on(cfg.clickEventName, function (e) {
                    e = e || window.event;
                    onclick.call(this, e, 'year');
                    U.stopEvent(e);
                });

                this.printedDay = {
                    start: tableStartYear, end: y - 1
                };

                onStateChanged.call(this, null, {
                    self: this,
                    action: "printYear",
                    printedDay: this.printedDay
                });
                setDisplay.call(this);

                dotDate = null;
                nYear = null;
                itemStyles = null;
                i = null;
                k = null;
                y = null;
                tableStartYear = null;
                frameWidth = null;
                frameHeight = null;
                data = null;
                tmpl = null;
            };
            var onclick = function onclick(e, mode, target, value) {
                var removed, dt, selectable;

                mode = mode || "date";
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-calendar-item-" + mode)) {
                        return true;
                    }
                });
                if (target) {
                    value = target.getAttribute("data-calendar-item-" + mode);

                    dt = U.date(value, { "return": cfg.dateFormat });
                    selectable = true;
                    selectableCount = cfg.multipleSelect ? U.isNumber(cfg.multipleSelect) ? cfg.multipleSelect : 2 : 1;

                    if (cfg.selectable) {
                        if (!self.selectableMap[dt]) selectable = false;
                    }

                    if (mode == "date") {
                        if (selectable) {

                            if (self.selection.length >= selectableCount) {
                                removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                removed.forEach(function (d) {
                                    self.$["body"].find('[data-calendar-item-date="' + U.date(d, { "return": cfg.dateFormat }) + '"]').removeClass("selected-day");
                                });
                            }

                            jQuery(target).addClass("selected-day");
                            self.selection.push(value);

                            if (self.onClick) {
                                self.onClick.call({
                                    self: this, date: value, target: this.target, dateElement: target
                                });
                            }
                        }
                    } else if (mode == "month") {
                        if (cfg.selectMode == "month") {
                            if (selectable) {
                                if (self.selection.length >= selectableCount) {
                                    removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                    removed.forEach(function (d) {
                                        self.$["body"].find('[data-calendar-item-month="' + U.date(d, { "return": 'yyyy-MM-dd' }) + '"]').removeClass("selected-month");
                                    });
                                }

                                jQuery(target).addClass("selected-month");
                                self.selection.push(value);

                                if (self.onClick) {
                                    self.onClick.call({
                                        self: this, date: value, target: this.target, dateElement: target
                                    });
                                }
                            }
                        } else {
                            self.changeMode("day", value);
                        }
                    } else if (mode == "year") {
                        if (cfg.selectMode == "year") {
                            if (selectable) {
                                if (self.selection.length >= selectableCount) {
                                    removed = self.selection.splice(0, self.selection.length - (selectableCount - 1));
                                    removed.forEach(function (d) {
                                        self.$["body"].find('[data-calendar-item-year="' + U.date(d, { "return": 'yyyy-MM-dd' }) + '"]').removeClass("selected-year");
                                    });
                                }

                                jQuery(target).addClass("selected-year");
                                self.selection.push(value);

                                if (self.onClick) {
                                    self.onClick.call({
                                        self: this, date: value, target: this.target, dateElement: target
                                    });
                                }
                            }
                        } else {
                            self.changeMode("month", value);
                        }
                    }
                }

                mode = null;
                target = null;
                value = null;
                removed = null;
                dt = null;
                selectable = null;
            };
            var move = function move(e, target, value) {
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-calendar-move")) {
                        return true;
                    }
                });
                if (target) {
                    value = target.getAttribute("data-calendar-move");
                    if (cfg.mode == "day" || cfg.mode == "d") {
                        if (value == "left") {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { m: -1 } });
                        } else {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { m: 1 } });
                        }
                        printDay.call(this, cfg.displayDate);
                    } else if (cfg.mode == "month" || cfg.mode == "m") {
                        if (value == "left") {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: -1 } });
                        } else {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: 1 } });
                        }
                        printMonth.call(this, cfg.displayDate);
                    } else if (cfg.mode == "year" || cfg.mode == "y") {
                        if (value == "left") {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: -10 } });
                        } else {
                            cfg.displayDate = U.date(cfg.displayDate, { add: { y: 10 } });
                        }
                        printYear.call(this, cfg.displayDate);
                    }
                }

                target = null;
                value = null;
            };
            var applyMarkerMap = function applyMarkerMap() {
                setTimeout(function () {
                    if (cfg.mode === "day" || cfg.mode === "d") {
                        for (var k in this.markerMap) {
                            this.$["body"].find('[data-calendar-item-date="' + k + '"]').addClass(this.markerMap[k].theme || cfg.defaultMarkerTheme);
                        }
                    }
                }.bind(this));
            };
            var applySelectionMap = function applySelectionMap() {
                setTimeout(function () {
                    for (var k in this.selectionMap) {
                        this.$["body"].find('[data-calendar-item-date="' + k + '"]').addClass("selected-day");
                    }
                }.bind(this));
            };
            var applyPeriodMap = function applyPeriodMap() {
                setTimeout(function () {
                    if (cfg.mode === "day" || cfg.mode === "d") {
                        for (var k in this.periodMap) {
                            if (this.periodMap[k].label) {
                                this.$["body"].find('[data-calendar-item-date="' + k + '"]').find(".addon-footer").html(this.periodMap[k].label);
                            }
                            this.$["body"].find('[data-calendar-item-date="' + k + '"]').addClass(this.periodMap[k].theme);
                        }
                    }
                }.bind(this));
            };
            var clearPeriodMap = function clearPeriodMap() {
                if (cfg.mode === "day" || cfg.mode === "d") {
                    for (var k in this.periodMap) {
                        this.$["body"].find('[data-calendar-item-date="' + k + '"]').find(".addon-footer").empty();
                        this.$["body"].find('[data-calendar-item-date="' + k + '"]').removeClass(this.periodMap[k].theme);
                    }
                }
            };

            /**
             * Preferences of calendar UI
             * @method ax5calendar.setConfig
             * @param {Object} config - 클래스 속성값
             * @param {Element|nodelist} config.target
             * @param {String} [config.mode=day|month|year]
             * @param {Function} [config.onClick}
             * @returns {ax5calendar}
             * @example
             * ```js
             * var myCalendar = new ax5.ui.calendar();
             * myCalendar.setConfig({
             *  target: $("#target"),
             *  mode: "day"
             * });
             * ```
             */
            //== class body start
            this.init = function () {
                // after setConfig();

                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;

                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5calendar", "401", "setConfig"));
                }
                this.target = jQuery(cfg.target);

                cfg.displayDate = U.date(cfg.displayDate);
                this.target.html(getFrame.call(this));

                // 파트수집
                this.$ = {
                    "root": this.target.find('[data-calendar-els="root"]'),
                    "control": this.target.find('[data-calendar-els="control"]'),
                    "control-display": this.target.find('[data-calendar-els="control-display"]'),
                    "body": this.target.find('[data-calendar-els="body"]')
                };

                if (cfg.control) {
                    this.$["root"].on(cfg.clickEventName, '[data-calendar-move]', function (e) {
                        move.call(this, e || window.event);
                    }.bind(this));
                }

                // collect selectableMap
                if (cfg.selection) {
                    this.setSelection(cfg.selection, false);
                }
                // collect selectableMap
                if (cfg.selectable) {
                    this.setSelectable(cfg.selectable, false);
                }
                // collect markerMap
                if (cfg.marker) {
                    this.setMarker(cfg.marker, false);
                }

                setTimeout(function () {
                    if (cfg.mode === "day" || cfg.mode === "d") {
                        printDay.call(this, cfg.displayDate);
                    } else if (cfg.mode === "month" || cfg.mode === "m") {
                        printMonth.call(this, cfg.displayDate);
                    } else if (cfg.mode === "year" || cfg.mode === "y") {
                        printYear.call(this, cfg.displayDate);
                    }
                }.bind(this));
            };

            /**
             * @method ax5calendar.changeMode
             * @param {String} mode
             * @param {String} changeDate
             * @returns {ax5calendar}
             */
            this.changeMode = function (mode, changeDate) {
                if (typeof changeDate != "undefined") cfg.displayDate = changeDate;
                if (mode) cfg.mode = mode;

                this.$["body"].removeClass("fadein").addClass("fadeout");
                setTimeout(function () {
                    if (cfg.mode == "day" || cfg.mode == "d") {
                        printDay.call(this, cfg.displayDate);
                    } else if (cfg.mode == "month" || cfg.mode == "m") {
                        printMonth.call(this, cfg.displayDate);
                    } else if (cfg.mode == "year" || cfg.mode == "y") {
                        printYear.call(this, cfg.displayDate);
                    }
                    this.$["body"].removeClass("fadeout").addClass("fadein");
                }.bind(this), cfg.animateTime);

                return this;
            };

            /**
             * @method ax5calendar.setSelection
             * @param {Array} selection
             * @returns {ax5calendar}
             * @example
             * ```
             *
             * ```
             */
            this.setSelection = function () {
                self.selectionMap = {};
                var processor = {
                    'arr': function arr(v, map, count) {
                        map = {};
                        if (!U.isArray(v)) return map;
                        self.selection = v = v.splice(0, count);
                        v.forEach(function (n) {
                            if (U.isDate(n)) n = U.date(n, { 'return': cfg.dateFormat });
                            map[n] = true;
                        });
                        return map;
                    }
                };

                return function (selection, isPrint) {
                    var result = {};
                    selectableCount = cfg.multipleSelect ? U.isNumber(cfg.multipleSelect) ? cfg.multipleSelect : 2 : 1;

                    if (cfg.selection = selection) {
                        if (U.isArray(selection)) {
                            result = processor.arr(selection, {}, selectableCount);
                        } else {
                            return this;
                        }
                    }

                    this.selectionMap = jQuery.extend({}, result);
                    // 변경내용 적용하여 출력

                    if (isPrint !== false) applySelectionMap.call(this);

                    result = null;

                    return this;
                };
            }();

            /**
             * @method ax5calendar.getSelection
             */
            this.getSelection = function () {
                return this.selection;
            };

            /**
             * @method ax5calendar.setSelectable
             */
            this.setSelectable = function () {
                self.selectableMap = {};
                var processor = {
                    'arr': function arr(v, map) {
                        map = {};
                        if (!U.isArray(v)) return map;
                        v.forEach(function (n) {
                            if (U.isDate(n)) n = U.date(n, { 'return': cfg.dateFormat });
                            map[n] = true;
                        });
                        return map;
                    },
                    'obj': function obj(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (v.range) return map;
                        for (var k in v) {
                            map[k] = v[k];
                        }
                        return map;
                    },
                    'range': function range(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (!v.range) return map;

                        v.range.forEach(function (n) {
                            if (U.isDateFormat(n.from) && U.isDateFormat(n.to)) {
                                for (var d = U.date(n.from); d <= U.date(n.to); d.setDate(d.getDate() + 1)) {
                                    map[U.date(d, { "return": cfg.dateFormat })] = true;
                                }
                            } else {
                                for (var i = n.from; i <= n.to; i++) {
                                    map[i] = true;
                                }
                            }
                        });

                        return map;
                    }
                };

                return function (selectable, isPrint) {

                    var key,
                        result = {};

                    if (cfg.selectable = selectable) {
                        if (U.isArray(selectable)) {
                            result = processor.arr(selectable);
                        } else {
                            for (key in processor) {
                                if (selectable[key]) {
                                    result = processor[key](selectable);
                                    break;
                                }
                            }
                            if (Object.keys(result).length === 0) {
                                result = processor.obj(selectable);
                            }
                        }
                    }

                    this.selectableMap = result;
                    // 변경내용 적용하여 출력
                    if (isPrint !== false) this.changeMode();

                    return this;
                };
            }();

            /**
             * @method ax5calendar.setMarker
             */
            this.setMarker = function () {
                self.markerMap = {};
                var processor = {
                    'obj': function obj(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (v.range) return map;
                        for (var k in v) {
                            map[k] = v[k];
                        }

                        v = null;
                        return map;
                    },
                    'range': function range(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (!v.range) return map;

                        v.range.forEach(function (n) {
                            if (U.isDateFormat(n.from) && U.isDateFormat(n.to)) {
                                for (var d = U.date(n.from); d <= U.date(n.to); d.setDate(d.getDate() + 1)) {
                                    map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme, label: n.label };
                                }
                            } else {
                                for (var i = n.from; i <= n.to; i++) {
                                    map[i] = { theme: n.theme, label: n.label };
                                }
                            }
                        });

                        v = null;
                        return map;
                    }
                };

                return function (marker, isApply) {

                    var key,
                        result = {};

                    if (cfg.marker = marker) {
                        for (key in processor) {
                            if (marker[key]) {
                                result = processor[key](marker);
                                break;
                            }
                        }
                        if (Object.keys(result).length === 0) {
                            result = processor.obj(marker);
                        }
                    }

                    this.markerMap = result;
                    // 변경내용 적용하여 출력
                    if (isApply !== false) applyMarkerMap.call(this);
                    return this;
                };
            }();

            /**
             * @method ax5calendar.setPeriod
             */
            this.setPeriod = function () {
                self.periodMap = {};

                var processor = {
                    'range': function range(v, map) {
                        map = {};
                        if (U.isArray(v)) return map;
                        if (!v.range) return map;

                        v.range.forEach(function (n) {
                            if (U.isDateFormat(n.from) && U.isDateFormat(n.to)) {
                                for (var d = new Date(U.date(n.from)); d <= U.date(n.to); d.setDate(d.getDate() + 1)) {
                                    if (d.getTime() == U.date(n.from).getTime()) {
                                        map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme || cfg.defaultPeriodTheme, label: n.fromLabel };
                                    } else if (d.getTime() == U.date(n.to).getTime()) {
                                        map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme || cfg.defaultPeriodTheme, label: n.toLabel };
                                    } else {
                                        map[U.date(d, { "return": cfg.dateFormat })] = { theme: n.theme || cfg.defaultPeriodTheme };
                                    }
                                }
                            }
                        });

                        v = null;
                        return map;
                    }
                };

                return function (period, isApply) {

                    var key,
                        result = {};

                    // 변경내용 적용하여 출력
                    if (isApply !== false) {
                        clearPeriodMap.call(this);
                    }

                    if (cfg.period = period) {
                        result = processor.range(period);
                    }

                    this.periodMap = result;

                    //console.log(this.periodMap);

                    // 변경내용 적용하여 출력
                    if (isApply !== false) {
                        applyPeriodMap.call(this);
                    }
                    return this;
                };
            }();

            // 클래스 생성자
            this.main = function () {

                UI.calendar_instance = UI.calendar_instance || [];
                UI.calendar_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());
    CALENDAR = ax5.ui.calendar;
})();
// ax5.ui.calendar.tmpl
(function () {

    var CALENDAR = ax5.ui.calendar;

    var frameTmpl = function frameTmpl(columnKeys) {
        return "\n                <div class=\"ax5-ui-calendar {{theme}}\" data-calendar-els=\"root\" onselectstart=\"return false;\">\n                    {{#control}}\n                    <div class=\"calendar-control\" data-calendar-els=\"control\" style=\"{{controlCSS}}\">\n                        <a class=\"date-move-left\" data-calendar-move=\"left\" style=\"{{controlButtonCSS}}\">{{{left}}}</a>\n                        <div class=\"date-display\" data-calendar-els=\"control-display\" style=\"{{controlCSS}}\"></div>\n                        <a class=\"date-move-right\" data-calendar-move=\"right\" style=\"{{controlButtonCSS}}\">{{{right}}}</a>\n                    </div>\n                    {{/control}}\n                    <div class=\"calendar-body\" data-calendar-els=\"body\"></div>\n                </div>\n                ";
    };
    var dayTmpl = function dayTmpl(columnKeys) {
        return "\n                <table data-calendar-table=\"day\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                        {{#weekNames}}\n                            <td class=\"calendar-col-{{col}}\" style=\"height: {{colHeadHeight}}\">\n                            {{label}}\n                            </td>\n                        {{/weekNames}}\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfWeek}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfWeek}}\n                            <td class=\"calendar-col-{{col}}\" style=\"{{itemStyles}}\">\n                                <a class=\"calendar-item-day {{addClass}}\" data-calendar-item-date=\"{{thisDate}}\">\n                                    <span class=\"addon addon-header\"></span>\n                                    {{thisDataLabel}}\n                                    <span class=\"addon addon-footer\"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ";
    };
    var monthTmpl = function monthTmpl(columnKeys) {
        return "\n                <table data-calendar-table=\"month\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <td class=\"calendar-col-0\" colspan=\"3\" style=\"height: {{colHeadHeight}}\">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class=\"calendar-col-{{col}}\" style=\"{{itemStyles}}\">\n                                <a class=\"calendar-item-month {{addClass}}\" data-calendar-item-month=\"{{thisMonth}}\">\n                                    <span class=\"addon\"></span>\n                                    {{thisMonthLabel}}\n                                    <span class=\"lunar\"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ";
    };
    var yearTmpl = function yearTmpl(columnKeys) {
        return "\n                <table data-calendar-table=\"year\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">\n                    <thead>\n                        <tr>\n                            <td class=\"calendar-col-0\" colspan=\"4\" style=\"height: {{colHeadHeight}}\">\n                            {{colHeadLabel}}\n                            </td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            {{#list}}    \n                            {{#isStartOfRow}}\n                            {{^@first}}\n                        </tr>\n                        <tr>\n                            {{/@first}}\n                            {{/isStartOfRow}}\n                            <td class=\"calendar-col-{{col}}\" style=\"{{itemStyles}}\">\n                                <a class=\"calendar-item-year {{addClass}}\" data-calendar-item-year=\"{{thisYear}}\">\n                                    <span class=\"addon\"></span>\n                                    {{thisYearLabel}}\n                                    <span class=\"lunar\"></span>\n                                </a>\n                            </td>\n                            {{/list}}\n                        </tr>\n                    </tbody>\n                </table>\n                ";
    };

    CALENDAR.tmpl = {
        "frameTmpl": frameTmpl,
        "dayTmpl": dayTmpl,
        "monthTmpl": monthTmpl,
        "yearTmpl": yearTmpl,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(CALENDAR.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();