package com.chequer.axboot.core.json;

import com.chequer.axboot.core.utils.AgentUtils;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ContentTypeSwitchableMappingJackson2JsonView extends MappingJackson2JsonView {

    private static final String TEXT_PLAIN = "text/plain";

    public ContentTypeSwitchableMappingJackson2JsonView() {
        super();
    }

    @Override
    protected void setResponseContentType(HttpServletRequest request, HttpServletResponse response) {
        if (AgentUtils.isExplorer(request)) {
            response.setContentType(TEXT_PLAIN);
        } else {
            super.setResponseContentType(request, response);
        }
    }
}
