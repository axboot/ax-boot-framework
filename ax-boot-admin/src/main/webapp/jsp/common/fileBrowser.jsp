<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<html>
<body>
<h1>파일목록</h1>

<c:forEach var="file" items="${files}">
    파일명 : ${file.fileNm} / 상세정보 : ${file} / 프리뷰 : <img src="${file.preview()}"/>"<br/><br/>
</c:forEach>
</body>
</html>