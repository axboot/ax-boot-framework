package ${basePackage}.security;

import ${basePackage}.AXBootSecurityConfig;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.utils.ContextUtil;
import com.chequer.axboot.core.utils.HttpUtils;
import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.RequestUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AXBootAuthenticationFilter extends GenericFilterBean {

    private final AXBootTokenAuthenticationService tokenAuthenticationService;

    public AXBootAuthenticationFilter(AXBootTokenAuthenticationService adminTokenAuthenticationService) {
        this.tokenAuthenticationService = adminTokenAuthenticationService;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        try {
            SecurityContextHolder.getContext().setAuthentication(tokenAuthenticationService.getAuthentication((HttpServletRequest) req, (HttpServletResponse) res));
            chain.doFilter(req, res);
        } catch (AccessDeniedException e) {
            HttpServletRequest request = (HttpServletRequest) req;
            HttpServletResponse response = (HttpServletResponse) res;

            RequestUtils requestUtils = RequestUtils.of(request);

            if (requestUtils.isAjax()) {
                ApiResponse apiResponse = new ApiResponse();
                apiResponse.setMessage("접근권한이 없습니다");

                response.setContentType(HttpUtils.getJsonContentType(request));
                response.getWriter().write(JsonUtils.toJson(apiResponse));
                response.getWriter().flush();
            } else {
                response.sendRedirect(ContextUtil.getPagePath(AXBootSecurityConfig.ACCESS_DENIED_PAGE));
            }
        }
    }
}
