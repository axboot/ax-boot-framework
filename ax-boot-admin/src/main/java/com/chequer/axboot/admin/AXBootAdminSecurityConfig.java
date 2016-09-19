package com.chequer.axboot.admin;

import com.chequer.axboot.admin.filters.LogbackMdcFilter;
import com.chequer.axboot.admin.security.*;
import com.chequer.axboot.core.code.GlobalConstants;
import com.chequer.axboot.core.domain.user.UserService;
import com.chequer.axboot.core.session.RedisSessionHandler;
import com.chequer.axboot.core.utils.CookieUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@EnableWebSecurity
@Configuration
public class AXBootAdminSecurityConfig extends WebSecurityConfigurerAdapter {

    public static final String LOGIN_API = "/api/login";
    public static final String LOGOUT_API = "/api/logout";
    public static final String LOGIN_PAGE = "/jsp/login.jsp";
    public static final String ROLE = "ASP_ACCESS";

    public static final String[] ignorePages = new String[]{
            "/resources/**",
            "/assets/**",
            "/layouts/**",
            "/jsp/common/**",
            "/swagger/**",
            "/api-docs/**",
            "/h2-console/**",
            "/health"
    };

    @Inject
    private RedisSessionHandler redisSessionHandler;

    @Inject
    private AdminUserDetailsService userDetailsService;

    @Inject
    private UserService userService;

    @Inject
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Inject
    private AdminTokenAuthenticationService tokenAuthenticationService;

    public AXBootAdminSecurityConfig() {
        super(true);
    }

    @Override
    public void configure(WebSecurity webSecurity) throws Exception {
        webSecurity.ignoring().antMatchers(ignorePages);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .anonymous()
                .and()

                .authorizeRequests().anyRequest().hasRole(ROLE)
                .antMatchers(HttpMethod.POST, LOGIN_API).permitAll()
                .antMatchers(LOGIN_PAGE).permitAll()
                .and()

                .formLogin().loginPage(LOGIN_PAGE).permitAll()
                .and()

                .logout().logoutUrl(LOGOUT_API).addLogoutHandler(new RedisLogoutHandler()).logoutSuccessHandler(new LogoutSuccessHandler(LOGIN_PAGE))
                .and()

                .exceptionHandling().authenticationEntryPoint(new AdminAuthenticationEntryPoint())
                .and()

                .addFilterBefore(new AdminLoginFilter(LOGIN_API, tokenAuthenticationService, userService, authenticationManager()), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new AdminAuthenticationFilter(tokenAuthenticationService), UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(new LogbackMdcFilter(), UsernamePasswordAuthenticationFilter.class);

    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(bCryptPasswordEncoder);
        daoAuthenticationProvider.setHideUserNotFoundExceptions(false);
        return daoAuthenticationProvider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Override
    protected AdminUserDetailsService userDetailsService() {
        return userDetailsService;
    }

    class RedisLogoutHandler implements LogoutHandler {
        @Override
        public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
            String token = CookieUtils.getCookieValue(request, GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
            redisSessionHandler.logout(token);
        }
    }

    class LogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {

        public LogoutSuccessHandler(String defaultTargetURL) {
            this.setDefaultTargetUrl(defaultTargetURL);
        }

        @Override
        public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
            CookieUtils.deleteCookie(GlobalConstants.ADMIN_AUTH_TOKEN_KEY);
            CookieUtils.deleteCookie(GlobalConstants.LAST_NAVIGATED_PAGE);
            request.getSession().invalidate();
            super.onLogoutSuccess(request, response, authentication);
        }
    }
}
