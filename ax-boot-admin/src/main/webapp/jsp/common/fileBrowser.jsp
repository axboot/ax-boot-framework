<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<html>
<body>
<h1>파일목록</h1>

<c:forEach var="file" items="${files}">
    <c:out value="file"/>
</c:forEach>
</body>
</html>