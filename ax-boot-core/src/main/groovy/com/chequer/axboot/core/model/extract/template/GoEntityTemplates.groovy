package com.chequer.axboot.core.model.extract.template

class GoEntityTemplates {

    public static String ENTITY_CLASS_TEMPLATE =
            '''
package models

import "time"

type ${entityClassName} struct {
${entityFields}
}

func (${entityClassName}) TableName() string {
    return "${tableName}"
}

'''
}