package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.code.CommonCode;
import com.chequer.axboot.admin.domain.code.CommonCodeService;
import com.chequer.axboot.admin.parameter.CommonListResponseParams;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.inject.Inject;
import java.util.List;

@Controller
@RequestMapping(value = "/api/v1/commonCodes")
public class CommonCodeController extends BaseController {

	@Inject
	private CommonCodeService commonCodeService;


	@RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse list(@RequestParam(required = false, defaultValue = "") String searchParams) {
		List<CommonCode> commonCodes = commonCodeService.getAllBySearchParams(searchParams);
		return CommonListResponseParams.ListResponse.of(commonCodes);
	}

	@RequestMapping(value = "/group", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse groupList(@RequestParam(required = false, defaultValue = "0") String groupCd) {
		List<CommonCode> basicCodes = commonCodeService.getByGroupCd(groupCd);
		return CommonListResponseParams.ListResponse.of(basicCodes);
	}

	@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
	public ApiResponse save(@RequestBody List<CommonCode> request) {
		commonCodeService.save(request);
		return ok();
	}
}
