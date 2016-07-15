package com.chequer.axboot.core.model.extract.metadata;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Database {

    public Database(String databaseName) {
        this.databaseName = databaseName;
    }

    private String databaseName;

    private List<Table> tables = new ArrayList<>();

    public void addTable(Table table) {
        tables.add(table);
    }
}
