package com.chequer.axboot.core.controllers;

import com.chequer.axboot.core.utils.CoreUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UtilController extends BaseController {

    @RequestMapping(value = "/api/v1/utils/uuid", method = RequestMethod.GET)
    public Map<String, Object> uuid() {
        Map<String, Object> map = new HashMap<>();
        map.put("uuid", CoreUtils.getUUID());
        return map;
    }
}

