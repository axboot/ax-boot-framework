package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.PageableResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.domain.log.ErrorLog;
import com.chequer.axboot.core.domain.log.ErrorLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.inject.Inject;

@Controller
@RequestMapping(value = "/api/v1/errorLogs")
public class ErrorLogViewController extends BaseController {

    @Inject
    private ErrorLogService errorLogService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public PageableResponse.PageResponse list(Pageable pageable, @RequestParam(required = false) String searchParams) {
        Page<ErrorLog> errorLogPage = errorLogService.findAll(pageable, searchParams);
        return PageableResponse.PageResponse.of(errorLogPage);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = APPLICATION_JSON)
    public ApiResponse delete(@PathVariable(value = "id") Long id) {
        errorLogService.delete(id);
        return ok();
    }

    @RequestMapping(value = "/events/all", method = RequestMethod.DELETE, produces = APPLICATION_JSON)
    public ApiResponse deleteAll() {
        errorLogService.deleteAllLogs();
        return ok();
    }
}
