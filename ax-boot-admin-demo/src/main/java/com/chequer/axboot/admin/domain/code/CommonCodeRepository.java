package com.chequer.axboot.admin.domain.code;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommonCodeRepository extends JpaRepository<CommonCode, CommonCodeId> {

	List<CommonCode> findByGroupCd(String groupCd);

	Page<CommonCode> findByGroupCdContainingOrGroupNmContaining(String groupCd, String groupNm, Pageable pageable);

	List<CommonCode> findByGroupCdContainingOrGroupNmContaining(String groupCd, String groupNm);

	List<CommonCode> findAllByOrderByGroupCdAscCodeAsc();

	List<CommonCode> findByGroupCdAndUseYnOrderBySortAsc(String groupCd, String useYn);
}
