package com.chequer.axboot.core.db;

import com.chequer.axboot.core.code.Types;
import org.apache.commons.lang3.StringUtils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class QueryNormalizer {
	private static final String DATE_FORMAT = "yyyy/MM/dd HH:mm:ss.SSS";
	private Boolean dumpBooleanAsTrueFalse = false;

	public String format(String databaseType, String query, List<Object> parameters) {
		if (StringUtils.isEmpty(query) || query.indexOf('?') < 0) {
			return query;
		}

		StringBuilder builder = new StringBuilder(query.length() << 1);

		int index = 1;
		int queryPrev = trim(query, 0);

		for (int queryCurrent = queryPrev; queryCurrent < query.length(); ) {
			if (parameters != null && query.charAt(queryCurrent) == '?') {
				builder.append(query.substring(queryPrev, queryCurrent));
				builder.append(parameters.size() > index ? convert(databaseType, parameters.get(index)) : null);
				queryPrev = ++queryCurrent;
				index++;
				continue;
			}

			if (query.charAt(queryCurrent) == '\t') {
				builder.append(query.substring(queryPrev, queryCurrent));
				builder.append('\n').append("    ");

				queryPrev = queryCurrent += trim(query, queryCurrent);
				continue;
			}

			if (query.charAt(queryCurrent) == '\n') {
				builder.append(query.substring(queryPrev, queryCurrent + 1));
				builder.append("    ");

				queryPrev = queryCurrent += trim(query, queryCurrent);
				continue;
			}

			queryCurrent++;
		}

		if (queryPrev < query.length()) {
			builder.append(query.substring(queryPrev));
		}

		return builder.toString();
	}

	private int trim(String query, int queryCurrent) {
		int trim = 0;

		for (; query.length() > queryCurrent + trim && query.charAt(queryCurrent + trim) < ' '; trim++) {
		}

		return trim;
	}

	private String convert(String databaseType, Object parameter) {
		if (parameter == null) {
			return "n";
		}

		if (parameter instanceof String) {
			return "'" + parameter + "'";
		}

		if (parameter instanceof Boolean) {
			return dumpBooleanAsTrueFalse ? ((Boolean) parameter).booleanValue() ? "true" : "false" : ((Boolean) parameter).booleanValue() ? "1" : "0";
		}

		if (Types.DatabaseType.ORACLE.equals(databaseType)) {
			if (parameter instanceof Timestamp) {
				return "to_timestamp('" + new SimpleDateFormat("yyyy/MM/dd HH:mm:ss.SSS").format(parameter) + "', 'yyyy/mm/dd hh24:mi:ss.ff3')";
			}

			if (parameter instanceof Date) {
				return "to_date('" + new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(parameter) + "', 'yyyy/mm/dd hh24:mi:ss')";
			}
		} else {
			if (parameter instanceof Date) {
				return "'" + new SimpleDateFormat(DATE_FORMAT).format(parameter) + "'";
			}
		}

		return String.valueOf(parameter);
	}
}
