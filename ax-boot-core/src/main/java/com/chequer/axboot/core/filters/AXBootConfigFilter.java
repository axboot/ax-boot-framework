package com.chequer.axboot.core.filters;

import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.PhaseUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;

import javax.servlet.*;
import java.io.IOException;
import java.util.Map;

public class AXBootConfigFilter implements Filter {
    private static Map<String, Object> config = null;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try {
            if (config == null || !PhaseUtils.isProduction()) {
                config = JsonUtils.fromJsonToMap(IOUtils.toString(new ClassPathResource("axboot.json").getInputStream(), "UTF-8"));
            }
            servletRequest.setAttribute("config", config);
        } catch (Exception e) {
            // ignore
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
