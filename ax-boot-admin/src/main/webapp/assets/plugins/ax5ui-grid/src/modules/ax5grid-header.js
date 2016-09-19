// ax5.ui.grid.header
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var columnResizerEvent = {
        "on": function (_columnResizer, _colIndex) {
            var self = this;
            var $columnResizer = $(_columnResizer);
            var columnResizerPositionLeft = $columnResizer.offset().left;
            var gridTargetOffsetLeft = self.$["container"]["root"].offset().left;
            self.xvar.columnResizerIndex = _colIndex;
            var resizeRange = {
                min: -self.colGroup[_colIndex]._width + 2,
                max: (self.colGroup[_colIndex + 1]) ? self.colGroup[_colIndex + 1]._width : self.$["container"]["root"].width() - 2,
            };
            //console.log(resizeRange);

            jQuery(document.body)
                .bind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId, function (e) {
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
                })
                .bind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId, function (e) {
                    columnResizerEvent.off.call(self);
                    U.stopEvent(e);
                })
                .bind("mouseleave.ax5grid-" + this.instanceId, function (e) {
                    columnResizerEvent.off.call(self);
                    U.stopEvent(e);
                });

            jQuery(document.body)
                .attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);
        },
        "off": function () {
            this.$["resizer"]["horizontal"].removeClass("live");
            this.xvar.columnResizerLived = false;
            this.setColumnWidth(this.colGroup[this.xvar.columnResizerIndex]._width + this.xvar.__da, this.xvar.columnResizerIndex);

            jQuery(document.body)
                .unbind(GRID.util.ENM["mousemove"] + ".ax5grid-" + this.instanceId)
                .unbind(GRID.util.ENM["mouseup"] + ".ax5grid-" + this.instanceId)
                .unbind("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body)
                .removeAttr('unselectable')
                .css('user-select', 'auto')
                .off('selectstart');
        }
    };

    var init = function () {
        // 헤더 초기화
        var self = this;

        this.$["container"]["header"].on("click", '[data-ax5grid-column-attr]', function (e) {
            var key = this.getAttribute("data-ax5grid-column-key");
            var colIndex = this.getAttribute("data-ax5grid-column-colindex");
            var rowIndex = this.getAttribute("data-ax5grid-column-rowindex");
            var col = self.colGroup[colIndex];
            if (key && col) {
                if ((col.sortable === true || self.config.sortable === true) && col.sortable !== false) {
                    if(!col.sortFixed) toggleSort.call(self, col.key);
                }
            }
            GRID.body.blur.call(self);
        });
        this.$["container"]["header"]
            .on("mousedown", '[data-ax5grid-column-resizer]', function (e) {
                var colIndex = this.getAttribute("data-ax5grid-column-resizer");
                self.xvar.mousePosition = GRID.util.getMousePosition(e);
                columnResizerEvent.on.call(self, this, Number(colIndex));
                U.stopEvent(e);
            })
            .on("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });

        resetFrozenColumn.call(this);
    };

    var resetFrozenColumn = function(){
        var cfg = this.config;
        var dividedHeaderObj = GRID.util.divideTableByFrozenColumnIndex(this.headerTable, this.config.frozenColumnIndex);
        this.asideHeaderData = (function (dataTable) {
            var colGroup = [];
            var data = {rows: []};
            for (var i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = {cols: []};
                if (i === 0) {
                    var col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        key: "__dindex__",
                        colIndex: null
                    }, _col = {};

                    if (cfg.showLineNumber) {
                        _col = jQuery.extend({}, col, {
                            label: "&nbsp;",
                            width: cfg.lineNumberColumnWidth,
                            _width: cfg.lineNumberColumnWidth
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }
                    if (cfg.showRowSelector) {
                        _col = jQuery.extend({}, col, {
                            label: "",
                            width: cfg.rowSelectorColumnWidth,
                            _width: cfg.rowSelectorColumnWidth
                        });
                        colGroup.push(_col);
                        data.rows[i].cols.push(_col);
                    }
                }
            }

            this.asideColGroup = colGroup;
            return data;
        }).call(this, this.headerTable);
        this.leftHeaderData = dividedHeaderObj.leftData;
        this.headerData = dividedHeaderObj.rightData;
    };

    var repaint = function (_reset) {
        var cfg = this.config;
        var colGroup = this.colGroup;
        if (_reset) {
            resetFrozenColumn.call(this);
            this.xvar.paintStartRowIndex = undefined;
        }
        var asideHeaderData = this.asideHeaderData;
        var leftHeaderData = this.leftHeaderData;
        var headerData = this.headerData;
        var headerAlign = cfg.header.align;

        // this.asideColGroup : asideHeaderData에서 처리 함.
        this.leftHeaderColGroup = colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function (_elTarget, _colGroup, _bodyRow) {
            var tableWidth = 0;
            var SS = [];
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
                    SS.push('<td ',
                        'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                        'data-ax5grid-column-row="' + tri + '" ',
                        'data-ax5grid-column-col="' + ci + '" ',
                        (function () {
                            return (typeof col.key !== "undefined") ? 'data-ax5grid-column-key="' + col.key + '" ' : '';
                        })(),
                        'data-ax5grid-column-colindex="' + col.colIndex + '" ',
                        'data-ax5grid-column-rowindex="' + col.rowIndex + '" ',
                        'colspan="' + col.colspan + '" ',
                        'rowspan="' + col.rowspan + '" ',
                        'class="' + (function (_col) {
                            var tdCSS_class = "";
                            if (_col.styleClass) {
                                if (U.isFunction(_col.styleClass)) {
                                    tdCSS_class += _col.styleClass.call({
                                            column: _col,
                                            key: _col.key
                                        }) + " ";
                                } else {
                                    tdCSS_class += _col.styleClass + " ";
                                }
                            }
                            if (cfg.header.columnBorderWidth) tdCSS_class += "hasBorder ";
                            if (ci == cl - 1) tdCSS_class += "isLastColumn ";
                            return tdCSS_class;
                        }).call(this, col) + '" ',
                        'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push((function () {
                        var lineHeight = (cfg.header.columnHeight - cfg.header.columnPadding * 2 - cfg.header.columnBorderWidth);
                        return '<span data-ax5grid-cellHolder="" ' +
                            ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                            ' style="height: ' + (cfg.header.columnHeight - cfg.header.columnBorderWidth) + 'px;line-height: ' + lineHeight + 'px;">';
                    })(), (function () {
                        var _SS = "";

                        if (!U.isNothing(col.key) && !U.isNothing(col.colIndex) && (cfg.sortable === true || col.sortable === true) && col.sortable !== false) {
                            _SS += '<span data-ax5grid-column-sort="' + col.colIndex + '" data-ax5grid-column-sort-order="' + (colGroup[col.colIndex].sort || "") + '" />';
                        }
                        return _SS;
                    })(), (col.label || "&nbsp;"), '</span>');

                    if (!U.isNothing(col.colIndex)) {
                        if (cfg.enableFilter) {
                            SS.push('<span data-ax5grid-column-filter="' + col.colIndex + '" data-ax5grid-column-filter-value=""  />');
                        }
                    }

                    SS.push('</td>');
                }
                SS.push('<td ',
                    'data-ax5grid-column-row="null" ',
                    'data-ax5grid-column-col="null" ',
                    'style="height: ' + (cfg.header.columnHeight) + 'px;min-height: 1px;" ',
                    '></td>');
                SS.push('</tr>');
            }
            SS.push('</table>');
            _elTarget.html(SS.join(''));

            /// append column-resizer
            (function () {
                var resizerHeight = cfg.header.columnHeight * _bodyRow.rows.length - cfg.header.columnBorderWidth;
                var resizerLeft = 0;
                var AS = [];
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
            repaintHeader(this.$.panel["aside-header"], this.asideColGroup, asideHeaderData);
        }

        if (cfg.frozenColumnIndex > 0) {
            repaintHeader(this.$.panel["left-header"], this.leftHeaderColGroup, leftHeaderData);
        }
        this.xvar.scrollContentWidth = repaintHeader(this.$.panel["header-scroll"], this.headerColGroup, headerData);

        if (cfg.rightSum) {

        }
    };

    var scrollTo = function (css) {
        this.$.panel["header-scroll"].css(css);
        return this;
    };

    var toggleSort = function (_key) {
        var sortOrder = "";
        var sortInfo = {};
        var seq = 0;

        for(var k in this.sortInfo){
            if(this.sortInfo[k].fixed){
                sortInfo[k] = this.sortInfo[k];
                seq++;
            }
        }
        
        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            if (this.colGroup[i].key == _key) {
                if (sortOrder == "") {
                    if (typeof this.colGroup[i].sort === "undefined") {
                        sortOrder = "desc";
                    }
                    else if (this.colGroup[i].sort === "desc") {
                        sortOrder = "asc";
                    }
                    else {
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

    var applySortStatus = function (_sortInfo) {
        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            for (var _key in _sortInfo) {
                if (this.colGroup[i].key == _key) {
                    this.colGroup[i].sort = _sortInfo[_key].orderBy;
                }
            }
        }
        return this;
    };

    GRID.header = {
        init: init,
        repaint: repaint,
        scrollTo: scrollTo,
        toggleSort: toggleSort,
        applySortStatus: applySortStatus
    };

})();