package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.user.auth.UserAuth;
import com.chequer.axboot.admin.domain.user.auth.UserAuthService;
import com.chequer.axboot.admin.domain.user.auth.UserAuthVO;
import com.chequer.axboot.admin.domain.user.auth.group.AuthGroup;
import com.chequer.axboot.admin.domain.user.auth.group.AuthGroupMenuVO;
import com.chequer.axboot.admin.domain.user.auth.group.AuthGroupService;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenu;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenuService;
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
@RequestMapping(value = "/api/v1/auth")
public class AuthController extends BaseController {

	@Inject
	private AuthGroupService authGroupService;

	@Inject
	private AuthGroupMenuService authGroupMenuService;

	@Inject
	private UserAuthService userAuthService;

	@Inject
	private BaseConverter baseConverter;

	@RequestMapping(value = "/groups", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse list() {
		List<AuthGroup> authGroups = authGroupService.findAll();
		return CommonListResponseParams.ListResponse.of(authGroups);
	}

	@RequestMapping(value = "/groups", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
	public ApiResponse save(@RequestBody List<AuthGroup> request) {
		authGroupService.save(request);
		return ok();
	}

	@RequestMapping(value = "/groups", method = {RequestMethod.DELETE}, produces = APPLICATION_JSON)
	public ApiResponse delete(@RequestParam(required = true, defaultValue = "") String grpAuthCd) {
		authGroupService.delete(grpAuthCd);
		return ok();
	}

	@RequestMapping(value = "/groups/menus", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse menuList(@RequestParam(required = true, defaultValue = "") String grpAuthCd) {
		List<AuthGroupMenu> authGroupMenuList = authGroupMenuService.findByGrpAuthCd(grpAuthCd);
		return CommonListResponseParams.ListResponse.of(AuthGroupMenuVO.of(authGroupMenuList));
	}

	@RequestMapping(value = "/groups/menus", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
	public ApiResponse saveMenu(@RequestBody List<AuthGroupMenuVO> authGroupMenuVTOList) {
		List<AuthGroupMenu> authGroupMenuList = baseConverter.convert(authGroupMenuVTOList, AuthGroupMenu.class);
		authGroupMenuService.saveGroupMenus(authGroupMenuList);
		return ok();
	}

	@RequestMapping(value = "/groups/menus", method = {RequestMethod.DELETE}, produces = APPLICATION_JSON)
	public ApiResponse deleteMenu(@RequestParam(required = true, defaultValue = "") String grpAuthCd, @RequestParam(value = "mnuCd", required = true) List<String> mnuCds) {
		authGroupMenuService.deleteByGrpAuthCdAndMnuCds(grpAuthCd, mnuCds);
		return ok();
	}


	@RequestMapping(value = "/users", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse authGroupListOnUser(@RequestParam(value = "userCd", required = true) String userCd) {
		List<UserAuth> userAuthList = userAuthService.findByUserCd(userCd);
		return CommonListResponseParams.ListResponse.of(UserAuthVO.of(userAuthList));
	}

	@RequestMapping(value = "/users", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
	public ApiResponse saveAuthGroup(@RequestBody List<UserAuthVO> request) {
		List<UserAuth> userAuthList = baseConverter.convert(request, UserAuth.class);
		userAuthService.deleteAndSave(userAuthList);
		return ok();
	}
}
