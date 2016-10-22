package com.chequer.axboot.admin.domain.code;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonCodeRepository extends JPAQueryDSLRepository<CommonCode, CommonCodeId> {
}
