package com.chequer.axboot.core.api;

public class BadRequestException extends Exception {
	private int code;

	public BadRequestException(int code, String message) {
		super(message);
		this.code = code;
	}
}
