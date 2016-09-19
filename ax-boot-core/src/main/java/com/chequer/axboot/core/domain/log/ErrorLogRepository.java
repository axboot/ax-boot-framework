package com.chequer.axboot.core.domain.log;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorLogRepository extends JPAQueryDSLRepository<ErrorLog, Long> {
}
