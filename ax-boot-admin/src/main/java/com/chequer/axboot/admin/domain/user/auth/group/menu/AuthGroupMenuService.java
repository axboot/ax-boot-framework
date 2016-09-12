package com.chequer.axboot.admin.domain.user.auth.group.menu;

import com.chequer.axboot.admin.domain.program.menu.Menu;
import com.chequer.axboot.admin.domain.program.menu.MenuService;
import com.chequer.axboot.core.code.Params;
import com.chequer.axboot.core.domain.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;

@Service
public class AuthGroupMenuService extends BaseService<AuthGroupMenu, AuthGroupMenuId> {

    private final static String ROOT = "_root_";

    private AuthGroupMenuRepository authGroupMenuRepository;

    @Inject
    private MenuService menuService;

    @Inject
    public AuthGroupMenuService(AuthGroupMenuRepository authGroupMenuRepository) {
        super(authGroupMenuRepository);
        this.authGroupMenuRepository = authGroupMenuRepository;
    }

    @Transactional
    public void deleteByGrpAuthCdAndMnuCd(String grpAuthCd, String mnuCd) {
        authGroupMenuRepository.deleteByGrpAuthCdAndMnuCd(grpAuthCd, mnuCd);
    }

    @Transactional
    public void deleteByGrpAuthCdAndMnuCds(String grpAuthCd, List<String> mnuCds) {
        for (String mnuCd : mnuCds) {
            deleteByGrpAuthCdAndMnuCd(grpAuthCd, mnuCd);
        }
    }

    public Page<AuthGroupMenu> findByGrpAuthCd(String grpAuthCd, Pageable pageable) {
        return authGroupMenuRepository.findByGrpAuthCd(grpAuthCd, pageable);
    }

    public List<AuthGroupMenu> findByGrpAuthCd(String grpAuthCd) {
        return authGroupMenuRepository.findByGrpAuthCd(grpAuthCd);
    }

    public void deleteByGrpAuthCd(String grpAuthCd) {
        authGroupMenuRepository.deleteByGrpAuthCd(grpAuthCd);
    }

    @Transactional
    public void saveGroupMenus(List<AuthGroupMenu> authGroupMenuList) {
        for (AuthGroupMenu authGroupMenu : authGroupMenuList) {
            String mnuCd = authGroupMenu.getMnuCd();
            saveParents(mnuCd, authGroupMenu);
            save(authGroupMenu);
        }
    }

    @Transactional
    public void saveParents(String mnuCd, AuthGroupMenu authGroupMenu) {
        Menu parent = menuService.findOne(mnuCd);

        if (parent != null && !StringUtils.isEmpty(parent.getMnuUpCd()) && !parent.getMnuUpCd().contains(ROOT)) {
            AuthGroupMenu parentAuthGroupMenu = new AuthGroupMenu();
            parentAuthGroupMenu.setMnuCd(parent.getMnuUpCd());
            parentAuthGroupMenu.setGrpAuthCd(authGroupMenu.getGrpAuthCd());
            parentAuthGroupMenu.setSchAh(Params.N);
            parentAuthGroupMenu.setSavAh(Params.N);
            parentAuthGroupMenu.setExlAh(Params.N);
            parentAuthGroupMenu.setFn1Ah(Params.N);
            parentAuthGroupMenu.setFn2Ah(Params.N);
            parentAuthGroupMenu.setFn3Ah(Params.N);
            parentAuthGroupMenu.setFn4Ah(Params.N);
            parentAuthGroupMenu.setFn5Ah(Params.N);

            save(parentAuthGroupMenu);

            saveParents(parent.getMnuUpCd(), authGroupMenu);
        }
    }

    public List<AuthGroupMenu> findByMnuCd(String progCd) {
        return authGroupMenuRepository.findByMnuCd(progCd);
    }

}
