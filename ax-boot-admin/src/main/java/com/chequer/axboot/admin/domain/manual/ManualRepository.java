package com.chequer.axboot.admin.domain.manual;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManualRepository extends JPAQueryDSLRepository<Manual, Long> {
}
