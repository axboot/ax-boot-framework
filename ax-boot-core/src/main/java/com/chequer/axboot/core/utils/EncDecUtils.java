package com.chequer.axboot.core.utils;

import org.apache.commons.lang3.StringUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

public class EncDecUtils {

    public static String encode(String s) {
        if (!StringUtils.isEmpty(s)) {
            try {
                return URLEncoder.encode(s, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }

        return "";
    }

    public static String decode(String s) {
        if (!StringUtils.isEmpty(s)) {
            try {
                return URLDecoder.decode(s, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }

        return "";
    }


    public static String encodeDownloadFileName(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8").replaceAll("\\+", "%20");
        } catch (Exception e) {
            // ignore
        }
        return "";
    }
}
