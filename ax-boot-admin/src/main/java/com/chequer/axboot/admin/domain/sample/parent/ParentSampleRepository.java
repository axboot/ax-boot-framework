package com.chequer.axboot.admin.domain.sample.parent;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentSampleRepository extends JPAQueryDSLRepository<ParentSample, String> {
}
