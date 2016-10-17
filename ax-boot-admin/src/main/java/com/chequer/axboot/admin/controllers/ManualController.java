package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.domain.manual.Manual;
import com.chequer.axboot.core.domain.manual.ManualListVO;
import com.chequer.axboot.core.domain.manual.ManualRequestVO;
import com.chequer.axboot.core.domain.manual.ManualService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;


@Controller
@RequestMapping(value = "/api/v1/manual")
public class ManualController extends BaseController {

    @Inject
    private ManualService manualService;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.ListResponse manualList(RequestParams requestParams) {
        List<Manual> list = manualService.get(requestParams);
        return Responses.ListResponse.of(ModelMapperUtils.mapList(list, ManualListVO.class));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Manual manualDetail(@PathVariable Long id) {
        return manualService.findOne(id);
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

    @RequestMapping(value = "/{id}", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public Manual uploadManualFile(@PathVariable Long id, @RequestParam MultipartFile file) throws IOException {
        return manualService.uploadFile(id, file);
    }


    @RequestMapping(value = "/uploadList", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse uploadManualChapter(@RequestParam String manualGrpCd, @RequestParam MultipartFile file) throws IOException, InvalidFormatException {
        manualService.uploadList(manualGrpCd, file.getInputStream());
        return ok();
    }
}
