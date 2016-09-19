package com.chequer.axboot.core.utils;

import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.context.AppContextManager;
import com.chequer.axboot.core.domain.code.CommonCode;
import com.chequer.axboot.core.domain.code.CommonCodeService;
import com.chequer.axboot.core.parameter.RequestParams;

import java.util.List;

public class CommonCodeUtils {

    public static List<CommonCode> get(String groupCd) {
        RequestParams<CommonCode> requestParams = new RequestParams<>(CommonCode.class);
        requestParams.put("groupCd", groupCd);
        requestParams.put("useYn", Types.Used.YES.getLabel());
        return getService().get(requestParams);
    }

    public static CommonCodeService getService() {
        return AppContextManager.getBean(CommonCodeService.class);
    }
}
