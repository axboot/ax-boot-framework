package com.chequer.axboot.core.db.monitor.sql;

import com.chequer.axboot.core.db.SqlFormatter;
import com.chequer.axboot.core.db.aop.StatementType;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;
import java.util.Date;

public class SqlExecutionInfo implements Serializable {
	private static final long serialVersionUID = -3612708782642882361L;

	private SqlFormatter sqlFormatter = new SqlFormatter();

	protected final Logger logger = LoggerFactory.getLogger(SqlExecutionInfo.class);

	private static final long UNSET = -1;

	private final String sql;
	private final int sqlId;

	private StatementType type;

	private String dataSourceId;

	private long min = UNSET;
	private long max = UNSET;

	private long queryCount;
	private long slowQueryCount;
	private long exceptionCount;
	private long queryTimeoutCount;
	private long socketTimeoutCount;
	private long total;
	private long lastQueryDate;
	private long longestQueryDateTime;

	private Object[] longestQueryParams;

	public SqlExecutionInfo(String sql) {
		this.sql = StringUtils.trim(sql);
		this.sqlId = this.sql.hashCode();
	}

	public boolean isNew() {
		return type == null;
	}

	public void setType(StatementType type) {
		this.type = type;
	}

	public void setDataSourceId(String dataSourceId) {
		this.dataSourceId = dataSourceId;
	}

	public String getDataSourceId() {
		return this.dataSourceId;
	}

	public int getSqlId() {
		return this.sqlId;
	}

	public String getSql() {
		return this.sql;
	}

	public String getFormattedSql() {
		return sqlFormatter.format(this.sql);
	}

	public int getType() {
		return type == null ? 0 : type.ordinal();
	}

	public synchronized void appendTaskTime(long taskTime, Object... parametervalues) {
		this.lastQueryDate = System.currentTimeMillis();
		this.queryCount++;
		this.total += taskTime;

		if (this.max == UNSET || taskTime > max) {
			this.max = taskTime;
			this.longestQueryDateTime = System.currentTimeMillis();
			if (parametervalues != null && parametervalues.length > 0) {
				this.longestQueryParams = parametervalues;
			}
		}

		if (this.min == UNSET || taskTime < min) {
			this.min = taskTime;
		}
	}

	public synchronized void addSlowQueryCount() {
		this.slowQueryCount++;
	}

	public synchronized void addExceptionCount() {
		this.exceptionCount++;
	}

	public synchronized void addQueryTimeoutCount() {
		this.queryTimeoutCount++;
	}

	public synchronized void addSocketTimeoutCount() {
		this.socketTimeoutCount++;
	}

	public synchronized long getTotal() {
		return this.total;
	}

	public synchronized long getMax() {
		return this.max;
	}

	public synchronized long getMin() {
		return this.min;
	}

	public synchronized long getCount() {
		return this.queryCount;
	}

	public synchronized long getSlowQueryCount() {
		return this.slowQueryCount;
	}

	public synchronized long getExceptionCount() {
		return this.exceptionCount;
	}

	public long getQueryTimeoutCount() {
		return this.queryTimeoutCount;
	}

	public long getSocketTimeoutCount() {
		return this.socketTimeoutCount;
	}

	public synchronized long getAverage() {
		return (this.total == 0 || this.queryCount <= 0) ? 0 : Math.round((double) this.total / (double) this.queryCount);
	}

	public synchronized Date getLastQueryDate() {
		return (this.lastQueryDate > 0) ? new Date(this.lastQueryDate) : null;
	}

	public synchronized Date getLongestQueryDateTime() {
		return (this.longestQueryDateTime > 0) ? new Date(this.longestQueryDateTime) : null;
	}

	public synchronized Object[] getLongestQueryParams() {
		return this.longestQueryParams;
	}

	@Override
	public synchronized String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("sql='").append(sql).append("',").append("execution count=").append(queryCount).append(",").append("queryTimeout count=")
				.append(queryTimeoutCount).append(",").append("socketTimeout count=").append(socketTimeoutCount).append(",").append("average time=")
				.append(getAverage()).append(",").append("total time=").append(total).append(",").append("exception count=").append(exceptionCount);
		return builder.toString();
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof SqlExecutionInfo)) {
			return false;
		}

		SqlExecutionInfo compare = (SqlExecutionInfo) obj;
		return sql.equals(compare.sql) && dataSourceId.equals(compare.dataSourceId);
	}

	@Override
	public int hashCode() {
		return sql.hashCode();
	}


}
