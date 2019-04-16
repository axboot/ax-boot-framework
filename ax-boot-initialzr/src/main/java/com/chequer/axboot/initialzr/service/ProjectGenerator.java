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
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ProjectGenerator {

    public void generate(ProjectGenerateRequest projectGenerateRequest, HttpServletRequest request, HttpServletResponse response) throws IOException {
        String packageName = projectGenerateRequest.getPackageName().trim();
        String projectName = projectGenerateRequest.getProjectName().trim();
        String artifactId = projectGenerateRequest.getArtifact().trim();
        String description = projectGenerateRequest.getDescription().trim();
        String groupId = projectGenerateRequest.getGroupId().trim();

        String encodedFileName = EncodeUtils.encodeDownloadFileName(artifactId + "_" + DateUtils.getDateYyyyMmddWithoutDash() + ".zip");
        response.setHeader("Content-Disposition", "attachment; filename=" + encodedFileName);
        response.setContentType("application/zip");

        try (
            ServletOutputStream outputStream = response.getOutputStream();
            ZipOutputStream zos = new ZipOutputStream(outputStream)
        ) {
            Map<String, String> values = new HashMap<>();

            String uuid = UUID.randomUUID().toString();

            values.put("package", packageName);
            values.put("basePackage", packageName);
            values.put("domainPackage", packageName + ".domain");
            values.put("projectName", projectName);
            values.put("artifactId", artifactId);
            values.put("description", description);
            values.put("groupId", groupId);
            values.put("sessionCookie", uuid);
            values.put("axbootCoreVersion", "2.2.0");

            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

            Resource[] resources = resolver.getResources("/templates/**");

            for (Resource resource : resources) {
                File file = resource.getFile();

                if (file.isFile()) {
                    byte[] bytes = getBytes(file, values);
                    String path = getPath(artifactId, packageName, file);

                    ZipEntry entry = new ZipEntry(path);
                    entry.setSize(bytes.length);
                    zos.putNextEntry(entry);
                    zos.write(bytes);
                }
            }
        }
    }

    public String getPath(String projectName, String packageName, File file) {
        String baseName = projectName + "/src/main";
        String substract = "/classes/templates";

        String ext = FilenameUtils.getExtension(file.getName()).toLowerCase();
        String filePath = file.getAbsolutePath();
        String path = filePath.substring(filePath.indexOf(substract) + substract.length());

        if ("java".equals(ext)) {
            path = path.substring(5);
            return baseName + "/java/" + packageName.replace(".", "/") + path;
        }

        if (path.startsWith("/root")) {
            return projectName + "/" + path.substring(6);
        }

        return baseName + path;
    }

    private byte[] getBytes(File file, Map<String, String> values) throws IOException {
        String ext = FilenameUtils.getExtension(file.getName()).toLowerCase();

        if (ext.equals("jsp") ||
                ext.equals("java") ||
                ext.equals("xml") ||
                ext.equals("properties") ||
                ext.equals("json") ||
                ext.equals("css") ||
                ext.equals("scss") ||
                ext.equals("txt") ||
                ext.equals("js") ||
                ext.equals("tag") ||
                ext.equals("html")) {
            StrSubstitutor strSubstitutor = new StrSubstitutor(values);

            String template = FileUtils.readFileToString(file, "UTF-8");
            template = strSubstitutor.replace(template);

            return template.getBytes(StandardCharsets.UTF_8);
        }
        return IOUtils.toByteArray(new FileInputStream(file));
    }
}
