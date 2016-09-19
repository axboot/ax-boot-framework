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

    public static class TranAdjustStatus {
        public static final String ORIGIN = "O";
        public static final String ADJUSTING = "A";
        public static final String CONFIRM = "C";
        public static final String MONTHLY_CLOSE = "M";
        public static final String RESET = "R";
    }

    public static class TranSendFlag {
        public static final String NORMAL = "N";
        public static final String ADJUST = "A";
        public static final String FINISHED = "Y";
        public static final String ERROR = "W";
    }

    public static class ItemFlag {
        public static final String NORMAL = "1";
    }

    public static class TranFlag {
        public static final String NORMAL = "0";
    }

    public static class SaleFlag {
        public static final String NORMAL = "0";
        public static final String CANCEL = "1";
        public static final String ADJUST = "2";
    }

    public static class TaxRefundFlag {
        public static final String TAXATION = "N";
        public static final String TAX_FREE = "Y";
    }

    public static class TaxFlag {
        public static final String TAXATION = "1";
        public static final String TAX_FREE = "2";
    }

    public static class TranAdjust {
        public static final String POS_NO = "9999";
        public static final String BILL_NO = "9999";
        public static final String SALE_TM = "000000";
    }
}
