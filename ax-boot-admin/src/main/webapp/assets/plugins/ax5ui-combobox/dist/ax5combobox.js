'use strict';

// ax5.ui.combobox
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var COMBOBOX = void 0;

    UI.addClass({
        className: "combobox"
    }, function () {
        /**
         * @class ax5combobox
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * var options = [];
         * options.push({value: "1", text: "string"});
         * options.push({value: "2", text: "number"});
         * options.push({value: "3", text: "substr"});
         * options.push({value: "4", text: "substring"});
         * options.push({value: "search", text: "search"});
         * options.push({value: "parseInt", text: "parseInt"});
         * options.push({value: "toFixed", text: "toFixed"});
         * options.push({value: "min", text: "min"});
         * options.push({value: "max", text: "max"});
         *
         * var myCombo = new ax5.ui.combobox({
         *     theme: "danger",
         *     removeIcon: '<i class="fa fa-times" aria-hidden="true"></i>'
         * });
         * ```
         */
        return function () {
            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                removeIcon: 'X',
                lang: {
                    noSelected: '',
                    noOptions: 'no options',
                    loading: 'now loading..'
                },
                columnKeys: {
                    optionValue: 'value',
                    optionText: 'text',
                    optionSelected: 'selected'
                }
            };

            this.queue = [];
            this.activecomboboxOptionGroup = null;
            this.activecomboboxQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;
            this.waitOptionsCallback = null;
            this.keyUpTimer = null;

            cfg = this.config;

            var $window = jQuery(window);
            var ctrlKeys = {
                "18": "KEY_ALT",
                "8": "KEY_BACKSPACE",
                "17": "KEY_CONTROL",
                "46": "KEY_DELETE",
                "40": "KEY_DOWN",
                "35": "KEY_END",
                "187": "KEY_EQUAL",
                "27": "KEY_ESC",
                "36": "KEY_HOME",
                "45": "KEY_INSERT",
                "37": "KEY_LEFT",
                "189": "KEY_MINUS",
                "34": "KEY_PAGEDOWN",
                "33": "KEY_PAGEUP",
                // "190": "KEY_PERIOD",
                "13": "KEY_RETURN",
                "39": "KEY_RIGHT",
                "16": "KEY_SHIFT",
                // "32": "KEY_SPACE",
                "9": "KEY_TAB",
                "38": "KEY_UP",
                "91": "KEY_WINDOW"
                //"107" : "NUMPAD_ADD",
                //"194" : "NUMPAD_COMMA",
                //"110" : "NUMPAD_DECIMAL",
                //"111" : "NUMPAD_DIVIDE",
                //"12" : "NUMPAD_EQUAL",
                //"106" : "NUMPAD_MULTIPLY",
                //"109" : "NUMPAD_SUBTRACT"
            },
                onStateChanged = function onStateChanged(item, that) {
                if (item && item.onStateChanged) {
                    item.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                if (that.state == "changeValue") {
                    if (item && item.onChange) {
                        item.onChange.call(that, that);
                    } else if (this.onChange) {
                        this.onChange.call(that, that);
                    }
                }

                item = null;
                that = null;
                return true;
            },
                alignComboboxDisplay = function alignComboboxDisplay() {
                var i = this.queue.length,
                    w;

                while (i--) {
                    var item = this.queue[i];
                    if (item.$display) {
                        w = Math.max(item.$select.outerWidth(), U.number(item.minWidth));
                        item.$display.css({
                            "min-width": w
                        });
                        if (item.reset) {
                            item.$display.find(".addon-icon-reset").css({
                                "line-height": this.queue[i].$display.height() + "px"
                            });
                        }

                        // 높이조절 처리
                        if (item.multiple) {
                            var displayTableHeightAdjust = function () {
                                return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                            }.call(this);
                            item.$target.height('');
                            item.$display.height('');

                            var displayTableHeight = item.$displayTable.outerHeight();
                            if (Math.abs(displayTableHeight - item.$target.height()) > displayTableHeightAdjust) {
                                item.$target.css({ height: displayTableHeight + displayTableHeightAdjust + 4 });
                                item.$display.css({ height: displayTableHeight + displayTableHeightAdjust + 4 });
                            }
                        }
                    }
                }

                i = null;
                w = null;
                return this;
            },
                alignComboboxOptionGroup = function alignComboboxOptionGroup(append) {
                if (!this.activecomboboxOptionGroup) return this;

                var item = this.queue[this.activecomboboxQueueIndex],
                    pos = {},
                    positionMargin = 0,
                    dim = {},
                    pickerDim = {},
                    pickerDirection;

                if (append) jQuery(document.body).append(this.activecomboboxOptionGroup);

                pos = item.$target.offset();
                dim = {
                    width: item.$target.outerWidth(),
                    height: item.$target.outerHeight()
                };
                pickerDim = {
                    winWidth: Math.max($window.width(), jQuery(document.body).width()),
                    winHeight: Math.max($window.height(), jQuery(document.body).height()),
                    width: this.activecomboboxOptionGroup.outerWidth(),
                    height: this.activecomboboxOptionGroup.outerHeight()
                };

                // picker css(width, left, top) & direction 결정
                if (!item.direction || item.direction === "" || item.direction === "auto") {
                    // set direction
                    pickerDirection = "top";

                    if (pos.top - pickerDim.height - positionMargin < 0) {
                        pickerDirection = "top";
                    } else if (pos.top + dim.height + pickerDim.height + positionMargin > pickerDim.winHeight) {
                        pickerDirection = "bottom";
                    }
                } else {
                    pickerDirection = item.direction;
                }

                if (append) {
                    this.activecomboboxOptionGroup.addClass("direction-" + pickerDirection);
                }
                this.activecomboboxOptionGroup.css(function () {
                    if (pickerDirection == "top") {
                        if (pos.top + dim.height + pickerDim.height + positionMargin > pickerDim.winHeight) {

                            var newTop = pos.top + dim.height / 2 - pickerDim.height / 2;
                            if (newTop + pickerDim.height + positionMargin > pickerDim.winHeight) {
                                newTop = 0;
                            }
                            if (newTop < 0) {
                                newTop = 0;
                            }

                            return {
                                left: pos.left,
                                top: newTop,
                                width: dim.width
                            };
                        }
                        return {
                            left: pos.left,
                            top: pos.top + dim.height + 1,
                            width: dim.width
                        };
                    } else if (pickerDirection == "bottom") {
                        return {
                            left: pos.left,
                            top: pos.top - pickerDim.height - 1,
                            width: dim.width
                        };
                    }
                }.call(this));
            },
                onBodyClick = function onBodyClick(e, target) {
                if (!this.activecomboboxOptionGroup) return this;

                var item = this.queue[this.activecomboboxQueueIndex],
                    clickEl = "display";

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-option-value")) {
                        clickEl = "optionItem";
                        return true;
                    } else if (item.$target.get(0) == target) {
                        clickEl = "display";
                        return true;
                    }
                });

                if (!target) {
                    this.close();
                    return this;
                } else if (clickEl === "optionItem") {

                    setOptionSelect.call(this, item.id, {
                        index: {
                            gindex: target.getAttribute("data-option-group-index"),
                            index: target.getAttribute("data-option-index")
                        }
                    }, undefined, true);

                    alignComboboxDisplay.call(this);
                    alignComboboxOptionGroup.call(this);

                    if (!item.multiple) {
                        this.close();
                    }
                } else {}

                return this;
            },
                getLabel = function getLabel(queIdx) {
                var item = this.queue[queIdx];

                // 템플릿에 전달 해야할 데이터 선언
                var data = {};
                data.id = item.id;
                data.theme = item.theme;
                data.size = "ax5combobox-option-group-" + item.size;
                data.multiple = item.multiple;
                data.lang = item.lang;
                data.options = item.options;
                data.selected = item.selected;
                data.hasSelected = data.selected && data.selected.length > 0;
                data.removeIcon = item.removeIcon;

                return COMBOBOX.tmpl.get.call(this, "label", data, item.columnKeys);
            },
                printLabel = function printLabel(queIdx) {
                var item = this.queue[queIdx];

                item.$displayLabel.find('[data-ax5combobox-selected-label]').remove();
                item.$displayLabelInput.before(getLabel.call(this, queIdx));
            },
                focusLabel = function focusLabel(queIdx) {
                if (this.queue[queIdx].disabled) return this;

                this.queue[queIdx].$displayLabel.trigger("focus");
                this.queue[queIdx].$displayLabelInput.focus();
            },
                clearLabel = function clearLabel(queIdx) {
                this.queue[queIdx].$displayLabelInput.val('');
            },
                blurLabel = function blurLabel(queIdx) {
                this.queue[queIdx].$displayLabel.trigger("blur");
                this.queue[queIdx].$displayLabelInput.trigger("blur");
            },
                onSearch = function onSearch(queIdx, searchWord) {
                this.queue[queIdx].waitOptions = true;

                this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "option", this.queue[queIdx], this.queue[queIdx].columnKeys)));

                this.queue[queIdx].onSearch.call({
                    self: this,
                    item: this.queue[queIdx],
                    searchWord: searchWord
                }, function (O) {

                    var data = {};
                    var item = this.queue[this.activecomboboxQueueIndex];
                    if (!item) return false;

                    /// 현재 selected 검증후 처리
                    (function (item, O) {
                        var optionsMap = {};
                        O.options.forEach(function (_O, _OIndex) {
                            _O["@index"] = _OIndex;
                            optionsMap[_O[item.columnKeys.optionValue]] = _O;
                        });
                        if (U.isArray(item.selected)) {
                            item.selected.forEach(function (_O) {
                                if (optionsMap[_O[item.columnKeys.optionValue]]) {
                                    O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected] = true;
                                }
                            });
                        }
                    })(item, O);

                    item.options = syncComboboxOptions.call(this, this.activecomboboxQueueIndex, O.options);

                    alignComboboxDisplay.call(this);

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5combobox-option-group-" + item.size;
                    data.multiple = item.multiple;
                    data.lang = item.lang;
                    data.options = item.options;

                    this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "options", data, item.columnKeys)));
                }.bind(this));
            },
                focusWord = function focusWord(queIdx, searchWord) {
                //console.log(searchWord);

                if (this.activecomboboxQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.
                var options = [],
                    i = -1,
                    l = this.queue[queIdx].indexedOptions.length - 1,
                    n;

                if (searchWord != "") {
                    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                    searchWord = searchWord.replace(regExp, "");
                    if (this.queue[queIdx].onSearch) {
                        onSearch.call(this, queIdx, searchWord);

                        try {
                            return options;
                        } finally {
                            options = null;
                            i = null;
                            l = null;
                            n = null;
                        }
                        // if there is a "onSearch", to end this process
                    }

                    while (l - i++) {
                        n = this.queue[queIdx].indexedOptions[i];

                        if (('' + n.text).toLowerCase() == searchWord.toLowerCase()) {
                            options = [{ '@findex': n['@findex'], optionsSort: 0 }];
                            break;
                        } else {
                            var sort = ('' + n.text).toLowerCase().search(searchWord.toLowerCase());
                            if (sort > -1) {
                                options.push({ '@findex': n['@findex'], optionsSort: sort });
                                if (options.length > 2) break;
                            }
                            sort = null;
                        }
                    }
                    options.sort(function (a, b) {
                        return a.optionsSort - b.optionsSort;
                    });
                }

                if (options && options.length > 0) {
                    focusMove.call(this, queIdx, undefined, options[0]['@findex']);
                } else {
                    focusClear.call(this, queIdx);
                }

                try {
                    return options;
                } finally {
                    options = null;
                    i = null;
                    l = null;
                    n = null;
                }
            },
                focusClear = function focusClear(queIdx) {
                if (this.activecomboboxOptionGroup) {
                    this.activecomboboxOptionGroup.find('[data-option-focus-index]').removeClass("hover").removeAttr("data-option-selected");
                }

                this.queue[queIdx].optionFocusIndex = -1;
            },
                focusMove = function focusMove(queIdx, direction, findex) {
                var _focusIndex, _prevFocusIndex, focusOptionEl, optionGroupScrollContainer;
                var item = this.queue[queIdx];

                if (this.activecomboboxOptionGroup && item.options && item.options.length > 0) {

                    if (typeof findex !== "undefined") {
                        _focusIndex = findex;
                    } else {
                        _prevFocusIndex = item.optionFocusIndex == -1 ? item.optionSelectedIndex || -1 : item.optionFocusIndex;
                        if (_prevFocusIndex == -1) {
                            _focusIndex = 0;
                            //_focusIndex = (direction > 0) ? 0 : item.optionItemLength - 1; // 맨 끝으로 보낼것인가 말 것인가.
                        } else {
                            _focusIndex = _prevFocusIndex + direction;
                            if (_focusIndex < 0) _focusIndex = 0;else if (_focusIndex > item.optionItemLength - 1) _focusIndex = item.optionItemLength - 1;
                        }
                    }

                    item.optionFocusIndex = _focusIndex;

                    // 포커스 인덱스가 hide아이템을 만나면 hide 아이템이 안나올 때까지 루프를 순회 합니다.
                    // todo : editable 로 추가된 options가 제거 되지 않으므로. 인덱스 검색을 좀 더 보강 해야함.
                    if (item.options[_focusIndex] && item.options[_focusIndex].hide) {
                        // 옵션이 없는 값이 선택된 경우
                        if (typeof direction === "undefined") {
                            return this;
                        } else {
                            var isStrop = false;
                            while (item.options[_focusIndex].hide) {
                                _focusIndex = _focusIndex + direction;
                                if (_focusIndex < 0) {
                                    _focusIndex = 0;
                                    break;
                                } else if (_focusIndex > item.optionItemLength - 1) {
                                    _focusIndex = item.optionItemLength - 1;
                                    break;
                                }
                            }
                        }
                    }

                    if (typeof _focusIndex !== "undefined") {
                        this.activecomboboxOptionGroup.find('[data-option-focus-index]').removeClass("hover");

                        focusOptionEl = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + _focusIndex + '"]').addClass("hover");

                        optionGroupScrollContainer = this.activecomboboxOptionGroup.find('[data-els="content"]');

                        if (focusOptionEl.get(0)) {
                            var focusOptionElHeight = focusOptionEl.outerHeight(),
                                optionGroupScrollContainerHeight = optionGroupScrollContainer.innerHeight(),
                                optionGroupScrollContainerScrollTop = optionGroupScrollContainer.scrollTop(),
                                focusOptionElTop = focusOptionEl.position().top + optionGroupScrollContainer.scrollTop();

                            if (optionGroupScrollContainerHeight + optionGroupScrollContainerScrollTop < focusOptionElTop + focusOptionElHeight) {
                                optionGroupScrollContainer.scrollTop(focusOptionElTop + focusOptionElHeight - optionGroupScrollContainerHeight);
                            } else if (optionGroupScrollContainerScrollTop > focusOptionElTop) {
                                optionGroupScrollContainer.scrollTop(focusOptionElTop);
                            }
                            // optionGroup scroll check

                            if (typeof direction !== "undefined") {
                                item.$displayLabelInput.val(item.options[_focusIndex].text);
                            }
                        }
                    }
                }
            },
                syncComboboxOptions = function () {
                var setSelected = function setSelected(queIdx, O) {
                    if (!O) {
                        this.queue[queIdx].selected = [];
                    } else {
                        this.queue[queIdx].selected.push(jQuery.extend({}, O));
                        /*
                         콤보박스는 selected가 없을 때 options의 첫번째 아이템이 selected가 되지 않는다.
                         if (this.queue[queIdx].multiple) this.queue[queIdx].selected.push(jQuery.extend({}, O));
                         else this.queue[queIdx].selected[0] = jQuery.extend({}, O);
                         */
                    }
                };

                return function (queIdx, options) {
                    var item = this.queue[queIdx];
                    var po,
                        elementOptions,
                        newOptions,
                        focusIndex = 0;
                    setSelected.call(this, queIdx, false); // item.selected 초기화

                    if (options) {
                        item.options = options;
                        item.indexedOptions = [];

                        // combobox options 태그 생성
                        po = [];
                        po.push('<option value=""></option>');

                        item.options.forEach(function (O, OIndex) {
                            /// @gindex : index of optionGroup
                            /// @index : index of options (if you use optionGroup then the index is not unique)
                            if (O.optgroup) {
                                O['@gindex'] = OIndex;
                                O.options.forEach(function (OO, OOIndex) {
                                    OO['@index'] = OOIndex;
                                    OO['@findex'] = focusIndex;
                                    po.push('<option value="' + OO[item.columnKeys.optionValue] + '" ' + (OO[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + OO[item.columnKeys.optionText] + '</option>');
                                    if (OO[item.columnKeys.optionSelected]) {
                                        setSelected.call(self, queIdx, OO);
                                    }

                                    item.indexedOptions.push({
                                        '@gindex': OIndex,
                                        '@index': OOIndex,
                                        '@findex': focusIndex,
                                        value: OO[item.columnKeys.optionValue],
                                        text: OO[item.columnKeys.optionText]
                                    });
                                    focusIndex++;
                                });
                            } else {
                                O['@index'] = OIndex;
                                O['@findex'] = focusIndex;
                                po.push('<option value="' + O[item.columnKeys.optionValue] + '" ' + (O[item.columnKeys.optionSelected] ? ' selected="selected"' : '') + '>' + O[item.columnKeys.optionText] + '</option>');
                                if (O[item.columnKeys.optionSelected]) {
                                    setSelected.call(self, queIdx, O);
                                }

                                item.indexedOptions.push({
                                    '@index': OIndex,
                                    '@findex': focusIndex,
                                    value: O[item.columnKeys.optionValue],
                                    text: O[item.columnKeys.optionText]
                                });
                                focusIndex++;
                            }
                        });
                        item.optionItemLength = focusIndex;
                        item.$select.html(po.join(''));
                    } else {
                        /// select > options 태그로 스크립트 options를 만들어주는 역할
                        if (item.$select.get(0).options && item.$select.get(0).options.length) item.$select.get(0).options[0].selected = false;
                        elementOptions = U.toArray(item.$select.get(0).options);

                        // select option 스크립트 생성
                        newOptions = [];
                        elementOptions.forEach(function (O, OIndex) {
                            var option = {};
                            option[item.columnKeys.optionValue] = O.value;
                            option[item.columnKeys.optionText] = O.text;
                            option[item.columnKeys.optionSelected] = O.selected;
                            option['@index'] = OIndex;
                            option['@findex'] = focusIndex;
                            if (O.selected) setSelected.call(self, queIdx, option);
                            newOptions.push(option);
                            focusIndex++;

                            option = null;
                        });
                        item.options = newOptions;
                        item.indexedOptions = newOptions;

                        item.$select.prepend('<option value=""></option>');
                        item.$select.get(0).options[0].selected = true;
                    }

                    po = null;
                    elementOptions = null;
                    newOptions = null;
                    return item.options;
                };
            }(),
                getQueIdx = function getQueIdx(boundID) {
                if (boundID instanceof jQuery) {
                    boundID = boundID.data("data-ax5combobox-id");
                } else if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-ax5combobox-id");
                }
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5combobox", "402", "getQueIdx"));
                    return;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            },
                getSelected = function getSelected(_item, o, selected) {
                if (typeof selected === "undefined") {
                    return _item.multiple ? !o : true;
                } else {
                    return selected;
                }
            },
                clearSelected = function clearSelected(queIdx) {
                this.queue[queIdx].options.forEach(function (n) {
                    if (n.optgroup) {
                        n.options.forEach(function (nn) {
                            nn.selected = false;
                        });
                    } else {
                        n.selected = false;
                    }
                });
            },
                setOptionSelect = function () {
                var processor = {
                    'index': function index(queIdx, value, selected, setValueType) {
                        // 클래스 내부에서 호출된 형태, 그런 이유로 옵션그룹에 대한 상태를 변경 하고 있다.
                        var item = this.queue[queIdx];

                        if (U.isString(value.index.gindex)) {
                            if (typeof item.options[value.index.gindex] !== "undefined") {

                                item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected], selected);

                                if (self.activecomboboxOptionGroup) {
                                    self.activecomboboxOptionGroup.find('[data-option-group-index="' + value.index.gindex + '"][data-option-index="' + value.index.index + '"]').attr("data-option-Selected", item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected].toString());
                                }
                            }
                        } else {
                            if (typeof item.options[value.index.index] !== "undefined") {

                                item.options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.index][item.columnKeys.optionSelected], selected);

                                if (self.activecomboboxOptionGroup) {
                                    self.activecomboboxOptionGroup.find('[data-option-index="' + value.index.index + '"]').attr("data-option-Selected", item.options[value.index.index][item.columnKeys.optionSelected].toString());
                                }
                            }
                        }

                        if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                            syncComboboxOptions.call(this, queIdx, item.options);
                            alignComboboxOptionGroup.call(this);
                        }
                    },
                    'arr': function arr(queIdx, values, selected, setValueType) {
                        values.forEach(function (value) {
                            if (U.isString(value) || U.isNumber(value)) {
                                processor.text.call(self, queIdx, value, selected, "justSetValue");
                            } else {
                                for (var key in processor) {
                                    if (value[key]) {
                                        processor[key].call(self, queIdx, value, selected, "justSetValue");
                                        break;
                                    }
                                }
                            }
                        });

                        syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                        alignComboboxOptionGroup.call(this);
                    },
                    'value': function value(queIdx, _value2, selected, setValueType) {
                        var item = this.queue[queIdx];
                        var addOptions;
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionValue] == _value2[item.columnKeys.optionValue];
                        });

                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            // 새로운 값 추가
                            optionIndex = item.options.length;
                            addOptions = {
                                "@index": optionIndex,
                                hide: true,
                                addedOption: true
                            };
                            addOptions[item.columnKeys.optionValue] = _value2;
                            addOptions[item.columnKeys.optionText] = _value2;
                            item.options.push(addOptions);
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        }
                        if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                            syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                            alignComboboxOptionGroup.call(this);
                        }
                    },
                    'text': function text(queIdx, value, selected, setValueType) {
                        var item = this.queue[queIdx];
                        var addOptions;
                        var optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionText] == value;
                        });

                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            // 새로운 값 추가
                            optionIndex = item.options.length;
                            addOptions = {
                                "@index": optionIndex,
                                hide: true,
                                addedOption: true
                            };
                            addOptions[item.columnKeys.optionValue] = value;
                            addOptions[item.columnKeys.optionText] = value;
                            item.options.push(addOptions);
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        }
                        if (typeof setValueType === "undefined" || setValueType !== "justSetValue") {
                            syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                            alignComboboxOptionGroup.call(this);
                        }
                    },
                    'clear': function clear(queIdx) {
                        clearSelected.call(this, queIdx);
                        syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                        //focusLabel.call(this, queIdx);
                        focusClear.call(this, queIdx);

                        if (this.activecomboboxOptionGroup) {
                            this.activecomboboxOptionGroup.find('[data-option-index]').attr("data-option-Selected", "false");
                        }
                        this.queue[queIdx].optionSelectedIndex = -1;
                    }
                };
                return function (boundID, value, selected, _option) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (queIdx === -1) {
                        console.log(ax5.info.getError("ax5combobox", "402", "val"));
                        return;
                    }

                    if (typeof value == "undefined") {
                        throw "error not found value";
                    } else if (U.isArray(value)) {
                        processor.clear.call(this, queIdx);
                        processor.arr.call(this, queIdx, this.queue[queIdx].multiple || value.length == 0 ? value : [value[value.length - 1]], selected);
                    } else if (U.isString(value) || U.isNumber(value)) {
                        if (typeof value !== "undefined" && value !== null && !this.queue[queIdx].multiple) {
                            clearSelected.call(this, queIdx);
                        }
                        processor.text.call(this, queIdx, value, selected, "justSetValue");
                    } else {
                        if (value === null) {
                            processor.clear.call(this, queIdx);
                        } else {
                            if (!this.queue[queIdx].multiple) {
                                clearSelected.call(this, queIdx);
                            }
                            for (var key in processor) {
                                if (value[key]) {
                                    processor[key].call(this, queIdx, value, selected, "justSetValue");
                                    break;
                                }
                            }
                        }
                    }

                    syncComboboxOptions.call(this, queIdx, this.queue[queIdx].options);
                    printLabel.call(this, queIdx);
                    focusLabel.call(this, queIdx);

                    if (typeof value !== "undefined") {
                        if (_option && !_option.noStateChange) {
                            onStateChanged.call(this, this.queue[queIdx], {
                                self: this,
                                item: this.queue[queIdx],
                                state: "changeValue",
                                value: this.queue[queIdx].selected
                            });
                        }
                    }

                    boundID = null;
                    return this;
                };
            }();

            /// private end

            /**
             * Preferences of combobox UI
             * @method ax5combobox.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5combobox}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onChange = cfg.onChange;
                jQuery(window).on("resize.ax5combobox-display-" + this.instanceId, function () {
                    alignComboboxDisplay.call(this);
                }.bind(this));
            };

            /**
             * bind combobox
             * @method ax5combobox.bind
             * @param {Object} item
             * @param {String} [item.id]
             * @param {String} [item.theme]
             * @param {Boolean} [item.multiple]
             * @param {Element} item.target
             * @param {Object[]} item.options
             * @returns {ax5combobox}
             */
            this.bind = function (item) {
                var bindComboboxTarget = function () {
                    var debouncedFocusWord = U.debounce(function (queIdx) {
                        if (this.activecomboboxQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.
                        focusWord.call(self, queIdx, this.queue[queIdx].$displayLabelInput.val());
                    }, 150);

                    var blurLabel = function blurLabel(queIdx) {
                        clearLabel.call(this, queIdx);
                    };

                    var comboboxEvent = {
                        'click': function click(queIdx, e) {
                            var clickEl;
                            var target = U.findParentNode(e.target, function (target) {
                                if (target.getAttribute("data-ax5combobox-remove")) {
                                    clickEl = "optionItemRemove";
                                    return true;
                                } else if (target.getAttribute("data-selected-clear")) {
                                    clickEl = "clear";
                                    return true;
                                }
                            });

                            if (target) {
                                if (clickEl === "optionItemRemove") {
                                    var selectedIndex = target.getAttribute("data-ax5combobox-remove-index");
                                    var option = this.queue[queIdx].selected[selectedIndex];
                                    setOptionSelect.call(this, queIdx, {
                                        index: {
                                            gindex: option['@gindex'],
                                            index: option['@index']
                                        }
                                    }, false, true);
                                    alignComboboxDisplay.call(this);
                                    alignComboboxOptionGroup.call(this);
                                    focusLabel.call(this, queIdx);
                                    U.stopEvent(e);
                                    return this;
                                } else if (clickEl === "clear") {
                                    setOptionSelect.call(this, queIdx, { clear: true });
                                    alignComboboxDisplay.call(this);
                                    alignComboboxOptionGroup.call(this);
                                    focusLabel.call(this, queIdx);
                                }
                            } else {
                                if (self.activecomboboxQueueIndex == queIdx) {
                                    if (this.queue[queIdx].optionFocusIndex == -1) {
                                        // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                                        self.close();
                                    }
                                } else {
                                    self.open(queIdx);
                                    focusLabel.call(this, queIdx);
                                }
                            }
                        },
                        'keyUp': function keyUp(queIdx, e) {
                            /// 약속된 키 이벤트가 발생하면 stopEvent를 통해 keyUp 이벤트가 발생되지 않도록 막아주는 센스
                            if (e.which == ax5.info.eventKeys.ESC && self.activecomboboxQueueIndex === -1) {
                                // ESC키를 누르고 옵션그룹이 열려있지 않은 경우
                                U.stopEvent(e);
                                return this;
                            }
                            if (self.activecomboboxQueueIndex != queIdx) {
                                // 닫힌 상태 인경우
                                self.open(queIdx);
                                U.stopEvent(e);
                            }

                            var disableCtrlKeys = {
                                "40": "KEY_DOWN",
                                "38": "KEY_UP"
                            };
                            if (!disableCtrlKeys[e.which]) {

                                // backspace 감지 하여 input 값이 없으면 스탑이벤트 처리 할 것
                                if (e.which == ax5.info.eventKeys.BACKSPACE && this.queue[queIdx].$displayLabelInput.val() == "") {
                                    // 마지막 아이템을 제거.
                                    if (this.queue[queIdx].selected.length > 0) {
                                        var option = this.queue[queIdx].selected[this.queue[queIdx].selected.length - 1];
                                        setOptionSelect.call(this, queIdx, {
                                            index: {
                                                gindex: option['@gindex'],
                                                index: option['@index']
                                            }
                                        }, false, true);
                                    }
                                    alignComboboxDisplay.call(this);
                                    alignComboboxOptionGroup.call(this);
                                    U.stopEvent(e);
                                } else {
                                    debouncedFocusWord.call(this, queIdx);
                                }
                            }
                        },
                        'keyDown': function keyDown(queIdx, e) {
                            if (e.which == ax5.info.eventKeys.ESC) {
                                clearLabel.call(this, queIdx);
                                this.close();
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.RETURN) {

                                setOptionSelect.call(this, item.id, {
                                    index: {
                                        gindex: item.indexedOptions[item.optionFocusIndex]["@gindex"],
                                        index: item.indexedOptions[item.optionFocusIndex]["@index"]
                                    }
                                }, undefined, true);
                                clearLabel.call(this, queIdx);
                                alignComboboxDisplay.call(this);

                                this.close();
                                //alignComboboxOptionGroup.call(this);

                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.DOWN) {
                                focusMove.call(this, queIdx, 1);
                                U.stopEvent(e);
                            } else if (e.which == ax5.info.eventKeys.UP) {
                                focusMove.call(this, queIdx, -1);
                                U.stopEvent(e);
                            }
                        },
                        'focus': function focus(queIdx, e) {
                            //console.log(e);
                        },
                        'blur': function blur(queIdx, e) {
                            blurLabel.call(this, queIdx);
                            U.stopEvent(e);
                        },
                        'selectChange': function selectChange(queIdx, e) {
                            setOptionSelect.call(this, queIdx, { value: this.queue[queIdx].$select.val() }, true);
                        }
                    };

                    return function (queIdx) {
                        var item = this.queue[queIdx];
                        var data = {};
                        // 현재 선택된 값을 담아두는 저장소, syncComboboxOptions를 통해 options와 selected값을 동기화 처리 한다.
                        item.selected = [];

                        if (!item.$display) {
                            /// 템플릿에 전달할 오브젝트 선언
                            data.instanceId = this.instanceId;
                            data.id = item.id;
                            data.name = item.name;
                            data.theme = item.theme;
                            data.tabIndex = item.tabIndex;
                            data.multiple = item.multiple;
                            data.reset = item.reset;

                            data.label = getLabel.call(this, queIdx);
                            data.formSize = function () {
                                return item.size ? "input-" + item.size : "";
                            }();

                            //item.$display = jQuery(ax5.mustache.render(COMBOBOX.tmpl["comboboxDisplay"].call(this, queIdx), data));
                            item.$display = jQuery(COMBOBOX.tmpl.get.call(this, "comboboxDisplay", data, item.columnKeys));
                            item.$displayTable = item.$display.find('[data-els="display-table"]');
                            item.$displayLabel = item.$display.find('[data-ax5combobox-display="label"]');
                            item.$displayLabelInput = item.$display.find('[data-ax5combobox-display="input"]');

                            if (item.$target.find("select").get(0)) {
                                item.$select = item.$target.find("select");
                                item.$select.attr("tabindex", "-1").attr("class", "form-control " + data.formSize);
                                if (data.name) {
                                    item.$select.attr("name", "name");
                                }
                                if (data.multiple) {
                                    item.$select.attr("multiple", "multiple");
                                }
                            } else {
                                //item.$select = jQuery(ax5.mustache.render(COMBOBOX.tmpl["formSelect"].call(this, queIdx), data));
                                item.$select = jQuery(COMBOBOX.tmpl.get.call(this, "formSelect", data, item.columnKeys));
                                item.$target.append(item.$select);
                            }

                            item.$target.append(item.$display);
                            // 라벨에 사용자 입력 필드가 있으므로 displayInput은 필요 없음.
                            // select.options로 item.options를 만들어내거나 item.options로 select.options를 만들어냄
                            item.options = syncComboboxOptions.call(this, queIdx, item.options);
                        } else {
                            item.$displayLabel.html(getLabel.call(this, queIdx));
                            item.options = syncComboboxOptions.call(this, queIdx, item.options);
                        }

                        alignComboboxDisplay.call(this);

                        item.$display.off('click.ax5combobox').on('click.ax5combobox', comboboxEvent.click.bind(this, queIdx));

                        // combobox 태그에 대한 이벤트 감시


                        item.$displayLabelInput.off("focus.ax5combobox").on("focus.ax5combobox", comboboxEvent.focus.bind(this, queIdx)).off("blur.ax5combobox").on("blur.ax5combobox", comboboxEvent.blur.bind(this, queIdx)).off('keyup.ax5combobox').on('keyup.ax5combobox', comboboxEvent.keyUp.bind(this, queIdx)).off("keydown.ax5combobox").on("keydown.ax5combobox", comboboxEvent.keyDown.bind(this, queIdx));

                        // select 태그에 대한 change 이벤트 감시

                        item.$select.off('change.ax5combobox').on('change.ax5combobox', comboboxEvent.selectChange.bind(this, queIdx));

                        data = null;
                        item = null;
                        queIdx = null;
                        return this;
                    };
                }();

                var comboboxConfig = {},
                    queIdx;

                item = jQuery.extend(true, comboboxConfig, cfg, item);
                if (!item.target) {
                    console.log(ax5.info.getError("ax5combobox", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5combobox-id");
                if (!item.id) {
                    item.id = 'ax5combobox-' + ax5.getGuid();
                    item.$target.data("data-ax5combobox-id", item.id);
                }
                item.name = item.$target.attr("data-ax5combobox");
                if (item.options) {
                    item.options = JSON.parse(JSON.stringify(item.options));
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-ax5combobox-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindComboboxTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindComboboxTarget.call(this, queIdx);
                }

                comboboxConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * open the optionBox of combobox
             * @method ax5combobox.open
             * @param {(String|Number|Element)} boundID
             * @param {Number} [tryCount]
             * @returns {ax5combobox}
             */
            this.open = function () {
                var onExpand = function onExpand(item) {
                    item.onExpand.call({
                        self: this,
                        item: item
                    }, function (O) {
                        if (this.waitOptionsCallback) {
                            var data = {};
                            var item = this.queue[this.activecomboboxQueueIndex];

                            /// 현재 selected 검증후 처리
                            (function (item, O) {
                                var optionsMap = {};
                                O.options.forEach(function (_O, _OIndex) {
                                    _O["@index"] = _OIndex;
                                    optionsMap[_O[item.columnKeys.optionValue]] = _O;
                                });
                                if (U.isArray(item.selected)) {
                                    item.selected.forEach(function (_O) {
                                        if (optionsMap[_O[item.columnKeys.optionValue]]) {
                                            O.options[optionsMap[_O[item.columnKeys.optionValue]]["@index"]][item.columnKeys.optionSelected] = true;
                                        }
                                    });
                                }
                            })(item, O);

                            item.options = syncComboboxOptions.call(this, this.activecomboboxQueueIndex, O.options);
                            printLabel.call(this, this.activecomboboxQueueIndex);
                            alignComboboxDisplay.call(this);

                            /// 템플릿에 전달할 오브젝트 선언
                            data.id = item.id;
                            data.theme = item.theme;
                            data.size = "ax5combobox-option-group-" + item.size;
                            data.multiple = item.multiple;
                            data.lang = item.lang;
                            data.options = item.options;
                            /*
                             this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(
                             ax5.mustache.render(COMBOBOX.tmpl["options"].call(this, item.columnKeys), data)
                             ));
                             */
                            this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "options", data, item.columnKeys)));
                        }
                    }.bind(this));
                };
                return function (boundID, tryCount) {
                    this.waitOptionsCallback = null;

                    /**
                     * open combobox from the outside
                     */
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    var item = this.queue[queIdx];
                    var data = {},
                        focusTop,
                        selectedOptionEl;

                    if (item.$display.attr("disabled")) return this;

                    if (this.openTimer) clearTimeout(this.openTimer);
                    if (this.activecomboboxOptionGroup) {
                        if (this.activecomboboxQueueIndex == queIdx) {
                            return this;
                        }

                        if (tryCount > 2) return this;
                        this.close();
                        this.openTimer = setTimeout(function () {
                            this.open(queIdx, (tryCount || 0) + 1);
                        }.bind(this), cfg.animateTime);

                        return this;
                    }

                    item.optionFocusIndex = -1; // optionGroup이 열리면 포커스 인덱스 초기화 -1로
                    if (item.selected && item.selected.length > 0) {
                        item.optionSelectedIndex = item.selected[0]["@findex"];
                    }

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5combobox-option-group-" + item.size;
                    data.multiple = item.multiple;

                    data.lang = item.lang;
                    item.$display.attr("data-combobox-option-group-opened", "true");

                    if (item.onExpand) {
                        // onExpand 인 경우 UI 대기모드 추가
                        data.waitOptions = true;
                    }
                    data.options = U.filter(item.options, function () {
                        return !this.hide;
                    });

                    //this.activecomboboxOptionGroup = jQuery(ax5.mustache.render(COMBOBOX.tmpl["optionGroup"].call(this, item.columnKeys), data));
                    this.activecomboboxOptionGroup = jQuery(COMBOBOX.tmpl.get.call(this, "optionGroup", data, item.columnKeys));
                    //this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(ax5.mustache.render(COMBOBOX.tmpl["options"].call(this, item.columnKeys), data)));
                    this.activecomboboxOptionGroup.find('[data-els="content"]').html(jQuery(COMBOBOX.tmpl.get.call(this, "options", data, item.columnKeys)));
                    this.activecomboboxQueueIndex = queIdx;

                    alignComboboxOptionGroup.call(this, "append"); // alignComboboxOptionGroup 에서 body append
                    jQuery(window).on("resize.ax5combobox-" + this.instanceId, function () {
                        alignComboboxOptionGroup.call(this);
                    }.bind(this));

                    if (item.selected && item.selected.length > 0) {
                        selectedOptionEl = this.activecomboboxOptionGroup.find('[data-option-index="' + item.selected[0]["@index"] + '"]');
                        if (selectedOptionEl.get(0)) {
                            focusTop = selectedOptionEl.position().top - this.activecomboboxOptionGroup.height() / 3;
                            this.activecomboboxOptionGroup.find('[data-els="content"]').stop().animate({ scrollTop: focusTop }, item.animateTime, 'swing', function () {});
                        }
                    }

                    jQuery(window).on("click.ax5combobox-" + this.instanceId, function (e) {
                        e = e || window.event;
                        onBodyClick.call(this, e);
                        U.stopEvent(e);
                    }.bind(this));

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "open",
                        item: item
                    });

                    // waitOption timer
                    if (item.onExpand) {
                        this.waitOptionsCallback = true;
                        onExpand.call(this, item);
                    }

                    data = null;
                    focusTop = null;
                    selectedOptionEl = null;
                    return this;
                };
            }();

            /**
             * @method ax5combobox.update
             * @param {(Object|String)} item
             * @returns {ax5combobox}
             */
            this.update = function (_item) {
                this.bind(_item);
                return this;
            };

            /**
             * @method ax5combobox.setValue
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _value
             * @param {Boolean} [_selected]
             * @return {ax5combobox}
             * @example
             * ```js
             * myCombo.setValue($('[data-ax5combobox="combo1"]'), "1");
             * myCombo.setValue($('[data-ax5combobox="combo1"]'), ["1", "2"]);
             * ```
             */
            this.setValue = function (_boundID, _value, _selected) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }

                clearSelected.call(this, queIdx);

                if (U.isArray(_value)) {
                    var _values = U.map(_value, function () {
                        return { value: this };
                    });
                    setOptionSelect.call(this, queIdx, _values, _selected || true, { noStateChange: true });
                } else if (U.isString(_value) || U.isNumber(_value)) {
                    setOptionSelect.call(this, queIdx, { value: _value }, _selected || true, { noStateChange: true });
                } else {
                    printLabel.call(this, queIdx);
                }

                blurLabel.call(this, queIdx);
                alignComboboxDisplay.call(this);

                return this;
            };

            /**
             * @method ax5combobox.setText
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _text
             * @param {Boolean} [_selected]
             * @returns {ax5combobox}
             * @example
             * ```js
             * myCombo.setText($('[data-ax5combobox="combo1"]'), "string");
             * myCombo.setText($('[data-ax5combobox="combo1"]'), ["substring", "search"]);
             * ```
             */
            this.setText = function (_boundID, _text, _selected) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }
                clearSelected.call(this, queIdx);
                setOptionSelect.call(this, queIdx, _text, true, { noStateChange: true });
                blurLabel.call(this, queIdx);
                alignComboboxDisplay.call(this);

                return this;
            };

            /**
             * @method ax5combobox.getSelectedOption
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {Array}
             */
            this.getSelectedOption = function (_boundID) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }
                return U.deepCopy(this.queue[queIdx].selected);
            };

            /**
             * @method ax5combobox.close
             * @returns {ax5combobox}
             */
            this.close = function (item) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activecomboboxOptionGroup) return this;

                item = this.queue[this.activecomboboxQueueIndex];
                item.optionFocusIndex = -1;
                item.$display.removeAttr("data-combobox-option-group-opened").trigger("focus");
                item.$displayLabel.attr("contentEditable", "false");

                this.activecomboboxOptionGroup.addClass("destroy");

                jQuery(window).off("resize.ax5combobox-" + this.instanceId).off("click.ax5combobox-" + this.instanceId).off("keyup.ax5combobox-" + this.instanceId);

                this.closeTimer = setTimeout(function () {
                    if (this.activecomboboxOptionGroup) this.activecomboboxOptionGroup.remove();
                    this.activecomboboxOptionGroup = null;
                    this.activecomboboxQueueIndex = -1;

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "close"
                    });
                }.bind(this), cfg.animateTime);
                this.waitOptionsCallback = null;
                return this;
            };

            /**
             * @method ax5combobox.blur
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5combobox}
             */
            this.blur = function (_boundID) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "val"));
                    return;
                }

                blurLabel.call(this, queIdx);
                return this;
            };

            /**
             * @method ax5combobox.enable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5combobox}
             */
            this.enable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);

                if (typeof queIdx !== "undefined") {
                    this.queue[queIdx].disabled = false;
                    if (this.queue[queIdx].$display[0]) {
                        this.queue[queIdx].$display.removeAttr("disabled");
                        this.queue[queIdx].$displayLabelInput.removeAttr("disabled");
                    }
                    if (this.queue[queIdx].$select[0]) {
                        this.queue[queIdx].$select.removeAttr("disabled");
                    }

                    onStateChanged.call(this, this.queue[queIdx], {
                        self: this,
                        state: "enable"
                    });
                }

                return this;
            };

            /**
             * @method ax5combobox.disable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5combobox}
             */
            this.disable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);

                if (typeof queIdx !== "undefined") {
                    this.queue[queIdx].disabled = true;
                    if (this.queue[queIdx].$display[0]) {
                        this.queue[queIdx].$display.attr("disabled", "disabled");
                        this.queue[queIdx].$displayLabelInput.attr("disabled", "disabled");
                    }
                    if (this.queue[queIdx].$select[0]) {
                        this.queue[queIdx].$select.attr("disabled", "disabled");
                    }

                    onStateChanged.call(this, this.queue[queIdx], {
                        self: this,
                        state: "disable"
                    });
                }
                return this;
            };

            /**
             * @method ax5combobox.align
             */
            this.align = function () {
                alignComboboxDisplay.call(this);
                return this;
            };

            /**
             * @method ax5combobox.clear
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5combobox}
             */
            this.clear = function (_boundID) {
                var queIdx = U.isNumber(_boundID) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5combobox", "402", "clear"));
                    return;
                }

                clearSelected.call(this, queIdx);
                setOptionSelect.call(this, queIdx, [], false, { noStateChange: false });
                printLabel.call(this, queIdx);
                blurLabel.call(this, queIdx);
                alignComboboxDisplay.call(this);

                return this;
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    this.init();
                }
            }.apply(this, arguments);
        };
    }());

    COMBOBOX = ax5.ui.combobox;
})();

