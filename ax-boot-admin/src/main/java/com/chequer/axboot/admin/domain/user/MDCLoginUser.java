package com.chequer.axboot.admin.domain.user;

import eu.bitwalker.useragentutils.*;
import lombok.Data;

@Data
public class MDCLoginUser {
    private String userCd;

    private String userNm;

    private String compNm;

    private String userType;

    private UserAgent userAgent;

    private BrowserType browserType;

    private RenderingEngine renderingEngine;

    private DeviceType deviceType;

    private Manufacturer manufacturer;

}
