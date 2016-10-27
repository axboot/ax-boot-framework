package ${basePackage}.domain.user.role;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends AXBootJPAQueryDSLRepository<UserRole, Long> {
    List<UserRole> findByUserCd(String userCd);
}
