package com.chequer.axboot.core.utils;

import javax.servlet.http.HttpServletRequest;

public class DataExchangeUtils {

    public static void setAttribute(String key, Object value) {
        HttpServletRequest request = HttpUtils.getCurrentRequest();
        request.setAttribute(key, value);
    }
}
