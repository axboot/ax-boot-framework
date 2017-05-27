"use strict";

// ax5.ui.binder
(function () {

    var UI = ax5.ui;
    var U = ax5.util;

    UI.addClass({
        className: "binder"
    }, function () {

        /**
         * @class ax5binder
         * @classdesc
         * @author tom@axisj.com
         * @example
         * ```js
         * var obj = {
         *     name: "Thomas Jang",
         *     alias: "tom",
         *     tel: "010-8881-9137",
         *     email: "tom@axisj.com",
         *     sex: "M",
         *     hobby: ["sport"],
         *     useYn: "N",
         *     description: "http://www.axisj.com",
         *     list: [
         *         {
         *             name: "thomas",
         *             tel: "010-8881-9000",
         *             email: "tom@axisj.com",
         *             sex: "M",
         *             description: "",
         *             child: [{name:"값1"},{name:"값2"}],
         *             qty: 10,
         *             cost: 100
         *         },
         *         {
         *             name: "thomas",
         *             tel: "010-8881-9000",
         *             email: "tom@axisj.com",
         *             sex: "M",
         *             description: "",
         *             child: [{name:"값1"},{name:"값2"}],
         *             qty: 20,
         *             cost: 100
         *         }
         * ]
         * };
         *
         * var myBinder = new ax5.ui.binder();
         * myBinder.setModel(obj, $('#form-target'));
         * ```
         */
        return function () {

            var self = this,
                cfg;

            this.instanceId = ax5.getGuid();
            this.config = {};
            cfg = this.config;

            this.model = {};
            this.tmpl = {};
            this.view_target = null;
            this.change_trigger = {};
            this.click_trigger = {};
            this.update_trigger = {};
            this.onerror = null;

            var _toString = Object.prototype.toString,
                get_type = function get_type(O) {
                var typeName;
                if (O != null && O == O.window) {
                    typeName = "window";
                } else if (!!(O && O.nodeType == 1)) {
                    typeName = "element";
                } else if (!!(O && O.nodeType == 11)) {
                    typeName = "fragment";
                } else if (typeof O === "undefined") {
                    typeName = "undefined";
                } else if (_toString.call(O) == "[object Object]") {
                    typeName = "object";
                } else if (_toString.call(O) == "[object Array]") {
                    typeName = "array";
                } else if (_toString.call(O) == "[object String]") {
                    typeName = "string";
                } else if (_toString.call(O) == "[object Number]") {
                    typeName = "number";
                } else if (_toString.call(O) == "[object NodeList]") {
                    typeName = "nodelist";
                } else if (typeof O === "function") {
                    typeName = "function";
                }
                return typeName;
            },
                get_mix_path = function get_mix_path(dataPath, index, item_path) {
                return dataPath + "[" + index + "]" + (item_path == "." ? "" : "." + item_path);
            },
                get_real_path = function get_real_path(_dataPath) {
                var path = [];
                var _path = [].concat(_dataPath.split(/[\.\[\]]/g));
                _path.forEach(function (n) {
                    if (n !== "") path.push("[\"" + n.replace(/['\"]/g, "") + "\"]");
                });
                _path = null;
                return path.join("");
                /*
                var path = [];
                var _path = [].concat(dataPath.split(/[\.\[\]]/g));
                 _path.forEach(function (n) {
                    if (n !== "") path.push(n);
                });
                _path = null;
                return "'" + path.join("']['") + "'";
                */
            };

            /**
             * 바인딩할 자바스크립트 오브젝트로 제이쿼리로 검색된 HTML dom 엘리먼트 에 바인딩합니다. 바인딩된 모델을 반환합니다.
             * @method ax5binder.setModel
             * @param {Object} model
             * @param {jQueryObject} [view_target]
             * @returns {ax5binder}
             * @example
             * ```js
             * var myModel = new ax5.ui.binder();
             * myModel.setModel({}, $("#..."));
             * ```
             */
            this.setModel = function (model, view_target) {
                this.model = model;
                if (!this.view_target && view_target) {
                    this.view_target = view_target;
                    this._binding();
                } else {
                    this._binding("update");
                }
                return this;
            };

            /**
             * data_path에 값을 변경한다. value의 타입은 (String, Number, Array, Object)를 지원.
             * @method ax5binder.set
             * @param {String} dataPath
             * @param {Object} value
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.set("name", "Seowoo");
             * myModel.set("obj.path", {a:1});
             * ```
             */
            this.set = function (dataPath, value) {
                var _this = this,
                    obj_type,
                    i,
                    this_type;

                Function("val", "this" + get_real_path(dataPath) + " = val;").call(this.model, value);
                obj_type = get_type(value);

                if (obj_type == "object") {
                    for (var k in value) {
                        this.set(dataPath + "." + k, value[k]);
                    }
                } else if (obj_type == "array") {
                    this.view_target.find('[data-ax-path="' + dataPath + '"]').each(function () {
                        this_type = (this.type || "").toLowerCase();
                        if (this_type == "checkbox" || this_type == "radio") _this.set_els_value(this, this.tagName.toLowerCase(), this_type, value, dataPath, "change");
                    });
                    i = value.length;
                    while (i--) {
                        this.set(dataPath + "[" + i + "]", value[i]);
                    }
                } else {
                    // apply data value to els
                    this.view_target.find('[data-ax-path="' + dataPath + '"]').each(function () {
                        _this.set_els_value(this, this.tagName.toLowerCase(), (this.type || "").toLowerCase(), value, dataPath, "change");
                    });
                }
                return this;
            };

            /**
             * data_path에 값을 반환한다. data_path 가 없으면 전체 Object를 반환한다.
             * @method ax5binder.get
             * @param dataPath
             * @returns {*}
             */
            this.get = function (dataPath) {
                if (typeof dataPath == "undefined") {
                    return this.model;
                } else {
                    return Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                }
            };

            /**
             * data_path에 값이 변경되는 이벤트 발생하면 callback을 실행합니다.
             * @method ax5binder.onChange
             * @param dataPath
             * @param callback
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.onChange("name", function () {
             *       console.log(this);
             *       // el: domElement - 변경이 발생한 엘리먼트, 엘리먼트로 부터 다양한 속성을 추출할 수 있다.
             *       // jquery : jQueryObject
             *       // tagname: "input"
             *       // value: "changed value"
             *       console.log(this.el.id);
             *   });
             *   myModel.onChange("*", function (n) {
             *       console.log(n);
             *       // console.log(this); 와 동일
             *   });
             * ```
             */
            this.onChange = function (dataPath, callback) {
                this.change_trigger[dataPath || "*"] = callback;
                return this;
            };

            /**
             * data-ax-repeat="list" 속성이 부여된 엘리먼트 하위에 태그중에 data-ax-repeat-click 속성을 가진 아이템에 대해 클릭 이벤트 발생하면 callback을 실행합니다.
             * @method ax5binder.onClick
             * @param dataPath
             * @param callback
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.onclick("list", function () {
             *       console.log(this);
             *       // el: domElement
             *       // jquery: jQueryObject
             *       // item: Object - repeat item
             *       // item_index: "0" - index of item
             *       // item_path: "list[0]" - repeat data_path
             *       // repeat_path: "list"
             *       // tagname: "button"
             *       // value: "add"
             *   });
             * ```
             */
            this.onClick = function (dataPath, callback) {
                this.click_trigger[dataPath] = callback;
                return this;
            };

            /**
             * data-ax-repeat="list" 하위아이템을 추가합니다.
             * @method ax5binder.add
             * @param dataPath
             * @param item
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.add("list", {a:1});
             * ```
             */
            this.add = function (dataPath, item) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var tmpl = this.tmpl[dataPath];
                item['@i'] = list.length;
                item['@r'] = list.length;
                item.__ADDED__ = true;
                Function("val", "this" + get_real_path(dataPath) + ".push(val);").call(this.model, item);

                // 다중 템플릿 처리
                for (var t in tmpl) {
                    var fragdom = $(ax5.mustache.render(tmpl[t].content, item));
                    fragdom.attr("data-ax-repeat-path", dataPath);
                    fragdom.attr("data-ax-repeat-i", item['@i']);
                    this.bind_event_tmpl(fragdom, dataPath);
                    tmpl[t].container.append(fragdom);
                }

                this.change("*");

                var callback = this.update_trigger[dataPath];
                if (callback) {
                    var that = {
                        repeat_path: dataPath,
                        tmpl: tmpl,
                        list: list
                    };
                    callback.call(that, that);
                }

                return this;
            };

            /**
             * data-ax-repeat="list" 하위 아이템을 제거합니다. 단! 이 때 ADDED 값을 가진 아이템은 제거하고 그렇지 않은 아이템은 DELETED 값을 아이템에 추가합니다.
             * @method ax5binder.remove
             * @param dataPath
             * @param index
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.remove("list", 0);
             * ```
             */
            this.remove = function (dataPath, index) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var tmpl = this.tmpl[dataPath];
                if (typeof index == "undefined") index = list.length - 1;
                var remove_item = list[index];
                if (remove_item.__ADDED__) {
                    list.splice(index, 1);
                } else {
                    list[index].__DELETED__ = true;
                }

                for (var t in tmpl) {
                    tmpl[t].container.empty();
                    this.print_tmpl(dataPath, tmpl[t]);
                }

                this.change("*");

                var callback = this.update_trigger[dataPath];
                if (callback) {
                    var that = {
                        repeat_path: dataPath,
                        tmpl: tmpl,
                        list: list
                    };
                    callback.call(that, that);
                }

                return this;
            };

            /**
             * data-ax-repeat="list" 하위 아이템을 교체합니다.
             * @method ax5binder.update
             * @param dataPath
             * @param index
             * @param item
             * @returns {ax5binder}
             * @example
             * ```js
             * myModel.update("list", 0, {a:1});
             * ```
             */
            this.update = function (dataPath, index, item) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var tmpl = this.tmpl[dataPath];
                if (typeof index != "undefined" && item) list.splice(index, 1, item);

                for (var t in tmpl) {
                    tmpl[t].container.empty();
                    this.print_tmpl(dataPath, tmpl[t]);
                }

                this.change("*");

                var callback = this.update_trigger[dataPath];
                if (callback) {
                    var that = {
                        repeat_path: dataPath,
                        tmpl: tmpl,
                        list: list
                    };
                    callback.call(that, that);
                }

                return this;
            };

            /**
             * @method ax5binder.childAdd
             * @param dataPath
             * @param index
             * @param child_path
             * @param child_item
             */
            this.childAdd = function (dataPath, index, child_path, child_item) {
                var _list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var list = Function("", "return this" + get_real_path(dataPath) + "[" + index + "]." + child_path + ";").call(this.model);
                child_item.__ADDED__ = true;
                list.push(child_item);
                this.update(dataPath, index, _list[index]);
            };

            /**
             * ax5binder.childRemove
             * @param dataPath
             * @param index
             * @param child_path
             * @param child_index
             */
            this.childRemove = function (dataPath, index, child_path, child_index) {
                var _list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var list = Function("", "return this" + get_real_path(dataPath) + "[" + index + "]." + child_path + ";").call(this.model);
                var remove_item = list[child_index];
                if (remove_item.__ADDED__) {
                    list.splice(child_index, 1);
                } else {
                    list[child_index].__DELETED__ = true;
                }
                this.update(dataPath, index, _list[index]);
            };

            /**
             * @method ax5binder.childUpdate
             * @param dataPath
             * @param index
             * @param child_path
             * @param child_index
             * @param child_item
             */
            this.childUpdate = function (dataPath, index, child_path, child_index, child_item) {
                var _list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                var list = Function("", "return this" + get_real_path(dataPath) + "[" + index + "]." + child_path + ";").call(this.model);
                list[child_index] = child_item;
                this.update(dataPath, index, _list[index]);
            };

            /**
             * @method ax5binder.childSet
             * @param dataPath
             * @param index
             * @param child_path
             * @param value
             * @returns {ax5binder}
             */
            this.childSet = function (dataPath, index, child_path, value) {
                var _this = this,
                    i;
                Function("val", "this" + get_real_path(dataPath) + "[" + index + "]." + child_path + " = val;").call(this.model, value);

                // apply data value to els
                this.view_target.find('[data-ax-repeat="' + dataPath + '"]').find('[data-ax-repeat-i="' + index + '"]').find('[data-ax-item-path="' + child_path + '"]').each(function () {
                    _this.set_els_value(this, this.tagName.toLowerCase(), (this.type || "").toLowerCase(), value, dataPath + "[" + index + "]." + child_path);
                });
                return this;
            };

            /**
             * @method ax5binder.onUpdate
             * @param dataPath
             * @param callback
             * @returns {ax5binder}
             * @example
             * ```js
             *  this.model.onupdate("moderator", function () {
             *      $('#moderator-add').val('');
             *      $moderator.find('[data-role-user-btn]')
             *          .unbind("click")
             *          .bind("click", role_user_btn_onclick);
             *  });
             * ```
             */
            this.onUpdate = function (dataPath, callback) {
                this.update_trigger[dataPath] = callback;
                return this;
            };

            this._binding = function (isupdate) {
                var _this = this;

                // apply data value to els
                this.view_target.find('[data-ax-path]').each(function () {
                    var dom = $(this),
                        dataPath = dom.attr("data-ax-path"),
                        this_type = (this.type || "").toLowerCase();

                    var val;
                    try {
                        val = Function("", "return this" + get_real_path(dataPath) + ";").call(_this.model);
                    } catch (e) {
                        /**
                         * onerror를 선언 한 경우에만 에러 출력
                         * */
                        if (_this.onerror) _this.onerror("not found target [model." + get_real_path(dataPath) + "]");
                    }

                    _this.set_els_value(this, this.tagName.toLowerCase(), this_type, val || "", dataPath);
                });

                if (typeof isupdate == "undefined") {
                    // collect tmpl
                    this.view_target.find('[data-ax-repeat]').each(function () {
                        var dom = $(this),
                            dataPath = dom.attr("data-ax-repeat"),
                            repeat_idx = dom.attr("data-ax-repeat-idx");

                        if (typeof _this.tmpl[dataPath] == "undefined") _this.tmpl[dataPath] = {};
                        if (typeof repeat_idx != "undefined") {
                            _this.tmpl[dataPath][repeat_idx] = {
                                container: dom, content: dom.find("script").html()
                            };
                        } else {
                            _this.tmpl[dataPath]["0"] = {
                                container: dom, content: dom.find("script").html()
                            };
                        }
                        //dom.empty().show();
                        dom.empty();
                    });
                } else {
                    this.view_target.find('[data-ax-repeat]').each(function () {
                        var dom = $(this);
                        dom.empty().show();
                    });
                }

                // binding event to els
                this.view_target.find('[data-ax-path]').off("change.axbinder").on("change.axbinder", function (e) {

                    var i,
                        hasItem = false,
                        checked,
                        new_value = [],
                        dom = $(e.target),
                        dataPath = dom.attr("data-ax-path"),
                        origin_value = Function("", "return this" + get_real_path(dataPath) + ";").call(_this.model),
                        this_type = (this.type || "").toLowerCase(),
                        value_type = get_type(origin_value),
                        setAllow = true;

                    if (value_type == "object" || value_type == "array") {
                        setAllow = false;
                    }

                    if (this_type == "checkbox") {
                        // 동일한 체크박스가 여러개 인지 판단합니다.
                        if (_this.view_target.find('[data-ax-path="' + dataPath + '"]').length > 1) {

                            if (get_type(origin_value) != "array") {
                                if (typeof origin_value === "undefined" || origin_value == "") origin_value = [];else origin_value = [].concat(origin_value);
                            }
                            i = origin_value.length, hasItem = false, checked = this.checked;
                            while (i--) {
                                if (origin_value[i] == this.value) {
                                    hasItem = true;
                                }
                            }

                            if (checked) {
                                if (!hasItem) origin_value.push(this.value);
                            } else {
                                i = origin_value.length;
                                while (i--) {
                                    if (origin_value[i] == this.value) {
                                        //hasItemIndex = i;
                                    } else {
                                        new_value.push(origin_value[i]);
                                    }
                                }
                                origin_value = new_value;
                            }
                        } else {
                            origin_value = this.checked ? this.value : "";
                        }

                        Function("val", "this" + get_real_path(dataPath) + " = val;").call(_this.model, origin_value);
                        _this.change(dataPath, {
                            el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: origin_value
                        });
                    } else {
                        if (setAllow) {
                            Function("val", "this" + get_real_path(dataPath) + " = val;").call(_this.model, this.value);
                            _this.change(dataPath, {
                                el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: this.value
                            });
                        }
                    }

                    dom.data("changedTime", new Date().getTime());
                });
                /*
                 this.view_target.find('[data-ax-path]').unbind("blur.axbinder").bind("blur.axbinder", function (e) {
                 var dom = $(e.target);
                 if (typeof dom.data("changedTime") == "undefined" || dom.data("changedTime") < (new Date()).getTime() - 10) dom.trigger("change");
                 });
                 */

                //_this.tmpl
                var callback;
                for (var tk in _this.tmpl) {
                    for (var ix in _this.tmpl[tk]) {
                        // console.log(_this.tmpl[tk][ix].content);
                        this.print_tmpl(tk, _this.tmpl[tk][ix], "isInit");
                    }

                    if (callback = this.update_trigger[tk]) {
                        var that = {
                            repeat_path: tk,
                            tmpl: _this.tmpl[tk],
                            list: Function("", "return this." + tk + ";").call(this.model)
                        };
                        callback.call(that, that);
                    }
                }
            };

            this.set_els_value = function (el, tagname, type, value, dataPath, callChange) {
                if (typeof value === "undefined") value = [];else value = [].concat(value);
                var options, i;

                if (tagname == "input") {
                    if (type == "checkbox" || type == "radio") {
                        i = value.length;
                        var checked = false;
                        try {
                            if (i > 0) {
                                while (i--) {
                                    if (typeof value[i] !== "undefined" && el.value === value[i].toString()) {
                                        checked = true;
                                    }
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        el.checked = checked;
                    } else {
                        el.value = value.join('');
                    }
                } else if (tagname == "select") {
                    options = el.options, i = options.length;
                    var vi,
                        option_matched = false;

                    while (i--) {
                        vi = value.length;
                        while (vi--) {
                            if (typeof value[vi] !== "undefined" && options[i].value === value[vi].toString()) {
                                options[i].selected = true;
                                option_matched = true;
                                break;
                            }
                        }
                        if (option_matched) break;
                    }
                    if (!option_matched) {
                        if (options[0]) {
                            options[0].selected = true;
                            Function("val", "this" + get_real_path(dataPath) + " = val;").call(this.model, options[0].value);
                        } else {
                            Function("val", "this" + get_real_path(dataPath) + " = val;").call(this.model, "");
                        }
                    }

                    if (window.AXSelect) {
                        // AXISJ 사용가능
                        $(typeof value !== "undefined" && el).bindSelectSetValue(value[value.length - 1]);
                    }
                } else if (tagname == "textarea") {
                    el.value = value.join('') || "";
                } else {
                    if (el.innerText) {
                        el.innerText = value.join("");
                    } else {
                        el.innerHTML = value.join("");
                    }
                }

                if (callChange) {
                    this.change(dataPath, { el: el, tagname: tagname, value: value });
                }
                return this;
            };

            this.change = function (dataPath, that) {
                var callback = this.change_trigger[dataPath];
                if (callback) {
                    callback.call(that, that);
                }
                if (dataPath != "*" && this.change_trigger["*"]) {
                    this.change_trigger["*"].call(that, that);
                }
            };

            this.click = function (dataPath, that) {
                var callback = this.click_trigger[dataPath];
                if (callback) {
                    callback.call(that, that);
                }
            };

            this.sync_model = function () {};

            this.print_tmpl = function (dataPath, tmpl, isInit) {
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);
                if (list && get_type(list) == "array") {
                    for (var i = 0, l = list.length; i < l; i++) {
                        var item = list[i];
                        if (jQuery.isPlainObject(item)) {
                            item['@i'] = i;
                            item['@r'] = i;
                            if (i === 0) item['@first'] = true;
                        } else {
                            item = {
                                "@i": i,
                                "@value": item
                            };
                            if (i === 0) item['@first'] = true;
                            console.log(item);
                        }

                        if (!item.__DELETED__) {
                            var fragdom = $(ax5.mustache.render(tmpl.content, item));
                            fragdom.attr("data-ax-repeat-path", dataPath);
                            fragdom.attr("data-ax-repeat-i", item['@i']);
                            this.bind_event_tmpl(fragdom, dataPath);
                            tmpl.container.append(fragdom);
                        }
                    }
                }
            };

            this.bind_event_tmpl = function (target, dataPath) {
                var _this = this,
                    index = target.attr("data-ax-repeat-i");
                var list = Function("", "return this" + get_real_path(dataPath) + ";").call(this.model);

                target.find('[data-ax-repeat-click]').off("click.axbinder").on("click.axbinder", function (e) {
                    var target = ax5.util.findParentNode(e.target, function (el) {
                        return el.getAttribute("data-ax-repeat-click");
                    });
                    if (target) {
                        var dom = $(target),
                            value = dom.attr("data-ax-repeat-click"),
                            repeat_path = dom.attr("data-ax-repeat-path");
                        var that = {
                            el: target,
                            jquery: dom,
                            tagname: target.tagName.toLowerCase(),
                            value: value,
                            repeat_path: dataPath,
                            item: list[index],
                            item_index: index,
                            item_path: dataPath + "[" + index + "]"
                        };
                        _this.click(dataPath, that);
                    }
                });

                // apply data value to els
                target.find('[data-ax-item-path]').each(function () {
                    var dom = $(this),
                        item_path = dom.attr("data-ax-item-path"),
                        mix_path = get_mix_path(dataPath, index, item_path),
                        val,
                        this_type = (this.type || "").toLowerCase();

                    try {
                        val = Function("", "return this." + mix_path + ";").call(_this.model);
                    } catch (e) {
                        /**
                         * onerror를 선언 한 경우에만 에러 출력
                         * */
                        if (_this.onerror) _this.onerror("not found target [model." + mix_path + "]");
                    }
                    //if (typeof val !== "undefined") _this.set_els_value(this, this.tagName.toLowerCase(), this_type, val, mix_path);
                    _this.set_els_value(this, this.tagName.toLowerCase(), this_type, val || "", mix_path);
                });

                // binding event to els
                target.find('[data-ax-item-path]').off("change.axbinder").on("change.axbinder", function (e) {
                    var i,
                        hasItem = false,
                        checked,
                        new_value = [],
                        this_type = (this.type || "").toLowerCase(),
                        dom = $(e.target),
                        item_path = dom.attr("data-ax-item-path"),
                        mix_path = get_mix_path(dataPath, index, item_path),
                        origin_value = Function("", "return this." + mix_path + ";").call(_this.model),
                        value_type = get_type(origin_value),
                        setAllow = true;

                    if (value_type == "object" || value_type == "array") {
                        setAllow = false;
                    }

                    if (this_type == "checkbox") {
                        if (target.find('[data-ax-item-path="' + item_path + '"]').length > 1) {
                            if (get_type(origin_value) != "array") {
                                if (typeof origin_value === "undefined" || origin_value == "") origin_value = [];else origin_value = [].concat(origin_value);
                            }
                            i = origin_value.length, hasItem = false, checked = this.checked;
                            while (i--) {
                                if (origin_value[i] == this.value) {
                                    hasItem = true;
                                }
                            }

                            if (checked) {
                                if (!hasItem) origin_value.push(this.value);
                            } else {
                                i = origin_value.length;
                                while (i--) {
                                    if (origin_value[i] == this.value) {
                                        //hasItemIndex = i;
                                    } else {
                                        new_value.push(origin_value[i]);
                                    }
                                }
                                origin_value = new_value;
                            }
                        } else {
                            origin_value = this.checked ? this.value : "";
                        }

                        Function("val", "this." + mix_path + " = val;").call(_this.model, origin_value);
                        _this.change(mix_path, {
                            el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: origin_value
                        });
                    } else {
                        if (setAllow) {
                            Function("val", "this." + mix_path + " = val;").call(_this.model, this.value);
                            _this.change(mix_path, {
                                el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: this.value
                            });
                        }
                    }

                    dom.data("changedTime", new Date().getTime());
                });

                target.find('[data-ax-item-path]').off("blur.axbinder").on("blur.axbinder", function (e) {
                    var dom = $(e.target);
                    if (typeof dom.data("changedTime") == "undefined" || dom.data("changedTime") < new Date().getTime() - 10) dom.trigger("change");
                });
            };

            /**
             * @method ax5binder.focus
             * @param dataPath
             * @returns {ax5binder}
             */
            this.focus = function (dataPath) {
                this.view_target.find('[data-ax-path="' + dataPath + '"]').focus();
                //this.view_target.find('[data-ax-item-path="' + get_real_path(dataPath) + '"]').focus();
                return this;
            };

            /**
             * @method ax5binder.validate
             * @returns {*}
             * @example
             * ```html
             * <input type="text" data-ax-path="q" data-ax-validate="required" title="이름" maxlength="8" value=""/>
             * ```
             * ```js
             * var rs = myModel.validate(), _s;
             * console.log(rs); // 결과를 체크 해보세요
             * if(rs.error) {
             *      _s = rs.error[0].jquery.attr("title");
             *      alert("" + _s + "(은)는 필수 입력사항입니다." + _s + "(을)를 입력하세요");
             *      rs.error[0].el.focus();
             *      return;
             *  }
             * ```
             */
            this.validate = function () {
                var _this = this;
                var errors = [];
                this.view_target.find('[data-ax-path]').each(function () {
                    var dom = $(this),
                        dataPath = dom.attr("data-ax-path"),
                        is_validate = dom.attr("data-ax-validate"),
                        pattern = dom.attr("pattern");

                    if (is_validate) {
                        var val, _val, is_error;

                        val = Function("", "return this" + get_real_path(dataPath) + ";").call(_this.model);
                        if (typeof val === "undefined" || val === null) val = "";
                        _val = val.toString();
                        is_error = false;

                        if (is_validate == "required" && _val.trim() == "") {
                            is_error = true;
                        } else if (is_validate == "pattern") {
                            is_error = !new RegExp(pattern).test(_val);
                        } else if (is_validate == "email") {
                            is_error = !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(_val);
                        } else if (!/\D.?/g.test(is_validate) && _val.trim().length < is_validate.number()) {
                            is_error = true;
                        }

                        if (is_error) {
                            errors.push({
                                type: is_validate,
                                dataPath: dataPath,
                                el: this,
                                jquery: dom,
                                value: val
                            });
                        }
                    }
                });
                this.view_target.find('[data-ax-repeat-path]').each(function () {

                    var dom = $(this),
                        dataPath = dom.attr("data-ax-repeat-path"),
                        repeat_idx = dom.attr("data-ax-repeat-i");

                    dom.find('[data-ax-validate]').each(function () {
                        var dom = $(this),
                            is_validate = dom.attr("data-ax-validate"),
                            item_path = dom.attr("data-ax-item-path");
                        var val = Function("", "return this" + get_real_path(dataPath) + "[" + repeat_idx + "]." + item_path + ";").call(_this.model);
                        if (typeof val === "undefined") val = "";
                        var _val = val.toString();

                        if (is_validate) {
                            var is_error = false;
                            if (is_validate == "required" && _val.trim() == "") {
                                is_error = true;
                            } else if (is_validate == "pattern") {
                                is_error = !new RegExp(pattern).test(_val);
                            } else if (is_validate == "email") {
                                is_error = !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(_val);
                            } else if (!/\D.?/g.test(is_validate) && _val.trim().length < is_validate.number()) {
                                is_error = true;
                            }

                            if (is_error) {
                                errors.push({
                                    type: is_validate,
                                    dataPath: dataPath,
                                    el: this,
                                    jquery: dom,
                                    value: val
                                });
                            }
                        }
                    });
                });

                if (errors.length > 0) {
                    return {
                        error: errors
                    };
                } else {
                    return {};
                }
            };

            // 클래스 생성자
            this.main = function () {
                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                }
            }.apply(this, arguments);
        };
    }());
})();