AXConfig.AXGrid.emptyListMSG = "검색된 목록이 없습니다.";
AXConfig.AXGrid.headTdHeight = 26;
AXConfig.AXGrid.fitToWidthRightMargin = -1;

String.prototype.dec = function () {
    return decodeURIComponent(this);
};

$.getDocScrollHeight = function () {
    return $("#AXPage").height();
};

$.getDocHeight = function () {
    return $(document.body).height();
};

var
    app = {
        page_size: 50,

        ajax_queue: [],
        ajax: function (http, callBack, nomask, typ) {
            if (!nomask) loading_mask.open();
            app.ajax_queue.push("1");
            var jqxhr, opts = {
                contentType: 'application/json'
            };
            http.url = CONTEXT_PATH + http.url;
            $.extend(http, opts);
            jqxhr = $.ajax(http);
            jqxhr
                .done(function (data, textStatus, jqXHR) {
                    if (typeof data == "string") arguments[0] = (data == "") ? {} : (data).object();
                    if (data.redirect && typ != "islogin") {
                        location.href = data.redirect;
                        return;
                    }
                    /*
                     if(arguments[0].result == "syntaxerr" && typ != "islogin"){
                     location.href = "/jsp/login.jsp";
                     return;
                     }
                     */

                    //console.log("success");
                    //전체에 대한 중앙 제어가 필요할 때
                    var args = [].concat($.makeArray(arguments));
                    if (callBack) callBack.apply(this, args); // callBack
                })
                .fail(function (data, textStatus, msg) {
                    //console.log(arguments);
                    /*
                     if(textStatus == "error" && typ != "islogin"){
                     location.href = "/jsp/login.jsp";
                     return;
                     }
                     */

                    //if(data.readyState == 0 || data.status == 0){
                    if (msg == "") {

                    }
                    else {
                        if (callBack) callBack.apply(this, [{
                            error: {message: msg}
                        }]); // callBack
                    }
                })
                .always(function (data, textStatus, jqXHR) {
                    app.ajax_queue.pop();
                    if (!nomask) if (app.ajax_queue.length == 0) loading_mask.close(300);
                });
        },

        net: {
            ajax: function (callData, successHandler) {
                app.ajax(callData, function (res) {
                    if (res && res.error) {
                        alert(res.error.message);
                    }
                    else {
                        successHandler(res);
                    }
                });
            }
        },

        arrayutil: {
            mergeArray: function (arr1, arr2, prefix) {
                prefix = (prefix || '_');
                var result = [];
                for (var i = 0; i < arr1.length; i++) {
                    var o = {};
                    for (var key in arr1[i]) {
                        if (arr1[i].hasOwnProperty(key)) {
                            o[key] = arr1[i][key];
                        }
                    }
                    result.push(o);
                }
                for (var i = 0; i < result.length; i++) {
                    var currArr1Row = result[i];
                    for (var key in arr2[i]) {
                        if (arr2[i].hasOwnProperty(key)) {
                            currArr1Row[prefix + key] = arr2[i][key];
                        }
                    }
                }
                return result;
            }
        },

        dateutil: {
            // pad 함수. 예) 4를 04로 5를 05로 13은 그대로 13으로 만들어준다
            pad: function (n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            },
            // 주어진 date를 1982-08-24 형식의 dateString을 만들어준다
            getICNStyleDateString: function (date) {
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();
                return yyyy + "-" + this.pad(mm, 2) + "-" + this.pad(dd, 2);
            },
            // 특정월의 첫 날을 구한다
            getFirstDateOfDate: function (date) {
                return new Date(date.getFullYear(), date.getMonth(), 1);
            },
            getFirstDateStringOfDate: function (date) {
                return this.getICNStyleDateString(this.getFirstDateOfDate(date));
            },
            // 특정월의 마지막 날을 구한다
            getLastDateOfDate: function (date) {
                return new Date(date.getFullYear(), date.getMonth() + 1, 0)
            },
            getLastDateStringOfDate: function (date) {
                return this.getICNStyleDateString(this.getLastDateOfDate(date));
            },
            // 특정일이 속한 week의 첫날(일요일)을 얻는다
            getFirstDateOfWeek: function (d) {
                d = new Date(d);
                var day = d.getDay();
                var diff = d.getDate() - day; // adjust when day is sunday
                return new Date(d.setDate(diff));
            },
            // 특정일이 속한 week의 마지막날(토요일)을 얻는다
            getLastDateOfWeek: function (d) {
                d = new Date(d);
                var day = d.getDay();
                var diff = d.getDate() - day + 6; // adjust when day is sunday
                return new Date(d.setDate(diff));
            }
        },

        dateObj: {
            dummy: (function () {
                var d = new Date();
                return ("U" + d.getUTCHours() + d.getUTCMinutes() + d.getUTCSeconds() + d.getUTCMilliseconds());
            })(),
            today: new Date(),
            returnDate: function (position, separ) {
                if (position == "YY") {
                }
            },
            numberToString: function (n, digits) {
                var zero = "";
                var tmDate = n.toString();

                if (tmDate.length < digits) {
                    for (var i = 1; i < digits; i++)
                        zero += "0";
                }
                return zero + tmDate;
            },
            getDateY: function (moveTo, num) {
                if (moveTo == "next")
                    return this.numberToString(this.today.getFullYear() + num, 4);
                else if (moveTo == "prev")
                    return this.numberToString(this.today.getFullYear() - num, 4);
                else
                    return this.numberToString(this.today.getFullYear(), 4);
            },
            getDateM: function (moveTo, num) {
                if (moveTo == "next")
                    return this.numberToString(this.today.getMonth() + num + 1, 2);
                else if (moveTo == "prev")
                    return this.numberToString(this.today.getMonth() - num + 1, 2);
                else
                    return this.numberToString(this.today.getMonth() + 1, 2);
            },
            getDateD: function (moveTo, num) {
                if (moveTo == "next")
                    return this.numberToString(this.today.getDate() + num, 2);
                else if (moveTo == "prev")
                    return this.numberToString(this.today.getDate() - num, 2);
                else
                    return this.numberToString(this.today.getDate(), 2);
            },
            nowDate: function (reType, separ) {
                var bsepar = "-"
                if (separ != undefined) bsepar = separ;

                if (reType != undefined) {
                    if (reType == "Y") return this.getDateY();
                    else if (reType == "M") return this.getDateY() + bsepar + this.getDateM();
                    else return this.getDateY() + bsepar + this.getDateM() + bsepar + this.getDateD();
                }
                else {
                    return this.getDateY() + bsepar + this.getDateM() + bsepar + this.getDateD();
                }
            },
            stDate: function (separ) {
                var bsepar = "-"
                if (separ != undefined) bsepar = separ;

                return this.getDateY() + bsepar + this.getDateM() + bsepar + "01";
            },
            edDate: function (separ) {
                var bsepar = "-"
                if (separ != undefined) bsepar = separ;

                var endDay = new Date(new Date(this.getDateY(), this.getDateM(), 1) - 86400000).getDate();

                return this.getDateY() + bsepar + this.getDateM() + bsepar + endDay;
            },
            nextDate: function (reType, setObj, separ) {
                var sType = "D";
                var iNum = 0;
                var sdata = "";
                var dataTm = "";
                var sSepar = "-";

                if (setObj != undefined && setObj.type != undefined) {
                    sType = setObj.type;
                }

                if (setObj != undefined && setObj.num != undefined) {
                    iNum = setObj.num;
                }

                if (separ != undefined) {
                    sSepar = separ;
                }

                if (sType == "Y") {
                    dataTm = this.getDateY("next", iNum) + sSepar + this.getDateM() + sSepar + this.getDateD();
                }
                else if (sType == "M") {
                    dataTm = this.getDateY() + sSepar + this.getDateM("next", iNum) + sSepar + this.getDateD();
                }
                else if (sType == "D") {
                    dataTm = this.getDateY() + sSepar + this.getDateM() + sSepar + this.getDateD("next", iNum);
                }

                if (reType == "Y")
                    sdata = dataTm.substr(0, 4);
                else if (reType == "M") {
                    sdata = dataTm.substr(0, 7);
                }
                else
                    sdata = dataTm;
                return sdata;
            },
            prevDate: function (reType, setObj, separ) {
                var sType = "D";
                var iNum = 0;
                var sdata = "";
                var dataTm = "";
                var sSepar = "-";

                if (setObj.type != undefined) {
                    sType = setObj.type;
                }
                if (setObj.num != undefined) {
                    iNum = setObj.num;
                }

                if (separ != undefined) {
                    sSepar = separ;
                }

                if (sType == "Y") {
                    dataTm = this.getDateY("prev", iNum) + sSepar + this.getDateM() + sSepar + this.getDateD();
                }
                else if (sType == "M") {
                    dataTm = this.getDateY() + sSepar + this.getDateM("prev", iNum) + sSepar + this.getDateD();
                }
                else if (sType == "D") {
                    dataTm = this.getDateY() + sSepar + this.getDateM() + sSepar + this.getDateD("prev", iNum);
                }

                if (reType == "Y")
                    sdata = dataTm.substr(0, 4);
                else if (reType == "M") {
                    sdata = dataTm.substr(0, 7);
                }
                else
                    sdata = dataTm;

                return sdata;
            },
            //2011.07.27 라천호 moveDate추가 prevDate와 nextDate를 숫자로 판단해서 분기 시켜줌
            moveDate: function (reType, setObj, separ) {
                var iNum = 0;
                if (setObj.num != undefined) {
                    iNum = setObj.num;
                }

                if (iNum < 0) {
                    iNum = Math.abs(iNum)
                    setObj.num = iNum;
                    return this.prevDate(reType, setObj, separ);
                }
                else {
                    return this.nextDate(reType, setObj, separ);
                }
            }
        },

        excel_uploaded: function () {
            window.location.reload();
        }
    };

