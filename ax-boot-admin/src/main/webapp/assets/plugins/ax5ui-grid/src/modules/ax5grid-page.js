// ax5.ui.grid.page
(function () {

    const GRID = ax5.ui.grid;

    const U = ax5.util;

    const onclickPageMove = function (_act) {
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
            callback.call(this, _act - 1);
        }
    };

    const navigationUpdate = function () {
        let self = this;
        if (this.page) {
            let page = {
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
            let navigationItemCount = this.config.page.navigationItemCount;

            page["@paging"] = (function () {
                let returns = [], startI, endI;

                startI = page.currentPage - Math.floor(navigationItemCount / 2);
                if (startI < 0) startI = 0;
                endI = page.currentPage + navigationItemCount;
                if (endI > page.totalPages) endI = page.totalPages;

                if (endI - startI > navigationItemCount) {
                    endI = startI + navigationItemCount;
                }

                if (endI - startI < navigationItemCount) {
                    startI = endI - navigationItemCount;
                }
                if (startI < 0) startI = 0;

                for (let p = startI, l = endI; p < l; p++) {
                    returns.push({'pageNo': (p + 1), 'selected': page.currentPage == p});
                }
                return returns;
            })();

            if (page["@paging"].length > 0) {
                page.hasPage = true;
            }

            this.$["page"]["navigation"].html(GRID.tmpl.get("page_navigation", page));
            this.$["page"]["navigation"].find("[data-ax5grid-page-move]").on("click", function () {
                onclickPageMove.call(self, this.getAttribute("data-ax5grid-page-move"));
            });

        } else {
            this.$["page"]["navigation"].empty();
        }
    };

    const statusUpdate = function () {
        if (!this.config.page.statusDisplay) {
            return;
        }

        let toRowIndex, rangeCount = Math.min(this.xvar.dataRowCount, this.xvar.virtualPaintRowCount);
        let data = {};

        toRowIndex = this.xvar.virtualPaintStartRowIndex + rangeCount;

        if (toRowIndex > this.xvar.dataRowCount) {
            toRowIndex = this.xvar.dataRowCount;
        }

        data.fromRowIndex = U.number(this.xvar.virtualPaintStartRowIndex + 1, {"money": true});
        data.toRowIndex = U.number(toRowIndex, {"money": true});
        data.totalElements = false;
        data.dataRealRowCount = (this.xvar.dataRowCount !== this.xvar.dataRealRowCount) ? U.number(this.xvar.dataRealRowCount, {"money": true}) : false;
        data.dataRowCount = U.number(this.xvar.dataRowCount, {"money": true});
        data.progress = (this.appendProgress) ? this.config.appendProgressIcon : "";

        if (this.page) {
            data.fromRowIndex_page = U.number(this.xvar.virtualPaintStartRowIndex + (this.page.currentPage * this.page.pageSize) + 1, {"money": true});
            data.toRowIndex_page = U.number(this.xvar.virtualPaintStartRowIndex + rangeCount + (this.page.currentPage * this.page.pageSize), {"money": true});
            data.totalElements = U.number(this.page.totalElements, {"money": true});

            if (data.toRowIndex_page > this.page.totalElements) {
                data.toRowIndex_page = this.page.totalElements;
            }
        }

        this.$["page"]["status"].html(
            GRID.tmpl.get("page_status", data)
        );
    };

    GRID.page = {
        navigationUpdate: navigationUpdate,
        statusUpdate: statusUpdate
    };

})();