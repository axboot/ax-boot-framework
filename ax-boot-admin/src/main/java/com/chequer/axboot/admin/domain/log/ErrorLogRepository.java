package com.chequer.axboot.admin.domain.log;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorLogRepository extends AXBootJPAQueryDSLRepository<ErrorLog, Long> {
}