app.modal = {
    target: new AXModal(),
    bind: function () {
        window.myModal = this.target;
        this.target.setConfig({
            windowID: "app-modal-container",
            mediaQuery: {
                mx: {min: 0, max: 767}, dx: {min: 767}
            },
            displayLoading: true
        });
    },
    open: function (http, opts) {
        this.target.open({
            url: CONTEXT_PATH + http.url,
            pars: (typeof http.pars == "string") ? http.pars.queryToObject() : http.pars,
            top: ( (typeof http.top == "undefined") ? axdom(window).scrollTop() + 30 : http.top ),
            width: ( (typeof http.width == "undefined") ? 900 : http.width ),
            closeByEscKey: true
        });
    },
    save: function (callBackName) {
        var _window = parent || opener || window;
        var fn = eval("_window." + callBackName);
        var args = $.makeArray(arguments);
        args.shift();
        fn.apply(null, args);
    },
    cancel: function () {
        parent.myModal.close();
    },
    resize: function () {
        parent.myModal.resize();
    },
    close: function () {
        myModal.close();
    },
    excel: function (http) {
        app.modal.open({
            url: '/jsp/common/excel-modal.jsp',
            pars: "callBack=app.excel_uploaded" + ((http.pars) ? "&" + http.pars : ""),
            width: 500
        });
    }
};

