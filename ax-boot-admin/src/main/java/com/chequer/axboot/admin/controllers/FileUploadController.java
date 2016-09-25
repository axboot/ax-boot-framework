package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.api.response.PageableResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.domain.file.CommonFile;
import com.chequer.axboot.core.domain.file.CommonFileService;
import com.chequer.axboot.core.domain.file.UploadParameters;
import com.chequer.axboot.core.parameter.RequestParams;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping(value = "/api/v1/files")
public class FileUploadController extends BaseController {

    @Inject
    private CommonFileService commonFileService;

    @RequestMapping(value = "/upload", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public CommonFile upload(
            @RequestParam(value = "file") MultipartFile multipartFile,
            @RequestParam(value = "targetType", required = false) String targetType,
            @RequestParam(value = "targetId", required = false) String targetId,
            @RequestParam(value = "sort", required = false, defaultValue = "0") int sort,
            @RequestParam(value = "deleteIfExist", required = false, defaultValue = "false") boolean deleteIfExist,
            @RequestParam(value = "desc", required = false) String desc,
            @RequestParam(value = "thumbnail", required = false, defaultValue = "false") boolean thumbnail,
            @RequestParam(value = "thumbnailWidth", required = false, defaultValue = "640") int thumbnailWidth,
            @RequestParam(value = "thumbnailHeight", required = false, defaultValue = "640") int thumbnailHeight) throws IOException {

        UploadParameters uploadParameters = new UploadParameters();
        uploadParameters.setMultipartFile(multipartFile);
        uploadParameters.setTargetType(targetType);
        uploadParameters.setTargetId(targetId);
        uploadParameters.setSort(sort);
        uploadParameters.setDeleteIfExist(deleteIfExist);
        uploadParameters.setDesc(desc);
        uploadParameters.setThumbnail(thumbnail);
        uploadParameters.setThumbnailWidth(thumbnailWidth);
        uploadParameters.setThumbnailHeight(thumbnailHeight);

        return commonFileService.upload(uploadParameters);
    }

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public PageableResponse.PageResponse list(RequestParams<CommonFile> requestParams) {
        Page<CommonFile> files = commonFileService.getList(requestParams);
        return PageableResponse.PageResponse.of(files);
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT, produces = APPLICATION_JSON)
    public List<CommonFile> updateFile(@RequestBody List<CommonFile> file) {
        commonFileService.updateTargetTypeAndTargetId(file);
        return file;
    }

    @RequestMapping(value = "/preview", method = RequestMethod.GET)
    public void preview(HttpServletResponse response, @RequestParam Long id) throws IOException {
        commonFileService.preview(response, id);
    }

    @RequestMapping(value = "/thumbnail", method = RequestMethod.GET)
    public void thumbnail(HttpServletResponse response, @RequestParam Long id) throws IOException {
        commonFileService.thumbnail(response, id);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<byte[]> download(@RequestParam Long id) throws IOException {
        return commonFileService.downloadById(id);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET, params = {"targetType", "targetId"})
    public ResponseEntity<byte[]> downloadByTargetTypeAndTargetId(@RequestParam String targetType, @RequestParam String targetId) throws IOException {
        return commonFileService.downloadByTargetTypeAndTargetId(targetType, targetId);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.GET, produces = APPLICATION_JSON, params = "id")
    public ApiResponse delete(@RequestParam Long id) throws IOException {
        commonFileService.deleteFile(id);
        return ok();
    }

    @RequestMapping(value = "/delete", method = RequestMethod.GET, produces = APPLICATION_JSON, params = {"targetType,targetId"})
    public ApiResponse delete(@RequestParam String targetType, @RequestParam Set<String> targetId) throws IOException {
        commonFileService.deleteByTargetTypeAndTargetIds(targetType, targetId);
        return ok();
    }
}
