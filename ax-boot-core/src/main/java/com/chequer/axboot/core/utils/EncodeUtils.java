package com.chequer.axboot.core.utils;

import java.net.URLEncoder;

public class EncodeUtils {

	public static String encodeDownloadFileName(String s) {
		try {
			return URLEncoder.encode(s, "UTF-8").replaceAll("\\+", "%20");
		} catch (Exception e) {
			// ignore
		}
		return "";
	}
}

