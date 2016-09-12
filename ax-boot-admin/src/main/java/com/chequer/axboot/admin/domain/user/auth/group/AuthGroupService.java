package com.chequer.axboot.admin.domain.user.auth.group;

import com.chequer.axboot.core.domain.BaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

@Service
public class AuthGroupService extends BaseService<AuthGroup, String> {

	private AuthGroupRepository authGroupRepository;

	@Inject
	public AuthGroupService(AuthGroupRepository authGroupRepository) {
		super(authGroupRepository);
		this.authGroupRepository = authGroupRepository;
	}

	@Transactional
	@Override
	public void delete(String grpAuthCd) {
		authGroupRepository.delete(grpAuthCd);
	}

}
