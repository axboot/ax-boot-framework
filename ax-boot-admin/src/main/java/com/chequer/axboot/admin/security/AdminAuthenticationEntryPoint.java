package com.chequer.axboot.admin.security;

import com.chequer.axboot.admin.AXBootAdminSecurityConfig;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.GlobalConstants;
import com.chequer.axboot.core.utils.ContextUtil;
import com.chequer.axboot.core.utils.CookieUtils;
import com.chequer.axboot.core.utils.HttpUtils;
import com.chequer.axboot.core.utils.JsonUtils;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AdminAuthenticationEntryPoint extends BasicAuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        CookieUtils.deleteCookie(request, response, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);

        if (request.getMethod().equals(RequestMethod.GET.toString()) && !request.getRequestURI().startsWith(ContextUtil.getBaseApiPath())) {
            redirectToLoginPage(request, response);
        } else {
            jsonExceptionResponse(request, response, ApiResponse.redirect(ContextUtil.getPagePath(AXBootAdminSecurityConfig.LOGIN_PAGE)));
        }
    }

    public static void jsonExceptionResponse(HttpServletRequest request, HttpServletResponse response, ApiResponse apiResponse) throws IOException {
        response.setContentType(HttpUtils.getJsonContentType(request));
        response.getWriter().write(JsonUtils.toJson(apiResponse));
        response.getWriter().flush();
    }

    public static void redirectToLoginPage(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendRedirect(ContextUtil.getPagePath(AXBootAdminSecurityConfig.LOGIN_PAGE));
    }
}

