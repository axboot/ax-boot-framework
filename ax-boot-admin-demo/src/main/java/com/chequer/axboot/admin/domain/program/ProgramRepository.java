package com.chequer.axboot.admin.domain.program;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, String> {
	Page<Program> findByProgCdContainingOrProgNmContaining(String progCd, String progNm, Pageable pageable);

	List<Program> findByProgCdContainingOrProgNmContaining(String progCd, String progNm);
}
