/**
 * @function axboot.gridBuilder
 * @param {Object} _config
 * @example
 * ```js
 * this.target = axboot.gridBuilder({
 *    showLineNumber: false,
 *    showRowSelector: false,
 *    frozenColumnIndex: 0,
 *    target: $('[data-ax5grid="grid-view-01"]'),
 *    columns: [
 *        //menuId
 *        {key: "grpAuthCd", label: "권한그룹코드", width: 80, align: "center"},
 *        {key: "grpAuthNm", label: "권한그룹명", width: 160, align: "left"},
 *        {key: "useYn", label: "권한적용", editor: "checkYn"},
 *        {key: "schAh", label: "조회", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
 *        /// --> 이것들을 list로 담아서  [PUT] "/api/v2/menu/auth"
 *    ],
 *    body: {
 *        onClick: function () {
 *            // this.self.select(this.dindex);
 *        }
 *    }
 * });
 * ```
 */
axboot.gridBuilder = (function () {
    var defaultGridConfig = {
        showLineNumber: true,
        lineNumberColumnWidth: 50,
        rowSelectorColumnWidth: 28,
        multipleSelect: false,
        header: {
            align: "center",
            columnHeight: 28
        },
        body: {
            columnHeight: 28,
            onClick: function () {
                this.self.select(this.dindex);
            }
        },
        page: {
            navigationItemCount: 9,
            height: 30,
            display: true,
            firstIcon: '<i class="cqc-controller-jump-to-start"></i>',
            prevIcon: '<i class="cqc-triangle-left"></i>',
            nextIcon: '<i class="cqc-triangle-right"></i>',
            lastIcon: '<i class="cqc-controller-next"></i>'
        }
    };

    return function (_config) {
        var myGridConfig = $.extend(true, {}, defaultGridConfig, _config);

        var convertColumn = function (columns) {

            for (var i = 0, l = columns.length; i < l; i++) {
                if (axboot.gridBuilder.preDefineColumns[columns[i].key]) {
                    columns[i] = $.extend({}, axboot.gridBuilder.preDefineColumns[columns[i].key], columns[i]);
                }
                if (columns[i].columns) {
                    columns[i].columns = convertColumn(columns[i].columns)
                }
                if (ax5.util.isString(columns[i].editor)) {
                    if (columns[i].editor in axboot.gridBuilder.preDefineEditor) {
                        if (ax5.util.isFunction(axboot.gridBuilder.preDefineEditor[columns[i].editor])) {
                            columns[i].editor = axboot.gridBuilder.preDefineEditor[columns[i].editor]();
                        } else {
                            columns[i].editor = $.extend({}, axboot.gridBuilder.preDefineEditor[columns[i].editor]);
                        }
                    }
                }

                if (columns[i].editor && ax5.util.isString(columns[i].editor.disabled)) {
                    columns[i].editor.disabled = axboot.gridBuilder.preDefineEditorDisabled[columns[i].editor.disabled];
                }
            }
            return columns;
        };

        myGridConfig.columns = convertColumn(myGridConfig.columns);
        myGridConfig.page.onChange = function () {
            myGridConfig.onPageChange(this.page.selectPage);
        };

        return new ax5.ui.grid(myGridConfig);
    }
})();

