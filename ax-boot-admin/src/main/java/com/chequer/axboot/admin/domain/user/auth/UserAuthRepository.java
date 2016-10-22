package com.chequer.axboot.admin.domain.user.auth;

import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAuthRepository extends JPAQueryDSLRepository<UserAuth, UserAuthId> {

    List<UserAuth> findByUserCd(String userCd);
}
