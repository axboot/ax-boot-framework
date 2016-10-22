package com.chequer.axboot.admin.domain.log;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorLogRepository extends JPAQueryDSLRepository<ErrorLog, Long> {
}
