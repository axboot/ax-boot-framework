package com.chequer.axboot.core.model.extract.template;

import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.model.extract.metadata.Table;
import com.chequer.axboot.core.model.extract.template.fields.EntityFields;
import com.chequer.axboot.core.model.extract.template.fields.KeyFields;
import com.chequer.axboot.core.model.extract.template.fields.VOFields;
import com.chequer.axboot.core.model.extract.template.file.*;
import com.chequer.axboot.core.utils.NamingUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrSubstitutor;

import java.util.HashMap;
import java.util.Map;

public class TemplateParser {

    public static EntityTemplateCode getEntityTemplate(String className, Table table) {
        String template = EntityTemplates.SINGLE_KEY_ENTITY_CLASS_TEMPLATE;

        EntityFields entityFields = TemplateBuilder.EntityTemplateBuilder.build(table);

        Map<String, String> templateElements = new HashMap<>();

        templateElements.put(TemplateKeys.TABLE_NAME, table.getTableName());
        templateElements.put(TemplateKeys.PACKAGE_NAME, AXBootContextConfig.getInstance().getBasePackageName());
        templateElements.put(TemplateKeys.TABLE_COMMENT, table.getRemarks());
        templateElements.put(TemplateKeys.ENTITY_CLASS_NAME, className);
        templateElements.put(TemplateKeys.ENTITY_CLASS_FIELD_NAME, NamingUtils.classFieldName(className));
        templateElements.put(TemplateKeys.KEY_CLASS_REF_NAME, table.keyClassRefName(className));
        templateElements.put(TemplateKeys.KEY_CLASS_NAME, table.keyClassName(className));
        templateElements.put(TemplateKeys.RETURN_KEY_NAME, table.returnKeyName());
        templateElements.put(TemplateKeys.ENTITY_FIELDS, entityFields.getCode());
        templateElements.put(TemplateKeys.IMPORT_PACKAGES, entityFields.getImportPackages());
        templateElements.put(TemplateKeys.ANNOTATIONS, entityFields.getAnnotations());

        if (table.keyType().equals(Table.Key.COMPOSITE)) {
            template = EntityTemplates.COMPOSITE_KEY_ENTITY_CLASS_TEMPLATE;

            KeyFields keyFields = TemplateBuilder.KeyTemplateBuilder.build(table);
            templateElements.put(TemplateKeys.KEY_FIELDS, keyFields.getCode());
        }

        return EntityTemplateCode.of(new StrSubstitutor(templateElements).replace(template), NamingUtils.classFileName(className));
    }

