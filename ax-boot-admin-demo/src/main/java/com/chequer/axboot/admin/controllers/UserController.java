package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.user.User;
import com.chequer.axboot.admin.domain.user.UserService;
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
@RequestMapping(value = "/api/v1/users")
public class UserController extends BaseController {

	@Inject
	private UserService userService;

	@RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse list(
			@RequestParam(value = "userCd", required = false, defaultValue = "") String userCd,
			@RequestParam(value = "userType", required = false, defaultValue = "") String userType) {
		List<User> users = userService.findByUserTypeAndUserCd(userType, userCd);
		return CommonListResponseParams.ListResponse.of(users);
	}

	@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
	public ApiResponse save(@RequestBody List<User> request) {
		userService.updateUser(request);
		return ok();
	}

	@RequestMapping(value = "/updateMyInfo", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
	public ApiResponse updateMyInfo(@RequestBody User request) {
		userService.updateMyInfo(request);
		return ok();
	}
}
