package com.chequer.axboot.admin.interceptor;

import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.MDCUtil;
import com.chequer.axboot.core.utils.PhaseUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;


public class HttpRequestInterceptor extends HandlerInterceptorAdapter {

    private static Map<String, Object> config = null;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        setExternalConfiguration(request, response);
        return true;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        MDCUtil.clear();
    }

    private synchronized void setExternalConfiguration(HttpServletRequest request, HttpServletResponse response) {
        try {
            if (config == null || !PhaseUtils.isProduction()) {
                config = JsonUtils.fromJsonToMap(IOUtils.toString(new ClassPathResource("axboot.json").getInputStream(), "UTF-8"));
            }

            request.setAttribute("config", config);
        } catch (Exception e) {
            // ignore
        }
    }
}
