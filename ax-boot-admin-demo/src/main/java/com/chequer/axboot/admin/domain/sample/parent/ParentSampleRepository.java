package com.chequer.axboot.admin.domain.sample.parent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentSampleRepository extends JpaRepository<ParentSample, String> {
}
