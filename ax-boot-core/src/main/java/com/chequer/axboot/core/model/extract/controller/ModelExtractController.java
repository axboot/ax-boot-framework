package com.chequer.axboot.core.model.extract.controller;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.model.JPAMvcModelExtractedCode;
import com.chequer.axboot.core.model.extract.metadata.Table;
import com.chequer.axboot.core.model.extract.service.ModelExtractService;
import com.chequer.axboot.core.model.extract.service.jdbc.JdbcMetadataService;
import com.chequer.axboot.core.model.extract.template.file.TemplateCode;
import com.chequer.axboot.core.utils.TemplateUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping(value = "/modelExtractor")
public class ModelExtractController extends BaseController {


    @Inject
    private ModelExtractService modelExtractService;

    @Inject
    private JdbcMetadataService jdbcMetadataService;

    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView index(
            @RequestParam(required = true, defaultValue = "") String tableName,
            @RequestParam(required = true, defaultValue = "") String className,
            @RequestParam(required = false, defaultValue = "") String apiPath,
            ModelAndView modelAndView) throws IOException {

        modelAndView.setViewName("/axpi/index");

        try {
            JPAMvcModelExtractedCode jpaMvcModelExtractedCode = modelExtractService.getJpaMvcModel(tableName, className, apiPath);
            modelAndView.addObject("jpaMvcModel", jpaMvcModelExtractedCode);
            modelAndView.addObject("downloadLink", String.format("/modelExtractor/download?tableName=%s&className=%s&apiPath=%s&templateType", tableName, className, apiPath));
            modelAndView.addObject("copyLink", String.format("/modelExtractor/makeFiles?tableName=%s&className=%s&apiPath=%s&templateType", tableName, className, apiPath));
        } catch (Exception e) {
            e.printStackTrace();
            modelAndView.addObject("error", e.getMessage());
        }

        return modelAndView;
    }


    @RequestMapping(value = "/db", method = RequestMethod.GET)
    public String db() {
        return "/axpi/db";
    }

    @RequestMapping(value = "/tables", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public List<Table> getTableList() {
        return jdbcMetadataService.getTables();
    }

    @RequestMapping(value = "/tables", method = RequestMethod.GET, produces = APPLICATION_JSON, params = "tableName")
    public Table getTableList(@RequestParam String tableName) {
        return jdbcMetadataService.getTable(tableName);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<byte[]> download(
            @RequestParam(defaultValue = "") String tableName,
            @RequestParam(defaultValue = "") String className,
            @RequestParam(required = false, defaultValue = "") String apiPath,
            @RequestParam(defaultValue = "") String templateType) throws IOException {

        TemplateCode templateCode = modelExtractService.getTemplateCode(templateType, tableName, className, apiPath);

        HttpHeaders respHeaders = new HttpHeaders();
        respHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        respHeaders.setContentLength(templateCode.code().length());
        respHeaders.setContentDispositionFormData("attachment", templateCode.name());

        return new ResponseEntity<>(templateCode.code().getBytes(), respHeaders, HttpStatus.OK);
    }

    @RequestMapping(value = "/makeFiles", method = RequestMethod.GET)
    public ApiResponse copy(
            @RequestParam(defaultValue = "") String packageName,
            @RequestParam(defaultValue = "") String tableName,
            @RequestParam(defaultValue = "") String className,
            @RequestParam(required = false, defaultValue = "") String apiPath,
            @RequestParam(defaultValue = "") List<String> templateTypes) throws IOException {

        modelExtractService.makeFiles(templateTypes, tableName, className, apiPath, packageName);

        return ok();
    }
}
