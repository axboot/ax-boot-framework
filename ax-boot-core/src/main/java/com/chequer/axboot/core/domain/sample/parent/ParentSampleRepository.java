package com.chequer.axboot.core.domain.sample.parent;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentSampleRepository extends JPAQueryDSLRepository<ParentSample, String> {
}
