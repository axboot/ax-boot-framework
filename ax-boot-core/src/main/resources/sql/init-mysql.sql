# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 14.63.169.27 (MySQL 5.7.11)
# Database: axboot_dev
# Generation Time: 2016-09-21 07:34:32 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table AUTH_GROUP_MAP_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `AUTH_GROUP_MAP_M`;

CREATE TABLE `AUTH_GROUP_MAP_M` (
  `GRP_AUTH_CD` varchar(100) NOT NULL DEFAULT '' COMMENT '권한그룹코드',
  `MENU_ID` bigint(20) NOT NULL COMMENT '메뉴 ID',
  `SCH_AH` varchar(1) DEFAULT 'N' COMMENT '조회권한',
  `SAV_AH` varchar(1) DEFAULT 'N' COMMENT '저장권한',
  `EXL_AH` varchar(1) DEFAULT 'N' COMMENT '엑셀권한',
  `DEL_AH` varchar(1) DEFAULT 'N' COMMENT '삭제권한',
  `FN1_AH` varchar(1) DEFAULT 'N' COMMENT '기능키1권한',
  `FN2_AH` varchar(1) DEFAULT 'N' COMMENT '기능키2권한',
  `FN3_AH` varchar(1) DEFAULT 'N' COMMENT '기능키3권한',
  `FN4_AH` varchar(1) DEFAULT 'N' COMMENT '기능키4권한',
  `FN5_AH` varchar(1) DEFAULT 'N' COMMENT '기능키5권한',
  `CREATED_AT` datetime DEFAULT NULL COMMENT '등록일',
  `CREATED_BY` varchar(100) DEFAULT NULL COMMENT '등록자',
  `UPDATED_AT` datetime DEFAULT NULL COMMENT '수정일',
  `UPDATED_BY` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`GRP_AUTH_CD`,`MENU_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `AUTH_GROUP_MAP_M` WRITE;
/*!40000 ALTER TABLE `AUTH_GROUP_MAP_M` DISABLE KEYS */;

INSERT INTO `AUTH_GROUP_MAP_M` (`GRP_AUTH_CD`, `MENU_ID`, `SCH_AH`, `SAV_AH`, `EXL_AH`, `DEL_AH`, `FN1_AH`, `FN2_AH`, `FN3_AH`, `FN4_AH`, `FN5_AH`, `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`)
VALUES
	('S0001',1,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',2,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',3,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',4,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',5,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',6,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',7,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',8,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL),
	('S0001',9,'Y','Y','N','N','N','N','N','N','N',NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `AUTH_GROUP_MAP_M` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table CHILD_SAMPLE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `CHILD_SAMPLE`;

CREATE TABLE `CHILD_SAMPLE` (
  `SAMPLE_KEY` varchar(100) NOT NULL DEFAULT '',
  `SAMPLE_PARENT_KEY` varchar(100) DEFAULT NULL,
  `SAMPLE_VALUE` varchar(500) DEFAULT NULL,
  `ETC1` varchar(100) DEFAULT NULL,
  `ETC2` varchar(100) DEFAULT NULL,
  `ETC3` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`SAMPLE_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table COMMON_CODE_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `COMMON_CODE_M`;

CREATE TABLE `COMMON_CODE_M` (
  `GROUP_CD` varchar(100) NOT NULL DEFAULT '' COMMENT '기초코드',
  `GROUP_NM` varchar(100) NOT NULL DEFAULT '' COMMENT '기초코드명',
  `CODE` varchar(100) NOT NULL DEFAULT '' COMMENT '코드',
  `NAME` varchar(50) NOT NULL COMMENT '코드명',
  `SORT` decimal(3,0) DEFAULT NULL COMMENT '정렬순서',
  `DATA1` varchar(100) DEFAULT NULL COMMENT '문자값1',
  `DATA2` varchar(100) DEFAULT NULL COMMENT '문자값2',
  `DATA3` varchar(100) DEFAULT NULL COMMENT '문자값3',
  `DATA4` decimal(10,0) DEFAULT NULL COMMENT '숫자값1',
  `DATA5` decimal(10,0) DEFAULT NULL COMMENT '숫자값2',
  `POS_USE_YN` varchar(1) NOT NULL COMMENT 'POS 사용 여부',
  `REMARK` varchar(200) DEFAULT NULL COMMENT '비고',
  `USE_YN` varchar(1) NOT NULL COMMENT '사용여부',
  `CREATED_AT` datetime DEFAULT NULL COMMENT '등록일',
  `CREATED_BY` varchar(100) DEFAULT NULL COMMENT '등록자',
  `UPDATED_AT` datetime DEFAULT NULL COMMENT '수정일',
  `UPDATED_BY` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`GROUP_CD`,`CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `COMMON_CODE_M` WRITE;
/*!40000 ALTER TABLE `COMMON_CODE_M` DISABLE KEYS */;

INSERT INTO `COMMON_CODE_M` (`GROUP_CD`, `GROUP_NM`, `CODE`, `NAME`, `SORT`, `DATA1`, `DATA2`, `DATA3`, `DATA4`, `DATA5`, `POS_USE_YN`, `REMARK`, `USE_YN`, `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`)
VALUES
	('AUTH_GROUP','권한그룹','S0001','시스템관리자 그룹',1,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('AUTH_GROUP','권한그룹','S0002','사용자 권한그룹',2,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('DEL_YN','삭제여부','N','미삭제',1,' ',NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('DEL_YN','삭제여부','Y','삭제',2,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('LOCALE','로케일','en_US','미국',2,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('LOCALE','로케일','ko_KR','대한민국',1,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('MENU_GROUP','메뉴그룹','SYSTEM_MANAGER','시스템 관리자 그룹',1,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('MENU_GROUP','메뉴그룹','USER','사용자 그룹',2,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USER_ROLE','사용자 롤','API','API 접근 롤',6,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USER_ROLE','사용자 롤','ASP_ACCESS','관리시스템 접근 롤',1,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USER_ROLE','사용자 롤','ASP_MANAGER','일반괸리자 롤',3,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USER_ROLE','사용자 롤','SYSTEM_MANAGER','시스템 관리자 롤',2,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USER_STATUS','계정상태','ACCOUNT_LOCK','잠김',2,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USER_STATUS','계정상태','NORMAL','활성',1,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USE_YN','사용여부','N','사용안함',2,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system'),
	('USE_YN','사용여부','Y','사용',1,NULL,NULL,NULL,NULL,NULL,'N',NULL,'Y','2016-09-18 12:20:29','system','2016-09-18 12:20:29','system');

/*!40000 ALTER TABLE `COMMON_CODE_M` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ERROR_LOG_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ERROR_LOG_M`;

CREATE TABLE `ERROR_LOG_M` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `PHASE` varchar(10) DEFAULT NULL COMMENT 'PHASE',
  `SYSTEM` varchar(50) DEFAULT NULL COMMENT 'SYSTEM',
  `LOGGER_NAME` varchar(300) DEFAULT NULL COMMENT 'Logger 명',
  `SERVER_NAME` varchar(50) DEFAULT NULL COMMENT '서버 명',
  `HOST_NAME` varchar(50) DEFAULT NULL COMMENT '호스트 명',
  `PATH` varchar(2048) DEFAULT NULL COMMENT '요청 경로',
  `MESSAGE` text COMMENT '메시지',
  `TRACE` text COMMENT 'Trace',
  `ERROR_DATETIME` datetime DEFAULT NULL COMMENT '에러시간',
  `ALERT_YN` varchar(1) DEFAULT NULL COMMENT '알람 여부',
  `HEADER_MAP` text COMMENT '요청 헤더 정보',
  `PARAMETER_MAP` text COMMENT '요청 파라미터 정보',
  `USER_INFO` text COMMENT '사용자 정보',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ERROR_LOG_M` WRITE;
/*!40000 ALTER TABLE `ERROR_LOG_M` DISABLE KEYS */;

INSERT INTO `ERROR_LOG_M` (`ID`, `PHASE`, `SYSTEM`, `LOGGER_NAME`, `SERVER_NAME`, `HOST_NAME`, `PATH`, `MESSAGE`, `TRACE`, `ERROR_DATETIME`, `ALERT_YN`, `HEADER_MAP`, `PARAMETER_MAP`, `USER_INFO`)
VALUES
	(452,'local','AXBOOT','com.chequer.axboot.core.controllers.BaseController','localhost','Brant-Mac.local','/api/v1/users','eq(null) is not allowed. Use isNull() instead','at com.querydsl.core.types.dsl.SimpleExpression.eq(SimpleExpression.java:127)\nat com.chequer.axboot.admin.domain.user.UserService.saveUser(UserService.java:42)\nat com.chequer.axboot.admin.domain.user.UserService$$FastClassBySpringCGLIB$$c9b2237d.invoke(<generated>)\nat org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)\nat org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:720)\nat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:157)\nat org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:99)\nat org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:280)\nat org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:96)\nat org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179)\nat org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:655)\nat com.chequer.axboot.admin.domain.user.UserService$$EnhancerBySpringCGLIB$$18f5d31.saveUser(<generated>)\nat com.chequer.axboot.admin.controllers.UserController.save(UserController.java:38)\nat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\nat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\nat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\nat java.lang.reflect.Method.invoke(Method.java:498)\nat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:221)\nat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:136)\nat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:114)\nat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:827)\nat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:738)\nat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:85)\nat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:963)\nat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:897)\nat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:970)\nat org.springframework.web.servlet.FrameworkServlet.doPut(FrameworkServlet.java:883)\nat javax.servlet.http.HttpServlet.service(HttpServlet.java:651)\nat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:846)\nat javax.servlet.http.HttpServlet.service(HttpServlet.java:729)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:291)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat com.chequer.axboot.admin.filters.CorsFilter.doFilter(CorsFilter.java:20)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:317)\nat org.springframework.security.web.access.intercept.FilterSecurityInterceptor.invoke(FilterSecurityInterceptor.java:127)\nat org.springframework.security.web.access.intercept.FilterSecurityInterceptor.doFilter(FilterSecurityInterceptor.java:91)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:115)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:111)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat com.chequer.axboot.admin.filters.LogbackMdcFilter.doFilter(LogbackMdcFilter.java:31)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:200)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat com.chequer.axboot.admin.security.AdminAuthenticationFilter.doFilter(AdminAuthenticationFilter.java:25)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:200)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:121)\nat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:331)\nat org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:214)\nat org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:177)\nat org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:346)\nat org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:262)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:99)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.HttpPutFormContentFilter.doFilterInternal(HttpPutFormContentFilter.java:87)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.HiddenHttpMethodFilter.doFilterInternal(HiddenHttpMethodFilter.java:77)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:197)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat com.chequer.axboot.core.filters.MultiReadableHttpServletRequestFilter.doFilter(MultiReadableHttpServletRequestFilter.java:15)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:239)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:206)\nat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:219)\nat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:106)\nat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:502)\nat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:142)\nat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:79)\nat org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:616)\nat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:88)\nat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:518)\nat org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1091)\nat org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:673)\nat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1526)\nat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.run(NioEndpoint.java:1482)\nat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\nat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)\nat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\nat java.lang.Thread.run(Thread.java:745)\n','2016-09-19 15:40:07','N','{\"content-length\":\"129\",\"referer\":\"http://localhost:8080/jsp/system/system-auth-user.jsp?menuId=5\",\"accept-language\":\"ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2\",\"cookie\":\"ax_b_a_t=\\\"eyJ1c2VyQ2QiOiJhZG1pbiIsInBhc3N3b3JkIjoiJDJhJDExJHJ1VmtvaWVDUGdoTk9BNm10S3pXUmVaNUVlNjZoYmVxd3ZsQlQxei5XNFZNWWNrQmxkNnVDIiwibGFzdE5hbWUiOiIiLCJmaXJzdE5hbWUiOiLqtIDrpqzsnpAiLCJleHBpcmVzIjoxNDc0OTUxMDI5NTMyLCJjb21wQ2QiOm51bGwsImNvbXBObSI6bnVsbCwidXNlclR5cGUiOiJTVVBFUl9BRE1JTiIsIm1lbnVIYXNoIjoiZDgxOTVlYWJjYzlmMmRlMTE3ZDE0NGMwMjgwNTI3MDQiLCJjb3VudHJ5IjoiS09SIiwic3BvbnNvcklkIjpudWxsLCJzcG9uc29yVHlwZSI6bnVsbH0=.5QNCdI1fe59YCWZgRcFOQlrF25yujHpjTPFPsp6D3WU=\\\"; JSESSIONID=9633248BD762DEEF1E094D4D0CD9B125; c_h_e_q_a_t_k=f5cdda2ccabbfcf3c111b210f5f666bc\",\"origin\":\"http://localhost:8080\",\"host\":\"localhost:8080\",\"x-requested-with\":\"XMLHttpRequest\",\"connection\":\"keep-alive\",\"content-type\":\"application/json\",\"accept-encoding\":\"gzip, deflate, sdch\",\"accept\":\"*/*\",\"user-agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36\"}','[{\"compCd\":\"S0001\",\"roleList\":[],\"authList\":[],\"country\":\"ko_KR\",\"useYn\":\"Y\",\"userStatus\":\"NORMAL\",\"menuGrpCd\":\"SYSTEM_MANAGER\"}]','{\"sessionUser\":{\"userCd\":\"system\",\"userPs\":\"$2a$11$ruVkoieCPghNOA6mtKzWReZ5Ee66hbeqwvlBT1z.W4VMYckBld6uC\",\"userNm\":\"시스템관리자\",\"compCd\":null,\"storCd\":null,\"locale\":\"ko_KR\",\"timeZone\":\"Asia/Seoul\",\"menuGrpCd\":\"SYSTEM_MANAGER\",\"dateFormat\":\"yyyy-MM-dd\",\"dateTimeFormat\":null,\"timeFormat\":\"HH:mm:ss\",\"menuHash\":null,\"expires\":0,\"authorityList\":[{\"authority\":\"ROLE_ASP_ACCESS\"},{\"authority\":\"ROLE_SYSTEM_MANAGER\"}],\"authGroupList\":[\"S0001\"]},\"userAgent\":{\"operatingSystem\":\"MAC_OS_X\",\"browser\":\"CHROME\",\"id\":50990849,\"browserVersion\":{\"version\":\"52.0.2743.116\",\"majorVersion\":\"52\",\"minorVersion\":\"0\"}},\"browserType\":\"WEB_BROWSER\",\"renderingEngine\":\"WEBKIT\",\"deviceType\":\"COMPUTER\",\"manufacturer\":\"APPLE\"}');

/*!40000 ALTER TABLE `ERROR_LOG_M` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table MENU_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `MENU_M`;

CREATE TABLE `MENU_M` (
  `MENU_ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `MENU_GRP_CD` varchar(100) DEFAULT NULL COMMENT '메뉴 그룹코드',
  `MENU_NM` varchar(100) DEFAULT NULL COMMENT '메뉴명',
  `PARENT_ID` bigint(20) DEFAULT NULL COMMENT '부모 ID',
  `LEVEL` int(11) DEFAULT NULL COMMENT '레벨',
  `SORT` int(11) DEFAULT NULL COMMENT '정렬',
  `PROG_CD` varchar(50) DEFAULT NULL COMMENT '프로그램 코드',
  `CREATED_AT` datetime DEFAULT NULL COMMENT '등록일',
  `CREATED_BY` varchar(100) DEFAULT NULL COMMENT '등록자',
  `UPDATED_AT` datetime DEFAULT NULL COMMENT '수정일',
  `UPDATED_BY` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`MENU_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `MENU_M` WRITE;
/*!40000 ALTER TABLE `MENU_M` DISABLE KEYS */;

INSERT INTO `MENU_M` (`MENU_ID`, `MENU_GRP_CD`, `MENU_NM`, `PARENT_ID`, `LEVEL`, `SORT`, `PROG_CD`, `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`)
VALUES
	(1,'SYSTEM_MANAGER','시스템관리',NULL,0,3,NULL,'2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(2,'SYSTEM_MANAGER','권한관리',1,1,0,NULL,'2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(3,'SYSTEM_MANAGER','프로그램관리',1,1,1,NULL,'2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(4,'SYSTEM_MANAGER','운영관리',1,1,2,NULL,'2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(5,'SYSTEM_MANAGER','사용자 관리',2,2,0,'system-auth-user','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(6,'SYSTEM_MANAGER','기초코드 관리',3,2,0,'system-config-common-code','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(7,'SYSTEM_MANAGER','프로그램 관리',3,2,1,'system-config-program','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(8,'SYSTEM_MANAGER','메뉴관리',3,2,2,'system-config-menu','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	(9,'SYSTEM_MANAGER','에러로그 조회',4,2,3,'system-operation-log','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system');

/*!40000 ALTER TABLE `MENU_M` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table PARENT_SAMPLE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `PARENT_SAMPLE`;

CREATE TABLE `PARENT_SAMPLE` (
  `SAMPLE_KEY` varchar(100) NOT NULL DEFAULT '',
  `SAMPLE_VALUE` varchar(500) DEFAULT NULL,
  `ETC1` varchar(100) DEFAULT NULL,
  `ETC2` varchar(100) DEFAULT NULL,
  `ETC3` varchar(100) DEFAULT NULL,
  `ETC4` varchar(100) DEFAULT '',
  PRIMARY KEY (`SAMPLE_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table PROG_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `PROG_M`;

CREATE TABLE `PROG_M` (
  `PROG_CD` varchar(50) NOT NULL COMMENT '프로그램 코드',
  `PROG_NM` varchar(50) DEFAULT NULL COMMENT '프로그램 명',
  `PROG_PH` varchar(100) DEFAULT NULL COMMENT '프로그램 PATH',
  `TARGET` varchar(50) DEFAULT NULL COMMENT '타겟 (_self / _blank)',
  `AUTH_CHECK` char(1) DEFAULT NULL COMMENT '권한체크 필요 여부',
  `SCH_AH` char(1) DEFAULT NULL COMMENT '조회권한',
  `SAV_AH` char(1) DEFAULT NULL COMMENT '저장권한',
  `EXL_AH` char(1) DEFAULT NULL COMMENT '엑설권한',
  `DEL_AH` char(1) DEFAULT NULL COMMENT '삭제권한',
  `FN1_AH` char(1) DEFAULT NULL COMMENT '기타1',
  `FN2_AH` char(1) DEFAULT NULL COMMENT '기타2',
  `FN3_AH` char(1) DEFAULT NULL COMMENT '기타3',
  `FN4_AH` char(1) DEFAULT NULL COMMENT '기타4',
  `FN5_AH` char(1) DEFAULT NULL COMMENT '기타5',
  `REMARK` varchar(200) DEFAULT NULL COMMENT '설명',
  `USE_YN` varchar(1) DEFAULT NULL COMMENT '사용여부',
  `CREATED_AT` datetime DEFAULT NULL COMMENT '등록일',
  `CREATED_BY` varchar(100) DEFAULT NULL COMMENT '등록자',
  `UPDATED_AT` datetime DEFAULT NULL COMMENT '수정일',
  `UPDATED_BY` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`PROG_CD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `PROG_M` WRITE;
/*!40000 ALTER TABLE `PROG_M` DISABLE KEYS */;

INSERT INTO `PROG_M` (`PROG_CD`, `PROG_NM`, `PROG_PH`, `TARGET`, `AUTH_CHECK`, `SCH_AH`, `SAV_AH`, `EXL_AH`, `DEL_AH`, `FN1_AH`, `FN2_AH`, `FN3_AH`, `FN4_AH`, `FN5_AH`, `REMARK`, `USE_YN`, `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`)
VALUES
	('api','API','/swagger/','_self','N','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('login','로그인','/jsp/login.jsp','_self','N',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('main','메인','/jsp/main.jsp','_self','N',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-auth-brand-user-mng','브랜드 관리자 권한관리','/jsp/system/system-auth-brand-user-mng.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-auth-mng','권한관리','/jsp/system/system-auth-mng.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-auth-user','사용자관리','/jsp/system/system-auth-user.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-auth-user-mng','사용자 권한관리','/jsp/system/system-auth-user-mng.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-config-common-code','기초코드관리','/jsp/system/system-config-common-code.jsp','_self','Y','Y','Y','Y','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-config-menu','메뉴관리','/jsp/system/system-config-menu.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-config-program','프로그램관리','/jsp/system/system-config-program.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-operation-card-com','카드사관리','/jsp/system/system-operation-card-com.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-operation-log','에러로그 조회','/jsp/system/system-operation-log.jsp','_self','Y','Y','N','N','N','Y','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-operation-notice','공지사항','/jsp/system/system-operation-notice.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-operation-pos-version-mng','POS 버전 관리','/jsp/system/system-operation-pos-version-mng.jsp','_self','Y','Y','N','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-operation-tran-delete','매출삭제','/jsp/system/system-operation-tran-delete.jsp','_self','Y','Y','N','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-operation-tran-error','매출 에러 목록','/jsp/system/system-operation-tran-error.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system'),
	('system-operation-tran-summary-rebuild','매출집계 재생성','/jsp/system/system-operation-tran-summary-rebuild.jsp','_self','Y','Y','Y','N','N','N','N','N','N','N',NULL,'Y','2016-09-18 12:20:31','system','2016-09-18 12:20:31','system');

/*!40000 ALTER TABLE `PROG_M` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table USER_AUTH_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `USER_AUTH_M`;

CREATE TABLE `USER_AUTH_M` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `USER_CD` varchar(100) NOT NULL DEFAULT '' COMMENT '사용자코드',
  `GRP_AUTH_CD` varchar(10) NOT NULL COMMENT '권한그룹코드',
  `REMARK` varchar(200) DEFAULT NULL COMMENT '비고',
  `CREATED_AT` datetime DEFAULT NULL COMMENT '등록일',
  `CREATED_BY` varchar(100) DEFAULT NULL COMMENT '등록자',
  `UPDATED_AT` datetime DEFAULT NULL COMMENT '수정일',
  `UPDATED_BY` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `PK_USER_AUTH_M` (`USER_CD`,`GRP_AUTH_CD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `USER_AUTH_M` WRITE;
/*!40000 ALTER TABLE `USER_AUTH_M` DISABLE KEYS */;

INSERT INTO `USER_AUTH_M` (`ID`, `USER_CD`, `GRP_AUTH_CD`, `REMARK`, `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`)
VALUES
	(3,'system','S0001',NULL,'2016-09-19 15:40:13','system','2016-09-19 15:40:13','system');

/*!40000 ALTER TABLE `USER_AUTH_M` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table USER_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `USER_M`;

CREATE TABLE `USER_M` (
  `USER_CD` varchar(100) NOT NULL DEFAULT '' COMMENT '사용자코드',
  `USER_NM` varchar(30) NOT NULL COMMENT '사용자명',
  `USER_PS` varchar(128) NOT NULL COMMENT '비밀번호',
  `EMAIL` varchar(50) DEFAULT NULL COMMENT '이메일',
  `HP_NO` varchar(15) DEFAULT NULL COMMENT '휴대폰',
  `REMARK` varchar(200) DEFAULT NULL COMMENT '비고',
  `LAST_LOGIN_DATE` datetime DEFAULT NULL COMMENT '마지막로그인일시',
  `PASSWORD_UPDATE_DATE` datetime DEFAULT NULL COMMENT '비밀번호변경일시',
  `USER_STATUS` varchar(10) DEFAULT NULL COMMENT 'N : 정상\\nL : 잠김',
  `IP` varchar(100) DEFAULT NULL COMMENT 'IP',
  `LOCALE` varchar(10) DEFAULT NULL COMMENT 'Locale',
  `MENU_GRP_CD` varchar(100) DEFAULT NULL COMMENT '메뉴그룹코드',
  `USE_YN` varchar(1) NOT NULL COMMENT '사용여부',
  `DEL_YN` char(1) DEFAULT NULL COMMENT '삭제여부',
  `CREATED_AT` datetime DEFAULT NULL COMMENT '등록일',
  `CREATED_BY` varchar(100) DEFAULT NULL COMMENT '등록자',
  `UPDATED_AT` datetime DEFAULT NULL COMMENT '수정일',
  `UPDATED_BY` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`USER_CD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `USER_M` WRITE;
/*!40000 ALTER TABLE `USER_M` DISABLE KEYS */;

INSERT INTO `USER_M` (`USER_CD`, `USER_NM`, `USER_PS`, `EMAIL`, `HP_NO`, `REMARK`, `LAST_LOGIN_DATE`, `PASSWORD_UPDATE_DATE`, `USER_STATUS`, `IP`, `LOCALE`, `MENU_GRP_CD`, `USE_YN`, `DEL_YN`, `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`)
VALUES
	('system','시스템관리자','$2a$11$ruVkoieCPghNOA6mtKzWReZ5Ee66hbeqwvlBT1z.W4VMYckBld6uC',NULL,NULL,NULL,'2016-09-19 15:39:28','2016-01-26 11:50:41','NORMAL','0:0:0:0:0:0:0:1','ko_KR','SYSTEM_MANAGER','Y','N','2016-09-18 12:20:32','system','2016-09-19 15:39:28','system');

/*!40000 ALTER TABLE `USER_M` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table USER_ROLE_M
# ------------------------------------------------------------

DROP TABLE IF EXISTS `USER_ROLE_M`;

CREATE TABLE `USER_ROLE_M` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `USER_CD` varchar(100) NOT NULL DEFAULT '' COMMENT '사용자 코드',
  `ROLE_CD` varchar(100) NOT NULL DEFAULT '' COMMENT '롤 코드',
  `CREATED_AT` datetime DEFAULT NULL COMMENT '등록일',
  `CREATED_BY` varchar(100) DEFAULT NULL COMMENT '등록자',
  `UPDATED_AT` datetime DEFAULT NULL COMMENT '수정일',
  `UPDATED_BY` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `USER_ROLE_M` WRITE;
/*!40000 ALTER TABLE `USER_ROLE_M` DISABLE KEYS */;

INSERT INTO `USER_ROLE_M` (`ID`, `USER_CD`, `ROLE_CD`, `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`)
VALUES
	(5,'system','ASP_ACCESS','2016-09-19 15:40:13','system','2016-09-19 15:40:13','system'),
	(6,'system','SYSTEM_MANAGER','2016-09-19 15:40:13','system','2016-09-19 15:40:13','system');

/*!40000 ALTER TABLE `USER_ROLE_M` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
