package com.chequer.axboot.core.domain.base;

import com.chequer.axboot.core.code.AXBootTypes;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.Transient;

@Data
public abstract class AXBootCrudModel {

    @Transient
    public AXBootTypes.DataStatus getDataStatus() {
        if (__deleted__) {
            return AXBootTypes.DataStatus.DELETED;
        }

        if (__created__) {
            return AXBootTypes.DataStatus.CREATED;
        }

        if (__modified__) {
            return AXBootTypes.DataStatus.MODIFIED;
        }

        return AXBootTypes.DataStatus.ORIGIN;
    }

    @Transient
    @JsonProperty("__deleted__")
    protected boolean __deleted__;

    @Transient
    @JsonProperty("__created__")
    protected boolean __created__;

    @Transient
    @JsonProperty("__modified__")
    protected boolean __modified__;

    @Transient
    @JsonIgnore
    public boolean isDeleted() {
        return __deleted__;
    }

    @Transient
    @JsonIgnore
    public boolean isCreated() {
        return __created__;
    }

    @Transient
    @JsonIgnore
    public boolean isModified() {
        return __modified__;
    }
}
