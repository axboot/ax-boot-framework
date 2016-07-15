package com.chequer.axboot.core.domain;

import com.chequer.axboot.core.code.Types;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.util.List;


public class BaseService<T, ID extends Serializable> extends FilterService<T> {

    protected JpaRepository<T, ID> repository;

    public BaseService(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public List<T> findAll(Sort sort) {
        return repository.findAll(sort);
    }

    public Page<T> findAll(Pageable pageable, String searchParams) {
        return filterWithPaging(findAll(pageable.getSort()), pageable, searchParams);
    }

    public List<T> findAll(Iterable<ID> iterable) {
        return repository.findAll(iterable);
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
}
