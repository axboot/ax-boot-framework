package com.chequer.axboot.admin.domain.user.auth.group.menu;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AuthGroupMenuRepository extends JpaRepository<AuthGroupMenu, AuthGroupMenuId> {
	void deleteByGrpAuthCdAndMnuCd(String grpAuthCd, String mnuCd);

	Page<AuthGroupMenu> findByGrpAuthCd(String grpAuthCd, Pageable pageable);

	List<AuthGroupMenu> findByGrpAuthCd(String grpAuthCd);

	void deleteByGrpAuthCd(String grpAuthCd);

	List<AuthGroupMenu> findByMnuCd(String progCd);
}
