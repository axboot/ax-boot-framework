package ${basePackage}.domain.program;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends AXBootJPAQueryDSLRepository<Program, String> {
}
