<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ tag import="com.chequer.axboot.core.utils.ContextUtil" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="name" required="true" %>
<%@ attribute name="title" %>
<%@ attribute name="script" fragment="true" %>
<%@ attribute name="js" fragment="true" %>
<%@ attribute name="css" fragment="true" %>
<%@ attribute name="header" fragment="true" %>
<%@ attribute name="buttons" fragment="true" %>

<c:choose>
    <c:when test="${name eq 'empty'}">
        <%@ include file="layout/empty.tag" %>
    </c:when>

    <c:when test="${name eq 'base'}">
        <%@ include file="layout/base.tag" %>
    </c:when>

    <c:when test="${name eq 'frame'}">
        <%@ include file="layout/frame.tag" %>
    </c:when>

    <c:when test="${name eq 'modal'}">
        <%@ include file="layout/modal.tag" %>
    </c:when>

    <c:when test="${name eq 'devTools'}">
        <%@ include file="layout/devTools.tag" %>
    </c:when>

    <c:otherwise>
        <%@ include file="layout/base.tag" %>
    </c:otherwise>
</c:choose>