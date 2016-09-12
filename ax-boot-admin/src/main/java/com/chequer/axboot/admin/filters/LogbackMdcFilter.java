package com.chequer.axboot.admin.filters;


import com.chequer.axboot.admin.utils.SessionUtils;
import com.chequer.axboot.core.utils.HttpUtils;
import com.chequer.axboot.core.utils.MDCUtil;
import com.chequer.axboot.core.utils.RequestWrapper;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class LogbackMdcFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (!HttpUtils.isMultipartFormData((HttpServletRequest) request)) {
            RequestWrapper requestWrapper = RequestWrapper.of(request);

            MDCUtil.setJsonValue(MDCUtil.HEADER_MAP_MDC, requestWrapper.getRequestHeaderMap());
            MDCUtil.setJsonValue(MDCUtil.PARAMETER_BODY_MDC, requestWrapper.getRequestBodyJson());
            MDCUtil.setJsonValue(MDCUtil.USER_INFO_MDC, SessionUtils.getCurrentMdcLoginUser((HttpServletRequest) request));
            MDCUtil.set(MDCUtil.REQUEST_URI_MDC, requestWrapper.getRequestUri());
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
