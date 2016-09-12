package com.chequer.axboot.admin.vo;

import com.chequer.axboot.admin.domain.program.menu.authorized.MenuAuthorization;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
public class PageContextVO {

    public static final String MENU_JSON = "MENU_JSON";
    public static final String MENU_HASH = "MENU_HASH";
    public static final String PAGE_CONTEXT = "PAGE_CONTEXT";

    public static final String ENV = "ENV";
    public static final String PAGE_ID = "PAGE_ID";
    public static final String PAGE_NAME = "PAGE_NAME";
    public static final String PAGE_REMARK = "PAGE_REMARK";
    public static final String CLASS_NAME = "CLASS_NAME";
    public static final String SEARCH_AUTH = "SEARCH_AUTH";
    public static final String SAVE_AUTH = "SAVE_AUTH";
    public static final String EXCEL_AUTH = "EXCEL_AUTH";
    public static final String FUNCTION_1_AUTH = "FUNCTION_1_AUTH";
    public static final String FUNCTION_2_AUTH = "FUNCTION_2_AUTH";
    public static final String FUNCTION_3_AUTH = "FUNCTION_3_AUTH";
    public static final String FUNCTION_4_AUTH = "FUNCTION_4_AUTH";
    public static final String FUNCTION_5_AUTH = "FUNCTION_5_AUTH";

    public static final String LOGIN_USER_NAME = "LOGIN_USER_NAME";
    public static final String LOGIN_USER_ID = "LOGIN_USER_ID";
    public static final String COMPANY_CODE = "COMPANY_CODE";
    public static final String COMPANY_NAME = "COMPANY_NAME";

    private String pageId;

    private boolean authorized = true;

    private MenuAuthorization menuAuthorization;

    private String menuName = "";

    private String menuRemark = "";

    private String programName = "";

    private String searchAuth = null;

    private String saveAuth = null;

    private String excelAuth = null;

    private String className = null;

    private String function1Auth = null;

    private String function2Auth = null;

    private String function3Auth = null;

    private String function4Auth = null;

    private String function5Auth = null;

    private List<String> authSkippedMenu = Arrays.asList("main", "login", "dashboard");

    public static PageContextVO of(String pageId, MenuAuthorization menuAuthorization) {
        PageContextVO pageContextVO = new PageContextVO();

        if (menuAuthorization == null) {
            if (!pageContextVO.isAuthSkip(pageId)) {
                pageContextVO.setAuthorized(false);
            }
        } else {
            pageContextVO.setPageId(pageId);
            pageContextVO.setMenuAuthorization(menuAuthorization);
            pageContextVO.setMenuName(menuAuthorization.getMenuName());
            pageContextVO.setMenuRemark(menuAuthorization.getRemark());
            pageContextVO.setProgramName(menuAuthorization.getProgramName());
            pageContextVO.setSearchAuth(menuAuthorization.getSearchAuth());
            pageContextVO.setSaveAuth(menuAuthorization.getSaveAuth());
            pageContextVO.setExcelAuth(menuAuthorization.getExcelAuth());
            pageContextVO.setFunction1Auth(menuAuthorization.getFunction1Auth());
            pageContextVO.setFunction2Auth(menuAuthorization.getFunction2Auth());
            pageContextVO.setFunction3Auth(menuAuthorization.getFunction3Auth());
            pageContextVO.setFunction4Auth(menuAuthorization.getFunction4Auth());
            pageContextVO.setFunction5Auth(menuAuthorization.getFunction5Auth());
            pageContextVO.setClassName(menuAuthorization.getRemark());
        }

        return pageContextVO;
    }

    public boolean isAuthSkip(String pageId) {
        return authSkippedMenu.contains(pageId.trim());
    }
}
