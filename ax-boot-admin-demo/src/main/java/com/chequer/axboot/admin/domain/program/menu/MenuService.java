package com.chequer.axboot.admin.domain.program.menu;

import com.chequer.axboot.admin.domain.program.menu.authorized.AuthorizedUserMenuContext;
import com.chequer.axboot.admin.domain.program.menu.authorized.MenuAuthorization;
import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.utils.ArrayUtils;
import com.chequer.axboot.core.utils.HashUtils;
import com.chequer.axboot.core.utils.JsonUtils;
import com.chequer.axboot.core.utils.PhaseUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@Service
public class MenuService extends BaseService<Menu, String> {

	private MenuRepository menuRepository;

	@Inject
	private MenuMapper menuMapper;

	@Inject
	public MenuService(MenuRepository menuRepository) {
		super(menuRepository);
		this.menuRepository = menuRepository;
	}

	public List<Menu> findAllByOrderByMnuLvAscMnuIxAsc() {
		return menuRepository.findAllByOrderByMnuLvAscMnuIxAsc();
	}

	public List<Menu> findByMnuUpCd(String mnuUpCd) {
		return menuRepository.findByMnuUpCd(mnuUpCd);
	}

	public List<MenuAuthorization> getAuthorizedFlatMenuByUserCd(String userCd) {
		return menuMapper.getAuthorizationMenus(userCd, null);
	}

	public List<MenuAuthorization> getAuthorizedFlatMenuByUserCdAndMnuCd(String userCd, String mnuCd) {
		return menuMapper.getAuthorizationMenus(userCd, mnuCd);
	}

	public AuthorizedUserMenuContext createUserMenuContext(String userCd) {
		List<MenuAuthorization> flatMenuList = getAuthorizedFlatMenuByUserCd(userCd);

		List<MenuAuthorization> rootList = new ArrayList<>();

		flatMenuList.stream().forEach(menuAuthorization -> {
			switch (menuAuthorization.getMenuLevel()) {
				case 1:
					if (!rootList.contains(menuAuthorization)) {
						rootList.add(menuAuthorization);
					}

					break;

				case 2:
					rootList.stream().forEach(root -> {
						if (root.getMenuCode().equals(menuAuthorization.getParentMenuCode())) {
							root.addChild(menuAuthorization);
						}
					});
					break;

				case 3:
					rootList.stream().forEach(root -> root.getChild().stream().forEach(second -> {
						if (second.getMenuCode().equals(menuAuthorization.getParentMenuCode())) {
							second.addChild(menuAuthorization);
						}
					}));
					break;
			}
		});

		AuthorizedUserMenuContext authorizedUserMenuContext = new AuthorizedUserMenuContext();
		authorizedUserMenuContext.setMenu(rootList);
		authorizedUserMenuContext.setMenuHash(HashUtils.MD5(JsonUtils.toJson(rootList)));

		return authorizedUserMenuContext;
	}

	public List<Menu> findActiveMenus() {
		return menuMapper.activeMenus();
	}

	@Transactional
	public void saveMenus(List<Menu> menus) {
		for (Menu menu : menus) {
			if (StringUtils.isEmpty(menu.getProgCd())) {
				menu.setProgCd(null);
			}
			save(menus);
		}
		if(!PhaseUtils.isProduction()) {
			//RequestWrapper requestWrapper = RequestWrapper.of(HttpUtils.getCurrentRequest());
			//requestWrapper.setSessionAttribute(Cs.MENU_CONTEXT,null);
		}
	}

	public MenuAuthorization getMenuAuthorization(String userCd, String mnuCd) {
		List<MenuAuthorization> authorizedMenuList = getAuthorizedFlatMenuByUserCdAndMnuCd(userCd, mnuCd);

		MenuAuthorization menuAuthorization = null;

		if (ArrayUtils.isNotEmpty(authorizedMenuList)) {
			for (MenuAuthorization _menuAuthorization : authorizedMenuList) {
				if (menuAuthorization == null) {
					menuAuthorization = _menuAuthorization;
				}
				menuAuthorization.setAuthorization(_menuAuthorization);
			}

		}

		return menuAuthorization;
	}
}
