package com.chequer.axboot.core.model.extract.template

class MyBatisInterfaceTemplate {

    public static MYBATIS_INTERFACE_TEMPLATE =
            '''
import com.chequer.axboot.core.mybatis.MyBatisMapper;
import java.util.List;


public interface ${entityClassName}Mapper extends MyBatisMapper {

    List<${entityClassName}> findAll();

    ${entityClassName} findOne(${entityClassName} ${entityClassFieldName});

    int update(${entityClassName} ${entityClassFieldName});

    int delete(${entityClassName} ${entityClassFieldName});

    int insert(${entityClassName} ${entityClassFieldName});
}
'''
}
