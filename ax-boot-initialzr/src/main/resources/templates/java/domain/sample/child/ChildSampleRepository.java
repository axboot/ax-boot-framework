package ${basePackage}.domain.sample.child;

import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildSampleRepository extends AXBootJPAQueryDSLRepository<ChildSample, String> {

    Page<ChildSample> findByParentKey(String parentKey, Pageable pageable);
}
