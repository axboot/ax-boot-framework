package com.chequer.axboot.admin.domain.program.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, String> {
    List<Menu> findByMnuUpCd(String mnuUpCd);

    List<Menu> findAllByOrderByMnuIxAsc();

    List<Menu> findAllByOrderByMnuIxAscMnuLvAsc();

    List<Menu> findAllByOrderByMnuLvAscMnuIxAsc();

    List<Menu> findByUseYnAndMnuLvOrderByMnuLvAscMnuIxAsc(String useYn, Integer mnuLv);

}
