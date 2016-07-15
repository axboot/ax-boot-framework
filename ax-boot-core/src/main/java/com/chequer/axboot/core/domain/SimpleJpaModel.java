package com.chequer.axboot.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.domain.Persistable;

import javax.persistence.MappedSuperclass;
import java.io.Serializable;

@Setter
@Getter
@MappedSuperclass
@DynamicInsert
@DynamicUpdate
public abstract class SimpleJpaModel<PK extends Serializable> extends CrudModel implements Persistable<PK>, Serializable {

	@Override
	@JsonIgnore
	public boolean isNew() {
		return null == getId();
	}

}
