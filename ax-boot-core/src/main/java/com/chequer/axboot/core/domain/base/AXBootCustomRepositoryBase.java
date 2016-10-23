package com.chequer.axboot.core.domain.base;


import javax.inject.Inject;
import javax.inject.Provider;
import javax.persistence.EntityManager;
import java.io.Serializable;

public abstract class AXBootCustomRepositoryBase<T, PK extends Serializable> implements AXBootCustomRepository<T, PK> {
	@Inject
	private Provider<EntityManager> em;

	public AXBootCustomRepositoryBase() {
		super();
	}

	public void detach(Object entity) {
		em.get().detach(entity);
	}

}
