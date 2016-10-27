package com.chequer.axboot.initialzr.service;

import com.chequer.axboot.core.utils.DateUtils;
import com.chequer.axboot.core.utils.EncodeUtils;
import com.chequer.axboot.initialzr.domain.ProjectGenerateRequest;
import org.apache.commons.compress.utils.IOUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ProjectGenerator {

    public static final List<String> templateProcessTargetFiles = Arrays.asList(
            "frame.tag",
            "common-code.tag",
            "login.jsp",
            "axboot.json",
            "pom.xml",
            "axboot-common.properties"
    );

    public void generate(ProjectGenerateRequest projectGenerateRequest, HttpServletRequest request, HttpServletResponse response) throws IOException {
        String packageName = projectGenerateRequest.getPackageName();
        String name = projectGenerateRequest.getName();
        String artifactId = projectGenerateRequest.getArtifact();
        String description = projectGenerateRequest.getDescription();
        String groupId = projectGenerateRequest.getGroup();

        String encodedFileName = EncodeUtils.encodeDownloadFileName(name + "_" + DateUtils.getDateYyyyMmddWithoutDash() + ".zip");
        response.setHeader("Content-Disposition", "attachment; filename=" + encodedFileName);
        response.setContentType("application/zip");

        ServletOutputStream outputStream = response.getOutputStream();
        ZipOutputStream zos = new ZipOutputStream(outputStream);

        Map<String, String> values = new HashMap<>();

        String uuid = UUID.randomUUID().toString();

        values.put("package", packageName);
        values.put("basePackage", packageName);
        values.put("domainPackage", packageName + ".domain");
        values.put("name", name);
        values.put("artifactId", artifactId);
        values.put("description", description);
        values.put("groupId", groupId);
        values.put("sessionCookie", uuid);
        values.put("axbootCoreVersion", "2.1.6");

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        Resource[] resources = resolver.getResources("/templates/**");

        for (Resource resource : resources) {
            File file = resource.getFile();

            if (file.isFile()) {
                byte[] bytes = getBytes(file, values);
                String path = getPath(name, packageName, file);

                ZipEntry entry = new ZipEntry(path);
                entry.setSize(bytes.length);
                zos.putNextEntry(entry);
                zos.write(bytes);
            }
        }

        zos.closeEntry();
        IOUtils.closeQuietly(zos);
        outputStream.flush();
    }

    public String getPath(String projectName, String packageName, File file) {
        String baseName = projectName + "/src/main";
        String substract = "/WEB-INF/classes/templates";

        String name = FilenameUtils.getName(file.getName());
        String ext = FilenameUtils.getExtension(file.getName()).toLowerCase();
        String filePath = file.getAbsolutePath();
        String path = filePath.substring(filePath.indexOf(substract) + substract.length());

        if ("java".equals(ext)) {
            path = path.substring(5);
            return baseName + "/java/" + packageName.replace(".", "/") + path;
        }

        if ("pom.xml".equals(name)) {
            return projectName + "/pom.xml";
        }

        return baseName + "/" + path;
    }

    public byte[] getBytes(File file, Map<String, String> values) throws IOException {
        StrSubstitutor strSubstitutor = new StrSubstitutor(values);
        String ext = FilenameUtils.getExtension(file.getName()).toLowerCase();

        if (templateProcessTargetFiles.contains(FilenameUtils.getName(file.getName())) || "java".equals(ext)) {
            String template = FileUtils.readFileToString(file, "UTF-8");
            template = strSubstitutor.replace(template);

            return template.getBytes("UTF-8");
        }

        return IOUtils.toByteArray(new FileInputStream(file));
    }
}
