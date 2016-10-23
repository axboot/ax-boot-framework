package com.chequer.axboot.core.model.extract.template

class RepositoryTemplate {

    public static final String REPOSITORY_TEMPLATE =
'''
import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${repositoryClassName} extends AXBootJPAQueryDSLRepository<${entityClassName}, ${keyClassRefName}> {
}
'''
}
