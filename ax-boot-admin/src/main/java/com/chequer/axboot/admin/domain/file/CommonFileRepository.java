package com.chequer.axboot.admin.domain.file;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonFileRepository extends JPAQueryDSLRepository<CommonFile, Long> {
}