app.form = {
    clearForm: function ($form, includeDisabled) {
        includeDisabled = (includeDisabled || false);
        var o = this.serializeObjWithIds($form, includeDisabled);
        for (var key in o) {
            this.axisjVal($form.find('#' + key), '');
        }
    },

    fillForm: function ($form, data, prefix) {
        prefix = (prefix || '');
        this.clearForm($form);
        for (var key in data) {
            var value = data[key],
                field = $form.find('#' + prefix + key);

            this.axisjVal(field, value);
        }
    },

    serializeFormJSON: function ($form) {
        var o = {};
        var a = $form.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            }
            else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    },

    serializeObjectWithIds: function ($form, prefix, includeDisabled) {
        return this.serializeObjWithIds($form, includeDisabled, prefix);
    },

    serializeObjWithIds: function ($form, includeDisabled, prefix) {
        var rCRLF = /\r?\n/g,
            rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
            rsubmittable = /^(?:input|select|textarea|keygen)/i,
            manipulation_rcheckableType = /^(?:checkbox|radio)$/i;
        prefix = (prefix || '');

        var arr = $form.map(function () {
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            })
            .filter(function () {
                var type = this.type;
                var use = (includeDisabled) ? true : (jQuery(this).is(":disabled") ? false : true);
                return jQuery(this).attr('id') && use &&
                    rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
                    ( this.checked || !manipulation_rcheckableType.test(type) );
            })
            .map(function (i, elem) {
                var val = jQuery(this).val();

                return val == null ?
                    null :
                    jQuery.isArray(val) ?
                        jQuery.map(val, function (val) {
                            return {key: jQuery(elem).attr('id'), value: val.replace(rCRLF, "\r\n")};
                        }) :
                    {key: jQuery(elem).attr('id'), value: val.replace(rCRLF, "\r\n")};
            }).get();

        var i = arr.length,
            result = {};
        while (i--) {
            var e = arr[i],
                key = e.key,
                val = e.value;
            if (prefix && key.indexOf(prefix) == 0) {
                key = key.substring(prefix.length);
            }
            result[key] = val;
        }

        return result;
    },
    axisjVal: function ($field, value) {
        $field.val(value);
        if ($field.data('axbind') == "pattern") {
            // axisj pattern이 적용된 input의 경우 pattern이 적용되도록 set val 한다
            $field.bindPatternSetText(value);
        }
        else if ($field.attr("data-axbind") == "select") {
            if (this._hasValueInOptions($field, value)) {
                $field.bindSelectSetValue(value);
            }
            else {
                var defaultValue = $field.data('default-value');
                var foundDefaultValueInOption = this._hasValueInOptions($field, defaultValue);
                var hasOption = this._hasOption($field);
                if (defaultValue && foundDefaultValueInOption) {
                    $field.bindSelectSetValue(defaultValue);
                }
                else if (defaultValue && !foundDefaultValueInOption && hasOption) {
                    $field.bindSelectSetValue($field[0].options[0].value);
                }
                else if (hasOption) {
                    $field.bindSelectSetValue($field[0].options[0].value);
                }
            }

            if ($field.data('be-disabled') == 'Y') {
                $field.bindSelectDisabled(true);
            }
        }
        else if ($field.attr("data-axbind") == "switch") {
            $field.setValueInput(value);
        }
        else if ($field.attr("data-axbind") == "money") {
            $field.val(value.money());
        }
        else if ($field.attr("data-axbind") == "date") {
            $field.val(value.date().print());
        }
    },
    _hasOption: function ($field) {
        var sel = $field[0];
        return ( sel.options && sel.options.length > 0 );
    },
    _hasValueInOptions: function ($field, value) {
        if (!this._hasOption($field)) {
            return false;
        }

        var options = $field[0].options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].value == value) {
                return true;
            }
        }
        return false;
    }
};