    public static ServiceTemplateCode getServiceTemplate(String className, Table table) {
        Map<String, String> templateElements = new HashMap<>();

        templateElements.put(TemplateKeys.PACKAGE_NAME, AXBootContextConfig.getInstance().getBasePackageName());
        templateElements.put(TemplateKeys.KEY_CLASS_REF_NAME, table.keyClassRefName(className));
        templateElements.put(TemplateKeys.KEY_CLASS_NAME, table.keyClassName(className));
        templateElements.put(TemplateKeys.ENTITY_CLASS_NAME, className);
        templateElements.put(TemplateKeys.SERVICE_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.SERVICE));
        templateElements.put(TemplateKeys.REPOSITORY_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.REPOSITORY));
        templateElements.put(TemplateKeys.REPOSITORY_CLASS_FIELD_NAME, NamingUtils.classFieldNameWithType(className, Types.ModelExtractorTemplateSuffix.REPOSITORY));

        return ServiceTemplateCode.of(new StrSubstitutor(templateElements).replace(ServiceTemplate.SERVICE_TEMPLATE), NamingUtils.classFileNameWithType(className, Types.ModelExtractorTemplateSuffix.SERVICE));
    }

    public static RepositoryTemplateCode getRepositoryTemplate(String className, Table table) {
        Map<String, String> templateElements = new HashMap<>();

        templateElements.put(TemplateKeys.PACKAGE_NAME, AXBootContextConfig.getInstance().getBasePackageName());
        templateElements.put(TemplateKeys.KEY_CLASS_REF_NAME, table.keyClassRefName(className));
        templateElements.put(TemplateKeys.KEY_CLASS_NAME, table.keyClassName(className));
        templateElements.put(TemplateKeys.ENTITY_CLASS_NAME, className);
        templateElements.put(TemplateKeys.REPOSITORY_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.REPOSITORY));

        return RepositoryTemplateCode.of(new StrSubstitutor(templateElements).replace(RepositoryTemplate.REPOSITORY_TEMPLATE), NamingUtils.classFileNameWithType(className, Types.ModelExtractorTemplateSuffix.REPOSITORY));
    }

    public static VOTemplateCode getVoTemplate(String className, Table table) {
        Map<String, String> templateElements = new HashMap<>();

        VOFields voFields = TemplateBuilder.VOTemplateBuilder.build(table);

        templateElements.put(TemplateKeys.PACKAGE_NAME, AXBootContextConfig.getInstance().getBasePackageName());
        templateElements.put(TemplateKeys.ENTITY_CLASS_NAME, className);
        templateElements.put(TemplateKeys.ENTITY_CLASS_FIELD_NAME, NamingUtils.classFieldName(className));
        templateElements.put(TemplateKeys.VO_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.VO));
        templateElements.put(TemplateKeys.VO_CLASS_FIELD_NAME, NamingUtils.classFieldNameWithType(className, Types.ModelExtractorTemplateSuffix.VO));
        templateElements.put(TemplateKeys.VO_FIELDS, voFields.getCode());
        templateElements.put(TemplateKeys.IMPORT_PACKAGES, voFields.getImportPackages());

        return VOTemplateCode.of(new StrSubstitutor(templateElements).replace(VOTemplate.VO_TEMPLATE), NamingUtils.classFileNameWithType(className, Types.ModelExtractorTemplateSuffix.VO));
    }

    public static ControllerTemplateCode getControllerTemplate(String className, String apiPath, Table table) {
        Map<String, String> templateElements = new HashMap<>();

        if (StringUtils.isEmpty(apiPath)) {
            apiPath = NamingUtils.classFieldName(className) + "s";
        }

        templateElements.put(TemplateKeys.PACKAGE_NAME, AXBootContextConfig.getInstance().getBasePackageName());
        templateElements.put(TemplateKeys.ENTITY_CLASS_NAME, className);
        templateElements.put(TemplateKeys.API_PATH, apiPath);
        templateElements.put(TemplateKeys.ENTITY_CLASS_FIELD_NAME, NamingUtils.classFieldName(className));
        templateElements.put(TemplateKeys.CONTROLLER_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.CONTROLLER));
        templateElements.put(TemplateKeys.SERVICE_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.SERVICE));
        templateElements.put(TemplateKeys.SERVICE_CLASS_FIELD_NAME, NamingUtils.classFieldNameWithType(className, Types.ModelExtractorTemplateSuffix.SERVICE));

        return ControllerTemplateCode.of(new StrSubstitutor(templateElements).replace(ControllerTemplate.CONTROLLER_TEMPLATE), NamingUtils.classFileNameWithType(className, Types.ModelExtractorTemplateSuffix.CONTROLLER));
    }

    public static MyBatisInterfaceTemplateCode getMyBatisInterfaceTemplate(String className, Table table) {
        Map<String, String> templateElements = new HashMap<>();

        templateElements.put(TemplateKeys.PACKAGE_NAME, AXBootContextConfig.getInstance().getBasePackageName());
        templateElements.put(TemplateKeys.TABLE_NAME, table.getTableName());
        templateElements.put(TemplateKeys.ENTITY_CLASS_NAME, className);
        templateElements.put(TemplateKeys.ENTITY_CLASS_FIELD_NAME, NamingUtils.classFieldName(className));
        templateElements.put(TemplateKeys.MYBATIS_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.MYBATIS));
        templateElements.put(TemplateKeys.MYBATIS_CLASS_FIELD_NAME, NamingUtils.classFieldNameWithType(className, Types.ModelExtractorTemplateSuffix.MYBATIS));

        return MyBatisInterfaceTemplateCode.of(new StrSubstitutor(templateElements).replace(MyBatisInterfaceTemplate.MYBATIS_INTERFACE_TEMPLATE), NamingUtils.classFileNameWithType(className, Types.ModelExtractorTemplateSuffix.MYBATIS));
    }

    public static MyBatisXMLTemplateCode getMyBatisXMLTemplate(String className, Table table) {
        Map<String, String> templateElements = new HashMap<>();

        templateElements.put(TemplateKeys.PACKAGE_NAME, AXBootContextConfig.getInstance().getBasePackageName());
        templateElements.put(TemplateKeys.TABLE_NAME, table.getTableName());
        templateElements.put(TemplateKeys.ENTITY_CLASS_NAME, className);
        templateElements.put(TemplateKeys.ENTITY_CLASS_FIELD_NAME, NamingUtils.classFieldName(className));
        templateElements.put(TemplateKeys.MYBATIS_CLASS_NAME, NamingUtils.classNameWithType(className, Types.ModelExtractorTemplateSuffix.MYBATIS));
        templateElements.put(TemplateKeys.MYBATIS_CLASS_FIELD_NAME, NamingUtils.classFieldNameWithType(className, Types.ModelExtractorTemplateSuffix.MYBATIS));
        templateElements.put(TemplateKeys.SELECT_COLUMNS, table.selectQueryFields());
        templateElements.put(TemplateKeys.COLUMNS, table.queryFields());
        templateElements.put(TemplateKeys.VALUES, table.queryValues());
        templateElements.put(TemplateKeys.SET_COLUMNS, table.setColumns());
        templateElements.put(TemplateKeys.ID_WHERE, table.idWhere());

        return MyBatisXMLTemplateCode.of(new StrSubstitutor(templateElements).replace(MyBatisXMLTemplate.MYBATIS_XML_TEMPLATE), NamingUtils.xmlFileNameWithType(className, Types.ModelExtractorTemplateSuffix.MYBATIS));
    }
}
