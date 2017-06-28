'use strict';

// ax5.ui.select
(function () {

    var UI = ax5.ui,
        U = ax5.util,
        SELECT = void 0;

    UI.addClass({
        className: "select"
    }, function () {
        /**
         * @class ax5select
         * @classdesc
         * @author tom@axisj.com
         */
        var ax5select = function ax5select() {
            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {
                theme: 'default',
                animateTime: 100,
                lang: {
                    noSelected: '',
                    noOptions: 'no options',
                    loading: 'now loading..',
                    multipleLabel: '"{{label}}"외 {{length}}건'
                },
                columnKeys: {
                    optionValue: 'value',
                    optionText: 'text',
                    optionSelected: 'selected'
                }
            };
            this.queue = [];
            this.activeSelectOptionGroup = null;
            this.activeSelectQueueIndex = -1;
            this.openTimer = null;
            this.closeTimer = null;
            this.waitOptionsCallback = null;
            this.keyUpTimer = null;
            this.xvar = {};

            cfg = this.config;

            var $window = jQuery(window),
                ctrlKeys = {
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
                alignSelectDisplay = function alignSelectDisplay() {
                var i = this.queue.length,
                    w = void 0;
                while (i--) {
                    if (this.queue[i].$display) {
                        w = Math.max(this.queue[i].$select.outerWidth(), U.number(this.queue[i].minWidth));
                        this.queue[i].$display.css({
                            "min-width": w
                        });
                        if (this.queue[i].reset) {
                            this.queue[i].$display.find(".addon-icon-reset").css({
                                "line-height": this.queue[i].$display.height() + "px"
                            });
                        }
                    }
                }

                i = null;
                w = null;
                return this;
            },
                alignSelectOptionGroup = function alignSelectOptionGroup(append) {
                if (!this.activeSelectOptionGroup) return this;

                var item = this.queue[this.activeSelectQueueIndex],
                    pos = {},
                    positionMargin = 0,
                    dim = {},
                    pickerDim = {},
                    pickerDirection = void 0;

                if (append) jQuery(document.body).append(this.activeSelectOptionGroup);

                pos = item.$target.offset();
                dim = {
                    width: item.$target.outerWidth(),
                    height: item.$target.outerHeight()
                };
                pickerDim = {
                    winWidth: Math.max($window.width(), jQuery(document.body).width()),
                    winHeight: Math.max($window.height(), jQuery(document.body).height()),
                    width: this.activeSelectOptionGroup.outerWidth(),
                    height: this.activeSelectOptionGroup.outerHeight()
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
                // todo : 표현할 공간이 없다면..
                if (append) {
                    this.activeSelectOptionGroup.addClass("direction-" + pickerDirection);
                }
                this.activeSelectOptionGroup.css(function () {
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
                if (!this.activeSelectOptionGroup) return this;

                var item = this.queue[this.activeSelectQueueIndex],
                    clickEl = "display";

                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-option-value") || target.getAttribute("data-option-value") == "") {
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
                    this.val(item.id, {
                        index: {
                            gindex: target.getAttribute("data-option-group-index"),
                            index: target.getAttribute("data-option-index")
                        }
                    }, undefined, "internal");
                    item.$select.trigger("change");
                    item.$display.focus();
                    if (!item.multiple) this.close();
                } else {
                    //open and display click
                    //console.log(this.instanceId);
                }

                return this;
            },
                onBodyKeyup = function onBodyKeyup(e) {
                if (e.keyCode == ax5.info.eventKeys.ESC) {
                    this.close();
                } else if (e.which == ax5.info.eventKeys.RETURN) {
                    if (this.queue[this.activeSelectQueueIndex].optionFocusIndex > -1) {
                        // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                        var $option = this.activeSelectOptionGroup.find('[data-option-focus-index="' + this.queue[this.activeSelectQueueIndex].optionFocusIndex + '"]');
                        this.val(this.queue[this.activeSelectQueueIndex].id, {
                            index: {
                                gindex: $option.attr("data-option-group-index"),
                                index: $option.attr("data-option-index")
                            }
                        }, undefined, "internal");
                        this.queue[this.activeSelectQueueIndex].$select.trigger("change");
                        if (!this.queue[this.activeSelectQueueIndex].multiple) this.close();
                    } else {
                        this.close();
                    }
                }
            },
                getLabel = function getLabel(queIdx) {
                var item = this.queue[queIdx],
                    labels = [];

                if (U.isArray(item.selected) && item.selected.length > 0) {
                    item.selected.forEach(function (n) {
                        if (n.selected) labels.push(n[item.columnKeys.optionText]);
                    });
                } else {
                    if (!item.multiple && item.options && item.options[0]) {
                        if (item.options[0].optgroup) {
                            labels[0] = item.options[0].options[0][item.columnKeys.optionText];
                        } else {
                            labels[0] = item.options[0][item.columnKeys.optionText];
                        }
                    } else {
                        labels[0] = item.lang.noSelected;
                    }
                }

                return function () {
                    if (item.multiple && labels.length > 1) {
                        var data = {
                            label: labels[0],
                            length: labels.length - 1
                        };
                        return ax5.mustache.render(item.lang.multipleLabel, data);
                    } else {
                        return labels[0];
                    }
                }();
            },
                syncLabel = function syncLabel(queIdx) {
                this.queue[queIdx].$displayLabel.html(getLabel.call(this, queIdx));
            },
                focusWord = function focusWord(queIdx, searchWord) {
                var options = [],
                    i = -1,
                    l = this.queue[queIdx].indexedOptions.length - 1,
                    n = void 0;
                if (searchWord) {
                    while (l - i++) {
                        n = this.queue[queIdx].indexedOptions[i];
                        if (('' + n.value).toLowerCase() == searchWord.toLowerCase()) {
                            options = [{ '@findex': n['@findex'], optionsSort: 0 }];
                            break;
                        } else {
                            var sort = ('' + n.value).toLowerCase().search(searchWord.toLowerCase());
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
                focusMove = function focusMove(queIdx, direction, findex) {
                var _focusIndex = void 0,
                    _prevFocusIndex = void 0,
                    focusOptionEl = void 0,
                    optionGroupScrollContainer = void 0;

                if (this.activeSelectOptionGroup && this.queue[queIdx].options && this.queue[queIdx].options.length > 0) {

                    if (typeof findex !== "undefined") {
                        _focusIndex = findex;
                    } else {
                        _prevFocusIndex = this.queue[queIdx].optionFocusIndex == -1 ? this.queue[queIdx].optionSelectedIndex || -1 : this.queue[queIdx].optionFocusIndex;
                        if (_prevFocusIndex == -1) {
                            _focusIndex = direction > 0 ? 0 : this.queue[queIdx].optionItemLength - 1;
                        } else {
                            _focusIndex = _prevFocusIndex + direction;
                            if (_focusIndex < 0) _focusIndex = 0;else if (_focusIndex > this.queue[queIdx].optionItemLength - 1) _focusIndex = this.queue[queIdx].optionItemLength - 1;
                        }
                    }

                    this.queue[queIdx].optionFocusIndex = _focusIndex;

                    this.activeSelectOptionGroup.find('[data-option-focus-index]').removeClass("hover");

                    focusOptionEl = this.activeSelectOptionGroup.find('[data-option-focus-index="' + _focusIndex + '"]').addClass("hover");

                    optionGroupScrollContainer = this.activeSelectOptionGroup.find('[data-els="content"]');

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
                }
            },
                bindSelectTarget = function () {
                var focusWordCall = U.debounce(function (searchWord, queIdx) {
                    focusWord.call(self, queIdx, searchWord);
                    self.queue[queIdx].$displayInput.val('');
                }, 300);

                var selectEvent = {
                    'click': function click(queIdx, e) {
                        var target = U.findParentNode(e.target, function (target) {
                            if (target.getAttribute("data-selected-clear")) {
                                //clickEl = "clear";
                                return true;
                            }
                        });

                        if (target) {
                            this.val(queIdx, { clear: true });
                        } else {
                            if (self.activeSelectQueueIndex == queIdx) {
                                if (this.queue[queIdx].optionFocusIndex == -1) {
                                    // 아이템에 포커스가 활성화 된 후, 마우스 이벤트 이면 무시
                                    self.close();
                                }
                            } else {
                                self.open(queIdx);
                                U.stopEvent(e);
                            }
                        }
                    },
                    'keyUp': function keyUp(queIdx, e) {
                        if (e.which == ax5.info.eventKeys.SPACE) {
                            selectEvent.click.call(this, queIdx, e);
                        } else if (!ctrlKeys[e.which]) {
                            // 사용자 입력이 뜸해지면 찾고 검색 값 제거...
                            focusWordCall(this.queue[queIdx].$displayInput.val(), queIdx);
                        }
                    },
                    'keyDown': function keyDown(queIdx, e) {
                        if (e.which == ax5.info.eventKeys.DOWN) {
                            focusMove.call(this, queIdx, 1);
                            U.stopEvent(e);
                        } else if (e.which == ax5.info.eventKeys.UP) {
                            focusMove.call(this, queIdx, -1);
                            U.stopEvent(e);
                        }
                    },
                    'blur': function blur(queIdx, e) {},
                    'selectChange': function selectChange(queIdx, e) {
                        this.val(queIdx, this.queue[queIdx].$select.val(), true);
                    }
                };
                return function (queIdx) {
                    var item = this.queue[queIdx],
                        data = {};

                    // find selected
                    item.selected = [];
                    if (!item.options) item.options = [];
                    item.options.forEach(function (n) {
                        if (n[cfg.columnKeys.optionSelected]) item.selected.push(jQuery.extend({}, n));
                    });

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

                        item.$display = SELECT.tmpl.get.call(this, "tmpl", data);
                        item.$displayLabel = item.$display.find('[data-ax5select-display="label"]');

                        if (item.$target.find("select").get(0)) {
                            item.$select = item.$target.find("select");
                            // select 속성만 변경
                            item.$select.attr("tabindex", "-1").attr("class", "form-control " + data.formSize);
                            if (data.name) {
                                item.$select.attr("name", "name");
                            }
                            if (data.multiple) {
                                item.$select.attr("multiple", "multiple");
                            }
                        } else {
                            item.$select = SELECT.tmpl.get.call(this, "selectTmpl", data);
                            item.$target.append(item.$select);
                            // select append
                        }

                        item.$target.append(item.$display);
                        item.$displayInput = item.$display.find('[data-ax5select-display="input"]'); // 사용자 입력값을 받기위한 숨음 입력필드
                        item.options = syncSelectOptions.call(this, queIdx, item.options);

                        alignSelectDisplay.call(this);

                        item.$displayInput.unbind("blur.ax5select").bind("blur.ax5select", selectEvent.blur.bind(this, queIdx)).unbind('keyup.ax5select').bind('keyup.ax5select', selectEvent.keyUp.bind(this, queIdx)).unbind("keydown.ax5select").bind("keydown.ax5select", selectEvent.keyDown.bind(this, queIdx));
                    } else {
                        item.$displayLabel.html(getLabel.call(this, queIdx));
                        item.options = syncSelectOptions.call(this, queIdx, item.options);

                        alignSelectDisplay.call(this);
                    }

                    item.$display.unbind('click.ax5select').bind('click.ax5select', selectEvent.click.bind(this, queIdx)).unbind('keyup.ax5select').bind('keyup.ax5select', selectEvent.keyUp.bind(this, queIdx));

                    // select 태그에 대한 change 이벤트 감시
                    item.$select.unbind('change.ax5select').bind('change.ax5select', selectEvent.selectChange.bind(this, queIdx));

                    data = null;
                    item = null;
                    queIdx = null;
                    return this;
                };
            }(),
                syncSelectOptions = function () {
                var setSelected = function setSelected(queIdx, O) {
                    if (!O) {
                        this.queue[queIdx].selected = [];
                    } else {
                        if (this.queue[queIdx].multiple) this.queue[queIdx].selected.push(jQuery.extend({}, O));else this.queue[queIdx].selected[0] = jQuery.extend({}, O);
                    }
                };

                return function (queIdx, options) {
                    var item = this.queue[queIdx],
                        po = void 0,
                        elementOptions = void 0,
                        newOptions = void 0,
                        focusIndex = 0;

                    setSelected.call(this, queIdx, false); // item.selected 초기화

                    if (options) {
                        item.options = options;
                        item.indexedOptions = [];

                        // select options 태그 생성
                        po = [];
                        item.options.forEach(function (O, OIndex) {
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
                                        '@findex': focusIndex, value: OO[item.columnKeys.optionValue], text: OO[item.columnKeys.optionText]
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
                                    '@findex': focusIndex, value: O[item.columnKeys.optionValue], text: O[item.columnKeys.optionText]
                                });
                                focusIndex++;
                            }
                        });
                        item.optionItemLength = focusIndex;
                        item.$select.html(po.join(''));
                    } else {
                        /// select > options 태그로 스크립트 options를 만들어주는 역할
                        elementOptions = U.toArray(item.$select.get(0).options);
                        // select option 스크립트 생성
                        newOptions = [];
                        elementOptions.forEach(function (O, OIndex) {
                            var option = {};
                            //if (O.value != "") {
                            option[item.columnKeys.optionValue] = O.value;
                            option[item.columnKeys.optionText] = O.text;
                            option[item.columnKeys.optionSelected] = O.selected;
                            option['@index'] = OIndex;
                            option['@findex'] = OIndex;
                            if (O.selected) setSelected.call(self, queIdx, option);
                            newOptions.push(option);
                            //}
                            option = null;
                        });
                        item.options = newOptions;
                        item.indexedOptions = newOptions;
                    }

                    if (!item.multiple && item.selected.length == 0 && item.options && item.options[0]) {
                        if (item.options[0].optgroup) {
                            item.options[0].options[0][item.columnKeys.optionSelected] = true;
                            item.selected.push(jQuery.extend({}, item.options[0].options[0]));
                        } else {
                            item.options[0][item.columnKeys.optionSelected] = true;
                            item.selected.push(jQuery.extend({}, item.options[0]));
                        }
                    }

                    po = null;
                    elementOptions = null;
                    newOptions = null;
                    return item.options;
                };
            }(),
                getQueIdx = function getQueIdx(boundID) {
                if (!U.isString(boundID)) {
                    boundID = jQuery(boundID).data("data-ax5select-id");
                }
                if (!U.isString(boundID)) {
                    console.log(ax5.info.getError("ax5select", "402", "getQueIdx"));
                    return;
                }
                return U.search(this.queue, function () {
                    return this.id == boundID;
                });
            };
            /// private end

            /**
             * Preferences of select UI
             * @method ax5select.setConfig
             * @param {Object} config - 클래스 속성값
             * @returns {ax5select}
             * @example
             * ```js
             * var options = [];
             * for (var i = 0; i < 20; i++) {
            *     options.push({value: i, text: "optionText" + i});
            * }
              * var mySelect = new ax5.ui.select({
            *     theme: "danger"
            * });
              * mySelect.bind({
            *     theme: "primary",
            *     target: $('[data-ax5select="select1"]'),
            *     options: options,
            *     onChange: function () {
            *         console.log(this);
            *     },
            *     onClose: function () {
            *         console.log(this);
            *     },
            *     onStateChanged: function () {
            *         console.log(this);
            *     }
            * });
             * ```
             */
            this.init = function () {
                this.onStateChanged = cfg.onStateChanged;
                this.onChange = cfg.onChange;

                jQuery(window).bind("resize.ax5select-display-" + this.instanceId, function () {
                    alignSelectDisplay.call(this);
                }.bind(this));
            };

            /**
             * bind select
             * @method ax5select.bind
             * @param {Object} item
             * @param {String} [item.id]
             * @param {String} [item.theme]
             * @param {Boolean} [item.multiple]
             * @param {Element} item.target
             * @param {Object[]} item.options
             * @returns {ax5select}
             * @example
             * ```js
             * var mySelect = new ax5.ui.select();
             * mySelect.bind({
             *  columnKeys: {
             *      optionValue: "value",
             *      optionText: "text"
             *  },
             *  target: $('[data-ax5select="select1"]'),
             *  options: [
             *      {value: "", text: ""}
             *  ],
             *  onChange: function(){
             *
             *  },
             *  onClose: function(){
             *
             *  },
             *  onStateChanged: function(){
             *
             *  }
             * });
             * ```
             */
            this.bind = function (item) {
                var selectConfig = {},
                    queIdx = void 0;

                item = jQuery.extend(true, selectConfig, cfg, item);

                if (!item.target) {
                    console.log(ax5.info.getError("ax5select", "401", "bind"));
                    return this;
                }

                item.$target = jQuery(item.target);

                if (!item.id) item.id = item.$target.data("data-ax5select-id");
                if (!item.id) {
                    item.id = 'ax5select-' + ax5.getGuid();
                    item.$target.data("data-ax5select-id", item.id);
                }
                item.name = item.$target.attr("data-ax5select");

                if (item.options) {
                    item.options = JSON.parse(JSON.stringify(item.options));
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        item = jQuery.extend(true, item, data);
                    }
                })(U.parseJson(item.$target.attr("data-ax5select-config"), true));

                queIdx = U.search(this.queue, function () {
                    return this.id == item.id;
                });

                if (queIdx === -1) {
                    this.queue.push(item);
                    bindSelectTarget.call(this, this.queue.length - 1);
                } else {
                    this.queue[queIdx].selected = [];
                    this.queue[queIdx].options = item.options;
                    this.queue[queIdx] = jQuery.extend(true, {}, this.queue[queIdx], item);
                    bindSelectTarget.call(this, queIdx);
                }

                selectConfig = null;
                queIdx = null;
                return this;
            };

            /**
             * open the optionBox of select
             * @method ax5select.open
             * @param {(String|Number|Element)} boundID
             * @param {Number} [tryCount]
             * @returns {ax5select}
             */
            this.open = function () {

                var onExpand = function onExpand(item) {
                    item.onExpand.call({
                        self: this,
                        item: item
                    }, function (O) {
                        if (this.waitOptionsCallback) {
                            var data = {};
                            var item = this.queue[this.activeSelectQueueIndex];

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

                            item.$displayLabel.html(getLabel.call(this, this.activeSelectQueueIndex));
                            item.options = syncSelectOptions.call(this, this.activeSelectQueueIndex, O.options);

                            alignSelectDisplay.call(this);

                            /// 템플릿에 전달할 오브젝트 선언
                            data.id = item.id;
                            data.theme = item.theme;
                            data.size = "ax5select-option-group-" + item.size;
                            data.multiple = item.multiple;
                            data.lang = item.lang;
                            data.options = item.options;
                            this.activeSelectOptionGroup.find('[data-els="content"]').html(SELECT.tmpl.get.call(this, "optionsTmpl", data, item.columnKeys));
                        }
                    }.bind(this));
                };

                return function (boundID, tryCount) {
                    this.waitOptionsCallback = null;

                    /**
                     * open select from the outside
                     */
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID),
                        item = this.queue[queIdx],
                        data = {},
                        focusTop = void 0,
                        selectedOptionEl = void 0;

                    if (item.$display.attr("disabled")) return this;

                    if (this.openTimer) clearTimeout(this.openTimer);
                    if (this.activeSelectOptionGroup) {
                        if (this.activeSelectQueueIndex == queIdx) {
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
                    data.size = "ax5select-option-group-" + item.size;
                    data.multiple = item.multiple;

                    data.lang = item.lang;
                    item.$display.attr("data-select-option-group-opened", "true");
                    //console.log(data.lang);

                    if (item.onExpand) {
                        // onExpand 인 경우 UI 대기모드 추가
                        data.waitOptions = true;
                    }

                    data.options = item.options;
                    this.activeSelectOptionGroup = SELECT.tmpl.get.call(this, "optionGroupTmpl", data);
                    this.activeSelectOptionGroup.find('[data-els="content"]').html(SELECT.tmpl.get.call(this, "optionsTmpl", data, item.columnKeys));
                    this.activeSelectQueueIndex = queIdx;

                    alignSelectOptionGroup.call(this, "append"); // alignSelectOptionGroup 에서 body append
                    jQuery(window).bind("resize.ax5select-" + this.instanceId, function () {
                        alignSelectOptionGroup.call(this);
                    }.bind(this));

                    if (item.selected && item.selected.length > 0) {
                        selectedOptionEl = this.activeSelectOptionGroup.find('[data-option-index="' + item.selected[0]["@index"] + '"]');

                        if (selectedOptionEl.get(0)) {
                            focusTop = selectedOptionEl.position().top - this.activeSelectOptionGroup.height() / 3;
                            this.activeSelectOptionGroup.find('[data-els="content"]').stop().animate({ scrollTop: focusTop }, item.animateTime, 'swing', function () {});
                        }
                    }

                    /// 사용자 입력으로 옵션을 검색하기 위한 시나리오
                    // 옵션그룹이 활성화 되면 사용자 입력을 받기위한 input 값 초기화 및 포커스 다른 select가 닫히면서 display focus 이벤트와 충돌하는 문제가 있으므로
                    // 1밀리세컨 지연후 포커스 처리. input에 포커스가 되므로 input value로 options를 검색 할 수 있게 됩니다.
                    item.$displayInput.val('');

                    setTimeout(function () {
                        item.$displayInput.trigger("focus");

                        jQuery(window).bind("keyup.ax5select-" + this.instanceId, function (e) {
                            e = e || window.event;
                            onBodyKeyup.call(this, e);
                            U.stopEvent(e);
                        }.bind(this));

                        jQuery(window).bind("click.ax5select-" + this.instanceId, function (e) {
                            e = e || window.event;
                            onBodyClick.call(this, e);
                            U.stopEvent(e);
                        }.bind(this));
                    }.bind(this), 300);

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
             * @method ax5select.update
             * @param {(Object|String)} item
             * @returns {ax5select}
             */
            this.update = function (_item) {
                this.bind(_item);
                return this;
            };

            /**
             * @method ax5select.setOptions
             * @param boundID
             * @param options
             * @returns {ax5select}
             */
            this.setOptions = function (boundID, options) {
                var queIdx = getQueIdx.call(this, boundID);
                this.queue[queIdx].selected = [];
                this.queue[queIdx].options = options;
                bindSelectTarget.call(this, queIdx);
                return this;
            };

            /**
             * @method ax5select.val
             * @param {(String|Number|Element)} boundID
             * @param {(String|Object|Array)} [value]
             * @param {Boolean} [selected]
             * @returns {ax5select}
             */
            this.val = function () {

                // todo : val 함수 리팩토링 필요
                var getSelected = function getSelected(_item, o, selected) {
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
                    processor = {
                    'index': function index(queIdx, value, selected) {
                        // 클래스 내부에서 호출된 형태, 그런 이유로 옵션그룹에 대한 상태를 변경 하고 있다.
                        var item = this.queue[queIdx];

                        /*
                         if (U.isArray(value.index)) {
                         value.index.forEach(function (n) {
                         item.options[n][item.columnKeys.optionSelected] = getSelected(item, item.options[n][item.columnKeys.optionSelected], selected);
                         self.activeSelectOptionGroup
                         .find('[data-option-index="' + n + '"]')
                         .attr("data-option-selected", item.options[n][item.columnKeys.optionSelected].toString());
                         });
                         }
                         else {
                         }
                         */
                        if (U.isString(value.index.gindex)) {
                            item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected], selected);
                            self.activeSelectOptionGroup.find('[data-option-group-index="' + value.index.gindex + '"][data-option-index="' + value.index.index + '"]').attr("data-option-selected", item.options[value.index.gindex].options[value.index.index][item.columnKeys.optionSelected].toString());
                        } else {
                            item.options[value.index.index][item.columnKeys.optionSelected] = getSelected(item, item.options[value.index.index][item.columnKeys.optionSelected], selected);
                            self.activeSelectOptionGroup.find('[data-option-index="' + value.index.index + '"]').attr("data-option-selected", item.options[value.index.index][item.columnKeys.optionSelected].toString());
                        }

                        syncSelectOptions.call(this, queIdx, item.options);
                        syncLabel.call(this, queIdx);
                        alignSelectOptionGroup.call(this);
                    },
                    'arr': function arr(queIdx, values, selected) {
                        values.forEach(function (value) {
                            if (U.isString(value) || U.isNumber(value)) {
                                processor.value.call(self, queIdx, value, selected);
                            } else {
                                for (var key in processor) {
                                    if (value[key]) {
                                        processor[key].call(self, queIdx, value, selected);
                                        break;
                                    }
                                }
                            }
                        });
                    },
                    'value': function value(queIdx, _value, selected) {
                        var item = this.queue[queIdx],
                            optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionValue] == _value;
                        });
                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            console.log(ax5.info.getError("ax5select", "501", "val"));
                            return;
                        }

                        syncSelectOptions.call(this, queIdx, item.options);
                        syncLabel.call(this, queIdx);
                    },
                    'text': function text(queIdx, value, selected) {
                        var item = this.queue[queIdx],
                            optionIndex = U.search(item.options, function () {
                            return this[item.columnKeys.optionText] == value;
                        });
                        if (optionIndex > -1) {
                            item.options[optionIndex][item.columnKeys.optionSelected] = getSelected(item, item.options[optionIndex][item.columnKeys.optionSelected], selected);
                        } else {
                            console.log(ax5.info.getError("ax5select", "501", "val"));
                            return;
                        }

                        syncSelectOptions.call(this, queIdx, item.options);
                        syncLabel.call(this, queIdx);
                    },
                    'clear': function clear(queIdx) {
                        clearSelected.call(this, queIdx);
                        syncSelectOptions.call(this, queIdx, this.queue[queIdx].options);
                        syncLabel.call(this, queIdx);

                        if (this.activeSelectOptionGroup) {
                            this.activeSelectOptionGroup.find('[data-option-index]').attr("data-option-selected", "false");
                        }
                    }
                };

                return function (boundID, value, selected, internal) {
                    var queIdx = U.isNumber(boundID) ? boundID : getQueIdx.call(this, boundID);
                    if (!this.queue[queIdx]) {
                        return this;
                    }
                    if (typeof value !== "undefined" && !this.queue[queIdx].multiple) {
                        clearSelected.call(this, queIdx);
                    }

                    if (typeof value == "undefined") {
                        return this.queue[queIdx].selected;
                    } else if (U.isArray(value)) {
                        processor.arr.call(this, queIdx, value, selected);
                    } else if (U.isString(value) || U.isNumber(value)) {
                        processor.value.call(this, queIdx, value, selected);
                    } else {
                        if (value === null) {
                            processor.clear.call(this, queIdx);
                        } else {
                            for (var key in processor) {
                                if (value[key]) {
                                    processor[key].call(this, queIdx, value, selected);
                                    break;
                                }
                            }
                        }
                    }

                    if (typeof value !== "undefined") {
                        onStateChanged.call(this, this.queue[queIdx], {
                            self: this,
                            item: this.queue[queIdx],
                            state: internal ? "changeValue" : "setValue",
                            value: this.queue[queIdx].selected,
                            internal: internal
                        });
                    }

                    boundID = null;
                    return this;
                };
            }();

            /**
             * @method ax5select.close
             * @returns {ax5select}
             */
            this.close = function (item) {
                if (this.closeTimer) clearTimeout(this.closeTimer);
                if (!this.activeSelectOptionGroup) return this;

                item = this.queue[this.activeSelectQueueIndex];
                item.optionFocusIndex = -1;

                item.$displayInput.val('').trigger("blur");
                item.$display.removeAttr("data-select-option-group-opened").trigger("focus");

                this.activeSelectOptionGroup.addClass("destroy");

                jQuery(window).unbind("resize.ax5select-" + this.instanceId).unbind("click.ax5select-" + this.instanceId).unbind("keyup.ax5select-" + this.instanceId);

                this.closeTimer = setTimeout(function () {
                    if (this.activeSelectOptionGroup) this.activeSelectOptionGroup.remove();
                    this.activeSelectOptionGroup = null;
                    this.activeSelectQueueIndex = -1;

                    var that = {
                        self: this,
                        item: item,
                        value: item.selected,
                        state: "close"
                    };

                    onStateChanged.call(this, item, that);

                    // waitOption timer
                    if (item.onClose) {
                        item.onClose.call(that);
                    }
                }.bind(this), cfg.animateTime);
                this.waitOptionsCallback = null;
                return this;
            };

            this.enable = function (boundID) {
                var queIdx = getQueIdx.call(this, boundID);
                this.queue[queIdx].$display.removeAttr("disabled");
                this.queue[queIdx].$select.removeAttr("disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "enable"
                });

                return this;
            };

            this.disable = function (boundID) {
                var queIdx = getQueIdx.call(this, boundID);
                this.queue[queIdx].$display.attr("disabled", "disabled");
                this.queue[queIdx].$select.attr("disabled", "disabled");

                onStateChanged.call(this, this.queue[queIdx], {
                    self: this,
                    state: "disable"
                });

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
        return ax5select;
    }());
    SELECT = ax5.ui.select;
})();

