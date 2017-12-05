// ax5.ui.grid.header
(function () {

    const GRID = ax5.ui.grid;

    const U = ax5.util;

    const columnResizerEvent = {
        "on": function (_columnResizer, _colIndex) {
            var self = this;
            var $columnResizer = $(_columnResizer);
            var columnResizerPositionLeft = $columnResizer.offset().left;
            var gridTargetOffsetLeft = self.$["container"]["root"].offset().left;
            self.xvar.columnResizerIndex = _colIndex;
            var resizeRange = {
                min: -self.colGroup[_colIndex]._width + 2,
                max: self.$["container"]["root"].width() - self.colGroup[_colIndex]._width,
            };

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

            if (typeof this.xvar.__da === "undefined") {

            }
            else {
                this.setColumnWidth(this.colGroup[this.xvar.columnResizerIndex]._width + this.xvar.__da, this.xvar.columnResizerIndex);
            }

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

    const init = function () {
        // 헤더 초기화
        const self = this;

        this.$["container"]["header"].on("click", '[data-ax5grid-column-attr]', function (e) {
            let key = this.getAttribute("data-ax5grid-column-key"),
                colIndex = this.getAttribute("data-ax5grid-column-colindex"),
                //rowIndex = this.getAttribute("data-ax5grid-column-rowindex"),
                col = self.colGroup[colIndex];

            if (key === "__checkbox_header__" && self.config.header.selector) {
                let selected = this.getAttribute("data-ax5grid-selected");
                selected = (U.isNothing(selected)) ? true : (selected !== "true");

                $(this).attr("data-ax5grid-selected", selected);
                self.selectAll({selected: selected});

                selected = null;
            }
            else {
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
        this.$["container"]["header"]
            .on("mousedown", '[data-ax5grid-column-resizer]', function (e) {
                let colIndex = this.getAttribute("data-ax5grid-column-resizer");

                self.xvar.mousePosition = GRID.util.getMousePosition(e);
                columnResizerEvent.on.call(self, this, Number(colIndex));
                U.stopEvent(e);

                colIndex = null;
            })
            .on("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });

        resetFrozenColumn.call(this);
    };

    const resetFrozenColumn = function () {
        let cfg = this.config,
            dividedHeaderObj = GRID.util.divideTableByFrozenColumnIndex(this.headerTable, this.xvar.frozenColumnIndex);

        this.asideHeaderData = (function (dataTable) {
            let colGroup = [];
            let data = {rows: []};
            for (let i = 0, l = dataTable.rows.length; i < l; i++) {
                data.rows[i] = {cols: []};
                if (i === 0) {
                    let col = {
                        label: "",
                        colspan: 1,
                        rowspan: dataTable.rows.length,
                        colIndex: null
                    }, _col = {};

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
        }).call(this, this.headerTable);

        this.leftHeaderData = dividedHeaderObj.leftData;
        this.headerData = dividedHeaderObj.rightData;
    };

    const getFieldValue = function (_col) {
        return (_col.key === "__checkbox_header__")
            ? ((this.config.header.selector) ? `<div class="checkBox" style="max-height: ${_col.width - 10}px;min-height: ${_col.width - 10}px;"></div>` : "&nbsp;")
            : (_col.label || "&nbsp;");
    };

    const repaint = function (_reset) {
        let cfg = this.config,
            colGroup = this.colGroup;

        if (_reset) {
            resetFrozenColumn.call(this);
            this.xvar.paintStartRowIndex = undefined;
            this.xvar.virtualPaintStartRowIndex = undefined; // 스크롤 포지션 저장변수 초기화
        }
        let asideHeaderData = this.asideHeaderData,
            leftHeaderData = this.leftHeaderData,
            headerData = this.headerData,
            headerAlign = cfg.header.align;

        // this.asideColGroup : asideHeaderData에서 처리 함.
        this.leftHeaderColGroup = colGroup.slice(0, this.config.frozenColumnIndex);
        this.headerColGroup = colGroup.slice(this.config.frozenColumnIndex);

        var repaintHeader = function (_elTarget, _colGroup, _bodyRow) {
            let tableWidth = 0,
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
                    })(), getFieldValue.call(this, col), '</span>');

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
                let resizerHeight = cfg.header.columnHeight * _bodyRow.rows.length - cfg.header.columnBorderWidth,
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

        if (cfg.rightSum) {

        }
    };

    const scrollTo = function (css) {
        this.$.panel["header-scroll"].css(css);
        return this;
    };

    const toggleSort = function (_key) {
        let sortOrder = "",
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

    const applySortStatus = function (_sortInfo) {
        for (var i = 0, l = this.colGroup.length; i < l; i++) {
            for (var _key in _sortInfo) {
                if (this.colGroup[i].key == _key) {
                    this.colGroup[i].sort = _sortInfo[_key].orderBy;
                }
            }
        }
        return this;
    };

    const select = function (_options) {
        GRID.data.select.call(this, dindex, _options && _options.selected);
        GRID.body.updateRowState.call(this, ["selected"], dindex);
    };

    const getExcelString = function () {
        let cfg = this.config,
            colGroup = this.colGroup,
            headerData = this.headerTable,
            getHeader = function (_colGroup, _bodyRow) {
                var SS = [];
                //SS.push('<table border="1">');
                for (var tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                    SS.push('<tr>');
                    for (var ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                        var col = _bodyRow.rows[tri].cols[ci];
                        SS.push('<td ',
                            'colspan="' + col.colspan + '" ',
                            'rowspan="' + col.rowspan + '" ',
                            '>', getFieldValue.call(this, col), '</td>');
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