/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Vladislav Zablotsky
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE. 
 */
package com.chequer.axboot.core.mybatis.typehandler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.*;

/**
 * Core handler for all array types based only on JDBC array types.
 * Handling logic is similar for any array type.
 * Your subclasses must only provide interrelation between actual java and db types.
 * In a case of multi-dimensional arrays you also have to override
 * {@link ArrayTypeHandler#toEmptyValue(Object[])} method.
 *
 * @param <T> Java array type that will be mapped to DB, like Integer[]
 */
public abstract class ArrayTypeHandler<T> extends BaseTypeHandler<T> {

    /**
     * Should return the SQL name of the type the elements of the array map to.
     *
     * In a case of PostgreSQL for any array dimension like boolean[][][] you must return
     * only element type - "boolean".
     */
    protected abstract String getDbTypeName(Connection connection) throws SQLException;

    /**
     * In a case when you have multi-dimensional array you have to override this method in order
     * to return correct empty (not null) array value.
     *
     * Speaking about PostgreSQL when your int4[][] array is empty it will be stored
     * as 1 dimensional empty array into DB.
     * Thus it is impossible to cast retrieved array value to Integer[][].
     *
     * @param value Acquired from DB array type (should be at least one dimension array).
     *
     * @return n-dimension empty array according to your handler
     */
    @SuppressWarnings("unchecked")
    protected T toEmptyValue(Object[] value) {
        return (T)value;
    }

    @SuppressWarnings("unchecked")
    private T fromArray(Array source) {
        try {
            Object[] arr = (Object[])source.getArray();
            return arr.length == 0 ? toEmptyValue(arr) : (T)arr;
        } catch (SQLException ex) {
            throw new RuntimeException(ex.getMessage(), ex);
        }
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        Array param = ps.getConnection().createArrayOf(getDbTypeName(ps.getConnection()), (Object[])parameter);
        // ps.setObject(i, param, java.sql.Types.ARRAY);
        ps.setArray(i, param);
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        Array array = rs.getArray(columnName);
        if (array == null) {
            return null;
        }
        return fromArray(array);
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        Array array = rs.getArray(columnIndex);
        if (array == null) {
            return null;
        }
        return fromArray(array);
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        Array array = cs.getArray(columnIndex);
        if (array == null) {
            return null;
        }
        return fromArray(array);
    }
}
