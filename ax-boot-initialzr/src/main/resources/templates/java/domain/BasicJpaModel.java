package ${basePackage}.domain;

import com.chequer.axboot.core.db.type.LabelEnumType;
import com.chequer.axboot.core.db.type.MySQLJSONUserType;
import com.chequer.axboot.core.domain.base.AXBootCrudModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.springframework.data.domain.Persistable;

import javax.persistence.MappedSuperclass;
import java.io.Serializable;

@TypeDefs({
        @TypeDef(name = "jsonNode", typeClass = MySQLJSONUserType.class, parameters = {@org.hibernate.annotations.Parameter(name = MySQLJSONUserType.CLASS, value = "com.fasterxml.jackson.databind.JsonNode")}),
        @TypeDef(name = "labelEnum", typeClass = LabelEnumType.class, parameters = {@org.hibernate.annotations.Parameter(name = MySQLJSONUserType.CLASS, value = "com.chequer.axboot.core.db.type.LabelEnumType")})
})
@Setter
@Getter
@MappedSuperclass
@DynamicInsert
@DynamicUpdate
public abstract class BasicJpaModel<PK extends Serializable> extends AXBootCrudModel implements Persistable<PK>, Serializable {
    @Override
    @JsonIgnore
    public boolean isNew() {
        return null == getId();
    }
}
