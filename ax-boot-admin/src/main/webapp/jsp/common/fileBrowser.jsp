<%@ page import="com.chequer.axboot.core.utils.RequestUtils" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%
    RequestUtils requestUtils = RequestUtils.of(request);
    requestUtils.setAttribute("CKEditorFuncNum", requestUtils.getInt("CKEditorFuncNum"));
    requestUtils.setAttribute("targetId", requestUtils.getString("targetId"));
%>
<html>
<head>
    <script type="text/javascript">
        var CKEditorFuncNum = ${CKEditorFuncNum};
        function selectImage(url) {
            window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, url);
            window.close();
        }
    </script>
</head>
<body>
<h1>파일목록</h1>
<form name="uploadForm" action="/ckeditor/uploadImage" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="targetId" value="${targetId}"/>
    <input type="hidden" name="targetType" value="CKEDITOR"/>
    <input type="file" name="upload"/>
    <input type="submit" name="Upload"/>
</form>

<c:forEach var="file" items="${files}">
    파일명 : ${file.fileNm} / 상세정보 : ${file} / 프리뷰 : <a href="javascript:selectImage('${file.preview()}');"><img src="${file.preview()}"/></a><br/><br/>
</c:forEach>
</body>
</html>