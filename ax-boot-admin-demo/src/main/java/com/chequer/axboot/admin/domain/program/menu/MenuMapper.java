package com.chequer.axboot.admin.domain.program.menu;

import com.chequer.axboot.admin.domain.program.menu.authorized.MenuAuthorization;
import com.chequer.axboot.core.mybatis.MyBatisMapper;

import java.util.List;

public interface MenuMapper extends MyBatisMapper {

	List<MenuAuthorization> getAuthorizationMenus(String userCd, String mnuCd);

	List<Menu> activeMenus();

}
