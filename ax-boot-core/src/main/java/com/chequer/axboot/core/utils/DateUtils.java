package com.chequer.axboot.core.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class DateUtils {

    private final static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private final static SimpleDateFormat simpleDateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat simpleTimeFormat = new SimpleDateFormat("HH:mm");
    private final static SimpleDateFormat julianDateFormat = new SimpleDateFormat("yyyyDDD");
    private final static SimpleDateFormat yyyyMMdd = new SimpleDateFormat("yyyyMMdd");
    private final static SimpleDateFormat yyyy = new SimpleDateFormat("yyyy");
    private final static SimpleDateFormat yyyyMM = new SimpleDateFormat("yyyyMM");
    private final static SimpleDateFormat yyyyMmddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");

    private final static DateTimeFormatter yyyyMMddFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

    public static Date now() {
        return new Date();
    }

    public static Date parseDate(String applyDt) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        return simpleDateFormat.parse(applyDt + "000000");
    }

    public static String formatToDateString(String format) {
        DateFormat dateFormat = new SimpleDateFormat(format);
        Date date = new Date();
        return dateFormat.format(date);
    }

    public static String getDateYyyyMmdd() {
        return simpleDateFormat.format(new Date());
    }

    public static String getHHmm() {
        return simpleTimeFormat.format(new Date());
    }

    public static String getHHmmss() {
        return new SimpleDateFormat("HHmmss").format(new Date());
    }

    public static String getDateYyyyMmddWithoutDash() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        return simpleDateFormat.format(new Date());
    }

    public static String getDateYyyyMmWithoutDash() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMM");
        return simpleDateFormat.format(new Date());
    }

    public static String getTimeHHmmssWithoutDash() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HHmmss");
        return simpleDateFormat.format(new Date());
    }

    public static String yesterDay() {
        Calendar calendar = new GregorianCalendar();
        calendar.add(Calendar.DATE, -1);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        return simpleDateFormat.format(calendar.getTime());
    }

    public static String getIIACTranDateTime() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss.SSS");
        return simpleDateFormat.format(new Date());
    }

    public static String getYyyyMMddHHmmssWithDate() {
        return simpleDateTimeFormat.format(new Date());
    }

    public static String getYyyyMMddHHmmssWithoutDate() {
        return yyyyMmddHHmmss.format(new Date());
    }

    public static String getYyyyMMddWithoutDate() {
        return yyyyMMdd.format(new Date());
    }

    public static String getPreviousDay() {
        LocalDate localDate = LocalDate.now();
        localDate = localDate.plusDays(-1);

        return localDate.format(yyyyMMddFormatter);
    }

    public static String dateToYyyyMmddString(Date date) {
        return simpleDateFormat.format(date);
    }

    public static String julianToYyyyMMdd(String julianDate) throws ParseException {
        Calendar today = getCalendar();

        Integer year = currentYear();

        if (today.get(Calendar.MONTH) == Calendar.DECEMBER) {
            if (Integer.parseInt(julianDate) <= 1) {
                year = nextYear();
            }
        }

        Date date = julianDateFormat.parse(year + julianDate);
        return yyyyMMdd.format(date);
    }

    public static Integer currentYear() {
        return Integer.parseInt(yyyy.format(new Date()));
    }

    public static String currentMonth() {
        return yyyyMM.format(new Date());
    }

    public static Integer nextYear() {
        Calendar calendar = getCalendar();
        calendar.add(Calendar.YEAR, 1);
        return Integer.parseInt(yyyy.format(calendar.getTime()));
    }

    public static Calendar getCalendar() {
        return Calendar.getInstance(TimeZone.getTimeZone(ZoneId.of("Asia/Seoul")));
    }

    public static Date toYyyyMMddToDate(String date) throws ParseException {
        return yyyyMMdd.parse(date);
    }

    public static Date toyyyyMMddHHmmssToDate(String date) throws ParseException {
        return yyyyMmddHHmmss.parse(date);
    }

    public static String getTodayLastTime() {
        return "235959";
    }
}
