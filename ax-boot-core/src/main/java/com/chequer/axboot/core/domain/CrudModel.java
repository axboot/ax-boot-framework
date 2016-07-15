package com.chequer.axboot.core.domain;

import com.chequer.axboot.core.code.Types;
import lombok.Data;

import javax.persistence.Transient;

@Data
public abstract class CrudModel {

	@Transient
	public Types.DataStatus getDataStatus() {
		if (deleted) {
			return Types.DataStatus.DELETED;
		}

		if (created) {
			return Types.DataStatus.CREATED;
		}

		if (modified) {
			return Types.DataStatus.MODIFIED;
		}

		return Types.DataStatus.ORIGIN;
	}

	@Transient
	protected boolean deleted;

	@Transient
	protected boolean created;

	@Transient
	protected boolean modified;
}
