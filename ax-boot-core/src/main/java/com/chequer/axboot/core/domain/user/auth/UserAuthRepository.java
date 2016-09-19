package com.chequer.axboot.core.domain.user.auth;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAuthRepository extends JPAQueryDSLRepository<UserAuth, UserAuthId> {

    List<UserAuth> findByUserCd(String userCd);
}
