package com.chequer.axboot.core.code;

import com.fasterxml.jackson.annotation.JsonValue;

public class Types {

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

    public enum UserStatus implements LabelEnum {
        ACCOUNT_LOCK("ACCOUNT_LOCK"), NORMAL("NORMAL");

        private final String label;

        UserStatus(String label) {
            this.label = label;
        }

        @Override
        @JsonValue
        public String getLabel() {
            return label;
        }
    }

    public enum Role implements LabelEnum {
        SystemManager("SYSTEM_MANAGER", 1000, null),
        AspManager("ASP_MANAGER", 900, SystemManager);

        enum ComparisonType {
            EQUAL,
            GREATER_THAN,
            GREATER_EQUAL,
            LESS_THAN,
            LESS_EQUAL;

            public static Role.ComparisonType get(String comparisonTypeString) {
                switch (comparisonTypeString) {
                    case "eq":
                        return EQUAL;

                    case "gt":
                        return GREATER_THAN;

                    case "gte":
                        return GREATER_EQUAL;

                    case "lt":
                        return LESS_THAN;

                    case "lte":
                        return LESS_EQUAL;
                }
                return null;
            }
        }

        private final String name;
        private final int level;
        private final Role parent;

        Role(String name, int level, Role parent) {
            this.name = name;
            this.level = level;
            this.parent = parent;
        }

        @Override
        @JsonValue
        public String getLabel() {
            return name;
        }

        public int getLevel() {
            return level;
        }

        public Role getParent() {
            return parent;
        }

        public static Role of(String name) {
            for (Role userType : Role.values()) {
                if (userType.getLabel().equals(name)) {
                    return userType;
                }
            }
            return null;
        }

        public static boolean checkAuthority(Role userRole, Role target, String comparisonTypeString) {
            Role.ComparisonType comparisonType = Role.ComparisonType.get(comparisonTypeString);

            switch (comparisonType) {
                case EQUAL:
                    return userRole.getLevel() == target.getLevel();

                case GREATER_THAN:
                    return userRole.getLevel() > target.getLevel();

                case GREATER_EQUAL:
                    return userRole.getLevel() >= target.getLevel();

                case LESS_THAN:
                    return userRole.getLevel() < target.getLevel();

                case LESS_EQUAL:
                    return userRole.getLevel() <= target.getLevel();
            }

            return false;
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

    public static class FileExtensions {
        public static final String PNG = "PNG";
        public static final String JPG = "JPG";
        public static final String JPEG = "JPEG";
        public static final String GIF = "GIF";
        public static final String BMP = "BMP";
        public static final String TIFF = "TIFF";
        public static final String TIF = "TIF";
        public static final String PDF = "PDF";
    }

    public static class FileType {
        public static final String IMAGE = "IMAGE";
        public static final String PDF = "PDF";
        public static final String ETC = "ETC";
    }

    public static class ImagePreviewType {
        public static final String THUMBNAIL = "THUMBNAIL";
        public static final String ORIGIN = "ORIGIN";
    }
}
