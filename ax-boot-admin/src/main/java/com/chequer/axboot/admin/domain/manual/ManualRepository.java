package com.chequer.axboot.admin.domain.manual;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManualRepository extends AXBootJPAQueryDSLRepository<Manual, Long> {
}
