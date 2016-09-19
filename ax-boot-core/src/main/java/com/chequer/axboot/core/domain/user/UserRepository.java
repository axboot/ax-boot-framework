package com.chequer.axboot.core.domain.user;


import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JPAQueryDSLRepository<User, String> {
}
