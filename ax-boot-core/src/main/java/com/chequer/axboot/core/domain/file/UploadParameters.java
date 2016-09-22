package com.chequer.axboot.core.domain.file;


import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadParameters {
    private MultipartFile multipartFile;

    private String targetType;

    private String targetId;

    private int sort;

    private String desc;

    private boolean deleteIfExist;

    private boolean thumbnail = true;

    private int thumbnailWidth = 640;

    private int thumbnailHeight = 640;
}
