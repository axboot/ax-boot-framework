package com.chequer.axboot.core.utils;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;

import java.io.File;

public class TemplateUtils {

    public static void makeFile(String jspPath, ClassLoader loader) {
        try {
            if (loader == null) {
                loader = TemplateUtils.class.getClassLoader();
            }

            String servletBasePath = HttpUtils.getCurrentRequest().getServletContext().getRealPath("/");

            if (servletBasePath.contains("/target")) {
                servletBasePath = servletBasePath.substring(0, servletBasePath.indexOf("/target"));
            }

            String fileBasePath = servletBasePath;

            if (!fileBasePath.contains("webapp")) {
                fileBasePath = servletBasePath + "/src/main/webapp/";
            }

            String jsPath = getJsPath(jspPath);
            String defaultJsPath = getDefaultJsPath(jspPath);

            File jspFile = new File(fileBasePath + jspPath);
            File defaultJsFile = new File(fileBasePath + defaultJsPath);
            File jsFile = new File(fileBasePath + jsPath);

            if (!jspFile.exists()) {
                FileUtils.forceMkdir(jspFile.getParentFile());
                String jspTemplate = IOUtils.toString(new ClassPathResource("/template/JSPBasicTemplate.tpl", loader).getInputStream(), "UTF-8");
                jspTemplate = jspTemplate.replace("@{programJSPath}", jsPath);

                FileUtils.write(jspFile, jspTemplate, "UTF-8");
            }

            if (!jsFile.exists() && !defaultJsFile.exists()) {
                FileUtils.forceMkdir(jsFile.getParentFile());
                String jsTemplate = IOUtils.toString(new ClassPathResource("/template/JSBasicTemplate.tpl", loader).getInputStream(), "UTF-8");
                FileUtils.write(jsFile, jsTemplate, "UTF-8");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void makeFile(String jspPath) {
        makeFile(jspPath, null);
    }

    public static String getJsPath(String programPath) {
        String fileName = FilenameUtils.getBaseName(programPath.substring(5)) + ".js";
        return "/assets/js/view/" + fileName;
    }

    public static String getDefaultJsPath(String programPath) {
        String fileName = FilenameUtils.getBaseName(programPath.substring(5)) + ".js";
        return "/assets/js/axboot/" + fileName;
    }
}
