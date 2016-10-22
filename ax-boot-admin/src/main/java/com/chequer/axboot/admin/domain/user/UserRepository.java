package com.chequer.axboot.admin.domain.user;


import com.chequer.axboot.admin.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JPAQueryDSLRepository<User, String> {
}
