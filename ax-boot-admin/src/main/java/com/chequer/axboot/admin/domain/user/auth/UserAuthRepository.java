package com.chequer.axboot.admin.domain.user.auth;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, UserAuth.UserAuthId> {

	List<UserAuth> findByUserCd(String userCd);

	Page<UserAuth> findByUserCd(String userCd, Pageable pageable);

	void deleteByUserCd(String userCd);
}
