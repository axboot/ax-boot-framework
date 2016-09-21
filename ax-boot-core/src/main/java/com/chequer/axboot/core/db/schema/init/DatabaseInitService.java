package com.chequer.axboot.core.db.schema.init;

import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.db.schema.SchemaGenerator;
import com.chequer.axboot.core.domain.code.CommonCode;
import com.chequer.axboot.core.domain.code.CommonCodeService;
import com.chequer.axboot.core.domain.program.Program;
import com.chequer.axboot.core.domain.program.ProgramService;
import com.chequer.axboot.core.domain.program.menu.Menu;
import com.chequer.axboot.core.domain.program.menu.MenuService;
import com.chequer.axboot.core.domain.user.User;
import com.chequer.axboot.core.domain.user.UserService;
import com.chequer.axboot.core.domain.user.auth.UserAuth;
import com.chequer.axboot.core.domain.user.auth.UserAuthService;
import com.chequer.axboot.core.domain.user.auth.menu.AuthGroupMenu;
import com.chequer.axboot.core.domain.user.auth.menu.AuthGroupMenuService;
import com.chequer.axboot.core.domain.user.role.UserRole;
import com.chequer.axboot.core.domain.user.role.UserRoleService;
import com.chequer.axboot.core.model.extract.metadata.Table;
import com.chequer.axboot.core.model.extract.service.jdbc.JdbcMetadataService;
import com.chequer.axboot.core.utils.ArrayUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class DatabaseInitService {

    @Inject
    private SchemaGenerator schemaGenerator;

    @Inject
    private UserService userService;

    @Inject
    private UserRoleService userRoleService;

    @Inject
    private UserAuthService userAuthService;

    @Inject
    private MenuService menuService;

    @Inject
    private CommonCodeService commonCodeService;

    @Inject
    private AuthGroupMenuService authGroupMenuService;

    @Inject
    private ProgramService programService;

    @Inject
    private JdbcMetadataService jdbcMetadataService;

    @Inject
    private JdbcTemplate jdbcTemplate;

    public boolean initialized() {
        List<Table> tableList = jdbcMetadataService.getTables();
        return ArrayUtils.isNotEmpty(tableList);
    }

    @Transactional
    public void init() throws Exception {
        createSchema();
    }

    @Transactional
    public void createSchema() throws Exception {
        dropSchema();
        schemaGenerator.createSchema();
        createDefaultData();
    }

    @Transactional
    public void createDefaultData() throws IOException {
        User user = new User();
        user.setUserCd("system");
        user.setUserNm("시스템 관리자");
        user.setUserPs("$2a$11$ruVkoieCPghNOA6mtKzWReZ5Ee66hbeqwvlBT1z.W4VMYckBld6uC");
        user.setUserStatus(Types.UserStatus.NORMAL);
        user.setLocale("ko_KR");
        user.setMenuGrpCd("SYSTEM_MANAGER");
        user.setUseYn(Types.Used.YES);
        user.setDelYn(Types.Deleted.NO);
        userService.save(user);

        UserRole aspAccess = new UserRole();
        aspAccess.setUserCd("system");
        aspAccess.setRoleCd("ASP_ACCESS");

        UserRole systemManager = new UserRole();
        systemManager.setUserCd("system");
        systemManager.setRoleCd("SYSTEM_MANAGER");
        userRoleService.save(Arrays.asList(aspAccess, systemManager));

        UserAuth userAuth = new UserAuth();
        userAuth.setUserCd("system");
        userAuth.setGrpAuthCd("S0001");
        userAuthService.save(userAuth);

        programService.save(Program.of("api", "API", "/swagger/", "_self", "N", "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        programService.save(Program.of("login", "로그인", "/jsp/login.jsp", "_self", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"));
        programService.save(Program.of("main", "메인", "/jsp/main.jsp", "_self", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"));
        programService.save(Program.of("system-auth-user", "사용자관리", "/jsp/system/system-auth-user.jsp", "_self", "Y", "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        programService.save(Program.of("system-config-common-code", "기초코드관리", "/jsp/system/system-config-common-code.jsp", "_self", "Y", "Y", "Y", "Y", "N", "N", "N", "N", "N", "N"));
        programService.save(Program.of("system-config-menu", "메뉴관리", "/jsp/system/system-config-menu.jsp", "_self", "Y", "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        programService.save(Program.of("system-config-program", "프로그램관리", "/jsp/system/system-config-program.jsp", "_self", "Y", "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        programService.save(Program.of("system-operation-log", "에러로그 조회", "/jsp/system/system-operation-log.jsp", "_self", "Y", "Y", "N", "N", "N", "Y", "N", "N", "N", "N"));

        menuService.save(Menu.of(1L, "SYSTEM_MANAGER", "시스템관리", null, 0, 3, null));
        menuService.save(Menu.of(2L, "SYSTEM_MANAGER", "권한관리", 1L, 1, 0, null));
        menuService.save(Menu.of(3L, "SYSTEM_MANAGER", "프로그램관리", 1L, 1, 1, null));
        menuService.save(Menu.of(4L, "SYSTEM_MANAGER", "운영관리", 1L, 1, 2, null));
        menuService.save(Menu.of(5L, "SYSTEM_MANAGER", "사용자 관리", 2L, 2, 0, "system-auth-user"));
        menuService.save(Menu.of(6L, "SYSTEM_MANAGER", "기초코드 관리", 3L, 2, 0, "system-config-common-code"));
        menuService.save(Menu.of(7L, "SYSTEM_MANAGER", "프로그램 관리", 3L, 2, 1, "system-config-program"));
        menuService.save(Menu.of(8L, "SYSTEM_MANAGER", "메뉴관리", 3L, 2, 2, "system-config-menu"));
        menuService.save(Menu.of(9L, "SYSTEM_MANAGER", "에러로그 조회", 4L, 2, 3, "system-operation-log"));

        commonCodeService.save(CommonCode.of("AUTH_GROUP", "권한그룹", "S0001", "시스템관리자 그룹", 1));
        commonCodeService.save(CommonCode.of("AUTH_GROUP", "권한그룹", "S0002", "사용자 권한그룹", 2));
        commonCodeService.save(CommonCode.of("DEL_YN", "삭제여부", "N", "미삭제", 1));
        commonCodeService.save(CommonCode.of("DEL_YN", "삭제여부", "Y", "삭제", 2));
        commonCodeService.save(CommonCode.of("LOCALE", "로케일", "en_US", "미국", 2));
        commonCodeService.save(CommonCode.of("LOCALE", "로케일", "ko_KR", "대한민국", 1));
        commonCodeService.save(CommonCode.of("MENU_GROUP", "메뉴그룹", "SYSTEM_MANAGER", "시스템 관리자 그룹", 1));
        commonCodeService.save(CommonCode.of("MENU_GROUP", "메뉴그룹", "USER", "사용자 그룹", 2));
        commonCodeService.save(CommonCode.of("USER_ROLE", "사용자 롤", "API", "API 접근 롤", 6));
        commonCodeService.save(CommonCode.of("USER_ROLE", "사용자 롤", "ASP_ACCESS", "관리시스템 접근 롤", 1));
        commonCodeService.save(CommonCode.of("USER_ROLE", "사용자 롤", "ASP_MANAGER", "일반괸리자 롤", 3));
        commonCodeService.save(CommonCode.of("USER_ROLE", "사용자 롤", "SYSTEM_MANAGER", "시스템 관리자 롤", 2));
        commonCodeService.save(CommonCode.of("USER_STATUS", "계정상태", "ACCOUNT_LOCK", "잠김", 2));
        commonCodeService.save(CommonCode.of("USER_STATUS", "계정상태", "NORMAL", "활성", 1));
        commonCodeService.save(CommonCode.of("USE_YN", "사용여부", "N", "사용안함", 2));
        commonCodeService.save(CommonCode.of("USE_YN", "사용여부", "Y", "사용", 1));

        authGroupMenuService.save(AuthGroupMenu.of("S0001", 1L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 2L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 3L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 4L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 5L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 6L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 7L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 8L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
        authGroupMenuService.save(AuthGroupMenu.of("S0001", 9L, "Y", "Y", "N", "N", "N", "N", "N", "N", "N"));
    }

    @Transactional
    public void dropSchema() {
        List<Table> tableList = jdbcMetadataService.getTables();

        tableList.forEach(table -> {
            jdbcTemplate.update("DROP TABLE " + table.getTableName());
        });
    }
}
