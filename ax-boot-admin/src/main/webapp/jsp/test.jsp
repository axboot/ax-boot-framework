<%--
  Created by IntelliJ IDEA.
  User: brant
  Date: 9/2/16
  Time: 10:25 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="ax" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<ax:api url="/api/v1/users" key="users"/>

<ax:api url="/api/v1/users" key="usersObject" type="object"/>

<ax:layout name="base" title="hello333">
    <jsp:attribute name="script">
        <script type="text/javascript">
            var SCRIPT_SESSION = ${SCRIPT_SESSION}
                    console.log(SCRIPT_SESSION);

            var users = ${users};
            console.log(users.list);

            for (var i = 0; i < users.list.length; i++) {
                var user = users.list[i];
                console.log(moment(user.uptDt).locale(SCRIPT_SESSION.locale).format(SCRIPT_SESSION.dateTimeFormat));
            }
        </script>
    </jsp:attribute>
    <jsp:attribute name="css">
    </jsp:attribute>

    <jsp:attribute name="js">
        <script type="text/javascript" src="http://momentjs.com/downloads/moment.min.js"/>
    </jsp:attribute>

    <jsp:attribute name="header">
    </jsp:attribute>

    <jsp:body>
        <ax:common-code groupCd="AGE_FG" name="age" defaultValue="1234"/>
        <br/><br/>

        <ax:common-code groupCd="AGE_FG" name="age" type="checkbox" defaultValue="60"/>
        <br/><br/>

        <ax:common-code groupCd="AGE_FG" name="age" type="radio" defaultValue="30"/>
    </jsp:body>
</ax:layout>
