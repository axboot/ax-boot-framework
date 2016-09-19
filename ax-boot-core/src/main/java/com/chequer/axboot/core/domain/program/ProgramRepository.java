package com.chequer.axboot.core.domain.program;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JPAQueryDSLRepository<Program, String> {
    Page<Program> findByProgCdContainingOrProgNmContaining(String progCd, String progNm, Pageable pageable);
    List<Program> findByProgCdContainingOrProgNmContaining(String progCd, String progNm);
}
