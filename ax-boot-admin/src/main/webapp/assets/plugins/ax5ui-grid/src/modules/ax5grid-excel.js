/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.grid.excel
(function () {

    const GRID = ax5.ui.grid;

    const U = ax5.util;

    const base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    };

    const uri = "data:application/vnd.ms-excel;base64,";

    const getExcelTmpl = function () {
        return `\ufeff
{{#tables}}{{{body}}}{{/tables}}
`;
    };

    const tableToExcel = function (table, fileName) {
        let link, a, output,
            tables = [].concat(table);

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

        let isChrome = navigator.userAgent.indexOf("Chrome") > -1,
            isSafari = !isChrome && navigator.userAgent.indexOf("Safari") > -1,
            isIE = /*@cc_on!@*/false || !!document.documentMode; // this works with IE10 and IE11 both :)

        let blob1, blankWindow, $iframe, iframe, anchor;

        if (navigator.msSaveOrOpenBlob) {
            blob1 = new Blob([output], {type: "text/html"});
            window.navigator.msSaveOrOpenBlob(blob1, fileName);
        }
        else if (isSafari) {
            // 사파리는 지원이 안되므로 그냥 테이블을 클립보드에 복사처리
            //tables
            blankWindow = window.open('about:blank', this.id + '-excel-export', 'width=600,height=400');
            blankWindow.document.write(output);
            blankWindow = null;
        }
        else {
            if (isIE && typeof Blob === "undefined") {
                //otherwise use the iframe and save
                //requires a blank iframe on page called txtArea1
                $iframe = jQuery('<iframe id="' + this.id + '-excel-export" style="display:none"></iframe>');
                jQuery(document.body).append($iframe);

                iframe = window[this.id + '-excel-export'];
                iframe.document.open("text/html", "replace");
                iframe.document.write(output);
                iframe.document.close();
                iframe.focus();
                iframe.document.execCommand("SaveAs", true, fileName);
                $iframe.remove();
            } else {
                // Attempt to use an alternative method
                anchor = document.body.appendChild(
                    document.createElement("a")
                );

                // If the [download] attribute is supported, try to use it
                if ("download" in anchor) {
                    anchor.download = fileName;
                    anchor.href = URL.createObjectURL(new Blob([output], { type: 'text/csv' }));
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