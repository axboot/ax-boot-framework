"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var GRID = void 0;

    UI.addClass({
        className: "grid"
    }, function () {
        /**
         * @class ax5grid
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         * var myGrid = new ax5.ui.grid();
         * ```
         */
        return function () {
            var self = this,
                cfg = void 0,
                ctrlKeys = {
                "33": "KEY_PAGEUP",
                "34": "KEY_PAGEDOWN",
                "35": "KEY_END",
                "36": "KEY_HOME",
                "37": "KEY_LEFT",
                "38": "KEY_UP",
                "39": "KEY_RIGHT",
                "40": "KEY_DOWN"
            };

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                debounceTime: 250,
                appendDebouncer: null,
                appendDebounceTimes: 0,
                appendProgressIcon: '...',
                appendProgress: false,

                // 틀고정 속성
                frozenColumnIndex: 0,
                frozenRowIndex: 0,
                showLineNumber: false,
                showRowSelector: false,
                multipleSelect: true,
                virtualScrollY: true,
                virtualScrollX: true,
                headerSelect: true,

                // 스크롤될 때 body 페인팅 딜레이를 주어 성능이 좋은 않은 브라우저에서 반응을 빠르게 할 때 사용하는 옵션들
                virtualScrollYCountMargin: 0,
                virtualScrollAccelerated: true,
                virtualScrollAcceleratedDelayTime: 10,

                height: 0,
                columnMinWidth: 100,
                lineNumberColumnWidth: 30,
                rowSelectorColumnWidth: 26,
                sortable: undefined,
                remoteSort: false,

                header: {
                    display: true,
                    align: false,
                    columnHeight: 26,
                    columnPadding: 3,
                    columnBorderWidth: 1,
                    selector: true
                },
                body: {
                    align: false,
                    columnHeight: 26,
                    columnPadding: 3,
                    columnBorderWidth: 1,
                    grouping: false,
                    mergeCells: false
                },
                rightSum: false,
                footSum: false,
                page: {
                    height: 25,
                    display: true,
                    statusDisplay: true,
                    navigationItemCount: 5
                },
                scroller: {
                    size: 15,
                    barMinSize: 15,
                    trackPadding: 4
                },
                columnKeys: {
                    selected: '__selected__',
                    modified: '__modified__',
                    deleted: '__deleted__',
                    disableSelection: '__disable_selection__'
                },
                tree: {
                    use: false,
                    hashDigit: 8,
                    indentWidth: 10,
                    arrowWidth: 15,
                    iconWidth: 18,
                    icons: {
                        openedArrow: '▾',
                        collapsedArrow: '▸',
                        groupIcon: '⊚',
                        collapsedGroupIcon: '⊚',
                        itemIcon: '⊙'
                    },
                    columnKeys: {
                        parentKey: "pid",
                        selfKey: "id",
                        collapse: "collapse",
                        hidden: "hidden",
                        parentHash: "__hp__",
                        selfHash: "__hs__",
                        children: "__children__",
                        depth: "__depth__"
                    }
                }
            };
            this.xvar = {
                bodyTrHeight: 0, // 한줄의 높이
                scrollContentWidth: 0, // 스크롤 될 내용물의 너비 (스크롤 될 내용물 : panel['body-scroll'] 안에 컬럼이 있는)
                scrollContentHeight: 0, // 스크롤 된 내용물의 높이
                scrollTimer: null
            };

            // 그리드 데이터셋
            this.columns = []; // config.columns에서 복제된 오브젝트
            this.colGroup = []; // columns를 table태그로 출력하기 좋게 변환한 오브젝트
            this.footSumColumns = [];
            this.bodyGrouping = {};

            this.list = []; // 그리드의 데이터
            this.proxyList = null; // 그리드 데이터의 대리자
            this.page = null; // 그리드의 페이지 정보
            this.selectedDataIndexs = [];
            this.deletedList = [];
            this.sortInfo = {}; // 그리드의 헤더 정렬 정보
            this.focusedColumn = {}; // 그리드 바디의 포커스된 셀 정보
            this.selectedColumn = {}; // 그리드 바디의 선택된 셀 정보
            this.isInlineEditing = false;
            this.inlineEditing = {};
            this.listIndexMap = {}; // tree데이터 사용시 데이터 인덱싱 맵
            this.contextMenu = null; // contentMenu 의 인스턴스

            // header
            this.headerTable = {};
            this.leftHeaderData = {};
            this.headerData = {};
            this.rightHeaderData = {};

            // body
            this.bodyRowTable = {};
            this.leftBodyRowData = {};
            this.bodyRowData = {};
            this.rightBodyRowData = {};
            this.bodyRowMap = {};

            this.bodyGroupingTable = {};
            this.leftBodyGroupingData = {};
            this.bodyGroupingData = {};
            this.rightBodyGroupingData = {};
            this.bodyGroupingMap = {};

            // footSum
            this.footSumTable = {}; // footSum의 출력레이아웃
            this.leftFootSumData = {}; // frozenColumnIndex 를 기준으로 나누어진 출력 레이아웃 왼쪽
            this.footSumData = {}; // frozenColumnIndex 를 기준으로 나누어진 출력 레이아웃 오른쪽
            this.needToPaintSum = true; // 데이터 셋이 변경되어 summary 변경 필요여부

            cfg = this.config;

            var initGrid = function initGrid() {
                // 그리드 템플릿에 전달하고자 하는 데이터를 정리합시다.

                var data = {
                    instanceId: this.id
                };

                this.$target.html(GRID.tmpl.get("main", data));

                // 그리드 패널 프레임의 각 엘리먼트를 캐쉬합시다.
                this.$ = {
                    "container": {
                        "hidden": this.$target.find('[data-ax5grid-container="hidden"]'),
                        "root": this.$target.find('[data-ax5grid-container="root"]'),
                        "header": this.$target.find('[data-ax5grid-container="header"]'),
                        "body": this.$target.find('[data-ax5grid-container="body"]'),
                        "page": this.$target.find('[data-ax5grid-container="page"]'),
                        "scroller": this.$target.find('[data-ax5grid-container="scroller"]')
                    },
                    "panel": {
                        "aside-header": this.$target.find('[data-ax5grid-panel="aside-header"]'),
                        "left-header": this.$target.find('[data-ax5grid-panel="left-header"]'),
                        "header": this.$target.find('[data-ax5grid-panel="header"]'),
                        "header-scroll": this.$target.find('[data-ax5grid-panel-scroll="header"]'),
                        "right-header": this.$target.find('[data-ax5grid-panel="right-header"]'),
                        "top-aside-body": this.$target.find('[data-ax5grid-panel="top-aside-body"]'),
                        "top-left-body": this.$target.find('[data-ax5grid-panel="top-left-body"]'),
                        "top-body": this.$target.find('[data-ax5grid-panel="top-body"]'),
                        "top-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="top-body"]'),
                        "top-right-body": this.$target.find('[data-ax5grid-panel="top-right-body"]'),
                        "aside-body": this.$target.find('[data-ax5grid-panel="aside-body"]'),
                        "aside-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="aside-body"]'),
                        "left-body": this.$target.find('[data-ax5grid-panel="left-body"]'),
                        "left-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="left-body"]'),
                        "body": this.$target.find('[data-ax5grid-panel="body"]'),
                        "body-scroll": this.$target.find('[data-ax5grid-panel-scroll="body"]'),
                        "right-body": this.$target.find('[data-ax5grid-panel="right-body"]'),
                        "right-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="right-body"]'),
                        "bottom-aside-body": this.$target.find('[data-ax5grid-panel="bottom-aside-body"]'),
                        "bottom-left-body": this.$target.find('[data-ax5grid-panel="bottom-left-body"]'),
                        "bottom-body": this.$target.find('[data-ax5grid-panel="bottom-body"]'),
                        "bottom-body-scroll": this.$target.find('[data-ax5grid-panel-scroll="bottom-body"]'),
                        "bottom-right-body": this.$target.find('[data-ax5grid-panel="bottom-right-body"]')
                    },
                    "livePanelKeys": [], // 현재 사용중인 패널들 (grid-body repaint에서 수집하여 처리)
                    "scroller": {
                        "vertical": this.$target.find('[data-ax5grid-scroller="vertical"]'),
                        "vertical-bar": this.$target.find('[data-ax5grid-scroller="vertical-bar"]'),
                        "horizontal": this.$target.find('[data-ax5grid-scroller="horizontal"]'),
                        "horizontal-bar": this.$target.find('[data-ax5grid-scroller="horizontal-bar"]'),
                        "corner": this.$target.find('[data-ax5grid-scroller="corner"]')
                    },
                    "page": {
                        "navigation": this.$target.find('[data-ax5grid-page="navigation"]'),
                        "status": this.$target.find('[data-ax5grid-page="status"]')
                    },
                    "form": {
                        "clipboard": this.$target.find('[data-ax5grid-form="clipboard"]')
                    },
                    "resizer": {
                        "vertical": this.$target.find('[data-ax5grid-resizer="vertical"]'),
                        "horizontal": this.$target.find('[data-ax5grid-resizer="horizontal"]')
                    }
                };

                this.$["container"]["root"].css({ height: this.config.height || this.config._height });

                return this;
            };
            var initColumns = function initColumns(_columns) {
                if (!U.isArray(_columns)) _columns = [];
                this.columns = U.deepCopy(_columns);

                this.headerTable = GRID.util.makeHeaderTable.call(this, this.columns);
                this.xvar.frozenColumnIndex = cfg.frozenColumnIndex || 0;

                this.bodyRowTable = GRID.util.makeBodyRowTable.call(this, this.columns);
                this.bodyRowMap = GRID.util.makeBodyRowMap.call(this, this.bodyRowTable);
                // 바디에 표현될 한줄의 높이를 계산합니다.
                this.xvar.bodyTrHeight = this.bodyRowTable.rows.length * this.config.body.columnHeight;

                var colGroupMap = {};
                for (var r = 0, rl = this.headerTable.rows.length; r < rl; r++) {
                    var row = this.headerTable.rows[r];
                    for (var c = 0, cl = row.cols.length; c < cl; c++) {
                        colGroupMap[row.cols[c].colIndex] = jQuery.extend({}, row.cols[c]);
                    }
                }

                this.colGroup = [];
                for (var k in colGroupMap) {
                    this.colGroup.push(colGroupMap[k]);
                }

                return this;
            };
            var onResetColumns = function onResetColumns() {
                initColumns.call(this, this.config.columns);
                resetColGroupWidth.call(this);
                if (this.config.footSum) {
                    initFootSum.call(this, this.config.footSum);
                    this.needToPaintSum = true;
                }
                if (this.config.body.grouping) initBodyGroup.call(this, this.config.body.grouping);
                alignGrid.call(this, true);
                GRID.header.repaint.call(this, true);
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);
            };
            var resetColGroupWidth = function resetColGroupWidth() {
                /// !! 그리드 target의 크기가 변경되면 이 함수를 호출하려 this.colGroup의 _width 값을 재 계산 하여야 함. [tom]
                var CT_WIDTH = this.$["container"]["root"].width() - function () {
                    var width = 0;
                    if (cfg.showLineNumber) width += cfg.lineNumberColumnWidth;
                    if (cfg.showRowSelector) width += cfg.rowSelectorColumnWidth;
                    width += cfg.scroller.size;
                    return width;
                }(),
                    totalWidth = 0,
                    computedWidth = void 0,
                    autoWidthColgroupIndexs = [],
                    colGroup = this.colGroup,
                    i = void 0,
                    l = void 0;

                for (i = 0, l = colGroup.length; i < l; i++) {
                    if (U.isNumber(colGroup[i].width)) {
                        totalWidth += colGroup[i]._width = colGroup[i].width;
                    } else if (colGroup[i].width === "*") {
                        autoWidthColgroupIndexs.push(i);
                    } else if (U.right(colGroup[i].width, 1) === "%") {
                        totalWidth += colGroup[i]._width = CT_WIDTH * U.left(colGroup[i].width, "%") / 100;
                    }
                }
                if (autoWidthColgroupIndexs.length > 0) {
                    computedWidth = (CT_WIDTH - totalWidth) / autoWidthColgroupIndexs.length;
                    for (i = 0, l = autoWidthColgroupIndexs.length; i < l; i++) {
                        colGroup[autoWidthColgroupIndexs[i]]._width = computedWidth;
                    }
                }
            };
            var initFootSum = function initFootSum(_footSum) {
                if (U.isArray(_footSum)) {
                    this.footSumTable = GRID.util.makeFootSumTable.call(this, this.footSumColumns = _footSum);
                } else {
                    this.footSumColumns = [];
                    this.footSumTable = {};
                }
            };
            var initBodyGroup = function initBodyGroup(_grouping) {
                var grouping = jQuery.extend({}, _grouping);
                if ("by" in grouping && "columns" in grouping) {
                    this.bodyGrouping = {
                        by: grouping.by,
                        columns: grouping.columns
                    };
                    this.bodyGroupingTable = GRID.util.makeBodyGroupingTable.call(this, this.bodyGrouping.columns);
                    this.sortInfo = function () {
                        var sortInfo = {};
                        for (var k = 0, kl = this.bodyGrouping.by.length; k < kl; k++) {
                            sortInfo[this.bodyGrouping.by[k]] = {
                                orderBy: "asc",
                                seq: k,
                                fixed: true
                            };
                            for (var c = 0, cl = this.colGroup.length; c < cl; c++) {
                                if (this.colGroup[c].key === this.bodyGrouping.by[k]) {
                                    this.colGroup[c].sort = "asc";
                                    this.colGroup[c].sortFixed = true;
                                }
                            }
                        }
                        return sortInfo;
                    }.call(this);
                } else {
                    cfg.body.grouping = false;
                }
            };
            var alignGrid = function alignGrid(_isFirst) {
                var list = this.proxyList ? this.proxyList : this.list;
                // 대상이 크기가 컬럼의 최소 크기 보다 작업 금지
                if (Math.min(this.$target.innerWidth(), this.$target.innerHeight()) < 5) {
                    return false;
                }

                if (!this.config.height) {
                    this.$["container"]["root"].css({ height: this.config._height = this.$target.height() });
                }

                var CT_WIDTH = this.$["container"]["root"].width(),
                    CT_HEIGHT = this.$["container"]["root"].height(),
                    CT_INNER_WIDTH = CT_WIDTH,
                    CT_INNER_HEIGHT = CT_HEIGHT,
                    asidePanelWidth = cfg.asidePanelWidth = function () {
                    var width = 0;
                    if (cfg.showLineNumber) width += cfg.lineNumberColumnWidth;
                    if (cfg.showRowSelector) width += cfg.rowSelectorColumnWidth;
                    return width;
                }(),
                    frozenPanelWidth = cfg.frozenPanelWidth = function (colGroup, endIndex) {
                    var width = 0;
                    for (var i = 0, l = endIndex; i < l; i++) {
                        width += colGroup[i]._width;
                    }
                    return width;
                }(this.colGroup, cfg.frozenColumnIndex),
                    verticalScrollerWidth = void 0,
                    horizontalScrollerHeight = void 0,
                    bodyHeight = void 0;

                // todo : 우측 함계컬럼 너비 계산
                var rightPanelWidth = 0,
                    frozenRowHeight = function (bodyTrHeight) {
                    return cfg.frozenRowIndex * bodyTrHeight;
                }(this.xvar.bodyTrHeight),
                    footSumHeight = function (bodyTrHeight) {
                    return this.footSumColumns.length * bodyTrHeight;
                }.call(this, this.xvar.bodyTrHeight),
                    headerHeight = cfg.header.display ? this.headerTable.rows.length * cfg.header.columnHeight : 0,
                    pageHeight = cfg.page.display ? cfg.page.height : 0;

                (function () {
                    verticalScrollerWidth = CT_HEIGHT - headerHeight - pageHeight - footSumHeight < list.length * this.xvar.bodyTrHeight ? this.config.scroller.size : 0;
                    // 남은 너비가 colGroup의 너비보다 넓을때. 수평 스크롤 활성화.
                    horizontalScrollerHeight = function () {
                        var totalColGroupWidth = 0;
                        // aside 빼고 너비
                        // 수직 스크롤이 있으면 또 빼고 비교
                        var bodyWidth = CT_WIDTH - asidePanelWidth - verticalScrollerWidth;
                        for (var i = 0, l = this.colGroup.length; i < l; i++) {
                            totalColGroupWidth += this.colGroup[i]._width;
                        }
                        return totalColGroupWidth > bodyWidth ? this.config.scroller.size : 0;
                    }.call(this);

                    if (horizontalScrollerHeight > 0) {
                        verticalScrollerWidth = CT_HEIGHT - headerHeight - pageHeight - footSumHeight - horizontalScrollerHeight < list.length * this.xvar.bodyTrHeight ? this.config.scroller.size : 0;
                    }
                }).call(this);

                // 수평 너비 결정
                CT_INNER_WIDTH = CT_WIDTH - verticalScrollerWidth;
                // 수직 스크롤러의 높이 결정.
                CT_INNER_HEIGHT = CT_HEIGHT - pageHeight - horizontalScrollerHeight;

                bodyHeight = CT_INNER_HEIGHT - headerHeight;

                var panelDisplayProcess = function panelDisplayProcess(panel, vPosition, hPosition, containerType) {
                    var css = {},
                        isHide = false;

                    switch (hPosition) {
                        case "aside":
                            if (asidePanelWidth === 0) {
                                isHide = true;
                            } else {
                                css["left"] = 0;
                                css["width"] = asidePanelWidth;
                            }
                            break;
                        case "left":
                            if (cfg.frozenColumnIndex === 0) {
                                isHide = true;
                            } else {
                                css["left"] = asidePanelWidth;
                                css["width"] = frozenPanelWidth;
                            }
                            break;
                        case "right":
                            if (!cfg.rightSum) {
                                isHide = true;
                            } else {}
                            break;
                        default:
                            if (containerType !== "page") {
                                if (cfg.frozenColumnIndex === 0) {
                                    css["left"] = asidePanelWidth;
                                } else {
                                    css["left"] = frozenPanelWidth + asidePanelWidth;
                                }
                                css["width"] = CT_INNER_WIDTH - asidePanelWidth - frozenPanelWidth - rightPanelWidth;
                            }
                            break;
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    if (containerType === "body") {
                        switch (vPosition) {
                            case "top":
                                if (cfg.frozenRowIndex == 0) {
                                    isHide = true;
                                } else {
                                    css["top"] = 0;
                                    css["height"] = frozenRowHeight;
                                }
                                break;
                            case "bottom":
                                if (!cfg.footSum) {
                                    isHide = true;
                                } else {
                                    css["top"] = bodyHeight - footSumHeight;
                                    css["height"] = footSumHeight; // footSum height
                                }
                                break;
                            default:
                                css["top"] = frozenRowHeight;
                                css["height"] = bodyHeight - frozenRowHeight - footSumHeight;

                                break;
                        }
                    } else if (containerType === "header") {
                        css["height"] = headerHeight;
                    } else if (containerType === "page") {
                        if (pageHeight == 0) {
                            isHide = true;
                        } else {
                            css["height"] = pageHeight;
                        }
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    panel.show().css(css);
                    return this;
                };
                var scrollerDisplayProcess = function scrollerDisplayProcess(panel, scrollerWidth, scrollerHeight, containerType) {
                    var css = {},
                        isHide = false;

                    switch (containerType) {
                        case "vertical":
                            if (scrollerWidth > 0) {
                                css["width"] = scrollerWidth;
                                css["height"] = CT_INNER_HEIGHT;
                                css["bottom"] = scrollerHeight + pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "horizontal":
                            if (scrollerHeight > 0) {
                                css["width"] = CT_INNER_WIDTH;
                                css["height"] = scrollerHeight;
                                css["right"] = scrollerWidth;
                                css["bottom"] = pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                        case "corner":
                            if (scrollerWidth > 0 && scrollerHeight > 0) {
                                css["width"] = scrollerWidth;
                                css["height"] = scrollerHeight;
                                css["bottom"] = pageHeight;
                            } else {
                                isHide = true;
                            }
                            break;
                    }

                    if (isHide) {
                        panel.hide();
                        // 프로세스 중지
                        return this;
                    }

                    panel.show().css(css);
                };

                this.$["container"]["header"].css({ height: headerHeight });
                this.$["container"]["body"].css({ height: bodyHeight });

                // 각 패널들의 크기 표시여부를 결정합니다
                panelDisplayProcess.call(this, this.$["panel"]["aside-header"], "", "aside", "header");
                panelDisplayProcess.call(this, this.$["panel"]["left-header"], "", "left", "header");
                panelDisplayProcess.call(this, this.$["panel"]["header"], "", "", "header");
                panelDisplayProcess.call(this, this.$["panel"]["right-header"], "", "right", "header");

                panelDisplayProcess.call(this, this.$["panel"]["top-aside-body"], "top", "aside", "body");
                panelDisplayProcess.call(this, this.$["panel"]["top-left-body"], "top", "left", "body");
                panelDisplayProcess.call(this, this.$["panel"]["top-body"], "top", "", "body");
                panelDisplayProcess.call(this, this.$["panel"]["top-right-body"], "top", "right", "body");

                panelDisplayProcess.call(this, this.$["panel"]["aside-body"], "", "aside", "body");
                panelDisplayProcess.call(this, this.$["panel"]["left-body"], "", "left", "body");
                panelDisplayProcess.call(this, this.$["panel"]["body"], "", "", "body");
                panelDisplayProcess.call(this, this.$["panel"]["right-body"], "", "right", "body");

                panelDisplayProcess.call(this, this.$["panel"]["bottom-aside-body"], "bottom", "aside", "body");
                panelDisplayProcess.call(this, this.$["panel"]["bottom-left-body"], "bottom", "left", "body");
                panelDisplayProcess.call(this, this.$["panel"]["bottom-body"], "bottom", "", "body");
                panelDisplayProcess.call(this, this.$["panel"]["bottom-right-body"], "bottom", "right", "body");

                scrollerDisplayProcess.call(this, this.$["scroller"]["vertical"], verticalScrollerWidth, horizontalScrollerHeight, "vertical");
                scrollerDisplayProcess.call(this, this.$["scroller"]["horizontal"], verticalScrollerWidth, horizontalScrollerHeight, "horizontal");
                scrollerDisplayProcess.call(this, this.$["scroller"]["corner"], verticalScrollerWidth, horizontalScrollerHeight, "corner");

                panelDisplayProcess.call(this, this.$["container"]["page"], "", "", "page");

                // 각 패널의 사이즈 결정
                /// 다른 패널의 사이즈 정보가 필요한 경우 여기서 정의해주고 사용함.
                this.xvar.bodyHeight = this.$.panel["body"].height();
                this.xvar.bodyWidth = this.$.panel["body"].width();
                // scrollContentWidth 는 grid-header repaint에서 결정합니다. 까먹지 맙시다. > this.xvar.scrollContentWidth

                return true;
            };
            var sortColumns = function sortColumns(_sortInfo) {
                GRID.header.repaint.call(this);

                if (U.isFunction(this.config.remoteSort)) {
                    var that = { sortInfo: [] };
                    for (var k in _sortInfo) {
                        that.sortInfo.push({
                            key: k,
                            orderBy: _sortInfo[k].orderBy,
                            seq: _sortInfo[k].seq
                        });
                    }
                    that.sortInfo.sort(function (a, b) {
                        return a.seq > b.seq;
                    });
                    this.config.remoteSort.call(that, that);
                } else {
                    if (this.config.body.grouping) {
                        this.list = GRID.data.initData.call(this, GRID.data.sort.call(this, _sortInfo, GRID.data.clearGroupingData.call(this, this.list)));
                    } else {
                        this.list = GRID.data.sort.call(this, _sortInfo, GRID.data.clearGroupingData.call(this, this.list), { resetLineNumber: true });
                    }
                    GRID.body.repaint.call(this, true);
                    GRID.scroller.resize.call(this);
                }
            };
            /// private end

            /**
            /**
             * Preferences of grid UI
             * @method ax5grid.setConfig
             * @param {Object} _config - 클래스 속성값
             * @param {Element} _config.target
             * @param {Number} [_config.frozenColumnIndex=0]
             * @param {Number} [_config.frozenRowIndex=0]
             * @param {Boolean} [_config.showLineNumber=false]
             * @param {Boolean} [_config.showRowSelector=false]
             * @param {Boolean} [_config.multipleSelect=true]
             * @param {Number} [_config.columnMinWidth=100]
             * @param {Number} [_config.lineNumberColumnWidth=30]
             * @param {Number} [_config.rowSelectorColumnWidth=25]
             * @param {Boolean} [_config.sortable=false]
             * @param {Boolean} [_config.multiSort=false]
             * @param {Function} [_config.remoteSort=false]
             * @param {Boolean} [_config.virtualScrollY=true] - 세로축 가상스크롤 처리여부
             * @param {Boolean} [_config.virtualScrollX=true] - 가로축 가상스크롤 처리여부
             * @param {Object} [_config.header]
             * @param {Object} [_config.header.selector=true] - 헤더 checkbox 표시여부
             * @param {String} [_config.header.align]
             * @param {Number} [_config.header.columnHeight=25]
             * @param {Number} [_config.header.columnPadding=3]
             * @param {Number} [_config.header.columnBorderWidth=1]
             * @param {Object} [_config.body]
             * @param {Function} [_config.body.onClick]
             * @param {Function} [_config.body.onDBLClick]
             * @param {Function} [_config.body.onDataChanged]
             * @param {String|Array} [_config.body.mergeCells=false] -
             * @param {String} [_config.body.align]
             * @param {Number} [_config.body.columnHeight=25]
             * @param {Number} [_config.body.columnPadding=3]
             * @param {Number} [_config.body.columnBorderWidth=1]
             * @param {Object} [_config.body.grouping]
             * @param {Array} [_config.body.grouping.by] - list grouping keys
             * @param {Array} [_config.body.grouping.columns] - list grouping columns
             * @param {(String|Function)} [_config.body.trStyleClass]
             *
             * @param {Object} [_config.page]
             * @param {Number} [_config.page.height=25]
             * @param {Boolean} [_config.page.display=true] - grid page display
             * @param {Boolean} [_config.page.statusDisplay=true] - grid status display
             * @param {Number} [_config.page.navigationItemCount=5]
             * @param {Object} [_config.scroller]
             * @param {Number} [_config.scroller.size=15]
             * @param {Number} [_config.scroller.barMinSize=15]
             * @param {Number} [_config.scroller.trackPadding=4]
             * @param {Object} [_config.columnKeys]
             * @param {String} [_config.columnKeys.selected="_SELECTED"]
             * @param {Object[]} _config.columns
             * @param {String} _config.columns[].key
             * @param {String} _config.columns[].label
             * @param {Number} _config.columns[].width
             * @param {(String|Function)} _config.columns[].styleClass
             * @param {(String|Function)} _config.columns[].headerStyleClass
             * @param {Boolean} _config.columns[].enableFilter
             * @param {Boolean} _config.columns[].sortable
             * @param {String} _config.columns[].align
             * @param {(String|Function)} _config.columns[].formatter
             * @param {Object} _config.columns[].editor
             * @param {String} _config.columns[].editor.type - text,number,money,date
             * @param {Object} _config.columns[].editor.config
             * @param {Array} _config.columns[].editor.updateWith
             * @param {Function} _config.columns[].editor.disabled - disable editor
             * @param {Boolean} [_config.columns[].multiLine=false]
             * @param {Object} [_config.tree]
             * @param {Boolean} [_config.tree.use=false] - Whether tree-type data is used
             * @param {Number} [_config.tree.hashDigit=8]
             * @param {Number} [_config.tree.indentWidth=10]
             * @param {Number} [_config.tree.arrowWidth=15]
             * @param {Number} [_config.tree.iconWidth=18]
             * @param {Object} [_config.tree.icons]
             * @param {String} [_config.tree.icons.openedArrow='▾']
             * @param {String} [_config.tree.icons.collapsedArrow='▸']
             * @param {String} [_config.tree.icons.groupIcon='⊚']
             * @param {String} [_config.tree.icons.collapsedGroupIcon='⊚']
             * @param {String} [_config.tree.icons.itemIcon='⊙']
             * @param {Object} [_config.tree.columnKeys]
             * @param {String} [_config.tree.columnKeys.parentKey="pid"]
             * @param {String} [_config.tree.columnKeys.selfKey="id"]
             * @param {String} [_config.tree.columnKeys.collapse="collapse"]
             * @param {String} [_config.tree.columnKeys.hidden="hidden"]
             * @param {String} [_config.tree.columnKeys.parentHash="__hp__"]
             * @param {String} [_config.tree.columnKeys.selfHash="__hs__"]
             * @param {String} [_config.tree.columnKeys.children="__children__"]
             * @param {String} [_config.tree.columnKeys.depth="__depth__"]
             * @returns {ax5grid}
             * @example
             * ```js
             * var firstGrid = new ax5.ui.grid();
             *
             * ax5.ui.grid.formatter["myType"] = function () {
             *     return "myType" + (this.value || "");
             * };
             * ax5.ui.grid.formatter["capital"] = function(){
             *     return (''+this.value).toUpperCase();
             * };
             *
             * ax5.ui.grid.collector["myType"] = function () {
             *     return "myType" + (this.value || "");
             * };
             *
             * var sampleData = [
             *     {a: "A", b: "A01", price: 1000, amount: 12, cost: 12000, saleDt: "2016-08-29", customer: "장기영", saleType: "A"},
             *     {companyJson: {"대표자명":"abcd"}, a: "A", b: "B01", price: 1100, amount: 11, cost: 12100, saleDt: "2016-08-28", customer: "장서우", saleType: "B"},
             *     {companyJson: {"대표자명":"abcd"}, a: "A", b: "C01", price: 1200, amount: 10, cost: 12000, saleDt: "2016-08-27", customer: "이영희", saleType: "A"},
             *     {companyJson: {"대표자명":"위세라"}, a: "A", b: "A01", price: 1300, amount: 8, cost: 10400, saleDt: "2016-08-25", customer: "황인서", saleType: "C"},
             *     {companyJson: {"대표자명":"abcd"}, a: "A", b: "B01", price: 1400, amount: 5, cost: 7000, saleDt: "2016-08-29", customer: "황세진", saleType: "D"},
             *     {companyJson: {"대표자명":"abcd"}, a: "A", b: "A01", price: 1500, amount: 2, cost: 3000, saleDt: "2016-08-26", customer: "이서연", saleType: "A"}
             * ];
             *
             * var gridView = {
             *     initView: function () {
             *         firstGrid.setConfig({
             *             target: $('[data-ax5grid="first-grid"]'),
             *             columns: [
             *                 {
             *                     key: "companyJson['대표자명']",
             *                     label: "필드A",
             *                     width: 80,
             *                     styleClass: function () {
             *                         return "ABC";
             *                     },
             *                     enableFilter: true,
             *                     align: "center",
             *                     editor: {type:"text"}
             *                 },
             *                 {key: "b", label: "필드B", align: "center"},
             *                 {
             *                     key: undefined, label: "필드C", columns: [
             *                         {key: "price", label: "단가", formatter: "money", align: "right"},
             *                         {key: "amount", label: "수량", formatter: "money", align: "right"},
             *                         {key: "cost", label: "금액", align: "right", formatter: "money"}
             *                     ]
             *                 },
             *                 {key: "saleDt", label: "판매일자", align: "center"},
             *                 {key: "customer", label: "고객명"},
             *                 {key: "saleType", label: "판매타입"}
             *             ]
             *         });
             *         return this;
             *     },
             *     setData: function (_pageNo) {
             *         firstGrid.setData(sampleData);
             *         return this;
             *     }
             * };
             *
             * // onClick, onDBLClick, onDataChanged
             * firstGrid.setConfig({
             *      target: $('[data-ax5grid="first-grid"]'),
             *      columns: [...],
             *      body: {
             *          onClick: function(){
             *              console.log(this);
             *          },
             *          onDBLClick: function(){
             *              console.log(this);
             *              // If the column does not have an editor attribute, an event is raised.
             *          },
             *          onDataChanged: function(){
             *              console.log(this);
             *              // If change Data
             *          }
             *      }
             * });
             * ```
             */
            this.init = function (_config) {
                cfg = jQuery.extend(true, {}, cfg, _config);
                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5grid", "401", "init"));
                    return this;
                }

                // 그리드의 이벤트 정의 구간
                this.onStateChanged = cfg.onStateChanged;
                this.onClick = cfg.onClick;
                //this.onDblClick = cfg.onDblClick;
                this.onLoad = cfg.onLoad;
                this.onDataChanged = cfg.body.onDataChanged;
                // todo event에 대한 추가 정의 필요

                this.$target = jQuery(cfg.target);

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        cfg = jQuery.extend(true, cfg, data);
                    }
                }).call(this, U.parseJson(this.$target.attr("data-ax5grid-config"), true));

                var grid = this.config = cfg;

                if (!this.config.height) {
                    this.config._height = this.$target.height();
                }

                if (!this.id) this.id = this.$target.data("data-ax5grid-id");
                if (!this.id) {
                    //this.id = 'ax5grid-' + ax5.getGuid();
                    this.id = 'ax5grid-' + this.instanceId;
                    this.$target.data("data-ax5grid-id", grid.id);
                }

                GRID.data.init.call(this);

                if (this.config.tree.use) {
                    // 트리라면
                    this.sortInfo = {};
                    this.sortInfo[this.config.tree.columnKeys.selfHash] = { orderBy: "asc", seq: 0, fixed: true };
                }

                ///========
                // 그리드를 그리기 위한 가장 기초적인 작업 뼈대와 틀을 준비합니다. 이 메소드는 초기화 시 한번만 호출 되게 됩니다.
                initGrid.call(this);

                // columns데이터를 분석하여 미리 처리해야하는 데이터를 정리합니다.
                initColumns.call(this, grid.columns);
                resetColGroupWidth.call(this);

                // footSum 데이터를 분석하여 미리 처리해야 하는 데이터를 정리
                if (grid.footSum) initFootSum.call(this, grid.footSum);

                // bodyGrouping 데이터를 분석하여 미리 처리해야 하는 데이터를 정리
                if (grid.body.grouping) initBodyGroup.call(this, grid.body.grouping);

                // 그리드의 각 요소의 크기를 맞춤니다.
                alignGrid.call(this, true);

                // columns의 데이터로 header데이터를 만들고
                GRID.header.init.call(this);
                // header를 출력합니다.
                GRID.header.repaint.call(this);

                // columns의 데이터로 body데이터를 만들고
                GRID.body.init.call(this);
                // body를 출력합니다.
                GRID.body.repaint.call(this);

                // scroller
                GRID.scroller.init.call(this);
                GRID.scroller.resize.call(this);

                jQuery(window).bind("resize.ax5grid-" + this.id, function () {
                    alignGrid.call(self);
                    GRID.scroller.resize.call(self);
                    GRID.body.repaint.call(self); // window resize시 repaint 함수 호출
                });

                jQuery(document.body).on("click.ax5grid-" + this.id, function (e) {
                    var isPickerClick = false,
                        target = U.findParentNode(e.target, function (_target) {
                        if (isPickerClick = _target.getAttribute("data-ax5grid-inline-edit-picker")) {
                            return true;
                        }
                        return _target.getAttribute("data-ax5grid-container") === "root";
                    });

                    if (target && target.getAttribute("data-ax5grid-instance") === this.id) {
                        self.focused = true;
                    } else {
                        self.focused = false;
                        GRID.body.blur.call(this);
                    }
                }.bind(this));

                jQuery(window).on("keydown.ax5grid-" + this.instanceId, function (e) {
                    if (self.focused) {
                        if (self.isInlineEditing) {

                            if (e.which == ax5.info.eventKeys.ESC) {
                                self.keyDown("ESC", e.originalEvent);
                            } else if (e.which == ax5.info.eventKeys.RETURN) {
                                self.keyDown("RETURN", e.originalEvent);
                            } else if (e.which == ax5.info.eventKeys.TAB) {
                                self.keyDown("TAB", e.originalEvent);
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.UP) {
                                self.keyDown("RETURN", { shiftKey: true });
                            } else if (e.which == ax5.info.eventKeys.DOWN) {
                                self.keyDown("RETURN", {});
                            }
                        } else {

                            if (e.metaKey || e.ctrlKey) {
                                if (e.which == 67) {
                                    // c
                                    self.copySelect();
                                }
                            } else {
                                if (ctrlKeys[e.which]) {
                                    self.keyDown(ctrlKeys[e.which], e.originalEvent); // 키다운 이벤트 호출
                                    U.stopEvent(e);
                                } else if (e.which == ax5.info.eventKeys.ESC) {
                                    if (self.focused) {
                                        GRID.body.blur.call(self);
                                    }
                                } else if (e.which == ax5.info.eventKeys.RETURN || e.which == ax5.info.eventKeys.SPACE) {
                                    self.keyDown("RETURN", e.originalEvent);
                                } else if (e.which == ax5.info.eventKeys.TAB) {
                                    //self.keyDown("RETURN", e.originalEvent);
                                    U.stopEvent(e);
                                } else if (Object.keys(self.focusedColumn).length) {
                                    /*
                                    self.keyDown("INLINE_EDIT", e.originalEvent);
                                    */
                                }
                            }
                        }
                    }
                });

                jQuery(window).on("keyup.ax5grid-" + this.instanceId, function (e) {
                    if (self.focused) {
                        if (self.isInlineEditing) {} else {
                            if (e.metaKey || e.ctrlKey) {} else {
                                if (ctrlKeys[e.which]) {} else if (e.which == ax5.info.eventKeys.ESC) {} else if (e.which == ax5.info.eventKeys.RETURN || e.which == ax5.info.eventKeys.SPACE) {} else if (e.which == ax5.info.eventKeys.TAB) {} else if (Object.keys(self.focusedColumn).length) {
                                    self.keyDown("INLINE_EDIT", e.originalEvent);
                                }
                            }
                        }
                    }
                });

                // 그리드 레이아웃이 모든 준비를 마친시점에 onLoad존재 여부를 확인하고 호출하여 줍니다.
                setTimeout(function () {
                    if (this.onLoad) {
                        this.onLoad.call({
                            self: this
                        });
                    }
                }.bind(this));
                return this;
            };

            /**
             * align grid size
             * @method ax5grid.align
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.repaint();
             * ```
             */
            this.align = function () {
                if (alignGrid.call(this)) {
                    GRID.body.repaint.call(this);
                    GRID.scroller.resize.call(this);
                }
                return this;
            };

            /**
             * repaint grid
             * @method ax5grid.repaint
             * @return {ax5grid}
             * @example
             * ```js
             * ax5Grid.repaint();
             * ```
             */
            this.repaint = function () {
                GRID.header.repaint.call(this);
                GRID.body.repaint.call(this, true); // 강제로 다시 그리기
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.keyDown
             * @param {String} _keyName
             * @param {Event|Object} _data
             * @return {ax5grid}
             */
            this.keyDown = function () {
                var processor = {
                    "KEY_UP": function KEY_UP() {
                        GRID.body.moveFocus.call(this, "UP");
                    },
                    "KEY_DOWN": function KEY_DOWN() {
                        GRID.body.moveFocus.call(this, "DOWN");
                    },
                    "KEY_LEFT": function KEY_LEFT() {
                        GRID.body.moveFocus.call(this, "LEFT");
                    },
                    "KEY_RIGHT": function KEY_RIGHT() {
                        GRID.body.moveFocus.call(this, "RIGHT");
                    },
                    "KEY_HOME": function KEY_HOME() {
                        GRID.body.moveFocus.call(this, "HOME");
                    },
                    "KEY_END": function KEY_END() {
                        GRID.body.moveFocus.call(this, "END");
                    },
                    "INLINE_EDIT": function INLINE_EDIT(_e) {
                        GRID.body.inlineEdit.active.call(this, this.focusedColumn, _e);
                        if (!/[0-9a-zA-Z]/.test(_e.key)) {
                            U.stopEvent(_e);
                        }
                    },
                    "ESC": function ESC(_e) {
                        GRID.body.inlineEdit.keydown.call(this, "ESC");
                    },
                    "RETURN": function RETURN(_e) {
                        var activeEditLength = 0;
                        for (var columnKey in this.inlineEditing) {
                            activeEditLength++;

                            if (!GRID.body.inlineEdit.keydown.call(this, "RETURN", columnKey)) {
                                return false;
                                U.stopEvent(_e);
                            }
                            // next focus
                            if (activeEditLength == 1) {
                                if (GRID.body.moveFocus.call(this, _e.shiftKey ? "UP" : "DOWN")) {
                                    GRID.body.inlineEdit.keydown.call(this, "RETURN");
                                }
                            }
                        }
                        if (activeEditLength == 0) {
                            GRID.body.inlineEdit.keydown.call(this, "RETURN");
                            U.stopEvent(_e);
                        } else {}
                    },
                    "TAB": function TAB(_e) {

                        var activeEditLength = 0;
                        for (var columnKey in this.inlineEditing) {
                            activeEditLength++;

                            GRID.body.inlineEdit.keydown.call(this, "RETURN", columnKey, { moveFocus: true });
                            // next focus
                            if (activeEditLength == 1) {
                                if (GRID.body.moveFocus.call(this, _e.shiftKey ? "LEFT" : "RIGHT")) {
                                    GRID.body.inlineEdit.keydown.call(this, "RETURN", undefined, { moveFocus: true });
                                }
                            }
                        }
                    }
                };
                return function (_act, _data) {
                    if (_act in processor) processor[_act].call(this, _data);
                    return this;
                };
            }();

            /**
             * @method ax5grid.copySelect
             * @returns {Boolean} copysuccess
             */
            this.copySelect = function () {
                var copysuccess = void 0,
                    $clipBoard = this.$["form"]["clipboard"],
                    copyTextArray = [],
                    copyText = "",
                    _rowIndex = void 0,
                    _colIndex = void 0,
                    _dindex = void 0,
                    _di = 0;

                for (var c in this.selectedColumn) {
                    var _column = this.selectedColumn[c];

                    if (_column) {
                        if (typeof _dindex === "undefined") {
                            _dindex = _column.dindex;
                            _rowIndex = _column.rowIndex;
                            _colIndex = _column.rowIndex;
                        }

                        if (_dindex != _column.dindex || _rowIndex != _column.rowIndex) {
                            _di++;
                        }

                        if (!copyTextArray[_di]) {
                            copyTextArray[_di] = [];
                        }
                        var originalColumn = this.bodyRowMap[_column.rowIndex + "_" + _column.colIndex];
                        if (originalColumn) {
                            if (this.list[_column.dindex].__isGrouping) {
                                copyTextArray[_di].push(this.list[_column.dindex][_column.colIndex]);
                            } else {
                                copyTextArray[_di].push(this.list[_column.dindex][originalColumn.key]);
                            }
                        } else {
                            copyTextArray[_di].push("");
                        }

                        _dindex = _column.dindex;
                        _rowIndex = _column.rowIndex;
                    }
                }

                copyTextArray.forEach(function (r) {
                    copyText += r.join('\t') + "\n";
                });

                $clipBoard.get(0).innerText = copyText;
                $clipBoard.select();

                try {
                    copysuccess = document.execCommand("copy");
                } catch (e) {
                    copysuccess = false;
                }
                return copysuccess;
            };

            /**
             * @method ax5grid.setData
             * @param {Array} _data
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.setData({
             *  list: [],
             *  page: {
             *      currentPage: 0,
             *      pageSize: 50,
             *      totalElements: 500,
             *      totalPages: 100
             *  }
             * });
             *
             * // onlyList
             * ax5Grid.setData([]);
             * ```
             */
            this.setData = function (_data) {
                var isFirstPaint = typeof this.xvar.paintStartRowIndex === "undefined";

                GRID.data.set.call(this, _data);
                GRID.body.repaint.call(this);
                if (!isFirstPaint) GRID.body.scrollTo.call(this, { top: 0 });

                // 가로/세로 스크롤바 show/hide 처리
                alignGrid.call(this);
                // 가로세로 스크롤바의 크기 재 계산.
                GRID.scroller.resize.call(this);
                GRID.page.navigationUpdate.call(this);

                isFirstPaint = null;
                return this;
            };

            /**
             * @method ax5grid.getList
             * @param {String} _type - selected|modified|deleted
             * @returns {Array}
             * @example
             * ```js
             * ax5Grid.getList();
             * ax5Grid.getList("selected");
             * ax5Grid.getList("modified");
             * ax5Grid.getList("deleted");
             * ```
             */
            this.getList = function (_type) {
                return GRID.data.getList.call(this, _type);
            };

            /**
             * @method ax5grid.setHeight
             * @param {Number} _height
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.setHeight(height);
             * ```
             */
            this.setHeight = function (_height) {
                //console.log(this.$target);
                if (_height == "100%") {
                    _height = this.$target.offsetParent().innerHeight();
                }
                this.$target.css({ height: _height });
                this.$["container"]["root"].css({ height: _height });
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.addRow
             * @param {Object} _row
             * @param {Number|String} [_dindex=last]
             * @param {Object} [_options] - options of addRow
             * @param {Boolean} [_options.sort] - sortData
             * @param {Number|String} [_options.focus] - HOME|END|[dindex]
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.addRow($.extend({}, {...}), "first");
             * ax5Grid.addRow($.extend({}, {...}), "last", {focus: "END"});
             * ax5Grid.addRow($.extend({}, {...}), "last", {focus: "HOME"});
             * ax5Grid.addRow($.extend({}, {...}), "last", {focus: 10});
             * ```
             */
            this.addRow = function (_row, _dindex, _options) {
                var _this = this;

                GRID.data.add.call(this, _row, _dindex, _options);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");

                if (_options && _options.focus) {
                    //GRID.body.moveFocus.call(this, (this.config.body.grouping) ? "START" : "END");
                    setTimeout(function () {
                        GRID.body.moveFocus.call(_this, _options.focus);
                    }, 1);
                } else {
                    GRID.scroller.resize.call(this);
                }

                return this;
            };

            /**
             * @method ax5grid.appendToList
             * @param _list
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.appendToList([{},{},{}]);
             * ax5Grid.appendToList([{},{},{}]);
             * ```
             */
            this.appendToList = function (_list) {
                GRID.data.append.call(this, _list, function () {
                    alignGrid.call(this);
                    GRID.body.repaint.call(this);
                    GRID.scroller.resize.call(this);
                }.bind(this));
                return this;
            };

            /**
             * @method ax5grid.removeRow
             * @param {Number|String} [_dindex=last]
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.removeRow();
             * ax5Grid.removeRow("first");
             * ax5Grid.removeRow("last");
             * ax5Grid.removeRow(1);
             * ax5Grid.removeRow("selected");
             * ```
             */
            this.removeRow = function (_dindex) {
                GRID.data.remove.call(this, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                GRID.body.moveFocus.call(this, this.config.body.grouping ? "START" : "END");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.updateRow
             * @param {Object} _row
             * @param {Number} _dindex
             * @returns {ax5grid}
             * @example
             * ```js
             * firstGrid.updateRow({price: 100, amount: 100, cost: 10000}, 1);
             * ```
             */
            this.updateRow = function (_row, _dindex) {
                GRID.data.update.call(this, _row, _dindex);
                // todo : mergeCells 옵션에 따라 예외처리

                GRID.body.repaintRow.call(this, _dindex);
                return this;
            };

            /**
             * @method ax5grid.updateChildRows
             * @param {Number} _dindex
             * @param {Object} _updateData
             * @param {Object} [_options]
             * @param {Function} [_options.filter]
             * @returns {ax5grid}
             * @example
             * ```js
             * onDataChanged: function () {
             *      this.self.updateChildRows(this.dindex, {isChecked: this.item.isChecked});
             * }
             *
             * onDataChanged: function () {
             *      this.self.updateChildRows(this.dindex, {isChecked: this.item.isChecked}, {filter: function(){
             *          return this.item.type == "A";
             *      });
             * }
             * ```
             */
            this.updateChildRows = function (_dindex, _updateData, _options) {
                GRID.data.updateChild.call(this, _dindex, _updateData, _options);
                this.xvar.paintStartRowIndex = undefined;
                this.xvar.paintStartColumnIndex = undefined;
                GRID.body.repaint.call(this);
                return this;
            };

            /**
             * @method ax5grid.deleteRow
             * @param {Number|String} _dindex
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.deleteRow("first");
             * ax5Grid.deleteRow("last");
             * ax5Grid.deleteRow(1);
             * ax5Grid.deleteRow("selected");
             * ```
             */
            this.deleteRow = function (_dindex) {
                GRID.data.deleteRow.call(this, _dindex);
                alignGrid.call(this);
                GRID.body.repaint.call(this, "reset");
                // 삭제시엔 포커스 ?
                // GRID.body.moveFocus.call(this, (this.config.body.grouping) ? "START" : "END");
                GRID.scroller.resize.call(this);
                return this;
            };

            /**
             * @method ax5grid.setValue
             * @param _dindex
             * @param _key
             * @param _value
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5Grid.setValue(0, "price", 100);
             * ```
             */
            this.setValue = function (_dindex, _key, _value) {
                // getPanelname;
                // let doindex = (typeof _doindex === "undefined") ? _dindex : _doindex;
                // setValue를 doindex로 처리하는 상황이 아직 발생전으므로 선언만 하고 넘어감
                var doindex = void 0;

                if (GRID.data.setValue.call(this, _dindex, doindex, _key, _value)) {
                    var repaintCell = function repaintCell(_panelName, _rows, __dindex, __doindex, __key, __value) {
                        for (var r = 0, rl = _rows.length; r < rl; r++) {
                            for (var c = 0, cl = _rows[r].cols.length; c < cl; c++) {
                                if (_rows[r].cols[c].key == __key) {
                                    if (this.xvar.frozenRowIndex > __dindex) {
                                        GRID.body.repaintCell.call(this, "top-" + _panelName, __dindex, __doindex, r, c, __value);
                                    } else {
                                        GRID.body.repaintCell.call(this, _panelName + "-scroll", __dindex, __doindex, r, c, __value);
                                    }
                                }
                            }
                        }
                    };

                    repaintCell.call(this, "left-body", this.leftBodyRowData.rows, _dindex, doindex, _key, _value);
                    repaintCell.call(this, "body", this.bodyRowData.rows, _dindex, doindex, _key, _value);
                }

                return this;
            };

            /**
             * @method ax5grid.addColumn
             * @param {Object} _column
             * @param {Number|String} [_cindex=last]
             * @returns {ax5grid}
             */
            this.addColumn = function () {
                var processor = {
                    "first": function first(_column) {
                        this.config.columns = [].concat(_column).concat(this.config.columns);
                    },
                    "last": function last(_column) {
                        this.config.columns = this.config.columns.concat([].concat(_column));
                    }
                };

                return function (_column, _cindex) {
                    if (typeof _column === "undefined") throw '_column must not be null';
                    if (typeof _cindex === "undefined") _cindex = "last";
                    if (_cindex in processor) {
                        processor[_cindex].call(this, _column);
                    } else {
                        if (!U.isNumber(_cindex)) {
                            throw 'invalid argument _cindex';
                        }
                        if (U.isArray(_column)) {
                            for (var _i = 0, _l = _column.length; _i < _l; _i++) {
                                this.config.columns.splice(_cindex + _i, 0, _column[_i]);
                            }
                        } else {
                            this.config.columns.splice(_cindex, 0, _column);
                        }
                    }
                    onResetColumns.call(this); // 컬럼이 변경되었을 때.
                    return this;
                };
            }();

            /**
             * @method ax5grid.removeColumn
             * @param {Number|String} [_cindex=last]
             * @returns {ax5grid}
             */
            this.removeColumn = function () {
                var processor = {
                    "first": function first(_cindex) {
                        this.config.columns.splice(_cindex, 1);
                    },
                    "last": function last() {
                        this.config.columns.splice(this.config.columns.length - 1, 1);
                    }
                };
                return function (_cindex) {
                    if (typeof _cindex === "undefined") _cindex = "last";
                    if (_cindex in processor) {
                        processor[_cindex].call(this, _cindex);
                    } else {
                        if (!U.isNumber(_cindex)) {
                            throw 'invalid argument _cindex';
                        }
                        //
                        this.config.columns.splice(_cindex, 1);
                    }
                    onResetColumns.call(this); // 컬럼이 변경되었을 때.
                    return this;
                };
            }();

            /**
             * @method ax5grid.updateColumn
             * @param {Object} _column
             * @param {Number} _cindex
             * @returns {ax5grid}
             */
            this.updateColumn = function (_column, _cindex) {
                if (!U.isNumber(_cindex)) {
                    throw 'invalid argument _cindex';
                }
                //
                this.config.columns.splice(_cindex, 1, _column);
                onResetColumns.call(this); // 컬럼이 변경되었을 때.
                return this;
            };

            /**
             * @method ax5grid.setColumnWidth
             * @param {Number} _width
             * @param {Number} _cindex
             * @returns {ax5grid}
             */
            this.setColumnWidth = function (_width, _cindex) {
                this.colGroup[this.xvar.columnResizerIndex]._width = _width;
                this.needToPaintSum = true;

                // 컬럼너비 변경사항 적용.
                GRID.header.repaint.call(this);
                GRID.body.repaint.call(this, true);
                GRID.scroller.resize.call(this);

                alignGrid.call(this);
                return this;
            };

            /**
             * @method ax5grid.getColumnSortInfo
             * @returns {Object} sortInfo
             */
            this.getColumnSortInfo = function () {
                var that = { sortInfo: [] };
                for (var k in this.sortInfo) {
                    that.sortInfo.push({
                        key: k,
                        orderBy: this.sortInfo[k].orderBy,
                        seq: this.sortInfo[k].seq
                    });
                }
                that.sortInfo.sort(function (a, b) {
                    return a.seq > b.seq;
                });
                return that.sortInfo;
            };

            /**
             * @method ax5grid.setColumnSort
             * @param {Object} _sortInfo
             * @param {Object} _sortInfo.key
             * @param {Number} _sortInfo.key.seq - seq of sortOrder
             * @param {String} _sortInfo.key.orderBy - "desc"|"asc"
             * @returns {ax5grid}
             * @example
             * ```js
             * ax5grid.setColumnSort({a:{seq:0, orderBy:"desc"}, b:{seq:1, orderBy:"asc"}});
             * ```
             */
            this.setColumnSort = function (_sortInfo) {
                if (typeof _sortInfo !== "undefined") {
                    this.sortInfo = _sortInfo;
                    GRID.header.applySortStatus.call(this, _sortInfo);
                }

                sortColumns.call(this, _sortInfo || this.sortInfo);
                return this;
            };

            /**
             * @method ax5grid.select
             * @param {Number|Object} _selectObject
             * @param {Number} _selectObject.index - index of row
             * @param {Number} _selectObject.rowIndex - rowIndex of columns
             * @param {Number} _selectObject.conIndex - colIndex of columns
             * @param {Object} _options
             * @param {Boolean} _options.selectedClear
             * @param {Boolean} _options.selected
             * @returns {ax5grid}
             * @example
             * ```js
             * firstGrid.select(0);
             * firstGrid.select(0, {selected: true});
             * firstGrid.select(0, {selected: false});
             * firstGrid.select(0, {selectedClear: true});
             * ```
             */
            this.select = function (_selectObject, _options) {
                if (U.isNumber(_selectObject)) {
                    var _dindex2 = _selectObject;

                    if (!this.config.multipleSelect) {
                        this.clearSelect();
                    } else {
                        if (_options && _options.selectedClear) {
                            this.clearSelect();
                        }
                    }

                    GRID.data.select.call(this, _dindex2, undefined, _options && _options.selected);
                    GRID.body.updateRowState.call(this, ["selected"], _dindex2, undefined);
                }
                return this;
            };

            /**
             * @method firstGrid.clickBody
             * @param {Number} _dindex
             * @returns {ax5grid}
             */
            this.clickBody = function (_dindex) {
                GRID.body.click.call(this, _dindex);
                return this;
            };

            /**
             * @method firstGrid.DBLClickBody
             * @param {Number} _dindex
             * @returns {ax5grid}
             */
            this.DBLClickBody = function (_dindex) {
                GRID.body.dblClick.call(this, _dindex);
                return this;
            };

            /**
             * @method ax5grid.clearSelect
             * @returns {ax5grid}
             * @example
             * ```js
             * firstGrid.clearSelect();
             * ```
             */
            this.clearSelect = function () {
                GRID.body.updateRowState.call(this, ["selectedClear"]);
                GRID.data.clearSelect.call(this);
                return this;
            };

            /**
             * @method ax5grid.selectAll
             * @param {Object} _options
             * @param {Boolean} _options.selected
             * @param {Function} _options.filter
             * @returns {ax5grid}
             * @example
             * ```js
             * firstGrid.selectAll();
             * firstGrid.selectAll({selected: true});
             * firstGrid.selectAll({selected: false});
             * firstGrid.selectAll({filter: function(){
             *      return this["b"] == "A01";
             * });
             * firstGrid.selectAll({selected: true, filter: function(){
             *      return this["b"] == "A01";
             * });
             * ```
             */
            this.selectAll = function (_options) {
                GRID.data.selectAll.call(this, _options && _options.selected, _options);
                GRID.body.updateRowStateAll.call(this, ["selected"]);
                return this;
            };

            /**
             * @method ax5grid.exportExcel
             * @param {String} _fileName
             * @returns {ax5grid|String}
             * @example
             * ```js
             * firstGrid.exportExcel("grid-to-excel.xls");
             * console.log(firstGrid.exportExcel());
             * ```
             */
            this.exportExcel = function (_fileName) {
                var table = [];
                table.push('<table border="1">');
                table.push(GRID.header.getExcelString.call(this));
                table.push(GRID.body.getExcelString.call(this));
                table.push('</table>');

                if (typeof _fileName === "undefined") {
                    return table.join('');
                } else {
                    GRID.excel.export.call(this, [table.join('')], _fileName);
                }

                return this;
            };

            /**
             * @method ax5grid.focus
             * @param {String|Number} _pos - UP, DOWN, LEFT, RIGHT, HOME, END
             * @returns {ax5grid}
             * @example
             * ```js
             * firstGrid.focus("UP");
             * firstGrid.focus("DOWN");
             * firstGrid.focus("HOME");
             * firstGrid.focus("END");
             * ```
             */
            this.focus = function (_pos) {

                if (GRID.body.moveFocus.call(this, _pos)) {
                    var focusedColumn = void 0;
                    for (var c in this.focusedColumn) {
                        focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                        break;
                    }
                    if (focusedColumn) {
                        this.select(focusedColumn.dindex, { selectedClear: true });
                    }
                } else {
                    if (typeof this.selectedDataIndexs[0] === "undefined") {
                        this.select(0);
                    } else {
                        var selectedIndex = this.selectedDataIndexs[0];

                        var processor = {
                            "UP": function UP() {
                                if (selectedIndex > 0) {
                                    this.select(selectedIndex - 1, { selectedClear: true });
                                    GRID.body.moveFocus.call(this, selectedIndex - 1);
                                }
                            },
                            "DOWN": function DOWN() {
                                if (selectedIndex < this.list.length - 1) {
                                    this.select(selectedIndex + 1, { selectedClear: true });
                                    GRID.body.moveFocus.call(this, selectedIndex + 1);
                                }
                            },
                            "HOME": function HOME() {
                                this.select(0, { selectedClear: true });
                                GRID.body.moveFocus.call(this, 0);
                            },
                            "END": function END() {
                                this.select(this.list.length - 1, { selectedClear: true });
                                GRID.body.moveFocus.call(this, this.list.length - 1);
                            }
                        };

                        if (_pos in processor) {
                            processor[_pos].call(this);
                        }
                    }
                }
                return this;
            };

            /**
             * @method ax5grid.destroy
             * @returns {null}
             */
            this.destroy = function () {
                var instanceId = this.instanceId;
                this.$target.empty();
                this.list = [];
                UI.grid_instance = ax5.util.filter(UI.grid_instance, function () {
                    return this.instanceId != instanceId;
                });
                return null;
            };

            // 클래스 생성자
            this.main = function () {
                UI.grid_instance = UI.grid_instance || [];
                UI.grid_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());

    GRID = ax5.ui.grid;
})();

// todo : filter
// todo : column reorder
// todo : editor 필수값 속성 지정
// ax5.ui.grid.body
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    var columnSelect = {
        focusClear: function focusClear() {
            var self = this,
                _column = void 0;
            for (var c in self.focusedColumn) {
                _column = self.focusedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').removeAttr('data-ax5grid-column-focused');
                }
            }
            self.focusedColumn = {};
        },
        clear: function clear() {
            var self = this,
                _column = void 0;
            for (var c in self.selectedColumn) {
                _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').removeAttr('data-ax5grid-column-selected');
                }
            }
            self.selectedColumn = {};
        },
        init: function init(column) {
            var self = this;
            if (this.isInlineEditing) {
                for (var editKey in this.inlineEditing) {
                    if (editKey == column.dindex + "_" + column.colIndex + "_" + column.rowIndex) {
                        return this;
                    }
                }
            }

            // focus
            columnSelect.focusClear.call(self);
            self.focusedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = {
                panelName: column.panelName,
                dindex: column.dindex,
                doindex: column.doindex,
                rowIndex: column.rowIndex,
                colIndex: column.colIndex,
                colspan: column.colspan
            };

            // select
            columnSelect.clear.call(self);
            self.xvar.selectedRange = {
                start: [column.dindex, column.rowIndex, column.colIndex, column.colspan - 1],
                end: null
            };
            self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = function (data) {
                if (data) {
                    return false;
                } else {
                    return {
                        panelName: column.panelName,
                        dindex: column.dindex,
                        doindex: column.doindex,
                        rowIndex: column.rowIndex,
                        colIndex: column.colIndex,
                        colspan: column.colspan
                    };
                }
            }(self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex]);

            this.$.panel[column.panelName].find('[data-ax5grid-tr-data-index="' + column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + column.rowIndex + '"][data-ax5grid-column-colindex="' + column.colIndex + '"]').attr('data-ax5grid-column-focused', "true").attr('data-ax5grid-column-selected', "true");

            if (this.isInlineEditing) {
                GRID.body.inlineEdit.deActive.call(this, "RETURN");
            }
        },
        update: function update(column) {
            var self = this;
            var dindex = void 0,
                doindex = void 0,
                colIndex = void 0,
                rowIndex = void 0,
                trl = void 0;

            self.xvar.selectedRange["end"] = [column.dindex, column.rowIndex, column.colIndex, column.colspan - 1];
            columnSelect.clear.call(self);

            var range = {
                r: {
                    s: Math.min(self.xvar.selectedRange["start"][0], self.xvar.selectedRange["end"][0]),
                    e: Math.max(self.xvar.selectedRange["start"][0], self.xvar.selectedRange["end"][0])
                },
                c: {
                    s: Math.min(self.xvar.selectedRange["start"][2], self.xvar.selectedRange["end"][2]),
                    e: Math.max(self.xvar.selectedRange["start"][2] + self.xvar.selectedRange["start"][3], self.xvar.selectedRange["end"][2] + self.xvar.selectedRange["end"][3])
                }
            };

            dindex = range.r.s;
            for (; dindex <= range.r.e; dindex++) {

                trl = this.bodyRowTable.rows.length;
                rowIndex = 0;
                for (; rowIndex < trl; rowIndex++) {
                    colIndex = range.c.s;
                    for (; colIndex <= range.c.e; colIndex++) {
                        var _panels = [],
                            panelName = "";

                        if (self.xvar.frozenRowIndex > dindex) _panels.push("top");
                        if (self.xvar.frozenColumnIndex > colIndex) _panels.push("left");
                        _panels.push("body");
                        if (_panels[0] !== "top") _panels.push("scroll");
                        panelName = _panels.join("-");

                        self.selectedColumn[dindex + "_" + colIndex + "_" + rowIndex] = {
                            panelName: panelName,
                            dindex: dindex,
                            rowIndex: rowIndex,
                            colIndex: colIndex,
                            colspan: column.colspan
                        };

                        _panels = null;
                        panelName = null;
                    }
                }
            }
            dindex = null;
            doindex = null;
            colIndex = null;
            rowIndex = null;

            for (var c in self.selectedColumn) {
                var _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName].find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]').find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]').attr('data-ax5grid-column-selected', 'true');
                }
            }
        }
    };

    var columnSelector = {
        "on": function on(cell) {
            var self = this;

            if (this.inlineEditing[cell.dindex + "_" + cell.colIndex + "_" + cell.rowIndex]) {
                return;
            }

            columnSelect.init.call(self, cell);

            this.$["container"]["body"].on("mousemove.ax5grid-" + this.instanceId, '[data-ax5grid-column-attr="default"]', function (e) {
                if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                    columnSelect.update.call(self, {
                        panelName: this.getAttribute("data-ax5grid-panel-name"),
                        dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                        doindex: Number(this.getAttribute("data-ax5grid-data-o-index")),
                        rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                        colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                        colspan: Number(this.getAttribute("colspan"))
                    });
                    U.stopEvent(e);
                }
            }).on("mouseup.ax5grid-" + this.instanceId, function () {
                columnSelector.off.call(self);
            }).on("mouseleave.ax5grid-" + this.instanceId, function () {
                columnSelector.off.call(self);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {

            this.$["container"]["body"].off("mousemove.ax5grid-" + this.instanceId).off("mouseup.ax5grid-" + this.instanceId).off("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var updateRowState = function updateRowState(_states, _dindex, _doindex, _data) {
        var self = this,
            cfg = this.config,
            processor = {
            "selected": function selected(_dindex, _doindex) {
                if (this.list[_doindex]) {
                    var i = this.$.livePanelKeys.length;
                    while (i--) {
                        this.$.panel[this.$.livePanelKeys[i]].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').attr("data-ax5grid-selected", this.list[_doindex][cfg.columnKeys.selected]);
                    }
                }
            },
            "selectedClear": function selectedClear() {
                var di = this.list.length;
                var pi = void 0;

                if (!this.proxyList) {
                    while (di--) {
                        if (this.list[di][cfg.columnKeys.selected]) {
                            pi = this.$.livePanelKeys.length;
                            while (pi--) {
                                this.$.panel[this.$.livePanelKeys[pi]].find('[data-ax5grid-tr-data-index="' + di + '"]').attr("data-ax5grid-selected", false);
                            }
                        }
                        this.list[di][cfg.columnKeys.selected] = false;
                    }
                } else {
                    while (di--) {
                        this.list[di][cfg.columnKeys.selected] = false;
                    }
                    di = this.proxyList.length;
                    while (di--) {
                        if (this.list[doi][cfg.columnKeys.selected]) {
                            pi = this.$.livePanelKeys.length;
                            while (pi--) {
                                this.$.panel[this.$.livePanelKeys[pi]].find('[data-ax5grid-tr-data-index="' + di + '"]').attr("data-ax5grid-selected", false);
                            }
                        }

                        this.proxyList[di][cfg.columnKeys.selected] = false;
                        var doi = this.proxyList[di].__original_index__;
                    }
                }
            },
            "cellChecked": function cellChecked(_dindex, _doindex, _data) {
                var key = _data.key,
                    rowIndex = _data.rowIndex,
                    colIndex = _data.colIndex;

                var panelName = function () {
                    var _panels = [];
                    if (this.xvar.frozenRowIndex > _dindex) _panels.push("top");
                    if (this.xvar.frozenColumnIndex > colIndex) _panels.push("left");
                    _panels.push("body");
                    if (_panels[0] !== "top") _panels.push("scroll");
                    return _panels.join("-");
                }.call(this);

                this.$.panel[panelName].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').find('[data-ax5grid-column-rowIndex="' + rowIndex + '"][data-ax5grid-column-colIndex="' + colIndex + '"]').find('[data-ax5grid-editor="checkbox"]').attr("data-ax5grid-checked", '' + _data.checked);
            }
        };

        if (typeof _doindex === "undefined") _doindex = _dindex;

        _states.forEach(function (_state) {
            if (!processor[_state]) throw 'invaild state name';
            processor[_state].call(self, _dindex, _doindex, _data);
        });
    };

    var updateRowStateAll = function updateRowStateAll(_states, _data) {
        var self = this,
            cfg = this.config,
            processor = {
            "selected": function selected(_dindex) {
                GRID.body.repaint.call(this, true);
            }
        };

        _states.forEach(function (_state) {
            if (!processor[_state]) throw 'invaild state name';
            processor[_state].call(self, _data);
        });
    };

    var init = function init() {
        var self = this;

        this.$["container"]["body"].on("click", '[data-ax5grid-column-attr]', function (e) {
            var panelName = void 0,
                attr = void 0,
                row = void 0,
                col = void 0,
                dindex = void 0,
                doindex = void 0,
                rowIndex = void 0,
                colIndex = void 0,
                disableSelection = void 0,
                targetClick = {
                "default": function _default(_column) {
                    var column = self.bodyRowMap[_column.rowIndex + "_" + _column.colIndex],
                        that = {
                        self: self,
                        page: self.page,
                        list: self.list,
                        item: self.list[_column.doindex],
                        dindex: _column.dindex,
                        doindex: _column.doindex,
                        rowIndex: _column.rowIndex,
                        colIndex: _column.colIndex,
                        column: column,
                        value: self.list[_column.dindex][column.key]
                    };

                    if (column.editor && column.editor.type == "checkbox") {
                        // todo : GRID.inlineEditor에서 처리 할수 있도록 구문 변경 필요.
                        var value = GRID.data.getValue.call(self, _column.dindex, _column.doindex, column.key),
                            checked = void 0,
                            newValue = void 0;

                        if (column.editor.config && column.editor.config.trueValue) {
                            if (checked = !(value == column.editor.config.trueValue)) {
                                newValue = column.editor.config.trueValue;
                            } else {
                                newValue = column.editor.config.falseValue;
                            }
                        } else {
                            newValue = checked = value == false || value == "false" || value < "1" ? "true" : "false";
                        }

                        GRID.data.setValue.call(self, _column.dindex, _column.doindex, column.key, newValue);

                        updateRowState.call(self, ["cellChecked"], _column.dindex, _column.doindex, {
                            key: column.key, rowIndex: _column.rowIndex, colIndex: _column.colIndex,
                            editorConfig: column.editor.config, checked: checked
                        });
                    } else {
                        if (self.config.body.onClick) {
                            self.config.body.onClick.call(that);
                        }
                    }
                },
                "rowSelector": function rowSelector(_column) {
                    var item = self.list[_column.doindex];
                    if (item[self.config.columnKeys.disableSelection]) {
                        return false;
                    }

                    if (!self.config.multipleSelect && self.selectedDataIndexs[0] !== _column.doindex) {
                        updateRowState.call(self, ["selectedClear"]);
                        GRID.data.clearSelect.call(self);
                    }

                    GRID.data.select.call(self, _column.dindex, _column.doindex, undefined, {
                        internalCall: true
                    });
                    updateRowState.call(self, ["selected"], _column.dindex, _column.doindex);
                },
                "lineNumber": function lineNumber(_column) {},
                "tree-control": function treeControl(_column, _el) {
                    //console.log(_column);
                    toggleCollapse.call(self, _column.dindex, _column.doindex);
                }
            };

            panelName = this.getAttribute("data-ax5grid-panel-name");
            attr = this.getAttribute("data-ax5grid-column-attr");
            row = Number(this.getAttribute("data-ax5grid-column-row"));
            col = Number(this.getAttribute("data-ax5grid-column-col"));
            rowIndex = Number(this.getAttribute("data-ax5grid-column-rowIndex"));
            colIndex = Number(this.getAttribute("data-ax5grid-column-colIndex"));
            dindex = Number(this.getAttribute("data-ax5grid-data-index"));
            doindex = Number(this.getAttribute("data-ax5grid-data-o-index"));

            if (attr in targetClick) {
                targetClick[attr]({
                    panelName: panelName,
                    attr: attr,
                    row: row,
                    col: col,
                    dindex: dindex,
                    doindex: doindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex
                }, this);
            }
        });
        this.$["container"]["body"].on("dblclick", '[data-ax5grid-column-attr]', function (e) {
            var panelName = void 0,
                attr = void 0,
                row = void 0,
                col = void 0,
                dindex = void 0,
                doindex = void 0,
                rowIndex = void 0,
                colIndex = void 0,
                targetDBLClick = {
                "default": function _default(_column) {
                    if (self.isInlineEditing) {
                        for (var columnKey in self.inlineEditing) {
                            if (columnKey == _column.dindex + "_" + _column.colIndex + "_" + _column.rowIndex) {
                                return this;
                            }
                        }
                    }

                    var column = self.bodyRowMap[_column.rowIndex + "_" + _column.colIndex],
                        value = "";
                    if (column) {
                        if (!self.list[dindex].__isGrouping) {
                            value = GRID.data.getValue.call(self, dindex, doindex, column.key);
                        }
                    }

                    var editor = self.colGroup[_column.colIndex].editor;
                    if (U.isObject(editor)) {
                        GRID.body.inlineEdit.active.call(self, self.focusedColumn, e, value);
                    } else {
                        // 더블클릭 실행
                        if (self.config.body.onDBLClick) {
                            var that = {
                                self: self,
                                page: self.page,
                                list: self.list,
                                item: self.list[_column.dindex],
                                dindex: _column.dindex,
                                doindex: _column.doindex,
                                rowIndex: _column.rowIndex,
                                colIndex: _column.colIndex,
                                column: column,
                                value: self.list[_column.dindex][column.key]
                            };
                            self.config.body.onDBLClick.call(that);
                        }
                    }
                },
                "rowSelector": function rowSelector(_column) {},
                "lineNumber": function lineNumber(_column) {}
            };

            panelName = this.getAttribute("data-ax5grid-panel-name");
            attr = this.getAttribute("data-ax5grid-column-attr");
            row = Number(this.getAttribute("data-ax5grid-column-row"));
            col = Number(this.getAttribute("data-ax5grid-column-col"));
            rowIndex = Number(this.getAttribute("data-ax5grid-column-rowIndex"));
            colIndex = Number(this.getAttribute("data-ax5grid-column-colIndex"));
            dindex = Number(this.getAttribute("data-ax5grid-data-index"));
            doindex = Number(this.getAttribute("data-ax5grid-data-o-index"));

            if (attr in targetDBLClick) {
                targetDBLClick[attr]({
                    panelName: panelName,
                    attr: attr,
                    row: row,
                    col: col,
                    dindex: dindex,
                    doindex: doindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex
                });
            }
        });

        if (this.config.contextMenu) {
            this.$["container"]["body"].on("contextmenu", function (e) {
                var target = void 0,
                    dindex = void 0,
                    doindex = void 0,
                    rowIndex = void 0,
                    colIndex = void 0,
                    item = void 0,
                    column = void 0,
                    param = {};

                target = U.findParentNode(e.target, function (t) {
                    if (t.getAttribute("data-ax5grid-column-attr")) {
                        return true;
                    }
                });

                if (target) {
                    // item 찾기
                    rowIndex = Number(target.getAttribute("data-ax5grid-column-rowIndex"));
                    colIndex = Number(target.getAttribute("data-ax5grid-column-colIndex"));
                    dindex = Number(target.getAttribute("data-ax5grid-data-index"));
                    doindex = Number(target.getAttribute("data-ax5grid-data-o-index"));
                    column = self.bodyRowMap[rowIndex + "_" + colIndex];
                    item = self.list[dindex];
                }

                if (!self.contextMenu) {
                    self.contextMenu = new ax5.ui.menu();
                }

                self.contextMenu.setConfig(self.config.contextMenu);

                param = {
                    element: target,
                    dindex: dindex,
                    doindex: doindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex,
                    item: item,
                    column: column,
                    gridSelf: self
                };

                self.contextMenu.popup(e, {
                    filter: function filter() {
                        return self.config.contextMenu.popupFilter.call(this, this, param);
                    },
                    param: param
                });

                U.stopEvent(e.originalEvent);
                target = null;
                dindex = null;
                doindex = null;
                rowIndex = null;
                colIndex = null;
                item = null;
                column = null;
                param = null;
            });
        }

        this.$["container"]["body"].on("mousedown", '[data-ax5grid-column-attr="default"]', function (e) {
            if (self.xvar.touchmoved) return false;
            if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                columnSelector.on.call(self, {
                    panelName: this.getAttribute("data-ax5grid-panel-name"),
                    dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                    doindex: Number(this.getAttribute("data-ax5grid-data-o-index")),
                    rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                    colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                    colspan: Number(this.getAttribute("colspan"))
                });
            }
        }).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });

        resetFrozenColumn.call(this);

        // 그리드 바디에 출력할 여유 카운트
        this.xvar.paintRowCountMargin = this.config.virtualScrollYCountMargin;
        this.xvar.paintRowCountTopMargin = this.config.virtualScrollYCountMargin - Math.floor(this.config.virtualScrollYCountMargin / 2);

        if (this.config.virtualScrollAccelerated) {
            this.__throttledScroll = U.throttle(function (css, opts) {
                if (this.config.virtualScrollY && !opts.noRepaint && "top" in css) {
                    repaint.call(this);
                } else if (this.config.virtualScrollX && !opts.noRepaint && "left" in css) {
                    repaint.call(this);
                }
                if (opts.callback) {
                    opts.callback();
                }
            }, this.config.virtualScrollAcceleratedDelayTime);
        } else {
            this.__throttledScroll = false;
        }
    };

    var resetFrozenColumn = function resetFrozenColumn() {
        var cfg = this.config,
            dividedBodyRowObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.xvar.frozenColumnIndex);

        this.asideBodyRowData = function (dataTable) {
            var data = { rows: [] };
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = { cols: [] };
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        colIndex: null
                    },
                        _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.lineNumberColumnWidth,
                            _width: cfg.lineNumberColumnWidth,
                            columnAttr: "lineNumber",
                            label: "&nbsp;", key: "__d-index__"
                        });
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.rowSelectorColumnWidth,
                            _width: cfg.rowSelectorColumnWidth,
                            columnAttr: "rowSelector",
                            label: "", key: "__d-checkbox__"
                        });
                        data.rows[i].cols.push(_col);
                    }
                }
            }

            return data;
        }.call(this, this.bodyRowTable);

        //console.log(dividedBodyRowObj);

        this.leftBodyRowData = dividedBodyRowObj.leftData;
        this.bodyRowData = dividedBodyRowObj.rightData;

        if (cfg.body.grouping) {
            var dividedBodyGroupingObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyGroupingTable, this.xvar.frozenColumnIndex);
            this.asideBodyGroupingData = function (dataTable) {
                var data = { rows: [] };
                for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                    data.rows[i] = { cols: [] };
                    if (i === 0) {
                        var col = {
                            label: "",
                            colspan: 1,
                            rowspan: dataTable.rows.length,
                            colIndex: null
                        },
                            _col = {};

                        if (cfg.showLineNumber) {
                            _col = jQuery.extend({}, col, {
                                width: cfg.lineNumberColumnWidth,
                                _width: cfg.lineNumberColumnWidth,
                                columnAttr: "lineNumber",
                                label: "&nbsp;", key: "__d-index__"
                            });
                            data.rows[i].cols.push(_col);
                        }
                        if (cfg.showRowSelector) {
                            _col = jQuery.extend({}, col, {
                                width: cfg.rowSelectorColumnWidth,
                                _width: cfg.rowSelectorColumnWidth,
                                columnAttr: "rowSelector",
                                label: "", key: "__d-checkbox__"
                            });
                            data.rows[i].cols.push(_col);
                        }
                    }
                }

                return data;
            }.call(this, this.bodyGroupingTable);
            this.leftBodyGroupingData = dividedBodyGroupingObj.leftData;
            this.bodyGroupingData = dividedBodyGroupingObj.rightData;
            this.bodyGroupingMap = GRID.util.makeBodyRowMap.call(this, this.bodyGroupingTable);
        }

        this.leftFootSumData = {};
        this.footSumData = {};
        if (this.config.footSum) {
            var dividedFootSumObj = GRID.util.divideTableByFrozenColumnIndex(this.footSumTable, this.xvar.frozenColumnIndex);
            this.leftFootSumData = dividedFootSumObj.leftData;
            this.footSumData = dividedFootSumObj.rightData;
        }
    };

    var getFieldValue = function getFieldValue(_list, _item, _index, _col, _value, _returnPlainText) {

        var _key = _col.key,
            tagsToReplace = {
            '<': '&lt;',
            '>': '&gt;'
        };

        if (_key === "__d-index__") {
            return typeof _item["__index"] !== "undefined" ? _item["__index"] + 1 : "";
        } else if (_key === "__d-checkbox__") {
            return "<div class=\"checkBox\" style=\"max-height: " + (_col.width - 10) + "px;min-height: " + (_col.width - 10) + "px;\"></div>";
        } else {
            if (_col.editor && function (_editor) {
                if (_editor.type in GRID.inlineEditor) {
                    return GRID.inlineEditor[_editor.type].editMode == "inline";
                }
                return false;
            }(_col.editor)) {
                // editor가 inline타입이라면

                _value = _value || GRID.data.getValue.call(this, _index, _item.__origin_index__, _key);

                if (U.isFunction(_col.editor.disabled)) {
                    if (_col.editor.disabled.call({
                        list: _list,
                        dindex: _index,
                        item: _list[_index],
                        key: _key,
                        value: _value
                    })) {
                        return _value;
                    }
                }

                // print editor
                return _returnPlainText ? _value : GRID.inlineEditor[_col.editor.type].getHtml(this, _col.editor, _value);
            }

            var valueProcessor = {
                "formatter": function formatter() {
                    var that = {
                        key: _key,
                        value: _value || GRID.data.getValue.call(this, _index, _item.__origin_index__, _key),
                        dindex: _index,
                        item: _item,
                        list: _list
                    };
                    if (U.isFunction(_col.formatter)) {
                        return _col.formatter.call(that);
                    } else {
                        return GRID.formatter[_col.formatter].call(that);
                    }
                },
                "default": function _default() {
                    var returnValue = "";

                    if (typeof _value !== "undefined") {
                        returnValue = _value;
                    } else {
                        if (/[\.\[\]]/.test(_key)) {
                            _value = GRID.data.getValue.call(this, _index, _item.__origin_index__, _key);
                        } else {
                            _value = _item[_key];
                        }

                        if (_value !== null && typeof _value !== "undefined") returnValue = _value;
                    }

                    // 키값이 Boolean일때 오류 발생하여 수정.
                    return typeof returnValue !== "string" ? returnValue : returnValue.replace(/[<>]/g, function (tag) {
                        return tagsToReplace[tag] || tag;
                    });
                },
                "treeControl": function treeControl(__value) {
                    var cfg = this.config,
                        keys = this.config.tree.columnKeys,
                        indentNodeHtml = '';

                    if (_item[keys.children].length) {
                        indentNodeHtml += '<a ' + 'data-ax5grid-data-index="' + _index + '" ' + 'data-ax5grid-column-attr="tree-control" ' + 'data-ax5grid-tnode-arrow="" ' + 'style="width: ' + cfg.tree.arrowWidth + 'px;padding-left:' + _item[keys.depth] * cfg.tree.indentWidth + 'px;"' + '>';
                        indentNodeHtml += _item[keys.collapse] ? cfg.tree.icons.collapsedArrow : cfg.tree.icons.openedArrow;
                        indentNodeHtml += '</a>';
                    } else {
                        indentNodeHtml += '<span ' + 'data-ax5grid-tnode-arrow="" ' + 'style="width: ' + cfg.tree.arrowWidth + 'px;padding-left:' + _item[keys.depth] * cfg.tree.indentWidth + 'px;"' + '>&nbsp;</span>';
                    }

                    indentNodeHtml += '<span ' + 'data-ax5grid-tnode-item="' + (_item[keys.children].length ? 'group' : 'item') + '" ' + 'style="width: ' + cfg.tree.iconWidth + 'px;"' + '>';
                    indentNodeHtml += _item[keys.children].length ? _item[keys.collapse] ? cfg.tree.icons.collapsedGroupIcon : cfg.tree.icons.groupIcon : cfg.tree.icons.itemIcon;
                    indentNodeHtml += '</span>';

                    return indentNodeHtml + __value;
                }
            };

            var returnValue = _col.formatter ? valueProcessor.formatter.call(this) : valueProcessor.default.call(this);
            if (this.config.tree.use && _col.treeControl) {
                returnValue = valueProcessor.treeControl.call(this, returnValue);
            }

            return returnValue;
        }
    };

    var getGroupingValue = function getGroupingValue(_item, _index, _col) {
        var value = void 0,
            that = void 0,
            _key = _col.key,
            _label = _col.label;

        if (typeof _key === "undefined") {
            that = {
                key: _key,
                list: _item.__groupingList,
                groupBy: _item.__groupingBy
            };
            if (U.isFunction(_label)) {
                value = _label.call(that);
            } else {
                value = _label;
            }
            _item[_col.colIndex] = value;
            return value;
        } else if (_key === "__d-index__") {
            return '';
        } else if (_key === "__d-checkbox__") {
            return '';
        } else {
            if (_col.collector) {
                that = {
                    key: _key,
                    list: _item.__groupingList
                };
                if (U.isFunction(_col.collector)) {
                    value = _col.collector.call(that);
                } else {
                    value = GRID.collector[_col.collector].call(that);
                }
                _item[_col.colIndex] = value;

                if (_col.formatter) {
                    that.value = value;
                    if (U.isFunction(_col.formatter)) {
                        return _col.formatter.call(that);
                    } else {
                        return GRID.formatter[_col.formatter].call(that);
                    }
                } else {
                    return value;
                }
            } else {
                return "&nbsp;";
            }
        }
    };

    var getSumFieldValue = function getSumFieldValue(_list, _col) {
        var _key = _col.key,
            _label = _col.label;
        //, _collector, _formatter
        if (typeof _key === "undefined") {
            return _label;
        } else if (_key === "__d-index__" || _key === "__d-checkbox__") {
            return '&nbsp;';
        } else {
            if (_col.collector) {
                var that = {
                    key: _key,
                    list: _list
                },
                    value = void 0;

                if (U.isFunction(_col.collector)) {
                    value = _col.collector.call(that);
                } else {
                    value = GRID.collector[_col.collector].call(that);
                }

                if (_col.formatter) {
                    that.value = value;
                    if (U.isFunction(_col.formatter)) {
                        return _col.formatter.call(that);
                    } else {
                        return GRID.formatter[_col.formatter].call(that);
                    }
                } else {
                    return value;
                }
            } else {
                return "&nbsp;";
            }
        }
    };

    var repaint = function repaint(_reset) {
        // debugger;
        var cfg = this.config,
            list = this.proxyList ? this.proxyList : this.list;

        /// repaint reset 타입이면 고정컬럼을 재조정
        if (_reset) {
            resetFrozenColumn.call(this);
            // 틀고정 이 변경되면 출력 시작 인덱스 값을 초기화
            this.xvar.paintStartRowIndex = undefined;
            this.xvar.paintStartColumnIndex = undefined;
        }

        /// 출력시작 인덱스
        var paintStartRowIndex = void 0,
            virtualPaintStartRowIndex = void 0;

        if (this.config.virtualScrollY) {
            virtualPaintStartRowIndex = paintStartRowIndex = Math.floor(-this.$.panel["body-scroll"].position().top / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex;
            if (this.xvar.paintRowCountTopMargin < paintStartRowIndex) {
                paintStartRowIndex -= this.xvar.paintRowCountTopMargin;
            }
        } else {
            paintStartRowIndex = this.xvar.frozenRowIndex;
        }

        if (isNaN(paintStartRowIndex)) return this;

        var paintStartColumnIndex = 0,
            paintEndColumnIndex = 0,
            nopaintLeftColumnsWidth = null,
            nopaintRightColumnsWidth = null;
        var bodyScrollLeft = -this.$.panel["body-scroll"].position().left;

        if (this.config.virtualScrollX) {
            // 페인트 시작컬럼위치와 종료컬럼위치 구하기
            for (var ci = this.xvar.frozenColumnIndex; ci < this.colGroup.length; ci++) {
                // bodyScrollLeft
                this.colGroup[ci]._sx = ci == this.xvar.frozenColumnIndex ? 0 : this.colGroup[ci - 1]._ex;
                this.colGroup[ci]._ex = this.colGroup[ci]._sx + this.colGroup[ci]._width;

                if (this.colGroup[ci]._sx <= bodyScrollLeft && this.colGroup[ci]._ex >= bodyScrollLeft) {
                    paintStartColumnIndex = ci;
                }
                if (this.colGroup[ci]._sx <= bodyScrollLeft + this.xvar.bodyWidth && this.colGroup[ci]._ex >= bodyScrollLeft + this.xvar.bodyWidth) {
                    paintEndColumnIndex = ci;

                    if (nopaintLeftColumnsWidth === null) nopaintLeftColumnsWidth = this.colGroup[paintStartColumnIndex]._sx;
                    if (nopaintRightColumnsWidth === null) nopaintRightColumnsWidth = this.xvar.scrollContentWidth - this.colGroup[ci]._ex;
                }
            }

            if (nopaintLeftColumnsWidth === null) nopaintLeftColumnsWidth = 0;
            if (nopaintRightColumnsWidth === null) nopaintRightColumnsWidth = 0;
            this.$.panel["top-body-scroll"].css({ "padding-left": nopaintLeftColumnsWidth, "padding-right": nopaintRightColumnsWidth });
            this.$.panel["body-scroll"].css({ "padding-left": nopaintLeftColumnsWidth, "padding-right": nopaintRightColumnsWidth });
            this.$.panel["bottom-body-scroll"].css({ "padding-left": nopaintLeftColumnsWidth, "padding-right": nopaintRightColumnsWidth });
        }

        var isFirstPaint = typeof this.xvar.paintStartRowIndex === "undefined",
            headerColGroup = this.headerColGroup,
            asideBodyRowData = this.asideBodyRowData,
            leftBodyRowData = this.leftBodyRowData,
            bodyRowData = this.bodyRowData,
            leftFootSumData = this.leftFootSumData,
            footSumData = this.footSumData,
            asideBodyGroupingData = this.asideBodyGroupingData,
            leftBodyGroupingData = this.leftBodyGroupingData,
            bodyGroupingData = this.bodyGroupingData,
            bodyAlign = cfg.body.align,
            paintRowCount = void 0,
            virtualPaintRowCount = void 0;

        if (!this.config.virtualScrollY) {
            virtualPaintRowCount = paintRowCount = list.length;
        } else {
            virtualPaintRowCount = Math.ceil(this.xvar.bodyHeight / this.xvar.bodyTrHeight);
            paintRowCount = virtualPaintRowCount + (this.xvar.paintRowCountMargin || 1);
        }

        // 여유범위 안에 있으면 페인팅 안할수 있게 paintStartRowIndex 변경하지 않음.
        if (this.xvar.paintRowCountTopMargin < paintStartRowIndex && Math.abs(this.xvar.paintStartRowIndex - paintStartRowIndex) <= this.xvar.paintRowCountTopMargin) {
            paintStartRowIndex = this.xvar.paintStartRowIndex;
        }

        if (this.xvar.dataRowCount === list.length && this.xvar.paintStartRowIndex === paintStartRowIndex && this.xvar.paintRowCount === paintRowCount && this.xvar.paintStartColumnIndex === paintStartColumnIndex && this.xvar.paintEndColumnIndex === paintEndColumnIndex) return this; // 스크롤 포지션 변경 여부에 따라 프로세스 진행여부 결정

        // bodyRowData 수정 : 페인트 컬럼 포지션이 달라지므로
        if (nopaintLeftColumnsWidth || nopaintRightColumnsWidth) {
            headerColGroup = [].concat(headerColGroup).splice(paintStartColumnIndex - this.xvar.frozenColumnIndex, paintEndColumnIndex - paintStartColumnIndex + 1 + this.xvar.frozenColumnIndex);
            bodyRowData = GRID.util.getTableByStartEndColumnIndex(bodyRowData, paintStartColumnIndex, paintEndColumnIndex);

            if (cfg.body.grouping) {
                bodyGroupingData = GRID.util.getTableByStartEndColumnIndex(bodyGroupingData, paintStartColumnIndex, paintEndColumnIndex);
            }
            if (cfg.footSum) {
                footSumData = GRID.util.getTableByStartEndColumnIndex(footSumData, paintStartColumnIndex, paintEndColumnIndex);
            }
            if (this.xvar.paintStartColumnIndex !== paintStartColumnIndex || this.xvar.paintEndColumnIndex !== paintEndColumnIndex) {
                this.needToPaintSum = true;
            }
        }

        /// 스크롤 컨텐츠의 높이 : 그리드 스크롤의 실제 크기와는 관계 없이 데이터 갯수에 따라 스크롤 컨텐츠 높이값 구해서 저장해두기.
        // todo scrollContentHeight
        this.xvar.scrollContentHeight = this.xvar.bodyTrHeight * (list.length - this.xvar.frozenRowIndex);
        if (this.xvar.scrollContentHeight < 0) this.xvar.scrollContentHeight = 0;

        /// 사용된 패널들의 키 모음
        this.$.livePanelKeys = [];

        // 그리드 바디 영역 페인트 함수
        /**
         * @param _elTargetKey
         * @param _colGroup
         * @param _bodyRow
         * @param _groupRow
         * @param _list
         * @param [_scrollConfig]
         * @returns {boolean}
         */
        var repaintBody = function repaintBody(_elTargetKey, _colGroup, _bodyRow, _groupRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];

            if (!isFirstPaint && !_scrollConfig) {
                this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
                return false;
            }

            var SS = [],
                cgi = void 0,
                cgl = void 0,
                di = void 0,
                dl = void 0,
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                cellHeight = void 0,
                colAlign = void 0,
                isScrolled = function () {
                // 스크롤값이 변경되거나 처음 호출되었습니까?
                if (typeof _scrollConfig === "undefined" || typeof _scrollConfig['paintStartRowIndex'] === "undefined") {
                    _scrollConfig = {
                        paintStartRowIndex: 0,
                        paintRowCount: _list.length
                    };
                    return false;
                } else {
                    return true;
                }
            }(),
                stripeString = '#fff 0px, #fff ' + (cfg.body.columnHeight - cfg.body.columnBorderWidth) + 'px, #eee ' + (cfg.body.columnHeight - cfg.body.columnBorderWidth) + 'px, #eee ' + cfg.body.columnHeight + 'px';

            if (isScrolled) {
                SS.push('<div style="background:repeating-linear-gradient(to top, ' + stripeString + ');' + 'font-size:0;' + 'line-height:0;height: ' + (_scrollConfig.paintStartRowIndex - this.xvar.frozenRowIndex) * _scrollConfig.bodyTrHeight + 'px;"></div>');
            }

            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            di = _scrollConfig.paintStartRowIndex;

            for (dl = function () {
                var len = void 0;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            }(); di < dl; di++) {

                if (_list[di]) {
                    var isGroupingRow = false,
                        rowTable = void 0,
                        odi = typeof _list[di].__origin_index__ !== "undefined" ? _list[di].__origin_index__ : di;
                    if (_groupRow && "__isGrouping" in _list[di]) {
                        rowTable = _groupRow;
                        isGroupingRow = true;
                    } else {
                        rowTable = _bodyRow;
                    }

                    for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {

                        SS.push('<tr class="tr-' + di % 4 + '', cfg.body.trStyleClass ? U.isFunction(cfg.body.trStyleClass) ? ' ' + cfg.body.trStyleClass.call({
                            item: _list[di],
                            index: di
                        }, _list[di], di) : ' ' + cfg.body.trStyleClass : '', '"', isGroupingRow ? ' data-ax5grid-grouping-tr="true"' : '', ' data-ax5grid-tr-data-index="' + di + '"', ' data-ax5grid-tr-data-o-index="' + odi + '"', ' data-ax5grid-selected="' + (_list[di][cfg.columnKeys.selected] || "false") + '"', ' data-ax5grid-disable-selection="' + (_list[di][cfg.columnKeys.disableSelection] || "false") + '"', '>');

                        for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                            col = rowTable.rows[tri].cols[ci];
                            cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                            colAlign = col.align || bodyAlign;

                            SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-data-o-index="' + odi + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', function (_focusedColumn, _selectedColumn) {
                                var attrs = "";
                                if (_focusedColumn) {
                                    attrs += 'data-ax5grid-column-focused="true" ';
                                }
                                if (_selectedColumn) {
                                    attrs += 'data-ax5grid-column-selected="true" ';
                                }
                                return attrs;
                            }(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                                var tdCSS_class = "";
                                if (_col.styleClass) {
                                    if (U.isFunction(_col.styleClass)) {
                                        tdCSS_class += _col.styleClass.call({
                                            column: _col,
                                            key: _col.key,
                                            item: _list[di],
                                            index: di
                                        }) + " ";
                                    } else {
                                        tdCSS_class += _col.styleClass + " ";
                                    }
                                }
                                if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                                if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                                return tdCSS_class;
                            }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                            SS.push(function (_cellHeight) {
                                var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                                if (!col.multiLine) {
                                    _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                                }

                                return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;' + (col.multiLine ? '' : 'line-height: ' + lineHeight + 'px;') + '">';
                            }(cellHeight), isGroupingRow ? getGroupingValue.call(this, _list[di], di, col) : getFieldValue.call(this, _list, _list[di], di, col), '</span>');

                            SS.push('</td>');
                        }
                        SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-data-o-index="' + odi + '" ', 'data-ax5grid-column-attr="' + "default" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                        SS.push('</tr>');
                    }
                }
            }
            SS.push('</table>');

            if (isScrolled && _list.length) {
                SS.push('<div style="background:repeating-linear-gradient(to bottom, ' + stripeString + ');' + 'font-size:0;' + 'line-height:0;height: ' + (_list.length - di) * _scrollConfig.bodyTrHeight + 'px;"></div>');
            }

            _elTarget.empty();
            SS = SS.join('');

            _elTarget.get(0).innerHTML = SS;

            this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
            return true;
        };

        /**
         * @param _elTargetKey
         * @param _colGroup
         * @param _bodyRow
         * @param _list
         * @param [_scrollConfig]
         * @returns {boolean}
         */
        var repaintSum = function repaintSum(_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey];

            if (!isFirstPaint && !_scrollConfig) {
                this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
                return false;
            }

            var SS = [],
                cgi = void 0,
                cgl = void 0,
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                cellHeight = void 0,
                colAlign = void 0;

            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('<tr class="tr-sum">');
                for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    col = _bodyRow.rows[tri].cols[ci];
                    cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                    colAlign = col.align || bodyAlign;

                    SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + tri + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ', function (_focusedColumn, _selectedColumn) {
                        var attrs = "";
                        if (_focusedColumn) {
                            attrs += 'data-ax5grid-column-focused="true" ';
                        }
                        if (_selectedColumn) {
                            attrs += 'data-ax5grid-column-selected="true" ';
                        }
                        return attrs;
                    }(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                        var tdCSS_class = "";
                        if (_col.styleClass) {
                            if (U.isFunction(_col.styleClass)) {
                                tdCSS_class += _col.styleClass.call({
                                    column: _col,
                                    key: _col.key,
                                    isFootSum: true
                                }) + " ";
                            } else {
                                tdCSS_class += _col.styleClass + " ";
                            }
                        }
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                        return tdCSS_class;
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function (_cellHeight) {
                        var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;' + (col.multiLine ? '' : 'line-height: ' + lineHeight + 'px;') + '">';
                    }(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-column-attr="' + "sum" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.empty();
            SS = SS.join('');

            _elTarget.get(0).innerHTML = SS;

            this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
            return true;
        };

        /**
         * @param _elTargetKey
         * @param _colGroup
         * @param _bodyRow
         * @param _list
         * @param [_scrollConfig]
         * @returns {boolean}
         */
        var mergeCellsBody = function mergeCellsBody(_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            var tblRowMaps = [];
            var _elTarget = this.$.panel[_elTargetKey];
            var token = {},
                hasMergeTd = void 0;

            // 테이블의 td들을 수잡하여 저장해두고 스크립트로 반복하여 정리.
            var tableTrs = _elTarget.find("tr");
            for (var ri = 0, rl = tableTrs.length; ri < rl; ri++) {
                var tableTrTds = void 0,
                    trMaps = void 0;
                tableTrTds = tableTrs[ri].childNodes;
                trMaps = [];

                for (var _ci = 0, cl = tableTrTds.length; _ci < cl; _ci++) {
                    var tdObj = {
                        "$": jQuery(tableTrTds[_ci])
                    };

                    if (tdObj["$"].attr("data-ax5grid-column-col") != "null") {
                        tdObj.dindex = tdObj["$"].attr("data-ax5grid-data-index");
                        tdObj.tri = tdObj["$"].attr("data-ax5grid-column-row");
                        tdObj.ci = tdObj["$"].attr("data-ax5grid-column-col");
                        tdObj.rowIndex = tdObj["$"].attr("data-ax5grid-column-rowIndex");
                        tdObj.colIndex = tdObj["$"].attr("data-ax5grid-column-colIndex");
                        tdObj.rowspan = tdObj["$"].attr("rowspan");
                        tdObj.text = tdObj["$"].text();
                        trMaps.push(tdObj);
                    }

                    tdObj = null;
                }
                tblRowMaps.push(trMaps);
            }

            // 두줄이상 일 때 의미가 있으니.
            if (tblRowMaps.length > 1) {
                hasMergeTd = false;

                var _loop = function _loop(_ri, _rl) {
                    var prevTokenColIndexs = [];

                    var _loop2 = function _loop2(_ci3, _cl2) {
                        // 적용 하려는 컬럼에 editor 속성이 없다면 머지 대상입니다.

                        if (!_colGroup[_ci3].editor && function () {
                            if (U.isArray(cfg.body.mergeCells)) {
                                return ax5.util.search(cfg.body.mergeCells, _colGroup[_ci3].key) > -1;
                            } else {
                                return true;
                            }
                        }()) {

                            // 앞줄과 값이 같다면.
                            if (token[_ci3] && function () {
                                if (prevTokenColIndexs.length > 0) {
                                    var hasFalse = true;
                                    prevTokenColIndexs.forEach(function (ti) {
                                        if (tblRowMaps[_ri - 1][ti].text != tblRowMaps[_ri][ti].text) {
                                            hasFalse = false;
                                        }
                                    });
                                    return hasFalse;
                                } else {
                                    return true;
                                }
                            }() && token[_ci3].text == tblRowMaps[_ri][_ci3].text) {
                                tblRowMaps[_ri][_ci3].rowspan = 0;
                                tblRowMaps[token[_ci3].ri][_ci3].rowspan++;
                                hasMergeTd = true;
                            } else {
                                token[_ci3] = {
                                    ri: _ri,
                                    ci: _ci3,
                                    text: tblRowMaps[_ri][_ci3].text
                                };
                            }

                            prevTokenColIndexs.push(_ci3);
                        }
                    };

                    for (var _ci3 = 0, _cl2 = tblRowMaps[_ri].length; _ci3 < _cl2; _ci3++) {
                        _loop2(_ci3, _cl2);
                    }
                };

                for (var _ri = 0, _rl = tblRowMaps.length; _ri < _rl; _ri++) {
                    _loop(_ri, _rl);
                }

                // rowspan을 다 구했으면 적용합니다.
                if (hasMergeTd) {
                    for (var _ri2 = 0, _rl2 = tblRowMaps.length; _ri2 < _rl2; _ri2++) {
                        for (var _ci2 = 0, _cl = tblRowMaps[_ri2].length; _ci2 < _cl; _ci2++) {
                            if (tblRowMaps[_ri2][_ci2].rowspan == 0) {
                                tblRowMaps[_ri2][_ci2]["$"].remove();
                            } else if (tblRowMaps[_ri2][_ci2].rowspan > 1) {
                                tblRowMaps[_ri2][_ci2]["$"].attr("rowspan", tblRowMaps[_ri2][_ci2].rowspan).addClass("merged");
                            }
                        }
                    }
                }
            }
        };

        var scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            paintStartColumnIndex: paintStartColumnIndex,
            paintEndColumnIndex: paintEndColumnIndex,
            nopaintLeftColumnsWidth: nopaintLeftColumnsWidth,
            nopaintRightColumnsWidth: nopaintRightColumnsWidth,
            bodyTrHeight: this.xvar.bodyTrHeight,
            virtualScrollX: this.config.virtualScrollX,
            virtualScrollY: this.config.virtualScrollY
        };
        var frozenScrollConfig = jQuery.extend({}, scrollConfig, {
            paintStartRowIndex: 0,
            paintRowCount: this.xvar.frozenRowIndex
        });

        // aside
        if (cfg.asidePanelWidth > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-aside-body", this.asideColGroup, asideBodyRowData, asideBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex), frozenScrollConfig);
            }

            repaintBody.call(this, "aside-body-scroll", this.asideColGroup, asideBodyRowData, asideBodyGroupingData, list, scrollConfig);

            if (cfg.footSum) {
                // 바닥 요약 (footSum에 대한 aside 사용안함)
                repaintSum.call(this, "bottom-aside-body", this.asideColGroup, asideBodyRowData, null, this.list);
            }
        }

        // left
        if (this.xvar.frozenColumnIndex > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, leftBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex), frozenScrollConfig);
            }

            repaintBody.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, leftBodyGroupingData, list, scrollConfig);

            if (cfg.footSum && this.needToPaintSum) {
                // 바닥 요약
                repaintSum.call(this, "bottom-left-body", this.leftHeaderColGroup, leftFootSumData, this.list);
            }
        }

        // body
        if (this.xvar.frozenRowIndex > 0) {
            // 상단 행고정
            repaintBody.call(this, "top-body-scroll", headerColGroup, bodyRowData, bodyGroupingData, list.slice(0, this.xvar.frozenRowIndex), frozenScrollConfig);
        }
        repaintBody.call(this, "body-scroll", headerColGroup, bodyRowData, bodyGroupingData, list, scrollConfig);

        // 바닥 요약
        if (cfg.footSum && this.needToPaintSum) {
            repaintSum.call(this, "bottom-body-scroll", headerColGroup, footSumData, this.list, scrollConfig);
        }
        // right
        if (cfg.rightSum) {}
        // todo : right 표현 정리


        /// mergeCells
        if (cfg.body.mergeCells && list.length) {
            // left
            if (this.xvar.frozenColumnIndex > 0) {
                if (this.xvar.frozenRowIndex > 0) {
                    // 상단 행고정
                    // console.log(this.leftHeaderColGroup, leftBodyRowData);
                    mergeCellsBody.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, list.slice(0, this.xvar.frozenRowIndex));
                }
                mergeCellsBody.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, list, scrollConfig);
            }

            // body
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                mergeCellsBody.call(this, "top-body-scroll", this.headerColGroup, bodyRowData, list.slice(0, this.xvar.frozenRowIndex));
            }
            mergeCellsBody.call(this, "body-scroll", this.headerColGroup, bodyRowData, list, scrollConfig);
        }

        this.xvar.virtualPaintStartRowIndex = virtualPaintStartRowIndex;
        this.xvar.paintStartRowIndex = paintStartRowIndex;
        this.xvar.paintRowCount = paintRowCount;
        this.xvar.virtualPaintRowCount = virtualPaintRowCount;
        this.xvar.paintStartColumnIndex = paintStartColumnIndex;
        this.xvar.paintEndColumnIndex = paintEndColumnIndex;
        this.xvar.nopaintLeftColumnsWidth = nopaintLeftColumnsWidth;
        this.xvar.nopaintRightColumnsWidth = nopaintRightColumnsWidth;
        this.xvar.dataRowCount = list.length;
        this.needToPaintSum = false;

        GRID.page.statusUpdate.call(this);
    };

    var repaintCell = function repaintCell(_panelName, _dindex, _doindex, _rowIndex, _colIndex, _newValue) {
        var self = this,
            cfg = this.config,
            list = this.list;

        var updateCell = this.$["panel"][_panelName].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').find('[data-ax5grid-column-rowindex="' + _rowIndex + '"][data-ax5grid-column-colindex="' + _colIndex + '"]').find('[data-ax5grid-cellholder]'),
            colGroup = this.colGroup,
            col = colGroup[_colIndex];

        updateCell.html(getFieldValue.call(this, list, list[_dindex], _dindex, col));

        if (col.editor && col.editor.updateWith) {
            col.editor.updateWith.forEach(function (updateColumnKey) {
                colGroup.forEach(function (col) {
                    if (col.key == updateColumnKey) {
                        var rowIndex = col.rowIndex,
                            colIndex = col.colIndex,
                            panelName = GRID.util.findPanelByColumnIndex.call(self, _dindex, colIndex, rowIndex).panelName,
                            updateWithCell = self.$["panel"][panelName].find('[data-ax5grid-tr-data-index="' + _dindex + '"]').find('[data-ax5grid-column-rowindex="' + rowIndex + '"][data-ax5grid-column-colindex="' + colIndex + '"]').find('[data-ax5grid-cellholder]');

                        updateWithCell.html(getFieldValue.call(self, list, list[_dindex], _dindex, col));
                    }
                });
            });
        }

        /// ~~~~~~

        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex,
            headerColGroup = this.headerColGroup,
            leftFootSumData = this.leftFootSumData,
            footSumData = this.footSumData,
            leftBodyGroupingData = this.leftBodyGroupingData,
            bodyGroupingData = this.bodyGroupingData,
            bodyAlign = cfg.body.align,
            paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1,
            scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            bodyTrHeight: this.xvar.bodyTrHeight
        };

        if (this.xvar.nopaintLeftColumnsWidth || this.xvar.nopaintRightColumnsWidth) {
            headerColGroup = [].concat(headerColGroup).splice(this.xvar.paintStartColumnIndex, this.xvar.paintEndColumnIndex - this.xvar.paintStartColumnIndex + 1);
            if (cfg.body.grouping) {
                bodyGroupingData = GRID.util.getTableByStartEndColumnIndex(bodyGroupingData, this.xvar.paintStartColumnIndex, this.xvar.paintEndColumnIndex);
            }
            if (cfg.footSum) {
                footSumData = GRID.util.getTableByStartEndColumnIndex(footSumData, this.xvar.paintStartColumnIndex, this.xvar.paintEndColumnIndex);
            }
        }

        var repaintSum = function repaintSum(_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                cgi = void 0,
                cgl = void 0,
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                cellHeight = void 0,
                colAlign = void 0;

            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('<tr class="tr-sum">');
                for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    col = _bodyRow.rows[tri].cols[ci];
                    cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                    colAlign = col.align || bodyAlign;

                    SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + tri + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ', function (_focusedColumn, _selectedColumn) {
                        var attrs = "";
                        if (_focusedColumn) {
                            attrs += 'data-ax5grid-column-focused="true" ';
                        }
                        if (_selectedColumn) {
                            attrs += 'data-ax5grid-column-selected="true" ';
                        }
                        return attrs;
                    }(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                        var tdCSS_class = "";
                        if (_col.styleClass) {
                            if (U.isFunction(_col.styleClass)) {
                                tdCSS_class += _col.styleClass.call({
                                    column: _col,
                                    key: _col.key,
                                    isFootSum: true
                                }) + " ";
                            } else {
                                tdCSS_class += _col.styleClass + " ";
                            }
                        }
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                        return tdCSS_class;
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function (_cellHeight) {
                        var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;' + (col.multiLine ? '' : 'line-height: ' + lineHeight + 'px;') + '">';
                    }(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-column-attr="' + "sum" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.empty().get(0).innerHTML = SS.join('');
            return true;
        };
        var replaceGroupTr = function replaceGroupTr(_elTargetKey, _colGroup, _groupRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                di = void 0,
                dl = void 0,
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                cellHeight = void 0,
                colAlign = void 0;

            for (di = _scrollConfig.paintStartRowIndex, dl = function () {
                var len = void 0;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            }(); di < dl; di++) {
                if (_list[di] && _groupRow && "__isGrouping" in _list[di]) {
                    var rowTable = _groupRow;
                    SS = [];
                    for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                        for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                            col = rowTable.rows[tri].cols[ci];
                            cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                            colAlign = col.align || bodyAlign;

                            SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', function (_focusedColumn, _selectedColumn) {
                                var attrs = "";
                                if (_focusedColumn) {
                                    attrs += 'data-ax5grid-column-focused="true" ';
                                }
                                if (_selectedColumn) {
                                    attrs += 'data-ax5grid-column-selected="true" ';
                                }
                                return attrs;
                            }(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                                var tdCSS_class = "";
                                if (_col.styleClass) {
                                    if (U.isFunction(_col.styleClass)) {
                                        tdCSS_class += _col.styleClass.call({
                                            column: _col,
                                            key: _col.key,
                                            item: _list[di],
                                            index: di
                                        }) + " ";
                                    } else {
                                        tdCSS_class += _col.styleClass + " ";
                                    }
                                }
                                if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                                if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                                return tdCSS_class;
                            }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                            SS.push(function (_cellHeight) {
                                var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                                if (!col.multiLine) {
                                    _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                                }

                                return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;' + (col.multiLine ? '' : 'line-height: ' + lineHeight + 'px;') + '">';
                            }(cellHeight), getGroupingValue.call(this, _list[di], di, col), '</span>');

                            SS.push('</td>');
                        }
                        SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-attr="' + "default" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                    }
                    _elTarget.find('tr[data-ax5grid-tr-data-index="' + di + '"]').empty().get(0).innerHTML = SS.join('');
                }
            }
        };

        // body.grouping tr 다시 그리기..
        if (cfg.body.grouping) {
            // left
            if (this.xvar.frozenColumnIndex > 0) {
                if (this.xvar.frozenRowIndex > 0) {
                    // 상단 행고정
                    replaceGroupTr.call(this, "top-left-body", headerColGroup, leftBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex), {
                        paintStartRowIndex: 0,
                        paintRowCount: this.xvar.frozenRowIndex,
                        bodyTrHeight: this.xvar.bodyTrHeight
                    });
                }
                replaceGroupTr.call(this, "left-body-scroll", headerColGroup, leftBodyGroupingData, list, scrollConfig);
            }

            // body
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                replaceGroupTr.call(this, "top-body-scroll", headerColGroup, bodyGroupingData, list.slice(0, this.xvar.frozenRowIndex), {
                    paintStartRowIndex: 0,
                    paintRowCount: this.xvar.frozenRowIndex,
                    bodyTrHeight: this.xvar.bodyTrHeight
                });
            }

            replaceGroupTr.call(this, "body-scroll", headerColGroup, bodyGroupingData, list, scrollConfig);
        }

        if (this.xvar.frozenColumnIndex > 0) {
            if (cfg.footSum && this.needToPaintSum) {
                // 바닥 요약
                repaintSum.call(this, "bottom-left-body", headerColGroup, leftFootSumData, list);
            }
        }

        if (cfg.footSum && this.needToPaintSum) {
            // 바닥 요약
            repaintSum.call(this, "bottom-body-scroll", headerColGroup, footSumData, list, scrollConfig);
        }
    };

    var repaintRow = function repaintRow(_dindex) {
        var self = this,
            cfg = this.config,
            list = this.list;
        /// ~~~~~~

        var paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex,
            asideBodyRowData = this.asideBodyRowData,
            leftBodyRowData = this.leftBodyRowData,
            bodyRowData = this.bodyRowData,
            leftFootSumData = this.leftFootSumData,
            footSumData = this.footSumData,
            asideBodyGroupingData = this.asideBodyGroupingData,
            leftBodyGroupingData = this.leftBodyGroupingData,
            bodyGroupingData = this.bodyGroupingData,
            bodyAlign = cfg.body.align,
            paintRowCount = Math.ceil(this.$.panel["body"].height() / this.xvar.bodyTrHeight) + 1,
            scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            bodyTrHeight: this.xvar.bodyTrHeight
        };

        var repaintSum = function repaintSum(_elTargetKey, _colGroup, _bodyRow, _list) {
            var _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                cgi = void 0,
                cgl = void 0,
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                cellHeight = void 0,
                colAlign = void 0;

            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('<tr class="tr-sum">');
                for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    col = _bodyRow.rows[tri].cols[ci];
                    cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                    colAlign = col.align || bodyAlign;

                    SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + tri + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ', function (_focusedColumn, _selectedColumn) {
                        var attrs = "";
                        if (_focusedColumn) {
                            attrs += 'data-ax5grid-column-focused="true" ';
                        }
                        if (_selectedColumn) {
                            attrs += 'data-ax5grid-column-selected="true" ';
                        }
                        return attrs;
                    }(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                        var tdCSS_class = "";
                        if (_col.styleClass) {
                            if (U.isFunction(_col.styleClass)) {
                                tdCSS_class += _col.styleClass.call({
                                    column: _col,
                                    key: _col.key,
                                    isFootSum: true
                                }) + " ";
                            } else {
                                tdCSS_class += _col.styleClass + " ";
                            }
                        }
                        if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                        return tdCSS_class;
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function (_cellHeight) {
                        var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                    }(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-column-attr="' + "sum" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.empty().get(0).innerHTML = SS.join('');
            return true;
        };
        var replaceGroupTr = function replaceGroupTr(_elTargetKey, _colGroup, _groupRow, _list, _scrollConfig) {
            var _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                di = void 0,
                dl = void 0,
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                cellHeight = void 0,
                colAlign = void 0;

            if (typeof _scrollConfig === "undefined" || typeof _scrollConfig['paintStartRowIndex'] === "undefined") {
                _scrollConfig = {
                    paintStartRowIndex: 0,
                    paintRowCount: _list.length
                };
            }

            for (di = _scrollConfig.paintStartRowIndex, dl = function () {
                var len = void 0;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            }(); di < dl; di++) {
                if (_list[di] && _groupRow && "__isGrouping" in _list[di]) {
                    var rowTable = _groupRow;
                    SS = [];
                    for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                        for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                            col = rowTable.rows[tri].cols[ci];
                            cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                            colAlign = col.align || bodyAlign;

                            SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', function (_focusedColumn, _selectedColumn) {
                                var attrs = "";
                                if (_focusedColumn) {
                                    attrs += 'data-ax5grid-column-focused="true" ';
                                }
                                if (_selectedColumn) {
                                    attrs += 'data-ax5grid-column-selected="true" ';
                                }
                                return attrs;
                            }(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                                var tdCSS_class = "";
                                if (_col.styleClass) {
                                    if (U.isFunction(_col.styleClass)) {
                                        tdCSS_class += _col.styleClass.call({
                                            column: _col,
                                            key: _col.key,
                                            item: _list[di],
                                            index: di
                                        }) + " ";
                                    } else {
                                        tdCSS_class += _col.styleClass + " ";
                                    }
                                }
                                if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                                if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                                return tdCSS_class;
                            }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                            SS.push(function (_cellHeight) {
                                var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                                if (!col.multiLine) {
                                    _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                                }

                                return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';
                            }(cellHeight), getGroupingValue.call(this, _list[di], di, col), '</span>');

                            SS.push('</td>');
                        }
                        SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-attr="' + "default" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                    }
                    _elTarget.find('tr[data-ax5grid-tr-data-index="' + di + '"]').empty().get(0).innerHTML = SS.join('');
                }
            }
        };
        var replaceTr = function replaceTr(_elTargetKey, _colGroup, _bodyRow, _list, di) {
            var _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                cellHeight = void 0,
                colAlign = void 0,
                rowTable = _bodyRow,
                odi = typeof _list[di].__origin_index__ !== "undefined" ? _list[di].__origin_index__ : di;

            var tr_element = _elTarget.find('tr[data-ax5grid-tr-data-index="' + di + '"]').empty().get(0);
            if (tr_element) {
                for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                    for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                        col = rowTable.rows[tri].cols[ci];
                        cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                        colAlign = col.align || bodyAlign;

                        SS.push('<td ', 'data-ax5grid-panel-name="' + _elTargetKey + '" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-data-o-index="' + odi + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', 'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ', 'data-ax5grid-column-colIndex="' + col.colIndex + '" ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', function (_focusedColumn, _selectedColumn) {
                            var attrs = "";
                            if (_focusedColumn) {
                                attrs += 'data-ax5grid-column-focused="true" ';
                            }
                            if (_selectedColumn) {
                                attrs += 'data-ax5grid-column-selected="true" ';
                            }
                            return attrs;
                        }(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]), 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                            var tdCSS_class = "";
                            if (_col.styleClass) {
                                if (U.isFunction(_col.styleClass)) {
                                    tdCSS_class += _col.styleClass.call({
                                        column: _col,
                                        key: _col.key,
                                        item: _list[di],
                                        index: di
                                    }) + " ";
                                } else {
                                    tdCSS_class += _col.styleClass + " ";
                                }
                            }
                            if (cfg.body.columnBorderWidth) tdCSS_class += "hasBorder ";
                            if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                            return tdCSS_class;
                        }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                        SS.push(function (_cellHeight) {
                            var lineHeight = cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth;
                            if (!col.multiLine) {
                                _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                            }

                            return '<span data-ax5grid-cellHolder="' + (col.multiLine ? 'multiLine' : '') + '" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + '" style="height:' + _cellHeight + 'px;' + (col.multiLine ? '' : 'line-height: ' + lineHeight + 'px;') + '">';
                        }(cellHeight), getFieldValue.call(this, _list, _list[di], di, col), '</span>');
                        SS.push('</td>');
                    }
                    SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'data-ax5grid-data-index="' + di + '" ', 'data-ax5grid-column-attr="' + "default" + '" ', 'style="height: ' + cfg.body.columnHeight + 'px;min-height: 1px;" ', '></td>');
                }
                tr_element.innerHTML = SS.join('');
            }
        };

        // left
        if (this.xvar.frozenColumnIndex > 0) {
            if (this.xvar.frozenRowIndex > _dindex) {
                // 상단 행고정
                replaceTr.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, list.slice(0, this.xvar.frozenRowIndex), _dindex);
            } else {
                replaceTr.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, list, _dindex);
            }
        }

        // body
        if (this.xvar.frozenRowIndex > _dindex) {
            // 상단 행고정
            replaceTr.call(this, "top-body-scroll", this.headerColGroup, bodyRowData, list.slice(0, this.xvar.frozenRowIndex), _dindex);
        } else {
            replaceTr.call(this, "body-scroll", this.headerColGroup, bodyRowData, list, _dindex);
        }

        // body.grouping tr 다시 그리기..
        if (cfg.body.grouping) {
            // left
            if (this.xvar.frozenColumnIndex > 0) {
                if (this.xvar.frozenRowIndex > _dindex) {
                    // 상단 행고정
                    replaceGroupTr.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
                } else {
                    replaceGroupTr.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyGroupingData, list, scrollConfig);
                }
            }

            // body
            if (this.xvar.frozenRowIndex > _dindex) {
                // 상단 행고정
                replaceGroupTr.call(this, "top-body-scroll", this.headerColGroup, bodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
            } else {
                replaceGroupTr.call(this, "body-scroll", this.headerColGroup, bodyGroupingData, list, scrollConfig);
            }
        }

        if (this.xvar.frozenColumnIndex > 0) {
            if (cfg.footSum && this.needToPaintSum) {
                // 바닥 요약
                repaintSum.call(this, "bottom-left-body", this.leftHeaderColGroup, leftFootSumData, list);
            }
        }

        if (cfg.footSum && this.needToPaintSum) {
            // 바닥 요약
            repaintSum.call(this, "bottom-body-scroll", this.headerColGroup, footSumData, list, scrollConfig);
        }
    };

    var scrollTo = function scrollTo(css, opts) {
        if (typeof opts === "undefined") opts = { timeoutUnUse: false };
        if (this.isInlineEditing) {
            for (var key in this.inlineEditing) {
                //if(this.inlineEditing[key].editor.type === "select") {}
                // 인라인 에디팅 인데 스크롤 이벤트가 발생하면 디액티브 처리
                GRID.body.inlineEdit.deActive.call(this, "ESC", key);
            }
        }

        if (this.config.asidePanelWidth > 0 && "top" in css) {
            this.$.panel["aside-body-scroll"].css({ top: css.top });
        }
        if (this.xvar.frozenColumnIndex > 0 && "top" in css) {
            this.$.panel["left-body-scroll"].css({ top: css.top });
        }
        if (this.xvar.frozenRowIndex > 0 && "left" in css) {
            this.$.panel["top-body-scroll"].css({ left: css.left });
        }

        this.$.panel["body-scroll"].css(css);

        if (this.config.footSum && "left" in css) {
            this.$.panel["bottom-body-scroll"].css({ left: css.left });
        }

        // 바디 리페인팅 this.__throttledScroll 은 body init 에서 초기화
        if (this.__throttledScroll) {
            this.__throttledScroll(css, opts);
        } else {
            if (this.config.virtualScrollY && !opts.noRepaint && "top" in css) {
                repaint.call(this);
            } else if (this.config.virtualScrollX && !opts.noRepaint && "left" in css) {
                repaint.call(this);
            }
            if (opts.callback) {
                opts.callback();
            }
        }
    };

    var blur = function blur() {
        columnSelect.focusClear.call(this);
        columnSelect.clear.call(this);
        if (this.isInlineEditing) {
            inlineEdit.deActive.call(this);
        }
    };

    var moveFocus = function moveFocus(_position) {
        var focus = {
            "UD": function UD(_dy) {
                var moveResult = true,
                    focusedColumn = void 0,
                    originalColumn = void 0,
                    while_i = void 0,
                    nPanelInfo = void 0;

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }

                if (!focusedColumn) return false;

                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];
                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dy > 0) {
                    // 아래로
                    if (focusedColumn.rowIndex + (originalColumn.rowspan - 1) + _dy > this.bodyRowTable.rows.length - 1) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.doindex = focusedColumn.doindex + _dy;
                        focusedColumn.rowIndex = 0;
                        if (focusedColumn.dindex > this.list.length - 1) {
                            focusedColumn.dindex = focusedColumn.doindex = this.list.length - 1;
                            moveResult = false;
                        }
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                } else {
                    // 위로
                    if (focusedColumn.rowIndex + _dy < 0) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.doindex = focusedColumn.doindex + _dy;
                        focusedColumn.rowIndex = this.bodyRowTable.rows.length - 1;
                        if (focusedColumn.dindex < 0) {
                            focusedColumn.dindex = focusedColumn.doindex = 0;
                            moveResult = false;
                        }
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                }

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == (_dy > 0 ? 0 : 1)) {
                        focusedColumn.colIndex--;
                    } else {
                        focusedColumn.rowIndex--;
                    }

                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        moveResult = false;
                        break;
                    }
                    while_i++;
                }

                nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);

                // if mergeCells
                if (this.config.body.mergeCells && this.list.length) {
                    while (!this.$.panel[nPanelInfo.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').get(0)) {

                        if (_dy > 0) {
                            focusedColumn.dindex++;
                        } else {
                            focusedColumn.dindex--;
                        }

                        if (focusedColumn.dindex < 0 || focusedColumn.dindex > this.list.length - 1) {
                            break;
                        }
                    }
                    nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);
                }

                focusedColumn.panelName = nPanelInfo.panelName;

                // 포커스 컬럼의 위치에 따라 스크롤 처리.ㅊㅇ

                if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                    if (focusedColumn.dindex <= this.xvar.virtualPaintStartRowIndex) {
                        var newTop = (focusedColumn.dindex - this.xvar.frozenRowIndex - 1) * this.xvar.bodyTrHeight;
                        if (newTop < 0) newTop = 0;
                        scrollTo.call(this, { top: -newTop, timeoutUnUse: false });
                        GRID.scroller.resize.call(this);
                    } else if (focusedColumn.dindex + 1 > this.xvar.virtualPaintStartRowIndex + (this.xvar.virtualPaintRowCount - 2)) {
                        scrollTo.call(this, { top: (this.xvar.virtualPaintRowCount - 2 - focusedColumn.dindex) * this.xvar.bodyTrHeight, timeoutUnUse: false });
                        GRID.scroller.resize.call(this);
                    }
                }

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");

                return moveResult;
            },
            "LR": function LR(_dx) {
                var moveResult = true,
                    focusedColumn = void 0,
                    originalColumn = void 0,
                    while_i = 0,
                    isScrollPanel = false,
                    containerPanelName = "",
                    nPanelInfo = void 0;

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }
                if (!focusedColumn) return false;

                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dx < 0) {
                    focusedColumn.colIndex = focusedColumn.colIndex + _dx;
                    if (focusedColumn.colIndex < 0) {
                        focusedColumn.colIndex = 0;
                        moveResult = false;
                    }
                } else {
                    focusedColumn.colIndex = focusedColumn.colIndex + _dx;
                    if (focusedColumn.colIndex > this.colGroup.length - 1) {
                        focusedColumn.colIndex = this.colGroup.length - 1;
                        moveResult = false;
                    }
                }

                if (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    focusedColumn.rowIndex = 0;
                }

                if (this.list[focusedColumn.dindex] && this.list[focusedColumn.dindex].__isGrouping) {
                    if (_dx < 0) {
                        while (typeof this.bodyGroupingMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                            focusedColumn.colIndex--;
                            if (focusedColumn.colIndex <= 0) {
                                // find fail
                                moveResult = false;
                                break;
                            }
                        }
                    } else {
                        while (typeof this.bodyGroupingMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                            focusedColumn.colIndex++;
                            if (focusedColumn.colIndex >= this.colGroup.length) {
                                // find fail
                                moveResult = false;
                                break;
                            }
                        }
                    }
                } else {
                    if (_dx < 0) {
                        while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                            focusedColumn.colIndex--;
                            if (focusedColumn.colIndex <= 0) {
                                // find fail
                                moveResult = false;
                                break;
                            }
                        }
                    } else {
                        while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                            focusedColumn.colIndex++;
                            if (focusedColumn.colIndex >= this.colGroup.length) {
                                // find fail
                                moveResult = false;
                                break;
                            }
                        }
                    }
                }

                nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);

                // if mergeCells
                if (this.config.body.mergeCells && this.list.length && focusedColumn.dindex > 1) {
                    while (!this.$.panel[nPanelInfo.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').get(0)) {

                        focusedColumn.dindex--;

                        if (focusedColumn.dindex < 0 || focusedColumn.dindex > this.list.length - 1) {
                            break;
                        }
                    }
                    nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);
                }

                focusedColumn.panelName = nPanelInfo.panelName;

                // 포커스 컬럼의 위치에 따라 스크롤 처리
                var isScrollTo = function () {
                    if (!this.config.virtualScrollX) return false;
                    var scrollLeft = 0;
                    if (focusedColumn.colIndex + 1 > this.xvar.frozenColumnIndex) {
                        if (focusedColumn.colIndex <= this.xvar.paintStartColumnIndex && this.colGroup[focusedColumn.colIndex]) {
                            scrollLeft = -this.colGroup[Number(focusedColumn.colIndex)]._sx;
                            scrollTo.call(this, { left: scrollLeft });
                            GRID.header.scrollTo.call(this, { left: scrollLeft });
                            GRID.scroller.resize.call(this);
                            return true;
                        } else if (focusedColumn.colIndex >= this.xvar.paintEndColumnIndex && this.colGroup[Number(focusedColumn.colIndex)]) {
                            if (this.colGroup[Number(focusedColumn.colIndex)]._ex > this.xvar.bodyWidth) {
                                scrollLeft = this.colGroup[Number(focusedColumn.colIndex)]._ex - this.xvar.bodyWidth;
                                scrollTo.call(this, { left: -scrollLeft });
                                GRID.header.scrollTo.call(this, { left: -scrollLeft });
                                GRID.scroller.resize.call(this);
                            }
                            return true;
                        }
                    }
                    scrollLeft = null;
                    return false;
                }.call(this);

                containerPanelName = nPanelInfo.containerPanelName;
                isScrollPanel = nPanelInfo.isScrollPanel;

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;

                var $column = this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");

                if (!isScrollTo && $column && isScrollPanel) {
                    // 스크롤 패널 이라면~
                    // todo : 컬럼이동할 때에도 scrollTo 체크
                    var newLeft = function () {
                        if ($column.position().left + $column.outerWidth() > Math.abs(this.$.panel[focusedColumn.panelName].position().left) + this.$.panel[containerPanelName].width()) {
                            return $column.position().left + $column.outerWidth() - this.$.panel[containerPanelName].width();
                        } else if (Math.abs(this.$.panel[focusedColumn.panelName].position().left) > $column.position().left) {
                            return $column.position().left;
                        } else {
                            return;
                        }
                    }.call(this);

                    if (typeof newLeft !== "undefined") {
                        GRID.header.scrollTo.call(this, { left: -newLeft });
                        scrollTo.call(this, { left: -newLeft });
                        GRID.scroller.resize.call(this);
                    }
                }

                return moveResult;
            },
            "INDEX": function INDEX(_dindex) {
                var moveResult = true,
                    focusedColumn = void 0,
                    originalColumn = void 0,
                    while_i = void 0;

                for (var c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }
                if (!focusedColumn) {
                    focusedColumn = {
                        rowIndex: 0,
                        colIndex: 0
                    };
                }
                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];

                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dindex == "end") {
                    _dindex = this.list.length - 1;
                }

                focusedColumn.dindex = _dindex;
                focusedColumn.rowIndex = 0;

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == (_dy > 0 ? 0 : 1)) {
                        focusedColumn.colIndex--;
                    } else {
                        focusedColumn.rowIndex--;
                    }

                    if (focusedColumn.rowIndex <= 0 && focusedColumn.colIndex <= 0) {
                        // find fail
                        break;
                    }
                    while_i++;
                }

                var nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);
                focusedColumn.panelName = nPanelInfo.panelName;

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        var virtualPaintStartRowIndex = this.xvar.virtualPaintStartRowIndex || 0;

                        if (focusedColumn.dindex < virtualPaintStartRowIndex) {
                            scrollTo.call(this, { top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        } else if (focusedColumn.dindex + 1 > virtualPaintStartRowIndex + (this.xvar.virtualPaintRowCount - 2)) {
                            //debugger;
                            //console.log((focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.virtualPaintRowCount + 3));
                            var scrollTopValue = !this.config.virtualScrollY ? focusedColumn.dindex - this.xvar.frozenRowIndex : focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.virtualPaintRowCount + 3;
                            scrollTo.call(this, { top: -scrollTopValue * this.xvar.bodyTrHeight });
                            GRID.scroller.resize.call(this);
                        }
                    }
                }

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName].find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]').find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').attr('data-ax5grid-column-focused', "true");

                return moveResult;
            }
        };

        var processor = {
            "UP": function UP() {
                return focus["UD"].call(this, -1);
            },
            "DOWN": function DOWN() {
                return focus["UD"].call(this, 1);
            },
            "LEFT": function LEFT() {
                return focus["LR"].call(this, -1);
            },
            "RIGHT": function RIGHT() {
                return focus["LR"].call(this, 1);
            },
            "HOME": function HOME() {
                return focus["INDEX"].call(this, 0);
            },
            "END": function END() {
                return focus["INDEX"].call(this, "end");
            },
            "position": function position(_position) {
                return focus["INDEX"].call(this, _position);
            }
        };

        if (_position in processor) {
            return processor[_position].call(this);
        } else {
            return processor["position"].call(this, _position);
        }
    };

    var inlineEdit = {
        active: function active(_focusedColumn, _e, _initValue) {
            var self = this,
                dindex = void 0,
                doindex = void 0,
                colIndex = void 0,
                rowIndex = void 0,
                panelName = void 0,
                colspan = void 0,
                col = void 0,
                editor = void 0;

            for (var key in _focusedColumn) {
                panelName = _focusedColumn[key].panelName;
                dindex = _focusedColumn[key].dindex;
                doindex = _focusedColumn[key].doindex;
                colIndex = _focusedColumn[key].colIndex;
                rowIndex = _focusedColumn[key].rowIndex;
                colspan = _focusedColumn[key].colspan;

                // 인라인 에디팅을 멈춰야 하는 경우 조건
                col = this.colGroup[colIndex];
                if (!(editor = col.editor)) return this;

                // editor disabled 체크
                if (U.isFunction(editor.disabled)) {
                    if (editor.disabled.call({
                        list: this.list,
                        dindex: dindex,
                        item: this.list[dindex],
                        key: col.key,
                        value: _initValue
                    })) {
                        return this;
                    }
                }

                // 조건에 맞지 않는 에디팅 타입이면 반응 없음.
                if (!function (_editor, _type) {
                    if (_editor.type in GRID.inlineEditor) {
                        return GRID.inlineEditor[_editor.type].editMode == "popup";
                    }
                }(editor)) {
                    // 체크 박스 타입이면 값 변경 시도
                    if (editor.type == "checkbox") {
                        var checked = void 0,
                            newValue = void 0;
                        if (editor.config && editor.config.trueValue) {
                            if (checked = !(_initValue == editor.config.trueValue)) {
                                newValue = editor.config.trueValue;
                            } else {
                                newValue = editor.config.falseValue;
                            }
                        } else {
                            newValue = checked = _initValue == false || _initValue == "false" || _initValue < "1" ? "true" : "false";
                        }

                        GRID.data.setValue.call(self, dindex, doindex, col.key, newValue);
                        updateRowState.call(self, ["cellChecked"], dindex, doindex, {
                            key: col.key, rowIndex: rowIndex, colIndex: colIndex,
                            editorConfig: col.editor.config, checked: checked
                        });
                    }
                    return this;
                }

                if (this.list[dindex].__isGrouping) {
                    return false;
                }
                if (key in this.inlineEditing) {
                    return false;
                }

                this.inlineEditing[key] = {
                    editor: editor,
                    panelName: panelName,
                    columnKey: key,
                    column: _focusedColumn[key],
                    useReturnToSave: GRID.inlineEditor[editor.type].useReturnToSave
                };
                this.isInlineEditing = true;
            }
            if (this.isInlineEditing) {

                var originalValue = GRID.data.getValue.call(self, dindex, doindex, col.key),
                    initValue = function (__value, __editor) {
                    if (U.isNothing(__value)) {
                        __value = U.isNothing(originalValue) ? "" : originalValue;
                    }

                    if (__editor.type == "money") {
                        return U.number(__value, { "money": true });
                    } else {
                        return __value;
                    }
                }.call(this, _initValue, editor);

                this.inlineEditing[key].$inlineEditorCell = this.$["panel"][panelName].find('[data-ax5grid-tr-data-index="' + dindex + '"]').find('[data-ax5grid-column-rowindex="' + rowIndex + '"][data-ax5grid-column-colindex="' + colIndex + '"]').find('[data-ax5grid-cellholder]');

                this.inlineEditing[key].$inlineEditor = GRID.inlineEditor[editor.type].init(this, key, editor, this.inlineEditing[key].$inlineEditorCell, initValue);

                return true;
            }
        },
        deActive: function deActive(_msg, _key, _value) {
            // console.log(this.inlineEditing.column.dindex, this.inlineEditing.$inlineEditor.val());
            if (!this.inlineEditing[_key]) return this;

            var panelName = this.inlineEditing[_key].panelName,
                dindex = this.inlineEditing[_key].column.dindex,
                doindex = this.inlineEditing[_key].column.doindex,
                rowIndex = this.inlineEditing[_key].column.rowIndex,
                colIndex = this.inlineEditing[_key].column.colIndex,
                column = this.bodyRowMap[this.inlineEditing[_key].column.rowIndex + "_" + this.inlineEditing[_key].column.colIndex],
                editorValue = function ($inlineEditor) {
                if (typeof _value === "undefined") {
                    if ($inlineEditor.get(0).tagName == "SELECT" || $inlineEditor.get(0).tagName == "INPUT" || $inlineEditor.get(0).tagName == "TEXTAREA") {
                        return $inlineEditor.val();
                    } else {
                        _msg = "CANCEL";
                        return false;
                    }
                } else {
                    return _value;
                }
            }(this.inlineEditing[_key].$inlineEditor),
                newValue = function (__value, __editor) {
                if (__editor.type == "money") {
                    return U.number(__value);
                } else {
                    return __value;
                }
            }.call(this, editorValue, column.editor);

            var action = {
                "CANCEL": function CANCEL(_dindex, _column, _newValue) {
                    action["__clear"].call(this);
                },
                "RETURN": function RETURN(_dindex, _doindex, _column, _newValue) {
                    if (GRID.data.setValue.call(this, _dindex, _doindex, _column.key, _newValue)) {
                        action["__clear"].call(this);
                        GRID.body.repaintCell.call(this, panelName, _dindex, _doindex, rowIndex, colIndex, _newValue);
                    } else {
                        action["__clear"].call(this);
                    }
                },
                "__clear": function __clear() {
                    this.isInlineEditing = false;

                    if (this.inlineEditing[_key] && this.inlineEditing[_key].$inlineEditor) {
                        var bindedAx5ui = this.inlineEditing[_key].$inlineEditor.data("binded-ax5ui");
                        if (bindedAx5ui == "ax5picker") {
                            this.inlineEditing[_key].$inlineEditor.ax5picker("close");
                        } else if (bindedAx5ui == "ax5select") {
                            this.inlineEditing[_key].$inlineEditor.ax5select("close");
                        }
                        this.inlineEditing[_key].$inlineEditor.remove();
                        this.inlineEditing[_key].$inlineEditor = null;
                        this.inlineEditing[_key].$inlineEditorCell = null;
                    }

                    this.inlineEditing[_key] = undefined;
                    delete this.inlineEditing[_key]; // delete 지원안하는 브라우저 테스트..
                }
            };

            if (_msg in action) {
                action[_msg || "RETURN"].call(this, dindex, doindex, column, newValue);
            } else {
                action["__clear"].call(this);
            }
        },
        keydown: function keydown(key, columnKey, _options) {
            var processor = {
                "ESC": function ESC() {
                    for (var columnKey in this.inlineEditing) {
                        inlineEdit.deActive.call(this, "CANCEL", columnKey);
                    }
                },
                "RETURN": function RETURN() {
                    if (this.isInlineEditing) {
                        if (this.inlineEditing[columnKey] && this.inlineEditing[columnKey].useReturnToSave) {
                            // todo : 네이밍 검증 할 필요있음.
                            inlineEdit.deActive.call(this, "RETURN", columnKey);
                        } else {
                            return false;
                        }
                    } else {

                        for (var k in this.focusedColumn) {
                            var _column = this.focusedColumn[k],
                                column = this.bodyRowMap[_column.rowIndex + "_" + _column.colIndex],
                                _dindex3 = _column.dindex,
                                doindex = _column.doindex,
                                value = "",
                                col = this.colGroup[_column.colIndex];

                            if (column) {
                                if (!this.list[_dindex3].__isGrouping) {
                                    value = GRID.data.getValue.call(this, _dindex3, doindex, column.key);
                                }
                            }

                            if (col.editor && GRID.inlineEditor[col.editor.type].editMode === "inline") {
                                if (_options && _options.moveFocus) {} else {
                                    if (column.editor && column.editor.type == "checkbox") {
                                        value = GRID.data.getValue.call(this, _dindex3, doindex, column.key);

                                        var checked = void 0,
                                            newValue = void 0;
                                        if (column.editor.config && column.editor.config.trueValue) {
                                            // console.log(value, column.editor.config.trueValue);

                                            if (value != column.editor.config.trueValue) {
                                                newValue = column.editor.config.trueValue;
                                                checked = true;
                                            } else {
                                                newValue = column.editor.config.falseValue;
                                                checked = false;
                                            }
                                        } else {
                                            newValue = checked = value == false || value == "false" || value < "1" ? "true" : "false";
                                        }

                                        GRID.data.setValue.call(this, _dindex3, doindex, column.key, newValue);
                                        updateRowState.call(this, ["cellChecked"], _dindex3, doindex, {
                                            key: column.key, rowIndex: _column.rowIndex, colIndex: _column.colIndex,
                                            editorConfig: column.editor.config, checked: checked
                                        });
                                    }
                                }
                            } else {
                                GRID.body.inlineEdit.active.call(this, this.focusedColumn, null, value);
                            }
                        }
                    }
                    return true;
                }
            };

            if (key in processor) {
                processor[key].call(this, key, columnKey, _options);
            }
        }
    };

    var getExcelString = function getExcelString() {
        var cfg = this.config,
            list = this.list,
            bodyRowData = this.bodyRowTable,
            footSumData = this.footSumTable,
            bodyGroupingData = this.bodyGroupingTable;

        // body-scroll 의 포지션에 의존적이므로..
        var getBody = function getBody(_colGroup, _bodyRow, _groupRow, _list) {
            var SS = [],
                di = void 0,
                dl = void 0,
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0,
                val = void 0;

            //SS.push('<table border="1">');
            for (di = 0, dl = _list.length; di < dl; di++) {
                var isGroupingRow = false,
                    rowTable = void 0;

                if (_groupRow && "__isGrouping" in _list[di]) {
                    rowTable = _groupRow;
                    isGroupingRow = true;
                } else {
                    rowTable = _bodyRow;
                }

                for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                    SS.push('\n<tr>');
                    for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                        col = rowTable.rows[tri].cols[ci];
                        SS.push('<td ', 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', '>', (isGroupingRow ? getGroupingValue.call(this, _list[di], di, col) : getFieldValue.call(this, _list, _list[di], di, col, val, "text")) || '&nbsp;', '</td>');
                    }
                    SS.push('\n</tr>');
                }
            }
            //SS.push('</table>');
            return SS.join('');
        };
        var getSum = function getSum(_colGroup, _bodyRow, _list) {
            var SS = [],
                tri = void 0,
                trl = void 0,
                ci = void 0,
                cl = void 0,
                col = void 0;

            //SS.push('<table border="1">');
            for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('\n<tr>');
                for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    col = _bodyRow.rows[tri].cols[ci];
                    SS.push('<td ', 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', '>', getSumFieldValue.call(this, _list, col), '</td>');
                }
                SS.push('\n</tr>');
            }
            //SS.push('</table>');

            return SS.join('');
        };

        var po = [];
        po.push(getBody.call(this, this.headerColGroup, bodyRowData, bodyGroupingData, list));
        if (cfg.footSum) {
            // 바닥 요약
            po.push(getSum.call(this, this.headerColGroup, footSumData, list));
        }

        // right
        if (cfg.rightSum) {
            // todo : right 표현 정리
        }

        return po.join('');
    };

    var toggleCollapse = function toggleCollapse(_dindex, _doindex, _collapse) {
        if (GRID.data.toggleCollapse.call(this, _dindex, _doindex, _collapse)) {
            this.proxyList = GRID.data.getProxyList.call(this, this.list);
            this.align();
        }
    };

    // todo : tree에서 dindex만으로 구현 했을 때 오류 발생 해결. (_doindex 이용)
    var click = function click(_dindex, _doindex) {
        var that = {
            self: this,
            page: this.page,
            list: this.list,
            item: this.list[_dindex],
            dindex: _dindex
        };

        moveFocus.call(this, _dindex);
        if (this.config.body.onClick) {
            this.config.body.onClick.call(that);
        }

        that = null;
        // console.log(this.$["panel"]["body-scroll"].find('[data-ax5grid-tr-data-index="' + _dindex + '"]>td:first-child'));
    };

    var dblClick = function dblClick(_dindex, _doindex) {
        var that = {
            self: this,
            page: this.page,
            list: this.list,
            item: this.list[_dindex],
            dindex: _dindex
        };

        moveFocus.call(this, _dindex);

        if (this.config.body.onDBLClick) {
            this.config.body.onDBLClick.call(that);
        }

        that = null;
    };

    GRID.body = {
        init: init,
        repaint: repaint,
        repaintCell: repaintCell,
        repaintRow: repaintRow,
        updateRowState: updateRowState,
        updateRowStateAll: updateRowStateAll,
        scrollTo: scrollTo,
        blur: blur,
        moveFocus: moveFocus,
        inlineEdit: inlineEdit,
        getExcelString: getExcelString,
        toggleCollapse: toggleCollapse,
        click: click,
        dblClick: dblClick
    };
})();
// ax5.ui.grid.collector
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    var sum = function sum() {
        var value = 0,
            i = this.list.length;
        while (i--) {
            if (!("__groupingList" in this.list[i])) {
                value += U.number(this.list[i][this.key]);
            }
        }
        return value;
    };

    var avg = function avg() {
        var value = 0,
            i = this.list.length,
            listLength = 0;
        while (i--) {
            if (!("__groupingList" in this.list[i])) {
                value += U.number(this.list[i][this.key]);
                listLength++;
            }
        }
        return U.number(value / (listLength || 1), { "round": 2 });
    };

    GRID.collector = {
        sum: sum,
        avg: avg
    };
})();
// ax5.ui.grid.layout
(function () {

    var GRID = ax5.ui.grid,
        U = ax5.util;

    var init = function init() {};

    var clearGroupingData = function clearGroupingData(_list) {
        var i = 0,
            l = _list.length,
            returnList = [];
        for (; i < l; i++) {
            if (_list[i] && !_list[i]["__isGrouping"]) {
                if (_list[i][this.config.columnKeys.selected]) {
                    this.selectedDataIndexs.push(i);
                }
                returnList.push(jQuery.extend({}, _list[i]));
            }
        }
        return returnList;
    };

    var initData = function initData(_list) {
        this.selectedDataIndexs = [];
        // this.deletedList = [];
        // todo : deletedList 초기화 시점이 언제로 하는게 좋은가. set 메소드에서 초기화 하는 것으로 수정

        var i = 0,
            l = _list.length,
            returnList = [],
            appendIndex = 0,
            dataRealRowCount = 0,
            lineNumber = 0;

        if (this.config.body.grouping) {

            var groupingKeys = U.map(this.bodyGrouping.by, function () {
                return {
                    key: this,
                    compareString: "",
                    grouping: false,
                    list: []
                };
            });

            var gi = 0,
                gl = groupingKeys.length,
                compareString = void 0,
                appendRow = [],
                ari = void 0;
            for (; i < l + 1; i++) {
                gi = 0;

                if (_list[i] && _list[i][this.config.columnKeys.deleted]) {
                    this.deletedList.push(_list[i]);
                } else {
                    compareString = ""; // 그룹핑 구문검사용
                    appendRow = []; // 현재줄 앞에 추가해줘야 하는 줄

                    // 그룹핑 구문검사
                    for (; gi < gl; gi++) {
                        if (_list[i]) {
                            compareString += "$|$" + _list[i][groupingKeys[gi].key];
                        }

                        if (appendIndex > 0 && compareString != groupingKeys[gi].compareString) {
                            var appendRowItem = { keys: [], labels: [], list: groupingKeys[gi].list };
                            for (var ki = 0; ki < gi + 1; ki++) {
                                appendRowItem.keys.push(groupingKeys[ki].key);
                                appendRowItem.labels.push(_list[i - 1][groupingKeys[ki].key]);
                            }
                            appendRow.push(appendRowItem);
                            groupingKeys[gi].list = [];
                        }

                        groupingKeys[gi].list.push(_list[i]);
                        groupingKeys[gi].compareString = compareString;
                    }

                    // 새로 추가해야할 그룹핑 row
                    ari = appendRow.length;
                    while (ari--) {
                        returnList.push({ __isGrouping: true, __groupingList: appendRow[ari].list, __groupingBy: { keys: appendRow[ari].keys, labels: appendRow[ari].labels } });
                    }
                    //~ 그룹핑 구문 검사 완료

                    if (_list[i]) {
                        if (_list[i][this.config.columnKeys.selected]) {
                            this.selectedDataIndexs.push(i);
                        }
                        // 그룹핑이 적용된 경우 오리지널 인덱스 의미 없음 : 정렬보다 그룹핑이 더 중요하므로.
                        _list[i]["__original_index"] = _list[i]["__index"] = lineNumber;
                        returnList.push(_list[i]);

                        dataRealRowCount++;
                        appendIndex++;
                        lineNumber++;
                    }
                }
            }
        } else {
            for (; i < l; i++) {
                if (_list[i]) {
                    if (_list[i][this.config.columnKeys.deleted]) {
                        this.deletedList.push(_list[i]);
                    } else {

                        if (_list[i][this.config.columnKeys.selected]) {
                            this.selectedDataIndexs.push(i);
                        }

                        // __original_index 인덱스 키가 없다면 추가.
                        if (typeof _list[i]["__original_index"] === "undefined") {
                            _list[i]["__original_index"] = lineNumber;
                        }
                        _list[i]["__index"] = lineNumber;
                        dataRealRowCount++;
                        lineNumber++;
                        returnList.push(_list[i]);
                    }
                }
            }
        }

        // 원본 데이터의 갯수
        // grouping은 제외하고 수집됨.
        this.xvar.dataRealRowCount = dataRealRowCount;
        return returnList;
    };

    var arrangeData4tree = function arrangeData4tree(_list) {
        this.selectedDataIndexs = [];
        this.deletedList = [];
        var i = 0,
            seq = 0,
            appendIndex = 0,
            dataRealRowCount = 0,
            lineNumber = 0;

        var li = _list.length;
        var keys = this.config.tree.columnKeys;
        var hashDigit = this.config.tree.hashDigit;
        var listIndexMap = {};

        while (li--) {
            delete _list[li][keys.parentHash];
            delete _list[li][keys.selfHash];
            //delete _list[li][keys.childrenLength];
        }

        /// 루트 아이템 수집
        i = 0;
        seq = 0;
        li = _list.length;
        for (; i < li; i++) {
            if (_list[i]) {
                listIndexMap[_list[i][keys.selfKey]] = i; // 인덱싱

                if (U.isNothing(_list[i][keys.parentKey]) || _list[i][keys.parentKey] === "top") {
                    // 최상위 아이템인 경우
                    _list[i][keys.parentKey] = "top";
                    _list[i][keys.children] = [];
                    _list[i][keys.parentHash] = U.setDigit("0", hashDigit);
                    _list[i][keys.selfHash] = U.setDigit("0", hashDigit) + "." + U.setDigit(seq, hashDigit);
                    _list[i][keys.depth] = 0;
                    _list[i][keys.hidden] = false;

                    seq++;
                }
            }
        }

        /// 자식 아이템 수집
        i = 0;
        lineNumber = 0;
        for (; i < li; i++) {
            var _parent = void 0,
                _parentHash = void 0;
            if (_list[i] && _list[i][keys.parentKey] !== "top" && typeof _list[i][keys.parentHash] === "undefined") {

                if (_parent = _list[listIndexMap[_list[i][keys.parentKey]]]) {
                    _parentHash = _parent[keys.selfHash];
                    _list[i][keys.children] = [];
                    _list[i][keys.parentHash] = _parentHash;
                    _list[i][keys.selfHash] = _parentHash + "." + U.setDigit(_parent[keys.children].length, hashDigit);
                    _list[i][keys.depth] = _parent[keys.depth] + 1;
                    if (_parent[keys.collapse] || _parent[keys.hidden]) _list[i][keys.hidden] = true;
                    _parent[keys.children].push(_list[i][keys.selfKey]);
                } else {
                    _list[i][keys.parentKey] = "top";
                    _list[i][keys.children] = [];
                    _list[i][keys.parentHash] = U.setDigit("0", hashDigit);
                    _list[i][keys.selfHash] = U.setDigit("0", hashDigit) + "." + U.setDigit(seq, hashDigit);
                    _list[i][keys.hidden] = false;

                    seq++;
                }
            }

            if (_list[i]) {
                if (_list[i][this.config.columnKeys.deleted]) {
                    this.deletedList.push(_list[i]);
                    _list[i][keys.hidden] = true;
                } else if (_list[i][this.config.columnKeys.selected]) {
                    this.selectedDataIndexs.push(i);
                }

                _list[i]["__index"] = lineNumber;
                dataRealRowCount++;
                lineNumber++;
            }
        }

        this.listIndexMap = listIndexMap;
        this.xvar.dataRealRowCount = dataRealRowCount;

        return _list;
    };

    var getProxyList = function getProxyList(_list) {
        var i = 0,
            l = _list.length,
            returnList = [];
        for (; i < l; i++) {

            if (_list[i] && !_list[i][this.config.tree.columnKeys.hidden]) {
                _list[i].__origin_index__ = i;
                returnList.push(_list[i]);
            }
        }
        return returnList;
    };

    var set = function set(data) {

        var list = void 0;
        if (U.isArray(data)) {
            this.page = null;
            list = data;
        } else if ("page" in data) {
            this.page = jQuery.extend({}, data.page);
            list = data.list;
        }

        // console.log(this.list.length);

        if (this.config.tree.use) {
            this.list = arrangeData4tree.call(this, list);
            this.proxyList = getProxyList.call(this, sort.call(this, this.sortInfo, this.list));
        } else {
            this.proxyList = null;
            this.list = initData.call(this, !this.config.remoteSort && Object.keys(this.sortInfo).length ? sort.call(this, this.sortInfo, list) : list);
        }
        this.selectedDataIndexs = [];
        this.deletedList = [];

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);

        if (this.config.body.grouping) {}
        return this;
    };

    var get = function get(_type) {
        return {
            list: this.list,
            page: this.page
        };
    };

    var getList = function getList(_type) {
        var returnList = [];
        //let list = (this.proxyList) ? this.proxyList : this.list;
        var list = this.list;
        var i = 0,
            l = list.length;
        switch (_type) {
            case "modified":
                for (; i < l; i++) {
                    if (list[i] && !list[i]["__isGrouping"] && list[i][this.config.columnKeys.modified]) {
                        returnList.push(jQuery.extend({}, list[i]));
                    }
                }
                break;
            case "selected":
                for (; i < l; i++) {
                    if (list[i] && !list[i]["__isGrouping"] && list[i][this.config.columnKeys.selected]) {
                        returnList.push(jQuery.extend({}, list[i]));
                    }
                }
                break;
            case "deleted":
                //_list = GRID.data.clearGroupingData(this.list);
                returnList = [].concat(this.deletedList);
                break;
            default:
                returnList = GRID.data.clearGroupingData.call(this, list);
        }
        return returnList;
    };

    var add = function add(_row, _dindex, _options) {
        var list = this.config.body.grouping ? clearGroupingData.call(this, this.list) : this.list;
        var processor = {
            "first": function first() {
                list = [].concat(_row).concat(list);
            },
            "last": function last() {
                list = list.concat([].concat(_row));
            }
        };

        if (this.config.tree.use) {
            var _list2 = this.list.concat([].concat(_row));

            this.list = arrangeData4tree.call(this, _list2);
            this.proxyList = getProxyList.call(this, sort.call(this, this.sortInfo, this.list));
        } else {
            if (typeof _dindex === "undefined") _dindex = "last";
            if (_dindex in processor) {
                _row[this.config.columnKeys.modified] = true;
                processor[_dindex].call(this, _row);
            } else {
                if (!U.isNumber(_dindex)) {
                    throw 'invalid argument _dindex';
                }
                if (U.isArray(_row)) {
                    for (var _i = 0, _l = _row.length; _i < _l; _i++) {
                        list.splice(_dindex + _i, 0, _row[_i]);
                    }
                } else {
                    list.splice(_dindex, 0, _row);
                }
            }

            if (this.config.body.grouping) {
                list = initData.call(this, sort.call(this, this.sortInfo, list));
            } else if (_options && _options.sort && Object.keys(this.sortInfo).length) {
                list = initData.call(this, sort.call(this, this.sortInfo, list));
            } else {
                list = initData.call(this, list);
            }

            this.list = list;
        }

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    /**
     * list에서 완전 제거 하는 경우 사용.
     * ax5grid.data.remove
     */
    var remove = function remove(_dindex) {
        var list = this.config.body.grouping ? clearGroupingData.call(this, this.list) : this.list;
        var processor = {
            "first": function first() {
                if (this.config.tree.use) {
                    processor.tree.call(this, 0);
                } else {
                    list.splice(0, 1);
                }
            },
            "last": function last() {
                if (this.config.tree.use) {
                    processor.tree.call(this, list.length - 1);
                } else {
                    list.splice(list.length - 1, 1);
                }
            },
            "index": function index(_dindex) {
                if (this.config.tree.use) {
                    processor.tree.call(this, _dindex);
                } else {
                    list.splice(_dindex, 1);
                }
            },
            "selected": function selected() {
                if (this.config.tree.use) {
                    processor.tree.call(this, "selected");
                } else {
                    var __list = [],
                        i = void 0,
                        l = void 0;

                    for (i = 0, l = list.length; i < l; i++) {
                        if (!list[i][this.config.columnKeys.selected]) {
                            __list.push(list[i]);
                        }
                    }
                    list = __list;
                    __list = null;
                    i = null;
                }
            },
            "tree": function tree(_dindex) {
                var treeKeys = this.config.tree.columnKeys,
                    selfHash = list[_dindex][this.config.tree.columnKeys.selfHash];
                list = U.filter(list, function () {
                    return this[treeKeys.selfHash].substr(0, selfHash.length) != selfHash;
                });
                treeKeys = null;
                selfHash = null;
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";
        if (_dindex in processor) {
            processor[_dindex].call(this, _dindex);
        } else {
            if (!U.isNumber(_dindex)) {
                throw 'invalid argument _dindex';
            }
            processor["index"].call(this, _dindex);
        }

        if (this.config.tree.use) {
            this.list = arrangeData4tree.call(this, list);
            this.proxyList = getProxyList.call(this, sort.call(this, this.sortInfo, this.list));
        } else {
            if (this.config.body.grouping) {
                list = initData.call(this, sort.call(this, this.sortInfo, list));
            } else if (Object.keys(this.sortInfo).length) {
                list = initData.call(this, sort.call(this, this.sortInfo, list));
            } else {
                list = initData.call(this, list);
            }
            this.list = list;
        }

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    /**
     * list에서 deleted 처리 repaint
     * ax5grid.data.deleteRow
     */
    var deleteRow = function deleteRow(_dindex) {
        var list = this.config.body.grouping ? clearGroupingData.call(this, this.list) : this.list;
        var processor = {
            "first": function first() {
                if (this.config.tree.use) {
                    processor.tree.call(this, 0);
                } else {
                    list[0][this.config.columnKeys.deleted] = true;
                }
            },
            "last": function last() {
                if (this.config.tree.use) {
                    processor.tree.call(this, list.length - 1);
                } else {
                    list[list.length - 1][this.config.columnKeys.deleted] = true;
                }
            },
            "selected": function selected() {
                if (this.config.tree.use) {
                    processor.tree.call(this, "selected");
                } else {
                    var i = list.length;
                    while (i--) {
                        if (list[i][this.config.columnKeys.selected]) {
                            list[i][this.config.columnKeys.deleted] = true;
                        }
                    }
                    i = null;
                }
            },
            "tree": function tree(_dindex) {
                var keys = this.config.columnKeys,
                    treeKeys = this.config.tree.columnKeys;

                if (_dindex === "selected") {

                    var i = list.length;
                    while (i--) {
                        if (list[i][this.config.columnKeys.selected]) {
                            list[i][this.config.columnKeys.deleted] = true;

                            var selfHash = list[i][treeKeys.selfHash];
                            var ii = list.length;

                            while (ii--) {
                                if (list[ii][treeKeys.selfHash].substr(0, selfHash.length) === selfHash) {
                                    list[ii][keys.deleted] = true;
                                }
                            }

                            selfHash = null;
                            ii = null;
                        }
                    }
                    i = null;
                } else {
                    var _selfHash = list[_dindex][treeKeys.selfHash];
                    var _i2 = list.length;
                    while (_i2--) {
                        if (list[_i2][treeKeys.selfHash].substr(0, _selfHash.length) !== _selfHash) {
                            list[_i2][keys.deleted] = true;
                        }
                    }
                    _selfHash = null;
                    _i2 = null;
                }

                keys = null;
                treeKeys = null;
            }
        };

        if (typeof _dindex === "undefined") _dindex = "last";

        if (_dindex in processor) {
            processor[_dindex].call(this, _dindex);
        } else {
            if (!U.isNumber(_dindex)) {
                throw 'invalid argument _dindex';
            }
            list[_dindex][this.config.columnKeys.deleted] = true;
        }

        if (this.config.tree.use) {
            this.list = arrangeData4tree.call(this, list);
            this.proxyList = getProxyList.call(this, sort.call(this, this.sortInfo, this.list));
        } else {
            if (this.config.body.grouping) {
                list = initData.call(this, sort.call(this, this.sortInfo, list));
            } else if (Object.keys(this.sortInfo).length) {
                list = initData.call(this, sort.call(this, this.sortInfo, list));
            } else {
                list = initData.call(this, list);
            }

            this.list = list;
        }

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
        return this;
    };

    var update = function update(_row, _dindex) {
        if (!U.isNumber(_dindex)) {
            throw 'invalid argument _dindex';
        }
        //
        this.needToPaintSum = true;
        this.list.splice(_dindex, 1, _row);

        if (this.config.body.grouping) {
            this.list = initData.call(this, clearGroupingData.call(this, this.list));
        }
    };

    var updateChild = function updateChild(_dindex, _updateData, _options) {
        var keys = this.config.tree.columnKeys,
            selfHash = void 0,
            originIndex = void 0;

        if (typeof _dindex === "undefined") return false;
        originIndex = this.proxyList[_dindex].__origin_index__;

        if (this.list[originIndex][keys.children]) {
            this.proxyList = []; // 리셋 프록시

            if (_options && _options.filter) {
                if (_options.filter.call({ item: this.list[originIndex], dindex: originIndex }, this.list[originIndex])) {
                    for (var _k in _updateData) {
                        this.list[originIndex][_k] = _updateData[_k];
                    }
                }
            } else {
                for (var _k2 in _updateData) {
                    this.list[originIndex][_k2] = _updateData[_k2];
                }
            }

            selfHash = this.list[originIndex][keys.selfHash];

            var i = 0,
                l = this.list.length;
            for (; i < l; i++) {
                if (this.list[i]) {
                    if (this.list[i][keys.parentHash].substr(0, selfHash.length) === selfHash) {

                        if (_options && _options.filter) {
                            if (_options.filter.call({ item: this.list[i], dindex: i }, this.list[i])) {
                                for (var _k3 in _updateData) {
                                    this.list[i][_k3] = _updateData[_k3];
                                }
                            }
                        } else {
                            for (var _k4 in _updateData) {
                                this.list[i][_k4] = _updateData[_k4];
                            }
                        }
                    }

                    if (!this.list[i][keys.hidden]) {
                        this.proxyList.push(this.list[i]);
                    }
                }
            }

            return true;
        } else {
            return false;
        }
    };

    var setValue = function setValue(_dindex, _doindex, _key, _value) {
        var originalValue = getValue.call(this, _dindex, _doindex, _key);
        var list = this.list;
        var listIndex = typeof _doindex === "undefined" ? _dindex : _doindex;
        this.needToPaintSum = true;

        if (originalValue !== _value) {
            if (/[\.\[\]]/.test(_key)) {
                try {
                    list[listIndex][this.config.columnKeys.modified] = true;
                    Function("val", "this" + GRID.util.getRealPathForDataItem(_key) + " = val;").call(list[listIndex], _value);
                } catch (e) {}
            } else {
                list[listIndex][this.config.columnKeys.modified] = true;
                list[listIndex][_key] = _value;
            }

            if (this.onDataChanged) {
                this.onDataChanged.call({
                    self: this,
                    list: this.list,
                    dindex: _dindex,
                    doindex: _doindex,
                    item: this.list[_dindex],
                    key: _key,
                    value: _value
                });
            }
        }

        return true;
    };

    var getValue = function getValue(_dindex, _doindex, _key, _value) {
        var list = this.list;
        var listIndex = typeof _doindex === "undefined" ? _dindex : _doindex;

        if (/[\.\[\]]/.test(_key)) {
            try {
                _value = Function("", "return this" + GRID.util.getRealPathForDataItem(_key) + ";").call(list[listIndex]);
            } catch (e) {}
        } else {
            _value = list[listIndex][_key];
        }
        return _value;
    };

    var clearSelect = function clearSelect() {
        this.selectedDataIndexs = [];
    };

    var select = function select(_dindex, _doindex, _selected, _options) {
        var cfg = this.config;

        if (typeof _doindex === "undefined") _doindex = _dindex;

        if (!this.list[_doindex]) return false;
        if (this.list[_doindex].__isGrouping) return false;
        if (this.list[_doindex][cfg.columnKeys.disableSelection]) return false;

        if (typeof _selected === "undefined") {
            if (this.list[_doindex][cfg.columnKeys.selected] = !this.list[_doindex][cfg.columnKeys.selected]) {
                this.selectedDataIndexs.push(_doindex);
            } else {
                this.selectedDataIndexs.splice(U.search(this.selectedDataIndexs, function () {
                    return this == _doindex;
                }), 1);
            }
        } else {
            if (this.list[_doindex][cfg.columnKeys.selected] = _selected) {
                this.selectedDataIndexs.push(_doindex);
            } else {
                this.selectedDataIndexs.splice(U.search(this.selectedDataIndexs, function () {
                    return this == _doindex;
                }), 1);
            }
        }

        if (this.onDataChanged && _options && _options.internalCall) {
            this.onDataChanged.call({
                self: this,
                list: this.list,
                dindex: _dindex,
                doindex: _doindex,
                item: this.list[_doindex],
                key: cfg.columnKeys.selected,
                value: this.list[_doindex][cfg.columnKeys.selected]
            });
        }

        return this.list[_doindex][cfg.columnKeys.selected];
    };

    var selectAll = function selectAll(_selected, _options) {
        var cfg = this.config,
            dindex = this.list.length;

        this.selectedDataIndexs = [];

        if (typeof _selected === "undefined") {
            while (dindex--) {
                if (this.list[dindex].__isGrouping) continue;
                if (_options && _options.filter) {
                    if (_options.filter.call(this.list[dindex]) !== true) {
                        continue;
                    }
                }
                if (this.list[dindex][cfg.columnKeys.disableSelection]) continue;

                if (this.list[dindex][cfg.columnKeys.selected] = !this.list[dindex][cfg.columnKeys.selected]) {
                    this.selectedDataIndexs.push(dindex);
                }
            }
        } else {
            while (dindex--) {
                if (this.list[dindex].__isGrouping) continue;
                if (_options && _options.filter) {
                    if (_options.filter.call(this.list[dindex]) !== true) {
                        continue;
                    }
                }
                if (this.list[dindex][cfg.columnKeys.disableSelection]) continue;

                if (this.list[dindex][cfg.columnKeys.selected] = _selected) {
                    this.selectedDataIndexs.push(dindex);
                }
            }
        }

        if (this.onDataChanged && _options && _options.internalCall) {
            this.onDataChanged.call({
                self: this,
                list: this.list
            });
        }

        return this.list;
    };

    var sort = function sort(_sortInfo, _list, _options) {
        var self = this,
            list = _list || this.list,
            sortInfoArray = [],
            lineNumber = 0;
        var getKeyValue = function getKeyValue(_item, _key, _value) {
            if (/[\.\[\]]/.test(_key)) {
                try {
                    _value = Function("", "return this" + GRID.util.getRealPathForDataItem(_key) + ";").call(_item);
                } catch (e) {}
            } else {
                _value = _item[_key];
            }
            return _value;
        };

        for (var k in _sortInfo) {
            sortInfoArray[_sortInfo[k].seq] = { key: k, order: _sortInfo[k].orderBy };
        }
        sortInfoArray = U.filter(sortInfoArray, function () {
            return typeof this !== "undefined";
        });

        // 정렬조건이 없으면 original_index값을 이용하여 정렬처리
        if (_options && _options.resetLineNumber && sortInfoArray.length === 0) {
            sortInfoArray[0] = { key: '__original_index', order: "asc" };
        }

        var i = 0,
            l = sortInfoArray.length,
            _a_val = void 0,
            _b_val = void 0;

        list.sort(function (_a, _b) {
            for (i = 0; i < l; i++) {
                _a_val = getKeyValue(_a, sortInfoArray[i].key);
                _b_val = getKeyValue(_b, sortInfoArray[i].key);

                if ((typeof _a_val === "undefined" ? "undefined" : _typeof(_a_val)) !== (typeof _b_val === "undefined" ? "undefined" : _typeof(_b_val))) {
                    _a_val = '' + _a_val;
                    _b_val = '' + _b_val;
                }
                if (_a_val < _b_val) {
                    return sortInfoArray[i].order === "asc" ? -1 : 1;
                } else if (_a_val > _b_val) {
                    return sortInfoArray[i].order === "asc" ? 1 : -1;
                }
            }
        });

        if (_options && _options.resetLineNumber) {
            i = 0, l = list.length, lineNumber = 0;
            for (; i < l; i++) {
                if (_list[i] && !_list[i]["__isGrouping"]) {
                    _list[i]["__index"] = lineNumber++;
                }
            }
        }

        if (_list) {
            return list;
        } else {
            this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
            this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
            this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
            GRID.page.navigationUpdate.call(this);
            return this;
        }
    };

    var append = function append(_list, _callback) {
        var self = this;

        if (this.config.tree.use) {
            var list = this.list.concat([].concat(_list));

            this.list = arrangeData4tree.call(this, list);
            this.proxyList = getProxyList.call(this, sort.call(this, this.sortInfo, this.list));
            list = null;
        } else {
            this.list = this.list.concat([].concat(_list));
        }

        this.appendProgress = true;
        GRID.page.statusUpdate.call(this);

        if (this.appendDebouncer) {
            if (self.appendDebounceTimes < this.config.debounceTime / 10) {
                clearTimeout(this.appendDebouncer);
                self.appendDebounceTimes++;
            } else {
                self.appendDebounceTimes = 0;
                appendIdle.call(self);
                _callback();
                return false;
            }
        }

        this.appendDebouncer = setTimeout(function () {
            self.appendDebounceTimes = 0;
            appendIdle.call(self);
            _callback();
        }, this.config.debounceTime);

        // todo : append bounce animation
    };

    var appendIdle = function appendIdle() {
        this.appendProgress = false;
        if (this.config.body.grouping) {
            this.list = initData.call(this, sort.call(this, this.sortInfo, this.list));
        } else {
            this.list = initData.call(this, this.list);
        }

        this.needToPaintSum = true;
        this.xvar.frozenRowIndex = this.config.frozenRowIndex > this.list.length ? this.list.length : this.config.frozenRowIndex;
        this.xvar.paintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        GRID.page.navigationUpdate.call(this);
    };

    var toggleCollapse = function toggleCollapse(_dindex, _doindx, _collapse) {
        var keys = this.config.tree.columnKeys,
            selfHash = void 0,
            originIndex = void 0;

        if (typeof _dindex === "undefined") return false;
        originIndex = this.proxyList[_dindex].__origin_index__;

        if (this.list[originIndex][keys.children]) {
            this.proxyList = []; // 리셋 프록시
            if (typeof _collapse == "undefined") {
                _collapse = !(this.list[originIndex][keys.collapse] || false);
            }

            this.list[originIndex][keys.collapse] = _collapse;
            selfHash = this.list[originIndex][keys.selfHash];

            var i = this.list.length;
            while (i--) {
                if (this.list[i]) {
                    // console.log(this.list[i][keys.parentHash].substr(0, selfHash.length), selfHash);
                    if (this.list[i][keys.parentHash].substr(0, selfHash.length) === selfHash) {
                        this.list[i][keys.hidden] = _collapse;
                    }

                    if (!this.list[i][keys.hidden]) {
                        this.proxyList.push(this.list[i]);
                    }
                }
            }

            return true;
        } else {
            return false;
        }
    };

    GRID.data = {
        init: init,
        set: set,
        get: get,
        getList: getList,
        getProxyList: getProxyList,
        setValue: setValue,
        getValue: getValue,
        clearSelect: clearSelect,
        select: select,
        selectAll: selectAll,
        add: add,
        remove: remove,
        deleteRow: deleteRow,
        update: update,
        updateChild: updateChild,
        sort: sort,
        initData: initData,
        clearGroupingData: clearGroupingData,
        append: append,
        toggleCollapse: toggleCollapse
    };
})();
/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.excel
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    var base64 = function base64(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    };

    var uri = "data:application/vnd.ms-excel;base64,";

    var getExcelTmpl = function getExcelTmpl() {
        return "\uFEFF\n{{#tables}}{{{body}}}{{/tables}}\n";
    };

    var tableToExcel = function tableToExcel(table, fileName) {
        var link = void 0,
            a = void 0,
            output = void 0,
            tables = [].concat(table);

        output = ax5.mustache.render(getExcelTmpl(), {
            worksheet: function () {
                var arr = [];
                tables.forEach(function (t, ti) {
                    arr.push({ name: "Sheet" + (ti + 1) });
                });
                return arr;
            }(),
            tables: function () {
                var arr = [];
                tables.forEach(function (t, ti) {
                    arr.push({ body: t });
                });
                return arr;
            }()
        });

        var isChrome = navigator.userAgent.indexOf("Chrome") > -1,
            isSafari = !isChrome && navigator.userAgent.indexOf("Safari") > -1,
            isIE = /*@cc_on!@*/false || !!document.documentMode; // this works with IE10 and IE11 both :)

        var blob1 = void 0,
            blankWindow = void 0,
            $iframe = void 0,
            iframe = void 0,
            anchor = void 0;

        if (navigator.msSaveOrOpenBlob) {
            blob1 = new Blob([output], { type: "text/html" });
            window.navigator.msSaveOrOpenBlob(blob1, fileName);
        } else if (isSafari) {
            // 사파리는 지원이 안되므로 그냥 테이블을 클립보드에 복사처리
            //tables
            blankWindow = window.open('about:blank', this.id + '-excel-export', 'width=600,height=400');
            blankWindow.document.write(output);
            blankWindow = null;
        } else {
            if (isIE && typeof Blob === "undefined") {
                //otherwise use the iframe and save
                //requires a blank iframe on page called txtArea1
                $iframe = jQuery('<iframe id="' + this.id + '-excel-export" style="display:none"></iframe>');
                jQuery(document.body).append($iframe);

                iframe = window[this.id + '-excel-export'];
                iframe.document.open("text/html", "replace");
                iframe.document.write(output);
                iframe.document.close();
                iframe.focus();
                iframe.document.execCommand("SaveAs", true, fileName);
                $iframe.remove();
            } else {
                // Attempt to use an alternative method
                anchor = document.body.appendChild(document.createElement("a"));

                // If the [download] attribute is supported, try to use it
                if ("download" in anchor) {
                    anchor.download = fileName;
                    anchor.href = URL.createObjectURL(new Blob([output], { type: 'text/csv' }));
                    anchor.click();
                    document.body.removeChild(anchor);
                }
            }
        }

        return true;
    };

    GRID.excel = {
        export: tableToExcel
    };
})();
// ax5.ui.grid.formatter
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    var money = function money() {
        if (typeof this.value !== "undefined") {
            var val = ('' + this.value).replace(/[^0-9^\.^\-]/g, ""),
                regExpPattern = new RegExp('([0-9])([0-9][0-9][0-9][,.])'),
                arrNumber = val.split('.'),
                returnValue = void 0;

            arrNumber[0] += '.';

            do {
                arrNumber[0] = arrNumber[0].replace(regExpPattern, '$1,$2');
            } while (regExpPattern.test(arrNumber[0]));

            return arrNumber.length > 1 ? arrNumber[0] + U.left(arrNumber[1], 2) : arrNumber[0].split('.')[0];
        } else {
            return "";
        }
    };

    GRID.formatter = {
        money: money
    };
})();
// ax5.ui.grid.header
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    var columnResizerEvent = {
        "on": function on(_columnResizer, _colIndex) {
            var self = this;
            var $columnResizer = $(_columnResizer);
            var columnResizerPositionLeft = $columnResizer.offset().left;
            var gridTargetOffsetLeft = self.$["container"]["root"].offset().left;
            self.xvar.columnResizerIndex = _colIndex;
            var resizeRange = {
                min: -self.colGroup[_colIndex]._width + 2,
                max: self.$["container"]["root"].width() - self.colGroup[_colIndex]._width
            };

            jQuery(document.body).bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                var mouseObj = GRID.util.getMousePosition(e);
                self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;

                if (resizeRange.min > self.xvar.__da) {
                    self.xvar.__da = resizeRange.min;
                } else if (resizeRange.max < self.xvar.__da) {
                    self.xvar.__da = resizeRange.max;
                }

                if (!self.xvar.columnResizerLived) {
                    self.$["resizer"]["horizontal"].addClass("live");
                }
                self.xvar.columnResizerLived = true;
                self.$["resizer"]["horizontal"].css({
                    left: columnResizerPositionLeft + self.xvar.__da - gridTargetOffsetLeft
                });
            }).bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                columnResizerEvent.off.call(self);
                U.stopEvent(e);
            }).bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                columnResizerEvent.off.call(self);
                U.stopEvent(e);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {
            this.$["resizer"]["horizontal"].removeClass("live");
            this.xvar.columnResizerLived = false;

            if (typeof this.xvar.__da === "undefined") {} else {
                this.setColumnWidth(this.colGroup[this.xvar.columnResizerIndex]._width + this.xvar.__da, this.xvar.columnResizerIndex);
            }

            jQuery(document.body).unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId).unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId).unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var init = function init() {
        // 헤더 초기화
        var self = this;

        this.$["container"]["header"].on("click", '[data-ax5grid-column-attr]', function (e) {
            var key = this.getAttribute("data-ax5grid-column-key"),
                colIndex = this.getAttribute("data-ax5grid-column-colindex"),

            //rowIndex = this.getAttribute("data-ax5grid-column-rowindex"),
            col = self.colGroup[colIndex];

            if (key === "__checkbox_header__" && self.config.header.selector) {
                var selected = this.getAttribute("data-ax5grid-selected");
                selected = U.isNothing(selected) ? true : selected !== "true";

                $(this).attr("data-ax5grid-selected", selected);
                self.selectAll({ selected: selected });

                selected = null;
            } else {
                if (key && col && col.sortable !== false && !col.sortFixed) {
                    if (col.sortable === true || self.config.sortable === true) {
                        toggleSort.call(self, col.key);
                    }
                }
            }

            GRID.body.blur.call(self);

            key = null;
            colIndex = null;
            col = null;
        });
        this.$["container"]["header"].on("mousedown", '[data-ax5grid-column-resizer]', function (e) {
            var colIndex = this.getAttribute("data-ax5grid-column-resizer");

            self.xvar.mousePosition = GRID.util.getMousePosition(e);
            columnResizerEvent.on.call(self, this, Number(colIndex));
            U.stopEvent(e);

            colIndex = null;
        }).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });

        resetFrozenColumn.call(this);
    };

    var resetFrozenColumn = function resetFrozenColumn() {
        var cfg = this.config,
            dividedHeaderObj = GRID.util.divideTableByFrozenColumnIndex(this.headerTable, this.xvar.frozenColumnIndex);

        this.asideHeaderData = function (dataTable) {
            var colGroup = [];
            var data = { rows: [] };
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = { cols: [] };
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        colIndex: null
                    },
                        _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.lineNumberColumnWidth,
                            _width: cfg.lineNumberColumnWidth,
                            columnAttr: "lineNumber",
                            key: "__index_header__", label: "&nbsp;"
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, {
                            width: cfg.rowSelectorColumnWidth,
                            _width: cfg.rowSelectorColumnWidth,
                            columnAttr: "rowSelector",
                            key: "__checkbox_header__", label: ""
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }

                    col = null;
                }
            }

            this.asideColGroup = colGroup;
            return data;
        }.call(this, this.headerTable);

        this.leftHeaderData = dividedHeaderObj.leftData;
        this.headerData = dividedHeaderObj.rightData;
    };

    var getFieldValue = function getFieldValue(_col) {
        return _col.key === "__checkbox_header__" ? this.config.header.selector ? "<div class=\"checkBox\" style=\"max-height: " + (_col.width - 10) + "px;min-height: " + (_col.width - 10) + "px;\"></div>" : "&nbsp;" : _col.label || "&nbsp;";
    };

    var repaint = function repaint(_reset) {
        var cfg = this.config,
            colGroup = this.colGroup;

        if (_reset) {
            resetFrozenColumn.call(this);
            this.xvar.paintStartRowIndex = undefined;
            this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        }
        var asideHeaderData = this.asideHeaderData,
            leftHeaderData = this.leftHeaderData,
            headerData = this.headerData,
            headerAlign = cfg.header.align;

        // this.asideColGroup : asideHeaderData에서 처리 함.
        this.leftHeaderColGroup = colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function repaintHeader(_elTarget, _colGroup, _bodyRow) {
            var tableWidth = 0,
                SS = [];
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
                tableWidth += _colGroup[cgi]._width;
            }
            SS.push('<col  />');
            SS.push('</colgroup>');

            for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                var trCSS_class = "";
                SS.push('<tr class="' + trCSS_class + '">');
                for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    var col = _bodyRow.rows[tri].cols[ci];
                    var cellHeight = cfg.header.columnHeight * col.rowspan - cfg.header.columnBorderWidth;
                    var colAlign = headerAlign || col.align;
                    SS.push('<td ', 'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ', 'data-ax5grid-column-row="' + tri + '" ', 'data-ax5grid-column-col="' + ci + '" ', function () {
                        return typeof col.key !== "undefined" ? 'data-ax5grid-column-key="' + col.key + '" ' : '';
                    }(), 'data-ax5grid-column-colindex="' + col.colIndex + '" ', 'data-ax5grid-column-rowindex="' + col.rowIndex + '" ', 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', 'class="' + function (_col) {
                        var tdCSS_class = "";
                        if (_col.headerStyleClass) {
                            if (U.isFunction(_col.headerStyleClass)) {
                                tdCSS_class += _col.headerStyleClass.call({
                                    column: _col,
                                    key: _col.key
                                }) + " ";
                            } else {
                                tdCSS_class += _col.headerStyleClass + " ";
                            }
                        }
                        if (cfg.header.columnBorderWidth) tdCSS_class += "hasBorder ";
                        if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                        return tdCSS_class;
                    }.call(this, col) + '" ', 'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push(function () {
                        var lineHeight = cfg.header.columnHeight - cfg.header.columnPadding * 2 - cfg.header.columnBorderWidth;
                        return '<span data-ax5grid-cellHolder="" ' + (colAlign ? 'data-ax5grid-text-align="' + colAlign + '"' : '') + ' style="height: ' + (cfg.header.columnHeight - cfg.header.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                    }(), function () {
                        var _SS = "";

                        if (!U.isNothing(col.key) && !U.isNothing(col.colIndex) && (cfg.sortable === true || col.sortable === true) && col.sortable !== false) {
                            _SS += '<span data-ax5grid-column-sort="' + col.colIndex + '" data-ax5grid-column-sort-order="' + (colGroup[col.colIndex].sort || "") + '" />';
                        }
                        return _SS;
                    }(), getFieldValue.call(this, col), '</span>');

                    if (!U.isNothing(col.colIndex)) {
                        if (cfg.enableFilter) {
                            SS.push('<span data-ax5grid-column-filter="' + col.colIndex + '" data-ax5grid-column-filter-value=""  />');
                        }
                    }

                    SS.push('</td>');
                }
                SS.push('<td ', 'data-ax5grid-column-row="null" ', 'data-ax5grid-column-col="null" ', 'style="height: ' + cfg.header.columnHeight + 'px;min-height: 1px;" ', '></td>');
                SS.push('</tr>');
            }
            SS.push('</table>');
            _elTarget.html(SS.join(''));

            /// append column-resizer
            (function () {
                var resizerHeight = cfg.header.columnHeight * _bodyRow.rows.length - cfg.header.columnBorderWidth,
                    resizerLeft = 0,
                    AS = [];

                for (var cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                    var col = _colGroup[cgi];
                    if (!U.isNothing(col.colIndex)) {
                        //_colGroup[cgi]._width
                        resizerLeft += col._width;
                        AS.push('<div data-ax5grid-column-resizer="' + col.colIndex + '" style="height:' + resizerHeight + 'px;left: ' + (resizerLeft - 4) + 'px;"  />');
                    }
                }
                _elTarget.append(AS);
            }).call(this);

            return tableWidth;
        };

        if (cfg.asidePanelWidth > 0) {
            repaintHeader.call(this, this.$.panel["aside-header"], this.asideColGroup, asideHeaderData);
        }
        if (cfg.frozenColumnIndex > 0) {
            repaintHeader.call(this, this.$.panel["left-header"], this.leftHeaderColGroup, leftHeaderData);
        }

        this.xvar.scrollContentWidth = repaintHeader.call(this, this.$.panel["header-scroll"], this.headerColGroup, headerData);

        if (cfg.rightSum) {}
    };

    var scrollTo = function scrollTo(css) {
        this.$.panel["header-scroll"].css(css);
        return this;
    };

    var toggleSort = function toggleSort(_key) {
        var sortOrder = "",
            sortInfo = {},
            seq = 0;

        for (var k in this.sortInfo) {
            if (this.sortInfo[k].fixed) {
                sortInfo[k] = this.sortInfo[k];
                seq++;
            }
        }

        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            if (this.colGroup[i].key == _key) {
                if (sortOrder == "") {
                    if (typeof this.colGroup[i].sort === "undefined") {
                        sortOrder = "desc";
                    } else if (this.colGroup[i].sort === "desc") {
                        sortOrder = "asc";
                    } else {
                        sortOrder = undefined;
                    }
                }
                this.colGroup[i].sort = sortOrder;
            } else if (!this.config.multiSort) {
                this.colGroup[i].sort = undefined;
            }

            if (typeof this.colGroup[i].sort !== "undefined") {
                if (!sortInfo[this.colGroup[i].key]) {
                    sortInfo[this.colGroup[i].key] = {
                        seq: seq++,
                        orderBy: this.colGroup[i].sort
                    };
                }
            }
        }

        this.setColumnSort(sortInfo);
        return this;
    };

    var applySortStatus = function applySortStatus(_sortInfo) {
        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            for (var _key in _sortInfo) {
                if (this.colGroup[i].key == _key) {
                    this.colGroup[i].sort = _sortInfo[_key].orderBy;
                }
            }
        }
        return this;
    };

    var select = function select(_options) {
        GRID.data.select.call(this, dindex, _options && _options.selected);
        GRID.body.updateRowState.call(this, ["selected"], dindex);
    };

    var getExcelString = function getExcelString() {
        var cfg = this.config,
            colGroup = this.colGroup,
            headerData = this.headerTable,
            getHeader = function getHeader(_colGroup, _bodyRow) {
            var SS = [];
            //SS.push('<table border="1">');
            for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('<tr>');
                for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    var col = _bodyRow.rows[tri].cols[ci];
                    SS.push('<td ', 'colspan="' + col.colspan + '" ', 'rowspan="' + col.rowspan + '" ', '>', getFieldValue.call(this, col), '</td>');
                }
                SS.push('</tr>');
            }
            //SS.push('</table>');

            return SS.join('');
        };

        return getHeader.call(this, colGroup, headerData);
    };

    GRID.header = {
        init: init,
        repaint: repaint,
        scrollTo: scrollTo,
        toggleSort: toggleSort,
        applySortStatus: applySortStatus,
        getExcelString: getExcelString
    };
})();
// ax5.ui.grid.inlineEditor
(function () {

    var GRID = ax5.ui.grid;

    var edit_text = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            if (typeof _editor.attributes !== "undefined") {
                var attributesText = "";
                for (var k in _editor.attributes) {
                    attributesText += " " + k + "='" + _editor.attributes[k] + "'";
                }
            }
            return "<input type=\"text\" data-ax5grid-editor=\"text\" value=\"" + _value + "\" " + attributesText + ">";
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.focus().select();
        }
    };

    var edit_money = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            var attributesText = "";
            if (typeof _editor.attributes !== "undefined") {
                for (var k in _editor.attributes) {
                    attributesText += " " + k + "='" + _editor.attributes[k] + "'";
                }
            }
            return '<input type="text" data-ax5grid-editor="money" value="' + _value + '" ' + attributesText + '" />';
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el = void 0;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter($.extend(true, {
                pattern: "money"
            }, _editor.config));
            _$el.focus().select();
        }
    };

    var edit_number = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            var attributesText = "";
            if (typeof _editor.attributes !== "undefined") {
                for (var k in _editor.attributes) {
                    attributesText += " " + k + "='" + _editor.attributes[k] + "'";
                }
            }
            return '<input type="text" data-ax5grid-editor="number" value="' + _value + '" ' + attributesText + '" />';
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter($.extend(true, {
                pattern: "number"
            }, _editor.config));
            _$el.focus().select();
        }
    };

    var edit_date = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="calendar" value="' + _value + '" >';
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            var self = _root;
            _$el.data("binded-ax5ui", "ax5picker");

            _$el.ax5picker($.extend(true, {
                direction: "auto",
                content: {
                    type: 'date',
                    formatter: {
                        pattern: 'date'
                    }
                },
                onStateChanged: function onStateChanged() {
                    if (this.state == "open") {
                        this.self.activePicker.attr("data-ax5grid-inline-edit-picker", "date");
                    } else if (this.state == "close") {
                        GRID.body.inlineEdit.deActive.call(self, "RETURN", _columnKey);
                    }
                }
            }, _editor.config));

            _$el.focus().select();
        }
    };

    var edit_select = {
        useReturnToSave: false,
        editMode: "popup",
        getHtml: function getHtml(_root, _columnKey, _editor, _value) {
            var po = [];
            po.push('<div data-ax5select="ax5grid-editor" data-ax5select-config="{}">');
            po.push('</div>');

            return po.join('');
        },
        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            return $el;
        },
        bindUI: function bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            var eConfig = {
                columnKeys: {
                    optionValue: "value",
                    optionText: "text",
                    optionSelected: "selected"
                }
            };
            jQuery.extend(true, eConfig, _editor.config);

            eConfig.options.forEach(function (n) {
                if (n[eConfig.columnKeys.optionValue] == _value) n[eConfig.columnKeys.optionSelected] = true;
            });

            var self = _root;
            _$el.data("binded-ax5ui", "ax5select");
            _$el.ax5select($.extend(true, {
                tabIndex: 1,
                direction: "auto",
                columnKeys: eConfig.columnKeys,
                options: eConfig.options,
                onStateChanged: function onStateChanged() {
                    if (this.state == "open") {
                        this.self.activeSelectOptionGroup.attr("data-ax5grid-inline-edit-picker", "select");
                    } else if (this.state == "changeValue") {
                        GRID.body.inlineEdit.deActive.call(self, "RETURN", _columnKey, this.value[0][eConfig.columnKeys.optionValue]);
                    } else if (this.state == "close") {
                        GRID.body.inlineEdit.deActive.call(self, "ESC", _columnKey);
                    }
                }
            }, _editor.config));
            _$el.ax5select("open");
            _$el.ax5select("setValue", _value);
            _$el.find("a").focus();
        }
    };

    var edit_checkbox = {
        editMode: "inline",
        getHtml: function getHtml(_root, _editor, _value) {

            var lineHeight = _root.config.body.columnHeight - _root.config.body.columnPadding * 2 - _root.config.body.columnBorderWidth;
            var checked;
            if (_editor.config && _editor.config.trueValue) {
                checked = _value == _editor.config.trueValue ? "true" : "false";
            } else {
                checked = _value == false || _value == "false" || _value < "1" ? "false" : "true";
            }

            var eConfig = {
                marginTop: 2,
                height: lineHeight - 4
            };
            jQuery.extend(true, eConfig, _editor.config);
            eConfig.marginTop = (lineHeight - eConfig.height) / 2;

            return '<div data-ax5grid-editor="checkbox" data-ax5grid-checked="' + checked + '" style="height:' + eConfig.height + 'px;width:' + eConfig.height + 'px;margin-top:' + eConfig.marginTop + 'px;"></div>';
        }
    };

    var edit_textarea = {
        useReturnToSave: false,
        editMode: "popup",
        _getHtml: function _getHtml(_root, _columnKey, _editor, _value) {
            // init 에서 사용하게 될 HTML 태그를 만들어 줍니다.
            return "<div data-ax5grid-editor=\"textarea\"></div>";
        },
        _bindUI: function _bindUI(_root, _columnKey, _$el, _editor, _$parent, _value) {
            // 위치와 크기를 구합니다.
            var offset = _$el.offset();
            var box = {
                width: _$el.width()
            };
            var editorHeight = 150;
            var buttonHeight = 30;

            // 새로운 엘리먼트 생성
            var $newDiv = jQuery("<div data-ax5grid-popup=\"textarea\" style=\"z-index: 9999;\">\n    <textarea style=\"width:100%;height:" + (editorHeight - buttonHeight) + "px;\" class=\"form-control\">" + _value + "</textarea>\n    <div style=\"height:" + buttonHeight + "px;padding:5px;text-align: right;\">\n        <button class=\"btn btn-default\">OK</button>\n    </div>\n</div>");
            var $newTextarea = $newDiv.find("textarea");
            // 엘리먼트에 CSS 적용
            $newDiv.css({
                position: "absolute",
                left: offset.left,
                top: offset.top,
                width: box.width,
                height: editorHeight
            });
            $newDiv.find("textarea");

            // 새로운 엘리먼트를 document.body에 append
            jQuery(document.body).append($newDiv);
            $newTextarea.focus().select();

            $newTextarea.on("blur", function (e) {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey, this.value);
                $newDiv.remove();
                ax5.util.stopEvent(e.originalEvent);
            });
            $newTextarea.on("keydown", function (e) {
                if (e.which == ax5.info.eventKeys.ESC) {
                    GRID.body.inlineEdit.deActive.call(_root, "ESC", _columnKey);
                    $newDiv.remove();
                    ax5.util.stopEvent(e.originalEvent);
                }
            });

            /// 값 변경
            /// GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey, this.value[0][eConfig.columnKeys.optionValue]);
            /// 에디팅 취소
            /// GRID.body.inlineEdit.deActive.call(_root, "ESC", _columnKey);
        },

        init: function init(_root, _columnKey, _editor, _$parent, _value) {
            // 인라인 에디팅 활성화 시작
            /**
             * _root : gridInstance
             * _columnKey : di + "_" + col.colIndex + "_" + col.rowIndex
             * _editor : col.editor
             * _$parent : 셀
             * _value : 값
             */
            var $el = void 0;
            _$parent.append($el = jQuery(this._getHtml(_root, _columnKey, _editor, _value)));
            // 셀에 HTML 컨텐츠 추가

            this._bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            // 이벤트 바인딩

            return $el;
        }
    };

    GRID.inlineEditor = {
        "text": edit_text,
        "money": edit_money,
        "number": edit_number,
        "date": edit_date,
        "select": edit_select,
        "checkbox": edit_checkbox,
        "textarea": edit_textarea
    };
})();
// ax5.ui.grid.page
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    var onclickPageMove = function onclickPageMove(_act) {
        var callback = function callback(_pageNo) {
            if (this.page.currentPage != _pageNo) {
                this.page.selectPage = _pageNo;
                if (this.config.page.onChange) {
                    this.config.page.onChange.call({
                        self: this,
                        page: this.page,
                        data: this.data
                    });
                }
            }
        };
        var processor = {
            "first": function first() {
                callback.call(this, 0);
            },
            "prev": function prev() {
                var pageNo = this.page.currentPage - 1;
                if (pageNo < 0) pageNo = 0;
                callback.call(this, pageNo);
            },
            "next": function next() {
                var pageNo = this.page.currentPage + 1;
                if (pageNo > this.page.totalPages - 1) pageNo = this.page.totalPages - 1;
                callback.call(this, pageNo);
            },
            "last": function last() {
                callback.call(this, this.page.totalPages - 1);
            }
        };

        if (_act in processor) {
            processor[_act].call(this);
        } else {
            callback.call(this, _act - 1);
        }
    };

    var navigationUpdate = function navigationUpdate() {
        var self = this;
        if (this.page) {
            var page = {
                hasPage: false,
                currentPage: this.page.currentPage,
                pageSize: this.page.pageSize,
                totalElements: this.page.totalElements,
                totalPages: this.page.totalPages,
                firstIcon: this.config.page.firstIcon,
                prevIcon: this.config.page.prevIcon || "«",
                nextIcon: this.config.page.nextIcon || "»",
                lastIcon: this.config.page.lastIcon
            };
            var navigationItemCount = this.config.page.navigationItemCount;

            page["@paging"] = function () {
                var returns = [],
                    startI = void 0,
                    endI = void 0;

                startI = page.currentPage - Math.floor(navigationItemCount / 2);
                if (startI < 0) startI = 0;
                endI = page.currentPage + navigationItemCount;
                if (endI > page.totalPages) endI = page.totalPages;

                if (endI - startI > navigationItemCount) {
                    endI = startI + navigationItemCount;
                }

                if (endI - startI < navigationItemCount) {
                    startI = endI - navigationItemCount;
                }
                if (startI < 0) startI = 0;

                for (var p = startI, l = endI; p < l; p++) {
                    returns.push({ 'pageNo': p + 1, 'selected': page.currentPage == p });
                }
                return returns;
            }();

            if (page["@paging"].length > 0) {
                page.hasPage = true;
            }

            this.$["page"]["navigation"].html(GRID.tmpl.get("page_navigation", page));
            this.$["page"]["navigation"].find("[data-ax5grid-page-move]").on("click", function () {
                onclickPageMove.call(self, this.getAttribute("data-ax5grid-page-move"));
            });
        } else {
            this.$["page"]["navigation"].empty();
        }
    };

    var statusUpdate = function statusUpdate() {
        if (!this.config.page.statusDisplay) {
            return;
        }

        var toRowIndex = void 0,
            rangeCount = Math.min(this.xvar.dataRowCount, this.xvar.virtualPaintRowCount);
        var data = {};

        toRowIndex = this.xvar.virtualPaintStartRowIndex + rangeCount;

        if (toRowIndex > this.xvar.dataRowCount) {
            toRowIndex = this.xvar.dataRowCount;
        }

        data.fromRowIndex = U.number(this.xvar.virtualPaintStartRowIndex + 1, { "money": true });
        data.toRowIndex = U.number(toRowIndex, { "money": true });
        data.totalElements = false;
        data.dataRealRowCount = this.xvar.dataRowCount !== this.xvar.dataRealRowCount ? U.number(this.xvar.dataRealRowCount, { "money": true }) : false;
        data.dataRowCount = U.number(this.xvar.dataRowCount, { "money": true });
        data.progress = this.appendProgress ? this.config.appendProgressIcon : "";

        if (this.page) {
            data.fromRowIndex_page = U.number(this.xvar.virtualPaintStartRowIndex + this.page.currentPage * this.page.pageSize + 1, { "money": true });
            data.toRowIndex_page = U.number(this.xvar.virtualPaintStartRowIndex + rangeCount + this.page.currentPage * this.page.pageSize, { "money": true });
            data.totalElements = U.number(this.page.totalElements, { "money": true });

            if (data.toRowIndex_page > this.page.totalElements) {
                data.toRowIndex_page = this.page.totalElements;
            }
        }

        this.$["page"]["status"].html(GRID.tmpl.get("page_status", data));
    };

    GRID.page = {
        navigationUpdate: navigationUpdate,
        statusUpdate: statusUpdate
    };
})();
// ax5.ui.grid.scroller
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    var convertScrollPosition = {
        "vertical": function vertical(css, _var) {
            var _content_height = _var._content_height - _var._panel_height,
                _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight,
                top = _content_height * css.top / _scroller_height;

            if (top < 0) top = 0;else if (_content_height < top) {
                top = _content_height;
            }
            return {
                top: -top
            };
        },
        "horizontal": function horizontal(css, _var) {
            var _content_width = _var._content_width - _var._panel_width,
                _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth,
                left = _content_width * css.left / _scroller_width;

            if (left < 0) left = 0;else if (_content_width < left) {
                left = _content_width;
            }
            return {
                left: -left
            };
        }
    };

    var convertScrollBarPosition = {
        "vertical": function vertical(_top, _var) {

            var self = this,
                type = "vertical",
                _content_height = _var._content_height - _var._panel_height,
                _scroller_height = _var._vertical_scroller_height - _var.verticalScrollBarHeight,
                top = _scroller_height * _top / _content_height,
                scrollPositon = void 0;

            if (-top > _scroller_height) {
                top = -_scroller_height;

                scrollPositon = convertScrollPosition[type].call(this, { top: -top }, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.body.scrollTo.call(self, scrollPositon);
            }

            return -top;
        },
        "horizontal": function horizontal(_left, _var) {
            var self = this,
                type = "horizontal",
                _content_width = _var._content_width - _var._panel_width,
                _scroller_width = _var._horizontal_scroller_width - _var.horizontalScrollBarWidth,
                left = _scroller_width * _left / _content_width,
                scrollPositon = void 0;

            if (-left > _scroller_width) {
                left = -_scroller_width;
                scrollPositon = convertScrollPosition[type].call(this, { left: -left }, {
                    _content_width: _var._content_width,
                    _content_height: _var._content_height,
                    _panel_width: _var._panel_width,
                    _panel_height: _var._panel_height,
                    _horizontal_scroller_width: _var._horizontal_scroller_width,
                    _vertical_scroller_height: _var._vertical_scroller_height,
                    verticalScrollBarHeight: _var.verticalScrollBarHeight,
                    horizontalScrollBarWidth: _var.horizontalScrollBarWidth
                });

                GRID.header.scrollTo.call(self, scrollPositon);
                GRID.body.scrollTo.call(self, scrollPositon);
            }

            return -left;
        }
    };

    var scrollBarMover = {
        "click": function click(track, bar, type, e) {

            // 마우스 무브 완료 타임과 클릭타임 차이가 20 보다 작으면 클릭이벤트 막기.
            if (new Date().getTime() - GRID.scroller.moveout_timer < 20) {
                return false;
            }

            var self = this,
                trackOffset = track.offset(),
                barBox = {
                width: bar.outerWidth(), height: bar.outerHeight()
            },
                trackBox = {
                width: track.innerWidth(), height: track.innerHeight()
            },
                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].outerHeight(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].outerWidth(),
                getScrollerPosition = {
                "vertical": function vertical(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    // track을 벗어 나지 안도록 범위 체크
                    var newTop = mouseObj.clientY - trackOffset.top;
                    if (newTop < 0) {
                        newTop = 0;
                    } else if (newTop + barBox.height > trackBox.height) {
                        newTop = trackBox.height - barBox.height;
                    }
                    return { top: newTop };
                },
                "horizontal": function horizontal(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    // track을 벗어 나지 안도록 범위 체크
                    var newLeft = mouseObj.clientX - trackOffset.left;
                    if (newLeft < 0) {
                        newLeft = 0;
                    } else if (newLeft + barBox.width > trackBox.width) {
                        newLeft = trackBox.width - barBox.width;
                    }
                    return { left: newLeft };
                }
            },
                css = getScrollerPosition[type](e);

            bar.css(css);

            var scrollPositon = convertScrollPosition[type].call(self, css, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            });
            if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);
            GRID.body.scrollTo.call(self, scrollPositon);

            scrollPositon = null;
        },
        "on": function on(track, bar, type, e) {
            var self = this,
                barOffset = bar.position(),
                barBox = {
                width: bar.outerWidth(), height: bar.outerHeight()
            },
                trackBox = {
                width: track.innerWidth(), height: track.innerHeight()
            },
                _vertical_scroller_height = self.$["scroller"]["vertical"].innerHeight(),
                _panel_height = self.$["panel"]["body"].height(),
                _horizontal_scroller_width = self.$["scroller"]["horizontal"].innerWidth(),
                _panel_width = self.$["panel"]["body"].width(),
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                verticalScrollBarHeight = self.$["scroller"]["vertical-bar"].outerHeight(),
                horizontalScrollBarWidth = self.$["scroller"]["horizontal-bar"].outerWidth(),
                getScrollerPosition = {
                "vertical": function vertical(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    self.xvar.__da = mouseObj.clientY - self.xvar.mousePosition.clientY;
                    // track을 벗어 나지 안도록 범위 체크
                    var newTop = barOffset.top + self.xvar.__da;
                    if (newTop < 0) {
                        newTop = 0;
                    } else if (newTop + barBox.height > trackBox.height) {
                        newTop = trackBox.height - barBox.height;
                    }
                    return { top: newTop };
                },
                "horizontal": function horizontal(e) {
                    var mouseObj = GRID.util.getMousePosition(e);
                    self.xvar.__da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                    // track을 벗어 나지 안도록 범위 체크
                    var newLeft = barOffset.left + self.xvar.__da;
                    if (newLeft < 0) {
                        newLeft = 0;
                    } else if (newLeft + barBox.width > trackBox.width) {
                        newLeft = trackBox.width - barBox.width;
                    }
                    return { left: newLeft };
                }
            };

            self.xvar.__da = 0; // 이동량 변수 초기화 (계산이 잘못 될까바)

            jQuery(document.body).bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
                var css = getScrollerPosition[type](e);
                bar.css(css);

                var scrollPositon = convertScrollPosition[type].call(self, css, {
                    _content_width: _content_width,
                    _content_height: _content_height,
                    _panel_width: _panel_width,
                    _panel_height: _panel_height,
                    _horizontal_scroller_width: _horizontal_scroller_width,
                    _vertical_scroller_height: _vertical_scroller_height,
                    verticalScrollBarHeight: verticalScrollBarHeight,
                    horizontalScrollBarWidth: horizontalScrollBarWidth
                });

                if (type === "horizontal") GRID.header.scrollTo.call(self, scrollPositon);

                GRID.body.scrollTo.call(self, scrollPositon);
            }).bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                scrollBarMover.off.call(self, e);
            }).bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                scrollBarMover.off.call(self, e);
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off(e) {
            ax5.util.stopEvent(e.originalEvent);
            GRID.scroller.moveout_timer = new Date().getTime();

            jQuery(document.body).unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId).unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId).unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var scrollContentMover = {
        "wheel": function wheel(delta) {
            var self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.xvar.body_panel_height,
                _panel_width = self.xvar.body_panel_width,
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth;

            if (isNaN(_content_height) || isNaN(_content_width)) {
                return false;
            }

            var newLeft = void 0,
                newTop = void 0,
                _top_is_end = false,
                _left_is_end = false;

            newLeft = _body_scroll_position.left - delta.x;
            newTop = _body_scroll_position.top - delta.y;

            // newTop이 범위를 넘었는지 체크
            if (newTop >= 0) {
                newTop = 0;
                _top_is_end = true;
            } else if (newTop <= _panel_height - _content_height) {
                newTop = _panel_height - _content_height;
                if (newTop >= 0) newTop = 0;
                _top_is_end = true;
            } else {
                if (delta.y == 0) _top_is_end = true;
            }

            // newLeft이 범위를 넘었는지 체크
            if (newLeft >= 0) {
                newLeft = 0;
                _left_is_end = true;
            } else if (newLeft <= _panel_width - _content_width) {
                newLeft = _panel_width - _content_width;
                if (newLeft >= 0) newLeft = 0;
                _left_is_end = true;
            } else {
                if (delta.x == 0) _left_is_end = true;
            }

            GRID.header.scrollTo.call(self, { left: newLeft });
            GRID.body.scrollTo.call(self, { left: newLeft, top: newTop }, {
                callback: function callback() {
                    resize.call(self);
                }
            });

            return !_top_is_end || !_left_is_end;
        },
        "on": function on() {
            var self = this,
                _body_scroll_position = self.$["panel"]["body-scroll"].position(),
                _panel_height = self.xvar.body_panel_height,
                _panel_width = self.xvar.body_panel_width,
                _content_height = self.xvar.scrollContentHeight,
                _content_width = self.xvar.scrollContentWidth,
                getContentPosition = function getContentPosition(e) {
                var mouseObj = GRID.util.getMousePosition(e),
                    newLeft = void 0,
                    newTop = void 0;

                self.xvar.__x_da = mouseObj.clientX - self.xvar.mousePosition.clientX;
                self.xvar.__y_da = mouseObj.clientY - self.xvar.mousePosition.clientY;

                newLeft = _body_scroll_position.left + self.xvar.__x_da;
                newTop = _body_scroll_position.top + self.xvar.__y_da;

                // newTop이 범위를 넘었는지 체크
                if (newTop >= 0) {
                    newTop = 0;
                } else if (newTop <= _panel_height - _content_height) {
                    newTop = _panel_height - _content_height;
                    if (newTop >= 0) newTop = 0;
                }

                // newLeft이 범위를 넘었는지 체크
                if (newLeft >= 0) {
                    newLeft = 0;
                } else if (newLeft <= _panel_width - _content_width) {
                    newLeft = _panel_width - _content_width;
                    if (newLeft >= 0) newLeft = 0;
                }

                return {
                    left: newLeft, top: newTop
                };
            };

            this.xvar.__x_da = 0; // 이동량 변수 초기화
            this.xvar.__y_da = 0; // 계산이 잘못 될까바
            this.xvar.touchmoved = false;

            jQuery(document.body).on("touchmove" + ".ax5grid-" + this.instanceId, function (e) {
                var css = getContentPosition(e);

                resize.call(self);
                GRID.header.scrollTo.call(self, { left: css.left });
                GRID.body.scrollTo.call(self, css, { noRepaint: "noRepaint" });
                U.stopEvent(e.originalEvent);
                self.xvar.touchmoved = true;
            }).on("touchend" + ".ax5grid-" + this.instanceId, function (e) {
                if (self.xvar.touchmoved) {
                    var css = getContentPosition(e);

                    resize.call(self);
                    GRID.header.scrollTo.call(self, { left: css.left });
                    GRID.body.scrollTo.call(self, css);
                    U.stopEvent(e.originalEvent);
                    scrollContentMover.off.call(self);
                }
            });

            jQuery(document.body).attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        },
        "off": function off() {

            jQuery(document.body).off("touchmove" + ".ax5grid-" + this.instanceId).off("touchend" + ".ax5grid-" + this.instanceId);

            jQuery(document.body).removeAttr('unselectable').css('user-select', 'auto').off('selectstart');
        }
    };

    var init = function init() {
        var self = this,
            margin = this.config.scroller.trackPadding;

        if (margin == 0) {
            this.$["scroller"]["vertical-bar"].css({ width: this.config.scroller.size, left: -1 });
            this.$["scroller"]["horizontal-bar"].css({ height: this.config.scroller.size, top: -1 });
        } else {
            this.$["scroller"]["vertical-bar"].css({ width: this.config.scroller.size - (margin + 1), left: margin / 2 });
            this.$["scroller"]["horizontal-bar"].css({ height: this.config.scroller.size - (margin + 1), top: margin / 2 });
        }

        this.$["scroller"]["vertical-bar"].on(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollBarMover.on.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical", e);
        }.bind(this)).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });

        this.$["scroller"]["vertical"].on("click", function (e) {
            if (e.target.getAttribute("data-ax5grid-scroller") == "vertical") {
                scrollBarMover.click.call(this, this.$["scroller"]["vertical"], this.$["scroller"]["vertical-bar"], "vertical", e);
            }
        }.bind(this));

        this.$["scroller"]["horizontal-bar"].on(GRID.util.ENM["mousedown"], function (e) {
            this.xvar.mousePosition = GRID.util.getMousePosition(e);
            scrollBarMover.on.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal", e);
        }.bind(this)).on("dragstart", function (e) {
            U.stopEvent(e);
            return false;
        });

        this.$["scroller"]["horizontal"].on("click", function (e) {
            if (e.target.getAttribute("data-ax5grid-scroller") == "horizontal") {
                scrollBarMover.click.call(this, this.$["scroller"]["horizontal"], this.$["scroller"]["horizontal-bar"], "horizontal", e);
            }
        }.bind(this));

        this.$["container"]["body"].on('mousewheel DOMMouseScroll', function (e) {
            var E = e.originalEvent,
                delta = { x: 0, y: 0 };

            if (E.detail) {
                delta.y = E.detail * 10;
            } else {
                if (typeof E.deltaY === "undefined") {
                    delta.y = -E.wheelDelta;
                    delta.x = 0;
                } else {
                    delta.y = E.deltaY;
                    delta.x = E.deltaX;
                }
            }

            if (scrollContentMover.wheel.call(this, delta)) {
                U.stopEvent(e);
            }
        }.bind(this));

        if (ax5.info.supportTouch) {
            this.$["container"]["body"].on("touchstart", '[data-ax5grid-panel]', function (e) {
                self.xvar.mousePosition = GRID.util.getMousePosition(e);
                scrollContentMover.on.call(self);
            });
        }

        this.xvar.body_panel_height = this.$["panel"]["body"].height();
        this.xvar.body_panel_width = this.$["panel"]["body"].width();
    };

    var resize = function resize() {
        var _vertical_scroller_height = this.$["scroller"]["vertical"].height(),
            _horizontal_scroller_width = this.$["scroller"]["horizontal"].width(),
            _panel_height = this.$["panel"]["body"].height(),
            _panel_width = this.$["panel"]["body"].width(),
            _content_height = this.xvar.scrollContentHeight,
            _content_width = this.xvar.scrollContentWidth,
            verticalScrollBarHeight = _panel_height * _vertical_scroller_height / _content_height,
            horizontalScrollBarWidth = _panel_width * _horizontal_scroller_width / _content_width;

        if (verticalScrollBarHeight < this.config.scroller.barMinSize) verticalScrollBarHeight = this.config.scroller.barMinSize;
        if (horizontalScrollBarWidth < this.config.scroller.barMinSize) horizontalScrollBarWidth = this.config.scroller.barMinSize;

        this.$["scroller"]["vertical-bar"].css({
            top: convertScrollBarPosition.vertical.call(this, this.$.panel["body-scroll"].position().top, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            height: verticalScrollBarHeight
        });

        this.$["scroller"]["horizontal-bar"].css({
            left: convertScrollBarPosition.horizontal.call(this, this.$.panel["body-scroll"].position().left, {
                _content_width: _content_width,
                _content_height: _content_height,
                _panel_width: _panel_width,
                _panel_height: _panel_height,
                _horizontal_scroller_width: _horizontal_scroller_width,
                _vertical_scroller_height: _vertical_scroller_height,
                verticalScrollBarHeight: verticalScrollBarHeight,
                horizontalScrollBarWidth: horizontalScrollBarWidth
            }),
            width: horizontalScrollBarWidth
        });

        this.xvar.body_panel_height = _panel_height;
        this.xvar.body_panel_width = _panel_width;

        _vertical_scroller_height = null;
        _horizontal_scroller_width = null;
        _panel_height = null;
        _panel_width = null;
        _content_height = null;
        _content_width = null;
        verticalScrollBarHeight = null;
        horizontalScrollBarWidth = null;
    };

    GRID.scroller = {
        // 타이머
        moveout_timer: new Date().getTime(),
        init: init,
        resize: resize
    };
})();
// ax5.ui.grid.tmpl
(function () {

    var GRID = ax5.ui.grid;

    var main = function main() {
        return "<div data-ax5grid-container=\"root\" data-ax5grid-instance=\"{{instanceId}}\">\n            <div data-ax5grid-container=\"hidden\">\n                <textarea data-ax5grid-form=\"clipboard\"></textarea>\n            </div>\n            <div data-ax5grid-container=\"header\">\n                <div data-ax5grid-panel=\"aside-header\"></div>\n                <div data-ax5grid-panel=\"left-header\"></div>\n                <div data-ax5grid-panel=\"header\">\n                    <div data-ax5grid-panel-scroll=\"header\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-header\"></div>\n            </div>\n            <div data-ax5grid-container=\"body\">\n                <div data-ax5grid-panel=\"top-aside-body\"></div>\n                <div data-ax5grid-panel=\"top-left-body\"></div>\n                <div data-ax5grid-panel=\"top-body\">\n                    <div data-ax5grid-panel-scroll=\"top-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"top-right-body\"></div>\n                <div data-ax5grid-panel=\"aside-body\">\n                    <div data-ax5grid-panel-scroll=\"aside-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"left-body\">\n                    <div data-ax5grid-panel-scroll=\"left-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"body\">\n                    <div data-ax5grid-panel-scroll=\"body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"right-body\">\n                  <div data-ax5grid-panel-scroll=\"right-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-aside-body\"></div>\n                <div data-ax5grid-panel=\"bottom-left-body\"></div>\n                <div data-ax5grid-panel=\"bottom-body\">\n                    <div data-ax5grid-panel-scroll=\"bottom-body\"></div>\n                </div>\n                <div data-ax5grid-panel=\"bottom-right-body\"></div>\n            </div>\n            <div data-ax5grid-container=\"page\">\n                <div data-ax5grid-page=\"holder\">\n                    <div data-ax5grid-page=\"navigation\"></div>\n                    <div data-ax5grid-page=\"status\"></div>\n                </div>\n            </div>\n            <div data-ax5grid-container=\"scroller\">\n                <div data-ax5grid-scroller=\"vertical\">\n                    <div data-ax5grid-scroller=\"vertical-bar\"></div>    \n                </div>\n                <div data-ax5grid-scroller=\"horizontal\">\n                    <div data-ax5grid-scroller=\"horizontal-bar\"></div>\n                </div>\n                <div data-ax5grid-scroller=\"corner\"></div>\n            </div>\n            <div data-ax5grid-resizer=\"vertical\"></div>\n            <div data-ax5grid-resizer=\"horizontal\"></div>\n        </div>";
    };

    var page_navigation = function page_navigation() {
        return "<div data-ax5grid-page-navigation=\"holder\">\n            {{#hasPage}}\n            <div data-ax5grid-page-navigation=\"cell\">    \n                {{#firstIcon}}<button type=\"button\" data-ax5grid-page-move=\"first\">{{{firstIcon}}}</button>{{/firstIcon}}\n                <button type=\"button\" data-ax5grid-page-move=\"prev\">{{{prevIcon}}}</button>\n            </div>\n            <div data-ax5grid-page-navigation=\"cell-paging\">\n                {{#@paging}}\n                <button type=\"button\" data-ax5grid-page-move=\"{{pageNo}}\" data-ax5grid-page-selected=\"{{selected}}\">{{pageNo}}</button>\n                {{/@paging}}\n            </div>\n            <div data-ax5grid-page-navigation=\"cell\">\n                <button type=\"button\" data-ax5grid-page-move=\"next\">{{{nextIcon}}}</button>\n                {{#lastIcon}}<button type=\"button\" data-ax5grid-page-move=\"last\">{{{lastIcon}}}</button>{{/lastIcon}}\n            </div>\n            {{/hasPage}}\n        </div>";
    };

    var page_status = function page_status() {
        return "<span>{{{progress}}} {{fromRowIndex}} - {{toRowIndex}} of {{dataRowCount}} {{#totalElements}}&nbsp; Total {{.}}{{/totalElements}}</span>";
    };

    GRID.tmpl = {
        "main": main,
        "page_navigation": page_navigation,
        "page_status": page_status,

        get: function get(tmplName, data, columnKeys) {
            var template = GRID.tmpl[tmplName].call(this, columnKeys);
            ax5.mustache.parse(template);
            return ax5.mustache.render(template, data);
        }
    };
})();
// ax5.ui.grid.util
(function () {

    var GRID = ax5.ui.grid;

    var U = ax5.util;

    /**
     * @method ax5grid.util.divideTableByFrozenColumnIndex
     * @param _table
     * @param _frozenColumnIndex
     * @returns {{leftHeaderData: {rows: Array}, headerData: {rows: Array}}}
     */
    var divideTableByFrozenColumnIndex = function divideTableByFrozenColumnIndex(_table, _frozenColumnIndex) {

        var tempTable_l = { rows: [] },
            tempTable_r = { rows: [] };

        for (var r = 0, rl = _table.rows.length; r < rl; r++) {
            var row = _table.rows[r];

            tempTable_l.rows[r] = { cols: [] };
            tempTable_r.rows[r] = { cols: [] };

            for (var c = 0, cl = row.cols.length; c < cl; c++) {
                var col = jQuery.extend({}, row.cols[c]),
                    colStartIndex = col.colIndex,
                    colEndIndex = col.colIndex + col.colspan;

                if (colStartIndex < _frozenColumnIndex) {
                    if (colEndIndex <= _frozenColumnIndex) {
                        // 좌측편에 변형없이 추가
                        tempTable_l.rows[r].cols.push(col);
                    } else {
                        var leftCol = jQuery.extend({}, col),
                            rightCol = jQuery.extend({}, leftCol);

                        leftCol.colspan = _frozenColumnIndex - leftCol.colIndex;
                        rightCol.colIndex = _frozenColumnIndex;
                        rightCol.colspan = col.colspan - leftCol.colspan;

                        tempTable_l.rows[r].cols.push(leftCol);
                        if (rightCol.colspan) {
                            tempTable_r.rows[r].cols.push(rightCol);
                        }
                    }
                } else {
                    // 오른편
                    tempTable_r.rows[r].cols.push(col);
                }

                col = null;
                colStartIndex = null;
                colEndIndex = null;
            }

            row = null;
        }

        return {
            leftData: tempTable_l,
            rightData: tempTable_r
        };
    };

    var getTableByStartEndColumnIndex = function getTableByStartEndColumnIndex(_table, _startColumnIndex, _endColumnIndex) {

        var tempTable = { rows: [] };
        for (var r = 0, rl = _table.rows.length; r < rl; r++) {
            var row = _table.rows[r];

            tempTable.rows[r] = { cols: [] };
            for (var c = 0, cl = row.cols.length; c < cl; c++) {
                var col = jQuery.extend({}, row.cols[c]),
                    colStartIndex = col.colIndex,
                    colEndIndex = col.colIndex + col.colspan;

                if (_startColumnIndex <= colStartIndex || colEndIndex <= _endColumnIndex) {
                    if (_startColumnIndex <= colStartIndex && colEndIndex <= _endColumnIndex) {
                        // 변형없이 추가
                        tempTable.rows[r].cols.push(col);
                    } else if (_startColumnIndex > colStartIndex && colEndIndex > _startColumnIndex) {
                        // 앞에서 걸친경우
                        col.colspan = colEndIndex - _startColumnIndex;
                        tempTable.rows[r].cols.push(col);
                    } else if (colEndIndex > _endColumnIndex && colStartIndex <= _endColumnIndex) {
                        tempTable.rows[r].cols.push(col);
                    }
                }
            }
        }

        return tempTable;
    };

    var getMousePosition = function getMousePosition(e) {
        var mouseObj = void 0,
            originalEvent = e.originalEvent ? e.originalEvent : e;

        mouseObj = 'changedTouches' in originalEvent && originalEvent.changedTouches ? originalEvent.changedTouches[0] : originalEvent;
        // clientX, Y 쓰면 스크롤에서 문제 발생
        return {
            clientX: mouseObj.pageX,
            clientY: mouseObj.pageY
        };
    };

    var ENM = {
        "mousedown": ax5.info.supportTouch ? "touchstart" : "mousedown",
        "mousemove": ax5.info.supportTouch ? "touchmove" : "mousemove",
        "mouseup": ax5.info.supportTouch ? "touchend" : "mouseup"
    };

    var makeHeaderTable = function makeHeaderTable(_columns) {
        var columns = _columns,
            cfg = this.config,
            table = {
            rows: []
        },
            colIndex = 0,
            maekRows = function maekRows(_columns, depth, parentField) {
            var row = { cols: [] };
            var i = 0,
                l = _columns.length;
            var colspan = 1;

            for (; i < l; i++) {
                var field = jQuery.extend({}, _columns[i]);
                colspan = 1;

                if (!field.hidden) {
                    field.colspan = 1;
                    field.rowspan = 1;

                    field.rowIndex = depth;
                    field.colIndex = function () {
                        if (!parentField) {
                            return colIndex++;
                        } else {
                            colIndex = parentField.colIndex + i + 1;
                            return parentField.colIndex + i;
                        }
                    }();

                    row.cols.push(field); // 복제된 필드 삽입

                    if ('columns' in field) {
                        colspan = maekRows(field.columns, depth + 1, field);
                    } else {
                        field.width = 'width' in field ? field.width : cfg.columnMinWidth;
                    }
                    field.colspan = colspan;
                } else {}
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = { cols: [] };
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return row.cols.length - 1 + colspan;
            } else {
                return colspan;
            }
        };

        maekRows(columns, 0);

        // set rowspan
        for (var r = 0, rl = table.rows.length; r < rl; r++) {
            for (var c = 0, cl = table.rows[r].cols.length; c < cl; c++) {
                if (!('columns' in table.rows[r].cols[c])) {
                    table.rows[r].cols[c].rowspan = rl - r;
                }
            }
        }

        return table;
    };

    var makeBodyRowTable = function makeBodyRowTable(_columns) {
        var columns = _columns,
            table = {
            rows: []
        },
            colIndex = 0,
            maekRows = function maekRows(_columns, depth, parentField) {
            var row = { cols: [] },
                i = 0,
                l = _columns.length,
                colspan = 1;

            var selfMakeRow = function selfMakeRow(__columns) {
                var i = 0,
                    l = __columns.length;
                for (; i < l; i++) {
                    var field = jQuery.extend({}, __columns[i]),
                        _colspan = 1;

                    if (!field.hidden) {

                        if ('key' in field) {
                            field.colspan = 1;
                            field.rowspan = 1;

                            field.rowIndex = depth;
                            field.colIndex = function () {
                                if (!parentField) {
                                    return colIndex++;
                                } else {
                                    colIndex = parentField.colIndex + i + 1;
                                    return parentField.colIndex + i;
                                }
                            }();

                            row.cols.push(field);
                            if ('columns' in field) {
                                _colspan = maekRows(field.columns, depth + 1, field);
                            }
                            field.colspan = _colspan;
                        } else {
                            if ('columns' in field) {
                                selfMakeRow(field.columns, depth);
                            }
                        }
                    } else {}
                }
            };

            for (; i < l; i++) {
                var field = jQuery.extend({}, _columns[i]);
                colspan = 1;

                if (!field.hidden) {

                    if ('key' in field) {
                        field.colspan = 1;
                        field.rowspan = 1;

                        field.rowIndex = depth;
                        field.colIndex = function () {
                            if (!parentField) {
                                return colIndex++;
                            } else {
                                colIndex = parentField.colIndex + i + 1;
                                return parentField.colIndex + i;
                            }
                        }();

                        row.cols.push(field);
                        if ('columns' in field) {
                            colspan = maekRows(field.columns, depth + 1, field);
                        }
                        field.colspan = colspan;
                    } else {
                        if ('columns' in field) {
                            selfMakeRow(field.columns, depth);
                        }
                    }
                } else {}

                field = null;
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = { cols: [] };
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return row.cols.length - 1 + colspan;
            } else {
                return colspan;
            }
        };

        maekRows(columns, 0);

        (function (table) {
            // set rowspan
            for (var r = 0, rl = table.rows.length; r < rl; r++) {
                var row = table.rows[r];
                for (var c = 0, cl = row.cols.length; c < cl; c++) {
                    var col = row.cols[c];
                    if (!('columns' in col)) {
                        col.rowspan = rl - r;
                    }
                    col = null;
                }
                row = null;
            }
        })(table);

        return table;
    };

    var makeBodyRowMap = function makeBodyRowMap(_table) {
        var map = {};
        _table.rows.forEach(function (row) {
            row.cols.forEach(function (col) {
                map[col.rowIndex + "_" + col.colIndex] = jQuery.extend({}, col);
            });
        });
        return map;
    };

    var makeFootSumTable = function makeFootSumTable(_footSumColumns) {
        var table = {
            rows: []
        };

        for (var r = 0, rl = _footSumColumns.length; r < rl; r++) {
            var footSumRow = _footSumColumns[r],
                addC = 0;

            table.rows[r] = { cols: [] };

            for (var c = 0, cl = footSumRow.length; c < cl; c++) {
                if (addC > this.colGroup.length) break;
                var colspan = footSumRow[c].colspan || 1;
                if (footSumRow[c].label || footSumRow[c].key) {
                    table.rows[r].cols.push({
                        colspan: colspan,
                        rowspan: 1,
                        colIndex: addC,
                        columnAttr: "sum",
                        align: footSumRow[c].align,
                        label: footSumRow[c].label,
                        key: footSumRow[c].key,
                        collector: footSumRow[c].collector,
                        formatter: footSumRow[c].formatter
                    });
                } else {
                    table.rows[r].cols.push({
                        colIndex: addC,
                        colspan: colspan,
                        rowspan: 1,
                        label: "&nbsp;"
                    });
                }
                addC += colspan;
                colspan = null;
            }

            if (addC < this.colGroup.length) {
                for (var _c = addC; _c < this.colGroup.length; _c++) {
                    table.rows[r].cols.push({
                        colIndex: _c,
                        colspan: 1,
                        rowspan: 1,
                        label: "&nbsp;"
                    });
                }
            }
            footSumRow = null;
            addC = null;
        }

        return table;
    };

    var makeBodyGroupingTable = function makeBodyGroupingTable(_bodyGroupingColumns) {
        var table = {
            rows: []
        },
            r = 0,
            addC = 0;

        table.rows[r] = { cols: [] };
        for (var _c2 = 0, cl = _bodyGroupingColumns.length; _c2 < cl; _c2++) {
            if (addC > this.columns.length) break;
            var colspan = _bodyGroupingColumns[_c2].colspan || 1;
            if (_bodyGroupingColumns[_c2].label || _bodyGroupingColumns[_c2].key) {
                table.rows[r].cols.push({
                    colspan: colspan,
                    rowspan: 1,
                    rowIndex: 0,
                    colIndex: addC,
                    columnAttr: "default",
                    align: _bodyGroupingColumns[_c2].align,
                    label: _bodyGroupingColumns[_c2].label,
                    key: _bodyGroupingColumns[_c2].key,
                    collector: _bodyGroupingColumns[_c2].collector,
                    formatter: _bodyGroupingColumns[_c2].formatter
                });
            } else {
                table.rows[r].cols.push({
                    rowIndex: 0,
                    colIndex: addC,
                    colspan: colspan,
                    rowspan: 1,
                    label: "&nbsp;"
                });
            }
            addC += colspan;
        }

        if (addC < this.colGroup.length) {
            for (var c = addC; c < this.colGroup.length; c++) {
                table.rows[r].cols.push({
                    rowIndex: 0,
                    colIndex: c,
                    colspan: 1,
                    rowspan: 1,
                    label: "&nbsp;"
                });
            }
        }

        return table;
    };

    var findPanelByColumnIndex = function findPanelByColumnIndex(_dindex, _colIndex, _rowIndex) {
        var _containerPanelName = void 0,
            _isScrollPanel = false,
            _panels = [];

        if (this.xvar.frozenRowIndex > _dindex) _panels.push("top");
        if (this.xvar.frozenColumnIndex > _colIndex) _panels.push("left");
        _panels.push("body");

        if (this.xvar.frozenColumnIndex <= _colIndex || this.xvar.frozenRowIndex <= _dindex) {
            _containerPanelName = _panels.join("-");
            _panels.push("scroll");
            _isScrollPanel = true;
        }

        return {
            panelName: _panels.join("-"),
            containerPanelName: _containerPanelName,
            isScrollPanel: _isScrollPanel
        };
    };

    var getRealPathForDataItem = function getRealPathForDataItem(_dataPath) {
        var path = [],
            _path = [].concat(_dataPath.split(/[\.\[\]]/g));

        _path.forEach(function (n) {
            if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
        });
        _path = null;
        return path.join("");
    };

    GRID.util = {
        divideTableByFrozenColumnIndex: divideTableByFrozenColumnIndex,
        getTableByStartEndColumnIndex: getTableByStartEndColumnIndex,
        getMousePosition: getMousePosition,
        ENM: ENM,
        makeHeaderTable: makeHeaderTable,
        makeBodyRowTable: makeBodyRowTable,
        makeBodyRowMap: makeBodyRowMap,
        makeFootSumTable: makeFootSumTable,
        makeBodyGroupingTable: makeBodyGroupingTable,
        findPanelByColumnIndex: findPanelByColumnIndex,
        getRealPathForDataItem: getRealPathForDataItem
    };
})();