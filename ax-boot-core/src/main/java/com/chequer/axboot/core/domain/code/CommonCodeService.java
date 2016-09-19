package com.chequer.axboot.core.domain.code;

import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;

@Service
public class CommonCodeService extends BaseService<CommonCode, CommonCodeId> {

    private CommonCodeRepository basicCodeRepository;

    @Inject
    public CommonCodeService(CommonCodeRepository basicCodeRepository) {
        super(basicCodeRepository);
        this.basicCodeRepository = basicCodeRepository;
    }

    public List<CommonCode> get(RequestParams requestParams) {
        String groupCd = requestParams.getString("groupCd", "");
        String useYn = requestParams.getString("useYn", "");

        String filter = requestParams.getString("filter");

        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(groupCd)) {
            builder.and(qCommonCode.groupCd.eq(groupCd));
        }

        if (isNotEmpty(useYn)) {
            Types.Used used = Types.Used.get(useYn);
            builder.and(qCommonCode.useYn.eq(used));
        }

        List<CommonCode> commonCodeList = select().from(qCommonCode).where(builder).orderBy(qCommonCode.groupNm.asc(), qCommonCode.sort.asc()).fetch();

        if (isNotEmpty(filter)) {
            commonCodeList = filter(commonCodeList, filter);
        }

        return commonCodeList;

    }

    @Transactional
    public void saveCommonCode(List<CommonCode> basicCodes) {
        save(basicCodes);
    }
}
