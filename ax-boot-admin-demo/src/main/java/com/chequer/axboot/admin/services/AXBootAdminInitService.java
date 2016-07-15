package com.chequer.axboot.admin.services;

import com.chequer.axboot.admin.domain.program.Program;
import com.chequer.axboot.admin.domain.program.ProgramService;
import com.chequer.axboot.admin.domain.program.menu.Menu;
import com.chequer.axboot.admin.domain.program.menu.MenuService;
import com.chequer.axboot.admin.domain.user.User;
import com.chequer.axboot.admin.domain.user.UserService;
import com.chequer.axboot.admin.domain.user.auth.UserAuth;
import com.chequer.axboot.admin.domain.user.auth.UserAuthService;
import com.chequer.axboot.admin.domain.user.auth.group.AuthGroup;
import com.chequer.axboot.admin.domain.user.auth.group.AuthGroupService;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenu;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenuService;
import com.chequer.axboot.core.db.schema.SchemaGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.io.IOException;

@Service
public class AXBootAdminInitService {

    @Inject
    private UserService userService;

    @Inject
    private AuthGroupService authGroupService;

    @Inject
    private AuthGroupMenuService authGroupMenuService;

    @Inject
    private MenuService menuService;

    @Inject
    private ProgramService programService;

    @Inject
    private UserAuthService userAuthService;

    @Inject
    private SchemaGenerator schemaGenerator;

    public void schemaInitialization() throws IOException, ClassNotFoundException {
        schemaGenerator.createSchema();
    }

