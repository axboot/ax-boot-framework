package ${basePackage}.controllers;

import ${basePackage}.domain.code.CommonCode;
import ${basePackage}.domain.code.CommonCodeService;
import ${basePackage}.utils.CommonCodeUtils;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.parameter.RequestParams;
import com.wordnik.swagger.annotations.ApiImplicitParam;
import com.wordnik.swagger.annotations.ApiImplicitParams;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/api/v1/commonCodes")
public class CommonCodeController extends BaseController {

    @Inject
    private CommonCodeService basicCodeService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "groupCd", value = "분류 코드", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "useYn", value = "사용여부 (Y/N)", dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "filter", value = "검색어", dataType = "String", paramType = "query")
    })
    public Responses.ListResponse list(RequestParams<CommonCode> requestParams) {
        List<CommonCode> basicCodes = basicCodeService.get(requestParams);
        return Responses.ListResponse.of(basicCodes);
    }

    @RequestMapping(method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse save(@Valid @NotNull @RequestBody List<CommonCode> basicCodes) {
        basicCodeService.saveCommonCode(basicCodes);
        return ok();
    }

    @RequestMapping(value = "/getAllByMap", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Map<String, List<CommonCode>> getAllByMap() {
        return CommonCodeUtils.getAllByMap();
    }
}
