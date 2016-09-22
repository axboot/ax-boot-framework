package com.chequer.axboot.core.domain;

import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.db.mapper.ColumnToBeanPropertyRowMapper;
import com.chequer.axboot.core.domain.code.QCommonCode;
import com.chequer.axboot.core.domain.manual.QManual;
import com.chequer.axboot.core.domain.program.QProgram;
import com.chequer.axboot.core.domain.program.menu.QMenu;
import com.chequer.axboot.core.domain.user.QUser;
import com.chequer.axboot.core.domain.user.auth.QUserAuth;
import com.chequer.axboot.core.domain.user.auth.menu.QAuthGroupMenu;
import com.chequer.axboot.core.domain.user.role.QUserRole;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class BaseService<T, ID extends Serializable> extends FilterService<T> {

    protected QUserRole qUserRole = QUserRole.userRole;
    protected QAuthGroupMenu qAuthGroupMenu = QAuthGroupMenu.authGroupMenu;
    protected QCommonCode qCommonCode = QCommonCode.commonCode;
    protected QUser qUser = QUser.user;
    protected QProgram qProgram = QProgram.program;
    protected QUserAuth qUserAuth = QUserAuth.userAuth;
    protected QMenu qMenu = QMenu.menu;
    protected QManual qMenual = QManual.manual;

    protected JPAQueryDSLRepository<T, ID> repository;

    public BaseService(JPAQueryDSLRepository<T, ID> repository) {
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
        return repository.findAll(iterable);
    }

    public T findOne(Predicate predicate) {
        return repository.findOne(predicate);
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

        if (var instanceof CrudModel) {
            CrudModel crudModel = (CrudModel) var;

            if (crudModel.getDataStatus() == Types.DataStatus.DELETED) {
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
    public <S extends T> List<S> save(List<S> vars) {
        vars.forEach(this::save);
        return vars;
    }

    public T findOne(ID var1) {
        return repository.findOne(var1);
    }

    public boolean exists(ID var1) {
        return repository.exists(var1);
    }

    public long count() {
        return repository.count();
    }

    @Transactional
    public void delete(ID var1) {
        repository.delete(var1);
    }

    @Transactional
    public void delete(T var1) {
        repository.delete(var1);
    }

    @Transactional
    public void delete(Iterable<? extends T> var1) {
        repository.delete(var1);
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

    public boolean isNotEmpty(String value) {
        return StringUtils.isNotEmpty(value);
    }

    public boolean isEmpty(String value) {
        return StringUtils.isEmpty(value);
    }

    public boolean isEmpty(List<?> list) {
        return list == null || list.size() == 0;
    }

    public boolean isNotEmpty(List<?> list) {
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
}
