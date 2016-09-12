package com.chequer.axboot.admin.domain.user.auth.group;

import com.chequer.axboot.admin.domain.program.Program;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenu;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Data
@NoArgsConstructor
public class AuthGroupMenuVO {

    private String grpAuthCd;

    private String mnuCd;

    private String mnuNm;

    private String progCd;

    private String progNm;

    private String schAh;

    private String savAh;

    private String exlAh;

    private String fn1Ah;

    private String fn2Ah;

    private String fn3Ah;

    private String fn4Ah;

    private String fn5Ah;

    private String progSchAh;

    private String progSavAh;

    private String progExlAh;

    private String progFn1Ah;

    private String progFn2Ah;

    private String progFn3Ah;

    private String progFn4Ah;

    private String progFn5Ah;

    public static AuthGroupMenuVO of(AuthGroupMenu authGroupMenu) {
        AuthGroupMenuVO authGroupMenuVTO = ModelMapperUtils.map(authGroupMenu, AuthGroupMenuVO.class);

        try {
            authGroupMenuVTO.setMnuNm(authGroupMenu.getMenu().getMnuNm());
        } catch (Exception e) {
            // ignore
        }

        try {
            Program program = authGroupMenu.getMenu().getProgram();
            authGroupMenuVTO.setProgNm(program.getProgNm());
            authGroupMenuVTO.setProgCd(program.getProgCd());
            authGroupMenuVTO.setProgSchAh(program.getSchAh());
            authGroupMenuVTO.setProgSavAh(program.getSavAh());
            authGroupMenuVTO.setProgExlAh(program.getExlAh());
            authGroupMenuVTO.setProgFn1Ah(program.getFn1Ah());
            authGroupMenuVTO.setProgFn2Ah(program.getFn2Ah());
            authGroupMenuVTO.setProgFn3Ah(program.getFn3Ah());
            authGroupMenuVTO.setProgFn4Ah(program.getFn4Ah());
            authGroupMenuVTO.setProgFn5Ah(program.getFn5Ah());
        } catch (Exception e) {
            // ignore
        }

        return authGroupMenuVTO;
    }

    public static List<AuthGroupMenuVO> of(List<AuthGroupMenu> authGroupMenuList) {
        return authGroupMenuList.stream().map(AuthGroupMenuVO::of).collect(toList());
    }
}
