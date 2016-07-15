package com.chequer.axboot.core.db.monitor.sql;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class SqlTaskPool {
	protected final Logger logger = LoggerFactory.getLogger(SqlTaskPool.class);

	private static final int DEFAULT_MANAGED_SIZE = 1000;

	private Map<String, SqlExecutionInfo> sqlTaskMap;

	public SqlTaskPool() {
		this(DEFAULT_MANAGED_SIZE);
	}

	public SqlTaskPool(int initialSize) {
		sqlTaskMap = new LinkedHashMap<String, SqlExecutionInfo>(initialSize) {
			@Override
			public SqlExecutionInfo get(Object key) {
				return super.get(StringUtils.trim((String) key));
			}

			@Override
			public SqlExecutionInfo put(String key, SqlExecutionInfo value) {
				return super.put(StringUtils.trim((String) key), value);
			}

			@Override
			protected boolean removeEldestEntry(Map.Entry<String, SqlExecutionInfo> eldest) {
				if (size() < DEFAULT_MANAGED_SIZE) {
					return false;
				}

				if (logger.isDebugEnabled()) {
					logger.debug("too many sql query.. oldest query '{}' is discarded", eldest.getKey());
				}
				return true;
			}
		};
	}

	public synchronized List<SqlExecutionInfo> getSqlExecutionInfoList() {
		return new ArrayList<>(sqlTaskMap.values());
	}

	public synchronized SqlExecutionInfo find(String currentSql) {
		return this.sqlTaskMap.get(currentSql);
	}

	public synchronized SqlExecutionInfo get(String currentSql) {
		SqlExecutionInfo info = sqlTaskMap.get(currentSql);
		if (info == null) {
			info = new SqlExecutionInfo(currentSql);
			sqlTaskMap.put(currentSql, info);
		}
		return info;
	}

	public synchronized void put(String currentSql, SqlExecutionInfo info) {
		sqlTaskMap.put(currentSql, info);
	}

	public synchronized void reset() {
		sqlTaskMap.clear();
	}

	public synchronized int size() {
		return sqlTaskMap.size();
	}

	Map<String, SqlExecutionInfo> getSqlTaskMap() {
		return sqlTaskMap;
	}

}
