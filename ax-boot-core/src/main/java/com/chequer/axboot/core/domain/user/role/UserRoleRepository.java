package com.chequer.axboot.core.domain.user.role;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JPAQueryDSLRepository<UserRole, Long> {
    List<UserRole> findByUserCd(String userCd);
}
