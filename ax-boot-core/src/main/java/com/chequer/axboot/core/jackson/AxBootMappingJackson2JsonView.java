package com.chequer.axboot.core.jackson;

import com.chequer.axboot.core.utils.AgentUtils;
import eu.bitwalker.useragentutils.Browser;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AxBootMappingJackson2JsonView extends MappingJackson2JsonView {

	private static final String TEXT_PLAIN = "text/plain";

	public AxBootMappingJackson2JsonView() {
		super();
	}

	@Override
	protected void setResponseContentType(HttpServletRequest request, HttpServletResponse response) {
		Browser browser = AgentUtils.getBrowser(request);

		if (browser != null && browser.getGroup() == Browser.IE) {
			response.setContentType(TEXT_PLAIN);
		} else {
			super.setResponseContentType(request, response);
		}
	}
}
