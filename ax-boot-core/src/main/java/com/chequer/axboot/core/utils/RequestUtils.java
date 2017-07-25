package com.chequer.axboot.core.utils;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

public class RequestUtils {

    private HttpServletRequest request;

    private RequestUtils(HttpServletRequest request) {
        this.request = request;
    }

    public static RequestUtils of(HttpServletRequest request) {
        RequestUtils requestHelper = new RequestUtils(request);
        return requestHelper;
    }

    public static RequestUtils of(ServletRequest request) {
        return of((HttpServletRequest) request);
    }

    public String getString(String key) {
        return request.getParameter(key);
    }

    public String[] getStringArray(String key) {
        String[] targets = getString(key).split(",");
        return targets;
    }

    public String getString(String key, String defaultValue) {
        String value = getString(key);

        if (StringUtils.isEmpty(value)) {
            return defaultValue;
        }

        return value;
    }

    public int getInt(String key) {
        try {
            return Integer.parseInt(getString(key));
        } catch (Exception e) {
            return 0;
        }
    }

    public int getInt(String key, int defaultValue) {
        String value = getString(key);

        if (StringUtils.isEmpty(value)) {
            return defaultValue;
        }

        return getInt(key);
    }

    public long getLong(String key) {
        try {
            return Long.parseLong(getString(key));
        } catch (Exception e) {
            return 0L;
        }
    }

    public long getLong(String key, long defaultValue) {
        String value = getString(key);

        if (StringUtils.isEmpty(value)) {
            return defaultValue;
        }

        return getLong(key);
    }

    public void setAttribute(String key, Object value) {
        request.setAttribute(key, value);
    }

    public String getStringAttribute(String key) {
        return getStringAttribute(key, "");
    }

    public Object getAttribute(String key) {
        return request.getAttribute(key);
    }

    public String getStringAttribute(String key, String defaultValue) {
        Object value = request.getAttribute(key);

        if (value == null) {
            return defaultValue;
        }

        return value.toString();
    }

    public <T> T getAttributeObject(String key, Class<T> clazz) {
        Object object = getAttribute(key);

        if (object != null) {
            return clazz.cast(object);
        }
        return null;
    }

    public void setSessionAttribute(String key, Object value) {
        request.getSession().setAttribute(key, value);
    }

    public Object getSessionAttributeObject(String key) {
        return request.getSession().getAttribute(key);
    }

    public <T> T getSessionAttributeObject(String key, Class<T> clazz) {
        Object object = getSessionAttributeObject(key);

        if (object != null) {
            return clazz.cast(object);
        }
        return null;
    }


    public String getSessionAttributeString(String key) {
        return getSessionAttributeString(key, "");
    }

    public String getSessionAttributeString(String key, String defaultValue) {
        Object value = getSessionAttributeObject(key);

        if (value == null) {
            return defaultValue;
        }

        return value.toString();
    }

    public boolean hasSessionAttribute(String key) {
        return getSessionAttributeObject(key) != null;
    }

    public boolean hasParameter(String key) {
        if (request.getParameterMap() != null) {
            return request.getParameterMap().containsKey(key);
        }
        return false;
    }

    public Map<String, String> getRequestHeaderMap() {
        Map<String, String> convertedHeaderMap = new HashMap<>();

        Enumeration<String> headerMap = request.getHeaderNames();

        while (headerMap.hasMoreElements()) {
            String name = headerMap.nextElement();
            String value = request.getHeader(name);

            convertedHeaderMap.put(name, value);
        }
        return convertedHeaderMap;
    }

    public Map<String, String> getRequestBodyParameterMap() {
        Map<String, String> convertedParameterMap = new HashMap<>();
        Map<String, String[]> parameterMap = request.getParameterMap();

        if (parameterMap.size() > 0) {
            for (String key : parameterMap.keySet()) {
                String[] values = parameterMap.get(key);
                StringJoiner valueString = new StringJoiner(",");

                for (String value : values) {
                    valueString.add(value);
                }

                convertedParameterMap.put(key, valueString.toString());
            }
        }

        return convertedParameterMap;
    }

    public String getRequestBody() {
        try {
            return IOUtils.toString(request.getInputStream(), "UTF-8");
        } catch (IOException e) {
            // ignored
        }
        return "";
    }

    public String getRequestBodyJson(HttpServletRequest request) {
        String contentType = request.getHeader("content-type");

        if (contentType != null && contentType.contains("application/json")) {
            String body = getRequestBody();

            if (StringUtils.isNotEmpty(body)) {
                return JsonUtils.toPrettyJson(JsonUtils.fromJson(getRequestBody()));
            }
            return "";
        }

        Map<String, String> requestBodyParameterMap = getRequestBodyParameterMap();

        if (requestBodyParameterMap.size() > 0) {
            return JsonUtils.toPrettyJson(requestBodyParameterMap);
        }

        return "";
    }

    public String getRequestUri() {
        return request.getRequestURI();
    }

    public boolean isAjax() {
        String requestedWithHeader = request.getHeader("X-Requested-With");
        return "XMLHttpRequest".equals(requestedWithHeader);
    }

    public static Locale getLocale(HttpServletRequest request) {
        RequestUtils requestUtils = RequestUtils.of(request);
        String language = requestUtils.getString("language");

        Locale locale;

        if (StringUtils.isNotEmpty(language)) {
            locale = new Locale(language);
        } else {
            String localeCookie = CookieUtils.getCookieValue(request, "language");

            if (StringUtils.isNotEmpty(localeCookie)) {
                locale = new Locale(localeCookie);
            } else {
                String acceptLanguage = request.getHeader("Accept-Language");
                String acceptCharset = request.getHeader("Accept-Charset");
                locale = new Locale("ko");
            }
        }

        return locale;
    }
}

