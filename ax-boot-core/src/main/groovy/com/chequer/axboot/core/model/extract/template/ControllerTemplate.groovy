package com.chequer.axboot.core.model.extract.template

class ControllerTemplate {

    public static CONTROLLER_TEMPLATE =
            '''
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.parameter.RequestParams;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.inject.Inject;
import java.util.List;

@Controller
@RequestMapping(value = "/api/v1/${apiPath}")
public class ${controllerClassName} extends BaseController {

    @Inject
    private ${serviceClassName} ${serviceClassFieldName};

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.ListResponse list(RequestParams<${entityClassName}> requestParams) {
        List<${entityClassName}> list = ${serviceClassFieldName}.gets(requestParams);
        return Responses.ListResponse.of(list);
    }

    @RequestMapping(method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ${entityClassName} save(@RequestBody ${entityClassName} request) {
        ${serviceClassFieldName}.save(request);
        return request;
    }
}
'''
}
