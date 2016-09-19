package com.chequer.axboot.admin.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AdminAuthenticationFilter extends GenericFilterBean {

	private final AdminTokenAuthenticationService tokenAuthenticationService;

	public AdminAuthenticationFilter(AdminTokenAuthenticationService adminTokenAuthenticationService) {
		this.tokenAuthenticationService = adminTokenAuthenticationService;
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		SecurityContextHolder.getContext().setAuthentication(tokenAuthenticationService.getAuthentication((HttpServletRequest) req, (HttpServletResponse) res));
		chain.doFilter(req, res);
	}
}
