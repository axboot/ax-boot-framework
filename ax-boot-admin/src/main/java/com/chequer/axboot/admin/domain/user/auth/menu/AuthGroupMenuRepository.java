package com.chequer.axboot.admin.domain.user.auth.menu;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthGroupMenuRepository extends JPAQueryDSLRepository<AuthGroupMenu, AuthGroupMenu.AuthGroupMenuId> {
}
