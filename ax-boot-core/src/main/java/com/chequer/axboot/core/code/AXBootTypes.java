package com.chequer.axboot.core.code;

import com.fasterxml.jackson.annotation.JsonValue;

public class AXBootTypes {

    public static final String Y = "Y";
    public static final String N = "N";

    public enum Used implements LabelEnum {
        YES("Y"), NO("N");

        private final String label;

        Used(String label) {
            this.label = label;
        }

        @Override
        @JsonValue
        public String getLabel() {
            return label;
        }

        public static Used get(String useYn) {
            for (Used used : values()) {
                if (used.getLabel().equals(useYn))
                    return used;
            }
            return null;
        }
    }

    public enum Deleted implements LabelEnum {
        YES("Y"), NO("N");

        private final String label;

        Deleted(String label) {
            this.label = label;
        }

        @Override
        @JsonValue
        public String getLabel() {
            return label;
        }

        public static Deleted get(String delYn) {
            for (Deleted deleted : values()) {
                if (deleted.getLabel().equals(delYn))
                    return deleted;
            }
            return null;
        }
    }

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
