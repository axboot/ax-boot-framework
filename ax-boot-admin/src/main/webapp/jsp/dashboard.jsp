<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>

<ax:layout name="base.jsp">
    <ax:set name="title" value="DASH BOARD"/>
    <ax:set name="page_desc" value="${PAGE_REMARK}"/>
    <ax:div name="css">
        <style>
            .widget {

            }

            .widget .widget-head {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .widget .chart-container {
                text-align: center;
            }
        </style>
    </ax:div>
    <ax:div name="contents">
        <ax:row>
            <ax:col size="3">

                <div class="widget">
                    <div class="widget-head"><span class="title">Top Sales</span></div>
                    <div class="chart-container">
                        <div class="easy-pie-chart" data-percent="73">73%</div>
                    </div>
                </div>


            </ax:col>
            <ax:col size="3">

                <div class="widget">
                    <div class="widget-head"><span class="title">Monthly Visits</span></div>
                    <div class="chart-container">
                        <div class="easy-pie-chart" data-percent="50">50%</div>
                    </div>
                </div>

            </ax:col>

            <ax:col size="3">

                <div class="widget">
                    <div class="widget-head"><span class="title">Advertisement</span></div>
                    <div class="chart-container">
                        <div class="easy-pie-chart" data-percent="20">20%</div>
                    </div>
                </div>

            </ax:col>


            <ax:col size="3">

                <div class="widget">
                    <div class="widget-head"><span class="title">Advertisement</span></div>
                    <div class="chart-container">
                        <div class="easy-pie-chart" data-percent="90">90%</div>
                    </div>
                </div>

            </ax:col>
        </ax:row>
        <ax:row>
            <ax:col size="6">

                <div class="widget widget-line">
                    <div class="widget-head"><span class="title">Bar Chart</span></div>
                    <div class="chart-container">
                        <canvas id="bar-chart"></canvas>
                    </div>
                </div>


            </ax:col>
            <ax:col size="6">

                <div class="widget widget-radar">
                    <div class="widget-head"><span class="title">Line Chart</span></div>
                    <div class="chart-container">
                        <canvas id="line-chart"></canvas>
                    </div>
                </div>

            </ax:col>
        </ax:row>
        <ax:row>
            <ax:col size="3">

                <div class="widget widget-box">
                    <div class="widget-head"><span class="title">List</span></div>
                    <div class="widget-container">

                        <table cellpadding="0" cellspacing="0" class="AXGridTable">
                            <colgroup>
                                <col width="60"/>
                                <col/>
                                <col/>
                                <col/>
                            </colgroup>
                            <thead>
                            <tr>
                                <td>
                                    <div class="tdRel">
                                        &nbsp;
                                    </div>
                                </td>
                                <td>
                                    <div class="tdRel">
                                        발생건수
                                    </div>
                                </td>
                                <td>
                                    <div class="tdRel">
                                        누계건수
                                    </div>
                                </td>
                                <td>
                                    <div class="tdRel">
                                        전년대비(누계)
                                    </div>
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <c:forEach var="i" begin="1" end="10" step="1">
                                <tr class="mytr">
                                    <td>사고</td>
                                    <td>55건</td>
                                    <td>99</td>
                                    <td>1,022건</td>
                                </tr>
                            </c:forEach>
                            </tbody>
                        </table>

                    </div>
                </div>


            </ax:col>
            <ax:col size="9">

                <div class="widget widget-box">
                    <div class="widget-head"><span class="title">Grid</span></div>
                    <div class="widget-container">
                        <div id="grid-sales-anal"></div>
                    </div>
                </div>

            </ax:col>
        </ax:row>


    </ax:div>
    <ax:div name="scripts">
        <script type="text/javascript">
            var fnObj = {
                pageStart: function () {
                    //this.chartView01.initView();

                    $('.easy-pie-chart').easyPieChart({
                        //your options goes here
                        barColor: "#468cca",
                        trackColor: "#ccc",
                        lineWidth: "10"
                    });

                    this.chartView01.initView();
                    this.chartView02.initView();
                    this.gridView01.initView();
                }
            };

            fnObj.chartView01 = {
                type: "bar",
                elementId: "bar-chart",
                initView: function () {

                    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                    var randomScalingFactor = function () {
                        return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
                    };
                    var randomColorFactor = function () {
                        return Math.round(Math.random() * 255);
                    };
                    var randomColor = function () {
                        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
                    };

                    var barChartData = {
                        labels: ["January", "February", "March", "April", "May", "June", "July"],
                        datasets: [{
                            label: 'Dataset 1',
                            backgroundColor: "rgba(220,220,220,0.5)",
                            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                        }, {
                            hidden: true,
                            label: 'Dataset 2',
                            backgroundColor: "rgba(151,187,205,0.5)",
                            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                        }, {
                            label: 'Dataset 3',
                            backgroundColor: "rgba(151,187,205,0.5)",
                            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                        }]

                    };

                    var ctx = document.getElementById(this.elementId).getContext("2d");
                    window.myBar = new Chart(ctx, {
                        type: this.type,
                        data: barChartData,
                        options: {
                            // Elements options apply to all of the options unless overridden in a dataset
                            // In this case, we are setting the border of each bar to be 2px wide and green
                            elements: {
                                rectangle: {
                                    borderWidth: 1,
                                    borderColor: 'rgb(125, 125, 125)',
                                    borderSkipped: 'bottom'
                                }
                            },
                            responsive: true,
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Chart.js Bar Chart'
                            }
                        }
                    });

                }
            };

            fnObj.chartView02 = {
                type: "line",
                elementId: "line-chart",
                initView: function () {

                    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    var randomScalingFactor = function () {
                        return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
                    };
                    var randomColorFactor = function () {
                        return Math.round(Math.random() * 255);
                    };
                    var randomColor = function (opacity) {
                        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
                    };

                    var config = {
                        type: 'line',
                        data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July"],
                            datasets: [{
                                label: "My First dataset",
                                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                                fill: false,
                                borderDash: [5, 5],
                            }, {
                                label: "My Second dataset",
                                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                                fill: false,
                                borderDash: [5, 5],
                            }, {
                                label: "My Third dataset - No bezier",
                                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                                lineTension: 0,
                                fill: false,
                            }, {
                                label: "My Fourth dataset",
                                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                                fill: false,
                            }]
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'bottom',
                            },
                            hover: {
                                mode: 'label'
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Month'
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Value'
                                    }
                                }]
                            },
                            title: {
                                display: true,
                                text: 'Chart.js Line Chart - Legend'
                            }
                        }
                    };

                    $.each(config.data.datasets, function (i, dataset) {
                        var background = randomColor(0.5);
                        dataset.borderColor = background;
                        dataset.backgroundColor = background;
                        dataset.pointBorderColor = background;
                        dataset.pointBackgroundColor = background;
                        dataset.pointBorderWidth = 1;
                    });

                    var ctx = document.getElementById(this.elementId).getContext("2d");
                    window.myLine = new Chart(ctx, config);

                }
            };

            fnObj.gridView01 = {
                target: new AXGrid(),
                initView: function () {
                    var _this = this, target = this.target;
                    this.target.setConfig({
                        targetID: "grid-sales-anal",
                        theme: "AXGrid",
                        sort: false,
                        fixedColSeq: 2,
                        colHeadAlign: "center",
                        colGroup: (function () {
                            var row = [
                                {
                                    key: "index", label: "NO", width: "40", align: "center", formatter: function () {
                                    //this.target.index;
                                    //this.target.index;
                                    return this.index + 1;
                                }
                                },
                                {key: "compNm", label: "업체명", width: "100", align: "center"},
                                {key: "storNm", label: "매장명", width: "150"},
                                {
                                    key: "cashAmt", label: "현금매출", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "cardAmt", label: "카드매출", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "totalAmt", label: "총판매액", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "dcAmt", label: "할인액", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "saleAmt", label: "공급가액", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "vatAmt", label: "부가세", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "saleTot", label: "매출액", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "cnt", label: "영수건수", width: "60", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "price", label: "영수단가", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },

                                {
                                    key: "monSaleTot", label: "매출액", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "monCnt", label: "영수건수", width: "60", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                },
                                {
                                    key: "monPrice", label: "영수단가", width: "100", align: "right", formatter: function () {
                                    return this.value.money();
                                }
                                }
                            ];
                            return row;
                        })(),

                        colHead: {
                            rows: (function () {
                                var rows = [
                                    [
                                        {key: 'index', rowspan: 2, valign: "middle"},
                                        {key: 'compNm', rowspan: 2, valign: "middle"},
                                        {key: 'storNm', rowspan: 2, valign: "middle"},
                                        {colspan: 9, label: "조회일", valign: "middle"},
                                        {colspan: 3, label: "조회월", valign: "middle"}
                                    ],
                                    [
                                        {key: 'cashAmt'},
                                        {key: 'cardAmt'},

                                        {key: 'totalAmt'},
                                        {key: 'dcAmt'},
                                        {key: 'saleAmt'},
                                        {key: 'vatAmt'},
                                        {key: 'saleTot'},
                                        {key: 'cnt'},
                                        {key: 'price'},

                                        {key: 'monSaleTot'},
                                        {key: 'monCnt'},
                                        {key: 'monPrice'}
                                    ]
                                ];
                                return rows;
                            })()
                        },
                        body: {
                            onclick: function () {
                                //toast.push(Object.toJSON({index:this.index, item:this.item}));
                                //fnObj.modal.open("gridView", this.item);
                            }
                        },
                        page: {
                            display: true,
                            paging: false,
                            pageNo: 1,
                            pageSize: 100,
                            status: {formatter: null}
                        }
                    });

                }
            }

        </script>
    </ax:div>
</ax:layout>
