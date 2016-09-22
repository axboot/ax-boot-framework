package com.chequer.axboot.core.domain.code;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonCodeRepository extends JPAQueryDSLRepository<CommonCode, CommonCodeId> {
}
