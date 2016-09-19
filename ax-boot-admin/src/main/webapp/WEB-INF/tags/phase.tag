<%@ tag import="com.chequer.axboot.core.utils.PhaseUtils" %>
<%@ tag import="java.util.Arrays" %>
<%@ tag import="java.util.List" %>
<%@ tag import="static java.util.stream.Collectors.toList" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="phase" required="true" %>
<%
    boolean phaseMatched = false;
    String currentPhase = PhaseUtils.phase();

    List<String> phaseList = Arrays.stream(phase.split(",")).collect(toList());

    for (String targetPhase : phaseList) {
        if (targetPhase.equals(currentPhase)) {
            phaseMatched = true;
            break;
        }
    }
%>

<%if (phaseMatched) {%>
<jsp:doBody/>
<%}%>