package com.chequer.axboot.core.domain;

import com.chequer.axboot.core.code.Types;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("__deleted__")
    protected boolean deleted;

    @Transient
    @JsonProperty("__created__")
    protected boolean created;

    @Transient
    @JsonProperty("__modified__")
    protected boolean modified;
}
