package com.chequer.axboot.core.model.extract.template

class ControllerTemplate {

    public static CONTROLLER_TEMPLATE =
            '''
import ${packageName}.parameter.CommonListResponseParams;
import ${packageName}.parameter.PageableResponseParams;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.fieldAnnotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.data.domain.Pageable;

import javax.inject.Inject;
import java.util.List;


@Controller
@RequestMapping(value = "/api/v1/${apiPath}")
public class ${controllerClassName} extends BaseController {

    @Inject
    private ${serviceClassName} ${serviceClassFieldName};

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public PageableResponseParams.PageResponse list(Pageable pageable) {
        Page<${entityClassName}> ${entityClassFieldName}Page = ${serviceClassFieldName}.findAll(pageable);
        return PageableResponseParams.PageResponse.of(${entityClassFieldName}Page);
    }

    @RequestMapping(method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ${entityClassName} save(@RequestBody ${entityClassName} request) {
        ${serviceClassFieldName}.save(request);
        return request;
    }
}
'''
}
