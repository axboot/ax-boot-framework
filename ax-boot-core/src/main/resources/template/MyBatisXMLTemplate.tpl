<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="${domainPackageName}.${entityClassFieldName}.${entityClassName}Mapper">

    <select id="findAll" resultType="${entityClassFieldName}" parameterType="${entityClassFieldName}" statementType="PREPARED">
        SELECT
            ${selectColumns}
        FROM
            ${tableName}
    </select>

    <select id="findOne" resultType="${entityClassFieldName}" parameterType="${entityClassFieldName}" statementType="PREPARED">
        SELECT
            ${selectColumns}
        FROM
            ${tableName}
        WHERE
            ${idWhere}
    </select>

   <update id="delete" parameterType="${entityClassFieldName}" statementType="PREPARED">
        DELETE FROM
            ${tableName}
        WHERE
            ${idWhere}
    </update>

   <update id="update" parameterType="${entityClassFieldName}" statementType="PREPARED">
        UPDATE ${tableName}
        SET
            ${setColumns}
        WHERE
            ${idWhere}
    </update>

   <update id="insert" parameterType="${entityClassFieldName}" statementType="PREPARED">
        INSERT INTO ${tableName} (
            ${columns}
        ) VALUES (
            ${values}
        )
    </update>
</mapper>