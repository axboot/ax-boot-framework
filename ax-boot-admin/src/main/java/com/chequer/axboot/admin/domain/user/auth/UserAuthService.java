package com.chequer.axboot.admin.domain.user.auth;

import com.chequer.axboot.admin.domain.BaseService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

@Service
public class UserAuthService extends BaseService<UserAuth, UserAuthId> {

    private UserAuthRepository userAuthRepository;

    @Inject
    public UserAuthService(UserAuthRepository userAuthRepository) {
        super(userAuthRepository);
        this.userAuthRepository = userAuthRepository;
    }

    public List<UserAuth> get(RequestParams requestParams) {
        String userCd = requestParams.getString("userCd", "");
        String filter = requestParams.getString("filter", "");

        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(userCd)) {
            builder.and(qUserAuth.userCd.eq(userCd));
        }

        List<UserAuth> list = select().from(qUserAuth).where(builder).orderBy(qUserAuth.id.asc()).fetch();

        if (isNotEmpty(filter)) {
            list = filter(list, filter);
        }

        return list;
    }

    public List<UserAuth> findByUserCd(String userCd) {
        return userAuthRepository.findByUserCd(userCd);
    }
}