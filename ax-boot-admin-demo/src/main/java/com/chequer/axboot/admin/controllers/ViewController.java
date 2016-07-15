package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.controllers.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController extends BaseController {

	@RequestMapping(value = "/views/login")
	public String login(ModelMap modelMap) {
		return "login";
	}
}
