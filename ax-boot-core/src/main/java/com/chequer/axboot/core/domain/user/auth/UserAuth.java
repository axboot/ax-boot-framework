package com.chequer.axboot.core.domain.user.auth;

import com.chequer.axboot.core.annotations.Comment;
import com.chequer.axboot.core.domain.BaseJpaModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "USER_AUTH_M")
public class UserAuth extends BaseJpaModel<Long> {

    @Id
    @Column(name = "ID", precision = 19, nullable = false)
    @Comment(value = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "USER_CD")
    private String userCd;

    @Column(name = "GRP_AUTH_CD")
    private String grpAuthCd;

    @Override
    public Long getId() {
        return id;
    }
}
