package com.chequer.axboot.admin.domain.program.menu;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository extends JPAQueryDSLRepository<Menu, Long> {
}
