package com.chequer.axboot.core.model;

import com.chequer.axboot.core.model.extract.template.file.*;
import lombok.Data;

@Data
public class JPAMvcModelExtractedCode {

	private ControllerTemplateCode controller;

	private EntityTemplateCode entity;

	private VOTemplateCode vo;

	private ServiceTemplateCode service;

	private RepositoryTemplateCode repository;

	private MyBatisInterfaceTemplateCode myBatisInterface;

	private MyBatisXMLTemplateCode myBatisXML;

}
