package com.chequer.axboot.core.domain;


import javax.inject.Inject;
import javax.inject.Provider;
import javax.persistence.EntityManager;
import java.io.Serializable;

public abstract class CustomRepositoryBase<T, PK extends Serializable> implements CustomRepository<T, PK> {
	@Inject
	private Provider<EntityManager> em;

	public CustomRepositoryBase() {
		super();
	}

	public void detach(Object entity) {
		em.get().detach(entity);
	}

}
