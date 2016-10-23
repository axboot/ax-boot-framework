package com.chequer.axboot.core.query;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrSubstitutor;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class QueryBase {

	public static final String SINGLE_QUOTE_SIGN = "'";

	public static List<String> specialKeywords = Arrays.asList("groupBy", "where", "fields", "orderBy");

	public static Function<String, String> addSingleQuotes = (s) -> StringUtils.wrap(s, SINGLE_QUOTE_SIGN);

	public static String bindParameter(String query, Map<String, Object> map) {
		Map<String, Object> bindMap = new HashMap<>();

		if (map.size() > 0) {
			for (Object _key : map.keySet()) {
				String key = _key.toString();
				Object value = map.get(key);

				if (value != null) {
					if (value instanceof String) {

						String _value = (String) value;

						if (specialKeywords.contains(key)) {
							// ignore
						} else {
							if (key.startsWith("query")) {
								// ignore
							} else {
								if (!_value.startsWith("'")) {
									_value = "'" + _value + "'";
								}
							}
						}
						bindMap.put((String) key, _value);
					} else {
						bindMap.put((String) key, value);
					}
				} else {
					bindMap.put((String) key, "");
				}
			}
		}

		return new StrSubstitutor(bindMap).replace(query);
	}

	public static String inQuery(List<String> idList) {
		return idList.stream().map(addSingleQuotes).collect(Collectors.joining(","));
	}
}
