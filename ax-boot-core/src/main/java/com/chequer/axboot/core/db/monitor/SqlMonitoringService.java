package com.chequer.axboot.core.db.monitor;

import com.chequer.axboot.core.db.SqlMonitoringLogUtil;
import com.chequer.axboot.core.db.dbcp.AXBootDBCP2DataSource;
import com.chequer.axboot.core.db.monitor.sql.SqlExecutionInfo;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

import javax.sql.DataSource;
import java.util.Collections;
import java.util.List;

public class SqlMonitoringService implements InitializingBean, DisposableBean {

	private AXBootDBCP2DataSource dataSource;

	private SqlMonitoringLogUtil sqlMonitoringLogUtil;

	public SqlMonitoringService(DataSource dataSource) {
		if (dataSource instanceof AXBootDBCP2DataSource) {
			this.dataSource = (AXBootDBCP2DataSource) dataSource;
		}
	}

	public List<SqlExecutionInfo> getSqlExecutionInfos() {
		if (this.dataSource != null) {
			return this.dataSource.getSqlTaskPool().getSqlExecutionInfoList();
		} else {
			return Collections.emptyList();
		}
	}

	public void saveAll() {
		sqlMonitoringLogUtil.saveSqlMonitoringInfo();
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (this.dataSource != null) {
			sqlMonitoringLogUtil = new SqlMonitoringLogUtil(this.dataSource.getSqlTaskPool().getSqlExecutionInfoList());
		}
	}

	@Override
	public void destroy() throws Exception {
		if (this.dataSource != null) {
			saveAll();
		}
	}
}
