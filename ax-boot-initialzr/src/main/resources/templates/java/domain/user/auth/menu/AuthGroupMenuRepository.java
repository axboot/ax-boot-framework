package ${basePackage}.domain.user.auth.menu;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthGroupMenuRepository extends AXBootJPAQueryDSLRepository<AuthGroupMenu, AuthGroupMenu.AuthGroupMenuId> {
}