    @Transactional
    public void defaultDataInitialization() {
        // Create Default Admin User
        User user = new User();
        user.setUserCd("admin");
        user.setUserNm("관리자");
        user.setUserPs("$2a$11$ruVkoieCPghNOA6mtKzWReZ5Ee66hbeqwvlBT1z.W4VMYckBld6uC");
        user.setUserType("S");
        user.setEmail("admin@admin.com");
        user.setUseYn("Y");
        userService.save(user);

        // Create Default Auth Group
        AuthGroup authGroup = new AuthGroup();
        authGroup.setGrpAuthCd("S0001");
        authGroup.setGrpAuthNm("관리자그룹");
        authGroupService.save(authGroup);

        // Create Default Programs
        programService.save(Program.of("api", "API", "/swagger/", "Y", "Y", "Y", "_blank", "Y"));
        programService.save(Program.of("main", "메인", "/jsp/main.jsp", "N", "N", "N", "_self", "Y"));
        programService.save(Program.of("samples-list", "리스트 (단독)", "/jsp/_samples/samples-list.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("samples-list-form", "리스트&폼(좌우)", "/jsp/_samples/samples-list-form.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("samples-list-form-tab", "리스트&폼(위아래/탭)", "/jsp/_samples/samples-list-form-tab.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("samples-list-list", "리스트&리스트(좌우)", "/jsp/_samples/samples-list-list.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("samples-list-list-row", "리스트&리스트(위아래)", "/jsp/_samples/samples-list-list-row.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("samples-list-modal", "리스트&모달", "/jsp/_samples/samples-list-modal.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("samples-list-upload", "리스트&폼(업로드)", "/jsp/_samples/samples-list-upload.jsp", "Y", "Y", "N", "_self", "Y"));
        programService.save(Program.of("samples-tmpl", "Mustache 샘플", "/jsp/_samples/samples-tmpl.jsp", "N", "Y", "N", "_self", "Y"));
        programService.save(Program.of("samples-upload", "파일업로드", "/jsp/_samples/samples-upload.jsp", "N", "N", "N", "_self", "Y"));
        programService.save(Program.of("system-auth-menu", "메뉴관리", "/jsp/system/system-auth-menu.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("system-auth-mng", "권한관리", "/jsp/system/system-auth-mng.jsp", "Y", "Y", "N", "_self", "Y"));
        programService.save(Program.of("system-auth-program", "프로그램관리", "/jsp/system/system-auth-program.jsp", "Y", "Y", "Y", "_self", "Y"));
        programService.save(Program.of("system-auth-user", "사용자관리", "/jsp/system/system-auth-user.jsp", "Y", "Y", "N", "_self", "Y"));
        programService.save(Program.of("system-auth-user-mng", "사용자 권한관리", "/jsp/system/system-auth-user-mng.jsp", "Y", "Y", "N", "_self", "Y"));
        programService.save(Program.of("system-config-common-code", "공통코드관리", "/jsp/system/system-config-common-code.jsp", "Y", "Y", "N", "_self", "Y"));
        programService.save(Program.of("system-operation-log", "에러로그 관리", "/jsp/system/system-operation-log.jsp", "N", "Y", "N", "_self", "Y"));
        programService.save(Program.of("system-operation-notice", "공지사항", "/jsp/system/system-operation-notice.jsp", "Y", "Y", "N", "_self", "Y"));
        programService.save(Program.of("template-guide", "개발템플릿", "/jsp/_samples/template-guide.jsp", "Y", "Y", "N", "_self", "Y"));

        // Create Default Menu
        menuService.save(Menu.of("samples", 2, 1, "샘플", "__root__", null, "Y"));
        menuService.save(Menu.of("samples-list", 1, 2, "리스트(단독)", "samples", "samples-list", "Y"));
        menuService.save(Menu.of("samples-list-form", 2, 2, "리스트&폼(좌우)", "samples", "samples-list-form", "Y"));
        menuService.save(Menu.of("samples-list-form-tab", 3, 2, "리스트&폼(위아래/탭)", "samples", "samples-list-form-tab", "Y"));
        menuService.save(Menu.of("samples-list-list", 4, 2, "리스트&리스트(좌우)", "samples", "samples-list-list", "Y"));
        menuService.save(Menu.of("samples-list-list-row", 5, 2, "리스트&리스트(위아래)", "samples", "samples-list-list-row", "Y"));
        menuService.save(Menu.of("samples-list-modal", 6, 2, "리스트&모달", "samples", "samples-list-modal", "Y"));
        menuService.save(Menu.of("samples-list-upload", 8, 2, "리스트&폼(업로드)", "samples", "samples-list-upload", "N"));
        menuService.save(Menu.of("samples-tmpl", 7, 2, "Mustache 사용샘플", "samples", "samples-tmpl", "Y"));
        menuService.save(Menu.of("samples-upload", 8, 2, "파일업로드", "samples", "samples-upload", "Y"));
        menuService.save(Menu.of("system", 1, 1, "시스템", "__root__", null, "Y"));
        menuService.save(Menu.of("system-auth", 1, 2, "권한", "system", null, "Y"));
        menuService.save(Menu.of("system-auth-menu", 2, 3, "메뉴 관리", "system-auth", "system-auth-menu", "Y"));
        menuService.save(Menu.of("system-auth-mng", 4, 3, "권한그룹 관리", "system-auth", "system-auth-mng", "Y"));
        menuService.save(Menu.of("system-auth-program", 1, 3, "프로그램 관리", "system-auth", "system-auth-program", "Y"));
        menuService.save(Menu.of("system-auth-user", 3, 3, "사용자 관리", "system-auth", "system-auth-user", "Y"));
        menuService.save(Menu.of("system-auth-user-mng", 5, 3, "사용자 권한관리", "system-auth", "system-auth-user-mng", "Y"));
        menuService.save(Menu.of("system-config", 2, 2, "설정", "system", null, "Y"));
        menuService.save(Menu.of("system-config-common-code", 1, 3, "공통코드", "system-config", "system-config-common-code", "Y"));
        menuService.save(Menu.of("system-operation", 3, 2, "운영", "system", null, "Y"));
        menuService.save(Menu.of("system-operation-log", 3, 3, "에러로그 관리", "system-operation", "system-operation-log", "Y"));
        menuService.save(Menu.of("system-operation-notice", 2, 3, "공지사항", "system-operation", "system-operation-notice", "Y"));
        menuService.save(Menu.of("template-guide", 9, 2, "템플릿 가이드", "samples", "template-guide", "Y"));

        // Create Default AuthGroupMenu
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples", "N", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-list", "N", "N", "N", "N", "N", "Y", "Y", "Y"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-list-form", "N", "N", "N", "N", "N", "Y", "Y", "Y"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-list-form-tab", "N", "N", "N", "N", "N", "Y", "Y", "Y"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-list-list", "N", "N", "N", "N", "N", "Y", "Y", "Y"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-list-list-row", "N", "N", "N", "N", "N", "Y", "Y", "Y"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-list-modal", "N", "N", "N", "N", "N", "Y", "Y", "Y"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-tmpl", "N", "N", "N", "N", "N", "Y", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "samples-upload", "N", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "template-guide", "N", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system", "N", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-auth", "N", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-auth-menu", "N", "N", "N", "N", "N", "Y", "Y", "Y"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-auth-mng", "N", "N", "N", "N", "N", "Y", "Y", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-auth-program", "N", "N", "N", "N", "N", "Y", "Y", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-auth-user", "N", "N", "N", "N", "N", "Y", "Y", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-auth-user-mng", "N", "N", "N", "N", "N", "Y", "Y", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-config", "N", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-config-common-code", "N", "N", "N", "N", "N", "Y", "Y", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-operation", "N", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-operation-log", "N", "N", "N", "N", "N", "Y", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", "system-operation-notice", "N", "N", "N", "N", "N", "Y", "Y", "N"));

        // Default User Auth
        UserAuth userAuth = new UserAuth();
        userAuth.setGrpAuthCd("S0001");
        userAuth.setUserCd("admin");
        userAuth.setUseYn("Y");
        userAuthService.save(userAuth);
    }
}
