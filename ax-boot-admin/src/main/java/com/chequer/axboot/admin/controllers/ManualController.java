package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.GeneralResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.domain.manual.Manual;
import com.chequer.axboot.core.domain.manual.ManualListVO;
import com.chequer.axboot.core.domain.manual.ManualRequestVO;
import com.chequer.axboot.core.domain.manual.ManualService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.inject.Inject;
import java.util.List;


    @Controller
    @RequestMapping(value = "/api/v1/manual")
    public class ManualController extends BaseController {

    @Inject
    private ManualService manualService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public GeneralResponse.ListResponse manualList(RequestParams requestParams) {
        List<Manual> list = manualService.get(requestParams);
        return GeneralResponse.ListResponse.of(ModelMapperUtils.mapList(list, ManualListVO.class));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Manual manualDetail(@PathVariable Long id) {
        return manualService.findOne(id);
    }

    @RequestMapping(value = "/detail", method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse save(@RequestBody Manual manual) {
        manualService.save(manual);
        return ok();
    }

    @RequestMapping(method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse save(@RequestBody ManualRequestVO vo) {
        manualService.processManual(vo);
        return ok();
    }
}
