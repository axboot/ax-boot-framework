;
CREATE USER IF NOT EXISTS SA SALT ''ce14765d08ab282f'' HASH ''5e86a3576afd669433949a44cc8f4df0882fba925a84774e168f446e711c9c73'' ADMIN;
CREATE SEQUENCE PUBLIC.SYSTEM_SEQUENCE_62A595E7_A7C9_4232_8EAC_E84C3A56040A START WITH 4 BELONGS_TO_TABLE;
CREATE SEQUENCE PUBLIC.SYSTEM_SEQUENCE_837CF0AF_10A2_4796_BC48_FD18595838BD START WITH 453 BELONGS_TO_TABLE;
CREATE SEQUENCE PUBLIC.SYSTEM_SEQUENCE_25D9F1AA_2011_4200_AC25_421355831974 START WITH 10 BELONGS_TO_TABLE;
CREATE SEQUENCE PUBLIC.SYSTEM_SEQUENCE_B5AFA1E9_C53D_441F_B2F5_A9AD4E2FACE0 START WITH 7 BELONGS_TO_TABLE;
CREATE CACHED TABLE PUBLIC.AUTH_GROUP_MAP_M(
    GRP_AUTH_CD VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\uad8c\ud55c\uadf8\ub8f9\ucf54\ub4dc''),
    MENU_ID BIGINT NOT NULL COMMENT STRINGDECODE(''\uba54\ub274 ID''),
    SCH_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uc870\ud68c\uad8c\ud55c''),
    SAV_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uc800\uc7a5\uad8c\ud55c''),
    EXL_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uc5d1\uc140\uad8c\ud55c''),
    DEL_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uc0ad\uc81c\uad8c\ud55c''),
    FN1_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uae30\ub2a5\ud0a41\uad8c\ud55c''),
    FN2_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uae30\ub2a5\ud0a42\uad8c\ud55c''),
    FN3_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uae30\ub2a5\ud0a43\uad8c\ud55c''),
    FN4_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uae30\ub2a5\ud0a44\uad8c\ud55c''),
    FN5_AH VARCHAR(1) DEFAULT ''N'' COMMENT STRINGDECODE(''\uae30\ub2a5\ud0a45\uad8c\ud55c''),
    CREATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc77c''),
    CREATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc790''),
    UPDATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc77c''),
    UPDATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc790'')
);
ALTER TABLE PUBLIC.AUTH_GROUP_MAP_M ADD CONSTRAINT PUBLIC.CONSTRAINT_2 PRIMARY KEY(GRP_AUTH_CD, MENU_ID);
-- 9 +/- SELECT COUNT(*) FROM PUBLIC.AUTH_GROUP_MAP_M;
INSERT INTO PUBLIC.AUTH_GROUP_MAP_M(GRP_AUTH_CD, MENU_ID, SCH_AH, SAV_AH, EXL_AH, DEL_AH, FN1_AH, FN2_AH, FN3_AH, FN4_AH, FN5_AH, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(''S0001'', 1, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 2, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 3, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 4, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 5, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 6, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 7, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 8, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL),
(''S0001'', 9, ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, NULL, NULL, NULL);
CREATE CACHED TABLE PUBLIC.CHILD_SAMPLE(
    SAMPLE_KEY VARCHAR(100) DEFAULT '''' NOT NULL,
    SAMPLE_PARENT_KEY VARCHAR(100) DEFAULT NULL,
    SAMPLE_VALUE VARCHAR(500) DEFAULT NULL,
    ETC1 VARCHAR(100) DEFAULT NULL,
    ETC2 VARCHAR(100) DEFAULT NULL,
    ETC3 VARCHAR(100) DEFAULT NULL
);
ALTER TABLE PUBLIC.CHILD_SAMPLE ADD CONSTRAINT PUBLIC.CONSTRAINT_5 PRIMARY KEY(SAMPLE_KEY);
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.CHILD_SAMPLE;
CREATE CACHED TABLE PUBLIC.COMMON_CODE_M(
    GROUP_CD VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\uae30\ucd08\ucf54\ub4dc''),
    GROUP_NM VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\uae30\ucd08\ucf54\ub4dc\uba85''),
    CODE VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\ucf54\ub4dc''),
    NAME VARCHAR(50) NOT NULL COMMENT STRINGDECODE(''\ucf54\ub4dc\uba85''),
    SORT DECIMAL(3, 0) DEFAULT NULL COMMENT STRINGDECODE(''\uc815\ub82c\uc21c\uc11c''),
    DATA1 VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ubb38\uc790\uac121''),
    DATA2 VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ubb38\uc790\uac122''),
    DATA3 VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ubb38\uc790\uac123''),
    DATA4 DECIMAL(10, 0) DEFAULT NULL COMMENT STRINGDECODE(''\uc22b\uc790\uac121''),
    DATA5 DECIMAL(10, 0) DEFAULT NULL COMMENT STRINGDECODE(''\uc22b\uc790\uac122''),
    POS_USE_YN VARCHAR(1) NOT NULL COMMENT STRINGDECODE(''POS \uc0ac\uc6a9 \uc5ec\ubd80''),
    REMARK VARCHAR(200) DEFAULT NULL COMMENT STRINGDECODE(''\ube44\uace0''),
    USE_YN VARCHAR(1) NOT NULL COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc5ec\ubd80''),
    CREATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc77c''),
    CREATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc790''),
    UPDATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc77c''),
    UPDATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc790'')
);
ALTER TABLE PUBLIC.COMMON_CODE_M ADD CONSTRAINT PUBLIC.CONSTRAINT_8 PRIMARY KEY(GROUP_CD, CODE);
-- 16 +/- SELECT COUNT(*) FROM PUBLIC.COMMON_CODE_M;
INSERT INTO PUBLIC.COMMON_CODE_M(GROUP_CD, GROUP_NM, CODE, NAME, SORT, DATA1, DATA2, DATA3, DATA4, DATA5, POS_USE_YN, REMARK, USE_YN, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(''AUTH_GROUP'', STRINGDECODE(''\uad8c\ud55c\uadf8\ub8f9''), ''S0001'', STRINGDECODE(''\uc2dc\uc2a4\ud15c\uad00\ub9ac\uc790 \uadf8\ub8f9''), 1, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''AUTH_GROUP'', STRINGDECODE(''\uad8c\ud55c\uadf8\ub8f9''), ''S0002'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \uad8c\ud55c\uadf8\ub8f9''), 2, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''DEL_YN'', STRINGDECODE(''\uc0ad\uc81c\uc5ec\ubd80''), ''N'', STRINGDECODE(''\ubbf8\uc0ad\uc81c''), 1, '' '', NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''DEL_YN'', STRINGDECODE(''\uc0ad\uc81c\uc5ec\ubd80''), ''Y'', STRINGDECODE(''\uc0ad\uc81c''), 2, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''LOCALE'', STRINGDECODE(''\ub85c\ucf00\uc77c''), ''en_US'', STRINGDECODE(''\ubbf8\uad6d''), 2, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''LOCALE'', STRINGDECODE(''\ub85c\ucf00\uc77c''), ''ko_KR'', STRINGDECODE(''\ub300\ud55c\ubbfc\uad6d''), 1, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''MENU_GROUP'', STRINGDECODE(''\uba54\ub274\uadf8\ub8f9''), ''SYSTEM_MANAGER'', STRINGDECODE(''\uc2dc\uc2a4\ud15c \uad00\ub9ac\uc790 \uadf8\ub8f9''), 1, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''MENU_GROUP'', STRINGDECODE(''\uba54\ub274\uadf8\ub8f9''), ''USER'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \uadf8\ub8f9''), 2, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USER_ROLE'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \ub864''), ''API'', STRINGDECODE(''API \uc811\uadfc \ub864''), 6, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USER_ROLE'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \ub864''), ''ASP_ACCESS'', STRINGDECODE(''\uad00\ub9ac\uc2dc\uc2a4\ud15c \uc811\uadfc \ub864''), 1, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USER_ROLE'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \ub864''), ''ASP_MANAGER'', STRINGDECODE(''\uc77c\ubc18\uad38\ub9ac\uc790 \ub864''), 3, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USER_ROLE'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \ub864''), ''SYSTEM_MANAGER'', STRINGDECODE(''\uc2dc\uc2a4\ud15c \uad00\ub9ac\uc790 \ub864''), 2, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USER_STATUS'', STRINGDECODE(''\uacc4\uc815\uc0c1\ud0dc''), ''ACCOUNT_LOCK'', STRINGDECODE(''\uc7a0\uae40''), 2, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USER_STATUS'', STRINGDECODE(''\uacc4\uc815\uc0c1\ud0dc''), ''NORMAL'', STRINGDECODE(''\ud65c\uc131''), 1, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USE_YN'', STRINGDECODE(''\uc0ac\uc6a9\uc5ec\ubd80''), ''N'', STRINGDECODE(''\uc0ac\uc6a9\uc548\ud568''), 2, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system''),
(''USE_YN'', STRINGDECODE(''\uc0ac\uc6a9\uc5ec\ubd80''), ''Y'', STRINGDECODE(''\uc0ac\uc6a9''), 1, NULL, NULL, NULL, NULL, NULL, ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:29.0'', ''system'');
CREATE CACHED TABLE PUBLIC.ERROR_LOG_M(
    ID BIGINT DEFAULT (NEXT VALUE FOR PUBLIC.SYSTEM_SEQUENCE_837CF0AF_10A2_4796_BC48_FD18595838BD) NOT NULL NULL_TO_DEFAULT SEQUENCE PUBLIC.SYSTEM_SEQUENCE_837CF0AF_10A2_4796_BC48_FD18595838BD COMMENT ''ID'',
    PHASE VARCHAR(10) DEFAULT NULL COMMENT ''PHASE'',
    SYSTEM VARCHAR(50) DEFAULT NULL COMMENT ''SYSTEM'',
    LOGGER_NAME VARCHAR(300) DEFAULT NULL COMMENT STRINGDECODE(''Logger \uba85''),
    SERVER_NAME VARCHAR(50) DEFAULT NULL COMMENT STRINGDECODE(''\uc11c\ubc84 \uba85''),
    HOST_NAME VARCHAR(50) DEFAULT NULL COMMENT STRINGDECODE(''\ud638\uc2a4\ud2b8 \uba85''),
    PATH VARCHAR(2048) DEFAULT NULL COMMENT STRINGDECODE(''\uc694\uccad \uacbd\ub85c''),
    MESSAGE TEXT COMMENT STRINGDECODE(''\uba54\uc2dc\uc9c0''),
    TRACE TEXT COMMENT ''Trace'',
    ERROR_DATETIME DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc5d0\ub7ec\uc2dc\uac04''),
    ALERT_YN VARCHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uc54c\ub78c \uc5ec\ubd80''),
    HEADER_MAP TEXT COMMENT STRINGDECODE(''\uc694\uccad \ud5e4\ub354 \uc815\ubcf4''),
    PARAMETER_MAP TEXT COMMENT STRINGDECODE(''\uc694\uccad \ud30c\ub77c\ubbf8\ud130 \uc815\ubcf4''),
    USER_INFO TEXT COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc790 \uc815\ubcf4'')
);
ALTER TABLE PUBLIC.ERROR_LOG_M ADD CONSTRAINT PUBLIC.CONSTRAINT_85 PRIMARY KEY(ID);
-- 1 +/- SELECT COUNT(*) FROM PUBLIC.ERROR_LOG_M;
CREATE TABLE IF NOT EXISTS SYSTEM_LOB_STREAM(ID INT NOT NULL, PART INT NOT NULL, CDATA VARCHAR, BDATA BINARY);
CREATE PRIMARY KEY SYSTEM_LOB_STREAM_PRIMARY_KEY ON SYSTEM_LOB_STREAM(ID, PART);
CREATE ALIAS IF NOT EXISTS SYSTEM_COMBINE_CLOB FOR "org.h2.command.dml.ScriptCommand.combineClob";
CREATE ALIAS IF NOT EXISTS SYSTEM_COMBINE_BLOB FOR "org.h2.command.dml.ScriptCommand.combineBlob";
INSERT INTO SYSTEM_LOB_STREAM VALUES(0, 0, ''at com.querydsl.core.types.dsl.SimpleExpression.eq(SimpleExpression.java:127)\nat com.chequer.axboot.admin.domain.user.UserService.saveUser(UserService.java:42)\nat com.chequer.axboot.admin.domain.user.UserService$$FastClassBySpringCGLIB$$c9b2237d.invoke(<generated>)\nat org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)\nat org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:720)\nat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:157)\nat org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:99)\nat org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:280)\nat org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:96)\nat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\nat org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:655)\nat com.chequer.axboot.admin.domain.user.UserService$$EnhancerBySpringCGLIB$$18f5d31.saveUser(<generated>)\nat com.chequer.axboot.admin.controllers.UserController.save(UserController.java:38)\nat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\nat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\nat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\nat java.lang.reflect.Method.invoke(Method.java:498)\nat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:221)\nat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:136)\nat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:114)\nat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:827)\nat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:738)\nat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:85)\nat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:963)\nat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:897)\nat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:970)\nat org.springframework.web.servlet.FrameworkServlet.doPut(FrameworkServlet.java:883)\nat javax.servlet.http.HttpServlet.service(HttpServlet.java:651)\nat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:846)\nat javax.servlet.http.HttpServlet.service(HttpServlet.java:729)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:291)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat com.chequer.axboot.admin.filters.CorsFilter.doFilter(CorsFilter.java:20)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:317)\nat org.springframework.security.web.access.intercept.FilterSecurityInterceptor.invoke(FilterSecurityInterceptor.java:127)\nat org.springframework.security.web.access.intercept.FilterSecurityInterceptor.doFilter(FilterSecurityInterceptor.java:91)\na'', NULL);
INSERT INTO SYSTEM_LOB_STREAM VALUES(0, 1, ''t org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:115)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:111)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat com.chequer.axboot.admin.filters.LogbackMdcFilter.doFilter(LogbackMdcFilter.java:31)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:200)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat com.chequer.axboot.admin.security.AdminAuthenticationFilter.doFilter(AdminAuthenticationFilter.java:25)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:200)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:121)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:214)\nat org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:177)\nat org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:346)\nat org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:262)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:99)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.HttpPutFormContentFilter.doFilterInternal(HttpPutFormContentFilter.java:87)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.HiddenHttpMethodFilter.doFilterInternal(HiddenHttpMethodFilter.java:77)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:197)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat com.chequer.axboot.core.filters.MultiReadableHttpServletRequestFilter.doFilter(MultiReadableHttpServletRequestFilter.java:15)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFi'', NULL);
INSERT INTO SYSTEM_LOB_STREAM VALUES(0, 2, ''lter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:219)\nat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:106)\nat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:502)\nat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:142)\nat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:79)\nat org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:616)\nat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:88)\nat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:518)\nat org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1091)\nat org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:673)\nat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1526)\nat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.run(NioEndpoint.java:1482)\nat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\nat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)\nat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\nat java.lang.Thread.run(Thread.java:745)\n'', NULL);
INSERT INTO PUBLIC.ERROR_LOG_M(ID, PHASE, SYSTEM, LOGGER_NAME, SERVER_NAME, HOST_NAME, PATH, MESSAGE, TRACE, ERROR_DATETIME, ALERT_YN, HEADER_MAP, PARAMETER_MAP, USER_INFO) VALUES
(452, ''local'', ''AXBOOT'', ''com.chequer.axboot.core.controllers.BaseController'', ''localhost'', ''Brant-Mac.local'', ''/api/v1/users'', ''eq(null) is not allowed. Use isNull() instead'', SYSTEM_COMBINE_CLOB(0), TIMESTAMP ''2016-09-19 15:40:07.0'', ''N'', ''{\"content-length\":\"129\",\"referer\":\"http://localhost:8080/jsp/system/system-auth-user.jsp?menuId=5\",\"accept-language\":\"ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2\",\"cookie\":\"ax_b_a_t=\\\"eyJ1c2VyQ2QiOiJhZG1pbiIsInBhc3N3b3JkIjoiJDJhJDExJHJ1VmtvaWVDUGdoTk9BNm10S3pXUmVaNUVlNjZoYmVxd3ZsQlQxei5XNFZNWWNrQmxkNnVDIiwibGFzdE5hbWUiOiIiLCJmaXJzdE5hbWUiOiLqtIDrpqzsnpAiLCJleHBpcmVzIjoxNDc0OTUxMDI5NTMyLCJjb21wQ2QiOm51bGwsImNvbXBObSI6bnVsbCwidXNlclR5cGUiOiJTVVBFUl9BRE1JTiIsIm1lbnVIYXNoIjoiZDgxOTVlYWJjYzlmMmRlMTE3ZDE0NGMwMjgwNTI3MDQiLCJjb3VudHJ5IjoiS09SIiwic3BvbnNvcklkIjpudWxsLCJzcG9uc29yVHlwZSI6bnVsbH0=.5QNCdI1fe59YCWZgRcFOQlrF25yujHpjTPFPsp6D3WU=\\\"; JSESSIONID=9633248BD762DEEF1E094D4D0CD9B125; c_h_e_q_a_t_k=f5cdda2ccabbfcf3c111b210f5f666bc\",\"origin\":\"http://localhost:8080\",\"host\":\"localhost:8080\",\"x-requested-with\":\"XMLHttpRequest\",\"connection\":\"keep-alive\",\"content-type\":\"application/json\",\"accept-encoding\":\"gzip, deflate, sdch\",\"accept\":\"*/*\",\"user-agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36\"}'', ''[{\"compCd\":\"S0001\",\"roleList\":[],\"authList\":[],\"country\":\"ko_KR\",\"useYn\":\"Y\",\"userStatus\":\"NORMAL\",\"menuGrpCd\":\"SYSTEM_MANAGER\"}]'', STRINGDECODE(''{\\\"sessionUser\\\":{\\\"userCd\\\":\\\"system\\\",\\\"userPs\\\":\\\"$2a$11$ruVkoieCPghNOA6mtKzWReZ5Ee66hbeqwvlBT1z.W4VMYckBld6uC\\\",\\\"userNm\\\":\\\"\uc2dc\uc2a4\ud15c\uad00\ub9ac\uc790\\\",\\\"compCd\\\":null,\\\"storCd\\\":null,\\\"locale\\\":\\\"ko_KR\\\",\\\"timeZone\\\":\\\"Asia/Seoul\\\",\\\"menuGrpCd\\\":\\\"SYSTEM_MANAGER\\\",\\\"dateFormat\\\":\\\"yyyy-MM-dd\\\",\\\"dateTimeFormat\\\":null,\\\"timeFormat\\\":\\\"HH:mm:ss\\\",\\\"menuHash\\\":null,\\\"expires\\\":0,\\\"authorityList\\\":[{\\\"authority\\\":\\\"ROLE_ASP_ACCESS\\\"},{\\\"authority\\\":\\\"ROLE_SYSTEM_MANAGER\\\"}],\\\"authGroupList\\\":[\\\"S0001\\\"]},\\\"userAgent\\\":{\\\"operatingSystem\\\":\\\"MAC_OS_X\\\",\\\"browser\\\":\\\"CHROME\\\",\\\"id\\\":50990849,\\\"browserVersion\\\":{\\\"version\\\":\\\"52.0.2743.116\\\",\\\"majorVersion\\\":\\\"52\\\",\\\"minorVersion\\\":\\\"0\\\"}},\\\"browserType\\\":\\\"WEB_BROWSER\\\",\\\"renderingEngine\\\":\\\"WEBKIT\\\",\\\"deviceType\\\":\\\"COMPUTER\\\",\\\"manufacturer\\\":\\\"APPLE\\\"}''));
CREATE CACHED TABLE PUBLIC.MENU_M(
    MENU_ID BIGINT DEFAULT (NEXT VALUE FOR PUBLIC.SYSTEM_SEQUENCE_25D9F1AA_2011_4200_AC25_421355831974) NOT NULL NULL_TO_DEFAULT SEQUENCE PUBLIC.SYSTEM_SEQUENCE_25D9F1AA_2011_4200_AC25_421355831974 COMMENT ''ID'',
    MENU_GRP_CD VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uba54\ub274 \uadf8\ub8f9\ucf54\ub4dc''),
    MENU_NM VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uba54\ub274\uba85''),
    PARENT_ID BIGINT DEFAULT NULL COMMENT STRINGDECODE(''\ubd80\ubaa8 ID''),
    LEVEL INT DEFAULT NULL COMMENT STRINGDECODE(''\ub808\ubca8''),
    SORT INT DEFAULT NULL COMMENT STRINGDECODE(''\uc815\ub82c''),
    PROG_CD VARCHAR(50) DEFAULT NULL COMMENT STRINGDECODE(''\ud504\ub85c\uadf8\ub7a8 \ucf54\ub4dc''),
    CREATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc77c''),
    CREATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc790''),
    UPDATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc77c''),
    UPDATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc790'')
);
ALTER TABLE PUBLIC.MENU_M ADD CONSTRAINT PUBLIC.CONSTRAINT_87 PRIMARY KEY(MENU_ID);
-- 9 +/- SELECT COUNT(*) FROM PUBLIC.MENU_M;
INSERT INTO PUBLIC.MENU_M(MENU_ID, MENU_GRP_CD, MENU_NM, PARENT_ID, LEVEL, SORT, PROG_CD, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(1, ''SYSTEM_MANAGER'', STRINGDECODE(''\uc2dc\uc2a4\ud15c\uad00\ub9ac''), NULL, 0, 3, NULL, TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(2, ''SYSTEM_MANAGER'', STRINGDECODE(''\uad8c\ud55c\uad00\ub9ac''), 1, 1, 0, NULL, TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(3, ''SYSTEM_MANAGER'', STRINGDECODE(''\ud504\ub85c\uadf8\ub7a8\uad00\ub9ac''), 1, 1, 1, NULL, TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(4, ''SYSTEM_MANAGER'', STRINGDECODE(''\uc6b4\uc601\uad00\ub9ac''), 1, 1, 2, NULL, TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(5, ''SYSTEM_MANAGER'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \uad00\ub9ac''), 2, 2, 0, ''system-auth-user'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(6, ''SYSTEM_MANAGER'', STRINGDECODE(''\uae30\ucd08\ucf54\ub4dc \uad00\ub9ac''), 3, 2, 0, ''system-config-common-code'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(7, ''SYSTEM_MANAGER'', STRINGDECODE(''\ud504\ub85c\uadf8\ub7a8 \uad00\ub9ac''), 3, 2, 1, ''system-config-program'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(8, ''SYSTEM_MANAGER'', STRINGDECODE(''\uba54\ub274\uad00\ub9ac''), 3, 2, 2, ''system-config-menu'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(9, ''SYSTEM_MANAGER'', STRINGDECODE(''\uc5d0\ub7ec\ub85c\uadf8 \uc870\ud68c''), 4, 2, 3, ''system-operation-log'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'');
CREATE CACHED TABLE PUBLIC.PARENT_SAMPLE(
    SAMPLE_KEY VARCHAR(100) DEFAULT '''' NOT NULL,
    SAMPLE_VALUE VARCHAR(500) DEFAULT NULL,
    ETC1 VARCHAR(100) DEFAULT NULL,
    ETC2 VARCHAR(100) DEFAULT NULL,
    ETC3 VARCHAR(100) DEFAULT NULL,
    ETC4 VARCHAR(100) DEFAULT ''''
);
ALTER TABLE PUBLIC.PARENT_SAMPLE ADD CONSTRAINT PUBLIC.CONSTRAINT_7 PRIMARY KEY(SAMPLE_KEY);
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.PARENT_SAMPLE;
CREATE CACHED TABLE PUBLIC.PROG_M(
    PROG_CD VARCHAR(50) NOT NULL COMMENT STRINGDECODE(''\ud504\ub85c\uadf8\ub7a8 \ucf54\ub4dc''),
    PROG_NM VARCHAR(50) DEFAULT NULL COMMENT STRINGDECODE(''\ud504\ub85c\uadf8\ub7a8 \uba85''),
    PROG_PH VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ud504\ub85c\uadf8\ub7a8 PATH''),
    TARGET VARCHAR(50) DEFAULT NULL COMMENT STRINGDECODE(''\ud0c0\uac9f (_self / _blank)''),
    AUTH_CHECK CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uad8c\ud55c\uccb4\ud06c \ud544\uc694 \uc5ec\ubd80''),
    SCH_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uc870\ud68c\uad8c\ud55c''),
    SAV_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uc800\uc7a5\uad8c\ud55c''),
    EXL_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uc5d1\uc124\uad8c\ud55c''),
    DEL_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uc0ad\uc81c\uad8c\ud55c''),
    FN1_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uae30\ud0c01''),
    FN2_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uae30\ud0c02''),
    FN3_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uae30\ud0c03''),
    FN4_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uae30\ud0c04''),
    FN5_AH CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uae30\ud0c05''),
    REMARK VARCHAR(200) DEFAULT NULL COMMENT STRINGDECODE(''\uc124\uba85''),
    USE_YN VARCHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc5ec\ubd80''),
    CREATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc77c''),
    CREATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc790''),
    UPDATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc77c''),
    UPDATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc790'')
);
ALTER TABLE PUBLIC.PROG_M ADD CONSTRAINT PUBLIC.CONSTRAINT_8D PRIMARY KEY(PROG_CD);
-- 17 +/- SELECT COUNT(*) FROM PUBLIC.PROG_M;
INSERT INTO PUBLIC.PROG_M(PROG_CD, PROG_NM, PROG_PH, TARGET, AUTH_CHECK, SCH_AH, SAV_AH, EXL_AH, DEL_AH, FN1_AH, FN2_AH, FN3_AH, FN4_AH, FN5_AH, REMARK, USE_YN, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(''api'', ''API'', ''/swagger/'', ''_self'', ''N'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''login'', STRINGDECODE(''\ub85c\uadf8\uc778''), ''/jsp/login.jsp'', ''_self'', ''N'', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''main'', STRINGDECODE(''\uba54\uc778''), ''/jsp/main.jsp'', ''_self'', ''N'', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-auth-brand-user-mng'', STRINGDECODE(''\ube0c\ub79c\ub4dc \uad00\ub9ac\uc790 \uad8c\ud55c\uad00\ub9ac''), ''/jsp/system/system-auth-brand-user-mng.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-auth-mng'', STRINGDECODE(''\uad8c\ud55c\uad00\ub9ac''), ''/jsp/system/system-auth-mng.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-auth-user'', STRINGDECODE(''\uc0ac\uc6a9\uc790\uad00\ub9ac''), ''/jsp/system/system-auth-user.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-auth-user-mng'', STRINGDECODE(''\uc0ac\uc6a9\uc790 \uad8c\ud55c\uad00\ub9ac''), ''/jsp/system/system-auth-user-mng.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-config-common-code'', STRINGDECODE(''\uae30\ucd08\ucf54\ub4dc\uad00\ub9ac''), ''/jsp/system/system-config-common-code.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-config-menu'', STRINGDECODE(''\uba54\ub274\uad00\ub9ac''), ''/jsp/system/system-config-menu.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-config-program'', STRINGDECODE(''\ud504\ub85c\uadf8\ub7a8\uad00\ub9ac''), ''/jsp/system/system-config-program.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-operation-card-com'', STRINGDECODE(''\uce74\ub4dc\uc0ac\uad00\ub9ac''), ''/jsp/system/system-operation-card-com.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-operation-log'', STRINGDECODE(''\uc5d0\ub7ec\ub85c\uadf8 \uc870\ud68c''), ''/jsp/system/system-operation-log.jsp'', ''_self'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''Y'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-operation-notice'', STRINGDECODE(''\uacf5\uc9c0\uc0ac\ud56d''), ''/jsp/system/system-operation-notice.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-operation-pos-version-mng'', STRINGDECODE(''POS \ubc84\uc804 \uad00\ub9ac''), ''/jsp/system/system-operation-pos-version-mng.jsp'', ''_self'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-operation-tran-delete'', STRINGDECODE(''\ub9e4\ucd9c\uc0ad\uc81c''), ''/jsp/system/system-operation-tran-delete.jsp'', ''_self'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'');
INSERT INTO PUBLIC.PROG_M(PROG_CD, PROG_NM, PROG_PH, TARGET, AUTH_CHECK, SCH_AH, SAV_AH, EXL_AH, DEL_AH, FN1_AH, FN2_AH, FN3_AH, FN4_AH, FN5_AH, REMARK, USE_YN, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(''system-operation-tran-error'', STRINGDECODE(''\ub9e4\ucd9c \uc5d0\ub7ec \ubaa9\ub85d''), ''/jsp/system/system-operation-tran-error.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system''),
(''system-operation-tran-summary-rebuild'', STRINGDECODE(''\ub9e4\ucd9c\uc9d1\uacc4 \uc7ac\uc0dd\uc131''), ''/jsp/system/system-operation-tran-summary-rebuild.jsp'', ''_self'', ''Y'', ''Y'', ''Y'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', ''N'', NULL, ''Y'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'', TIMESTAMP ''2016-09-18 12:20:31.0'', ''system'');
CREATE CACHED TABLE PUBLIC.USER_AUTH_M(
    ID BIGINT DEFAULT (NEXT VALUE FOR PUBLIC.SYSTEM_SEQUENCE_62A595E7_A7C9_4232_8EAC_E84C3A56040A) NOT NULL NULL_TO_DEFAULT SEQUENCE PUBLIC.SYSTEM_SEQUENCE_62A595E7_A7C9_4232_8EAC_E84C3A56040A COMMENT ''ID'',
    USER_CD VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc790\ucf54\ub4dc''),
    GRP_AUTH_CD VARCHAR(10) NOT NULL COMMENT STRINGDECODE(''\uad8c\ud55c\uadf8\ub8f9\ucf54\ub4dc''),
    REMARK VARCHAR(200) DEFAULT NULL COMMENT STRINGDECODE(''\ube44\uace0''),
    CREATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc77c''),
    CREATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc790''),
    UPDATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc77c''),
    UPDATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc790'')
);
ALTER TABLE PUBLIC.USER_AUTH_M ADD CONSTRAINT PUBLIC.CONSTRAINT_F PRIMARY KEY(ID);
-- 1 +/- SELECT COUNT(*) FROM PUBLIC.USER_AUTH_M;
INSERT INTO PUBLIC.USER_AUTH_M(ID, USER_CD, GRP_AUTH_CD, REMARK, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(3, ''system'', ''S0001'', NULL, TIMESTAMP ''2016-09-19 15:40:13.0'', ''system'', TIMESTAMP ''2016-09-19 15:40:13.0'', ''system'');
CREATE CACHED TABLE PUBLIC.USER_M(
    USER_CD VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc790\ucf54\ub4dc''),
    USER_NM VARCHAR(30) NOT NULL COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc790\uba85''),
    USER_PS VARCHAR(128) NOT NULL COMMENT STRINGDECODE(''\ube44\ubc00\ubc88\ud638''),
    EMAIL VARCHAR(50) DEFAULT NULL COMMENT STRINGDECODE(''\uc774\uba54\uc77c''),
    HP_NO VARCHAR(15) DEFAULT NULL COMMENT STRINGDECODE(''\ud734\ub300\ud3f0''),
    REMARK VARCHAR(200) DEFAULT NULL COMMENT STRINGDECODE(''\ube44\uace0''),
    LAST_LOGIN_DATE DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub9c8\uc9c0\ub9c9\ub85c\uadf8\uc778\uc77c\uc2dc''),
    PASSWORD_UPDATE_DATE DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ube44\ubc00\ubc88\ud638\ubcc0\uacbd\uc77c\uc2dc''),
    USER_STATUS VARCHAR(10) DEFAULT NULL COMMENT STRINGDECODE(''N : \uc815\uc0c1\\\\nL : \uc7a0\uae40''),
    IP VARCHAR(100) DEFAULT NULL COMMENT ''IP'',
    LOCALE VARCHAR(10) DEFAULT NULL COMMENT ''Locale'',
    MENU_GRP_CD VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uba54\ub274\uadf8\ub8f9\ucf54\ub4dc''),
    USE_YN VARCHAR(1) NOT NULL COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc5ec\ubd80''),
    DEL_YN CHAR(1) DEFAULT NULL COMMENT STRINGDECODE(''\uc0ad\uc81c\uc5ec\ubd80''),
    CREATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc77c''),
    CREATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc790''),
    UPDATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc77c''),
    UPDATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc790'')
);
ALTER TABLE PUBLIC.USER_M ADD CONSTRAINT PUBLIC.CONSTRAINT_9 PRIMARY KEY(USER_CD);
-- 1 +/- SELECT COUNT(*) FROM PUBLIC.USER_M;
INSERT INTO PUBLIC.USER_M(USER_CD, USER_NM, USER_PS, EMAIL, HP_NO, REMARK, LAST_LOGIN_DATE, PASSWORD_UPDATE_DATE, USER_STATUS, IP, LOCALE, MENU_GRP_CD, USE_YN, DEL_YN, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(''system'', STRINGDECODE(''\uc2dc\uc2a4\ud15c\uad00\ub9ac\uc790''), ''$2a$11$ruVkoieCPghNOA6mtKzWReZ5Ee66hbeqwvlBT1z.W4VMYckBld6uC'', NULL, NULL, NULL, TIMESTAMP ''2016-09-19 15:39:28.0'', TIMESTAMP ''2016-01-26 11:50:41.0'', ''NORMAL'', ''0:0:0:0:0:0:0:1'', ''ko_KR'', ''SYSTEM_MANAGER'', ''Y'', ''N'', TIMESTAMP ''2016-09-18 12:20:32.0'', ''system'', TIMESTAMP ''2016-09-19 15:39:28.0'', ''system'');
CREATE CACHED TABLE PUBLIC.USER_ROLE_M(
    ID BIGINT DEFAULT (NEXT VALUE FOR PUBLIC.SYSTEM_SEQUENCE_B5AFA1E9_C53D_441F_B2F5_A9AD4E2FACE0) NOT NULL NULL_TO_DEFAULT SEQUENCE PUBLIC.SYSTEM_SEQUENCE_B5AFA1E9_C53D_441F_B2F5_A9AD4E2FACE0 COMMENT ''ID'',
    USER_CD VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\uc0ac\uc6a9\uc790 \ucf54\ub4dc''),
    ROLE_CD VARCHAR(100) DEFAULT '''' NOT NULL COMMENT STRINGDECODE(''\ub864 \ucf54\ub4dc''),
    CREATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc77c''),
    CREATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\ub4f1\ub85d\uc790''),
    UPDATED_AT DATETIME DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc77c''),
    UPDATED_BY VARCHAR(100) DEFAULT NULL COMMENT STRINGDECODE(''\uc218\uc815\uc790'')
);
ALTER TABLE PUBLIC.USER_ROLE_M ADD CONSTRAINT PUBLIC.CONSTRAINT_1 PRIMARY KEY(ID);
-- 2 +/- SELECT COUNT(*) FROM PUBLIC.USER_ROLE_M;
INSERT INTO PUBLIC.USER_ROLE_M(ID, USER_CD, ROLE_CD, CREATED_AT, CREATED_BY, UPDATED_AT, UPDATED_BY) VALUES
(5, ''system'', ''ASP_ACCESS'', TIMESTAMP ''2016-09-19 15:40:13.0'', ''system'', TIMESTAMP ''2016-09-19 15:40:13.0'', ''system''),
(6, ''system'', ''SYSTEM_MANAGER'', TIMESTAMP ''2016-09-19 15:40:13.0'', ''system'', TIMESTAMP ''2016-09-19 15:40:13.0'', ''system'');
DROP TABLE IF EXISTS SYSTEM_LOB_STREAM;
CALL SYSTEM_COMBINE_BLOB(-1);
DROP ALIAS IF EXISTS SYSTEM_COMBINE_CLOB;
DROP ALIAS IF EXISTS SYSTEM_COMBINE_BLOB;
ALTER TABLE PUBLIC.USER_AUTH_M ADD CONSTRAINT PUBLIC.PK_USER_AUTH_M UNIQUE(USER_CD, GRP_AUTH_CD);
