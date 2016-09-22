package com.chequer.axboot.core.domain.file;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonFileRepository extends JPAQueryDSLRepository<CommonFile, Long> {
}
