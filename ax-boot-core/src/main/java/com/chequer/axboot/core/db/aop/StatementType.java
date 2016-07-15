package com.chequer.axboot.core.db.aop;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.Statement;

public enum StatementType {
	statement,
	preparedStatement,
	callableStatement;

	public static StatementType getStatementType(Statement statement) {
		if (statement instanceof CallableStatement) {
			return callableStatement;
		}

		if (statement instanceof PreparedStatement) {
			return preparedStatement;
		}

		return StatementType.statement;
	}
}
