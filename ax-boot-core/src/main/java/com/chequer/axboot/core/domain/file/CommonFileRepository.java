package com.chequer.axboot.core.domain.file;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface CommonFileRepository extends JPAQueryDSLRepository<CommonFile, Long> {
    List<CommonFile> findByTargetTypeAndTargetIdAndDelYnOrderByInsDtAsc(String targetType, String targetId, String delYn);

    List<CommonFile> findByTargetTypeAndTargetIdInAndDelYnOrderByInsDtAsc(String targetType, Set<String> targetIds, String delYn);

    List<CommonFile> findByTargetType(String targetType);

}
