package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.program.Program;
import com.chequer.axboot.admin.domain.program.ProgramService;
import com.chequer.axboot.admin.parameter.CommonListResponseParams;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.converter.BaseConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.inject.Inject;
import java.util.List;

@Controller
@RequestMapping(value = "/api/v1/programs")
public class ProgramController extends BaseController {

    @Inject
    private ProgramService programService;

    @Inject
    private BaseConverter baseConverter;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public CommonListResponseParams.ListResponse list(@RequestParam(required = false, defaultValue = "") String searchParams) {
        List<Program> programs = programService.searchProgram(searchParams);
        return CommonListResponseParams.ListResponse.of(programs);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = APPLICATION_JSON)
    public ApiResponse save(@RequestBody List<Program> request) {
        programService.saveAndCheckAuth(request);
        return ok();
    }
}
