package com.chequer.axboot.admin.domain;

import com.chequer.axboot.admin.domain.code.QCommonCode;
import com.chequer.axboot.admin.domain.file.QCommonFile;
import com.chequer.axboot.admin.domain.manual.QManual;
import com.chequer.axboot.admin.domain.program.QProgram;
import com.chequer.axboot.admin.domain.program.menu.QMenu;
import com.chequer.axboot.admin.domain.user.QUser;
import com.chequer.axboot.admin.domain.user.auth.QUserAuth;
import com.chequer.axboot.admin.domain.user.auth.menu.QAuthGroupMenu;
import com.chequer.axboot.admin.domain.user.role.QUserRole;
import com.chequer.axboot.core.domain.base.AXBootBaseService;
import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;

import java.io.Serializable;


public class BaseService<T, ID extends Serializable> extends AXBootBaseService<T, ID> {

    protected QUserRole qUserRole = QUserRole.userRole;
    protected QAuthGroupMenu qAuthGroupMenu = QAuthGroupMenu.authGroupMenu;
    protected QCommonCode qCommonCode = QCommonCode.commonCode;
    protected QUser qUser = QUser.user;
    protected QProgram qProgram = QProgram.program;
    protected QUserAuth qUserAuth = QUserAuth.userAuth;
    protected QMenu qMenu = QMenu.menu;
    protected QManual qManual = QManual.manual;
    protected QCommonFile qCommonFile = QCommonFile.commonFile;

    protected AXBootJPAQueryDSLRepository<T, ID> repository;

    public BaseService() {
        super();
    }

    public BaseService(AXBootJPAQueryDSLRepository<T, ID> repository) {
        super(repository);
        this.repository = repository;
    }
}
