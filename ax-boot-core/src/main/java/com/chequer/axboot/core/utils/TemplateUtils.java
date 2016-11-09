package com.chequer.axboot.core.utils;

import com.chequer.axboot.core.model.extract.template.file.TemplateCode;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;

public class TemplateUtils {

    public static final String DEFAULT_JS_PATH = "/assets/js/view";
    public static final String AXBOOT_JS_PATH = "/assets/js/axboot";
    public static final String WEBAPP_PATH = "/src/main/webapp";
    public static final String JAVA_SRC_PATH = "/src/main/java";
    public static final String RESOURCE_PATH = "/src/main/resources";

    public static ClassLoader getClassLoader(ClassLoader loader) {
        if (loader == null) {
            loader = TemplateUtils.class.getClassLoader();
        }
        return loader;
    }

    public static String getServletBasePath() {
        String servletBasePath = HttpUtils.getCurrentRequest().getServletContext().getRealPath("/");

        if (servletBasePath.contains("/target")) {
            servletBasePath = servletBasePath.substring(0, servletBasePath.indexOf("/target"));
        }

        if (servletBasePath.contains("/src")) {
            servletBasePath = servletBasePath.substring(0, servletBasePath.indexOf("/src"));
        }

        return servletBasePath;
    }

    public static String getWebAppPath() {
        String servletBasePath = getServletBasePath();
        return servletBasePath + WEBAPP_PATH;
    }

    public static String getJavaSourcePath() {
        return getServletBasePath() + JAVA_SRC_PATH;
    }

    public static String getResourcePath() {
        return getServletBasePath() + RESOURCE_PATH;
    }

    public static String getPackagePath(String qualifedName) {
        return "/" + StringUtils.replace(qualifedName, ".", "/");
    }

    public static String getAbsoluteControllerPath(String packageName, String classFileName) {
        return getJavaSourcePath() + getPackagePath(packageName) + "/" + classFileName;
    }

    public static String getAbsoluteDomainPath(String packageName, String classFileName) {
        return getJavaSourcePath() + getPackagePath(packageName) + "/" + classFileName;
    }

    public static String getAbsoluteResoucePath(String packageName, String classFileName) {
        return getResourcePath() + getPackagePath(packageName) + "/" + classFileName;
    }

    public static String getAbsoluteJspPath(String programPath) {
        return getWebAppPath() + programPath;
    }

    public static String getAbsoluteJsPath(String programPath) {
        return getWebAppPath() + DEFAULT_JS_PATH + getJsName(programPath);
    }

    public static String getAbsoluteDefaultJsPath(String programPath) {
        return getWebAppPath() + AXBOOT_JS_PATH + getJsName(programPath);
    }

    public static String getBaseJsPath(String programPath) {
        return DEFAULT_JS_PATH + getJsName(programPath);
    }

    public static String getJsName(String programPath) {
        if (programPath.startsWith("/jsp")) {
            programPath = programPath.substring(4);
        }

        int lastIndex = programPath.lastIndexOf(".");

        return programPath.substring(0, lastIndex) + ".js";
    }

    public static void makeJspAndJsFiles(String programPath) {
        makeJspAndJsFiles(programPath, null);
    }

    public static void makeJspAndJsFiles(String programPath, ClassLoader loader) {
        try {
            loader = getClassLoader(loader);

            String viewName = FilenameUtils.getBaseName(programPath);

            if (StringUtils.isNotEmpty(viewName)) {

                File jspFile = new File(getAbsoluteJspPath(programPath));
                File jsFile = new File(getAbsoluteJsPath(programPath));
                File axbootJsFile = new File(getAbsoluteDefaultJsPath(programPath));

                if (!jspFile.exists()) {
                    write(jspFile, getTemplate("JSPBasicTemplate.tpl", loader).replace("@{programJSPath}", getBaseJsPath(programPath)));
                }

                if (!jsFile.exists() && !axbootJsFile.exists()) {
                    write(jsFile, getTemplate("JSBasicTemplate.tpl", loader));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getTemplate(String name, ClassLoader classLoader) throws IOException {
        return IOUtils.toString(new ClassPathResource("/template/" + name, classLoader).getInputStream(), "UTF-8");
    }

    public static void write(File file, String code) throws IOException {
        if (!file.exists()) {
            FileUtils.forceMkdir(file.getParentFile());
            FileUtils.write(file, code, "UTF-8");
        }
    }

    public static void write(String path, String code) throws IOException {
        write(new File(path), code);
    }

    public static void makeControllerFile(TemplateCode templateCode, String packageName) {
        try {
            write(getAbsoluteControllerPath(packageName, templateCode.name()), templateCode.code());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void makeDomainFile(TemplateCode templateCode, String packageName) {
        try {
            write(getAbsoluteDomainPath(packageName, templateCode.name()), templateCode.code());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void makeDomainResourceFile(TemplateCode templateCode, String packageName) {
        try {
            write(getAbsoluteResoucePath(packageName, templateCode.name()), templateCode.code());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
