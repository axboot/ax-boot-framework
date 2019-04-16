package com.chequer.axboot.core.domain.base;

import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.db.mapper.ColumnToBeanPropertyRowMapper;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPADeleteClause;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAUpdateClause;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;


public abstract class AXBootBaseService<T, ID extends Serializable> extends AXBootFilterService<T> {

    public AXBootBaseService() {

    }

    protected AXBootJPAQueryDSLRepository<T, ID> repository;

    public AXBootBaseService(AXBootJPAQueryDSLRepository<T, ID> repository) {
        this.repository = repository;
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public List<T> findAll(Sort sort) {
        return repository.findAll(sort);
    }

    public Page<T> findAll(Pageable pageable, String searchParams) {
        return filter(findAll(pageable.getSort()), pageable, searchParams);
    }

    public List<T> findAll(Iterable<ID> iterable) {
        return repository.findAllById(iterable);
    }

    public T findOne(Predicate predicate) {
        return repository.findOne(predicate).orElse(null);
    }

    public List<T> findAll(Predicate predicate) {
        return toList(repository.findAll(predicate));
    }

    public List<T> findAll(Predicate predicate, Sort sort) {
        return toList(repository.findAll(predicate, sort));
    }

    public List<T> toList(Iterable<T> iterable) {
        if (iterable != null) {
            List<T> list = new ArrayList<>();
            for (T item : iterable) {
                list.add(item);
            }

            return list;
        }

        return Collections.emptyList();
    }

    public List<T> findAll(Predicate predicate, OrderSpecifier... orderSpecifiers) {
        return toList(repository.findAll(predicate, orderSpecifiers));
    }

    public List<T> findAll(OrderSpecifier... orderSpecifiers) {
        return toList(repository.findAll(orderSpecifiers));
    }

    public Page<T> findAll(Predicate predicate, Pageable pageable) {
        return repository.findAll(predicate, pageable);
    }

    public long count(Predicate predicate) {
        return repository.count(predicate);
    }

    public boolean exists(Predicate predicate) {
        return repository.exists(predicate);
    }

    public void flush() {
        repository.flush();
    }

    @Transactional
    public <S extends T> S saveAndFlush(S object) {
        return repository.saveAndFlush(object);
    }

    @Transactional
    public void deleteInBatch(Iterable<T> iterable) {
        repository.deleteInBatch(iterable);
    }

    @Transactional
    public void deleteAllInBatch() {
        repository.deleteAllInBatch();
    }

    public T getOne(ID id) {
        return repository.getOne(id);
    }

    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional
    public <S extends T> S save(S var) {
        boolean deleted = false;

        if (var instanceof AXBootCrudModel) {
            AXBootCrudModel crudModel = (AXBootCrudModel) var;

            if (crudModel.getDataStatus() == AXBootTypes.DataStatus.DELETED) {
                deleted = true;
            }
        }

        if (deleted) {
            repository.delete(var);
        } else {
            repository.save(var);
        }

        return var;
    }

    @Transactional
    public <S extends T> Collection<S> save(Collection<S> vars) {
        vars.forEach(this::save);
        return vars;
    }

    public T findOne(ID var1) {
        return repository.findById(var1).orElse(null);
    }

    public boolean exists(ID var1) {
        return repository.existsById(var1);
    }

    public long count() {
        return repository.count();
    }

    @Transactional
    public void delete(ID var1) {
        repository.deleteById(var1);
    }

    @Transactional
    public void delete(T var1) {
        repository.delete(var1);
    }

    @Transactional
    public void delete(Iterable<? extends T> var1) {
        repository.deleteAll(var1);
    }

    @Transactional
    public void deleteAll() {
        repository.deleteAll();
    }

    @PersistenceContext
    protected EntityManager em;

    @Inject
    protected JdbcTemplate jdbcTemplate;

    public int getInt(Integer integer) {
        if (integer == null) {
            return 0;
        }
        return integer;
    }

    public long getLong(Long _long) {
        if (_long == null) {
            return 0;
        }
        return _long;
    }

    public int getInt(BigDecimal bigDecimal) {
        if (bigDecimal == null)
            return 0;
        return bigDecimal.intValue();
    }

    public long getLong(BigDecimal bigDecimal) {
        if (bigDecimal == null)
            return 0;

        return bigDecimal.longValue();
    }

    protected String like(String field) {
        return "%" + field + "%";
    }

    public boolean isNotEmpty(String value) {
        return StringUtils.isNotEmpty(value);
    }

    public boolean isEmpty(String value) {
        return StringUtils.isEmpty(value);
    }

    public boolean isEmpty(Collection<?> list) {
        return list == null || list.size() == 0;
    }

    public boolean isNotEmpty(Collection<?> list) {
        return !isEmpty(list);
    }

    public boolean equals(Object o1, Object o2) {
        if (o1 == null) {
            return false;
        }

        if (o2 == null) {
            return false;
        }

        return o1.equals(o2);
    }

    public boolean notEquals(Object o1, Object o2) {
        return !equals(o1, o2);
    }

    protected JPAQuery<T> select() {
        return new JPAQuery<>(em);
    }

    protected JPAUpdateClause update(EntityPath<?> entityPath) {
        return new JPAUpdateClause(em, entityPath);
    }

    protected JPADeleteClause delete(EntityPath<?> entityPath) {
        return new JPADeleteClause(em, entityPath);
    }

    protected <T> List<T> queryList(String query, Class<T> clazz) {
        return jdbcTemplate.query(query, new ColumnToBeanPropertyRowMapper<>(clazz));
    }

    protected <T> T query(String query, Class<T> clazz) {
        return jdbcTemplate.queryForObject(query, new ColumnToBeanPropertyRowMapper<>(clazz));
    }

    protected <T> T queryObject(String query, Class<T> clazz) {
        return jdbcTemplate.queryForObject(query, clazz);
    }


    public RequestParams<T> buildRequestParams() {
        return new RequestParams<>();
    }
}
