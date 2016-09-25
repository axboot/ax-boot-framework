package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.domain.file.CKEditorUploadResponse;
import com.chequer.axboot.core.domain.file.CommonFile;
import com.chequer.axboot.core.domain.file.CommonFileService;
import com.chequer.axboot.core.domain.file.UploadParameters;
import com.chequer.axboot.core.parameter.RequestParams;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import java.io.IOException;

@Controller
@RequestMapping("/ckeditor")
public class CKEditorController extends BaseController {

    @Inject
    private CommonFileService commonFileService;

    @RequestMapping(value = "/uploadImage", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public CKEditorUploadResponse uploadDragAndDropFromCKEditor(
            @RequestParam(value = "upload") MultipartFile multipartFile,
            @RequestParam(defaultValue = "CKEDITOR", required = false) String targetType,
            @RequestParam String targetId) throws IOException {


        if (StringUtils.isEmpty(multipartFile.getName())) {
            throw new IllegalArgumentException("file not presented");
        }

        UploadParameters uploadParameters = new UploadParameters();
        uploadParameters.setMultipartFile(multipartFile);
        uploadParameters.setTargetId(targetId);
        uploadParameters.setTargetType(targetType);
        uploadParameters.setThumbnail(false);

        CommonFile commonFile = commonFileService.upload(uploadParameters);

        CKEditorUploadResponse ckEditorUploadResponse = new CKEditorUploadResponse();
        ckEditorUploadResponse.setFileName(commonFile.getFileNm());
        ckEditorUploadResponse.setUrl(commonFile.preview());

        return ckEditorUploadResponse;
    }

    @RequestMapping(value = "/fileBrowser")
    public String fileBrowser(RequestParams<CommonFile> requestParams, ModelMap modelMap) {
        Page<CommonFile> commonFileList = commonFileService.getList(requestParams);

        modelMap.put("files", commonFileList.getContent());

        return "/common/fileBrowser";
    }
}
