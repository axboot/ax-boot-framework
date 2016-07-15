package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping(value = "/api/v1/largeFileUpload")
public class LargeFileUploadController extends BaseController {


    @RequestMapping(value = "", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse upload(@RequestParam MultipartFile file) {
        return ok("업로드 성공 : " + file.getSize());
    }
}
