package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.program.Program;
import com.chequer.axboot.admin.domain.program.ProgramService;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.parameter.RequestParams;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.inject.Inject;
import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping(value = "/api/v1/programs")
public class ProgramController extends BaseController {

    @Inject
    private ProgramService programService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.ListResponse list(RequestParams<Program> requestParams) {
        List<Program> programs = programService.get(requestParams);
        return Responses.ListResponse.of(programs);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = APPLICATION_JSON)
    public ApiResponse save(@Valid @RequestBody List<Program> request) {
        programService.saveProgram(request);
        return ok();
    }
}
