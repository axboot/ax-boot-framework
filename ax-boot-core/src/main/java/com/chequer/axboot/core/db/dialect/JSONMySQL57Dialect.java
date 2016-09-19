package com.chequer.axboot.core.db.dialect;

import com.chequer.axboot.core.db.type.MySQLJSONUserType;
import org.hibernate.dialect.MySQL57InnoDBDialect;

import java.sql.Types;

public class JSONMySQL57Dialect extends MySQL57InnoDBDialect {

	public JSONMySQL57Dialect() {
		super();
		registerColumnType(Types.JAVA_OBJECT, MySQLJSONUserType.JSON_TYPE);
	}
}
