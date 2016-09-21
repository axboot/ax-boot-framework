package com.chequer.axboot.core.domain.user.auth.menu;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthGroupMenuRepository extends JPAQueryDSLRepository<AuthGroupMenu, AuthGroupMenu.AuthGroupMenuId> {
}
