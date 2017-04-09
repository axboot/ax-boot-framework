<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, user-scalable=no">

    <title>GRID</title>

    <link rel="stylesheet" type="text/css" href="<?=$bower_url?>/bootstrap/dist/css/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="<?=$bower_url?>/ax5ui-mask/dist/ax5mask.css"/>
    <link rel="stylesheet" type="text/css" href="<?=$bower_url?>/ax5ui-calendar/dist/ax5calendar.css"/>
    <link rel="stylesheet" href="<?=$bower_url?>/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="<?=$ax5_url?>/ax5grid.css"/>

    <style>
        body > .container {
            padding: 60px 15px 0;
        }

        .footer {
            margin-top: 60px;
            bottom: 0;
            width: 100%;
            height: 60px;
            background-color: #f5f5f5;
        }
    </style>

    <script src="<?=$bower_url?>/jquery/dist/jquery.min.js"></script>
    <script src="<?=$bower_url?>/ax5core/dist/ax5core.js"></script>
    <script src="<?=$ax5_url?>/ax5grid.js"></script>
</head>
<body style="padding: 20px;">

<!-- Fixed navbar -->
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Project name</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" class="divider"></li>
                        <li class="dropdown-header">Nav header</li>
                        <li><a href="#">Separated link</a></li>
                        <li><a href="#">One more separated link</a></li>
                    </ul>
                </li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>

<div class="container">
    <div class="page-header">
        <h1>Sticky footer with fixed navbar</h1>
    </div>

    <div style="position: relative; height:400px;" id="grid-parent">
        <div data-ax5grid="first-grid" data-ax5grid-config='{showLineNumber: true, showRowSelector: true}' style="height: 100%;"></div>
    </div>

    <div style="padding: 5px;">
        <button class="btn btn-default" data-grid-control="column-remove">remove</button>
    </div>
</div>

<footer class="footer">
    <div class="container">
        <p class="text-muted">Place sticky footer content here.</p>
    </div>
</footer>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script>


    var firstGrid = new ax5.ui.grid();

    ax5.ui.grid.formatter["myType"] = function () {
        return "myType" + (this.value || "");
    };
    ax5.ui.grid.formatter["capital"] = function(){
        return (''+this.value).toUpperCase();
    };

    ax5.ui.grid.collector["myType"] = function () {
        return "myType" + (this.value || "");
    };

    var ajaxCrud = {
        orgData: {},
        ajaxUrl: 'json_data.php',
        read: function () {
            var postData = {
                len: gridView.len,
                page: (gridView.pageNo || 0) + 1,
                sort: gridView.sortInfo,
                mode: 'read'
            };

            $.post(ajaxCrud.ajaxUrl, postData, function(data) {
                    if(data.status == 'success') {
                        firstGrid.setData(data.data);
                    }
                }, 'JSON'
            );
        },
        update: function() {
            var rowNum = this.dindex;
            var columnKey = this.key;
            var targetRow = $('[data-ax5grid-data-index="' + rowNum + '"]');

            // 데이터가 변경 되었는지 확인 한다.
            if(JSON.stringify(ajaxCrud.orgData[rowNum][columnKey]) != JSON.stringify(this.list[rowNum][columnKey])) {
                var postData = {mode: "update"};

                postData = $.extend(postData, this.list[rowNum]);

                // Ajax를 이용 하여 데이터 전송
                targetRow.css('color', 'red');
                $.post(ajaxCrud.ajaxUrl, postData, function(data) {
                    if(data.status == 'success') {
                        targetRow.css('color', 'blue');
                    }
                }, 'JSON');
            }
        },
        delete : function(){
            if(firstGrid.selectedDataIndexs.length > 0) {
                var postData = {
                    "mode": "delete",
                    "ids": []
                };

                firstGrid.selectedDataIndexs.forEach(function(val, idx){
                    console.log(idx, val);
                });

                // 삭제할 데이터의 DB id 추츨
                for(var i in firstGrid.selectedDataIndexs) {
                    postData.ids.push(firstGrid.getList()[firstGrid.selectedDataIndexs[i]].id);
                }

                $.post(ajaxCrud.ajaxUrl, postData, function(data){
                    if(data.status == 'success') {
                        gridView.setData();
                    }
                });
            }
        }
    }

    var gridView = {
        initView: function () {
            firstGrid.setConfig({
                target: $('[data-ax5grid="first-grid"]'),
                sortable: true,
                multiSort: true,
                remoteSort: function () {
                    gridView.sortInfo = this.sortInfo;
                    gridView.setData();
                },
                header: {
                    align: "center",
                    columnHeight: 28,
                    onClick: function(item) {
                        console.log(item);
                        console.log(this.columns);
                    }
                },
                body: {
                    align: "center",
                    columnHeight: 28,
                    onClick: function () {
                        ajaxCrud.orgData = ax5.util.deepCopy(this.list);
                    },
                    onDataChanged: ajaxCrud.update
                },
                columns: [
                    {key: "id", label: "ID", align: "center"},
                    {
                        key: "company",
                        label: "회사",
                        width: 80,
                        enableFilter: true,
                        align: "center",
                        editor: {type:"text"}
                    },
                    {key: "ceo", label: "대표이사", align: "center"},
                    {
                        key: undefined,
                        label: "주문내역",
                        columns: [
                            {key: "price", label: "단가", formatter: "money", align: "right", editor: {type:"text", updateWith:['cost']}},
                            {key: "amount", label: "수량", formatter: "money", align: "right", editor: {type:"text", updateWith:['cost']}},
                            {key: "cost", label: "금액", align: "right",  formatter: function () {
                                return ax5.util.number(this.item.price * this.item.amount, {"money": true});
                            }}
                        ]
                    },
                    {key: "sale_date", label: "판매일자", align: "center"},
                    {key: "customer", label: "고객명"},
                    {key: "sale_type", label: "판매타입"}
                ],
                page: {
                    navigationItemCount: 9,
                    height: 30,
                    display: true,
                    firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
                    prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                    nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                    lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                    onChange: function () {
                        gridView.pageNo = this.page.selectPage;
                        gridView.setData();
                    }
                },
                onLoad: function() {
                    console.log($(firstGrid.config.target).height());
                }
            });
            return this;
        },
        pageNo: 0,
        sortInfo: {},
        len: 11,
        setData: ajaxCrud.read
    };

    $(document.body).ready(function () {
        gridView
            .initView()
            .setData();

        $('[data-grid-control="column-remove"]').click(ajaxCrud.delete);
    });
    //694470860800
</script>

</body>
</html>