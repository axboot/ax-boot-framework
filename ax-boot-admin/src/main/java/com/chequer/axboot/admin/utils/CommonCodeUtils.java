package com.chequer.axboot.admin.utils;

import com.chequer.axboot.admin.domain.code.CommonCode;
import com.chequer.axboot.admin.domain.code.CommonCodeService;
import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.context.AppContextManager;
import com.chequer.axboot.core.parameter.RequestParams;
import com.chequer.axboot.core.utils.JsonUtils;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;

public class CommonCodeUtils {

    public static List<CommonCode> get(String groupCd) {
        RequestParams<CommonCode> requestParams = new RequestParams<>(CommonCode.class);
        requestParams.put("groupCd", groupCd);
        requestParams.put("useYn", AXBootTypes.Used.YES.getLabel());
        return getService().get(requestParams);
    }

    public static Map<String, List<CommonCode>> getAllByMap() {
        RequestParams<CommonCode> requestParams = new RequestParams<>(CommonCode.class);
        requestParams.put("useYn", AXBootTypes.Used.YES.getLabel());
        List<CommonCode> commonCodes = getService().get(requestParams);

        Map<String, List<CommonCode>> commonCodeMap = commonCodes.stream().collect(groupingBy(CommonCode::getGroupCd));

        return commonCodeMap;
    }

    public static String getAllByJson() {
        return JsonUtils.toJson(getAllByMap());
    }


    public static CommonCodeService getService() {
        return AppContextManager.getBean(CommonCodeService.class);
    }
}
