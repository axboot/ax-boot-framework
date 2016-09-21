package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.admin.parameter.PageableResponse;
import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.controllers.BaseController;
import com.chequer.axboot.core.domain.sample.child.ChildSample;
import com.chequer.axboot.core.domain.sample.child.ChildSampleService;
import com.chequer.axboot.core.domain.sample.child.ChildSampleVO;
import com.chequer.axboot.core.domain.sample.parent.ParentSample;
import com.chequer.axboot.core.domain.sample.parent.ParentSampleService;
import com.chequer.axboot.core.domain.sample.parent.ParentSampleVO;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.inject.Inject;
import java.util.List;

@Controller
@RequestMapping(value = "/api/v1/samples")
public class SampleController extends BaseController {

    @Inject
    private ParentSampleService parentService;

    @Inject
    private ChildSampleService childService;

    @RequestMapping(value = "/parent", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public PageableResponse.PageResponse parentList(Pageable pageable) {
        Page<ParentSample> pages = parentService.findAll(pageable);
        return PageableResponse.PageResponse.of(ParentSampleVO.of(pages.getContent()), pages);
    }

    @RequestMapping(value = "/parent", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse parentSave(@RequestBody List<ParentSampleVO> list) {
        List<ParentSample> parentSampleList = ModelMapperUtils.mapList(list, ParentSample.class);
        parentService.save(parentSampleList);
        return ok();
    }

    @RequestMapping(value = "/parent", method = {RequestMethod.DELETE}, produces = APPLICATION_JSON)
    public ApiResponse parentDelete(@RequestParam(value = "key") List<String> keys) {
        parentService.deleteByKeys(keys);
        return ok();
    }

    @RequestMapping(value = "/child", method = RequestMethod.GET, produces = APPLICATION_JSON)
    public PageableResponse.PageResponse childList(@RequestParam(defaultValue = "") String parentKey, Pageable pageable) {
        Page<ChildSample> pages = childService.findByParentKeyWithPaging(parentKey, pageable);
        return PageableResponse.PageResponse.of(ChildSampleVO.of(pages.getContent()), pages);
    }

    @RequestMapping(value = "/child", method = {RequestMethod.POST, RequestMethod.PUT}, produces = APPLICATION_JSON)
    public ApiResponse childSave(@RequestBody List<ChildSampleVO> list) {
        List<ChildSample> childSampleList = ModelMapperUtils.mapList(list, ChildSample.class);
        childService.save(childSampleList);
        return ok();
    }

    @RequestMapping(value = "/child", method = {RequestMethod.DELETE}, produces = APPLICATION_JSON)
    public ApiResponse childDelete(@RequestParam(value = "key") List<String> keys) {
        childService.deleteByKeys(keys);
        return ok();
    }
}
