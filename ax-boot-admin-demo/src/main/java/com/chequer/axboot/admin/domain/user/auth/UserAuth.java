package com.chequer.axboot.admin.domain.user.auth;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.domain.user.User;
import com.chequer.axboot.admin.domain.user.auth.group.AuthGroup;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "USER_AUTH_M")
@IdClass(UserAuth.UserAuthId.class)
@Comment(value = "관리자별 권한 정보")
public class UserAuth extends BaseJpaModel<UserAuth.UserAuthId> {

    @Id
    @Column(name = "USER_CD")
    @ColumnPosition(1)
    @Comment(value = "사용자 코드")
    private String userCd;

    @Id
    @Column(name = "GRP_AUTH_CD")
    @ColumnPosition(2)
    @Comment(value = "권한그룹 코드")
    private String grpAuthCd;

    @Column(name = "REMARK", length = 200)
    @ColumnPosition(3)
    @Comment(value = "설명")
    private String remark;

    @Column(name = "USE_YN", length = 1)
    @ColumnPosition(4)
    @Comment(value = "사용여부")
    private String useYn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_CD", referencedColumnName = "USER_CD", insertable = false, updatable = false, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GRP_AUTH_CD", referencedColumnName = "GRP_AUTH_CD", insertable = false, updatable = false, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private AuthGroup authGroup;

    @Override
    public UserAuthId getId() {
        return UserAuthId.of(userCd, grpAuthCd);
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class UserAuthId implements Serializable {

        @NonNull
        private String userCd;

        @NonNull
        private String grpAuthCd;
    }

}
