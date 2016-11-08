package com.chequer.axboot.core.utils;


import com.chequer.axboot.core.code.AXBootTypes;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class PhaseUtils implements EnvironmentAware {

    private static Environment environment;

    @Override
    public void setEnvironment(Environment _environment) {
        environment = _environment;
    }

    public static String phase() {
        String[] activeProfiles = environment.getActiveProfiles();
        String activeProfile = AXBootTypes.ApplicationProfile.LOCAL;

        if (activeProfiles != null && activeProfiles.length > 0) {
            activeProfile = activeProfiles[0];
        }

        return activeProfile;
    }

    public static boolean isLocal() {
        return phase().equals(AXBootTypes.ApplicationProfile.LOCAL);
    }

    public static boolean isAlpha() {
        return phase().equals(AXBootTypes.ApplicationProfile.ALPHA);
    }

    public static boolean isBeta() {
        return phase().equals(AXBootTypes.ApplicationProfile.BETA);
    }

    public static boolean isProduction() {
        return phase().equals(AXBootTypes.ApplicationProfile.PRODUCTION);
    }

    public static Environment getEnvironment() {
        return environment;
    }

    public static boolean isDevelopmentMode() {
        return isLocal() || Boolean.parseBoolean(System.getProperty("axboot.profiles.development"));
    }
}

