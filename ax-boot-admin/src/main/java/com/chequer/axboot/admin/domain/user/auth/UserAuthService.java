package com.chequer.axboot.admin.domain.user.auth;

import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.utils.ArrayUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;

@Service
public class UserAuthService extends BaseService<UserAuth, UserAuth.UserAuthId> {

	private UserAuthRepository userAuthRepository;

	@Inject
	public UserAuthService(UserAuthRepository userAuthRepository) {
		super(userAuthRepository);
		this.userAuthRepository = userAuthRepository;
	}

	public Page<UserAuth> findByUserCd(String userCd, Pageable pageable) {
		return userAuthRepository.findByUserCd(userCd, pageable);
	}

	public List<UserAuth> findByUserCd(String userCd) {
		return userAuthRepository.findByUserCd(userCd);
	}

	@Transactional
	public void deleteAndSave(List<UserAuth> userAuthList) {
		if (!ArrayUtils.isEmpty(userAuthList)) {
			UserAuth userAuth = userAuthList.get(0);
			deleteByUserCd(userAuth.getUserCd());
			save(userAuthList);
		}

	}

	@Transactional
	private void deleteByUserCd(String userCd) {
		userAuthRepository.deleteByUserCd(userCd);
	}
}
