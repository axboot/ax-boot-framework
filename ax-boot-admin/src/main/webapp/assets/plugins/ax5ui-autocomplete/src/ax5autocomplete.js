/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.autocomplete
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var AUTOCOMPLETE;

    UI.addClass({
        className: "autocomplete",
        version: "0.0.5"
    }, (function () {
        /**
         * @class ax5autocomplete
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```
         *
         * ```
         */
        var ax5autocomplete = function () {
            var
                self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 250,
                removeIcon: 'X',
                lang: {
                    noSelected: '',
                    noOptions: 'no options',
                    loading: 'Now Processing'
                },
                columnKeys: {
                    optionValue: 'value',
                    optionText: 'text',
                    optionSelected: 'selected'
                }
            };

            this.queue = [];
            this.activeautocompleteOptionGroup = null;
            this.activeautocompleteQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;
            this.waitOptionsCallback = null;
            this.keyUpTimer = null;

            cfg = this.config;

            var
                ctrlKeys = {
                    "18": "KEY_ALT",
                    //"8": "KEY_BACKSPACE",
                    "17": "KEY_CONTROL",
                    "46": "KEY_DELETE",
                    "40": "KEY_DOWN",
                    "35": "KEY_END",
                    "187": "KEY_EQUAL",
                    //"27": "KEY_ESC",
                    "36": "KEY_HOME",
                    "45": "KEY_INSERT",
                    "37": "KEY_LEFT",
                    "189": "KEY_MINUS",
                    "34": "KEY_PAGEDOWN",
                    "33": "KEY_PAGEUP",
                    // "190": "KEY_PERIOD",
                    //"13": "KEY_RETURN",
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
                onStateChanged = function (item, that) {
                    if (item && item.onStateChanged) {
                        item.onStateChanged.call(that, that);
                    }
                    else if (this.onStateChanged) {
                        this.onStateChanged.call(that, that);
                    }

                    if (that.state == "changeValue") {
                        if (item && item.onChange) {
                            item.onChange.call(that, that);
                        }
                        else if (this.onChange) {
                            this.onChange.call(that, that);
                        }
                    }

                    item = null;
                    that = null;
                    return true;
                },
                alignAutocompleteDisplay = function () {
                    var i = this.queue.length, w;

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
                                var displayTableHeightAdjust = (function () {
                                    return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                                }).call(this);
                                item.$target.height('');
                                item.$display.height('');

                                var displayTableHeight = item.$displayTable.outerHeight();
                                if (Math.abs(displayTableHeight - item.$target.height()) > displayTableHeightAdjust) {
                                    item.$target.css({height: displayTableHeight + displayTableHeightAdjust});
                                    item.$display.css({height: displayTableHeight + displayTableHeightAdjust});
                                }
                            }
                        }
                    }

                    i = null;
                    w = null;
                    return this;
                },
                alignAutocompleteOptionGroup = function (append) {
                    if (!this.activeautocompleteOptionGroup) return this;

                    var
                        item = this.queue[this.activeautocompleteQueueIndex],
                        pos = {},
                        dim = {};

                    if (append) jQuery(document.body).append(this.activeautocompleteOptionGroup);

                    pos = item.$target.offset();
                    dim = {
                        width: item.$target.outerWidth(),
                        height: item.$target.outerHeight()
                    };

                    // picker css(width, left, top) & direction 결정
                    if (!item.direction || item.direction === "" || item.direction === "auto") {
                        // set direction
                        item.direction = "top";
                    }

                    if (append) {
                        this.activeautocompleteOptionGroup
                            .addClass("direction-" + item.direction);
                    }
                    this.activeautocompleteOptionGroup
                        .css((function () {
                            if (item.direction == "top") {
                                return {
                                    left: pos.left,
                                    top: pos.top + dim.height + 1,
                                    width: dim.width
                                }
                            }
                            else if (item.direction == "bottom") {
                                return {
                                    left: pos.left,
                                    top: pos.top - this.activeautocompleteOptionGroup.outerHeight() - 1,
                                    width: dim.width
                                }
                            }
                        }).call(this));
                },
                onBodyClick = function (e, target) {
                    if (!this.activeautocompleteOptionGroup) return this;

                    var
                        item = this.queue[this.activeautocompleteQueueIndex],
                        clickEl = "display"
                        ;

                    target = U.findParentNode(e.target, function (target) {
                        if (target.getAttribute("data-option-value")) {
                            clickEl = "optionItem";
                            return true;
                        }
                        else if (item.$target.get(0) == target) {
                            clickEl = "display";
                            return true;
                        }
                    });

                    if (!target) {
                        this.close();
                        return this;
                    }
                    else if (clickEl === "optionItem") {
                        setSelected.call(this, item.id, {
                            optionIndex: {
                                index: target.getAttribute("data-option-index")
                            }
                        }, undefined, "optionItemClick");

                        U.selectRange(item.$displayLabel, "end"); // 포커스 end || selectAll
                        if (!item.multiple) {
                            this.close();
                        }
                    }
                    else {
                        //open and display click
                        //console.log(this.instanceId);
                    }

                    return this;
                },
                onBodyKeyup = function (e) { // 옵션 선택 후 키업
                    if (e.keyCode == ax5.info.eventKeys.ESC) {
                        blurLabel.call(this, this.activeautocompleteQueueIndex);
                        this.close();
                    }
                    else if (e.which == ax5.info.eventKeys.RETURN) {
                        var values = [];
                        var item = this.queue[this.activeautocompleteQueueIndex];
                        var childNodes = item.$displayLabel.get(0).childNodes;
                        for (var i = 0, l = childNodes.length; i < l; i++) {
                            var node = childNodes[i];
                            // nodeType:1 - span, nodeType:3 - text
                            if (node.nodeType in AUTOCOMPLETE.util.nodeTypeProcessor) {
                                var value = AUTOCOMPLETE.util.nodeTypeProcessor[node.nodeType].call(this, this.activeautocompleteQueueIndex, node);
                                if (typeof value !== "undefined") values.push(value);
                            }
                        }

                        setSelected.call(this, item.id, values, true); // set Value
                        focusLabel.call(this, this.activeautocompleteQueueIndex);
                        if (!item.multiple) this.close();
                    }
                },
                getLabel = function (queIdx) {
                    var item = this.queue[queIdx];

                    // 템플릿에 전달 해야할 데이터 선언
                    var data = {};
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5autocomplete-option-group-" + item.size;
                    data.multiple = item.multiple;
                    data.lang = item.lang;
                    data.options = item.options;
                    data.selected = item.selected;
                    data.hasSelected = (data.selected && data.selected.length > 0);
                    data.removeIcon = item.removeIcon;
                    return AUTOCOMPLETE.tmpl.get.call(this, "label", data, item.columnKeys) + "&nbsp;";
                },
                syncLabel = function (queIdx) {
                    var item = this.queue[queIdx], displayTableHeight;

                    if (!item.multiple && item.selected && item.selected.length > 0) {
                        item.selected = [].concat(item.selected[item.selected.length - 1]);
                    }

                    item.selected.forEach(function (n, nindex) {
                        n["@index"] = nindex;
                    });

                    item.$select.html(AUTOCOMPLETE.tmpl.get.call(this, "formSelectOptions", {
                            selected: item.selected
                        }, item.columnKeys));

                    item.$displayLabel
                        .html(getLabel.call(this, queIdx));
                    item.$target.height('');
                    item.$display.height('');

                    // label 사이즈 체크
                    if (item.$target.height() < (displayTableHeight = item.$displayTable.outerHeight())) {
                        var displayTableHeightAdjust = (function () {
                            return U.number(item.$display.css("border-top-width")) + U.number(item.$display.css("border-bottom-width"));
                        })();
                        item.$target.css({height: displayTableHeight + displayTableHeightAdjust});
                        item.$display.css({height: displayTableHeight + displayTableHeightAdjust});
                    }
                },
                focusLabel = function (queIdx) {
                    this.queue[queIdx].$displayLabel.trigger("focus");
                    U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
                },
                blurLabel = function (queIdx) {
                    this.queue[queIdx].$displayLabel.trigger("blur");
                },
                onSearch = function (queIdx, searchWord) {
                    if (this.activeautocompleteQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.
                    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                    searchWord = searchWord.replace(regExp, "");

                    this.queue[queIdx].waitOptions = true;
                    this.queue[queIdx].onSearch.call({
                        self: this,
                        item: this.queue[queIdx],
                        searchWord: searchWord
                    }, (function (O) {

                        var data = {};
                        var item = this.queue[this.activeautocompleteQueueIndex];
                        if (!item) return false;

                        /// 현재 selected 검증후 처리
                        (function (item, O) {
                            var optionsMap = {};
                            O.options.forEach(function (_O, _OIndex) {
                                _O["@index"] = _OIndex;
                                _O["@findex"] = _OIndex;
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

                        item.options = O.options;

                        alignAutocompleteDisplay.call(this);

                        /// 템플릿에 전달할 오브젝트 선언
                        data.id = item.id;
                        data.theme = item.theme;
                        data.size = "ax5autocomplete-option-group-" + item.size;
                        data.multiple = item.multiple;
                        data.lang = item.lang;
                        data.options = item.options;
                        this.activeautocompleteOptionGroup.find('[data-els="content"]').html(jQuery(AUTOCOMPLETE.tmpl.get.call(this, "options", data, item.columnKeys)));

                        focusWord.call(this, this.activeautocompleteQueueIndex, searchWord);

                    }).bind(this));
                },
                focusWord = function (queIdx, searchWord) {
                    if (this.activeautocompleteQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.
                    var collect_options = [], i = -1, l = this.queue[queIdx].options.length - 1, n;
                    if (searchWord != "") {
                        while (l - i++) {
                            n = this.queue[queIdx].options[i];

                            if (('' + n.text).toLowerCase() == searchWord.toLowerCase()) {
                                collect_options = [{'@findex': n['@findex'], optionsSort: 0}];
                                break;
                            } else {
                                var sort = ('' + n.text).toLowerCase().search(searchWord.toLowerCase());
                                if (sort > -1) {
                                    collect_options.push({'@findex': n['@findex'], optionsSort: sort});
                                    if (collect_options.length > 2) break;
                                }
                                sort = null;
                            }
                        }
                        collect_options.sort(function (a, b) {
                            return a.optionsSort - b.optionsSort;
                        });
                    }

                    if (collect_options && collect_options.length > 0) {
                        focusMove.call(this, queIdx, undefined, collect_options[0]['@findex']);
                    } else {
                        focusClear.call(this, queIdx);
                    }
                },
                focusClear = function (queIdx) {
                    if (this.activeautocompleteOptionGroup) {
                        this.activeautocompleteOptionGroup
                            .find('[data-option-focus-index]')
                            .removeClass("hover")
                            .removeAttr("data-option-selected");
                    }

                    this.queue[queIdx].optionFocusIndex = -1;
                },
                focusMove = function (queIdx, direction, findex) {
                    var _focusIndex,
                        _prevFocusIndex,
                        focusOptionEl,
                        optionGroupScrollContainer;
                    var item = this.queue[queIdx];

                    if (this.activeautocompleteOptionGroup && item.options && item.options.length > 0) {

                        if (typeof findex !== "undefined") {
                            _focusIndex = findex
                        }
                        else {
                            _prevFocusIndex = (item.optionFocusIndex == -1) ? item.optionSelectedIndex || -1 : item.optionFocusIndex;
                            if (_prevFocusIndex == -1) {
                                _focusIndex = 0;
                                //_focusIndex = (direction > 0) ? 0 : item.optionItemLength - 1; // 맨 끝으로 보낼것인가 말 것인가.
                            }
                            else {
                                _focusIndex = _prevFocusIndex + direction;
                                if (_focusIndex < 0) _focusIndex = 0;
                                else if (_focusIndex > item.optionItemLength - 1) _focusIndex = item.optionItemLength - 1;
                            }
                        }

                        item.optionFocusIndex = _focusIndex;

                        // 포커스 인덱스가 hide아이템을 만나면 hide 아이템이 안나올 때까지 루프를 순회 합니다.
                        if (item.options[_focusIndex] && item.options[_focusIndex].hide) { // 옵션이 없는 값이 선택된 경우
                            if (typeof direction === "undefined") {
                                return this;
                            }
                            else {
                                var isStrop = false;
                                while (item.options[_focusIndex].hide) {
                                    _focusIndex = _focusIndex + direction;
                                    if (_focusIndex < 0) {
                                        _focusIndex = 0;
                                        break;
                                    }
                                    else if (_focusIndex > item.optionItemLength - 1) {
                                        _focusIndex = item.optionItemLength - 1;
                                        break;
                                    }
                                }
                            }
                        }

                        if (typeof _focusIndex !== "undefined") {
                            this.activeautocompleteOptionGroup
                                .find('[data-option-focus-index]')
                                .removeClass("hover");

                            focusOptionEl = this.activeautocompleteOptionGroup
                                .find('[data-option-focus-index="' + _focusIndex + '"]')
                                .addClass("hover");

                            optionGroupScrollContainer = this.activeautocompleteOptionGroup.find('[data-els="content"]');

                            if (focusOptionEl.get(0)) {
                                let focusOptionElHeight = focusOptionEl.outerHeight(),
                                    optionGroupScrollContainerHeight = optionGroupScrollContainer.innerHeight(),
                                    optionGroupScrollContainerScrollTop = optionGroupScrollContainer.scrollTop(),
                                    focusOptionElTop = focusOptionEl.position().top + optionGroupScrollContainer.scrollTop();

                                if (optionGroupScrollContainerHeight + optionGroupScrollContainerScrollTop < focusOptionElTop + focusOptionElHeight) {
                                    optionGroupScrollContainer.scrollTop(focusOptionElTop + focusOptionElHeight - optionGroupScrollContainerHeight);
                                }
                                else if (optionGroupScrollContainerScrollTop > focusOptionElTop) {
                                    optionGroupScrollContainer.scrollTop(focusOptionElTop);
                                }
                                // optionGroup scroll check

                                if (typeof direction !== "undefined") {
                                    /*
                                    // 방향이 있으면 커서 업/다운 아니면 사용자 키보드 입력
                                    // 방향이 있으면 라벨 값을 수정
                                    var childNodes = item.$displayLabel.get(0).childNodes;
                                    var lastNode = childNodes[childNodes.length - 1];
                                    if (lastNode && lastNode.nodeType == '3') {
                                        //lastNode.nodeValue = item.options[_focusIndex].text;
                                        U.selectRange(item.$displayLabel, "end");
                                    } else if (lastNode && lastNode.nodeType == '1') {
                                        //jQuery(lastNode).after(item.options[_focusIndex].text);
                                        U.selectRange(item.$displayLabel, "end");
                                    }
                                    */
                                    U.selectRange(item.$displayLabel, "end");
                                }
                            }
                        }
                    }
                },
                getQueIdx = function (boundID) {
                    if (boundID instanceof jQuery) {
                        boundID = boundID.data("data-ax5autocomplete-id");
                    } else if (!U.isString(boundID)) {
                        boundID = jQuery(boundID).data("data-ax5autocomplete-id");
                    }
                    if (!U.isString(boundID)) {
                        console.log(ax5.info.getError("ax5autocomplete", "402", "getQueIdx"));
                        return;
                    }
                    return U.search(this.queue, function () {
                        return this.id == boundID;
                    });
                },
                getSelected = function (_item, o, selected) {
                    if (typeof selected === "undefined") {
                        return (_item.multiple) ? !o : true;
                    } else {
                        return selected;
                    }
                },
                clearSelected = function (queIdx) {
                    this.queue[queIdx].options.forEach(function (n) {
                        if (n.optgroup) {
                            n.options.forEach(function (nn) {
                                nn.selected = false;
                            });
                        }
                        else {
                            n.selected = false;
                        }
                    });
                },
                setSelected = (function () {
                    var processor = {
                        'selectedIndex': function (queIdx, value, selected, setValueType) {

                        },
                        'removeSelectedIndex': function (queIdx, value, selected, setValueType) {
                            var item = this.queue[queIdx], addOptions = {};
                            var newSelectedArray = [], optionIndex = 0;
                            for (var i = 0; i < item.selected.length; i++) {
                                if (item.selected[i]['@index'] != value.removeSelectedIndex.index) {
                                    addOptions = {'@index': optionIndex, '@findex': optionIndex};
                                    addOptions[item.columnKeys.optionValue] = item.selected[i][item.columnKeys.optionValue];
                                    addOptions[item.columnKeys.optionText] = item.selected[i][item.columnKeys.optionText];
                                    newSelectedArray.push(addOptions);
                                    optionIndex++;
                                }
                            }
                            item.selected = newSelectedArray;
                        },
                        'optionIndex': function (queIdx, value, selected, setValueType) {
                            var item = this.queue[queIdx], addOptions = {};
                            var optionIndex = item.selected.length;
                            var pushOk = true;

                            addOptions = {
                                '@index': optionIndex, '@findex': optionIndex
                            };
                            addOptions[item.columnKeys.optionValue] = item.options[value.optionIndex.index][item.columnKeys.optionValue];
                            addOptions[item.columnKeys.optionText] = item.options[value.optionIndex.index][item.columnKeys.optionText];

                            for (var i = 0; i < item.selected.length; i++) {
                                if (item.selected[i][item.columnKeys.optionValue] == addOptions[item.columnKeys.optionValue]) {
                                    pushOk = false;
                                }
                            }
                            if (pushOk) item.selected.push(addOptions);
                        },
                        'arr': function (queIdx, values, selected, setValueType) {
                            values.forEach(function (value) {
                                if (U.isString(value) || U.isNumber(value)) {
                                    processor.text.call(self, queIdx, value, selected, "justSetValue");
                                }
                                else {
                                    for (var key in processor) {
                                        if (value[key]) {
                                            processor[key].call(self, queIdx, value, selected, "justSetValue");
                                            break;
                                        }
                                    }
                                }
                            });
                        },
                        'value': function (queIdx, value, selected, setValueType) {
                            var item = this.queue[queIdx];
                            var addOptions;
                            var optionIndex = U.search(item.options, function () {
                                return this[item.columnKeys.optionValue] == value.value[item.columnKeys.optionValue];
                            });

                            if (optionIndex > -1) {
                                item.options[optionIndex][item.columnKeys.optionSelected]
                                    = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);

                                if (item.options[optionIndex][item.columnKeys.optionSelected]) {
                                    var appendOk = true;
                                    for (var i = 0; i < item.selected.length; i++) {
                                        if (item.selected[i][cfg.columnKeys.optionValue] == item.options[optionIndex][cfg.columnKeys.optionValue]) {
                                            appendOk = false;
                                            break;
                                        }
                                    }
                                    if (appendOk) {
                                        addOptions = {};
                                        addOptions[item.columnKeys.optionValue] = item.options[optionIndex][item.columnKeys.optionValue];
                                        addOptions[item.columnKeys.optionText] = item.options[optionIndex][item.columnKeys.optionText];
                                        item.selected.push(addOptions);
                                    }
                                }
                                else {
                                    var newSelectedArray = [];
                                    for (var i = 0; i < item.selected.length; i++) {
                                        if (item.selected[i][cfg.columnKeys.optionValue] == item.options[optionIndex][cfg.columnKeys.optionValue]) {

                                        }
                                        else {
                                            addOptions = {};
                                            addOptions[item.columnKeys.optionValue] = item.selected[i][item.columnKeys.optionValue];
                                            addOptions[item.columnKeys.optionText] = item.selected[i][item.columnKeys.optionText];
                                            newSelectedArray.push(addOptions);
                                        }
                                    }
                                    item.selected = newSelectedArray;
                                }

                            }
                            else {
                                // 새로운 값 추가
                                var appendOk = true;
                                for (var i = 0; i < item.selected.length; i++) {
                                    if (item.selected[i][cfg.columnKeys.optionValue] == value.value[cfg.columnKeys.optionValue]) {
                                        appendOk = false;
                                        break;
                                    }
                                }

                                if (appendOk) {
                                    addOptions = {};
                                    addOptions[item.columnKeys.optionValue] = value.value[cfg.columnKeys.optionValue];
                                    addOptions[item.columnKeys.optionText] = value.value[cfg.columnKeys.optionText];
                                    item.selected.push(addOptions);
                                }
                            }
                        },
                        'text': function (queIdx, value, selected, setValueType) {
                            var item = this.queue[queIdx];
                            var addOptions;
                            var optionIndex = U.search(item.options, function () {
                                return this[item.columnKeys.optionText] == value;
                            });

                            if (optionIndex > -1) {
                                item.options[optionIndex][item.columnKeys.optionSelected]
                                    = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);

                                if (item.options[optionIndex][item.columnKeys.optionSelected]) {
                                    var appendOk = true;
                                    for (var i = 0; i < item.selected.length; i++) {
                                        if (item.selected[i][cfg.columnKeys.optionText] == item.options[optionIndex][cfg.columnKeys.optionText]) {
                                            appendOk = false;
                                            break;
                                        }
                                    }
                                    if (appendOk) {
                                        addOptions = {};
                                        addOptions[item.columnKeys.optionValue] = item.options[optionIndex][item.columnKeys.optionValue];
                                        addOptions[item.columnKeys.optionText] = item.options[optionIndex][item.columnKeys.optionText];
                                        item.selected.push(addOptions);
                                    }
                                }
                                else {
                                    var newSelectedArray = [];
                                    for (var i = 0; i < item.selected.length; i++) {
                                        if (item.selected[i][cfg.columnKeys.optionText] == item.options[optionIndex][cfg.columnKeys.optionText]) {

                                        }
                                        else {
                                            addOptions = {};
                                            addOptions[item.columnKeys.optionValue] = item.selected[i][item.columnKeys.optionValue];
                                            addOptions[item.columnKeys.optionText] = item.selected[i][item.columnKeys.optionText];
                                            newSelectedArray.push(addOptions);
                                        }
                                    }
                                    item.selected = newSelectedArray;
                                }
                            }
                            else {
                                // 새로운 값 추가
                                var appendOk = true;
                                for (var i = 0; i < item.selected.length; i++) {
                                    if (item.selected[i][cfg.columnKeys.optionText] == value) {
                                        appendOk = false;
                                        break;
                                    }
                                }

                                if (appendOk) {
                                    addOptions = {};
                                    addOptions[item.columnKeys.optionValue] = value;
                                    addOptions[item.columnKeys.optionText] = value;
                                    item.selected.push(addOptions);
                                }
                            }
                        },
                        'clear': function (queIdx) {
                            clearSelected.call(this, queIdx);
                            focusClear.call(this, queIdx);

                            if (this.activeautocompleteOptionGroup) {
                                this.activeautocompleteOptionGroup
                                    .find('[data-option-index]')
                                    .attr("data-option-Selected", "false");
                            }
                            this.queue[queIdx].optionSelectedIndex = -1;
                        }
                    };
                    return function (boundID, value, selected, _option) {

                        var queIdx = (U.isNumber(boundID)) ? boundID : getQueIdx.call(this, boundID);
                        if (queIdx === -1) {
                            console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                            return;
                        }

                        if (typeof value == "undefined") {
                            throw "error not found value";
                        }
                        else if (U.isArray(value)) {
                            processor.clear.call(this, queIdx);
                            processor.arr.call(this, queIdx, (this.queue[queIdx].multiple || value.length == 0) ? value : [value[value.length - 1]], selected);
                        }
                        else if (U.isString(value) || U.isNumber(value)) {
                            if (typeof value !== "undefined" && value !== null && !this.queue[queIdx].multiple) {
                                clearSelected.call(this, queIdx);
                            }
                            processor.text.call(this, queIdx, value, selected);
                        }
                        else {
                            if (value === null) {
                                processor.clear.call(this, queIdx);
                            }
                            else {
                                if (!this.queue[queIdx].multiple) {
                                    clearSelected.call(this, queIdx);
                                }
                                for (var key in processor) {
                                    if (value[key]) {
                                        processor[key].call(this, queIdx, value, selected);
                                        break;
                                    }
                                }
                            }
                        }

                        syncLabel.call(this, queIdx);
                        alignAutocompleteOptionGroup.call(this);

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
                })();

            /// private end

            /**
             * Preferences of autocomplete UI
             * @method ax5autocomplete.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5autocomplete}
             * @example
             * ```
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onChange = cfg.onChange;
                jQuery(window).bind("resize.ax5autocomplete-display-" + this.instanceId, (function () {
                    alignAutocompleteDisplay.call(this);
                }).bind(this));
            };

            /**
             * bind autocomplete
             * @method ax5autocomplete.bind
             * @param {Object} item
             * @param {String} [item.id]
             * @param {String} [item.theme]
             * @param {Boolean} [item.multiple]
             * @param {Element} item.target
             * @returns {ax5autocomplete}
             */
            this.bind = function (item) {
                var bindAutocompleteTarget = (function () {
                    var debouncedFocusWord = U.debounce(function (queIdx) {
                        if (this.activeautocompleteQueueIndex == -1) return this; // 옵션박스가 닫힌상태이면 진행안함.

                        var values = [];
                        var searchWord = "";
                        var resetSelected = false;
                        var item = this.queue[queIdx];
                        var childNodes = item.$displayLabel.get(0).childNodes;

                        for (var i = 0, l = childNodes.length; i < l; i++) {
                            var node = childNodes[i];

                            if (node.nodeType in AUTOCOMPLETE.util.nodeTypeProcessor) {
                                var value = AUTOCOMPLETE.util.nodeTypeProcessor[node.nodeType].call(this, this.activeautocompleteQueueIndex, node, true);
                                if (typeof value === "undefined") {
                                    //
                                }
                                else if (U.isString(value)) {
                                    searchWord = value;
                                }
                                else {
                                    if (value.removeSelectedIndex) {
                                        resetSelected = true;
                                    }
                                    values.push(value);
                                }
                            }
                        }

                        if (childNodes.length == 0) {
                            setSelected.call(this, item.id, null, undefined, "internal"); // clear value
                        }
                        else if (searchWord != "") {
                            onSearch.call(self, queIdx, searchWord);
                        }
                        else if (resetSelected) {
                            setSelected.call(this, item.id, values, undefined, "internal"); // set Value
                            U.selectRange(item.$displayLabel, "end"); // label focus end
                            self.close();
                        }

                    }, 150);

                    var blurLabel = function (queIdx) {
                        var values = [];
                        var item = this.queue[queIdx];
                        var editingText;
                        var childNodes = item.$displayLabel.get(0).childNodes;

                        for (var i = 0, l = childNodes.length; i < l; i++) {
                            var node = childNodes[i];
                            if (node.nodeType in AUTOCOMPLETE.util.nodeTypeProcessor) {
                                var value = AUTOCOMPLETE.util.nodeTypeProcessor[node.nodeType].call(this, queIdx, node, true);
                                if (typeof value === "undefined") {
                                    //
                                }
                                else if (U.isString(value)) {
                                    //editingText = value;
                                    //values.push(value);
                                }
                                else {
                                    values.push(value);
                                }
                            }
                        }

                        setSelected.call(this, item.id, values, undefined, "blurLabel"); // set Value
                    };

                    var autocompleteEvent = {
                        'click': function (queIdx, e) {
                            var clickEl;
                            var target = U.findParentNode(e.target, function (target) {
                                if (target.getAttribute("data-ax5autocomplete-remove")) {
                                    clickEl = "optionItemRemove";
                                    return true;
                                }
                                else if (target.getAttribute("data-selected-clear")) {
                                    clickEl = "clear";
                                    return true;
                                }
                            });

                            if (target) {
                                if (clickEl === "optionItemRemove") {
                                    var removeIndex = target.getAttribute("data-ax5autocomplete-remove-index");
                                    this.queue[queIdx].selected.splice(removeIndex, 1);
                                    syncLabel.call(this, queIdx);
                                    focusLabel.call(this, queIdx);
                                    U.stopEvent(e);
                                    return this;
                                } else if (clickEl === "clear") {
                                    setSelected.call(this, queIdx, {clear: true});
                                }
                            }
                            else {
                                if (self.activeautocompleteQueueIndex == queIdx) {
                                    if (this.queue[queIdx].optionFocusIndex == -1) { // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                                        self.close();
                                    }
                                }
                                else {
                                    if (this.queue[queIdx].$displayLabel.text().replace(/^\W*|\W*$/g, '') == "") {
                                        this.queue[queIdx].$displayLabel
                                            .html(getLabel.call(this, queIdx));
                                        focusLabel.call(this, queIdx);
                                    }
                                }
                            }
                        },
                        'keyUp': function (queIdx, e) {
                            /// 약속된 키 이벤트가 발생하면 stopEvent를 통해 keyUp 이벤트가 발생되지 않도록 막아주는 센스
                            if (e.which == ax5.info.eventKeys.ESC && self.activeautocompleteQueueIndex === -1) { // ESC키를 누르고 옵션그룹이 열려있지 않은 경우
                                U.stopEvent(e);
                                return this;
                            }
                            if (self.activeautocompleteQueueIndex != queIdx) { // 닫힌 상태 인경우
                                self.open(queIdx);
                                U.stopEvent(e);
                            }
                            if (ctrlKeys[e.which]) {
                                U.stopEvent(e);
                            }else{
                                debouncedFocusWord.call(this, queIdx);
                            }

                        },
                        'keyDown': function (queIdx, e) {
                            if (e.which == ax5.info.eventKeys.ESC) {
                                U.stopEvent(e);
                            }
                            else if (e.which == ax5.info.eventKeys.RETURN) {
                                // display label에서 줄넘김막기위한 구문
                                U.stopEvent(e);
                            }
                            else if (e.which == ax5.info.eventKeys.DOWN) {
                                focusMove.call(this, queIdx, 1);
                                U.stopEvent(e);
                            }
                            else if (e.which == ax5.info.eventKeys.UP) {
                                focusMove.call(this, queIdx, -1);
                                U.stopEvent(e);
                            }
                        },
                        'focus': function (queIdx, e) {
                            //console.log(e);
                            U.selectRange(this.queue[queIdx].$displayLabel, "end"); // 포커스 end || selectAll
                        },
                        'blur': function (queIdx, e) {
                            blurLabel.call(this, queIdx);
                            U.stopEvent(e);
                        },
                        'selectChange': function (queIdx, e) {
                            setSelected.call(this, queIdx, {value: this.queue[queIdx].$select.val()}, true);
                        }
                    };

                    return function (queIdx) {
                        var item = this.queue[queIdx];
                        var data = {};

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
                            data.formSize = (function () {
                                return (item.size) ? "input-" + item.size : "";
                            })();

                            item.$display = jQuery(AUTOCOMPLETE.tmpl.get.call(this, "autocompleteDisplay", data, item.columnKeys));
                            item.$displayTable = item.$display.find('[data-els="display-table"]');
                            item.$displayLabel = item.$display.find('[data-ax5autocomplete-display="label"]');

                            if (item.$target.find("select").get(0)) {
                                item.$select = item.$target.find("select");
                                item.$select
                                    .attr("tabindex", "-1")
                                    .attr("class", "form-control " + data.formSize);

                                if (data.name) {
                                    item.$select.attr("name", "name");
                                }
                                item.$select.attr("multiple", "multiple");
                            }
                            else {
                                item.$select = jQuery(AUTOCOMPLETE.tmpl.get.call(this, "formSelect", data, item.columnKeys));
                                item.$target.append(item.$select);
                            }

                            item.$target.append(item.$display);

                            alignAutocompleteDisplay.call(this);
                        }
                        else {
                            item.$displayLabel
                                .html(getLabel.call(this, queIdx));

                            alignAutocompleteDisplay.call(this);
                        }

                        item.$display
                            .unbind('click.ax5autocomplete')
                            .bind('click.ax5autocomplete', autocompleteEvent.click.bind(this, queIdx));

                        // autocomplete 태그에 대한 이벤트 감시


                        item.$displayLabel
                            .unbind("focus.ax5autocomplete")
                            .bind("focus.ax5autocomplete", autocompleteEvent.focus.bind(this, queIdx))
                            .unbind("blur.ax5autocomplete")
                            .bind("blur.ax5autocomplete", autocompleteEvent.blur.bind(this, queIdx))
                            .unbind('keyup.ax5autocomplete')
                            .bind('keyup.ax5autocomplete', autocompleteEvent.keyUp.bind(this, queIdx))
                            .unbind("keydown.ax5autocomplete")
                            .bind("keydown.ax5autocomplete", autocompleteEvent.keyDown.bind(this, queIdx));

                        // select 태그에 대한 change 이벤트 감시

                        item.$select
                            .unbind('change.ax5autocomplete')
                            .bind('change.ax5autocomplete', autocompleteEvent.selectChange.bind(this, queIdx));

                        data = null;
                        item = null;
                        queIdx = null;
                        return this;
                    };
                })();

                var
                    autocompleteConfig = {},
                    queIdx;

                item = jQuery.extend(true, autocompleteConfig, cfg, item);
                if (!item.target) {
                    console.log(ax5.info.getError("ax5autocomplete", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5autocomplete-id");
                if (!item.id) {
                    item.id = 'ax5autocomplete-' + ax5.getGuid();
                    item.$target.data("data-ax5autocomplete-id", item.id);
                }
                item.name = item.$target.attr("data-ax5autocomplete");

                item.options = [];
                item.selected = [];

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-ax5autocomplete-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindAutocompleteTarget.call(this, this.queue.length - 1);
                }
                else {
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindAutocompleteTarget.call(this, queIdx);
                }

                autocompleteConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * open the optionBox of autocomplete
             * @method ax5autocomplete.open
             * @param {(String|Number|Element)} boundID
             * @param {Number} [tryCount]
             * @returns {ax5autocomplete}
             */
            this.open = (function () {

                return function (boundID, tryCount) {
                    this.waitOptionsCallback = null;

                    /**
                     * open autocomplete from the outside
                     */
                    var queIdx = (U.isNumber(boundID)) ? boundID : getQueIdx.call(this, boundID);
                    var item = this.queue[queIdx];
                    var data = {}, focusTop, selectedOptionEl;

                    if (item.$display.attr("disabled")) return this;

                    if (this.openTimer) clearTimeout(this.openTimer);
                    if (this.activeautocompleteOptionGroup) {
                        if (this.activeautocompleteQueueIndex == queIdx) {
                            return this;
                        }

                        if (tryCount > 2) return this;
                        this.close();
                        this.openTimer = setTimeout((function () {
                            this.open(queIdx, (tryCount || 0) + 1);
                        }).bind(this), cfg.animateTime);

                        return this;
                    }

                    item.optionFocusIndex = -1; // optionGroup이 열리면 포커스 인덱스 초기화 -1로
                    if (item.selected && item.selected.length > 0) {
                        item.optionSelectedIndex = item.selected[0]["@findex"];
                    }

                    /// 템플릿에 전달할 오브젝트 선언
                    data.id = item.id;
                    data.theme = item.theme;
                    data.size = "ax5autocomplete-option-group-" + item.size;
                    data.multiple = item.multiple;

                    data.lang = item.lang;
                    item.$display.attr("data-autocomplete-option-group-opened", "true");

                    data.waitOptions = true;
                    data.options = [];

                    this.activeautocompleteOptionGroup = jQuery(AUTOCOMPLETE.tmpl.get.call(this, "optionGroup", data, item.columnKeys));
                    this.activeautocompleteOptionGroup.find('[data-els="content"]').html(jQuery(AUTOCOMPLETE.tmpl.get.call(this, "options", data, item.columnKeys)));
                    this.activeautocompleteQueueIndex = queIdx;

                    alignAutocompleteOptionGroup.call(this, "append"); // alignAutocompleteOptionGroup 에서 body append
                    jQuery(window).bind("resize.ax5autocomplete-" + this.instanceId, (function () {
                        alignAutocompleteOptionGroup.call(this);
                    }).bind(this));


                    if (item.selected && item.selected.length > 0) {
                        selectedOptionEl = this.activeautocompleteOptionGroup.find('[data-option-index="' + item.selected[0]["@index"] + '"]');
                        if (selectedOptionEl.get(0)) {
                            focusTop = selectedOptionEl.position().top - this.activeautocompleteOptionGroup.height() / 3;
                            this.activeautocompleteOptionGroup.find('[data-els="content"]')
                                .stop().animate({scrollTop: focusTop}, item.animateTime, 'swing', function () {
                            });
                        }
                    }

                    jQuery(window).bind("keyup.ax5autocomplete-" + this.instanceId, (function (e) {
                        e = e || window.event;
                        onBodyKeyup.call(this, e);
                        U.stopEvent(e);
                    }).bind(this));

                    jQuery(window).bind("click.ax5autocomplete-" + this.instanceId, (function (e) {
                        e = e || window.event;
                        onBodyClick.call(this, e);
                        U.stopEvent(e);
                    }).bind(this));

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "open",
                        item: item
                    });

                    data = null;
                    focusTop = null;
                    selectedOptionEl = null;
                    return this;
                }
            })();

            /**
             * @method ax5autocomplete.setValue
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _value
             * @return {ax5autocomplete}
             * @example
             * ```js
             * myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), {value:"test", text:"test"});
             * myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), [{value:"test1", text:"test1"}, {value:"test2", text:"test2"}]);
             * myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), null);
             * ```
             */
            this.setValue = function (_boundID, _value) {
                var queIdx = (U.isNumber(_boundID)) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }

                this.queue[queIdx].selected = [];
                clearSelected.call(this, queIdx);
                if (U.isArray(_value)) {
                    var _values = U.map(_value, function () {
                        return {value: this};
                    });
                    setSelected.call(this, queIdx, _values, true, {noStateChange: true});
                }
                else if (U.isObject(_value)) {
                    console.log(_value);
                    setSelected.call(this, queIdx, {value: _value}, true, {noStateChange: true});
                }
                blurLabel.call(this, queIdx);

                return this;
            };

            /**
             * @method ax5autocomplete.setText
             * @param {(jQueryObject|Element|Number)} _boundID
             * @param {(String|Array)} _text
             * @returns {ax5autocomplete}
             * @example
             * ```js
             * myAutocomplete.setText($('[data-ax5autocomplete="autocomplete1"]'), "string");
             * myAutocomplete.setText($('[data-ax5autocomplete="autocomplete1"]'), ["substring", "search"]);
             * ```
             */
            this.setText = function (_boundID, _text) {
                var queIdx = (U.isNumber(_boundID)) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }
                this.queue[queIdx].selected = [];
                clearSelected.call(this, queIdx);
                setSelected.call(this, queIdx, _text, true, {noStateChange: true});
                blurLabel.call(this, queIdx);

                return this;
            };

            /**
             * @method ax5autocomplete.getSelectedOption
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {Array}
             */
            this.getSelectedOption = function (_boundID) {
                var queIdx = (U.isNumber(_boundID)) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }
                return U.deepCopy(this.queue[queIdx].selected);
            };

            /**
             * @method ax5autocomplete.close
             * @returns {ax5autocomplete}
             */
            this.close = function (item) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activeautocompleteOptionGroup) return this;

                item = this.queue[this.activeautocompleteQueueIndex];
                item.optionFocusIndex = -1;
                item.$display.removeAttr("data-autocomplete-option-group-opened").trigger("focus");

                this.activeautocompleteOptionGroup.addClass("destroy");

                jQuery(window)
                    .unbind("resize.ax5autocomplete-" + this.instanceId)
                    .unbind("click.ax5autocomplete-" + this.instanceId)
                    .unbind("keyup.ax5autocomplete-" + this.instanceId);

                this.closeTimer = setTimeout((function () {
                    if (this.activeautocompleteOptionGroup) this.activeautocompleteOptionGroup.remove();
                    this.activeautocompleteOptionGroup = null;
                    this.activeautocompleteQueueIndex = -1;

                    onStateChanged.call(this, item, {
                        self: this,
                        state: "close"
                    });

                }).bind(this), cfg.animateTime);
                this.waitOptionsCallback = null;
                return this;
            };

            /**
             * @method ax5autocomplete.blur
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5autocomplete}
             */
            this.blur = function (_boundID) {
                var queIdx = (U.isNumber(_boundID)) ? _boundID : getQueIdx.call(this, _boundID);
                if (queIdx === -1) {
                    console.log(ax5.info.getError("ax5autocomplete", "402", "val"));
                    return;
                }

                blurLabel.call(this, queIdx);
                return this;
            };

            /**
             * @method ax5autocomplete.enable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5autocomplete}
             */
            this.enable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);
                this.queue[queIdx].$display.removeAttr("disabled");
                this.queue[queIdx].$input.removeAttr("disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "enable"
                });

                return this;
            };

            /**
             * @method ax5autocomplete.disable
             * @param {(jQueryObject|Element|Number)} _boundID
             * @returns {ax5autocomplete}
             */
            this.disable = function (_boundID) {
                var queIdx = getQueIdx.call(this, _boundID);
                this.queue[queIdx].$display.attr("disabled", "disabled");
                this.queue[queIdx].$input.attr("disabled", "disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "disable"
                });

                return this;
            };

            // 클래스 생성자
            this.main = (function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
                else {
                    this.init();
                }
            }).apply(this, arguments);
        };
        return ax5autocomplete;
    })());

    AUTOCOMPLETE = ax5.ui.autocomplete;
})();

