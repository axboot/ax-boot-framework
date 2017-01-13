package com.chequer.axboot.core.excel;

import com.chequer.axboot.core.parameter.RequestParams;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Service
public interface ExcelService<T> {

    void excelForm(HttpServletRequest request, HttpServletResponse response) throws Exception;

    void excelDownload(RequestParams<T> requestParams, HttpServletRequest request, HttpServletResponse response) throws Exception;

    void excelUpload(RequestParams<T> requestParams, MultipartFile file, HttpServletRequest request, HttpServletResponse response) throws Exception;
}
