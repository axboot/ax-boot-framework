package com.chequer.axboot.admin.security;

import com.chequer.axboot.admin.domain.user.LoginUser;
import com.chequer.axboot.admin.domain.user.User;
import com.chequer.axboot.admin.domain.user.UserService;
import com.chequer.axboot.core.code.Params;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDateTime;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    @Inject
    private UserService userService;

    @Override
    @Transactional
    public final LoginUser loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUserCd(username);

        if (user == null) {
            throw new UsernameNotFoundException("사용자 정보를 확인하세요.");
        }

        if (user.getUseYn().equals(Params.N)) {
            throw new UsernameNotFoundException("미사용 처리된 사용자 입니다.");
        }

        LoginUser loginUser = new LoginUser();
        loginUser.setUserCd(user.getUserCd());
        loginUser.setUserNm(user.getUserNm());
        loginUser.setPassword(user.getUserPs());
        loginUser.setUserType(user.getUserType());
        user.setLastLoginAt(LocalDateTime.now());
        user.setUptUserCd(user.getUserCd());

        return loginUser;
    }
}
