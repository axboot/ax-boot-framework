// ax5.ui.grid.inlineEditor
(function () {

    var GRID = ax5.ui.grid;

    var edit_text = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="text" value="'+ _value +'" >';
        },
        init: function (_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function (_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.focus().select();
        }
    };

    var edit_money = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="money" value="'+ _value +'" >';
        },
        init: function (_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function (_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter({
                pattern: "money"
            });
            _$el.focus().select();
        }
    };

    var edit_number = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="number" value="'+ _value +'" >';
        },
        init: function (_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function (_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter({
                pattern: "number"
            });
            _$el.focus().select();
        }
    };

    var edit_date = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="calendar" value="'+ _value +'" >';
        },
        init: function (_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            return $el;
        },
        bindUI: function (_root, _columnKey, _$el, _editor, _$parent, _value) {
            var self = _root;
            _$el.data("binded-ax5ui", "ax5picker");
            _$el.ax5picker({
                direction: "auto",
                content: {
                    type: 'date',
                    formatter: {
                        pattern: 'date'
                    }
                },
                onStateChanged: function () {
                    if (this.state == "open") {
                        this.self.activePicker.attr("data-ax5grid-inline-edit-picker", "date");
                    } else if (this.state == "close") {
                        GRID.body.inlineEdit.deActive.call(self, "RETURN", _columnKey);
                    }
                }
            });
            _$el.focus().select();
        }
    };

    var edit_select = {
        useReturnToSave: false,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            var po = [];
            po.push('<div data-ax5select="ax5grid-editor" data-ax5select-config="{}">');
            po.push('</div>');

            return po.join('');
        },
        init: function (_root, _columnKey, _editor, _$parent, _value) {
            var $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            return $el;
        },
        bindUI: function (_root, _columnKey, _$el, _editor, _$parent, _value) {
            var eConfig = {
                columnKeys: {
                    optionValue: "value",
                    optionText: "text",
                    optionSelected: "selected"
                }
            };
            jQuery.extend(true, eConfig, _editor.config);

            eConfig.options.forEach(function(n){
               if(n[eConfig.columnKeys.optionValue] == _value) n[eConfig.columnKeys.optionSelected] = true;
            });

            var self = _root;
            _$el.data("binded-ax5ui", "ax5select");
            _$el.ax5select({
                direction: "auto",
                columnKeys: eConfig.columnKeys,
                options: eConfig.options,
                onStateChanged: function () {
                    if (this.state == "open") {
                        this.self.activeSelectOptionGroup.attr("data-ax5grid-inline-edit-picker", "select");
                    } else if (this.state == "changeValue") {
                        GRID.body.inlineEdit.deActive.call(self, "RETURN", _columnKey, this.value[0][eConfig.columnKeys.optionValue]);
                    } else if (this.state == "close") {
                        GRID.body.inlineEdit.deActive.call(self, "ESC", _columnKey);
                    }
                }
            });
            _$el.ax5select("open");
            _$el.ax5select("setValue", _value);
            _$el.find("a").focus();
        }
    };

    var edit_checkbox = {
        editMode: "inline",
        getHtml: function (_root, _editor, _value) {

            var lineHeight = (_root.config.body.columnHeight - _root.config.body.columnPadding * 2 - _root.config.body.columnBorderWidth);
            var checked;
            if (_editor.config && _editor.config.trueValue) {
                checked = (_value == _editor.config.trueValue) ? "true" : "false";
            } else {
                checked = (_value == false || _value == "false" || _value < "1") ? "false" : "true";
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

    GRID.inlineEditor = {
        "text": edit_text,
        "money": edit_money,
        "number": edit_number,
        "date": edit_date,
        "select": edit_select,
        "checkbox": edit_checkbox
    };

})();