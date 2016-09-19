package com.chequer.axboot.core.utils;

import java.util.Locale;

public class DateTimeUtils {

    public static String dateFormatFromLocale(Locale locale) {
        if (locale.equals(Locale.US)) {
            return "mm/dd/yyyy";
        }

        return "yyyy-MM-dd";
    }

    public static String timeFormatFromLocale(Locale locale) {
        return "HH:mm:ss";
    }

    public static String dateTimeFormatFromLocale(Locale locale) {
        return dateFormatFromLocale(locale) + " " + timeFormatFromLocale(locale);
    }
}
