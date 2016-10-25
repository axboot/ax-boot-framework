package com.chequer.axboot.core.model.extract.template

class ServiceTemplate {

    public static final String SERVICE_TEMPLATE =
            '''
import org.springframework.stereotype.Service;
import ${domainPackageName}.BaseService;
import javax.inject.Inject;
import com.chequer.axboot.core.parameter.RequestParams;
import java.util.List;

@Service
public class ${serviceClassName} extends BaseService<${entityClassName}, ${keyClassRefName}> {
    private ${repositoryClassName} ${repositoryClassFieldName};

    @Inject
    public ${serviceClassName}(${repositoryClassName} ${repositoryClassFieldName}) {
        super(${repositoryClassFieldName});
        this.${repositoryClassFieldName} = ${repositoryClassFieldName};
    }

    public List<${entityClassName}> gets(RequestParams<${entityClassName}> requestParams) {
        return findAll();
    }
}
'''
}
