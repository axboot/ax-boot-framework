package com.chequer.axboot.admin.domain.program.menu;

import com.chequer.axboot.admin.domain.program.Program;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Data
@NoArgsConstructor
public class MenuVO {

	private String mnuCd;

	private String mnuNm;

	private String icon;

	private Integer mnuLv;

	private Integer mnuIx;

	private String mnuUpCd;

	private String progCd;

	private String classNm;

	private String progNm;

	private String remark;

	private String useYn;

	private Program program;

	public static MenuVO of(Menu menu) {
		MenuVO menuVTO = ModelMapperUtils.map(menu, MenuVO.class);

		try {
			menuVTO.setProgCd(menu.getProgram().getProgCd());
			menuVTO.setProgNm(menu.getProgram().getProgNm());
		} catch (Exception e) {
			// ignore
		}

		return menuVTO;
	}

	public static List<MenuVO> of(List<Menu> menuList) {
		return menuList.stream().map(menu -> of(menu)).collect(toList());
	}
}
