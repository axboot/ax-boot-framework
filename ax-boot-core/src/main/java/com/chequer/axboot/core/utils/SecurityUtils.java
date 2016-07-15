package com.chequer.axboot.core.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    public static UserDetails getCurrentUserDetail() {
        try {
            return (UserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        } catch (Exception e) {
            // ignore
        }
        return null;
    }
}
