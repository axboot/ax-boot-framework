<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="style" %>
<%@ attribute name="align" %>
<%@ attribute name="valign" %>

<table style="${style}">
    <tr>
        <td align="${align}" valign="${valign}">
            <jsp:doBody/>
        </td>
    </tr>
</table>