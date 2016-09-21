package com.chequer.axboot.core.domain.sample.child;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildSampleRepository extends JPAQueryDSLRepository<ChildSample, String> {

    Page<ChildSample> findByParentKey(String parentKey, Pageable pageable);
}
