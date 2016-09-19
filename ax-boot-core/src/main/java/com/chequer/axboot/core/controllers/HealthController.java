package com.chequer.axboot.core.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

	@RequestMapping(value = "/health", produces = "text/plain")
	public String health() {
		return "ok";
	}
}
