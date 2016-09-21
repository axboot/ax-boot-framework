package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.inject.Inject;

@Controller
public class ErrorRaiseController extends BaseController {

    @Inject
    private JdbcTemplate jdbcTemplate;

    @RequestMapping(value = "/raiseError", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public ApiResponse raiseError(@RequestParam(required = false) String raise) throws Exception {

        if (StringUtils.isNotEmpty(raise)) {
            throw new Exception("API 예외 발생!!");
        }

        return ok();
    }

    @RequestMapping(value = "/slowQuery", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public ApiResponse slowQuery() {
        jdbcTemplate.execute("SELECT SLEEP(5);");
        return ok();
    }
}
