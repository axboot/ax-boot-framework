package com.chequer.axboot.admin.domain.manual;

import lombok.Data;

import java.util.List;

@Data
public class ManualRequestVO {

    private List<Manual> list;

    private List<Manual> deletedList;
}
