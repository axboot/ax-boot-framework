package models

import "time"

type ${entityClassName} struct {
${entityFields}
}

func (${entityClassName}) TableName() string {
    return "${tableName}"
}