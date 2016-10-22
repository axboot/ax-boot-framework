package com.chequer.axboot.core.mybatis;

import com.chequer.axboot.core.domain.base.AXBootBaseJpaModel;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Properties;

@Intercepts({
        @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class})
})
public class AuditInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object[] args = invocation.getArgs();
        for (Object obj : args) {
            if (obj instanceof AXBootBaseJpaModel) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null) {
                    Object principal = authentication.getPrincipal();
                    if (principal instanceof UserDetails) {
                        String username = ((UserDetails) principal).getUsername();
                        ((AXBootBaseJpaModel) obj).setCreatedBy(username);
                        ((AXBootBaseJpaModel) obj).setUpdatedBy(username);
                    }
                }
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
