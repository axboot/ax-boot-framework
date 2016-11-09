<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Database Schema to JPA Objects</title>
    <style type="text/css">
        pre {
            padding:10px;
            border:1px solid #e4e5e7;
        }
        .scheme-table{
            width: 100%;
            font-size: 13px;
            border:1px solid #e4e5e7;
            border-collapse: collapse;
        }
        .scheme-table td, .scheme-table th {
            border:1px solid #e4e5e7;
        }
        .scheme-table thead th{
            //border:1px solid #e4e5e7;
            background: #eee;
        }
        a, u {
            text-decoration: none;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="/jsp/axpi/plugins/prettify/github.css">
    <link rel="stylesheet" type="text/css" href="/jsp/axpi/plugins/ax5/css/jellyfish/ax5.min.css">
    <link rel="stylesheet" type="text/css" href="/jsp/axpi/css/app.css">
    <link rel="stylesheet" type="text/css" href="http://cdno.axisj.com/axicon/axicon.css">

    <script type="text/javascript" src="/jsp/axpi/plugins/prettify/prettify.js"></script>
    <script type="text/javascript" src="/jsp/axpi/plugins/ax5/ax5.min.js"></script>
</head>
<body>

    <div class="app-page" style="padding-top:0px;">
        <div class="app-content app-wrap">
            <h1 data-menu-item="" data-value="List of Tables" style="display: none;">Schema Explorer</h1>
            <div id="print-body">

            </div>

            <div style="height:600px"></div>

        </div>
        <div class="app-nav-left" id="app-nav-left"></div>
    </div>
    <script type="text/javascript" src="/jsp/axpi/app_for_db.js"></script>
</body>
</html>
