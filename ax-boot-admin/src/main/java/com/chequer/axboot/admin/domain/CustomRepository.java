package com.chequer.axboot.admin.domain;

import java.io.Serializable;

public interface CustomRepository<T, PK extends Serializable> {
	void detach(T entity);
}
