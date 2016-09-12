package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.domain.notice.Notice;
import com.chequer.axboot.admin.domain.notice.NoticeService;
import com.chequer.axboot.admin.domain.notice.NoticeVO;
import com.chequer.axboot.admin.domain.notice.file.NoticeFile;
import com.chequer.axboot.admin.domain.notice.file.NoticeFileService;
import com.chequer.axboot.admin.parameter.PageableResponseParams;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.converter.BaseConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import java.io.IOException;
import java.net.URLEncoder;


@Controller
@RequestMapping(value = "/api/v1/notices")
public class NoticeController extends BaseController {

    private Logger log = LoggerFactory.getLogger(NoticeController.class);

    @Inject
    private NoticeService noticeService;

    @Inject
    private NoticeFileService noticeFileService;

    @Inject
    private BaseConverter baseConverter;

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public PageableResponseParams.PageResponse list(Pageable pageable) {
        Page<Notice> notices = noticeService.findAllByOrderByInsDtDesc(pageable);
        return PageableResponseParams.PageResponse.of(NoticeVO.of(notices.getContent()), notices);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public NoticeVO notice(@PathVariable("id") long noticeId) {
        Notice notice = noticeService.findOne(noticeId);
        return NoticeVO.of(notice);
    }

    @RequestMapping(value = "/file", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public ApiResponse fileUpload(
            @RequestParam(required = true, defaultValue = "0") Long noticeId,
            @RequestParam(required = false) MultipartFile file1,
            @RequestParam(required = false) MultipartFile file2) throws IOException {
        noticeFileService.saveFiles(noticeId, file1, file2);
        return ok();
    }

    @RequestMapping(value = "/file/{id}", method = RequestMethod.DELETE, produces = APPLICATION_JSON)
    public ApiResponse fileUpload(@PathVariable("id") int fileId) {
        noticeFileService.delete(fileId);
        return ok();
    }

    @RequestMapping(value = "/file/{id}", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public ResponseEntity<byte[]> fileDownload(@PathVariable("id") int noticeFileId) throws IOException {

        NoticeFile noticeFile = noticeFileService.findOne(noticeFileId);

        String encodedFileName = URLEncoder.encode(noticeFile.getFileName(), "UTF-8").replace("+", "%20");

        HttpHeaders respHeaders = new HttpHeaders();
        respHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        respHeaders.setContentLength(noticeFile.getFileBlob().length);
        respHeaders.set("Content-Disposition", "attachment;filename=\"" + encodedFileName + "\";");
        respHeaders.set("Content-Transfer-Encoding", "binary");

        return new ResponseEntity<>(noticeFile.getFileBlob(), respHeaders, HttpStatus.OK);
    }

    @RequestMapping(value = "", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
    public Notice save(@RequestBody NoticeVO request) {
        Notice notice = baseConverter.convert(request, Notice.class);
        noticeService.saveNotice(notice);
        return notice;
    }
}
