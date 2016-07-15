package com.chequer.axboot.admin.domain.program.menu.authorized;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class AuthorizedUserMenuContext implements Serializable {

	private List<MenuAuthorization> menu;

	private String menuHash;
}
