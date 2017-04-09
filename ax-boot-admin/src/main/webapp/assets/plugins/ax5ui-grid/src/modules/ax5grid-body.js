// ax5.ui.grid.body
(function () {

    const GRID = ax5.ui.grid, U = ax5.util;

    const columnSelect = {
        focusClear: function () {
            let self = this, _column;
            for (let c in self.focusedColumn) {
                _column = self.focusedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName]
                        .find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]')
                        .removeAttr('data-ax5grid-column-focused');
                }
            }
            self.focusedColumn = {};
        },
        clear: function () {
            let self = this, _column;
            for (let c in self.selectedColumn) {
                _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName]
                        .find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]')
                        .removeAttr('data-ax5grid-column-selected');
                }
            }
            self.selectedColumn = {};
        },
        init: function (column) {
            let self = this;
            if (this.isInlineEditing) {
                for (let editKey in this.inlineEditing) {
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
            self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex] = (function (data) {
                if (data) {
                    return false;
                } else {
                    return {
                        panelName: column.panelName,
                        dindex: column.dindex,
                        rowIndex: column.rowIndex,
                        colIndex: column.colIndex,
                        colspan: column.colspan
                    }
                }
            })(self.selectedColumn[column.dindex + "_" + column.colIndex + "_" + column.rowIndex]);

            this.$.panel[column.panelName]
                .find('[data-ax5grid-tr-data-index="' + column.dindex + '"]')
                .find('[data-ax5grid-column-rowindex="' + column.rowIndex + '"][data-ax5grid-column-colindex="' + column.colIndex + '"]')
                .attr('data-ax5grid-column-focused', "true")
                .attr('data-ax5grid-column-selected', "true");

            if (this.isInlineEditing) {
                GRID.body.inlineEdit.deActive.call(this, "RETURN");
            }
        },
        update: function (column) {
            var self = this;
            var dindex, colIndex, rowIndex, trl;

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
            colIndex = null;
            rowIndex = null;

            for (var c in self.selectedColumn) {
                var _column = self.selectedColumn[c];
                if (_column) {
                    self.$.panel[_column.panelName]
                        .find('[data-ax5grid-tr-data-index="' + _column.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + _column.rowIndex + '"][data-ax5grid-column-colindex="' + _column.colIndex + '"]')
                        .attr('data-ax5grid-column-selected', 'true');
                }
            }

        }
    };

    const columnSelector = {
        "on": function (cell) {
            let self = this;

            if (this.inlineEditing[cell.dindex + "_" + cell.colIndex + "_" + cell.rowIndex]) {
                return;
            }

            columnSelect.init.call(self, cell);

            this.$["container"]["body"]
                .on("mousemove.ax5grid-" + this.instanceId, '[data-ax5grid-column-attr="default"]', function (e) {
                    if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                        columnSelect.update.call(self, {
                            panelName: this.getAttribute("data-ax5grid-panel-name"),
                            dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                            rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                            colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                            colspan: Number(this.getAttribute("colspan"))
                        });
                        U.stopEvent(e);
                    }
                })
                .on("mouseup.ax5grid-" + this.instanceId, function () {
                    columnSelector.off.call(self);
                })
                .on("mouseleave.ax5grid-" + this.instanceId, function () {
                    columnSelector.off.call(self);
                });

            jQuery(document.body)
                .attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);
        },
        "off": function () {

            this.$["container"]["body"]
                .off("mousemove.ax5grid-" + this.instanceId)
                .off("mouseup.ax5grid-" + this.instanceId)
                .off("mouseleave.ax5grid-" + this.instanceId);

            jQuery(document.body)
                .removeAttr('unselectable')
                .css('user-select', 'auto')
                .off('selectstart');
        }
    };

    const updateRowState = function (_states, _dindex, _data) {
        let self = this,
            cfg = this.config,
            processor = {
                "selected": function (_dindex) {
                    if (this.list[_dindex]) {
                        var i = this.$.livePanelKeys.length;
                        while (i--) {
                            this.$.panel[this.$.livePanelKeys[i]]
                                .find('[data-ax5grid-tr-data-index="' + _dindex + '"]')
                                .attr("data-ax5grid-selected", this.list[_dindex][cfg.columnKeys.selected]);

                        }
                    }
                },
                "selectedClear": function () {
                    var si = this.selectedDataIndexs.length;
                    while (si--) {
                        var dindex = this.selectedDataIndexs[si];
                        var i = this.$.livePanelKeys.length;
                        while (i--) {
                            this.$.panel[this.$.livePanelKeys[i]]
                                .find('[data-ax5grid-tr-data-index="' + dindex + '"]')
                                .attr("data-ax5grid-selected", false);
                            this.list[dindex][cfg.columnKeys.selected] = false;
                        }
                    }
                },
                "cellChecked": function (_dindex, _data) {
                    var key = _data.key;
                    var rowIndex = _data.rowIndex;
                    var colIndex = _data.colIndex;

                    var panelName = (function () {
                        var _panels = [];
                        if (this.xvar.frozenRowIndex > _dindex) _panels.push("top");
                        if (this.xvar.frozenColumnIndex > colIndex) _panels.push("left");
                        _panels.push("body");
                        if (_panels[0] !== "top") _panels.push("scroll");
                        return _panels.join("-");
                    }).call(this);

                    this.$.panel[panelName]
                        .find('[data-ax5grid-tr-data-index="' + _dindex + '"]')
                        .find('[data-ax5grid-column-rowIndex="' + rowIndex + '"][data-ax5grid-column-colIndex="' + colIndex + '"]')
                        .find('[data-ax5grid-editor="checkbox"]')
                        .attr("data-ax5grid-checked", '' + _data.checked);
                }
            };

        _states.forEach(function (_state) {
            if (!processor[_state]) throw 'invaild state name';
            processor[_state].call(self, _dindex, _data);
        });
    };

    const updateRowStateAll = function (_states, _data) {
        let self = this,
            cfg = this.config,
            processor = {
                "selected": function (_dindex) {
                    GRID.body.repaint.call(this, true);
                }
            };

        _states.forEach(function (_state) {
            if (!processor[_state]) throw 'invaild state name';
            processor[_state].call(self, _data);
        });
    };

    const init = function () {
        let self = this;

        this.$["container"]["body"].on("click", '[data-ax5grid-column-attr]', function (e) {
            let panelName, attr,
                row, col, dindex, rowIndex, colIndex, disableSelection,
                targetClick = {
                    "default": function (_column) {
                        let column = self.bodyRowMap[_column.rowIndex + "_" + _column.colIndex],
                            that = {
                                self: self,
                                page: self.page,
                                list: self.list,
                                item: self.list[_column.dindex],
                                dindex: _column.dindex,
                                rowIndex: _column.rowIndex,
                                colIndex: _column.colIndex,
                                column: column,
                                value: self.list[_column.dindex][column.key]
                            };

                        if (column.editor && column.editor.type == "checkbox") { // todo : GRID.inlineEditor에서 처리 할수 있도록 구문 변경 필요.
                            let value = GRID.data.getValue.call(self, _column.dindex, column.key),
                                checked, newValue;

                            if (column.editor.config && column.editor.config.trueValue) {
                                if (checked = !(value == column.editor.config.trueValue)) {
                                    newValue = column.editor.config.trueValue;
                                } else {
                                    newValue = column.editor.config.falseValue;
                                }
                            } else {
                                newValue = checked = (value == false || value == "false" || value < "1") ? "true" : "false";
                            }

                            GRID.data.setValue.call(self, _column.dindex, column.key, newValue);

                            updateRowState.call(self, ["cellChecked"], _column.dindex, {
                                key: column.key, rowIndex: _column.rowIndex, colIndex: _column.colIndex,
                                editorConfig: column.editor.config, checked: checked
                            });
                        } else {
                            if (self.config.body.onClick) {
                                self.config.body.onClick.call(that);
                            }
                        }
                    },
                    "rowSelector": function (_column) {
                        if (self.list[_column.dindex][self.config.columnKeys.disableSelection]) {
                            return false;
                        }

                        if (!self.config.multipleSelect && self.selectedDataIndexs[0] !== _column.dindex) {
                            updateRowState.call(self, ["selectedClear"]);
                            GRID.data.clearSelect.call(self);
                        }

                        GRID.data.select.call(self, _column.dindex, undefined, {
                            internalCall: true
                        });
                        updateRowState.call(self, ["selected"], _column.dindex);
                    },
                    "lineNumber": function (_column) {

                    },
                    "tree-control": function (_column, _el) {
                        //console.log(_column);
                        toggleCollapse.call(self, _column.dindex);
                    }
                };

            panelName = this.getAttribute("data-ax5grid-panel-name");
            attr = this.getAttribute("data-ax5grid-column-attr");
            row = Number(this.getAttribute("data-ax5grid-column-row"));
            col = Number(this.getAttribute("data-ax5grid-column-col"));
            rowIndex = Number(this.getAttribute("data-ax5grid-column-rowIndex"));
            colIndex = Number(this.getAttribute("data-ax5grid-column-colIndex"));
            dindex = Number(this.getAttribute("data-ax5grid-data-index"));

            if (attr in targetClick) {
                targetClick[attr]({
                    panelName: panelName,
                    attr: attr,
                    row: row,
                    col: col,
                    dindex: dindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex
                }, this);
            }
        });
        this.$["container"]["body"].on("dblclick", '[data-ax5grid-column-attr]', function (e) {
            let panelName, attr,
                row, col, dindex, rowIndex, colIndex,
                targetDBLClick = {
                    "default": function (_column) {
                        if (self.isInlineEditing) {
                            for (let columnKey in self.inlineEditing) {
                                if (columnKey == _column.dindex + "_" + _column.colIndex + "_" + _column.rowIndex) {
                                    return this;
                                }
                            }
                        }

                        let column = self.bodyRowMap[_column.rowIndex + "_" + _column.colIndex], value = "";
                        if (column) {
                            if (!self.list[dindex].__isGrouping) {
                                value = GRID.data.getValue.call(self, dindex, column.key);
                            }
                        }

                        let editor = self.colGroup[_column.colIndex].editor;
                        if (U.isObject(editor)) {
                            GRID.body.inlineEdit.active.call(self, self.focusedColumn, e, value);
                        } else {
                            // 더블클릭 실행
                            if (self.config.body.onDBLClick) {
                                let that = {
                                    self: self,
                                    page: self.page,
                                    list: self.list,
                                    item: self.list[_column.dindex],
                                    dindex: _column.dindex,
                                    rowIndex: _column.rowIndex,
                                    colIndex: _column.colIndex,
                                    column: column,
                                    value: self.list[_column.dindex][column.key]
                                };
                                self.config.body.onDBLClick.call(that);
                            }
                        }
                    },
                    "rowSelector": function (_column) {

                    },
                    "lineNumber": function (_column) {

                    }
                };

            panelName = this.getAttribute("data-ax5grid-panel-name");
            attr = this.getAttribute("data-ax5grid-column-attr");
            row = Number(this.getAttribute("data-ax5grid-column-row"));
            col = Number(this.getAttribute("data-ax5grid-column-col"));
            rowIndex = Number(this.getAttribute("data-ax5grid-column-rowIndex"));
            colIndex = Number(this.getAttribute("data-ax5grid-column-colIndex"));
            dindex = Number(this.getAttribute("data-ax5grid-data-index"));

            if (attr in targetDBLClick) {
                targetDBLClick[attr]({
                    panelName: panelName,
                    attr: attr,
                    row: row,
                    col: col,
                    dindex: dindex,
                    rowIndex: rowIndex,
                    colIndex: colIndex
                });
            }
        });

        this.$["container"]["body"]
            .on("mousedown", '[data-ax5grid-column-attr="default"]', function (e) {
                if (self.xvar.touchmoved) return false;
                if (this.getAttribute("data-ax5grid-column-rowIndex")) {
                    columnSelector.on.call(self, {
                        panelName: this.getAttribute("data-ax5grid-panel-name"),
                        dindex: Number(this.getAttribute("data-ax5grid-data-index")),
                        rowIndex: Number(this.getAttribute("data-ax5grid-column-rowIndex")),
                        colIndex: Number(this.getAttribute("data-ax5grid-column-colIndex")),
                        colspan: Number(this.getAttribute("colspan"))
                    });
                }
            })
            .on("dragstart", function (e) {
                U.stopEvent(e);
                return false;
            });

        resetFrozenColumn.call(this);
    };

    const resetFrozenColumn = function () {
        let cfg = this.config,
            dividedBodyRowObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyRowTable, this.xvar.frozenColumnIndex);


        this.asideBodyRowData = (function (dataTable) {
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
        }).call(this, this.bodyRowTable);
        this.leftBodyRowData = dividedBodyRowObj.leftData;
        this.bodyRowData = dividedBodyRowObj.rightData;

        if (cfg.body.grouping) {
            let dividedBodyGroupingObj = GRID.util.divideTableByFrozenColumnIndex(this.bodyGroupingTable, this.xvar.frozenColumnIndex);
            this.asideBodyGroupingData = (function (dataTable) {
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
            }).call(this, this.bodyGroupingTable);
            this.leftBodyGroupingData = dividedBodyGroupingObj.leftData;
            this.bodyGroupingData = dividedBodyGroupingObj.rightData;
            this.bodyGroupingMap = GRID.util.makeBodyRowMap.call(this, this.bodyGroupingTable);
        }

        this.leftFootSumData = {};
        this.footSumData = {};
        if (this.config.footSum) {
            let dividedFootSumObj = GRID.util.divideTableByFrozenColumnIndex(this.footSumTable, this.xvar.frozenColumnIndex);
            this.leftFootSumData = dividedFootSumObj.leftData;
            this.footSumData = dividedFootSumObj.rightData;
        }
    };

    const getFieldValue = function (_list, _item, _index, _col, _value, _returnPlainText) {
        let _key = _col.key, tagsToReplace = {
            '<': '&lt;',
            '>': '&gt;'
        };

        if (_key === "__d-index__") {
            return (typeof _item["__index"] !== "undefined") ? _item["__index"] + 1 : "";
        }
        else if (_key === "__d-checkbox__") {
            return `<div class="checkBox" style="max-height: ${_col.width - 10}px;min-height: ${_col.width - 10}px;"></div>`;
        }
        else {
            if (_col.editor && (function (_editor) {
                    if (_editor.type in GRID.inlineEditor) {
                        return (GRID.inlineEditor[_editor.type].editMode == "inline");
                    }
                    return false;
                })(_col.editor)) { // editor가 inline타입이라면

                _value = _value || GRID.data.getValue.call(this, (typeof _item.__origin_index__ === "undefined") ? _index : _item.__origin_index__, _key);

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

            const valueProcessor = {
                "formatter": function () {
                    let that = {
                        key: _key,
                        value: _value || GRID.data.getValue.call(this, (typeof _item.__origin_index__ === "undefined") ? _index : _item.__origin_index__, _key),
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
                "default": function () {
                    let returnValue = "";

                    if (typeof _value !== "undefined") {
                        returnValue = _value;
                    } else {
                        _value = GRID.data.getValue.call(this, (typeof _item.__origin_index__ === "undefined") ? _index : _item.__origin_index__, _key);
                        if (_value !== null && typeof _value !== "undefined") returnValue = _value;
                    }

                    // 키값이 Boolean일때 오류 발생하여 수정.
                    return (typeof returnValue !== "string") ? returnValue : returnValue.replace(/[<>]/g, function (tag) {
                            return tagsToReplace[tag] || tag;
                        });
                },
                "treeControl": function (__value) {
                    let cfg = this.config,
                        keys = this.config.tree.columnKeys,
                        indentNodeHtml = '';

                    if (_item[keys.children].length) {
                        indentNodeHtml += '<a ' +
                            'data-ax5grid-data-index="' + _index + '" ' +
                            'data-ax5grid-column-attr="tree-control" ' +
                            'data-ax5grid-tnode-arrow="" ' +
                            'style="width: ' + cfg.tree.arrowWidth + 'px;padding-left:' + (_item[keys.depth] * cfg.tree.indentWidth) + 'px;"' +
                            '>';
                        indentNodeHtml += (_item[keys.collapse]) ? cfg.tree.icons.collapsedArrow : cfg.tree.icons.openedArrow;
                        indentNodeHtml += '</a>';
                    } else {
                        indentNodeHtml += '<span ' +
                            'data-ax5grid-tnode-arrow="" ' +
                            'style="width: ' + cfg.tree.arrowWidth + 'px;padding-left:' + (_item[keys.depth] * cfg.tree.indentWidth) + 'px;"' +
                            '>&nbsp;</span>';
                    }

                    indentNodeHtml += '<span ' +
                        'data-ax5grid-tnode-item="' + ((_item[keys.children].length) ? 'group' : 'item') + '" ' +
                        'style="width: ' + cfg.tree.iconWidth + 'px;"' +
                        '>';
                    indentNodeHtml += (_item[keys.children].length) ? (_item[keys.collapse]) ? cfg.tree.icons.collapsedGroupIcon : cfg.tree.icons.groupIcon : cfg.tree.icons.itemIcon;
                    indentNodeHtml += '</span>';

                    return indentNodeHtml + __value;
                }
            };

            let returnValue = (_col.formatter) ? valueProcessor.formatter.call(this) : valueProcessor.default.call(this);
            if (_col.treeControl) {
                returnValue = valueProcessor.treeControl.call(this, returnValue);
            }

            return returnValue;
        }

    };

    const getGroupingValue = function (_item, _index, _col) {
        let value, that, _key = _col.key, _label = _col.label;

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
        }
        else if (_key === "__d-index__") {
            return '';
        }
        else if (_key === "__d-checkbox__") {
            return '';
        }
        else {
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

    const getSumFieldValue = function (_list, _col) {
        let _key = _col.key, _label = _col.label;
        //, _collector, _formatter
        if (typeof _key === "undefined") {
            return _label;
        }
        else if (_key === "__d-index__" || _key === "__d-checkbox__") {
            return '&nbsp;';
        }
        else {
            if (_col.collector) {
                let that = {
                        key: _key,
                        list: _list
                    },
                    value;

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

    const repaint = function (_reset) {
        // debugger;
        let cfg = this.config, list = (this.proxyList) ? this.proxyList : this.list;

        /// repaint reset 타입이면 고정컬럼을 재조정
        if (_reset) {
            resetFrozenColumn.call(this);
            // 틀고정 이 변경되면 출력 시작 인덱스 값을 초기화
            this.xvar.paintStartRowIndex = undefined;
            this.xvar.paintStartColumnIndex = undefined;
        }

        /// 출력시작 인덱스
        let paintStartRowIndex = (!this.config.virtualScrollY) ? 0 : Math.floor(-(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex;
        if (isNaN(paintStartRowIndex)) return this;

        let paintStartColumnIndex = 0, paintEndColumnIndex = 0, nopaintLeftColumnsWidth = null, nopaintRightColumnsWidth = null;

        let bodyScrollLeft = -(this.$.panel["body-scroll"].position().left);

        if (this.config.virtualScrollX) { // 페인트 시작컬럼위치와 종료컬럼위치 구하기
            for (let ci = this.xvar.frozenColumnIndex; ci < this.colGroup.length; ci++) {
                // bodyScrollLeft
                this.colGroup[ci]._sx = (ci == this.xvar.frozenColumnIndex) ? 0 : this.colGroup[ci - 1]._ex;
                this.colGroup[ci]._ex = this.colGroup[ci]._sx + this.colGroup[ci]._width;

                if (this.colGroup[ci]._sx <= bodyScrollLeft && this.colGroup[ci]._ex >= bodyScrollLeft) {
                    paintStartColumnIndex = ci;
                }
                if (this.colGroup[ci]._sx <= (bodyScrollLeft + this.xvar.bodyWidth) && this.colGroup[ci]._ex >= (bodyScrollLeft + this.xvar.bodyWidth)) {
                    paintEndColumnIndex = ci;

                    if (nopaintLeftColumnsWidth === null) nopaintLeftColumnsWidth = this.colGroup[paintStartColumnIndex]._sx;
                    if (nopaintRightColumnsWidth === null) nopaintRightColumnsWidth = this.xvar.scrollContentWidth - this.colGroup[ci]._ex;
                }
            }

            if (nopaintLeftColumnsWidth === null) nopaintLeftColumnsWidth = 0;
            if (nopaintRightColumnsWidth === null) nopaintRightColumnsWidth = 0;
            this.$.panel["top-body-scroll"].css({"padding-left": nopaintLeftColumnsWidth, "padding-right": nopaintRightColumnsWidth});
            this.$.panel["body-scroll"].css({"padding-left": nopaintLeftColumnsWidth, "padding-right": nopaintRightColumnsWidth});
            this.$.panel["bottom-body-scroll"].css({"padding-left": nopaintLeftColumnsWidth, "padding-right": nopaintRightColumnsWidth});
        }

        let isFirstPaint = (typeof this.xvar.paintStartRowIndex === "undefined"),
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
            paintRowCount = (!this.config.virtualScrollY) ? list.length : Math.ceil(this.xvar.bodyHeight / this.xvar.bodyTrHeight) + 1;

        if (
            this.xvar.dataRowCount === list.length
            && this.xvar.paintStartRowIndex === paintStartRowIndex
            && this.xvar.paintRowCount === paintRowCount
            && this.xvar.paintStartColumnIndex === paintStartColumnIndex
            && this.xvar.paintEndColumnIndex === paintEndColumnIndex
        ) return this; // 스크롤 포지션 변경 여부에 따라 프로세스 진행여부 결정


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

        if (!this.config.virtualScrollX && document.addEventListener && ax5.info.supportTouch) {
            paintRowCount = paintRowCount * 2;
        }

        /// 스크롤 컨텐츠의 높이 : 그리드 스크롤의 실제 크기와는 관계 없이 데이터 갯수에 따라 스크롤 컨텐츠 높이값 구해서 저장해두기.
        this.xvar.scrollContentHeight = this.xvar.bodyTrHeight * (this.list.length - this.xvar.frozenRowIndex);
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
        let repaintBody = function (_elTargetKey, _colGroup, _bodyRow, _groupRow, _list, _scrollConfig) {
            let _elTarget = this.$.panel[_elTargetKey];

            if (!isFirstPaint && !_scrollConfig) {
                this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
                return false;
            }

            let SS = [],
                cgi, cgl, di, dl, tri, trl, ci, cl, col, cellHeight, colAlign,
                isScrolled = (function () {
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
                })();

            if (isScrolled) {
                SS.push('<div style="font-size:0;line-height:0;height: ' + (_scrollConfig.paintStartRowIndex - this.xvar.frozenRowIndex) * _scrollConfig.bodyTrHeight + 'px;"></div>');
            }

            // 가로 가상 스크롤 적용하지 않는 경우
            SS.push('<table border="0" cellpadding="0" cellspacing="0">');
            SS.push('<colgroup>');
            for (cgi = 0, cgl = _colGroup.length; cgi < cgl; cgi++) {
                SS.push('<col style="width:' + _colGroup[cgi]._width + 'px;"  />');
            }
            SS.push('<col  />');
            SS.push('</colgroup>');


            for (di = _scrollConfig.paintStartRowIndex, dl = (function () {
                let len;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            })(); di < dl; di++) {
                if (_list[di]) {
                    let isGroupingRow = false, rowTable, odi = (typeof _list[di].__origin_index__ !== "undefined") ? _list[di].__origin_index__ : di;
                    if (_groupRow && "__isGrouping" in _list[di]) {
                        rowTable = _groupRow;
                        isGroupingRow = true;
                    } else {
                        rowTable = _bodyRow;
                    }

                    for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {

                        SS.push('<tr class="tr-' + (di % 4) + '"',
                            (isGroupingRow) ? ' data-ax5grid-grouping-tr="true"' : '',
                            ' data-ax5grid-tr-data-index="' + di + '"',
                            ' data-ax5grid-selected="' + (_list[di][cfg.columnKeys.selected] || "false") + '"',
                            ' data-ax5grid-disable-selection="' + (_list[di][cfg.columnKeys.disableSelection] || "false") + '"',
                            '>');
                        for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                            col = rowTable.rows[tri].cols[ci];
                            cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                            colAlign = col.align || bodyAlign;

                            SS.push('<td ',
                                'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                                'data-ax5grid-data-index="' + di + '" ',
                                'data-ax5grid-column-row="' + tri + '" ',
                                'data-ax5grid-column-col="' + ci + '" ',
                                'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ',
                                'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                                'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                                (function (_focusedColumn, _selectedColumn) {
                                    let attrs = "";
                                    if (_focusedColumn) {
                                        attrs += 'data-ax5grid-column-focused="true" ';
                                    }
                                    if (_selectedColumn) {
                                        attrs += 'data-ax5grid-column-selected="true" ';
                                    }
                                    return attrs;
                                })(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]),
                                'colspan="' + col.colspan + '" ',
                                'rowspan="' + col.rowspan + '" ',
                                'class="' + (function (_col) {
                                    let tdCSS_class = "";
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
                                }).call(this, col) + '" ',
                                'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                            SS.push((function (_cellHeight) {
                                let lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                                if (!col.multiLine) {
                                    _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                                }

                                return '<span data-ax5grid-cellHolder="' + ((col.multiLine) ? 'multiLine' : '') + '" ' +
                                    ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                                    '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';

                            })(cellHeight), (isGroupingRow) ? getGroupingValue.call(this, _list[di], di, col) : getFieldValue.call(this, _list, _list[di], di, col), '</span>');

                            SS.push('</td>');
                        }
                        SS.push('<td ',
                            'data-ax5grid-column-row="null" ',
                            'data-ax5grid-column-col="null" ',
                            'data-ax5grid-data-index="' + odi + '" ',
                            'data-ax5grid-column-attr="' + ("default") + '" ',
                            'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                            '></td>');
                        SS.push('</tr>');
                    }
                }
            }
            SS.push('</table>');

            if (isScrolled && _list.length) {
                SS.push('<div style="font-size:0;line-height:0;height: ' + (_list.length - di) * _scrollConfig.bodyTrHeight + 'px;"></div>');
            }

            _elTarget.empty().get(0).innerHTML = SS.join('');

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
        let repaintSum = function (_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            let _elTarget = this.$.panel[_elTargetKey];

            if (!isFirstPaint && !_scrollConfig) {
                this.$.livePanelKeys.push(_elTargetKey); // 사용중인 패널키를 모아둠. (뷰의 상태 변경시 사용하려고)
                return false;
            }

            let SS = [], cgi, cgl, tri, trl, ci, cl, col, cellHeight, colAlign;

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

                    SS.push('<td ',
                        'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                        'data-ax5grid-column-row="' + tri + '" ',
                        'data-ax5grid-column-col="' + ci + '" ',
                        'data-ax5grid-column-rowIndex="' + tri + '" ',
                        'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                        'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ',
                        (function (_focusedColumn, _selectedColumn) {
                            var attrs = "";
                            if (_focusedColumn) {
                                attrs += 'data-ax5grid-column-focused="true" ';
                            }
                            if (_selectedColumn) {
                                attrs += 'data-ax5grid-column-selected="true" ';
                            }
                            return attrs;
                        })(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]),
                        'colspan="' + col.colspan + '" ',
                        'rowspan="' + col.rowspan + '" ',
                        'class="' + (function (_col) {
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
                        }).call(this, col) + '" ',
                        'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push((function (_cellHeight) {
                        let lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + ((col.multiLine) ? 'multiLine' : '') + '" ' +
                            ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                            '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';

                    })(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ',
                    'data-ax5grid-column-row="null" ',
                    'data-ax5grid-column-col="null" ',
                    'data-ax5grid-column-attr="' + ("sum") + '" ',
                    'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                    '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.empty().get(0).innerHTML = SS.join('');
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
        let mergeCellsBody = function (_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            let tblRowMaps = [];
            let _elTarget = this.$.panel[_elTargetKey];
            let token = {}, hasMergeTd;
            //console.log(_elTarget);

            // 테이블의 td들을 수잡하여 저장해두고 스크립트로 반복하여 정리.
            let tableTrs = _elTarget.find("tr");
            for (let ri = 0, rl = tableTrs.length; ri < rl; ri++) {
                let tableTrTds, trMaps;

                if (!tableTrs[ri].getAttribute("data-ax5grid-grouping-tr")) {
                    tableTrTds = tableTrs[ri].childNodes;
                    trMaps = [];
                    for (let ci = 0, cl = tableTrTds.length; ci < cl; ci++) {
                        let tdObj = {
                            "$": jQuery(tableTrTds[ci])
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

            }


            // 두줄이상 일 때 의미가 있으니.
            if (tblRowMaps.length > 1) {
                hasMergeTd = false;
                for (let ri = 0, rl = tblRowMaps.length; ri < rl; ri++) {
                    let prevTokenColIndexs = [];
                    for (let ci = 0, cl = tblRowMaps[ri].length; ci < cl; ci++) {
                        // 적용 하려는 컬럼에 editor 속성이 없다면 머지 대상입니다.
                        if (!_colGroup[ci].editor && (() => {
                                if (U.isArray(cfg.body.mergeCells)) {
                                    return ax5.util.search(cfg.body.mergeCells, _colGroup[ci].key) > -1;
                                } else {
                                    return true;
                                }
                            })()) {

                            // 앞줄과 값이 같다면.
                            if (token[ci] && (() => {
                                    if (prevTokenColIndexs.length > 0) {
                                        let hasFalse = true;
                                        prevTokenColIndexs.forEach(function (ti) {
                                            if (tblRowMaps[ri - 1][ti].text != tblRowMaps[ri][ti].text) {
                                                hasFalse = false;
                                            }
                                        });
                                        return hasFalse;
                                    } else {
                                        return true;
                                    }
                                })() && token[ci].text == tblRowMaps[ri][ci].text) {
                                tblRowMaps[ri][ci].rowspan = 0;
                                tblRowMaps[token[ci].ri][ci].rowspan++;
                                hasMergeTd = true;
                            } else {
                                token[ci] = {
                                    ri: ri,
                                    ci: ci,
                                    text: tblRowMaps[ri][ci].text
                                };
                            }

                            prevTokenColIndexs.push(ci);
                        }
                    }
                }

                // rowspan을 다 구했으면 적용합니다.
                if (hasMergeTd) {
                    for (let ri = 0, rl = tblRowMaps.length; ri < rl; ri++) {
                        for (let ci = 0, cl = tblRowMaps[ri].length; ci < cl; ci++) {
                            if (tblRowMaps[ri][ci].rowspan == 0) {
                                tblRowMaps[ri][ci]["$"].remove();
                            } else if (tblRowMaps[ri][ci].rowspan > 1) {
                                tblRowMaps[ri][ci]["$"]
                                    .attr("rowspan", tblRowMaps[ri][ci].rowspan)
                                    .addClass("merged");
                            }
                        }
                    }
                }
            }
        };

        let scrollConfig = {
            paintStartRowIndex: paintStartRowIndex,
            paintRowCount: paintRowCount,
            paintStartColumnIndex: paintStartColumnIndex,
            paintEndColumnIndex: paintEndColumnIndex,
            nopaintLeftColumnsWidth: nopaintLeftColumnsWidth,
            nopaintRightColumnsWidth: nopaintRightColumnsWidth,
            bodyTrHeight: this.xvar.bodyTrHeight,
            virtualScrollX: this.config.virtualScrollX,
            virtualScrollY: this.config.virtualScrollY,
        };

        // aside
        if (cfg.asidePanelWidth > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-aside-body", this.asideColGroup, asideBodyRowData, asideBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex));
            }

            repaintBody.call(this, "aside-body-scroll", this.asideColGroup, asideBodyRowData, asideBodyGroupingData, list, scrollConfig);

            if (cfg.footSum) {
                // 바닥 요약 (footSum에 대한 aside 사용안함)
                //repaintSum.call(this, "bottom-aside-body", this.asideColGroup, asideBodyRowData, null, list);
            }
        }

        // left
        if (this.xvar.frozenColumnIndex > 0) {
            if (this.xvar.frozenRowIndex > 0) {
                // 상단 행고정
                repaintBody.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, leftBodyGroupingData, list.slice(0, this.xvar.frozenRowIndex), jQuery.extend({}, scrollConfig, {
                    paintStartRowIndex: 0,
                    paintRowCount: this.xvar.frozenRowIndex
                }));
            }

            repaintBody.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, leftBodyGroupingData, list, scrollConfig);

            if (cfg.footSum && this.needToPaintSum) {
                // 바닥 요약
                repaintSum.call(this, "bottom-left-body", this.leftHeaderColGroup, leftFootSumData, list);
            }
        }

        // body
        if (this.xvar.frozenRowIndex > 0) {
            // 상단 행고정
            repaintBody.call(this, "top-body-scroll", headerColGroup, bodyRowData, bodyGroupingData, list.slice(0, this.xvar.frozenRowIndex), jQuery.extend({}, scrollConfig, {
                paintStartRowIndex: 0,
                paintRowCount: this.xvar.frozenRowIndex
            }));
        }
        repaintBody.call(this, "body-scroll", headerColGroup, bodyRowData, bodyGroupingData, list, scrollConfig);

        // 바닥 요약
        if (cfg.footSum && this.needToPaintSum) {
            repaintSum.call(this, "bottom-body-scroll", headerColGroup, footSumData, list, scrollConfig);
        }
        // right
        if (cfg.rightSum) {
            // todo : right 표현 정리
        }

        /// mergeCells
        if (cfg.body.mergeCells && this.list.length) {
            // left
            if (this.xvar.frozenColumnIndex > 0) {
                if (this.xvar.frozenRowIndex > 0) { // 상단 행고정
                    // console.log(this.leftHeaderColGroup, leftBodyRowData);
                    mergeCellsBody.call(this, "top-left-body", this.leftHeaderColGroup, leftBodyRowData, list.slice(0, this.xvar.frozenRowIndex));
                }
                mergeCellsBody.call(this, "left-body-scroll", this.leftHeaderColGroup, leftBodyRowData, list, scrollConfig);
            }

            // body
            if (this.xvar.frozenRowIndex > 0) { // 상단 행고정
                mergeCellsBody.call(this, "top-body-scroll", this.headerColGroup, bodyRowData, list.slice(0, this.xvar.frozenRowIndex));
            }
            mergeCellsBody.call(this, "body-scroll", this.headerColGroup, bodyRowData, list, scrollConfig);
        }

        this.xvar.paintStartRowIndex = paintStartRowIndex;
        this.xvar.paintRowCount = paintRowCount;
        this.xvar.paintStartColumnIndex = paintStartColumnIndex;
        this.xvar.paintEndColumnIndex = paintEndColumnIndex;
        this.xvar.nopaintLeftColumnsWidth = nopaintLeftColumnsWidth;
        this.xvar.nopaintRightColumnsWidth = nopaintRightColumnsWidth;
        this.xvar.dataRowCount = list.length;
        this.needToPaintSum = false;

        GRID.page.statusUpdate.call(this);
    };

    const repaintCell = function (_panelName, _dindex, _rowIndex, _colIndex, _newValue) {
        let self = this,
            cfg = this.config,
            list = this.list;

        let updateCell = this.$["panel"][_panelName]
                .find('[data-ax5grid-tr-data-index="' + _dindex + '"]')
                .find('[data-ax5grid-column-rowindex="' + _rowIndex + '"][data-ax5grid-column-colindex="' + _colIndex + '"]')
                .find('[data-ax5grid-cellholder]'),
            colGroup = this.colGroup,
            col = colGroup[_colIndex];

        updateCell.html(getFieldValue.call(this, list, list[_dindex], _dindex, col));

        if (col.editor && col.editor.updateWith) {
            col.editor.updateWith.forEach(function (updateColumnKey) {
                colGroup.forEach(function (col) {
                    if (col.key == updateColumnKey) {
                        let rowIndex = col.rowIndex, colIndex = col.colIndex,
                            panelName = GRID.util.findPanelByColumnIndex.call(self, _dindex, colIndex, rowIndex).panelName,
                            updateWithCell = self.$["panel"][panelName]
                                .find('[data-ax5grid-tr-data-index="' + _dindex + '"]')
                                .find('[data-ax5grid-column-rowindex="' + rowIndex + '"][data-ax5grid-column-colindex="' + colIndex + '"]')
                                .find('[data-ax5grid-cellholder]');

                        updateWithCell.html(getFieldValue.call(self, list, list[_dindex], _dindex, col));
                    }
                });
            });
        }

        /// ~~~~~~

        let paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex,
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

        let repaintSum = function (_elTargetKey, _colGroup, _bodyRow, _list, _scrollConfig) {
            let _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                cgi, cgl, tri, trl, ci, cl, col, cellHeight, colAlign;

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

                    SS.push('<td ',
                        'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                        'data-ax5grid-column-row="' + tri + '" ',
                        'data-ax5grid-column-col="' + ci + '" ',
                        'data-ax5grid-column-rowIndex="' + tri + '" ',
                        'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                        'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ',
                        (function (_focusedColumn, _selectedColumn) {
                            var attrs = "";
                            if (_focusedColumn) {
                                attrs += 'data-ax5grid-column-focused="true" ';
                            }
                            if (_selectedColumn) {
                                attrs += 'data-ax5grid-column-selected="true" ';
                            }
                            return attrs;
                        })(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]),
                        'colspan="' + col.colspan + '" ',
                        'rowspan="' + col.rowspan + '" ',
                        'class="' + (function (_col) {
                            let tdCSS_class = "";
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
                        }).call(this, col) + '" ',
                        'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push((function (_cellHeight) {
                        let lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + ((col.multiLine) ? 'multiLine' : '') + '" ' +
                            ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                            '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';

                    })(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ',
                    'data-ax5grid-column-row="null" ',
                    'data-ax5grid-column-col="null" ',
                    'data-ax5grid-column-attr="' + ("sum") + '" ',
                    'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                    '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.empty().get(0).innerHTML = SS.join('');
            return true;
        };
        let replaceGroupTr = function (_elTargetKey, _colGroup, _groupRow, _list, _scrollConfig) {
            let _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                di, dl, tri, trl, ci, cl,
                col, cellHeight, colAlign;

            for (di = _scrollConfig.paintStartRowIndex, dl = (function () {
                let len;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            })(); di < dl; di++) {
                if (_list[di] && _groupRow && "__isGrouping" in _list[di]) {
                    let rowTable = _groupRow;
                    SS = [];
                    for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                        for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                            col = rowTable.rows[tri].cols[ci];
                            cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                            colAlign = col.align || bodyAlign;

                            SS.push('<td ',
                                'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                                'data-ax5grid-data-index="' + di + '" ',
                                'data-ax5grid-column-row="' + tri + '" ',
                                'data-ax5grid-column-col="' + ci + '" ',
                                'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ',
                                'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                                'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                                (function (_focusedColumn, _selectedColumn) {
                                    let attrs = "";
                                    if (_focusedColumn) {
                                        attrs += 'data-ax5grid-column-focused="true" ';
                                    }
                                    if (_selectedColumn) {
                                        attrs += 'data-ax5grid-column-selected="true" ';
                                    }
                                    return attrs;
                                })(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]),
                                'colspan="' + col.colspan + '" ',
                                'rowspan="' + col.rowspan + '" ',
                                'class="' + (function (_col) {
                                    let tdCSS_class = "";
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
                                }).call(this, col) + '" ',
                                'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                            SS.push((function (_cellHeight) {
                                let lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                                if (!col.multiLine) {
                                    _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                                }

                                return '<span data-ax5grid-cellHolder="' + ((col.multiLine) ? 'multiLine' : '') + '" ' +
                                    ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                                    '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';

                            })(cellHeight), getGroupingValue.call(this, _list[di], di, col), '</span>');

                            SS.push('</td>');
                        }
                        SS.push('<td ',
                            'data-ax5grid-column-row="null" ',
                            'data-ax5grid-column-col="null" ',
                            'data-ax5grid-data-index="' + di + '" ',
                            'data-ax5grid-column-attr="' + ("default") + '" ',
                            'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                            '></td>');
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

    const repaintRow = function (_dindex) {
        let self = this,
            cfg = this.config,
            list = this.list;
        /// ~~~~~~

        let paintStartRowIndex = Math.floor(Math.abs(this.$.panel["body-scroll"].position().top) / this.xvar.bodyTrHeight) + this.xvar.frozenRowIndex,
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

        let repaintSum = function (_elTargetKey, _colGroup, _bodyRow, _list) {
            let _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                cgi, cgl, tri, trl, ci, cl, col, cellHeight, colAlign;

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

                    SS.push('<td ',
                        'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                        'data-ax5grid-column-row="' + tri + '" ',
                        'data-ax5grid-column-col="' + ci + '" ',
                        'data-ax5grid-column-rowIndex="' + tri + '" ',
                        'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                        'data-ax5grid-column-attr="' + (col.columnAttr || "sum") + '" ',
                        (function (_focusedColumn, _selectedColumn) {
                            var attrs = "";
                            if (_focusedColumn) {
                                attrs += 'data-ax5grid-column-focused="true" ';
                            }
                            if (_selectedColumn) {
                                attrs += 'data-ax5grid-column-selected="true" ';
                            }
                            return attrs;
                        })(this.focusedColumn["sum_" + col.colIndex + "_" + tri], this.selectedColumn["sum_" + col.colIndex + "_" + tri]),
                        'colspan="' + col.colspan + '" ',
                        'rowspan="' + col.rowspan + '" ',
                        'class="' + (function (_col) {
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
                        }).call(this, col) + '" ',
                        'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push((function (_cellHeight) {
                        var lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + ((col.multiLine) ? 'multiLine' : '') + '" ' +
                            ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                            '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';

                    })(cellHeight), getSumFieldValue.call(this, _list, col), '</span>');

                    SS.push('</td>');
                }
                SS.push('<td ',
                    'data-ax5grid-column-row="null" ',
                    'data-ax5grid-column-col="null" ',
                    'data-ax5grid-column-attr="' + ("sum") + '" ',
                    'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                    '></td>');
                SS.push('</tr>');
            }

            SS.push('</table>');

            _elTarget.empty().get(0).innerHTML = SS.join('');
            return true;
        };
        let replaceGroupTr = function (_elTargetKey, _colGroup, _groupRow, _list, _scrollConfig) {
            let _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                di, dl, tri, trl, ci, cl, col, cellHeight, colAlign;

            if (typeof _scrollConfig === "undefined" || typeof _scrollConfig['paintStartRowIndex'] === "undefined") {
                _scrollConfig = {
                    paintStartRowIndex: 0,
                    paintRowCount: _list.length
                };
            }

            for (di = _scrollConfig.paintStartRowIndex, dl = (function () {
                let len;
                len = _list.length;
                if (_scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex < len) {
                    len = _scrollConfig.paintRowCount + _scrollConfig.paintStartRowIndex;
                }
                return len;
            })(); di < dl; di++) {
                if (_list[di] && _groupRow && "__isGrouping" in _list[di]) {
                    let rowTable = _groupRow;
                    SS = [];
                    for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                        for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                            col = rowTable.rows[tri].cols[ci];
                            cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                            colAlign = col.align || bodyAlign;

                            SS.push('<td ',
                                'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                                'data-ax5grid-data-index="' + di + '" ',
                                'data-ax5grid-column-row="' + tri + '" ',
                                'data-ax5grid-column-col="' + ci + '" ',
                                'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ',
                                'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                                'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                                (function (_focusedColumn, _selectedColumn) {
                                    let attrs = "";
                                    if (_focusedColumn) {
                                        attrs += 'data-ax5grid-column-focused="true" ';
                                    }
                                    if (_selectedColumn) {
                                        attrs += 'data-ax5grid-column-selected="true" ';
                                    }
                                    return attrs;
                                })(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]),
                                'colspan="' + col.colspan + '" ',
                                'rowspan="' + col.rowspan + '" ',
                                'class="' + (function (_col) {
                                    let tdCSS_class = "";
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
                                }).call(this, col) + '" ',
                                'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                            SS.push((function (_cellHeight) {
                                let lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                                if (!col.multiLine) {
                                    _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                                }

                                return '<span data-ax5grid-cellHolder="' + ((col.multiLine) ? 'multiLine' : '') + '" ' +
                                    ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                                    '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';

                            })(cellHeight), getGroupingValue.call(this, _list[di], di, col), '</span>');

                            SS.push('</td>');
                        }
                        SS.push('<td ',
                            'data-ax5grid-column-row="null" ',
                            'data-ax5grid-column-col="null" ',
                            'data-ax5grid-data-index="' + di + '" ',
                            'data-ax5grid-column-attr="' + ("default") + '" ',
                            'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                            '></td>');
                    }
                    _elTarget.find('tr[data-ax5grid-tr-data-index="' + di + '"]').empty().get(0).innerHTML = SS.join('');
                }
            }
        };
        let replaceTr = function (_elTargetKey, _colGroup, _bodyRow, _list, di) {
            let _elTarget = this.$.panel[_elTargetKey],
                SS = [],
                tri, trl, ci, cl, col, cellHeight, colAlign, rowTable = _bodyRow;

            for (tri = 0, trl = rowTable.rows.length; tri < trl; tri++) {
                for (ci = 0, cl = rowTable.rows[tri].cols.length; ci < cl; ci++) {
                    col = rowTable.rows[tri].cols[ci];
                    cellHeight = cfg.body.columnHeight * col.rowspan - cfg.body.columnBorderWidth;
                    colAlign = col.align || bodyAlign;

                    SS.push('<td ',
                        'data-ax5grid-panel-name="' + _elTargetKey + '" ',
                        'data-ax5grid-data-index="' + di + '" ',
                        'data-ax5grid-column-row="' + tri + '" ',
                        'data-ax5grid-column-col="' + ci + '" ',
                        'data-ax5grid-column-rowIndex="' + col.rowIndex + '" ',
                        'data-ax5grid-column-colIndex="' + col.colIndex + '" ',
                        'data-ax5grid-column-attr="' + (col.columnAttr || "default") + '" ',
                        (function (_focusedColumn, _selectedColumn) {
                            let attrs = "";
                            if (_focusedColumn) {
                                attrs += 'data-ax5grid-column-focused="true" ';
                            }
                            if (_selectedColumn) {
                                attrs += 'data-ax5grid-column-selected="true" ';
                            }
                            return attrs;
                        })(this.focusedColumn[di + "_" + col.colIndex + "_" + col.rowIndex], this.selectedColumn[di + "_" + col.colIndex + "_" + col.rowIndex]),
                        'colspan="' + col.colspan + '" ',
                        'rowspan="' + col.rowspan + '" ',
                        'class="' + (function (_col) {
                            let tdCSS_class = "";
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
                        }).call(this, col) + '" ',
                        'style="height: ' + cellHeight + 'px;min-height: 1px;">');

                    SS.push((function (_cellHeight) {
                        let lineHeight = (cfg.body.columnHeight - cfg.body.columnPadding * 2 - cfg.body.columnBorderWidth);
                        if (!col.multiLine) {
                            _cellHeight = cfg.body.columnHeight - cfg.body.columnBorderWidth;
                        }

                        return '<span data-ax5grid-cellHolder="' + ((col.multiLine) ? 'multiLine' : '') + '" ' +
                            ((colAlign) ? 'data-ax5grid-text-align="' + colAlign + '"' : '') +
                            '" style="height:' + _cellHeight + 'px;line-height: ' + lineHeight + 'px;">';

                    })(cellHeight), getFieldValue.call(this, _list, _list[di], di, col), '</span>');
                    SS.push('</td>');
                }
                SS.push('<td ',
                    'data-ax5grid-column-row="null" ',
                    'data-ax5grid-column-col="null" ',
                    'data-ax5grid-data-index="' + di + '" ',
                    'data-ax5grid-column-attr="' + ("default") + '" ',
                    'style="height: ' + (cfg.body.columnHeight) + 'px;min-height: 1px;" ',
                    '></td>');
            }
            
            console.log('tr[data-ax5grid-tr-data-index="' + di + '"]');
            
            _elTarget.find('tr[data-ax5grid-tr-data-index="' + di + '"]').empty().get(0).innerHTML = SS.join('');
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

    const scrollTo = function (css, noRepaint) {

        if (this.isInlineEditing) {
            for (var key in this.inlineEditing) {
                //if(this.inlineEditing[key].editor.type === "select") {}
                // 인라인 에디팅 인데 스크롤 이벤트가 발생하면 디액티브 처리
                GRID.body.inlineEdit.deActive.call(this, "ESC", key);
            }
        }

        if (this.config.asidePanelWidth > 0 && "top" in css) {
            this.$.panel["aside-body-scroll"].css({top: css.top});
        }
        if (this.xvar.frozenColumnIndex > 0 && "top" in css) {
            this.$.panel["left-body-scroll"].css({top: css.top});
        }
        if (this.xvar.frozenRowIndex > 0 && "left" in css) {
            this.$.panel["top-body-scroll"].css({left: css.left});
        }

        this.$.panel["body-scroll"].css(css);

        if (this.config.footSum && "left" in css) {
            this.$.panel["bottom-body-scroll"].css({left: css.left});
        }

        if (this.config.virtualScrollY && !noRepaint && "top" in css) {
            repaint.call(this);
        } else if (this.config.virtualScrollX && !noRepaint && "left" in css) {
            repaint.call(this);
        }
    };

    const blur = function () {
        columnSelect.focusClear.call(this);
        columnSelect.clear.call(this);
        if (this.isInlineEditing) {
            inlineEdit.deActive.call(this);
        }
    };

    const moveFocus = function (_position) {
        let focus = {
            "UD": function (_dy) {
                let moveResult = true,
                    focusedColumn, originalColumn, while_i,
                    nPanelInfo;

                for (let c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }

                if (!focusedColumn) return false;

                originalColumn = this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex];
                columnSelect.focusClear.call(this);
                columnSelect.clear.call(this);

                if (_dy > 0) {
                    if (focusedColumn.rowIndex + (originalColumn.rowspan - 1) + _dy > this.bodyRowTable.rows.length - 1) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.rowIndex = 0;
                        if (focusedColumn.dindex > this.list.length - 1) {
                            focusedColumn.dindex = this.list.length - 1;
                            moveResult = false;
                        }
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                }
                else {
                    if (focusedColumn.rowIndex + _dy < 0) {
                        focusedColumn.dindex = focusedColumn.dindex + _dy;
                        focusedColumn.rowIndex = this.bodyRowTable.rows.length - 1;
                        if (focusedColumn.dindex < 0) {
                            focusedColumn.dindex = 0;
                            moveResult = false;
                        }
                    } else {
                        focusedColumn.rowIndex = focusedColumn.rowIndex + _dy;
                    }
                }

                while_i = 0;
                while (typeof this.bodyRowMap[focusedColumn.rowIndex + "_" + focusedColumn.colIndex] === "undefined") {
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == ((_dy > 0) ? 0 : 1)) {
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
                    while (!this.$.panel[nPanelInfo.panelName]
                        .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').get(0)) {

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
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex <= this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                        else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName]
                    .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                    .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]')
                    .attr('data-ax5grid-column-focused', "true");

                return moveResult;

            },
            "LR": function (_dx) {
                let moveResult = true,
                    focusedColumn, originalColumn,
                    while_i = 0, isScrollPanel = false, containerPanelName = "", nPanelInfo;

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
                }
                else {
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
                    while (!this.$.panel[nPanelInfo.panelName]
                        .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                        .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]').get(0)) {

                        focusedColumn.dindex--;

                        if (focusedColumn.dindex < 0 || focusedColumn.dindex > this.list.length - 1) {
                            break;
                        }
                    }
                    nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);
                }

                focusedColumn.panelName = nPanelInfo.panelName;

                // 포커스 컬럼의 위치에 따라 스크롤 처리
                let isScrollTo = (function () {
                    if (!this.config.virtualScrollX) return false;
                    let scrollLeft = 0;
                    if (focusedColumn.colIndex + 1 > this.xvar.frozenColumnIndex) {
                        if (focusedColumn.colIndex <= this.xvar.paintStartColumnIndex && this.colGroup[focusedColumn.colIndex]) {
                            scrollLeft = -this.colGroup[Number(focusedColumn.colIndex)]._sx;
                            scrollTo.call(this, {left: scrollLeft});
                            GRID.header.scrollTo.call(this, {left: scrollLeft});
                            GRID.scroller.resize.call(this);
                            return true;
                        }
                        else if (focusedColumn.colIndex >= this.xvar.paintEndColumnIndex && this.colGroup[Number(focusedColumn.colIndex)]) {
                            if (this.colGroup[Number(focusedColumn.colIndex)]._ex > this.xvar.bodyWidth) {
                                scrollLeft = (this.colGroup[Number(focusedColumn.colIndex)]._ex - this.xvar.bodyWidth);
                                scrollTo.call(this, {left: -scrollLeft});
                                GRID.header.scrollTo.call(this, {left: -scrollLeft});
                                GRID.scroller.resize.call(this);
                            }
                            return true;
                        }
                    }
                    scrollLeft = null;
                    return false;
                }).call(this);

                containerPanelName = nPanelInfo.containerPanelName;
                isScrollPanel = nPanelInfo.isScrollPanel;

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;

                var $column = this.$.panel[focusedColumn.panelName]
                    .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                    .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]')
                    .attr('data-ax5grid-column-focused', "true");

                if (!isScrollTo && $column && isScrollPanel) {// 스크롤 패널 이라면~
                    // todo : 컬럼이동할 때에도 scrollTo 체크
                    var newLeft = (function () {
                        if ($column.position().left + $column.outerWidth() > Math.abs(this.$.panel[focusedColumn.panelName].position().left) + this.$.panel[containerPanelName].width()) {
                            return $column.position().left + $column.outerWidth() - this.$.panel[containerPanelName].width();
                        } else if (Math.abs(this.$.panel[focusedColumn.panelName].position().left) > $column.position().left) {
                            return $column.position().left;
                        } else {
                            return;
                        }
                    }).call(this);

                    if (typeof newLeft !== "undefined") {
                        GRID.header.scrollTo.call(this, {left: -newLeft});
                        scrollTo.call(this, {left: -newLeft});
                        GRID.scroller.resize.call(this);
                    }
                }

                return moveResult;
            },
            "INDEX": function (_dindex) {
                let moveResult = true,
                    focusedColumn, originalColumn,
                    while_i;

                for (let c in this.focusedColumn) {
                    focusedColumn = jQuery.extend({}, this.focusedColumn[c], true);
                    break;
                }
                if (!focusedColumn) {
                    focusedColumn = {
                        rowIndex: 0,
                        colIndex: 0
                    }
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
                    if (focusedColumn.rowIndex == 0 || while_i % 2 == ((_dy > 0) ? 0 : 1)) {
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

                let nPanelInfo = GRID.util.findPanelByColumnIndex.call(this, focusedColumn.dindex, focusedColumn.colIndex);
                focusedColumn.panelName = nPanelInfo.panelName;

                // 포커스 컬럼의 위치에 따라 스크롤 처리.
                (function () {
                    if (focusedColumn.dindex + 1 > this.xvar.frozenRowIndex) {
                        if (focusedColumn.dindex < this.xvar.paintStartRowIndex) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                        else if (focusedColumn.dindex + 1 > this.xvar.paintStartRowIndex + (this.xvar.paintRowCount - 2)) {
                            scrollTo.call(this, {top: -(focusedColumn.dindex - this.xvar.frozenRowIndex - this.xvar.paintRowCount + 3) * this.xvar.bodyTrHeight});
                            GRID.scroller.resize.call(this);
                        }
                    }
                }).call(this);

                this.focusedColumn[focusedColumn.dindex + "_" + focusedColumn.colIndex + "_" + focusedColumn.rowIndex] = focusedColumn;
                this.$.panel[focusedColumn.panelName]
                    .find('[data-ax5grid-tr-data-index="' + focusedColumn.dindex + '"]')
                    .find('[data-ax5grid-column-rowindex="' + focusedColumn.rowIndex + '"][data-ax5grid-column-colindex="' + focusedColumn.colIndex + '"]')
                    .attr('data-ax5grid-column-focused', "true");

                return moveResult;
            }
        };

        let processor = {
            "UP": function () {
                return focus["UD"].call(this, -1);
            },
            "DOWN": function () {
                return focus["UD"].call(this, 1);
            },
            "LEFT": function () {
                return focus["LR"].call(this, -1);
            },
            "RIGHT": function () {
                return focus["LR"].call(this, 1);
            },
            "HOME": function () {
                return focus["INDEX"].call(this, 0);
            },
            "END": function () {
                return focus["INDEX"].call(this, "end");
            },
            "position": function (_position) {
                return focus["INDEX"].call(this, _position);
            }
        };

        if (_position in processor) {
            return processor[_position].call(this);
        } else {
            return processor["position"].call(this, _position);
        }
    };

    const inlineEdit = {
        active(_focusedColumn, _e, _initValue) {
            var self = this,
                dindex, colIndex, rowIndex, panelName, colspan,
                col, editor;

            // this.inlineEditing = {};
            for (var key in _focusedColumn) {
                panelName = _focusedColumn[key].panelName;
                dindex = _focusedColumn[key].dindex;
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
                if (!(function (_editor, _type) {
                        if (_editor.type in GRID.inlineEditor) {
                            return (GRID.inlineEditor[_editor.type].editMode == "popup");
                        }
                    })(editor)) {
                    // 체크 박스 타입이면 값 변경 시도
                    if (editor.type == "checkbox") {
                        var checked, newValue;
                        if (editor.config && editor.config.trueValue) {
                            if (checked = !(_initValue == editor.config.trueValue)) {
                                newValue = editor.config.trueValue;
                            } else {
                                newValue = editor.config.falseValue;
                            }
                        } else {
                            newValue = checked = (_initValue == false || _initValue == "false" || _initValue < "1") ? "true" : "false";
                        }

                        GRID.data.setValue.call(self, dindex, col.key, newValue);
                        updateRowState.call(self, ["cellChecked"], dindex, {
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

                let originalValue = GRID.data.getValue.call(self, dindex, col.key),
                    initValue = (function (__value, __editor) {
                        if (U.isNothing(__value)) {
                            __value = U.isNothing(originalValue) ? "" : originalValue;
                        }

                        if (__editor.type == "money") {
                            return U.number(__value, {"money": true});
                        }
                        else {
                            return __value;
                        }
                    }).call(this, _initValue, editor);

                this.inlineEditing[key].$inlineEditorCell = this.$["panel"][panelName]
                    .find('[data-ax5grid-tr-data-index="' + dindex + '"]')
                    .find('[data-ax5grid-column-rowindex="' + rowIndex + '"][data-ax5grid-column-colindex="' + colIndex + '"]')
                    .find('[data-ax5grid-cellholder]');

                this.inlineEditing[key].$inlineEditor = GRID.inlineEditor[editor.type].init(this, key, editor, this.inlineEditing[key].$inlineEditorCell, initValue);

                return true;
            }
        },
        deActive(_msg, _key, _value) {
            // console.log(this.inlineEditing.column.dindex, this.inlineEditing.$inlineEditor.val());
            if (!this.inlineEditing[_key]) return this;

            let panelName = this.inlineEditing[_key].panelName,
                dindex = this.inlineEditing[_key].column.dindex,
                rowIndex = this.inlineEditing[_key].column.rowIndex,
                colIndex = this.inlineEditing[_key].column.colIndex,
                column = this.bodyRowMap[this.inlineEditing[_key].column.rowIndex + "_" + this.inlineEditing[_key].column.colIndex],
                editorValue = (function ($inlineEditor) {
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
                })(this.inlineEditing[_key].$inlineEditor),
                newValue = (function (__value, __editor) {
                    if (__editor.type == "money") {
                        return U.number(__value);
                    }
                    else {
                        return __value;
                    }
                }).call(this, editorValue, column.editor);

            let action = {
                "CANCEL"(_dindex, _column, _newValue) {
                    action["__clear"].call(this);
                },
                "RETURN"(_dindex, _column, _newValue) {
                    if (GRID.data.setValue.call(this, _dindex, _column.key, _newValue)) {
                        action["__clear"].call(this);
                        GRID.body.repaintCell.call(this, panelName, dindex, rowIndex, colIndex, _newValue);
                    } else {
                        action["__clear"].call(this);
                    }
                },
                "__clear"() {
                    this.isInlineEditing = false;
                    let bindedAx5ui = this.inlineEditing[_key].$inlineEditor.data("binded-ax5ui");
                    if (bindedAx5ui == "ax5picker") {
                        this.inlineEditing[_key].$inlineEditor.ax5picker("close");
                    } else if (bindedAx5ui == "ax5select") {
                        this.inlineEditing[_key].$inlineEditor.ax5select("close");
                    }

                    this.inlineEditing[_key].$inlineEditor.remove();
                    this.inlineEditing[_key].$inlineEditor = null;
                    this.inlineEditing[_key].$inlineEditorCell = null;
                    this.inlineEditing[_key] = undefined;
                    delete this.inlineEditing[_key]; // delete 지원안하는 브라우저 테스트..
                }
            };

            if (_msg in action) {
                action[_msg || "RETURN"].call(this, dindex, column, newValue);
            } else {
                action["__clear"].call(this);
            }
        },
        keydown(key, columnKey, _options) {
            let processor = {
                "ESC"() {
                    for (var columnKey in this.inlineEditing) {
                        inlineEdit.deActive.call(this, "CANCEL", columnKey);
                    }
                },
                "RETURN"() {
                    if (this.isInlineEditing) {
                        if (this.inlineEditing[columnKey] && this.inlineEditing[columnKey].useReturnToSave) { // todo : 네이밍 검증 할 필요있음.
                            inlineEdit.deActive.call(this, "RETURN", columnKey);
                        }
                    } else {

                        for (var k in this.focusedColumn) {
                            let _column = this.focusedColumn[k],
                                column = this.bodyRowMap[_column.rowIndex + "_" + _column.colIndex],
                                dindex = _column.dindex,
                                value = "",
                                col = this.colGroup[_column.colIndex];
                            ;

                            if (column) {
                                if (!this.list[dindex].__isGrouping) {
                                    value = GRID.data.getValue.call(this, dindex, column.key);
                                }
                            }

                            if (col.editor && GRID.inlineEditor[col.editor.type].editMode === "inline") {
                                if (_options && _options.moveFocus) {

                                }
                                else {
                                    if (column.editor && column.editor.type == "checkbox") {
                                        value = GRID.data.getValue.call(this, dindex, column.key);

                                        let checked, newValue;
                                        if (column.editor.config && column.editor.config.trueValue) {
                                            if (checked = !(value == column.editor.config.trueValue)) {
                                                newValue = column.editor.config.trueValue;
                                            } else {
                                                newValue = column.editor.config.falseValue;
                                            }
                                        } else {
                                            newValue = checked = (value == false || value == "false" || value < "1") ? "true" : "false";
                                        }

                                        GRID.data.setValue.call(this, _column.dindex, column.key, newValue);
                                        updateRowState.call(this, ["cellChecked"], dindex, {
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
                }
            };

            if (key in processor) {
                processor[key].call(this, key, columnKey, _options);
            }
        }
    };

    const getExcelString = function () {
        let cfg = this.config,
            list = this.list,
            bodyRowData = this.bodyRowTable,
            footSumData = this.footSumTable,
            bodyGroupingData = this.bodyGroupingTable;

        // body-scroll 의 포지션에 의존적이므로..
        let getBody = function (_colGroup, _bodyRow, _groupRow, _list) {
            let SS = [],
                di, dl,
                tri, trl,
                ci, cl,
                col;

            //SS.push('<table border="1">');
            for (di = 0, dl = _list.length; di < dl; di++) {
                let isGroupingRow = false, rowTable;

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

                        SS.push('<td ',
                            'colspan="' + col.colspan + '" ',
                            'rowspan="' + col.rowspan + '" ',
                            '>', (isGroupingRow) ? getGroupingValue.call(this, _list[di], di, col) : getFieldValue.call(this, _list, _list[di], di, col, undefined, "text"), '&nbsp;</td>');
                    }
                    SS.push('\n</tr>');
                }
            }
            //SS.push('</table>');
            return SS.join('');
        };
        let getSum = function (_colGroup, _bodyRow, _list) {
            let SS = [],
                tri, trl,
                ci, cl,
                col;

            //SS.push('<table border="1">');
            for (tri = 0, trl = _bodyRow.rows.length; tri < trl; tri++) {
                SS.push('\n<tr>');
                for (ci = 0, cl = _bodyRow.rows[tri].cols.length; ci < cl; ci++) {
                    col = _bodyRow.rows[tri].cols[ci];
                    SS.push('<td ',
                        'colspan="' + col.colspan + '" ',
                        'rowspan="' + col.rowspan + '" ',
                        '>', getSumFieldValue.call(this, _list, col), '</td>');
                }
                SS.push('\n</tr>');
            }
            //SS.push('</table>');

            return SS.join('');
        };

        let po = [];
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

    const toggleCollapse = function (_dindex, _collapse) {
        if (GRID.data.toggleCollapse.call(this, _dindex, _collapse)) {
            this.proxyList = GRID.data.getProxyList.call(this, this.list);
            repaint.call(this);
        }
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
        toggleCollapse: toggleCollapse
    };
})();