app.iframe = {
    callBack: function (callBackName) {
        var _window = parent || opener || window;
        try {
            var fn = eval("_window." + callBackName);
            var args = $.makeArray(arguments);
            args.shift();
            fn.apply(null, args);
        } catch (e) {
        }
    },
    resize: function () {

        function getHeight() {
            return $(".iframe").outerHeight().number() + 30;
        }

        app.iframe.callBack(window.callBack, window.frameId, getHeight());

        $(window).resize(function () {
            app.iframe.callBack(window.callBack, window.frameId, getHeight());
            setTimeout(function () {
                app.iframe.callBack(window.callBack, window.frameId, getHeight());
            }, 300);
        });
    },
    onFrameLoad: function (frameId, height) {
        $("#" + frameId).css({height: height});

    }
};

app.tmpl = {
    store: {},
    collect: function ($target) {
        $target.find('[data-axboot-tmpl]').each(function () {
            app.tmpl.store[this.getAttribute("data-axboot-tmpl")] = this.innerHTML;
        });
    },
    extendFn: function (obj) {
        obj.f_money = function () {
            return function (text, render) {
                return ax5.util.number(render(text), {money: true});
            }
        };
        obj.f_date = function () {
            return function (text, render) {
                return ax5.util.date(render(text), {"return": "yyyy.mm.dd"});
            }
        };
        obj.f_crlf = function () {
            return function (text, render) {
                return render(text).replace(/\r?\n/g, "<br/>")
            }
        };
        obj.f_bankNum = function () {
            return function (text, render) {
                var _num = render(text).trim().split(''), _s = [],
                    patterns = "000-00-00000-0".split('');

                patterns.forEach(function (p, pi) {
                    if (p == "-") _s.push("-");
                    else _s.push(_num.shift());
                });
                _s = _s.concat(_num);

                return _s.join('');
            }
        };
        return obj;
    },
    render: function (options) {
        if (!options.tmpl) {
            options.tmpl = this.store[options.tmplId];
        }
        if (options.$target) {
            return options.$target.html(Mustache.render(options.tmpl, app.tmpl.extendFn(options.data)));
        }
        else {
            return Mustache.render(options.tmpl, app.tmpl.extendFn(options.data));
        }
    }
};

