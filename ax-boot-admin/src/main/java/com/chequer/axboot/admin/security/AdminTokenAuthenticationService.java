package com.chequer.axboot.admin.security;

import com.chequer.axboot.admin.code.Cs;
import com.chequer.axboot.admin.domain.program.menu.MenuService;
import com.chequer.axboot.admin.domain.program.menu.authorized.AuthorizedUserMenuContext;
import com.chequer.axboot.admin.domain.program.menu.authorized.MenuAuthorization;
import com.chequer.axboot.admin.domain.user.LoginUser;
import com.chequer.axboot.admin.utils.SessionUtils;
import com.chequer.axboot.admin.vo.PageContextVO;
import com.chequer.axboot.core.utils.ContextUtil;
import com.chequer.axboot.core.utils.CookieUtils;
import com.chequer.axboot.core.utils.PhaseUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;

@Service
public class AdminTokenAuthenticationService {

    private static final long TEN_DAYS = 1000 * 60 * 60 * 24 * 10;

    private final TokenHandler tokenHandler;

    @Inject
    private MenuService menuService;

    public AdminTokenAuthenticationService() {
        tokenHandler = new TokenHandler(DatatypeConverter.parseBase64Binary("YXhib290"));
    }

    public int userTokenCookieExpires() {
        if (PhaseUtils.isProduction()) {
            return 60 * 50;
        } else {
            return 60 * 10 * 10 * 10 * 10;
        }
    }

    public void addAuthentication(HttpServletResponse response, AdminUserAuthentication authentication) throws IOException {
        final LoginUser user = authentication.getDetails();
        user.setExpires(System.currentTimeMillis() + TEN_DAYS);
        setUserEnvironments(user, response);
    }

    public void setUserEnvironments(LoginUser user, HttpServletResponse response) throws IOException {
        String token = tokenHandler.createTokenForUser(user);
        CookieUtils.addCookie(response, Cs.AUTH_TOKEN_KEY, token, userTokenCookieExpires());
    }

    public Authentication getAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String token = CookieUtils.getCookieValue(request, Cs.AUTH_TOKEN_KEY);
        final String pageId = FilenameUtils.getBaseName(request.getServletPath());
        final String requestUri = request.getRequestURI();

        if (token == null) {
            return deleteCookieAndReturnNullAuthentication(request, response);
        }

        LoginUser user = tokenHandler.parseUserFromToken(token);

        if (user == null) {
            return deleteCookieAndReturnNullAuthentication(request, response);
        }

        if (!requestUri.startsWith(ContextUtil.getBaseApiPath())) {
            AuthorizedUserMenuContext authorizedUserMenuContext = SessionUtils.getUserMenuContext(request);

            if (authorizedUserMenuContext == null) {
                authorizedUserMenuContext = menuService.createUserMenuContext(user.getUserCd());
                user.setMenuHash(authorizedUserMenuContext.getMenuHash());
            } else {
                if ((!authorizedUserMenuContext.getMenuHash().equals(user.getMenuHash()))) {
                    authorizedUserMenuContext = menuService.createUserMenuContext(user.getUserCd());
                    user.setMenuHash(authorizedUserMenuContext.getMenuHash());
                }
            }

            SessionUtils.setUserMenuContext(request, authorizedUserMenuContext);

            MenuAuthorization menuAuthorization = menuService.getMenuAuthorization(user.getUserCd(), pageId);

            PageContextVO pageContextVO = PageContextVO.of(pageId, menuAuthorization);

            SessionUtils.setPageContext(request, user, pageContextVO);

            setUserEnvironments(user, response);
        }

        return new AdminUserAuthentication(user);
    }

    private Authentication deleteCookieAndReturnNullAuthentication(HttpServletRequest request, HttpServletResponse response) {
        CookieUtils.deleteCookie(request, response, Cs.AUTH_TOKEN_KEY);
        return null;
    }
}
