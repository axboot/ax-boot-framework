package com.chequer.axboot.core.utils;

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class BeanValidator implements Validator {
    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }

    @Override
    public void validate(Object o, Errors errors) {
    }
}