app.model = {
    commonFilter: function (key) {
        return (key == "insDt") || key == "uptDt";
    },
    filter: function (model, filterFn) {
        for (var k in model) {
            if (filterFn(k)) {
                delete model[k];
            }
        }
        return model;
    }
};

app.grid = {
    foot_sum: function (list, key, sum, rd) {
        sum = 0;
        for (var i = 0, l = list.length; i < l; i++) {
            sum += Number(list[i][key] || 0);
        }
        if (rd) {
            return sum.round(rd).money();
        }
        return sum.money();
    },
    sub_total_sum: function (list, subTotal, key, sum, rd) {
        sum = 0;
        for (var i = subTotal.st_idx, l = subTotal.ed_idx + 1; i < l; i++) {
            sum += Number(list[i][key] || 0);
        }
        if (rd) {
            return sum.round(rd).money();
        }
        return sum.money();
    },
    contextMenu: function (target, pid, extMenu) {
        var menu = {
            theme: "AXContextMenu", // 선택항목
            width: "130", // 선택항목
            menu: [
                {
                    userType: 1,
                    label: '<i class="axi axi-download"></i> 그리드 엑셀다운로드',
                    className: "",
                    onclick: function () {
                        if (!axf.getId("ax-grid-excel-form")) {
                            var po = [];
                            po.push('<form name="ax-grid-excel-form" id="ax-grid-excel-form" method="post" action="/api/v1/excel/grid/download" target="ax-grid-excel-form-frame">');
                            po.push('<input type="hidden" name="excelHtml" value="" />');
                            po.push('<input type="hidden" name="fileName" value="" />');
                            po.push('</form>');
                            po.push('<iframe src="javascript:false;" name="ax-grid-excel-form-frame" style="display:none;"></iframe>');
                            $(document.body).append(po.join(''));
                        }
                        document["ax-grid-excel-form"].excelHtml.value = target.getExcelFormat('html');
                        document["ax-grid-excel-form"].fileName.value = pid;
                        document["ax-grid-excel-form"].submit();
                    }
                }
            ]
        };
        if (extMenu) {
            for (var i = 0; i < extMenu.length; i++) {
                menu.menu.push(
                    extMenu[i].jsCode
                );
            }
        }
        return menu;
    }
};

