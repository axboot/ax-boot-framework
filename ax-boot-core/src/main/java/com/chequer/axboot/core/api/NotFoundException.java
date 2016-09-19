package com.chequer.axboot.core.api;

public class NotFoundException extends RuntimeException {
    private int code;

    public NotFoundException(int code, String message) {
        super(message);
        this.code = code;
    }
}
