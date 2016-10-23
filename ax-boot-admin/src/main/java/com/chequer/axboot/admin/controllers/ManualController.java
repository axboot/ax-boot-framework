package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.manual.Manual;
import com.chequer.axboot.admin.domain.manual.ManualListVO;
import com.chequer.axboot.admin.domain.manual.ManualRequestVO;
import com.chequer.axboot.admin.domain.manual.ManualService;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.parameter.RequestParams;
import com.chequer.axboot.core.utils.ExcelUtils;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.Collections;
import java.util.List;


@Controller
@RequestMapping(value = "/api/v1/manual")
public class ManualController extends BaseController {

    @Inject
    private ManualService manualService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.ListResponse manualList(RequestParams<Manual> requestParams) {
        List<Manual> list = manualService.get(requestParams);
        return Responses.ListResponse.of(ModelMapperUtils.mapList(list, ManualListVO.class));
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.ListResponse search(RequestParams<Manual> requestParams) {
        List<Manual> list = manualService.search(requestParams);
        return Responses.ListResponse.of(ModelMapperUtils.mapList(list, ManualListVO.class));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Manual manualDetail(@PathVariable Long id) {
        return manualService.getManual(id);
    }

    @RequestMapping(value = "/detail", method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse save(@Valid @RequestBody Manual manual) {
        manualService.save(manual);
        return ok();
    }

    @RequestMapping(method = {RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse save(@RequestBody ManualRequestVO vo) {
        manualService.saveOrDelete(vo);
        return ok();
    }

    @RequestMapping(value = "/{id}/file", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public Manual uploadManualFile(@PathVariable Long id, @RequestParam MultipartFile file) throws IOException {
        return manualService.uploadFile(id, file);
    }

    @RequestMapping(value = "/excel/uploadList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse uploadManualChapter(@RequestParam String manualGrpCd, @RequestParam MultipartFile file) throws IOException, InvalidFormatException {
        manualService.uploadList(manualGrpCd, file.getInputStream());
        return ok();
    }

    @RequestMapping(value = "/excel/downloadForm", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public void downloadForm(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ExcelUtils.renderExcel("/excel/manual.xlsx", Collections.emptyList(), "매뉴얼 업로드양식", request, response);
    }
}