app.builder = {
    grid: {
        build: function (obj, config) {
            var $obj = $obj = obj.target = new AXGrid();

            if (config.pageId) {
                config.contextMenu = app.grid.contextMenu(obj.target, config.pageId);
            }

            var defaultConfig = {
                theme: "AXGrid",
                page: {
                    display: true,
                    paging: false
                },
                colHeadAlign: "center"
            };
            $obj.setConfig($.extend(defaultConfig, config));
        },
        cols: {
            No: {
                label: "순번", width: 50,
                formatter: function () {
                    return this.index + 1;
                }
            },
            checkbox: {
                width: 30,
                formatter: "checkbox",
                disabled: function () {
                    return this.item._CUD != "C";
                }
            },
            commuteDt: {
                label: "일시", width: 120,
                formatter: function () {
                    return this.value.date().print();
                }
            },
            workerNm: {label: "직원명", width: 120},
            checkInTm: {label: "출근시간", width: 120},
            checkOutTm: {label: "퇴근시간", width: 120},
            workHours: {label: "근무시간", width: 120},
            scheduleDesc: {label: "일정", width: 120},
            insDt: {label: "등록일", width: "140"},
            updDt: {label: "수정일", width: "140"},
            insUserNm: {label: "등록자", width: "80"},
            uptUserNm: {label: "수정자", width: "80"}
        },
        col: {
            build: function (key, options) {
                if (typeof key == "string") {
                    var defItem = {width: 80, align: "center"},
                        item = {},
                        result = {},
                        options = options || {}
                        ;

                    item = $.extend(defItem, (app.builder.grid.cols[key]) || {label: key + "?"});
                    result = $.extend(true, {key: key}, item, options);
                    return result;
                }
                else {
                    var cols = [];

                    for (var k in key) {
                        var defItem = {width: 80, align: "center"},
                            item = {}
                            ;

                        item = $.extend(defItem, (app.builder.grid.cols[k]) || {});

                        item = $.extend(true, {key: k}, item, key[k]);

                        if (!item.label) {
                            item.label = k;
                            if (!item.formatter) {
                                item.formatter = (function (k) {
                                    return function () {
                                        return this.item.jsonData[k];
                                    }
                                })(k);
                            }
                        }

                        cols.push(item);
                    }

                    return cols;
                }
            }
        },
        formatter: {
            subTotalDisplay: function (subTotal, sepCd, sepNm) {
                return function () {
                    // display 여부 확인
                    subTotal.pitem = this.item[sepCd];
                    subTotal.pitemNm = this.item[sepNm];
                    subTotal.nitem = null;
                    if (this.list.length - 1 > this.index) {
                        subTotal.nitem = this.list[this.index.number() + 1][sepCd];
                    }

                    // 값 저장
                    if (subTotal.pitem != subTotal.nitem) {
                        if (!subTotal[subTotal.pitem]) subTotal[subTotal.pitem] = {st_idx: 0};
                        subTotal[subTotal.pitem].ed_idx = this.index;
                        subTotal[subTotal.pitem].label = '<b>' + subTotal.pitemNm + '</b> 소계';
                        subTotal[subTotal.nitem] = {st_idx: this.index + 1};
                        return true;
                    }
                    else {
                        if (!subTotal[subTotal.pitem]) subTotal[subTotal.pitem] = {st_idx: 0};
                        subTotal[subTotal.pitem].ed_idx = this.index;
                    }
                }
            },
            getSubTotalTitle: function (subTotal, sepCd) {
                return function () {
                    return subTotal[this.item[sepCd]].label;
                }
            },
            moneySubTotalFormatter: function (subTotal, sepCd, dividend, divisor, moneyUnit) {
                return function () {
                    var dividendNum = app.grid.sub_total_sum(this.list, subTotal[this.item[sepCd]], dividend).number();
                    var divisorNum = divisor;
                    if (isNaN(divisor)) {
                        divisorNum = app.grid.sub_total_sum(this.list, subTotal[this.item[sepCd]], divisor).number();
                    }

                    return dividendNum.div(moneyUnit.number()).div(divisorNum).round().money();
                }
            },
            custSubTotalFormatter: function (subTotal, sepCd, compOne, compTwo) {
                return function () {
                    var dividend = app.grid.sub_total_sum(this.list, subTotal[this.item[sepCd]], compOne).number();
                    var divisor = app.grid.sub_total_sum(this.list, subTotal[this.item[sepCd]], compTwo).number();
                    var diffTimesHund = (dividend - divisor) * 100.0;

                    if (divisor == 0) {
                        return "-";
                    }

                    return diffTimesHund.div(divisor).round(2);
                }
            },
            rateFormatter: function (classA, classB, classC) {
                return function () {
                    var aggRatio = this.item.aggRatio.round(2);
                    if (aggRatio <= classA) {
                        return "A";
                    }
                    else if (aggRatio <= classB) {
                        return "B";
                    }
                    else if (aggRatio <= classC) {
                        return "C";
                    }
                    return "-";
                }
            },
            moneyFormatter: function (dividend, divisor, moneyUnit) {
                if (arguments.length == 1) {
                    moneyUnit = dividend;
                    return function () {
                        return Number(this.item[this.key]).div(moneyUnit.number()).round().money();
                    }
                }
                else {
                    return function () {
                        var divisorNum = divisor;
                        if (isNaN(divisor)) {
                            divisorNum = this.item[divisor].number();
                        }

                        return Number(this.item[dividend]).div(moneyUnit.number()).div(divisorNum).round().money();
                    }
                }

            },
            custFormatter: function (colAft, colOri) {
                return function () {
                    var aftNum = this.item[colAft].number();
                    var oriNum = this.item[colOri].number();

                    if (oriNum == 0) {
                        return "-";
                    }
                    var diff = (aftNum - oriNum) * 100;
                    return diff.div(oriNum).round(2);
                }
            },
            moneySumFormatter: function (dividend, divisor, moneyUnit) {
                return function () {
                    var dividendNum = app.grid.foot_sum(this.list, dividend).number();
                    var divisorNum = divisor;
                    if (isNaN(divisor)) {
                        divisorNum = app.grid.foot_sum(this.list, divisor).number();
                    }
                    return dividendNum.div(moneyUnit.number()).div(divisorNum).round().money();
                }
            },
            custSumFormatter: function (compOne, compTwo) {
                return function () {
                    var dividend = app.grid.foot_sum(this.list, compOne).number();
                    var divisor = app.grid.foot_sum(this.list, compTwo).number();
                    var diffTimesHund = (dividend - divisor) * 100.0;

                    if (divisor == 0) {
                        return "-";
                    }

                    return diffTimesHund.div(divisor).round(2);
                }
            }
        },
        getGridData: function (res) {
            var data = {list: [], page: {}};
            if (!res) {

            }
            else if (Object.isArray(res)) {
                data.list = res;
            }
            else {
                data.list = res.list;
                data.page = {
                    pageNo: (res.page.currentPage + 1),
                    pageSize: res.page.pageSize,
                    pageCount: res.page.totalPages,
                    listCount: res.page.totalElements
                };
            }
            return data;
        }
    }
}; // builder

