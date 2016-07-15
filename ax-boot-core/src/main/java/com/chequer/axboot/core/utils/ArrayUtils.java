package com.chequer.axboot.core.utils;

import java.util.List;

public class ArrayUtils {

	public static boolean isEmpty(List<?> list) {
		return !(list != null && list.size() > 0);
	}

	public static boolean isNotEmpty(List<?> list) {
		return (list != null && list.size() > 0);
	}

}