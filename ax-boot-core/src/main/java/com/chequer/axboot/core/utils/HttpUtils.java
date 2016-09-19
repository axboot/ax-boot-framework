package com.chequer.axboot.core.utils;

import eu.bitwalker.useragentutils.Browser;
import org.apache.commons.lang3.StringUtils;
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

    public static String getRemoteAddress() {
        return getRemoteAddress(getCurrentRequest());
    }

    public static String getRemoteAddress(HttpServletRequest request) {
        String clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");

        if (StringUtils.isEmpty(clientIp) || clientIp.toLowerCase().equals("unknown")) {
            clientIp = request.getHeader("REMOTE_ADDR");
        }

        if (StringUtils.isEmpty(clientIp) || clientIp.toLowerCase().equals("unknown")) {
            clientIp = request.getRemoteAddr();
        }

        return clientIp;
    }
}