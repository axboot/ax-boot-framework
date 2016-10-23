package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.init.DatabaseInitService;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.controllers.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.inject.Inject;

@RequestMapping("/setup")
@Controller
public class InitializationController extends BaseController {

    @Inject
    private AXBootContextConfig axBootContextConfig;

    @Inject
    private DatabaseInitService databaseInitService;

    @RequestMapping(method = RequestMethod.GET, produces = "text/html")
    public String setup(ModelMap modelMap) {
        modelMap.put("databaseType", axBootContextConfig.getDataSourceConfig().getHibernateConfig().getDatabaseType());
        modelMap.put("jdbcUrl", axBootContextConfig.getDataSourceConfig().getUrl());
        modelMap.put("username", axBootContextConfig.getDataSourceConfig().getUsername());
        return "/setup/index";
    }

    @RequestMapping(value = "/init", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public ApiResponse init() throws Exception {
        databaseInitService.init();
        return ok();
    }

    @RequestMapping(value = "/createCode", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public ApiResponse createBaseCode() throws Exception {
        databaseInitService.createBaseCode();
        return ok();
    }
}
