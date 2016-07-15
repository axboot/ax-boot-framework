package com.chequer.axboot.admin.config;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.utils.SessionUtils;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;

import java.util.Properties;

@Intercepts({
		@Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class})
})
public class AuditInterceptor implements Interceptor {
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		Object[] args = invocation.getArgs();
		for (Object obj : args) {
			if (obj instanceof BaseJpaModel) {
				String userCd = SessionUtils.getCurrentLoginUserCd();
				((BaseJpaModel) obj).setInsUserCd(userCd);
				((BaseJpaModel) obj).setUptUserCd(userCd);
			}
		}
		return invocation.proceed();
	}

	@Override
	public Object plugin(Object o) {
		return Plugin.wrap(o, this);
	}

	@Override
	public void setProperties(Properties properties) {

	}
}
