package com.chequer.axboot.initialzr.controllers;

import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.initialzr.domain.ProjectGenerateRequest;
import com.chequer.axboot.initialzr.service.ProjectGenerator;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("/api/v1/project")
public class ProjectController extends BaseController {

    @Inject
    private ProjectGenerator projectGenerator;

    @GetMapping
    public void getProject(ProjectGenerateRequest projectGenerateRequest, HttpServletRequest request, HttpServletResponse response) throws IOException {
        projectGenerator.generate(projectGenerateRequest, request, response);
    }
}
