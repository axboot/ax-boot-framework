/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.excel
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;

    var base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    };
    var uri = "data:application/vnd.ms-excel;base64,";

    var getExcelTmpl = function () {
        return `\ufeff
{{#tables}}{{{body}}}{{/tables}}
`;
    };

    var tableToExcel = function (table, fileName) {
        var link, a, output;
        var tables = [].concat(table);

        output = ax5.mustache.render(getExcelTmpl(), {
            worksheet: (function () {
                var arr = [];
                tables.forEach(function (t, ti) {
                    arr.push({name: "Sheet" + (ti + 1)});
                });
                return arr;
            })(),
            tables: (function () {
                var arr = [];
                tables.forEach(function (t, ti) {
                    arr.push({body: t});
                });
                return arr;
            })()
        });

        var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
        var isSafari = !isChrome && navigator.userAgent.indexOf("Safari") > -1;

        var isIE = /*@cc_on!@*/false || !!document.documentMode; // this works with IE10 and IE11 both :)
        if (navigator.msSaveOrOpenBlob) {
            var blob1 = new Blob([output], {type: "text/html"});
            window.navigator.msSaveOrOpenBlob(blob1, fileName);
        }
        else if (isSafari) {
            // 사파리는 지원이 안되므로 그냥 테이블을 클립보드에 복사처리
            //tables
            var blankWindow = window.open('about:blank', this.id + '-excel-export', 'width=600,height=400');
            blankWindow.document.write(output);
            blankWindow = null;
        }
        else {
            if (isIE && typeof Blob === "undefined") {

                //otherwise use the iframe and save
                //requires a blank iframe on page called txtArea1
                var $iframe = jQuery('<iframe id="' + this.id + '-excel-export" style="display:none"></iframe>');
                jQuery(document.body).append($iframe);
                var iframe = window[this.id + '-excel-export'];
                iframe.document.open("text/html", "replace");
                iframe.document.write(output);
                iframe.document.close();
                iframe.focus();
                iframe.document.execCommand("SaveAs", true, fileName);
                $iframe.remove();
            } else {
                // Attempt to use an alternative method
                var anchor = document.body.appendChild(
                    document.createElement("a")
                );

                // If the [download] attribute is supported, try to use it
                if ("download" in anchor) {
                    anchor.download = fileName;
                    //anchor.href = URL.createObjectURL( blob );
                    anchor.href = uri + base64(output);
                    anchor.click();
                    document.body.removeChild(anchor);
                }
            }
        }

        return true;
    };

    GRID.excel = {
        export: tableToExcel
    };
})();