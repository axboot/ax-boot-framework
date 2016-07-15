package com.chequer.axboot.core.model.extract.metadata;

import com.chequer.axboot.core.utils.ArrayUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Data
public class Table {

    public static class Key {
        public static final String SINGLE = "SINGLE";
        public static final String COMPOSITE = "COMPOSITE";
    }

    private String tableName;

    @Getter(AccessLevel.NONE)
    private String remarks;

    public String getRemarks() {
        return remarks == null ? "" : remarks;
    }

    private List<Column> columns;

    public String keyType() {
        if (ArrayUtils.isNotEmpty(columns)) {
            return columns.stream().filter(Column::isKey).count() == 1 ? Table.Key.SINGLE : Table.Key.COMPOSITE;
        }

        throw new UnsupportedOperationException("required Table's Primary Key");
    }


    @JsonProperty("json")
    public List<Map<String, String>> getJson() {
        return columns.stream()
                .map(column -> {
                            String _column = column.hibernateField().getFieldName();
                            Map<String, String> keyValueMap = new HashMap<>();
                            keyValueMap.put(_column, "");
                            return keyValueMap;
                        }
                ).collect(toList());
    }

    public String keyClassName(String className) {
        if (keyType().equals(Table.Key.SINGLE)) {
            return columns.stream().filter(Column::isKey).findAny().get().hibernateField().getJavaType();
        }

        return className + "Id";
    }

    public String keyClassRefName(String className) {
        String keyClassName = keyClassName(className);

        if (keyType().equals(Table.Key.SINGLE)) {
            return keyClassName;
        }

        return String.format("%s.%s", className, keyClassName);
    }

    public String returnKeyName() {
        if (keyType().equals(Table.Key.SINGLE)) {
            return columns.stream().filter(Column::isKey).findAny().get().hibernateField().getFieldName();
        } else {
            StringJoiner returnKeyName = new StringJoiner(", ");

            columns.stream().filter(Column::isKey).forEach(column -> returnKeyName.add(column.hibernateField().getFieldName()));

            return returnKeyName.toString();
        }
    }

    public String queryFields() {
        return columns.stream().map(Column::getColumnName).collect(Collectors.joining(",\n            "));
    }

    public String selectQueryFields() {
        StringJoiner stringJoiner = new StringJoiner(",\n            ");
        for (Column column : columns) {
            stringJoiner.add(column.getColumnName() + " AS " + column.hibernateField().getFieldName());
        }
        return stringJoiner.toString();
    }

    public String queryValues() {
        StringJoiner stringJoiner = new StringJoiner(",\n            ");
        for (Column column : columns) {
            stringJoiner.add("#{" + column.hibernateField().getFieldName() + "}");
        }
        return stringJoiner.toString();
    }

    public String setColumns() {
        StringJoiner stringJoiner = new StringJoiner(",\n            ");
        for (Column column : columns) {
            if (!column.isKey()) {
                stringJoiner.add(column.getColumnName() + " = #{" + column.hibernateField().getFieldName() + "}");
            }
        }
        return stringJoiner.toString();
    }

    public String idWhere() {
        StringJoiner stringJoiner = new StringJoiner(", ");
        for (Column column : columns) {
            if (column.isKey()) {
                stringJoiner.add(column.getColumnName() + " = #{" + column.hibernateField().getFieldName() + "}");
            }
        }
        return stringJoiner.toString();
    }
}
