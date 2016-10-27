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
</head>
<body>
<form metho="get" action="/api/v1/project" enctype="application/x-www-form-urlencoded">
    Maven Group ID<input type="text" name="groupId" value="" placeholder="Maven Group ID"/><br/><br/>
    Maven Artifact<input type="text" name="artifactId" value="" placeholder="Maven Artifcat ID"/><br/><br/>
    Project Name<input type="text" name="projectName" value="" placeholder="Project Name"/><br/><br/>
    Description<input type="text" name="description" value="" placeholder="Project Description"/><br/><br/>
    Package Name<input type="text" name="packageName" value="" placeholder="Source Base Package Name"/><br/><br/>

    <input type="submit" value="Generate!"/>
</form>
</body>
</html>
