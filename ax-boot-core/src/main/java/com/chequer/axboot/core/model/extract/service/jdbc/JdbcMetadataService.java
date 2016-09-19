package com.chequer.axboot.core.model.extract.service.jdbc;

import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.db.mapper.ColumnToBeanPropertyRowMapper;
import com.chequer.axboot.core.model.extract.metadata.Column;
import com.chequer.axboot.core.model.extract.metadata.Database;
import com.chequer.axboot.core.model.extract.metadata.PrimaryKey;
import com.chequer.axboot.core.model.extract.metadata.Table;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JdbcMetadataService {

    @Inject
    protected AXBootContextConfig axBootContextConfig;

    @Inject
    protected JdbcTemplate jdbcTemplate;

    @Inject
    private DataSource dataSource;

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public String getCatalog() {
        try {
            return getConnection().getCatalog().toString();
        } catch (Exception e) {
        }
        return "";
    }

    public Database getDatabase() {
        Database database = new Database(getCatalog());
        List<Table> tables = getTables();
        database.setTables(tables);

        return database;
    }

    public List<Table> getTables() {
        List<Table> tables = new ArrayList<>();

        Connection connection = null;
        try {
            connection = getConnection();
            String[] types = {"TABLE"};

            ResultSet resultSet = connection.getMetaData().getTables(connection.getCatalog(), connection.getSchema(), "%", types);
            tables.addAll(new ColumnToBeanPropertyRowMapper<>(Table.class).mapRows(resultSet));

            for (Table table : tables) {
                table.setColumns(getColumns(table.getTableName()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (Exception e) {
                // ignore
            }
        }
        return tables;
    }

    public Table getTable(String tableName) {
        Connection connection = null;
        Table table = null;
        try {
            connection = getConnection();

            ResultSet resultSet = connection.getMetaData().getTables(connection.getCatalog(), null, tableName, null);
            if (resultSet.next()) {
                table = new ColumnToBeanPropertyRowMapper<>(Table.class).mapRow(resultSet, 0);
                table.setColumns(getColumns(tableName));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (Exception e) {
                // ignore
            }
        }

        return table;
    }

    public List<Column> getColumns(String tableName) {
        List<Column> columns = new ArrayList<>();

        Connection connection = null;
        try {
            connection = getConnection();
            ResultSet columnsResultSet = connection.getMetaData().getColumns(connection.getCatalog(), null, tableName, null);
            columns.addAll(new ColumnToBeanPropertyRowMapper<>(Column.class).mapRows(columnsResultSet));

            ResultSet primaryKeyResultSet = connection.getMetaData().getPrimaryKeys(connection.getCatalog(), null, tableName);

            List<PrimaryKey> primaryKeyList = new ColumnToBeanPropertyRowMapper<>(PrimaryKey.class).mapRows(primaryKeyResultSet);

            for (PrimaryKey primarykey : primaryKeyList) {
                for (Column columnV2 : columns) {
                    if (columnV2.getColumnName().equals(primarykey.getColumnName())) {
                        columnV2.setKey(true);
                        columnV2.setKeySeq(primarykey.getKeySeq());
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (Exception e) {
                // ignore
            }
        }

        return columns;
    }
}