/**
 * autocomplete jquery extends
 * @namespace jQueryExtends
 */

/**
 * @method jQueryExtends.ax5autocomplete
 * @param {String} methodName
 * @param [arguments]
 * @param [arguments]
 * @example
 * ```html
 * <div data-ax5autocomplete="ax1" data-ax5autocomplete-config='{
 *  multiple: true,
 *  editable: true,
 *  size: "",
 *  theme:""
 *  }'></div>
 * <script>
 * jQuery('[data-ax5autocomplete="ax1"]').ax5autocomplete();
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("getSelectedOption");
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("setValue", {value:"test", text:"test"});
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("enable");
 * $('[data-ax5autocomplete="ax1"]').ax5autocomplete("disable");
 * </script>
 * ```
 */
ax5.ui.autocomplete_instance = new ax5.ui.autocomplete();
jQuery.fn.ax5autocomplete = (function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.autocomplete_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.autocomplete_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.autocomplete_instance.setValue(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "setText":
                    return ax5.ui.autocomplete_instance.setText(this, arguments[1], arguments[2], arguments[3], arguments[4] || "justSetValue");
                    break;
                case "getSelectedOption":
                    return ax5.ui.autocomplete_instance.getSelectedOption(this);
                    break;
                case "enable":
                    return ax5.ui.autocomplete_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.autocomplete_instance.disable(this);
                    break;
                case "blur":
                    return ax5.ui.autocomplete_instance.blur(this);
                default:
                    return this;
            }
        }
        else {
            if (typeof config == "undefined") config = {};
            jQuery.each(this, function () {
                var defaultConfig = {
                    target: this
                };
                config = jQuery.extend({}, config, defaultConfig);
                ax5.ui.autocomplete_instance.bind(config);
            });
        }
        return this;
    }
})();