ax5.ui.select_instance = new ax5.ui.select();
jQuery.fn.ax5select = function () {
    return function (config) {
        if (ax5.util.isString(arguments[0])) {
            var methodName = arguments[0];

            switch (methodName) {
                case "open":
                    return ax5.ui.select_instance.open(this);
                    break;
                case "close":
                    return ax5.ui.select_instance.close(this);
                    break;
                case "setValue":
                    return ax5.ui.select_instance.val(this, arguments[1], arguments[2]);
                    break;
                case "getValue":
                    return ax5.ui.select_instance.val(this);
                    break;
                case "enable":
                    return ax5.ui.select_instance.enable(this);
                    break;
                case "disable":
                    return ax5.ui.select_instance.disable(this);
                    break;
                case "setOptions":
                    return ax5.ui.select_instance.setOptions(this, arguments[1]);
                    break;
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
                ax5.ui.select_instance.bind(config);
            });
        }
        return this;
    };
}();

// muliple 속성이 없는 select의 기본 선택 해제 방법.. 결정 필요..
// onExpand 가 있으면..?
// ax5.ui.select.tmpl
(function () {

    var SELECT = ax5.ui.select;

    var optionGroupTmpl = function optionGroupTmpl(columnKeys) {
        return '\n<div class="ax5select-option-group {{theme}} {{size}}" data-ax5select-option-group="{{id}}">\n    <div class="ax-select-body">\n        <div class="ax-select-option-group-content" data-els="content"></div>\n    </div>\n    <div class="ax-select-arrow"></div> \n</div>\n';
    };
    var tmpl = function tmpl(columnKeys) {
        return '\n<a {{^tabIndex}}href="#ax5select-{{id}}" {{/tabIndex}}{{#tabIndex}}tabindex="{{tabIndex}}" {{/tabIndex}}class="form-control {{formSize}} ax5select-display {{theme}}" \ndata-ax5select-display="{{id}}" data-ax5select-instance="{{instanceId}}">\n    <div class="ax5select-display-table" data-els="display-table">\n        <div data-ax5select-display="label">{{label}}</div>\n        <div data-ax5select-display="addon"> \n            {{#multiple}}{{#reset}}\n            <span class="addon-icon-reset" data-selected-clear="true">{{{.}}}</span>\n            {{/reset}}{{/multiple}}\n            {{#icons}}\n            <span class="addon-icon-closed">{{clesed}}</span>\n            <span class="addon-icon-opened">{{opened}}</span>\n            {{/icons}}\n            {{^icons}}\n            <span class="addon-icon-closed"><span class="addon-icon-arrow"></span></span>\n            <span class="addon-icon-opened"><span class="addon-icon-arrow"></span></span>\n            {{/icons}}\n        </div>\n    </div>\n    <input type="text" tabindex="-1" data-ax5select-display="input" \n    style="position:absolute;z-index:0;left:0px;top:0px;font-size:1px;opacity: 0;width:1px;border: 0px none;color : transparent;text-indent: -9999em;" />\n</a>\n';
    };
    var selectTmpl = function selectTmpl(columnKeys) {
        return '\n<select tabindex="-1" class="form-control {{formSize}}" name="{{name}}" {{#multiple}}multiple="multiple"{{/multiple}}></select>\n';
    };
    var optionsTmpl = function optionsTmpl(columnKeys) {
        return '\n{{#waitOptions}}\n    <div class="ax-select-option-item">\n            <div class="ax-select-option-item-holder">\n                <span class="ax-select-option-item-cell ax-select-option-item-label">\n                    {{{lang.loading}}}\n                </span>\n            </div>\n        </div>\n{{/waitOptions}}\n{{^waitOptions}}\n    {{#options}}\n        {{#optgroup}}\n            <div class="ax-select-option-group">\n                <div class="ax-select-option-item-holder">\n                    <span class="ax-select-option-group-label">\n                        {{{.}}}\n                    </span>\n                </div>\n                {{#options}}\n                <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-group-index="{{@gindex}}" data-option-index="{{@index}}" \n                data-option-value="{{' + columnKeys.optionValue + '}}" \n                {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n                    <div class="ax-select-option-item-holder">\n                        {{#multiple}}\n                        <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                            <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                        </span>\n                        {{/multiple}}\n                        <span class="ax-select-option-item-cell ax-select-option-item-label">{{{' + columnKeys.optionText + '}}}</span>\n                    </div>\n                </div>\n                {{/options}}\n            </div>                            \n        {{/optgroup}}\n        {{^optgroup}}\n        <div class="ax-select-option-item" data-option-focus-index="{{@findex}}" data-option-index="{{@index}}" data-option-value="{{' + columnKeys.optionValue + '}}" {{#' + columnKeys.optionSelected + '}}data-option-selected="true"{{/' + columnKeys.optionSelected + '}}>\n            <div class="ax-select-option-item-holder">\n                {{#multiple}}\n                <span class="ax-select-option-item-cell ax-select-option-item-checkbox">\n                    <span class="item-checkbox-wrap useCheckBox" data-option-checkbox-index="{{@i}}"></span>\n                </span>\n                {{/multiple}}\n                <span class="ax-select-option-item-cell ax-select-option-item-label">{{{' + columnKeys.optionText + '}}}</span>\n            </div>\n        </div>\n        {{/optgroup}}\n    {{/options}}\n    {{^options}}\n        <div class="ax-select-option-item">\n            <div class="ax-select-option-item-holder">\n                <span class="ax-select-option-item-cell ax-select-option-item-label">\n                    {{{lang.noOptions}}}\n                </span>\n            </div>\n        </div>\n    {{/options}}\n{{/waitOptions}}\n';
    };

    SELECT.tmpl = {
        "optionGroupTmpl": optionGroupTmpl,
        "tmpl": tmpl,
        "selectTmpl": selectTmpl,
        "optionsTmpl": optionsTmpl,

        get: function get(tmplName, data, columnKeys) {
            return jQuery(ax5.mustache.render(SELECT.tmpl[tmplName].call(this, columnKeys), data));
        }
    };
})();