package ${basePackage}.domain.code;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonCodeRepository extends AXBootJPAQueryDSLRepository<CommonCode, CommonCodeId> {
}
