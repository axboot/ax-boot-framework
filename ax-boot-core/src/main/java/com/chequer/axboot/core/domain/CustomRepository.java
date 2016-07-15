package com.chequer.axboot.core.domain;

import java.io.Serializable;

public interface CustomRepository<T, PK extends Serializable> {
	void detach(T entity);
}