axboot.gridBuilder.preDefineColumns = {
    "insDt": {width: 100, label: "등록일", align: "center"},
    "compCd": {width: 70, label: "업체코드", align: "center"},
    "compNm": {width: 110, label: "업체명", align: "left"},
    "storCd": {width: 70, label: "매장코드", align: "center"},
    "storNm": {width: 200, label: "매장명", align: "left"},
    "userNm": {width: 100, label: "이름", align: "center"},
    "itemCd": {width: 80, label: "품목코드", align: "center"},
    "itemNm": {width: 150, label: "품목명", align: "left"},
    "posItemNm": {width: 150, label: "POS단축명", align: "left"},
    "delYn": {
        width: 50, label: "삭제", align: "center", formatter: function () {
            return parent.COMMON_CODE["DEL_YN"].map[this.value];
        }
    },
    "useYn": {
        width: 70, label: "사용여부", align: "center", formatter: function () {
            return parent.COMMON_CODE["USE_YN"].map[this.value];
        }
    },
    "posUseYn": {
        width: 90, label: "포스사용여부", align: "center", formatter: function () {
            return parent.COMMON_CODE["USE_YN"].map[this.value];
        }
    },
    "sort": {width: 50, label: "정렬", align: "center"},
    "companyJson.대표자명": {width: 100, label: "대표자명", align: "center"},
    "companyJson.사업자등록번호": {
        label: "사업자등록번호",
        width: 120,
        align: "center",
        formatter: "bizno"
    },
    "storeInfoJson.대표자명": {width: 100, label: "대표자명", align: "center"},
    "storeInfoJson.사업자등록번호": {
        label: "사업자등록번호",
        width: 120,
        align: "center",
        formatter: "bizno"
    },
    "storeInfoJson.영업시작시간": {
        label: "영업시작시간",
        width: 100,
        align: "center"
    },
    "storeInfoJson.영업종료시간": {
        label: "영업종료시간",
        width: 100,
        align: "center"
    },
    "storeInfoJson.담당자": {
        label: "담당자",
        width: 70,
        align: "center"
    },
    "storeInfoJson.연락처": {
        label: "연락처",
        width: 100,
        align: "center"
    }
};

// 컬럼 확장 구문
axboot.gridBuilder.preDefineColumns["locale"] = (function () {
    return {
        width: 120, label: "국가", align: "center", formatter: function () {
            return parent.COMMON_CODE["LOCALE"].map[this.value];
        }
    };
})();

axboot.gridBuilder.preDefineColumns["printerType"] = (function () {
    return {
        width: 100, label: "프린터 타입", align: "center",
        formatter: function () {
            return parent.COMMON_CODE["PRINTER_TYPE"].map[this.value];
        }
    };
})();

axboot.gridBuilder.preDefineEditor = {
    "useYn": {
        type: "select", config: {
            columnKeys: {
                optionValue: "CD", optionText: "NM"
            },
            options: [
                {CD: "Y", NM: "사용"},
                {CD: "N", NM: "사용안함"}
            ]
        }
    },
    "checkYn": {
        type: "checkbox", config: {trueValue: "Y", falseValue: "N"}
    },
    "menu-program-auth-checkYn": {
        type: "checkbox", config: {trueValue: "Y", falseValue: "N"},
        disabled: function () {
            return this.item["program_" + this.key] == "N";
        }
    },
    "number": {
        type: "number"
    },
    "text": {
        type: "text"
    },
    "PRINTER_TYPE": function () {
        return {
            type: "select", config: {
                columnKeys: {
                    optionValue: "code", optionText: "name"
                },
                options: parent.COMMON_CODE["PRINTER_TYPE"]
            }
        };
    }
};

axboot.gridBuilder.preDefineEditorDisabled = {
    "notCreated": function () {
        return !this.item.__created__;
    }
};

ax5.ui.grid.formatter["bizno"] = function () {
    var val = (this.value || "").replace(/\D/g, "");
    var regExpPattern = /^([0-9]{3})\-?([0-9]{1,2})?\-?([0-9]{1,5})?.*$/,
        returnValue = val.replace(regExpPattern, function (a, b) {
            var nval = [arguments[1]];
            if (arguments[2]) nval.push(arguments[2]);
            if (arguments[3]) nval.push(arguments[3]);
            return nval.join("-");
        });
    return returnValue;
};

ax5.ui.grid.formatter["phone"] = function () {
    var val = this.value.replace(/\D/g, "");
    var regExpPattern3 = /^([0-9]{3})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/,
        returnValue = val.replace(regExpPattern3, function (a, b) {
            var nval = [arguments[1]];
            if (arguments[2]) nval.push(arguments[2]);
            if (arguments[3]) nval.push(arguments[3]);
            if (arguments[4]) nval.push(arguments[4]);
            if (arguments[5]) nval.push(arguments[5]);
            return nval.join("-");
        });
    return returnValue;
};

