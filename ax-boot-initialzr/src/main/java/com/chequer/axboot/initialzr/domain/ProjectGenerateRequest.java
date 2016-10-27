package com.chequer.axboot.initialzr.domain;

import lombok.Data;

@Data
public class ProjectGenerateRequest {

    private String group;

    private String artifact;

    private String name;

    private String description;

    private String packageName;

}
