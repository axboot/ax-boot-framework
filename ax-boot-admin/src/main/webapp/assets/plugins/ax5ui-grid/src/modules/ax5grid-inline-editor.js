// ax5.ui.grid.inlineEditor
(function () {

    const GRID = ax5.ui.grid;

    const edit_text = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            if(typeof _editor.attributes !== "undefined"){
                var attributesText  = "";
                for (var k in _editor.attributes){
                    attributesText += ` ${k}='${_editor.attributes[k]}'`;
                }
            }
            return `<input type="text" data-ax5grid-editor="text" value="${_value}" ${attributesText}>`;
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

    const edit_money = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            let attributesText = "";
            if(typeof _editor.attributes !== "undefined"){
                for (let k in _editor.attributes){
                    attributesText += ` ${k}='${_editor.attributes[k]}'`;
                }
            }
            return '<input type="text" data-ax5grid-editor="money" value="' + _value + '" ' + attributesText + '" />';
        },
        init: function (_root, _columnKey, _editor, _$parent, _value) {
            let $el;
            _$parent.append($el = jQuery(this.getHtml(_root, _columnKey, _editor, _value)));
            this.bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            $el.on("blur", function () {
                GRID.body.inlineEdit.deActive.call(_root, "RETURN", _columnKey);
            });
            return $el;
        },
        bindUI: function (_root, _columnKey, _$el, _editor, _$parent, _value) {
            _$el.data("binded-ax5ui", "ax5formater");
            _$el.ax5formatter($.extend(true, {
                pattern: "money"
            }, _editor.config));
            _$el.focus().select();
        }
    };

    const edit_number = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            let attributesText = "";
            if(typeof _editor.attributes !== "undefined"){
                for (let k in _editor.attributes){
                    attributesText += ` ${k}='${_editor.attributes[k]}'`;
                }
            }
            return '<input type="text" data-ax5grid-editor="number" value="' + _value + '" ' + attributesText + '" />';
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
            _$el.ax5formatter($.extend(true, {
                pattern: "number"
            }, _editor.config));
            _$el.focus().select();
        }
    };

    const edit_date = {
        useReturnToSave: true,
        editMode: "popup",
        getHtml: function (_root, _columnKey, _editor, _value) {
            return '<input type="text" data-ax5grid-editor="calendar" value="' + _value + '" >';
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

            _$el.ax5picker($.extend(true, {
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
            }, _editor.config));

            _$el.focus().select();
        }
    };

    const edit_select = {
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
                onStateChanged: function () {
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

    const edit_checkbox = {
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

    const edit_textarea = {
        useReturnToSave: false,
        editMode: "popup",
        _getHtml: function (_root, _columnKey, _editor, _value) {
            // init 에서 사용하게 될 HTML 태그를 만들어 줍니다.
            return `<div data-ax5grid-editor="textarea"></div>`;
        },
        _bindUI: function (_root, _columnKey, _$el, _editor, _$parent, _value) {
            // 위치와 크기를 구합니다.
            let offset = _$el.offset();
            let box = {
                width: _$el.width()
            };
            let editorHeight = 150;
            let buttonHeight = 30;

            // 새로운 엘리먼트 생성
            let $newDiv = jQuery(`<div data-ax5grid-popup="textarea" style="z-index: 9999;">
    <textarea style="width:100%;height:${editorHeight-buttonHeight}px;" class="form-control">${_value}</textarea>
    <div style="height:${buttonHeight}px;padding:5px;text-align: right;">
        <button class="btn btn-default">OK</button>
    </div>
</div>`);
            let $newTextarea = $newDiv.find("textarea");
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
                if(e.which == ax5.info.eventKeys.ESC){
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

        init: function (_root, _columnKey, _editor, _$parent, _value) {
            // 인라인 에디팅 활성화 시작
            /**
             * _root : gridInstance
             * _columnKey : di + "_" + col.colIndex + "_" + col.rowIndex
             * _editor : col.editor
             * _$parent : 셀
             * _value : 값
             */
            let $el;
            _$parent.append($el = jQuery(this._getHtml(_root, _columnKey, _editor, _value)));
            // 셀에 HTML 컨텐츠 추가

            this._bindUI(_root, _columnKey, $el, _editor, _$parent, _value);
            // 이벤트 바인딩

            return $el;
        },
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