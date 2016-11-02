package ${basePackage}.domain;

import ${basePackage}.domain.code.QCommonCode;
import ${basePackage}.domain.file.QCommonFile;
import ${basePackage}.domain.manual.QManual;
import ${basePackage}.domain.program.QProgram;
import ${basePackage}.domain.program.menu.QMenu;
import ${basePackage}.domain.user.QUser;
import ${basePackage}.domain.user.auth.QUserAuth;
import ${basePackage}.domain.user.auth.menu.QAuthGroupMenu;
import ${basePackage}.domain.user.role.QUserRole;
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
