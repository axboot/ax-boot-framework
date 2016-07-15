package com.chequer.axboot.core.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieUtils {


    public static void addCookie(HttpServletResponse response, String key, String value) {
        addCookie(response, key, value, -1);
    }

    public static void addCookie(String key, String value) {
        addCookie(HttpUtils.getCurrentResponse(), key, value, -1);
    }

    public static void addCookie(HttpServletResponse response, String key, String value, int maxAge) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath(ContextUtil.getCookieContextPath());

        addCookie(response, cookie);
    }

    public static void addCookie(String key, String value, int maxAge) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath(ContextUtil.getCookieContextPath());

        addCookie(HttpUtils.getCurrentResponse(), cookie);
    }

    public static void addCookie(HttpServletResponse response, Cookie cookie) {
        if (response == null) {
            response = HttpUtils.getCurrentResponse();
        }

        if (response != null) {
            response.addCookie(cookie);
        }
    }

    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String key) {
        Cookie cookie = getCookie(request, key);
        if (cookie != null) {
            cookie.setPath(cookie.getPath());
            cookie.setMaxAge(0);
            addCookie(response, cookie);
        }
    }

    public static void deleteCookie(String key) {
        Cookie cookie = getCookie(HttpUtils.getCurrentRequest(), key);
        if (cookie != null) {
            cookie.setPath(cookie.getPath());
            cookie.setMaxAge(0);
            addCookie(HttpUtils.getCurrentResponse(), cookie);
        }
    }

    public static Cookie getCookie(HttpServletRequest request, String key) {
        if (request != null) {
            if (request.getCookies() != null && request.getCookies().length > 0) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals(key)) {
                        return cookie;
                    }
                }
            }
        }
        return null;
    }

    public static Cookie getCookie(String key) {
        HttpServletRequest request = HttpUtils.getCurrentRequest();
        return getCookie(request, key);
    }

    public static String getCookieValue(HttpServletRequest request, String key) {
        Cookie cookie = getCookie(request, key);

        if (cookie != null) {
            return cookie.getValue();
        }

        return null;
    }

    public static String getCookieValue(String key) {
        Cookie cookie = getCookie(HttpUtils.getCurrentRequest(), key);

        if (cookie != null) {
            return cookie.getValue();
        }

        return null;
    }
}
