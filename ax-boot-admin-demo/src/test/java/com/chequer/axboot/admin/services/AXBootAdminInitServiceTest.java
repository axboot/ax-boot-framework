package com.chequer.axboot.admin.services;

import com.chequer.axboot.admin.AXBootTestBase;
import com.chequer.axboot.admin.domain.program.Program;
import com.chequer.axboot.admin.domain.program.ProgramService;
import com.chequer.axboot.admin.domain.program.menu.Menu;
import com.chequer.axboot.admin.domain.program.menu.MenuService;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenu;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenuService;
import org.junit.Test;

import javax.inject.Inject;
import java.io.IOException;
import java.util.List;

public class AXBootAdminInitServiceTest extends AXBootTestBase {

    @Inject
    public ProgramService programService;

    @Inject
    private MenuService menuService;

    @Inject
    private AuthGroupMenuService authGroupMenuService;

    @Inject
    private AXBootAdminInitService axBootAdminInitService;

    @Test
    public void test() {
        List<Program> programList = programService.findAll();

        List<Menu> menus = menuService.findAll();

        List<AuthGroupMenu> authGroupMenus = authGroupMenuService.findAll();

        /*
        for (Program program : programList) {
            System.out.println(String.format("programService.save(Program.of(\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"Y\"));", program.getProgCd(), program.getProgNm(), program.getProgPh(), program.getSavAh(), program.getSchAh(), program.getExlAh(), program.getTarget()));
        }
        */

        /*
        for (Menu menu : menus) {
            System.out.println(String.format("menuService.save(Menu.of(\"%s\", %d,%d,\"%s\",\"%s\",\"%s\",\"%s\"));", menu.getMnuCd(), menu.getMnuIx(), menu.getMnuLv(), menu.getMnuNm(), menu.getMnuUpCd(), menu.getProgCd(), menu.getUseYn()));
        }
        */

        for (AuthGroupMenu menu : authGroupMenus) {
            System.out.println(String.format("authGroupMenuService.save(AuthGroupMenu.of(\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\" ));", menu.getGrpAuthCd(), menu.getMnuCd(), menu.getFn1Ah(), menu.getFn2Ah(), menu.getFn3Ah(), menu.getFn3Ah(), menu.getFn5Ah(), menu.getSchAh(), menu.getSavAh(), menu.getExlAh()));
        }
    }

    @Test
    public void test2() throws IOException, ClassNotFoundException {
        axBootAdminInitService.schemaInitialization();
    }
}