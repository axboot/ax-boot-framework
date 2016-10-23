package com.chequer.axboot.admin.domain.user;


import com.chequer.axboot.core.domain.base.AXBootJPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends AXBootJPAQueryDSLRepository<User, String> {
}
