package com.chequer.axboot.admin.domain.user;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "USER_M")
@Alias("user")
@ToString
public class User extends BaseJpaModel<String> {

    @Id
    @Column(name = "USER_CD", length = 20)
    @ColumnPosition(1)
    @Comment(value = "관리자 ID")
    private String userCd;

    @Column(name = "USER_NM", length = 30)
    @ColumnPosition(2)
    @Comment(value = "관리자 명")
    private String userNm;

    @Column(name = "USER_PS", length = 128)
    @ColumnPosition(3)
    @Comment(value = "패스워드")
    private String userPs;

    @Column(name = "USER_TYPE", length = 15)
    @ColumnPosition(4)
    @Comment(value = "관리자 타입")
    private String userType;

    @Column(name = "EMAIL", length = 50)
    @ColumnPosition(5)
    @Comment(value = "이메일")
    private String email;

    @Column(name = "HP_NO", length = 15)
    @ColumnPosition(6)
    @Comment(value = "휴대폰")
    private String hpNo;

    @Column(name = "LAST_LOGIN_AT")
    @ColumnPosition(7)
    @Comment(value = "마지막 로그인 일자")
    private LocalDateTime lastLoginAt;

    @Column(name = "PASSWORD_UPDATED_AT")
    @ColumnPosition(8)
    @Comment(value = "마지막 패스워드 변경 일자")
    private LocalDateTime passwordUpdatedAt;

    @Column(name = "USE_YN", length = 1)
    @ColumnPosition(9)
    @Comment(value = "사용 여부")
    private String useYn;

    @Column(name = "REMARK", length = 200)
    @ColumnPosition(10)
    @Comment(value = "설명")
    private String remark;

    @Override
    public String getId() {
        return userCd;
    }
}
