package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.parameter.GeneralResponse;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.domain.code.CommonCode;
import com.chequer.axboot.core.domain.code.CommonCodeService;
import com.chequer.axboot.core.parameter.RequestParams;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Controller
@RequestMapping(value = "/api/v1/commonCodes")
public class CommonCodeController extends BaseController {

    @Inject
    private CommonCodeService basicCodeService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public GeneralResponse.ListResponse list(RequestParams<CommonCode> requestParams) {
        List<CommonCode> basicCodes = basicCodeService.get(requestParams);
        return GeneralResponse.ListResponse.of(basicCodes);
    }

    @RequestMapping(method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse save(@Valid @NotNull @RequestBody List<CommonCode> basicCodes, BindingResult bindingResult) {
        basicCodeService.saveCommonCode(basicCodes);
        return ok();
    }
}
