package com.chequer.axboot.admin.utils;

import com.chequer.axboot.admin.code.Cs;
import com.chequer.axboot.admin.domain.program.menu.authorized.AuthorizedUserMenuContext;
import com.chequer.axboot.admin.domain.user.LoginUser;
import com.chequer.axboot.admin.domain.user.MDCLoginUser;
import com.chequer.axboot.admin.domain.user.User;
import com.chequer.axboot.admin.domain.user.UserService;
import com.chequer.axboot.admin.vo.PageContextVO;
import com.chequer.axboot.core.context.AppContextManager;
import com.chequer.axboot.core.utils.AgentUtils;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import com.chequer.axboot.core.utils.PhaseUtils;
import com.chequer.axboot.core.utils.RequestWrapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.http.HttpServletRequest;

public class SessionUtils {

    public static UserDetails getCurrentUserDetail() {
        try {
            return (UserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

    public static LoginUser getCurrentLoginUser() {
        UserDetails userDetails = getCurrentUserDetail();

        if (userDetails != null) {
            if(userDetails instanceof LoginUser) {
                return (LoginUser) userDetails;
            }
        }

        return null;
    }

    public static MDCLoginUser getCurrentMdcLoginUser(HttpServletRequest request) {
        UserDetails userDetails = getCurrentUserDetail();

        if (userDetails != null) {
            LoginUser loginUser = (LoginUser) userDetails;
            MDCLoginUser mdcLoginUser = ModelMapperUtils.map(loginUser, MDCLoginUser.class);
            mdcLoginUser.setUserAgent(AgentUtils.getUserAgent(request));
            mdcLoginUser.setBrowserType(AgentUtils.getBrowserType(request));
            mdcLoginUser.setRenderingEngine(AgentUtils.getRenderingEngine(request));
            mdcLoginUser.setDeviceType(AgentUtils.getDeviceType(request));
            mdcLoginUser.setManufacturer(AgentUtils.getManufacturer(request));

            return mdcLoginUser;
        }

        return null;
    }

    public static boolean isLoggedIn() {
        return getCurrentLoginUser() != null;
    }

    public static User getCurrentUser() {
        UserDetails userDetails = getCurrentUserDetail();

        if (userDetails != null) {
            UserService userService = AppContextManager.getAppContext().getBean(UserService.class);
            return userService.findOne(userDetails.getUsername());
        }

        return null;
    }

    public static String getCurrentLoginUserCd() {
        UserDetails userDetails = getCurrentUserDetail();
        return userDetails == null ? "admin" : userDetails.getUsername();
    }

    public static void setUserMenuContext(HttpServletRequest request, AuthorizedUserMenuContext authorizedUserMenuContext) {
        RequestWrapper requestWrapper = RequestWrapper.of(request);
        requestWrapper.setSessionAttribute(Cs.MENU_CONTEXT, authorizedUserMenuContext);
    }

    public static AuthorizedUserMenuContext getUserMenuContext(HttpServletRequest request) {
        RequestWrapper requestWrapper = RequestWrapper.of(request);
        return requestWrapper.getSessionAttributeObject(Cs.MENU_CONTEXT, AuthorizedUserMenuContext.class);
    }

    public static void setPageContext(HttpServletRequest request, LoginUser user, PageContextVO pageContext) {
        RequestWrapper requestWrapper = RequestWrapper.of(request);

        requestWrapper.setSessionAttribute(PageContextVO.PAGE_CONTEXT, pageContext);

        requestWrapper.setSessionAttribute(PageContextVO.PAGE_ID, pageContext.getPageId());
        requestWrapper.setSessionAttribute(PageContextVO.PAGE_NAME, pageContext.getMenuName());
        requestWrapper.setSessionAttribute(PageContextVO.PAGE_REMARK, pageContext.getMenuRemark());
        requestWrapper.setSessionAttribute(PageContextVO.CLASS_NAME, pageContext.getClassName());

        requestWrapper.setSessionAttribute(PageContextVO.SEARCH_AUTH, setAuthorization(pageContext.getSearchAuth()));
        requestWrapper.setSessionAttribute(PageContextVO.SAVE_AUTH, setAuthorization(pageContext.getSaveAuth()));
        requestWrapper.setSessionAttribute(PageContextVO.EXCEL_AUTH, setAuthorization(pageContext.getExcelAuth()));
        requestWrapper.setSessionAttribute(PageContextVO.FUNCTION_1_AUTH, setAuthorization(pageContext.getFunction1Auth()));
        requestWrapper.setSessionAttribute(PageContextVO.FUNCTION_2_AUTH, setAuthorization(pageContext.getFunction2Auth()));
        requestWrapper.setSessionAttribute(PageContextVO.FUNCTION_3_AUTH, setAuthorization(pageContext.getFunction3Auth()));
        requestWrapper.setSessionAttribute(PageContextVO.FUNCTION_4_AUTH, setAuthorization(pageContext.getFunction4Auth()));
        requestWrapper.setSessionAttribute(PageContextVO.FUNCTION_5_AUTH, setAuthorization(pageContext.getFunction5Auth()));
        requestWrapper.setSessionAttribute(PageContextVO.ENV, PhaseUtils.phase());

        if (user != null) {
            requestWrapper.setSessionAttribute(PageContextVO.LOGIN_USER_NAME, user.getUserNm());
            requestWrapper.setSessionAttribute(PageContextVO.LOGIN_USER_ID, user.getUsername());
        }
    }

    public static String setAuthorization(String auth) {
        if (auth == null || auth.equals("N")) {
            return null;
        }
        return auth;
    }

    public static PageContextVO getPageContext(HttpServletRequest request) {
        RequestWrapper requestWrapper = RequestWrapper.of(request);
        return requestWrapper.getSessionAttributeObject(PageContextVO.PAGE_CONTEXT, PageContextVO.class);
    }
}
