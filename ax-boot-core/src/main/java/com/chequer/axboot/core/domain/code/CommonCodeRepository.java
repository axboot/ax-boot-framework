package com.chequer.axboot.core.domain.code;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommonCodeRepository extends JPAQueryDSLRepository<CommonCode, CommonCodeId> {
    List<CommonCode> findByPosUseYn(String posUseYn);

    List<CommonCode> findAllByOrderByGroupCdAscCodeAsc();

    List<CommonCode> findByGroupCdAndUseYnOrderBySortAsc(String basicCd, String useYn);
}
