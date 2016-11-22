package com.chequer.axboot.core.utils;

import eu.bitwalker.useragentutils.Browser;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;
import org.springframework.core.io.ClassPathResource;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;

import static eu.bitwalker.useragentutils.Browser.*;


public class ExcelUtils {

    public static String getDisposition(HttpServletRequest request, String fileName) {
        try {
            Browser browser = AgentUtils.getBrowser(request);

            switch (browser.getGroup()) {
                case IE:
                    return URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");

                case CHROME:
                    StringBuffer sb = new StringBuffer();
                    for (int i = 0; i < fileName.length(); i++) {
                        char c = fileName.charAt(i);
                        if (c > '~') {
                            sb.append(URLEncoder.encode("" + c, "UTF-8"));
                        } else {
                            sb.append(c);
                        }
                    }
                    return sb.toString();

                case OPERA:
                case FIREFOX:
                    return new String(fileName.getBytes("UTF-8"), "8859_1");
            }
        } catch (Exception e) {

        }
        return fileName;
    }

    public static void renderExcel(String excelFileName, List<?> dataList, String downloadFileName, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Context context = new Context();
        context.putVar("dataList", dataList);

        InputStream is = getInputStream(excelFileName);

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment;filename=" + ExcelUtils.getDisposition(request, downloadFileName + ".xlsx"));

        JxlsHelper.getInstance().processTemplate(is, response.getOutputStream(), context);
    }

    public static InputStream getInputStream(String name) throws IOException {
        return new ClassPathResource(name).getInputStream();
    }
}
