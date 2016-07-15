package com.chequer.axboot.core.utils;

import eu.bitwalker.useragentutils.Browser;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HttpUtils {

    public static HttpServletRequest getCurrentRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
    }

    public static HttpServletResponse getCurrentResponse() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
    }

    public static String getJsonContentType(HttpServletRequest request) {
        Browser browser = AgentUtils.getBrowser(request);

        if (browser != null && browser == Browser.IE) {
            return "text/plain; charset=UTF-8";
        }

        return "application/json; charset=UTF-8";
    }

    public static boolean isMultipartFormData(HttpServletRequest request) {
        try {
            return request.getHeader("content-type").contains("multipart");
        } catch (Exception e) {
            // ignore
        }
        return false;
    }

    public static boolean isMultipartFormData() {
        return isMultipartFormData(getCurrentRequest());
    }
}