package com.chequer.axboot.core.domain.program.menu;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository extends JPAQueryDSLRepository<Menu, Long> {
}
