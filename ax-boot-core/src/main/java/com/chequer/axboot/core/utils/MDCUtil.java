package com.chequer.axboot.core.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.slf4j.spi.MDCAdapter;

public class MDCUtil {
	private static MDCAdapter mdc = MDC.getMDCAdapter();

	public static final String HEADER_MAP_MDC = "HEADER_MAP_MDC";

	public static final String PARAMETER_BODY_MDC = "PARAMETER_BODY_MDC";

	public static final String USER_INFO_MDC = "USER_INFO_MDC";

	public static final String REQUEST_URI_MDC = "REQUEST_URI_MDC";

	private static Logger logger = LoggerFactory.getLogger(MDCUtil.class);

	public static void set(String key, String value) {
		mdc.put(key, value);
	}

	public static void setJsonValue(String key, Object value) {
		try {
			if (value != null) {
				String json = JsonUtils.toJson(value);
				mdc.put(key, json);
			}
		} catch (Exception e) {
			// ignored
		}
	}

	public static String get(String key) {
		return mdc.get(key);
	}

	public static void clear() {
		MDC.clear();
	}
}
