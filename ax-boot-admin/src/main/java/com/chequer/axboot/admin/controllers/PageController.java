package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.domain.program.Program;
import com.chequer.axboot.core.domain.program.ProgramService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

@Controller
public class PageController {

    @Inject
    private ProgramService programService;

    @RequestMapping("/page")
    public ModelAndView page(HttpServletRequest request, @RequestParam String progCd, @RequestParam(required = false) Long menuId) {
        Program program = (Program) request.getAttribute("program");

        if (program == null) {
            program = programService.findOne(progCd);
        }

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName(program.getProgPh());
        return modelAndView;
    }
}
