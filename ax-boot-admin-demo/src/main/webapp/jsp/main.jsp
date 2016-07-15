<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ax" uri="http://axisj.com/axu4j" %>
<ax:layout name="frame.jsp">
	<ax:div name="css">
		<style type="text/css">
			#content-frame-container{
				position: absolute;
				left:0px;
				top: 93px;
				width: 100%;
				height: 100%;
			}
			.contextMenuItem{
				font-size: 13px;
			}
			.contextMenuItem i.axi{
				font-size: 14px;
				margin-right: 5px;
			}
		</style>
	</ax:div>
	<ax:div name="contents">
		<div id="content-frame-container" class="frame-container"></div>
	</ax:div>
	<ax:div name="scripts">
		<script type="text/javascript" src="<c:url value='/static/js/common/frame.js' />"></script>
	</ax:div>
</ax:layout>
