package com.chequer.axboot.admin.domain.user;

import com.chequer.axboot.core.mybatis.MyBatisMapper;

import java.util.List;


public interface UserMapper extends MyBatisMapper {

    List<User> findAll();

    User findOne(User user);

    int update(User user);

    int delete(User user);

    int insert(User user);
}
