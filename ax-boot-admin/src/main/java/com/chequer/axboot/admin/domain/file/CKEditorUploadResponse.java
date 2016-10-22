package com.chequer.axboot.admin.domain.file;

import lombok.Data;

@Data
public class CKEditorUploadResponse {

    private int uploaded = 1;

    private String fileName;

    private String url;
}
