package com.chequer.axboot.admin.security;

import com.chequer.axboot.admin.domain.user.LoginUser;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.ApiStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AdminLoginFilter extends AbstractAuthenticationProcessingFilter {

    private final AdminTokenAuthenticationService adminTokenAuthenticationService;

    public AdminLoginFilter(String urlMapping, AdminTokenAuthenticationService adminTokenAuthenticationService, AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher(urlMapping));

        this.adminTokenAuthenticationService = adminTokenAuthenticationService;
        this.setAuthenticationFailureHandler(new LoginFailureHandler());
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        final LoginUser user = new ObjectMapper().readValue(request.getInputStream(), LoginUser.class);
        final UsernamePasswordAuthenticationToken loginToken = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        return getAuthenticationManager().authenticate(loginToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        final AdminUserAuthentication userAuthentication = new AdminUserAuthentication((LoginUser) authentication.getPrincipal());
        adminTokenAuthenticationService.addAuthentication(response, userAuthentication);

        SecurityContextHolder.getContext().setAuthentication(userAuthentication);

        chain.doFilter(request, response);
    }

    class LoginFailureHandler implements AuthenticationFailureHandler {
        @Override
        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
            String message = exception.getMessage();

            if (exception instanceof BadCredentialsException) {
                message = "계정정보를 확인하세요";
            }

            ApiResponse apiResponse = ApiResponse.error(ApiStatus.SYSTEM_ERROR, message);
            AdminAuthenticationEntryPoint.jsonExceptionResponse(request, response, apiResponse);
        }
    }
}
