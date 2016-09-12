package com.chequer.axboot.admin.domain.user;

import com.chequer.axboot.admin.utils.SessionUtils;
import com.chequer.axboot.core.code.Params;
import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.utils.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class UserService extends BaseService<User, String> {

    private UserRepository userRepository;

    @Inject
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Inject
    public UserService(UserRepository userRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    public void updateUser(List<User> users) {
        if (!ArrayUtils.isEmpty(users)) {
            for (User user : users) {

                User originalUser = userRepository.findOne(user.getUserCd());

                if (originalUser != null) {
                    if (!StringUtils.isEmpty(user.getUserPs())) {
                        user.setPasswordUpdatedAt(LocalDateTime.now());
                        user.setUserPs(bCryptPasswordEncoder.encode(user.getUserPs()));
                    } else {
                        user.setPasswordUpdatedAt(originalUser.getPasswordUpdatedAt());
                        user.setUserPs(originalUser.getUserPs());
                    }
                } else {
                    user.setUserPs(bCryptPasswordEncoder.encode(user.getUserPs()));
                }
                save(user);
            }
        }
    }

    public List<User> findByUserTypeAndUserCd(String userType, String userCd) {
        List<Predicate> predicates = new ArrayList<>();

        CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
        CriteriaQuery criteriaQuery = criteriaBuilder.createQuery();

        Root user = criteriaQuery.from(User.class);

        if (!StringUtils.isEmpty(userType)) {
            predicates.add(criteriaBuilder.equal(user.get(Params.USER_TYPE), userType));
        }

        if (!StringUtils.isEmpty(userCd)) {
            predicates.add(criteriaBuilder.equal(user.get(Params.USER_CD), userCd));
        }

        criteriaQuery = criteriaQuery.select(user).where(predicates.toArray(new Predicate[]{})).orderBy(criteriaBuilder.asc(user.get(Params.USER_CD)));

        return em.createQuery(criteriaQuery).getResultList();
    }

    @Transactional
    public void updateMyInfo(User user) {
        User existUser = findOne(SessionUtils.getCurrentLoginUserCd());

        existUser.setEmail(user.getEmail());

        if (!StringUtils.isEmpty(user.getUserPs())) {
            existUser.setUserPs(bCryptPasswordEncoder.encode(user.getUserPs()));
            existUser.setPasswordUpdatedAt(LocalDateTime.now());
        }

        existUser.setUserNm(user.getUserNm());
        existUser.setHpNo(user.getHpNo());

        save(existUser);
    }

    public User findByUserCd(String userCd) {
        return userRepository.findByUserCd(userCd);
    }
}
