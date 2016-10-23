package com.chequer.axboot.core.model.extract.template

class EntityTemplates {

    public static String SINGLE_KEY_ENTITY_CLASS_TEMPLATE =
'''
import com.chequer.axboot.core.domain.base.AXBootBaseJpaModel;
import com.chequer.axboot.core.annotations.ColumnPosition;
import lombok.*;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import com.chequer.axboot.core.annotations.Comment;
import javax.persistence.*;
${importPackages}

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "${tableName}")
@Comment(value = "${tableComment}")
@Alias("${entityClassFieldName}")${annotations}
public class ${entityClassName} extends AXBootBaseJpaModel<${keyClassRefName}> {
${entityFields}

    @Override
    public ${keyClassName} getId() {
        return ${returnKeyName};
    }
}
'''

    public static String COMPOSITE_KEY_ENTITY_CLASS_TEMPLATE =
'''
import com.chequer.axboot.core.domain.base.AXBootBaseJpaModel;
import lombok.*;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import ${packageName}.core.annotations.Comment;
import javax.persistence.*;
${importPackages}

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "${tableName}")
@Comment(value = "${tableComment}")
@IdClass(${keyClassRefName}.class)
@Alias("${entityClassFieldName}")
public class ${entityClassName} extends AXBootBaseJpaModel<${keyClassRefName}> {
${entityFields}

    @Override
    public ${keyClassName} getId() {
        return ${keyClassName}.of(${returnKeyName});
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class ${keyClassName} implements Serializable {
    ${keyFields}
    }
}
'''
}
