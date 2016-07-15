package com.chequer.axboot.admin.domain.user.auth.group.menu;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.domain.program.menu.Menu;
import com.chequer.axboot.admin.domain.user.auth.group.AuthGroup;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
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
@Table(name = "GRP_AUTH_M")
@IdClass(AuthGroupMenuId.class)
@Comment(value = "관리자별 권한 그룹 맵핑")
public class AuthGroupMenu extends BaseJpaModel<AuthGroupMenuId> {

    private static final long serialVersionUID = 910916830934464458L;

    @Id
    @Column(name = "GRP_AUTH_CD", length = 10)
    @ColumnPosition(1)
    @Comment(value = "권한 그룹 코드")
    private String grpAuthCd;

    @Id
    @Column(name = "MNU_CD", length = 50)
    @ColumnPosition(2)
    @Comment(value = "메뉴코드")
    private String mnuCd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GRP_AUTH_CD", referencedColumnName = "GRP_AUTH_CD", insertable = false, updatable = false, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private AuthGroup authGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MNU_CD", referencedColumnName = "MNU_CD", insertable = false, updatable = false, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private Menu menu;

    @Column(name = "SCH_AH", length = 1)
    @ColumnPosition(3)
    @Comment(value = "조회권한")
    private String schAh;

    @Column(name = "SAV_AH", length = 1)
    @ColumnPosition(4)
    @Comment(value = "저장권한")
    private String savAh;

    @Column(name = "EXL_AH", length = 1)
    @ColumnPosition(5)
    @Comment(value = "엑셀권한")
    private String exlAh;

    @Column(name = "FN1_AH", length = 1)
    @ColumnPosition(6)
    @Comment(value = "추가기능1 권한")
    private String fn1Ah;

    @Column(name = "FN2_AH", length = 1)
    @ColumnPosition(7)
    @Comment(value = "추가기능2 권한")
    private String fn2Ah;

    @Column(name = "FN3_AH", length = 1)
    @ColumnPosition(8)
    @Comment(value = "추가기능3 권한")
    private String fn3Ah;

    @Column(name = "FN4_AH", length = 1)
    @ColumnPosition(9)
    @Comment(value = "추가기능4 권한")
    private String fn4Ah;

    @Column(name = "FN5_AH", length = 1)
    @ColumnPosition(10)
    @Comment(value = "추가기능5 권한")
    private String fn5Ah;

    @Override
    public AuthGroupMenuId getId() {
        return AuthGroupMenuId.of(grpAuthCd, mnuCd);
    }

    @Override
    public boolean equals(Object object) {
        if (object != null && object instanceof AuthGroupMenu) {
            AuthGroupMenu authGroupMenu = (AuthGroupMenu) object;
            if (authGroupMenu.getId().equals(this.getId())) {
                return true;
            }
        }
        return false;
    }

    public static AuthGroupMenu of(String grpAuthCd, String mnuCd, String fn1Ah, String fn2Ah, String fn3Ah, String fn4Ah, String fn5Ah, String schAh, String savAh, String exlAh) {
        AuthGroupMenu authGroupMenu = new AuthGroupMenu();
        authGroupMenu.setGrpAuthCd(grpAuthCd);
        authGroupMenu.setMnuCd(mnuCd);
        authGroupMenu.setFn1Ah(fn1Ah);
        authGroupMenu.setFn2Ah(fn2Ah);
        authGroupMenu.setFn3Ah(fn3Ah);
        authGroupMenu.setFn4Ah(fn4Ah);
        authGroupMenu.setFn5Ah(fn5Ah);
        authGroupMenu.setSchAh(schAh);
        authGroupMenu.setSavAh(savAh);
        authGroupMenu.setExlAh(exlAh);

        return authGroupMenu;
    }
}
