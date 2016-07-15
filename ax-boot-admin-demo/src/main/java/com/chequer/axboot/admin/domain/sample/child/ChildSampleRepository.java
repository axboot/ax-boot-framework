package com.chequer.axboot.admin.domain.sample.child;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildSampleRepository extends JpaRepository<ChildSample, String> {

	Page<ChildSample> findByParentKey(String parentKey, Pageable pageable);
}
