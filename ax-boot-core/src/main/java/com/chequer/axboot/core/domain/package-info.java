@TypeDefs({
        @TypeDef(name = "jsonNode", typeClass = MySQLJSONUserType.class, parameters = {@org.hibernate.annotations.Parameter(name = MySQLJSONUserType.CLASS, value = "com.fasterxml.jackson.databind.JsonNode")}),
        @TypeDef(name = "labelEnum", typeClass = LabelEnumType.class, parameters = {@org.hibernate.annotations.Parameter(name = MySQLJSONUserType.CLASS, value = "com.chequer.axboot.core.db.type.LabelEnumType")})
})

package com.chequer.axboot.core.domain;

import com.chequer.axboot.core.db.type.LabelEnumType;
import com.chequer.axboot.core.db.type.MySQLJSONUserType;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;