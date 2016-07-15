package com.chequer.axboot.core.utils;

import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class PropertyUtils implements EnvironmentAware {

    private static Environment environment;

    @Override
    public void setEnvironment(Environment _environment) {
        environment = _environment;
    }

    public static boolean getPropertyBoolean(String key, boolean defaultValue) {
        String value = environment.getProperty(key, Boolean.toString(defaultValue));
        return Boolean.valueOf(value);
    }

    public static String getPropertyString(String key, String defaultValue) {
        return environment.getProperty(key, defaultValue);
    }

    public static long getPropertyLong(String key, long defaultValue) {
        String value = environment.getProperty(key, Long.toString(defaultValue));
        return Long.parseLong(value);
    }

    public static int getPropertyInt(String key, int defaultValue) {
        String value = environment.getProperty(key, Integer.toString(defaultValue));
        return Integer.parseInt(value);
    }

    public static boolean exist(String key) {
        return environment.getProperty(key) != null;
    }
}
