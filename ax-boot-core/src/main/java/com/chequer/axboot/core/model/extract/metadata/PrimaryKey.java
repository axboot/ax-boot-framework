package com.chequer.axboot.core.model.extract.metadata;

import lombok.Data;

@Data
public class PrimaryKey {


    private String columnName;

    private Integer keySeq;
}
