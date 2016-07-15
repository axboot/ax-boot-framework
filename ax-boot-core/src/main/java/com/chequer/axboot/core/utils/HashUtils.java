package com.chequer.axboot.core.utils;

import org.apache.commons.codec.digest.DigestUtils;

public class HashUtils {

	public static String MD5(String str) {
		byte[] bytes = DigestUtils.md5(str);
		return bytesToString(bytes);
	}

	public static String SHA256(String str) {
		byte[] bytes = DigestUtils.sha256(str);
		return bytesToString(bytes);
	}

	public static String SHA512(String str) {
		byte[] bytes = DigestUtils.sha512(str);
		return bytesToString(bytes);
	}

	public static String SHA1(String str) {
		byte[] bytes = DigestUtils.sha1(str);
		return bytesToString(bytes);

	}

	public static String bytesToString(byte[] bytes) {
		StringBuilder sb = new StringBuilder();
		for (byte _byte : bytes) {
			sb.append(Integer.toString((_byte & 0xff) + 0x100, 16).substring(1));
		}
		return sb.toString();
	}
}
