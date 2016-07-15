package com.chequer.axboot.core.code;

public class Types {

	public static class ModelExtractorTemplate {
		public static final String CONTROLLER = "Controller";
		public static final String SERVICE = "Service";
		public static final String VO = "VO";
		public static final String REPOSITORY = "Repository";
		public static final String ENTITY = "Entity";
		public static final String MYBATIS_INTERFACE = "MyBatisInterface";
		public static final String MYBATIS_XML = "MyBatisXML";
	}

	public static class ModelExtractorTemplateSuffix {
		public static final String CONTROLLER = "Controller";
		public static final String SERVICE = "Service";
		public static final String REPOSITORY = "Repository";
		public static final String VO = "VO";
		public static final String ENTITY = "Entity";
		public static final String MYBATIS = "Mapper";
	}


	public static class ApplicationProfile {
		public static final String LOCAL = "local";
		public static final String ALPHA = "alpha";
		public static final String BETA = "beta";
		public static final String PRODUCTION = "production";
	}

	public static class UserType {
		public static final String SUPER_ADMIN = "SUPER_ADMIN";
		public static final String ADMIN = "ADMIN";
		public static final String USER = "USER";
	}

	public class DatabaseType {
		public static final String MYSQL = "mysql";
		public static final String ORACLE = "oracle";
		public static final String MSSQL = "mssql";
		public static final String POSTGRESQL = "postgresql";
		public static final String H2 = "h2";
	}

	public enum DataStatus {
		CREATED,
		MODIFIED,
		DELETED,
		ORIGIN
	}
}
