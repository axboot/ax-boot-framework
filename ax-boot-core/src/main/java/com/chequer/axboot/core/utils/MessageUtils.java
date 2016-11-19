package com.chequer.axboot.core.utils;

import com.chequer.axboot.core.context.AppContextManager;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.MessageSource;

import javax.servlet.http.HttpServletRequest;
import java.util.Locale;

public class MessageUtils {

    public static MessageSource messageSource = null;

    public static String getMessage(HttpServletRequest request, String code, String arguments) {
        String message = null;

        try {
            if (messageSource == null) {
                messageSource = AppContextManager.getBean(MessageSource.class);
            }

            Locale locale = RequestUtils.getLocale(request);


            if (StringUtils.isNotEmpty(arguments)) {
                message = messageSource.getMessage(code, arguments.split(","), locale);
            } else {
                message = messageSource.getMessage(code, null, locale);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return message;
    }

    public static String getMessage(HttpServletRequest request, String code) {
        return getMessage(request, code, null);
    }
}