/**
 * app.ACTIONS
 * ACTIONS의 기본형으로 registStore 메소드를 가진다.
 */
app.ACTIONS = {
    stores: [],
    registStore: function (store) {
        this.stores.push(store);
    },
    dispatch: function () {

        if (this.proxy && this.proxy.onBeforeDispatch) {

        }

        if (window.fnObj && window.fnObj.dispatch) {
            //console.log(arguments);
            fnObj.dispatch.apply(fnObj, arguments);

            /* store apply 주석
            var i = this.stores.length;
            while (i--) {
                this.stores[i][1].apply(this.stores[i][0], arguments);
            }
            */

            return true;
        }
        else {
            alert('fnObj.dispatch 가 선언되지 않았습니다. 페이지에 fnObj.dispatch 를 선언해주세요.');
            return false;
        }

        if (this.proxy && this.proxy.onAfterDispatch) {

        }
    }
};

/**
 * app.CODE
 * CODE의 기본형으로 각 코드의 map 데이터를 생성해주고 기본 메소드를 가진다.
 */
app.CODE_map = {key: "CD", value: "NM"};
app.CODE = (function () {
    var BASIC_CODE = {};

    return function () {
        var
            codes,
            return_code = {}
            ;

        if (arguments.length == 1) {
            codes = arguments[0];
        }
        else {
            BASIC_CODE = arguments[0];
            codes = arguments[1];
        }

        codes = $.extend(true, BASIC_CODE, codes);
        for (var k in codes) {
            if (codes.hasOwnProperty(k)) {
                return_code[k] = codes[k];
                return_code[k].map = (function () {
                    var
                        i = this.length,
                        map = {}
                        ;
                    while (i--) {
                        map[this[i][app.CODE_map.key]] = this[i][app.CODE_map.value];
                    }
                    return map;
                }).call(return_code[k]);
            }
        }

        return return_code;
    };
})();