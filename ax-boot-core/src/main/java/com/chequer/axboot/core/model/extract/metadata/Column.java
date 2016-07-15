package com.chequer.axboot.core.model.extract.metadata;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;

import java.util.Arrays;
import java.util.List;

@Data
public class Column {

    public static final List<String> AUDIT_COLUMNS = Arrays.asList("INS_DT", "INS_USER_CD", "UPT_DT", "UPT_USER_CD");

    private boolean key;

    private Integer keySeq;

    private String tableName;

    private String columnName;

    private Integer dataType;

    private String typeName;

    private Integer columnSize;

    private String bufferLength;

    private Integer decimalDigits;

    private Integer numPrecRadix;

    private Integer nullable;

    @Getter(AccessLevel.NONE)
    private String remarks;

    public String getRemarks() {
        return remarks == null ? "" : remarks;
    }

    private String columnDef;

    private Integer sqlDataType;

    private Integer sqlDatetimeSub;

    private Integer charOctetLength;

    private Integer ordinalPosition;

    private String isNullable;

    private String isAutoincrement;

    public boolean skip() {
        return AUDIT_COLUMNS.contains(columnName.toUpperCase());
    }

    public HibernateField hibernateField() {
        return new HibernateField(this);
    }

    @JsonProperty("humanReadableDataType")
    public String getHumanReadableDataType() {
        return hibernateField().getHumanReadableDataType();
    }

    @JsonProperty("attributeName")
    public String getAttributeName() {
        return hibernateField().getFieldName();
    }
}
