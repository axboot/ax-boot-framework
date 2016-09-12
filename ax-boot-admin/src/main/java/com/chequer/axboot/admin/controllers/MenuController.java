package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.program.menu.Menu;
import com.chequer.axboot.admin.domain.program.menu.MenuService;
import com.chequer.axboot.admin.domain.program.menu.MenuVO;
import com.chequer.axboot.admin.parameter.CommonListResponseParams;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.converter.BaseConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.inject.Inject;
import java.util.List;

@Controller
@RequestMapping(value = "/api/v1/menus")
public class MenuController extends BaseController {

	@Inject
	private MenuService menuService;

	@Inject
	private BaseConverter baseConverter;

	@RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse list() {
		List<Menu> menus = menuService.findAllByOrderByMnuLvAscMnuIxAsc();
		return CommonListResponseParams.ListResponse.of(MenuVO.of(menus));
	}

	@RequestMapping(value = "/actives", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public CommonListResponseParams.ListResponse actives() {
		List<Menu> menus = menuService.findActiveMenus();
		return CommonListResponseParams.ListResponse.of(MenuVO.of(menus));
	}

	@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
	public ApiResponse save(@RequestBody List<MenuVO> request) {
		List<Menu> menus = baseConverter.convert(request, Menu.class);
		menuService.saveMenus(menus);
		return ok();
	}
}
