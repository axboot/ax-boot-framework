<%--
  Created by IntelliJ IDEA.
  User: brant
  Date: 5/8/16
  Time: 11:53 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<h1>AXBoot Setup</h1>

<p>데이터베이스 연결 정보를 확인하세요.</p>
<ul>
    <li>DatabaseType : ${databaseType}</li>
    <li>JdbcUrl : ${jdbcUrl}</li>
    <li>UserName : ${username}</li>
</ul>

<h3>WARNING! 스키마 및 초기 데이터 생성을 이미한 경우에는, 기존에 생성된 테이블과 데이터가 모두 삭제된 후 재생성 됩니다.</h3>
<!-- TODO : AJAX Call로 처리 -->
<a href="/setup/init">
    <button>스키마 및 초기 데이터 생성하기</button>
</a>

</body>
</html>
