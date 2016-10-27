package com.chequer.axboot.initialzr.domain;

import lombok.Data;

@Data
public class ProjectGenerateRequest {

    private String groupId;

    private String artifact;

    private String projectName;

    private String description;

    private String packageName;

}
