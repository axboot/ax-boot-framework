package com.chequer.axboot.initialzr.resolver;

import com.chequer.axboot.initialzr.domain.ProjectGenerateRequest;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class ProjectGenerateRequestArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return ProjectGenerateRequest.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        ProjectGenerateRequest projectCreateRequest = new ProjectGenerateRequest();

        projectCreateRequest.setArtifact(webRequest.getParameter("artifactId"));
        projectCreateRequest.setGroupId(webRequest.getParameter("groupId"));
        projectCreateRequest.setDescription(webRequest.getParameter("description"));
        projectCreateRequest.setPackageName(webRequest.getParameter("packageName"));
        projectCreateRequest.setProjectName(webRequest.getParameter("projectName"));

        return projectCreateRequest;
    }
}
