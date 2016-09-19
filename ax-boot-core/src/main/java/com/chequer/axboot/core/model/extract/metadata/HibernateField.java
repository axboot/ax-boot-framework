package com.chequer.axboot.core.model.extract.metadata;

import com.chequer.axboot.core.utils.NamingUtils;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.sql.Types;
import java.util.ArrayList;
import java.util.List;


@Data
public class HibernateField {

    private String javaType;

    private String goType;

    private List<String> entityClassImportList = new ArrayList<>();

    private List<String> entityClassAnnotationList = new ArrayList<>();

    private String columnName;

    private String fieldName;

    private String fieldAnnotation;

    private String humanReadableDataType;

    private Column column;

    public HibernateField(Column column) {
        StringBuilder annotation = new StringBuilder(String.format("@Column(name = \"%s\"${columnDefinition}${nullable})", column.getColumnName()));

        String columnDefinition = "";

        this.column = column;
        this.columnName = column.getColumnName();
        this.fieldName = NamingUtils.fieldName(column.getColumnName());

        switch (column.getDataType()) {
            case Types.CHAR:
            case Types.NCHAR:
            case Types.VARCHAR:
            case Types.NVARCHAR:
            case Types.LONGNVARCHAR:
            case Types.LONGVARCHAR:
                this.goType = "string";
                this.javaType = "String";
                this.humanReadableDataType = String.format("%s(%s)", column.getTypeName(), column.getColumnSize());
                //columnDefinition = String.format("length = %d, columnDefinition = \"%s\"", column.getColumnSize(), column.getTypeName());
                columnDefinition = String.format("length = %d", column.getColumnSize());
                break;

            case Types.CLOB:
            case Types.NCLOB:
                annotation.append("\n\t@Lob @Basic(fetch = FetchType.LAZY)");
                this.javaType = "String";
                this.goType = "string";
                this.humanReadableDataType = String.format("%s(%s)", column.getTypeName(), column.getColumnSize());
                columnDefinition = String.format("columnDefinition = \"%s\"", column.getTypeName());
                break;

            case Types.BLOB:
            case Types.VARBINARY:
            case Types.LONGVARBINARY:
            case Types.BINARY:
                annotation.append("\n\t@Lob @Basic(fetch = FetchType.LAZY)");
                columnDefinition = String.format("columnDefinition = \"%s\"", column.getTypeName());
                this.javaType = "byte[]";
                this.goType = "[]byte";
                break;

            case Types.BOOLEAN:
            case Types.BIT:
                this.goType = "bool";
                this.javaType = "Boolean";
                this.humanReadableDataType = String.format("%s(%d)", column.getTypeName(), column.getColumnSize());
                columnDefinition = String.format("length = %d, columnDefinition = \"BIT(1)\"", 1);
                break;

            case Types.FLOAT:
            case Types.REAL:
                this.goType = "float32";
                this.javaType = "Float";
                this.humanReadableDataType = String.format("%s(%d,%d)", column.getTypeName(), column.getColumnSize(), getInt(column.getDecimalDigits()));
                //columnDefinition = String.format("precision = %d, scale = %d, columnDefinition = \"%s\"", column.getColumnSize(), getInt(column.getDecimalDigits()), column.getTypeName());
                columnDefinition = String.format("precision = %d, scale = %d", column.getColumnSize(), getInt(column.getDecimalDigits()));
                break;

            case Types.DOUBLE:
                this.goType = "float64";
                this.javaType = "Double";
                this.humanReadableDataType = String.format("%s(%d,%d)", column.getTypeName(), column.getColumnSize(), getInt(column.getDecimalDigits()));
                //columnDefinition = String.format("precision = %d, scale = %d, columnDefinition = \"%s\"", column.getColumnSize(), getInt(column.getDecimalDigits()), column.getTypeName());
                columnDefinition = String.format("precision = %d, scale = %d", column.getColumnSize(), getInt(column.getDecimalDigits()));
                break;

            case Types.DECIMAL:
            case Types.NUMERIC:
                this.goType = "int";
                this.javaType = "BigDecimal";
                this.entityClassImportList.add("java.math.BigDecimal");
                this.humanReadableDataType = String.format("%s(%d,%d)", column.getTypeName(), column.getColumnSize(), getInt(column.getDecimalDigits()));
                //columnDefinition = String.format("precision = %d, scale = %d, columnDefinition = \"%s\"", column.getColumnSize(), getInt(column.getDecimalDigits()), column.getTypeName());
                columnDefinition = String.format("precision = %d, scale = %d", column.getColumnSize(), getInt(column.getDecimalDigits()));
                break;

            case Types.INTEGER:
            case Types.TINYINT:
            case Types.SMALLINT:
                this.goType = "int";
                this.javaType = "Integer";
                this.humanReadableDataType = String.format("%s(%d)", column.getTypeName(), column.getColumnSize());
                //columnDefinition = String.format("precision = %d, columnDefinition = \"%s\"", column.getColumnSize(), column.getTypeName());
                columnDefinition = String.format("precision = %d", column.getColumnSize());
                break;

            case Types.BIGINT:
                this.goType = "int64";
                this.javaType = "Long";
                this.humanReadableDataType = String.format("%s(%d)", column.getTypeName(), column.getColumnSize());
                columnDefinition = String.format("precision = %d", column.getColumnSize());
                break;

            case Types.DATE:
                this.goType = "time";
                this.javaType = "LocalDate";
                this.entityClassImportList.add("java.time.LocalDate");
                this.humanReadableDataType = String.format("%s", column.getTypeName());
                //columnDefinition = String.format("columnDefinition = \"%s\"", column.getTypeName());
                break;

            case Types.TIME:
                this.goType = "time";
                this.javaType = "LocalTime";
                this.entityClassImportList.add("java.time.LocalTime");
                this.humanReadableDataType = String.format("%s", column.getTypeName());
                //columnDefinition = String.format("columnDefinition = \"%s\"", column.getTypeName());
                break;

            case Types.TIMESTAMP:
                this.goType = "time";
                this.javaType = "Timestamp";
                this.entityClassImportList.add("java.sql.Timestamp");
                this.humanReadableDataType = String.format("%s", column.getTypeName());
                //columnDefinition = String.format("columnDefinition = \"%s\"", column.getTypeName());
                break;

            default:
                throw new IllegalArgumentException("existing not matched column to java type / [ typeName : " + column.getTypeName() + " ]");
        }

        if ("JSON".equals(column.getTypeName())) {
            columnDefinition = String.format("columnDefinition = \"%s\"", column.getTypeName());
            annotation.append("\n\t@Type(type = \"jsonNode\")");
            this.javaType = "JsonNode";
            this.entityClassImportList.add("com.fasterxml.jackson.databind.JsonNode");
            this.entityClassImportList.add("org.hibernate.annotations.Type");
            this.entityClassImportList.add("org.hibernate.annotations.TypeDef");
            this.entityClassImportList.add("com.chequer.axboot.core.db.jsonb.types.MySQLJSONUserType");
            this.entityClassAnnotationList.add("@TypeDef(" +
                    "\n        name = \"jsonNode\", " +
                    "\n        typeClass = MySQLJSONUserType.class, " +
                    "\n        parameters = {@org.hibernate.annotations.Parameter(name = MySQLJSONUserType.CLASS, value = \"com.fasterxml.jackson.databind.JsonNode\")}" +
                    "\n)");
        }

        if ("DATETIME".equals(column.getTypeName())) {
            this.javaType = "LocalDateTime";
            this.goType = "time";
            this.entityClassImportList.add("java.time.LocalDateTime");
        }

        if ("YEAR".equals(column.getTypeName())) {
            this.javaType = "Year";
            this.entityClassImportList.add("java.time.Year");
        }

        String nullable = column.getNullable() == 0 ? ", nullable = false" : "";

        this.fieldAnnotation = annotation.toString();

        if (StringUtils.isNotEmpty(columnDefinition)) {
            this.fieldAnnotation = this.fieldAnnotation.replace("${columnDefinition}", ", " + columnDefinition);
        } else {
            this.fieldAnnotation = this.fieldAnnotation.replace("${columnDefinition}", "");
        }

        this.fieldAnnotation = this.fieldAnnotation.replace("${nullable}", nullable);


    }

    public int getInt(Integer integer) {
        return integer == null ? 0 : integer;
    }
}
