package com.chequer.axboot.admin.security;

import com.chequer.axboot.core.domain.user.SessionUser;
import com.chequer.axboot.core.domain.user.User;
import com.chequer.axboot.core.domain.user.UserService;
import com.chequer.axboot.core.utils.HttpUtils;
import com.chequer.axboot.core.utils.JsonUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;

public class AdminLoginFilter extends AbstractAuthenticationProcessingFilter {

    private final AdminTokenAuthenticationService adminTokenAuthenticationService;
    private final AdminAuthenticationEntryPoint adminAuthenticationEntryPoint;
    private final UserService userService;

    public AdminLoginFilter(String urlMapping, AdminTokenAuthenticationService adminTokenAuthenticationService, UserService userService, AuthenticationManager authenticationManager, AdminAuthenticationEntryPoint adminAuthenticationEntryPoint) {
        super(new AntPathRequestMatcher(urlMapping));

        this.adminTokenAuthenticationService = adminTokenAuthenticationService;
        this.userService = userService;
        this.adminAuthenticationEntryPoint = adminAuthenticationEntryPoint;
        this.setAuthenticationFailureHandler(new LoginFailureHandler());
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        final SessionUser user = new ObjectMapper().readValue(request.getInputStream(), SessionUser.class);
        final UsernamePasswordAuthenticationToken loginToken = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        return getAuthenticationManager().authenticate(loginToken);
    }

    @Override
    @Transactional
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        final AdminUserAuthentication userAuthentication = new AdminUserAuthentication((SessionUser) authentication.getPrincipal());
        adminTokenAuthenticationService.addAuthentication(response, userAuthentication);

        User user = userService.findOne(userAuthentication.getName());
        user.setIp(HttpUtils.getRemoteAddress(request));
        user.setLastLoginDate(Instant.now());
        userService.save(user);

        response.setContentType(HttpUtils.getJsonContentType(request));
        response.getWriter().write(JsonUtils.toJson(user));
        response.getWriter().flush();
    }

    private class LoginFailureHandler implements AuthenticationFailureHandler {
        @Override
        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
            adminAuthenticationEntryPoint.commence(request, response, exception);
        }
    }
}
