package com.chequer.axboot.admin.domain.user;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	List<User> findByUserType(String userType);

	User findByUserCd(String userCd);
}
