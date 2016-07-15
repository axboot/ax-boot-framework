package com.chequer.axboot.core.utils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateTimeUtils {

    public static final DateTimeFormatter AXBOOT_LOCAL_DATE_TIME;
    public static final DateTimeFormatter AXBOOT_LOCAL_DATE;

    static {
        AXBOOT_LOCAL_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        AXBOOT_LOCAL_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    }

    public static String nowDateTimeString() {
        return LocalDateTime.now().format(AXBOOT_LOCAL_DATE_TIME);
    }

    public static String nowDateString() {
        return LocalDateTime.now().format(AXBOOT_LOCAL_DATE);
    }

    public static LocalDateTime dateToLocalDateTime(Date date) {
        if (date == null) {
            return null;
        }

        Instant instant = date.toInstant();
        return LocalDateTime.ofInstant(instant, ZoneId.of("Asia/Seoul"));
    }

    public static Date localDateTimeToDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        Instant instant = dateTime.atZone(ZoneId.systemDefault()).toInstant();
        return Date.from(instant);
    }
}
