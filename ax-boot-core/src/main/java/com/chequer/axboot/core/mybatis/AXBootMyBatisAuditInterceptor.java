package com.chequer.axboot.core.mybatis;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;

import java.util.Properties;

@Intercepts({
        @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class})
})
public abstract class AXBootMyBatisAuditInterceptor implements Interceptor {
    @Override
    public abstract Object intercept(Invocation invocation) throws Throwable;
    /*
        Object[] args = invocation.getArgs();
        return invocation.proceed();
     */

    @Override
    public Object plugin(Object o) {
        return Plugin.wrap(o, this);
    }

    @Override
    public void setProperties(Properties properties) {

    }
}
