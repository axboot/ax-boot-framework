// ax5.ui.grid.page
(function () {

    let GRID = ax5.ui.grid,
        U = ax5.util;

    var onclickPageMove = function (_act) {
        var callback = function (_pageNo) {
            if (this.page.currentPage != _pageNo) {
                this.page.selectPage = _pageNo;
                if (this.config.page.onChange) {
                    this.config.page.onChange.call({
                        self: this,
                        page: this.page,
                        data: this.data
                    });
                }
            }
        };
        var processor = {
            "first": function () {
                callback.call(this, 0);
            },
            "prev": function () {
                var pageNo = this.page.currentPage - 1;
                if (pageNo < 0) pageNo = 0;
                callback.call(this, pageNo);
            },
            "next": function () {
                var pageNo = this.page.currentPage + 1;
                if (pageNo > this.page.totalPages - 1) pageNo = this.page.totalPages - 1;
                callback.call(this, pageNo);
            },
            "last": function () {
                callback.call(this, this.page.totalPages - 1);
            }
        };

        if (_act in processor) {
            processor[_act].call(this);
        }
        else {
            callback.call(this, _act-1);
        }
    };

    var navigationUpdate = function () {
        var self = this;
        if (this.page) {
            var page = {
                hasPage: false,
                currentPage: this.page.currentPage,
                pageSize: this.page.pageSize,
                totalElements: this.page.totalElements,
                totalPages: this.page.totalPages,
                firstIcon: this.config.page.firstIcon,
                prevIcon: this.config.page.prevIcon || "«",
                nextIcon: this.config.page.nextIcon || "»",
                lastIcon: this.config.page.lastIcon,
            };
            var navigationItemCount = this.config.page.navigationItemCount;


            page["@paging"] = (function () {
                var returns = [];

                var startI = page.currentPage - Math.floor(navigationItemCount / 2);
                if (startI < 0) startI = 0;
                var endI = page.currentPage + navigationItemCount;
                if (endI > page.totalPages) endI = page.totalPages;

                if (endI - startI > navigationItemCount) {
                    endI = startI + navigationItemCount;
                }

                if(endI - startI < navigationItemCount){
                    startI = endI - navigationItemCount;
                }
                if (startI < 0) startI = 0;

                for (var p = startI, l = endI; p < l; p++) {
                    returns.push({'pageNo': (p + 1), 'selected': page.currentPage == p});
                }
                return returns;
            })();

            if(page["@paging"].length > 0){
                page.hasPage = true;
            }

            this.$["page"]["navigation"].html(GRID.tmpl.get("page_navigation", page));
            this.$["page"]["navigation"].find("[data-ax5grid-page-move]").on("click", function () {
                var act = this.getAttribute("data-ax5grid-page-move");
                onclickPageMove.call(self, act);
            });
        } else {
            this.$["page"]["navigation"].empty();
        }
    };

    var statusUpdate = function () {
        var fromRowIndex = this.xvar.paintStartRowIndex;
        var toRowIndex = this.xvar.paintStartRowIndex + this.xvar.paintRowCount - 1;
        //var totalElements = (this.page && this.page.totalElements) ? this.page.totalElements : this.xvar.dataRowCount;
        var totalElements = this.xvar.dataRowCount;
        if (toRowIndex > totalElements) {
            toRowIndex = totalElements;
        }

        this.$["page"]["status"].html(GRID.tmpl.get("page_status", {
            fromRowIndex: U.number(fromRowIndex + 1, {"money": true}),
            toRowIndex: U.number(toRowIndex, {"money": true}),
            totalElements: U.number(totalElements, {"money": true}),
            dataRowCount: (totalElements !== this.xvar.dataRealRowCount) ? U.number(this.xvar.dataRealRowCount, {"money": true}) : false,
            progress: (this.appendProgress) ? this.config.appendProgressIcon : ""
        }));
    };

    GRID.page = {
        navigationUpdate: navigationUpdate,
        statusUpdate: statusUpdate
    };

})();