package com.chequer.axboot.core.domain.base;

import java.io.Serializable;

public interface AXBootCustomRepository<T, PK extends Serializable> {
	void detach(T entity);
}
