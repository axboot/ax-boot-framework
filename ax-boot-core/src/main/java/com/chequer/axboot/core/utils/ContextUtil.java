package com.chequer.axboot.core.utils;

import com.chequer.axboot.core.context.AppContextManager;

import javax.servlet.ServletContext;

public class ContextUtil {

    private static ServletContext _servletContext;

    public static String getBaseApiPath() {
        return getContext() + "/api";
    }

    public static String getContext() {
        try {
            if (_servletContext == null) {
                _servletContext = AppContextManager.getBean(ServletContext.class);
            }
            return _servletContext.getContextPath().equals("/") ? "" : _servletContext.getContextPath();
        } catch (Exception e) {
            // ignore;
        }
        return "/";
    }

    public static String getPagePath(String path) {
        return getContext() + path;
    }

    public static String getCookieContextPath() {
        return getContext().equals("") ? "/" : getContext();
    }
}
