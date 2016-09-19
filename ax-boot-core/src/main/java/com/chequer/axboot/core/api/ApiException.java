package com.chequer.axboot.core.api;


import com.chequer.axboot.core.code.ApiStatus;

public class ApiException extends RuntimeException {
    private int code;
    private boolean isAlert = false;

    public ApiException(int code, String message, boolean isAlert) {
        super(message);
        this.code = code;
        this.isAlert = isAlert;
    }

    public ApiException(int code, String message) {
        super(message);
        this.code = code;
    }

    public ApiException(ApiStatus status, String message) {
        super(message);
        this.code = status.getCode();
    }


    public ApiException(String message) {
        super(message);
        this.code = ApiStatus.SUCCESS.getCode();
    }

    public ApiException(ApiStatus code, String message, boolean isAlert) {
        super(message);
        this.code = code.getCode();
        this.isAlert = isAlert;
    }

    public int getCode() {
        return this.code;
    }
    public boolean isAlert() { return isAlert; }
}
