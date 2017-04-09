/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5grid TEST', function () {
    var myUI;
    var tmpl = '<div data-ax5grid="first-grid" data-ax5grid-config="" style="height: 300px;"></div>';

    $(document.body).append(tmpl);

    ///
    it('new ax5grid', function (done) {
        try {
            myUI = new ax5.ui.grid();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('setConfig ax5grid', function (done) {
        myUI.setConfig({
            target: $('[data-ax5grid="first-grid"]'),
            frozenColumnIndex: 3,
            frozenRowIndex: 1,
            showLineNumber: true,
            showRowSelector: true,
            multipleSelect: true,
            lineNumberColumnWidth: 40,
            rowSelectorColumnWidth: 28,
            sortable: true, // 모든 컬럼에 정렬 아이콘 표시
            multiSort: false, // 다중 정렬 여부
            remoteSort: false, // remoteSort에 함수를 sortable 컬럼이 클릭되었을때 실행 setColumnSort를 직접 구현. (remoteSort를 사용하면 헤더에 정렬 상태만 표시 하고 데이터 정렬은 처리 안함)
            header: {
                align: "center",
                columnHeight: 28
            },
            body: {
                mergeCells: true,
                align: "center",
                columnHeight: 28,
                onClick: function () {

                },
                grouping: {
                    by: ["b"],
                    columns: [
                        {
                            label: function () {
                                return this.groupBy.labels.join(", ") + " 합계";
                            }, colspan: 2
                        },
                        {key: "price", collector: "avg", formatter: "money", align: "right"},
                        {key: "amount", collector: "sum", formatter: "money", align: "right"},
                        {
                            key: "cost", collector: function () {
                            var value = 0;
                            this.list.forEach(function (n) {
                                if (!n.__isGrouping) value += (n.price * n.amount);
                            });
                            return ax5.util.number(value, {"money": 1});
                        }, align: "right"
                        },
                        {label: "~~~", colspan: 3}
                    ]
                }
            },
            page: {
                navigationItemCount: 9,
                height: 30,
                display: true,
                firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
                prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                onChange: function () {

                }
            },
            columns: [
                {
                    key: "a",
                    label: "필드A",
                    width: 80,
                    styleClass: function () {
                        return "ABC";
                    },
                    enableFilter: true,
                    align: "center",
                    editor: {
                        type: "text", disabled: function () {
                            // item, value
                            return false;
                        }
                    }
                },
                {key: "b", label: "필드B", align: "center", editor: {type: "text"}},
                {
                    key: undefined,
                    label: "필드C", columns: [
                    {key: "price", label: "단가", align: "right", editor: {type: "money", updateWith: ['cost']}},
                    {key: "amount", label: "수량", align: "right", formatter: "money", editor: {type: "number", updateWith: ['cost']}},
                    {
                        key: "cost", label: "금액", align: "right", formatter: function () {
                        return ax5.util.number(this.item.price * this.item.amount, {"money": true});
                    }
                    }
                ]
                },
                {
                    key: "saleDt", label: "판매일자", align: "center", editor: {
                    type: "date", config: {}
                }
                },
                {
                    key: "isChecked", label: "체크박스", width: 50, sortable: false, editor: {
                    type: "checkbox", config: {height: 17, trueValue: "Y", falseValue: "N"}
                }
                },
                {
                    key: "saleType", label: "판매타입", editor: {
                    type: "select", config: {
                        columnKeys: {
                            optionValue: "CD", optionText: "NM"
                        },
                        options: [
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "A", NM: "A: String"},
                            {CD: "B", NM: "B: Number"},
                            {CD: "C", NM: "C: substr"},
                            {CD: "D", NM: "D: substring"}
                        ]
                    }
                }
                },

                {
                    key: "customer", label: "고객명", editor: {type: "text"}
                }
            ],
            footSum: [
                [
                    {label: "전체 합계", colspan: 2, align: "center"},
                    {key: "price", collector: "avg", formatter: "money", align: "right"},
                    {key: "amount", collector: "sum", formatter: "money", align: "right"},
                    {
                        key: "cost", collector: function () {
                        var value = 0;
                        this.list.forEach(function (n) {
                            if (!n.__isGrouping) value += (n.price * n.amount);
                        });
                        return ax5.util.number(value, {"money": 1});
                    }, align: "right"
                    }
                ]]
        });

        done();
    });

    it('setData ax5grid', function (done) {
        myUI.setData([
            {a: "A", b: "A", price: 1000, amount: 2000, cost: 500, saleDt: "2013-01-01", isChecked: "Y", saleType: "A", customer: "name01", __modified__: true},
            {a: "B", b: "B", price: 1200, amount: 2200, cost: 1000, saleDt: "2014-01-01", isChecked: "N", saleType: "B", customer: "name02", __selected__: true},
            {a: "C", b: "C", price: 1400, amount: 2400, cost: 1500, saleDt: "2015-01-01", isChecked: "N", saleType: "C", customer: "name03", __deleted__: false}
        ]);
        // has body.grouping
        done(myUI.getList().length == 3 ? "" : "error setData");
    });


    it('select ax5grid', function (done) {
        myUI.select(0);
        done(myUI.getList()[0]["__selected__"] ? "" : "error select");
    });

    it('copySelect ax5grid', function (done) {
        myUI.selectedColumn = {
            "0_3_0": { panelName: "top-body-scroll", dindex: 0, rowIndex: 0, colIndex: 3, colspan: 1 }
        };
        myUI.copySelect();
        done(myUI.$["form"]["clipboard"].get(0).innerHTML.replace(/\n+|(<br>)/g, "") == 2000 ? "" : "error copySelect");
        // {chrome: 2000\n, firefox: 2000<br>}
    });

    it('addRow ax5grid', function (done) {
        myUI.addRow({a: "D", b: "D", price: 1600, amount: 2600, cost: 2000, saleDt: "2016-01-01", isChecked: "Y", saleType: "D", customer: "name04", __selected__: true});
        done(myUI.getList().length == 4 ? "" : "error addRow");
    });

    it('deleteRow ax5grid', function (done) {
        myUI.deleteRow();
        done(myUI.getList("deleted").length == 1 ? "" : "error deleteRow");
    });

    it('getList ax5grid', function (done) {
        done(myUI.getList().length == 3 ? "" : "error getList");
    });

    it('getList[modified] ax5grid', function (done) {
        done(myUI.getList("modified").length == 1 ? "" : "error getList[modified]");
    });

    it('getList[selected] ax5grid', function (done) {
        done(myUI.getList("selected").length == 2 ? "" : "error getList[selected]");
    });

    it('getList[deleted] ax5grid', function (done) {
        done(myUI.getList("deleted").length == 1 ? "" : "error getList[deleted]");
    });

    it('setHeight ax5grid', function (done) {
        myUI.setHeight(500);
        done(myUI.$target.css("height") == "500px" ? "" : "error setHeight");
    });

    it('appendToList ax5grid', function (done) {
        myUI.appendToList([
            {a: "D", b: "D", price: 1600, amount: 2600, cost: 2000, saleDt: "2016-01-01", isChecked: "Y", saleType: "D", customer: "name04"},
            {a: "E", b: "E", price: 1800, amount: 2800, cost: 2500, saleDt: "2017-01-01", isChecked: "Y", saleType: "A", customer: "name05"},
            {a: "F", b: "F", price: 2000, amount: 3000, cost: 3000, saleDt: "2017-02-01", isChecked: "N", saleType: "B", customer: "name06"}
        ]);
        done(myUI.getList().length == "6" ? "" : "error appendToList");
    });

    it('removeRow ax5grid', function (done) {
        // 리스트에서 완전 제거
        myUI.removeRow();
        done(myUI.getList().length == "5" ? "" : "error removeRow");
    });

    it('updateRow ax5grid', function (done) {
        myUI.updateRow({a: "G", b: "G", price: 3000, amount: 4000, cost: 5000, saleDt: "2017-02-02", isChecked: "Y", saleType: "A", customer: "name06"}, 0);
        var data = myUI.getList()[0];
        done(data.a == "G" && data.b == "G" ? "" : "error updateRow");
    });

    it('setValue ax5grid', function (done) {
        myUI.setValue(0, "price", 3000);
        done(myUI.getList()[0].price == 3000 ? "" : "error updateRow");
    });

    it('addColumn', function (done) {
        myUI.addColumn({key: "color", label: "색상", align: "center"});
        var lastCol = myUI.columns[myUI.columns.length -1];
        done(lastCol.key == "color" && lastCol.label == "색상" && lastCol.align == "center" ? "" : "error addColumn");
    });

    it('removeColumn', function (done) {
        myUI.removeColumn();
        done(myUI.columns.length == 7 ? "" : "error removeColumn");
    });

    it('updateColumn', function (done) {
        myUI.addColumn({key: "color", label: "색상", align: "center"});
        myUI.updateColumn({key: "c-o-l-o-r", label: "색깔", align: "left"}, 7);
        var lastCol = myUI.columns[myUI.columns.length -1];
        done(lastCol.key == "c-o-l-o-r" && lastCol.label == "색깔" && lastCol.align == "left" ? "" : "error updateColumn");
    });

    //TODO: setColumnWidth??
    /*it('setColumnWidth', function (done) {
     _width error
     myUI(50, 0);
     });*/

    it('getColumnSortInfo', function (done) {
        var sortInfo = myUI.getColumnSortInfo()[0];
        done(sortInfo.key == "b" && sortInfo.orderBy == "asc" && sortInfo.seq == 0 ? "" : "error getColumnSortInfo");
    });

    it('setColumnSort', function (done) {
        var sortInfo = myUI.setColumnSort({price:{seq:0, orderBy:"desc"}, amount:{seq:1, orderBy:"asc"}}).getColumnSortInfo();
        done(sortInfo[0].key == "price" && sortInfo[1].key == "amount" ? "" : "error setColumnSort");
    });

    it('select', function (done) {
        myUI.select(0, {selected: true});
        var selectedList = myUI.getList("selected");
        done(selectedList[0].__index == 0 && selectedList[0].__selected__ ? "" : "error select");
    });

    it('clearSelect', function (done) {
        myUI.clearSelect();
        done(myUI.getList("selected").length == 1 ? "" : "error clearSelect");
    });

    after(function () {
        $('[data-ax5grid="first-grid"]').remove();
    });
});