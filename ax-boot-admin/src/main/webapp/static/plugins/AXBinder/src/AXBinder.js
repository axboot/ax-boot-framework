/**
 * AXBinder
 * 0.1
 *
 */

var AXBinder = (function () {
    var _toString = Object.prototype.toString;

    function get_type(O) {
        var typeName;
        if (O != null && O == O.window) {
            typeName = "window";
        }
        else if (!!(O && O.nodeType == 1)) {
            typeName = "element";
        }
        else if (!!(O && O.nodeType == 11)) {
            typeName = "fragment";
        }
        else if (typeof O === "undefined") {
            typeName = "undefined";
        }
        else if (_toString.call(O) == "[object Object]") {
            typeName = "object";
        }
        else if (_toString.call(O) == "[object Array]") {
            typeName = "array";
        }
        else if (_toString.call(O) == "[object String]") {
            typeName = "string";
        }
        else if (_toString.call(O) == "[object Number]") {
            typeName = "number";
        }
        else if (_toString.call(O) == "[object NodeList]") {
            typeName = "nodelist";
        }
        else if (typeof O === "function") {
            typeName = "function";
        }
        return typeName;
    }

    function get_mix_path(data_path, index, item_path) {
        return data_path + "[" + index + "]" + ((item_path == ".") ? "" : "." + item_path);
    }

    var klass = function () {
        this.model = {};
        this.tmpl = {};
        this.view_target = null;
        this.change_trigger = {};
        this.click_trigger = {};
        this.update_trigger = {};
        this.onerror = null;
    };

    klass.prototype.set_model = function (model, view_target) {
        this.model = model;
        if (!this.view_target && view_target) {
            this.view_target = view_target;
            this._binding();
        }
        else {
            this._binding("update");
        }
        return this;
    };

    klass.prototype._binding = function (isupdate) {
        var _this = this;

        // apply data value to els
        this.view_target.find('[data-ax-path]').each(function () {
            var dom = $(this), data_path = dom.attr("data-ax-path"), this_type = (this.type || "").toLowerCase();

            var val;
            try {
                val = (Function("", "return this." + data_path + ";")).call(_this.model);
            } catch (e) {
                /**
                 * onerror를 선언 한 경우에만 에러 출력
                 * */
                if (_this.onerror) _this.onerror("not found target [model." + data_path + "]");
            }

            _this.set_els_value(this, this.tagName.toLowerCase(), this_type, val || "", data_path);
        });

        if (typeof isupdate == "undefined") {
            // collect tmpl
            this.view_target.find('[data-ax-repeat]').each(function () {
                var dom = $(this), data_path = dom.attr("data-ax-repeat"), repeat_idx = dom.attr("data-ax-repeat-idx");

                if (typeof _this.tmpl[data_path] == "undefined") _this.tmpl[data_path] = {};
                if (typeof repeat_idx != "undefined") {
                    _this.tmpl[data_path][repeat_idx] = {
                        container: dom, content: dom.find("script").html()
                    };
                }
                else {
                    _this.tmpl[data_path]["0"] = {
                        container: dom, content: dom.find("script").html()
                    };
                }
                //dom.empty().show();
                dom.empty();
            });
        }
        else {
            this.view_target.find('[data-ax-repeat]').each(function () {
                var dom = $(this);
                dom.empty().show();
            });
        }

        // binding event to els
        this.view_target.find('[data-ax-path]').unbind("change.axbinder").bind("change.axbinder", function (e) {

            var
                i,
                hasItem = false,
                checked,
                new_value = [],
                dom = $(e.target),
                data_path = dom.attr("data-ax-path"),
                origin_value = (Function("", "return this." + data_path + ";")).call(_this.model),
                this_type = (this.type || "").toLowerCase(),
                value_type = get_type(origin_value),
                setAllow = true
                ;


            if (value_type == "object" || value_type == "array") {
                setAllow = false;
            }

            if (this_type == "checkbox") {
                // 동일한 체크박스가 여러개 인지 판단합니다.
                if (_this.view_target.find('[data-ax-path="' + data_path + '"]').length > 1) {

                    if (get_type(origin_value) != "array") {
                        if (typeof origin_value === "undefined" || origin_value == "") origin_value = [];
                        else origin_value = [].concat(origin_value);
                    }
                    i = origin_value.length, hasItem = false, checked = this.checked;
                    while (i--) {
                        if (origin_value[i] == this.value) {
                            hasItem = true;
                        }
                    }

                    if (checked) {
                        if (!hasItem) origin_value.push(this.value);
                    }
                    else {
                        i = origin_value.length;
                        while (i--) {
                            if (origin_value[i] == this.value) {
                                //hasItemIndex = i;
                            }
                            else {
                                new_value.push(origin_value[i]);
                            }
                        }
                        origin_value = new_value;
                    }
                }
                else {
                    origin_value = (this.checked) ? this.value : "";
                }

                (Function("val", "this." + data_path + " = val;")).call(_this.model, origin_value);
                _this.change(data_path, {
                    el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: origin_value
                });
            }
            else {
                if (setAllow) {
                    (Function("val", "this." + data_path + " = val;")).call(_this.model, this.value);
                    _this.change(data_path, {
                        el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: this.value
                    });
                }
            }

            dom.data("changedTime", (new Date()).getTime());
        });
        this.view_target.find('[data-ax-path]').unbind("blur.axbinder").bind("blur.axbinder", function (e) {
            var dom = $(e.target);
            if (typeof dom.data("changedTime") == "undefined" || dom.data("changedTime") < (new Date()).getTime() - 10) dom.trigger("change");
        });

        //_this.tmpl
        var callBack;
        for (var tk in _this.tmpl) {
            for (var ix in _this.tmpl[tk]) {
                // console.log(_this.tmpl[tk][ix].content);
                this.print_tmpl(tk, _this.tmpl[tk][ix], "isInit");
            }

            if (callBack = this.update_trigger[tk]) {
                var that = {
                    repeat_path: tk,
                    tmpl: _this.tmpl[tk],
                    list: (Function("", "return this." + tk + ";")).call(this.model)
                };
                callBack.call(that, that);
            }
        }
    };

    klass.prototype.set_els_value = function (el, tagname, type, value, data_path, callChange) {
        if (typeof value === "undefined") value = [];
        else value = [].concat(value);
        var options, i;

        if (tagname == "input") {
            if (type == "checkbox" || type == "radio") {
                i = value.length;
                var checked = false;
                if (i > 0) {
                    while (i--) {
                        if (typeof value[i] !== "undefined" && el.value === value[i].toString()) {
                            checked = true;
                        }
                    }
                }
                el.checked = checked;
            }
            else {
                el.value = value.join('');
            }
        }
        else if (tagname == "select") {
            options = el.options, i = options.length;
            var vi, option_matched = false;

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
                    (Function("val", "this." + data_path + " = val;")).call(this.model, options[0].value);
                }
                else {
                    (Function("val", "this." + data_path + " = val;")).call(this.model, "");
                }
            }

            if (window.AXSelect) { // AXISJ 사용가능
                $(typeof value !== "undefined" && el).bindSelectSetValue(value[value.length - 1]);
            }
        }
        else if (tagname == "textarea") {
            el.value = value.join('') || "";
        }
        else {
            if (el.innerText) {
                el.innerText = value.join("");
            }
            else {
                el.innerHTML = value.join("");
            }
        }

        if (callChange) {
            this.change(data_path, {el: el, tagname: tagname, value: value});
        }
        return this;
    };

    klass.prototype.set = function (data_path, value) {
        var _this = this, obj_type, i, this_type = (this.type || "").toLowerCase();
        (Function("val", "this." + data_path + " = val;")).call(this.model, value);
        obj_type = get_type(value);

        if (obj_type == "object") {
            for (var k in value) {
                this.set(data_path + "." + k, value[k]);
            }
        }
        else if (obj_type == "array") {
            this.view_target.find('[data-ax-path="' + data_path + '"]').each(function () {
                if (this_type == "checkbox" || this_type == "radio")
                    _this.set_els_value(this, this.tagName.toLowerCase(), this_type, value, data_path, "change");
            });
            i = value.length;
            while (i--) {
                this.set(data_path + "[" + i + "]", value[i]);
            }
        }
        else {
            // apply data value to els
            this.view_target.find('[data-ax-path="' + data_path + '"]').each(function () {
                _this.set_els_value(this, this.tagName.toLowerCase(), this_type, value, data_path, "change");
            });
        }
        return this;
    };

    klass.prototype.get = function (data_path) {
        if (typeof data_path == "undefined") {

            return this.model;
        }
        else {
            return (Function("", "return this." + data_path + ";")).call(this.model);
        }

    };

    klass.prototype.onchange = function (data_path, callBack) {
        this.change_trigger[data_path || "*"] = callBack;
        return this;
    };

    klass.prototype.change = function (data_path, that) {
        var callBack = this.change_trigger[data_path];
        if (callBack) {
            callBack.call(that, that);
        }
        if (data_path != "*" && this.change_trigger["*"]) {
            this.change_trigger["*"].call(that, that);
        }
    };

    klass.prototype.onclick = function (data_path, callBack) {
        this.click_trigger[data_path] = callBack;
        return this;
    };

    klass.prototype.click = function (data_path, that) {
        var callBack = this.click_trigger[data_path];
        if (callBack) {
            callBack.call(that, that);
        }
    };

    klass.prototype.sync_model = function () {

    };

    klass.prototype.onupdate = function (data_path, callBack) {
        this.update_trigger[data_path] = callBack;
        return this;
    };

    klass.prototype.print_tmpl = function (data_path, tmpl, isInit) {
        var list = (Function("", "return this." + data_path + ";")).call(this.model);
        if (list && get_type(list) == "array") {
            for (var i = 0, l = list.length; i < l; i++) {
                var item = list[i];
                if (jQuery.isPlainObject(item)) {
                    item['@i'] = i;
                    item['@r'] = i;
                    if (i === 0) item['@first'] = true;
                }
                else {
                    item = {
                        "@i": i,
                        "@value": item
                    };
                    if (i === 0) item['@first'] = true;
                    console.log(item);
                }
                
                if (!item.__DELETED__) {
                    var fragdom = $(Mustache.render(tmpl.content, item));
                    fragdom.attr("data-ax-repeat-path", data_path);
                    fragdom.attr("data-ax-repeat-i", item['@i']);
                    this.bind_event_tmpl(fragdom, data_path);
                    tmpl.container.append(fragdom);
                }
            }
        }
    };

    klass.prototype.bind_event_tmpl = function (target, data_path) {
        var _this = this, index = target.attr("data-ax-repeat-i");
        var list = (Function("", "return this." + data_path + ";")).call(this.model);

        target.find('[data-ax-repeat-click]').unbind("click.axbinder").bind("click.axbinder", function (e) {
            var target = axf.get_event_target(e.target, function (el) {
                return el.getAttribute("data-ax-repeat-click");
            });
            if (target) {
                var dom = $(target), value = dom.attr("data-ax-repeat-click"), repeat_path = dom.attr("data-ax-repeat-path");

                var that = {
                    el: target,
                    jquery: dom,
                    tagname: target.tagName.toLowerCase(),
                    value: value,
                    repeat_path: data_path,
                    item: list[index],
                    item_index: index,
                    item_path: data_path + "[" + index + "]"
                };
                _this.click(data_path, that);
            }
        });

        // apply data value to els
        target.find('[data-ax-item-path]').each(function () {
            var
                dom = $(this),
                item_path = dom.attr("data-ax-item-path"),
                mix_path = get_mix_path(data_path, index, item_path),
                val,
                this_type = (this.type || "").toLowerCase();

            try {
                val = (Function("", "return this." + mix_path + ";")).call(_this.model);
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
        target.find('[data-ax-item-path]').unbind("change.axbinder").bind("change.axbinder", function (e) {
            var
                i,
                hasItem = false,
                checked,
                new_value = [],
                this_type = (this.type || "").toLowerCase(),
                dom = $(e.target),
                item_path = dom.attr("data-ax-item-path"),
                mix_path = get_mix_path(data_path, index, item_path),
                origin_value = (Function("", "return this." + mix_path + ";")).call(_this.model),
                value_type = get_type(origin_value),
                setAllow = true
                ;

            if (value_type == "object" || value_type == "array") {
                setAllow = false;
            }

            if (this_type == "checkbox") {
                if (target.find('[data-ax-item-path="' + item_path + '"]').length > 1) {
                    if (get_type(origin_value) != "array") {
                        if (typeof origin_value === "undefined" || origin_value == "") origin_value = [];
                        else origin_value = [].concat(origin_value);
                    }
                    i = origin_value.length, hasItem = false, checked = this.checked;
                    while (i--) {
                        if (origin_value[i] == this.value) {
                            hasItem = true;
                        }
                    }

                    if (checked) {
                        if (!hasItem) origin_value.push(this.value);
                    }
                    else {
                        i = origin_value.length;
                        while (i--) {
                            if (origin_value[i] == this.value) {
                                //hasItemIndex = i;
                            }
                            else {
                                new_value.push(origin_value[i]);
                            }
                        }
                        origin_value = new_value;
                    }
                }
                else {
                    origin_value = (this.checked) ? this.value : "";
                }

                (Function("val", "this." + mix_path + " = val;")).call(_this.model, origin_value);
                _this.change(mix_path, {
                    el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: origin_value
                });
            }
            else {
                if (setAllow) {
                    (Function("val", "this." + mix_path + " = val;")).call(_this.model, this.value);
                    _this.change(mix_path, {
                        el: this, jquery: dom, tagname: this.tagName.toLowerCase(), value: this.value
                    });
                }
            }

            dom.data("changedTime", (new Date()).getTime());
        });
        target.find('[data-ax-item-path]').unbind("blur.axbinder").bind("blur.axbinder", function (e) {
            var dom = $(e.target);
            if (typeof dom.data("changedTime") == "undefined" || dom.data("changedTime") < (new Date()).getTime() - 10) dom.trigger("change");
        });
    };

    klass.prototype.add = function (data_path, item) {
        var list = (Function("", "return this." + data_path + ";")).call(this.model);
        var tmpl = this.tmpl[data_path];
        item['@i'] = list.length;
        item['@r'] = list.length;
        item.__ADDED__ = true;
        (Function("val", "this." + data_path + ".push(val);")).call(this.model, item);

        // 다중 템플릿 처리
        for (var t in tmpl) {
            var fragdom = $(Mustache.render(tmpl[t].content, item));
            fragdom.attr("data-ax-repeat-path", data_path);
            fragdom.attr("data-ax-repeat-i", item['@i']);
            this.bind_event_tmpl(fragdom, data_path);
            tmpl[t].container.append(fragdom);
        }

        this.change("*");

        var callBack = this.update_trigger[data_path];
        if (callBack) {
            var that = {
                repeat_path: data_path,
                tmpl: tmpl,
                list: list
            };
            callBack.call(that, that);
        }

        return this;
    };

    klass.prototype.remove = function (data_path, index) {
        var list = (Function("", "return this." + data_path + ";")).call(this.model);
        var tmpl = this.tmpl[data_path];
        if (typeof index == "undefined") index = list.length - 1;
        var remove_item = list[index];
        if (remove_item.__ADDED__) {
            list.splice(index, 1);
        }
        else {
            list[index].__DELETED__ = true;
        }

        for (var t in tmpl) {
            tmpl[t].container.empty();
            this.print_tmpl(data_path, tmpl[t]);
        }

        this.change("*");

        var callBack = this.update_trigger[data_path];
        if (callBack) {
            var that = {
                repeat_path: data_path,
                tmpl: tmpl,
                list: list
            };
            callBack.call(that, that);
        }

        return this;
    };

    klass.prototype.update = function (data_path, index, item) {
        var list = (Function("", "return this." + data_path + ";")).call(this.model);
        var tmpl = this.tmpl[data_path];
        if (typeof index != "undefined" && item) list.splice(index, 1, item);

        for (var t in tmpl) {
            tmpl[t].container.empty();
            this.print_tmpl(data_path, tmpl[t]);
        }

        this.change("*");

        var callBack = this.update_trigger[data_path];
        if (callBack) {
            var that = {
                repeat_path: data_path,
                tmpl: tmpl,
                list: list
            };
            callBack.call(that, that);
        }

        return this;
    };

    klass.prototype.child_add = function (data_path, index, child_path, child_item) {
        var _list = (Function("", "return this." + data_path + ";")).call(this.model);
        var list = (Function("", "return this." + data_path + "[" + index + "]." + child_path + ";")).call(this.model);
        child_item.__ADDED__ = true;
        list.push(child_item);
        this.update(data_path, index, _list[index]);
    };

    klass.prototype.child_remove = function (data_path, index, child_path, child_index) {
        var _list = (Function("", "return this." + data_path + ";")).call(this.model);
        var list = (Function("", "return this." + data_path + "[" + index + "]." + child_path + ";")).call(this.model);
        var remove_item = list[child_index];
        if (remove_item.__ADDED__) {
            list.splice(child_index, 1);
        }
        else {
            list[child_index].__DELETED__ = true;
        }
        this.update(data_path, index, _list[index]);
    };

    klass.prototype.child_update = function (data_path, index, child_path, child_index, child_item) {
        var _list = (Function("", "return this." + data_path + ";")).call(this.model);
        var list = (Function("", "return this." + data_path + "[" + index + "]." + child_path + ";")).call(this.model);
        list[child_index] = child_item;
        this.update(data_path, index, _list[index]);
    };

    klass.prototype.child_set = function (data_path, index, child_path, value) {
        var _this = this, i;
        (Function("val", "this." + data_path + "[" + index + "]." + child_path + " = val;")).call(this.model, value);

        // apply data value to els
        this.view_target.find('[data-ax-repeat="' + data_path + '"]').find('[data-ax-repeat-i="' + index + '"]').find('[data-ax-item-path="' + child_path + '"]').each(function () {
            _this.set_els_value(this, this.tagName.toLowerCase(), (this.type || "").toLowerCase(), value, data_path + "[" + index + "]." + child_path);
        });
        return this;
    };

    klass.prototype.focus = function (data_path) {
        this.view_target.find('[data-ax-path="' + data_path + '"]').focus();
        //this.view_target.find('[data-ax-item-path="' + data_path + '"]').focus();
    };

    klass.prototype.validate = function () {
        var _this = this;
        var errors = [];
        this.view_target.find('[data-ax-path]').each(function () {
            var dom = $(this), data_path = dom.attr("data-ax-path"), is_validate = dom.attr("data-ax-validate");

            if (is_validate) {
                var val = (Function("", "return this." + data_path + ";")).call(_this.model);
                if (typeof val === "undefined") val = "";
                var _val = val.toString();

                var is_error = false;
                if (is_validate == "required" && _val.trim() == "") {
                    is_error = true;
                }
                else if (!(/\D.?/g).test(is_validate) && _val.trim().length < is_validate.number()) {
                    is_error = true;
                }

                if (is_error) {
                    errors.push({
                        type: is_validate,
                        data_path: data_path,
                        el: this,
                        jquery: dom,
                        value: val
                    });
                }
            }
        });
        this.view_target.find('[data-ax-repeat-path]').each(function () {

            var dom = $(this),
                data_path = dom.attr("data-ax-repeat-path"),
                repeat_idx = dom.attr("data-ax-repeat-i");

            dom.find('[data-ax-validate]').each(function () {
                var dom = $(this), is_validate = dom.attr("data-ax-validate"), item_path = dom.attr("data-ax-item-path");
                var val = (Function("", "return this." + data_path + "[" + repeat_idx + "]." + item_path + ";")).call(_this.model);
                if (is_validate) {
                    var is_error = false;
                    if (is_validate == "required" && val.trim() == "") {
                        is_error = true;
                    }
                    else if (!(/\D.?/g).test(is_validate) && val.trim().length < is_validate.number()) {
                        is_error = true;
                    }

                    if (is_error) {
                        errors.push({
                            type: is_validate,
                            data_path: data_path,
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
            }
        }
        else {
            return {};
        }

    };

    return klass;
})();