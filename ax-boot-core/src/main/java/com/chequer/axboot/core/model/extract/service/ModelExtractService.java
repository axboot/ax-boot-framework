package com.chequer.axboot.core.model.extract.service;

import com.chequer.axboot.core.api.ApiException;
import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.code.ApiStatus;
import com.chequer.axboot.core.config.AXBootContextConfig;
import com.chequer.axboot.core.model.JPAMvcModelExtractedCode;
import com.chequer.axboot.core.model.extract.metadata.Table;
import com.chequer.axboot.core.model.extract.service.jdbc.JdbcMetadataService;
import com.chequer.axboot.core.model.extract.template.TemplateParser;
import com.chequer.axboot.core.model.extract.template.file.TemplateCode;
import com.chequer.axboot.core.utils.TemplateUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ModelExtractService {

    @Inject
    private JdbcMetadataService jdbcMetadataService;

    @Inject
    private AXBootContextConfig axBootContextConfig;

    public JPAMvcModelExtractedCode getJpaMvcModel(String tableName, String className, String apiPath) {
        Table table = jdbcMetadataService.getTable(tableName);

        if (table == null) {
            throw new ApiException(ApiStatus.BAD_REQUEST, "테이블이 존재하지 않습니다. 테이블명을 확인하세요");
        }

        JPAMvcModelExtractedCode jpaMvcModelExtractedCode = new JPAMvcModelExtractedCode();

        jpaMvcModelExtractedCode.setController(TemplateParser.getControllerTemplate(className, apiPath, table));
        jpaMvcModelExtractedCode.setEntity(TemplateParser.getEntityTemplate(className, table));
        jpaMvcModelExtractedCode.setService(TemplateParser.getServiceTemplate(className, table));
        jpaMvcModelExtractedCode.setRepository(TemplateParser.getRepositoryTemplate(className, table));
        jpaMvcModelExtractedCode.setVo(TemplateParser.getVoTemplate(className, table));
        jpaMvcModelExtractedCode.setMyBatisInterface(TemplateParser.getMyBatisInterfaceTemplate(className, table));
        jpaMvcModelExtractedCode.setMyBatisXML(TemplateParser.getMyBatisXMLTemplate(className, table));

        AXBootContextConfig.Modeler modelerConfig = axBootContextConfig.getModelerConfig();

        if (modelerConfig.isOutput()) {
            String outputDir = modelerConfig.getOutputDir();

            try {
                File outputDirFile = new File(outputDir);
                FileUtils.forceMkdir(outputDirFile);
                FileUtils.cleanDirectory(outputDirFile);

                IOUtils.write(jpaMvcModelExtractedCode.getEntity().code(), new FileOutputStream(new File(outputDir + jpaMvcModelExtractedCode.getEntity().name())), "UTF-8");
                IOUtils.write(jpaMvcModelExtractedCode.getController().code(), new FileOutputStream(new File(outputDir + jpaMvcModelExtractedCode.getController().name())), "UTF-8");
                IOUtils.write(jpaMvcModelExtractedCode.getService().code(), new FileOutputStream(new File(outputDir + jpaMvcModelExtractedCode.getService().name())), "UTF-8");
                IOUtils.write(jpaMvcModelExtractedCode.getRepository().code(), new FileOutputStream(new File(outputDir + jpaMvcModelExtractedCode.getRepository().name())), "UTF-8");
                IOUtils.write(jpaMvcModelExtractedCode.getVo().code(), new FileOutputStream(new File(outputDir + jpaMvcModelExtractedCode.getVo().name())), "UTF-8");
                IOUtils.write(jpaMvcModelExtractedCode.getMyBatisInterface().code(), new FileOutputStream(new File(outputDir + jpaMvcModelExtractedCode.getMyBatisInterface().name())), "UTF-8");
                IOUtils.write(jpaMvcModelExtractedCode.getMyBatisXML().code(), new FileOutputStream(new File(outputDir + jpaMvcModelExtractedCode.getMyBatisXML().name())), "UTF-8");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return jpaMvcModelExtractedCode;
    }

    public TemplateCode getTemplateCode(String templateType, String tableName, String className, String apiPath) {
        Table table = jdbcMetadataService.getTable(tableName);

        switch (templateType) {
            case AXBootTypes.ModelExtractorTemplate.CONTROLLER:
                return TemplateParser.getControllerTemplate(className, apiPath, table);

            case AXBootTypes.ModelExtractorTemplate.VO:
                return TemplateParser.getVoTemplate(className, table);

            case AXBootTypes.ModelExtractorTemplate.ENTITY:
                return TemplateParser.getEntityTemplate(className, table);

            case AXBootTypes.ModelExtractorTemplate.SERVICE:
                return TemplateParser.getServiceTemplate(className, table);

            case AXBootTypes.ModelExtractorTemplate.REPOSITORY:
                return TemplateParser.getRepositoryTemplate(className, table);

            case AXBootTypes.ModelExtractorTemplate.MYBATIS_INTERFACE:
                return TemplateParser.getMyBatisInterfaceTemplate(className, table);

            case AXBootTypes.ModelExtractorTemplate.MYBATIS_XML:
                return TemplateParser.getMyBatisXMLTemplate(className, table);
        }

        return null;
    }

    public void makeFiles(List<String> templateTypes, String tableName, String className, String apiPath, String packageName) {
        for (String templateType : templateTypes) {
            Table table = jdbcMetadataService.getTable(tableName);

            String domainPackage = axBootContextConfig.getDomainPackageName() + "." + packageName;

            switch (templateType) {
                case AXBootTypes.ModelExtractorTemplate.CONTROLLER:
                    TemplateUtils.makeControllerFile(TemplateParser.getControllerTemplate(className, apiPath, table), axBootContextConfig.getControllerPackageName());
                    break;

                case AXBootTypes.ModelExtractorTemplate.VO:
                    TemplateUtils.makeDomainFile(TemplateParser.getVoTemplate(className, table), domainPackage);
                    break;

                case AXBootTypes.ModelExtractorTemplate.ENTITY:
                    TemplateUtils.makeDomainFile(TemplateParser.getEntityTemplate(className, table), domainPackage);
                    break;

                case AXBootTypes.ModelExtractorTemplate.SERVICE:
                    TemplateUtils.makeDomainFile(TemplateParser.getServiceTemplate(className, table), domainPackage);
                    break;

                case AXBootTypes.ModelExtractorTemplate.REPOSITORY:
                    TemplateUtils.makeDomainFile(TemplateParser.getRepositoryTemplate(className, table), domainPackage);
                    break;

                case AXBootTypes.ModelExtractorTemplate.MYBATIS_INTERFACE:
                    TemplateUtils.makeDomainFile(TemplateParser.getMyBatisInterfaceTemplate(className, table), domainPackage);
                    break;

                case AXBootTypes.ModelExtractorTemplate.MYBATIS_XML:
                    TemplateUtils.makeDomainResourceFile(TemplateParser.getMyBatisXMLTemplate(className, table), domainPackage);
                    break;
            }
        }
    }
}
