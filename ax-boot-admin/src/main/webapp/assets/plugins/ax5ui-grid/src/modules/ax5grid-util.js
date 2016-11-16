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

    var divideTableByFrozenColumnIndex = function (_table, _frozenColumnIndex) {
        var tempTable_l = {rows: []};
        var tempTable_r = {rows: []};
        for (var r = 0, rl = _table.rows.length; r < rl; r++) {
            var row = _table.rows[r];

            tempTable_l.rows[r] = {cols: []};
            tempTable_r.rows[r] = {cols: []};

            for (var c = 0, cl = row.cols.length; c < cl; c++) {
                var col = jQuery.extend({}, row.cols[c]);
                var colStartIndex = col.colIndex, colEndIndex = col.colIndex + col.colspan;

                if (colStartIndex < _frozenColumnIndex) {
                    if (colEndIndex <= _frozenColumnIndex) {
                        // 좌측편에 변형없이 추가
                        tempTable_l.rows[r].cols.push(col);
                    } else {
                        var leftCol = jQuery.extend({}, col);
                        var rightCol = jQuery.extend({}, leftCol);
                        leftCol.colspan = _frozenColumnIndex - leftCol.colIndex;
                        rightCol.colIndex = _frozenColumnIndex;
                        rightCol.colspan = col.colspan - leftCol.colspan;

                        tempTable_l.rows[r].cols.push(leftCol);
                        tempTable_r.rows[r].cols.push(rightCol);
                    }
                }
                else {
                    // 오른편
                    tempTable_r.rows[r].cols.push(col);
                }
            }
        }

        return {
            leftData: tempTable_l,
            rightData: tempTable_r
        }
    };

    var getMousePosition = function (e) {
        var mouseObj, originalEvent = (e.originalEvent) ? e.originalEvent : e;
        mouseObj = ('changedTouches' in originalEvent) ? originalEvent.changedTouches[0] : originalEvent;
        // clientX, Y 쓰면 스크롤에서 문제 발생
        return {
            clientX: mouseObj.pageX,
            clientY: mouseObj.pageY
        }
    };

    var ENM = {
        "mousedown": (ax5.info.supportTouch) ? "touchstart" : "mousedown",
        "mousemove": (ax5.info.supportTouch) ? "touchmove" : "mousemove",
        "mouseup": (ax5.info.supportTouch) ? "touchend" : "mouseup"
    };

    var makeHeaderTable = function (_columns) {
        var columns = U.deepCopy(_columns);
        var cfg = this.config;
        var table = {
            rows: []
        };
        var colIndex = 0;
        var maekRows = function (_columns, depth, parentField) {
            var row = {cols: []};
            var i = 0, l = _columns.length;

            for (; i < l; i++) {
                var field = _columns[i];
                var colspan = 1;

                if (!field.hidden) {
                    field.colspan = 1;
                    field.rowspan = 1;

                    field.rowIndex = depth;
                    field.colIndex = (function () {
                        if (!parentField) {
                            return colIndex++;
                        } else {
                            colIndex = parentField.colIndex + i + 1;
                            return parentField.colIndex + i;
                        }
                    })();

                    row.cols.push(field);

                    if ('columns' in field) {
                        colspan = maekRows(field.columns, depth + 1, field);
                    } else {
                        field.width = ('width' in field) ? field.width : cfg.columnMinWidth;
                    }
                    field.colspan = colspan;
                } else {

                }
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = {cols: []};
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return (row.cols.length - 1) + colspan;
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

    var makeBodyRowTable = function (_columns) {
        var columns = U.deepCopy(_columns);
        var table = {
            rows: []
        };
        var colIndex = 0;
        var maekRows = function (_columns, depth, parentField) {
            var row = {cols: []};
            var i = 0, l = _columns.length;

            var selfMakeRow = function (__columns) {
                var i = 0, l = __columns.length;
                for (; i < l; i++) {
                    var field = __columns[i];
                    var colspan = 1;

                    if (!field.hidden) {

                        if ('key' in field) {
                            field.colspan = 1;
                            field.rowspan = 1;

                            field.rowIndex = depth;
                            field.colIndex = (function () {
                                if (!parentField) {
                                    return colIndex++;
                                } else {
                                    colIndex = parentField.colIndex + i + 1;
                                    return parentField.colIndex + i;
                                }
                            })();

                            row.cols.push(field);
                            if ('columns' in field) {
                                colspan = maekRows(field.columns, depth + 1, field);
                            }
                            field.colspan = colspan;
                        }
                        else {
                            if ('columns' in field) {
                                selfMakeRow(field.columns, depth);
                            }
                        }
                    } else {

                    }
                }
            };

            for (; i < l; i++) {
                var field = _columns[i];
                var colspan = 1;

                if (!field.hidden) {

                    if ('key' in field) {
                        field.colspan = 1;
                        field.rowspan = 1;

                        field.rowIndex = depth;
                        field.colIndex = (function () {
                            if (!parentField) {
                                return colIndex++;
                            } else {
                                colIndex = parentField.colIndex + i + 1;
                                return parentField.colIndex + i;
                            }
                        })();

                        row.cols.push(field);
                        if ('columns' in field) {
                            colspan = maekRows(field.columns, depth + 1, field);
                        }
                        field.colspan = colspan;
                    }
                    else {
                        if ('columns' in field) {
                            selfMakeRow(field.columns, depth);
                        }
                    }
                } else {

                }
            }

            if (row.cols.length > 0) {
                if (!table.rows[depth]) {
                    table.rows[depth] = {cols: []};
                }
                table.rows[depth].cols = table.rows[depth].cols.concat(row.cols);
                return (row.cols.length - 1) + colspan;
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
                }
            }
        })(table);

        return table;
    };

    var makeBodyRowMap = function (_table) {
        var map = {};
        _table.rows.forEach(function (row) {
            row.cols.forEach(function (col) {
                map[col.rowIndex + "_" + col.colIndex] = jQuery.extend({}, col);
            });
        });
        return map;
    };

    var makeFootSumTable = function (_footSumColumns) {
        var table = {
            rows: []
        };

        for (var r = 0, rl = _footSumColumns.length; r < rl; r++) {
            var footSumRow = _footSumColumns[r];
            table.rows[r] = {cols: []};
            var addC = 0;
            for (var c = 0, cl = footSumRow.length; c < cl; c++) {
                if (addC > this.columns.length) break;
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
                        label: "&nbsp;",
                    });
                }
                addC += colspan;
            }
            addC -= 1;
            if (addC < this.columns.length + 1) {
                for (var c = addC; c < this.columns.length + 1; c++) {
                    table.rows[r].cols.push({
                        colIndex: (c + 1),
                        colspan: 1,
                        rowspan: 1,
                        label: "&nbsp;",
                    });
                }
            }
        }
        return table;
    };

    var makeBodyGroupingTable = function (_bodyGroupingColumns) {
        var table = {
            rows: []
        };

        var r = 0;
        table.rows[r] = {cols: []};
        var addC = 0;
        for (var c = 0, cl = _bodyGroupingColumns.length; c < cl; c++) {
            if (addC > this.columns.length) break;
            var colspan = _bodyGroupingColumns[c].colspan || 1;
            if (_bodyGroupingColumns[c].label || _bodyGroupingColumns[c].key) {
                table.rows[r].cols.push({
                    colspan: colspan,
                    rowspan: 1,
                    rowIndex: 0,
                    colIndex: addC,
                    columnAttr: "default",
                    align: _bodyGroupingColumns[c].align,
                    label: _bodyGroupingColumns[c].label,
                    key: _bodyGroupingColumns[c].key,
                    collector: _bodyGroupingColumns[c].collector,
                    formatter: _bodyGroupingColumns[c].formatter
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
                    colIndex: (c + 1),
                    colspan: 1,
                    rowspan: 1,
                    label: "&nbsp;",
                });
            }
        }

        return table;
    };

    var findPanelByColumnIndex = function (_dindex, _colIndex, _rowIndex) {
        var _containerPanelName;
        var _isScrollPanel = false;
        var _panels = [];

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
            containerPanelName : _containerPanelName,
            isScrollPanel: _isScrollPanel
        }
    };

    var getRealPathForDataItem = function (_dataPath) {
        var path = [];
        var _path = [].concat(_dataPath.split(/[\.\[\]]/g));
        _path.forEach(function (n) {
            if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
        });
        _path = null;
        return path.join("");
    };


    GRID.util = {
        divideTableByFrozenColumnIndex: divideTableByFrozenColumnIndex,
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