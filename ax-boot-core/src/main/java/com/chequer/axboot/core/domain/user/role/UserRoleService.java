package com.chequer.axboot.core.domain.user.role;

import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

@Service
public class UserRoleService extends BaseService<UserRole, Long> {
    private UserRoleRepository userRoleRepository;

    @Inject
    public UserRoleService(UserRoleRepository userRoleRepository) {
        super(userRoleRepository);
        this.userRoleRepository = userRoleRepository;
    }

    public List<UserRole> findByUserCd(String userCd) {
        return userRoleRepository.findByUserCd(userCd);
    }

    public List<UserRole> get(RequestParams requestParams) {
        String userCd = requestParams.getString("userCd", "");
        String filter = requestParams.getString("filter", "");

        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(userCd)) {
            builder.and(qUserRole.userCd.eq(userCd));
        }

        List<UserRole> list = select().from(qUserRole).where(builder).orderBy(qUserRole.id.asc()).fetch();

        if (isNotEmpty(filter)) {
            list = filter(list, filter);
        }

        return list;
    }
}
