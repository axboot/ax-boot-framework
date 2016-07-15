package com.chequer.axboot.core.model.extract.sql;

public interface CatalogSQL {

	String tables();

	String table(String tableName);

	String columns(String tableName);

	String keyColumns(String tableName);
}
