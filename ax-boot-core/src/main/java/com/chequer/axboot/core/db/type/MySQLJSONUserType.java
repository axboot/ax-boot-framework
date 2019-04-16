package com.chequer.axboot.core.db.type;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.HibernateException;
import org.hibernate.boot.registry.classloading.internal.ClassLoaderServiceImpl;
import org.hibernate.boot.registry.classloading.spi.ClassLoaderService;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.type.SerializationException;
import org.hibernate.usertype.ParameterizedType;
import org.hibernate.usertype.UserType;

import java.io.IOException;
import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;
import java.util.stream.Collectors;

public class MySQLJSONUserType implements ParameterizedType, UserType {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final ClassLoaderService classLoaderService = new ClassLoaderServiceImpl();

    public static final String JSON_TYPE = "json";
    public static final String CLASS = "CLASS";

    private Class jsonClassType;

    @Override
    public Class<Object> returnedClass() {
        return Object.class;
    }

    @Override
    public int[] sqlTypes() {
        return new int[]{Types.JAVA_OBJECT};
    }

    @Override
    public Object nullSafeGet(ResultSet resultSet, String[] names, SharedSessionContractImplementor sharedSessionContractImplementor, Object o) throws HibernateException, SQLException {
        try {
            if (resultSet.getBytes(names[0]) != null) {
                final String json = new String(resultSet.getBytes(names[0]), "UTF-8");
                return objectMapper.readValue(json, jsonClassType);
            }
            return null;
        } catch (IOException e) {
            throw new HibernateException(e);
        }
    }

    @Override
    public void nullSafeSet(PreparedStatement st, Object value, int index, SharedSessionContractImplementor sharedSessionContractImplementor) throws HibernateException, SQLException {
        try {
            final String json = value == null ? null : objectMapper.writeValueAsString(value);
            st.setObject(index, json);
        } catch (JsonProcessingException e) {
            throw new HibernateException(e);
        }
    }

    @Override
    public void setParameterValues(Properties parameters) {
        final String clazz = (String) parameters.get(CLASS);
        jsonClassType = classLoaderService.classForName(clazz);
    }

    @SuppressWarnings("unchecked")
    @Override
    public Object deepCopy(Object value) throws HibernateException {

        if (!(value instanceof Collection)) {
            return value;
        }

        Collection<?> collection = (Collection) value;
        Collection collectionClone = CollectionFactory.newInstance(collection.getClass());

        collectionClone.addAll(collection.stream().map(this::deepCopy).collect(Collectors.toList()));

        return collectionClone;
    }

    static final class CollectionFactory {
        @SuppressWarnings("unchecked")
        static <E, T extends Collection<E>> T newInstance(Class<? extends Collection> collectionClass) {
            if (List.class.isAssignableFrom(collectionClass)) {
                return (T) new ArrayList<E>();
            } else if (Set.class.isAssignableFrom(collectionClass)) {
                return (T) new HashSet<E>();
            } else {
                throw new IllegalArgumentException("Unsupported collection type : " + collectionClass);
            }
        }
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public boolean equals(Object x, Object y) throws HibernateException {
        if (x == y) {
            return true;
        }

        if ((x == null) || (y == null)) {
            return false;
        }

        return x.equals(y);
    }

    @Override
    public int hashCode(Object x) throws HibernateException {
        assert (x != null);
        return x.hashCode();
    }

    @Override
    public Object assemble(Serializable cached, Object owner) throws HibernateException {
        return deepCopy(cached);
    }

    @Override
    public Serializable disassemble(Object value) throws HibernateException {
        Object deepCopy = deepCopy(value);

        if (!(deepCopy instanceof Serializable)) {
            throw new SerializationException(String.format("%s is not serializable class", value), null);
        }

        return (Serializable) deepCopy;
    }

    @Override
    public Object replace(Object original, Object target, Object owner) throws HibernateException {
        return deepCopy(original);
    }
}
