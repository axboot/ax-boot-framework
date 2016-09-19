package com.chequer.axboot.admin.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/errors")
public class ErrorController {

    @RequestMapping(value = "/404")
    public String notFound() {

        System.out.println("HI");

        return "404";
    }
}