// ax5.ui.combobox.tmpl
(function () {

    var COMBOBOX = ax5.ui.combobox;
    var U = ax5.util;

    var optionGroup = function optionGroup(columnKeys) {
        return '\n            <div class="ax5combobox-option-group {{theme}} {{size}}" data-ax5combobox-option-group="{{id}}">\n                <div class="ax-combobox-body">\n                    <div class="ax-combobox-option-group-content" data-els="content"></div>\n                </div>\n                <div class="ax-combobox-arrow"></div> \n            </div>\n        ';
    };

    var comboboxDisplay = function comboboxDisplay(columnKeys) {
        return '\n<div class="form-control {{formSize}} ax5combobox-display {{theme}}" \ndata-ax5combobox-display="{{id}}" data-ax5combobox-instance="{{instanceId}}">\n    <div class="ax5combobox-display-table" data-els="display-table">\n        <div data-ax5combobox-display="label-holder"> \n            <a {{^tabIndex}}{{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}\n            data-ax5combobox-display="label"\n            spellcheck="false"><input type="text"data-ax5combobox-display="input" style="border:0 none;" /></a>\n        </div>\n        <div data-ax5combobox-display="addon"> \n            {{#multiple}}{{#reset}}\n            <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>\n            {{/reset}}{{/multiple}}\n            {{#icons}}\n            <span class="addon-icon-closed">{{clesed}}</span>\n            <span class="addon-icon-opened">{{opened}}</span>\n            {{/icons}}\n            {{^icons}}\n            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n            {{/icons}}\n        </div>\n    </div>\n</div>\n        ';
    };

    var formSelect = function formSelect(columnKeys) {
        return '\n            <select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>\n        ';
    };

    var formSelectOptions = function formSelectOptions(columnKeys) {
        return '\n{{#selected}}\n<option value="{{' + columnKeys.optionValue + '}}" selected="true">{{' + columnKeys.optionText + '}}</option>\n{{/selected}}\n';
    };

    var options = function options(columnKeys) {
        return '\n            {{#waitOptions}}\n                <div class="ax-combobox-option-item">\n                        <div class="ax-combobox-option-item-holder">\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">\n                                {{{lang.loading}}}\n                            </span>\n                        </div>\n                    </div>\n            {{/waitOptions}}\n            {{^waitOptions}}\n                {{#options}}\n                    {{#optgroup}}\n                        <div class="ax-combobox-option-group">\n                            <div class="ax-combobox-option-item-holder">\n                                <span class="ax-combobox-option-group-label">\n                                    {{{.}}}\n                                </span>\n                            </div>\n                            {{#options}}\n                            {{^hide}}\n                            <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" \n                            data-option-value="{{' + columnKeys.optionValue + '}}" \n                            {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                                <div class="ax-combobox-option-item-holder">\n                                    {{#multiple}}\n                                    <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">\n                                        <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                                    </span>\n                                    {{/multiple}}\n                                    <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                                </div>\n                            </div>\n                            {{/hide}}\n                            {{/options}}\n                        </div>                            \n                    {{/optgroup}}\n                    {{^optgroup}}\n                    {{^hide}}\n                    <div class="ax-combobox-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{' + columnKeys.optionValue + '}}" {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                        <div class="ax-combobox-option-item-holder">\n                            {{#multiple}}\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-checkbox">\n                                <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                            </span>\n                            {{/multiple}}\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">{{' + columnKeys.optionText + '}}</span>\n                        </div>\n                    </div>\n                    {{/hide}}\n                    {{/optgroup}}\n                {{/options}}\n                {{^options}}\n                    <div class="ax-combobox-option-item">\n                        <div class="ax-combobox-option-item-holder">\n                            <span class="ax-combobox-option-item-cell ax-combobox-option-item-label">\n                                {{{lang.noOptions}}}\n                            </span>\n                        </div>\n                    </div>\n                {{/options}}\n            {{/waitOptions}}\n        ';
    };

    var label = function label(columnKeys) {
        return '{{#selected}}<div tabindex="-1" data-ax5combobox-selected-label="{{@i}}" data-ax5combobox-selected-text="{{text}}"><div data-ax5combobox-remove="true" \ndata-ax5combobox-remove-index="{{@i}}">{{{removeIcon}}}</div><span>{{' + columnKeys.optionText + '}}</span></div>{{/selected}}';
    };

    COMBOBOX.tmpl = {
        "comboboxDisplay": comboboxDisplay,
        "formSelect": formSelect,
        "formSelectOptions": formSelectOptions,
        "optionGroup": optionGroup,
        "options": options,
        "label": label,

        get: function get(tmplName, data, columnKeys) {
            return ax5.mustache.render(COMBOBOX.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();
/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.combobox.util
(function () {

    var COMBOBOX = ax5.ui.combobox;
    var U = ax5.util;

    var nodeTypeProcessor = {
        '1': function _(queIdx, node, editable) {
            var cfg = this.config;
            var textNode = node;

            if ($(node).find("span").get(0)) {
                textNode = $(node).find("span").get(0);
            }

            var text = (textNode.textContent || textNode.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            var selectedIndex, option;
            if (item.selected && item.selected.length > 0 && node.getAttribute("data-ax5combobox-selected-text") == text) {
                selectedIndex = node.getAttribute("data-ax5combobox-selected-label");
                option = item.selected[selectedIndex];
                return {
                    index: {
                        gindex: option["@gindex"],
                        index: option["@index"],
                        value: option[cfg.columnKeys.optionValue]
                    }
                };
            } else if (!node.getAttribute("data-ax5combobox-selected-text")) {
                if (text != "") {
                    if (editable) {
                        return text;
                    } else {
                        var $option;
                        if (item.optionFocusIndex > -1) $option = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                        if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                            return {
                                index: {
                                    gindex: $option.attr("data-option-group-index"),
                                    index: $option.attr("data-option-index")
                                }
                            };
                        } else {
                            return item.editable ? text : undefined;
                        }
                    }
                } else {
                    return undefined;
                }
            } else {
                return text;
            }
        },
        '3': function _(queIdx, node, editable) {
            var cfg = this.config;
            var text = (node.textContent || node.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            if (text != "") {
                if (editable) {
                    return text;
                } else {
                    var $option;
                    if (item.optionFocusIndex > -1) $option = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                    if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                        return {
                            index: {
                                gindex: $option.attr("data-option-group-index"),
                                index: $option.attr("data-option-index")
                            }
                        };
                    } else {
                        return item.editable ? text : undefined;
                    }
                }
            } else {
                return undefined;
            }
        }
    };

    COMBOBOX.util = {
        nodeTypeProcessor: nodeTypeProcessor
    };
})();

/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

/**
 * ax5combobox jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5combobox
 * @param {String} methodName
 * @param [arguments]
 * @param [arguments]
 * @example
 * ```html
 * <div data-ax5combobox="ax1" data-ax5combobox-config='{
 *  multiple: true,
 *  editable: true,
 *  size: "",
 *  theme:""
 *  }'></div>
 * <script>
 * jQuery('[data-ax5combobox="ax1"]').ax5combobox();
 * $('[data-ax5combobox="ax1"]').ax5combobox("getSelectedOption");
 * $('[data-ax5combobox="ax1"]').ax5combobox("setValue", ["string", "number"]);
 * $('[data-ax5combobox="ax1"]').ax5combobox("enable");
 * $('[data-ax5combobox="ax1"]').ax5combobox("disable");
 * </script>
 * ```
 */

ax5.ui.combobox_instance = new ax5.ui.combobox();
jQuery.fn.ax5combobox = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.combobox_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.combobox_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.combobox_instance.setValue(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "setText":
                    return ax5.ui.combobox_instance.setText(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "getSelectedOption":
                    return ax5.ui.combobox_instance.getSelectedOption(this);
                    break;
                case "enable":
                    return ax5.ui.combobox_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.combobox_instance.disable(this);
                    break;
                case "blur":
                    return ax5.ui.combobox_instance.blur(this);
                case "clear":
                    return ax5.ui.combobox_instance.clear(this);
                default:
                    return this;
            }
        } else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.combobox_instance.bind(config);
            });
        }
        return this;
    };
}();