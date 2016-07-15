package com.chequer.axboot.core.db.schema;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ColumnDefinition {

    private String columnName;

    private String definition;

    private String columnDefinition;

    private int position = Integer.MAX_VALUE - 10;

    public ColumnDefinition(String columnDefinition) {
        try {
            this.columnDefinition = columnDefinition;

            if (columnDefinition.toLowerCase().startsWith("primary key")) {
                position = Integer.MAX_VALUE;
            } else {
                this.columnName = columnDefinition.split(" ")[0];
                this.definition = columnDefinition.split(" ")[1];
            }
        } catch (Exception e) {
            // ignore
        }
    }

    public String getColumnDefinition() {
        return columnDefinition;
    }

    public String getColumnName() {
        return columnName;
    }

    public int getPosition() {
        return position;
    }

    public String getDefinition() {
        return definition;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
