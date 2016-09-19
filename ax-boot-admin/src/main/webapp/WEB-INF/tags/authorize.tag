<%@ tag import="com.chequer.axboot.core.code.Types" %>
<%@ tag import="com.chequer.axboot.core.utils.SessionUtils" %>
<%@ tag import="org.apache.commons.lang3.StringUtils" %>
<%@ tag import="org.springframework.security.core.GrantedAuthority" %>
<%@ tag import="org.springframework.security.core.userdetails.UserDetails" %>
<%@ tag import="java.util.Collection" %>
<%@ tag language="java" pageEncoding="UTF-8" body-content="scriptless" %>
<%@ attribute name="role" required="true" %>
<%@ attribute name="type" required="false" %>

<%
    Types.Role targetRole = Types.Role.of(role);

    if (StringUtils.isEmpty(type)) {
        type = "eq";
    }

    boolean hasAuthority = false;

    UserDetails userDetails = SessionUtils.getCurrentUserDetail();
    if (userDetails != null) {
        Collection<? extends GrantedAuthority> grantedAuthorityList = userDetails.getAuthorities();

        for (GrantedAuthority grantedAuthority : grantedAuthorityList) {
            String authority = grantedAuthority.getAuthority();
            try {
                Types.Role userRole = Types.Role.of(authority);

                if (Types.Role.checkAuthority(userRole, targetRole, type)) {
                    hasAuthority = true;
                    break;
                }
            } catch (Exception e) {
                // ignore
            }
        }
    }
%>

<%if (hasAuthority) {%>
<jsp:doBody/>
<%}%>