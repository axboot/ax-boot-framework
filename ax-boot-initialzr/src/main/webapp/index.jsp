<%--
  Created by IntelliJ IDEA.
  User: brant
  Date: 10/27/16
  Time: 10:26 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>AXBoot :: Project Initialzr</title>

    <link rel="shortcut icon" href="/assets/favicon.ico" type="image/x-icon"/>
    <link rel="icon" href="/assets/favicon.ico" type="image/x-icon"/>
    <!-- CSS -->
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,500">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/form-elements.css">
    <link rel="stylesheet" href="assets/css/style.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->


</head>
<body>


<!-- Top menu -->
<nav class="navbar navbar-inverse navbar-no-bg" role="navigation">
    <div class="container">

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="top-navbar-1">
            <ul class="nav navbar-nav navbar-left">
                <li>
                    <b>AXBOOT</b>
                    <span class="li-text">
                        Full Stack Web Application Development Framework
                    </span>
                    <span class="li-text">
                        &nbsp;&nbsp;&nbsp;
                        <a href="http://www.axboot.com" target="_blank">http://www.axboot.com</a>
                    </span>
                    <span class="li-social">
                        <a href="https://github.com/axboot" target="_blank"><i class="fa fa-github"></i></a>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Top content -->
<div class="top-content">

    <div class="inner-bg">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 text">
                    <h1><strong>AXBOOT</strong> INITIALIZR</h1>
                    <div class="description">
                        <p>
                            Bootstrap your application now<br/>

                        </p>
                    </div>
                    <!--
                    <div class="top-big-link">
                        <a class="btn btn-link-1" href="#">Button 1</a>
                        <a class="btn btn-link-2" href="#">Button 2</a>
                    </div>
                    -->
                </div>
                <div class="col-sm-6 form-box">
                    <div class="form-top">
                        <div class="form-top-left">
                            <h3>Project Metadata</h3>
                            <p>Artifact coordinates</p>
                        </div>
                        <div class="form-top-right">
                            <i class="fa fa-pencil"></i>
                        </div>
                    </div>
                    <div class="form-bottom">

                        <form method="get" action="/api/v1/project" enctype="application/x-www-form-urlencoded" class="registration-form">
                            <div class="form-group">
                                <label class="sr-only" for="form-01">Maven Group</label>
                                <input type="text" name="groupId" placeholder="Maven Group ID (example: com.chequer.axboot)" class="form-control" id="form-01"/>
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="form-03">Maven Artifact</label>
                                <input type="text" name="artifactId" placeholder="Maven Artifcat ID (example : admin)" class="form-control" id="form-02"/>
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="form-02">Project Name</label>
                                <input type="text" name="projectName" placeholder="Project Name (example : AXBoot Admin)" class="form-control" id="form-03"/>
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="form-04">Description</label>
                                <input type="text" name="description" placeholder="Project Description (example : AXBoot Admin Project)" class="form-control" id="form-04"/>
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="form-05">Package Name</label>
                                <input type="text" name="packageName" placeholder="Package of Source Code (example : com.chequer.axboot.admin)" class="form-control" id="form-05"/>
                            </div>

                            <button type="submit" class="btn">Generate Project</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>


<!-- Javascript -->
<script src="assets/js/jquery-1.11.1.min.js"></script>
<script src="assets/bootstrap/js/bootstrap.min.js"></script>
<script src="assets/js/jquery.backstretch.min.js"></script>
<script src="assets/js/retina-1.1.0.min.js"></script>
<script src="assets/js/scripts.js"></script>

<!--[if lt IE 10]>
<script src="assets/js/placeholder.js"></script>
<![endif]-->


</body>
</html>
