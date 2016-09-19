package com.chequer.axboot.core.domain.user.auth.menu;

import com.chequer.axboot.core.annotations.Comment;
import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.domain.BaseJpaModel;
import com.chequer.axboot.core.domain.program.Program;
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
@EqualsAndHashCode(callSuper = true)
@Table(name = "AUTH_GROUP_MAP_M")
@Comment(value = "권한그룹 맵")
@IdClass(AuthGroupMenu.AuthGroupMenuV2Id.class)
public class AuthGroupMenu extends BaseJpaModel<AuthGroupMenu.AuthGroupMenuV2Id> {

    @Id
    @Column(name = "GRP_AUTH_CD", length = 100, nullable = false)
    @Comment(value = "권한그룹코드")
    private String grpAuthCd;

    @Id
    @Column(name = "MENU_ID", length = 50, nullable = false)
    @Comment(value = "메뉴 ID")
    private Long menuId;

    @Column(name = "SCH_AH", length = 1)
    @Comment(value = "조회권한")
    private String schAh = Types.Used.NO.getLabel();

    @Column(name = "SAV_AH", length = 1)
    @Comment(value = "저장권한")
    private String savAh = Types.Used.NO.getLabel();

    @Column(name = "EXL_AH", length = 1)
    @Comment(value = "엑셀권한")
    private String exlAh = Types.Used.NO.getLabel();

    @Column(name = "DEL_AH", length = 1)
    @Comment(value = "삭제권한")
    private String delAh = Types.Used.NO.getLabel();

    @Column(name = "FN1_AH", length = 1)
    @Comment(value = "기능키1권한")
    private String fn1Ah = Types.Used.NO.getLabel();

    @Column(name = "FN2_AH", length = 1)
    @Comment(value = "기능키2권한")
    private String fn2Ah = Types.Used.NO.getLabel();

    @Column(name = "FN3_AH", length = 1)
    @Comment(value = "기능키3권한")
    private String fn3Ah = Types.Used.NO.getLabel();

    @Column(name = "FN4_AH", length = 1)
    @Comment(value = "기능키4권한")
    private String fn4Ah = Types.Used.NO.getLabel();

    @Column(name = "FN5_AH", length = 1)
    @Comment(value = "기능키5권한")
    private String fn5Ah = Types.Used.NO.getLabel();

    @Transient
    private Types.Used useYn;

    public void updateAuthorization(AuthGroupMenu authGroupMenu) {
        this.schAh = positive(this.schAh, authGroupMenu.getSchAh());
        this.savAh = positive(this.savAh, authGroupMenu.getSavAh());
        this.exlAh = positive(this.exlAh, authGroupMenu.getExlAh());
        this.delAh = positive(this.delAh, authGroupMenu.getDelAh());
        this.fn1Ah = positive(this.fn1Ah, authGroupMenu.getFn1Ah());
        this.fn2Ah = positive(this.fn2Ah, authGroupMenu.getFn2Ah());
        this.fn3Ah = positive(this.fn3Ah, authGroupMenu.getFn3Ah());
        this.fn4Ah = positive(this.fn4Ah, authGroupMenu.getFn4Ah());
        this.fn5Ah = positive(this.fn5Ah, authGroupMenu.getFn5Ah());
    }

    public void updateAuthorization(Program program) {
        this.schAh = negative(this.schAh, program.getSchAh());
        this.savAh = negative(this.savAh, program.getSavAh());
        this.exlAh = negative(this.exlAh, program.getExlAh());
        this.delAh = negative(this.delAh, program.getDelAh());
        this.fn1Ah = negative(this.fn1Ah, program.getFn1Ah());
        this.fn2Ah = negative(this.fn2Ah, program.getFn2Ah());
        this.fn3Ah = negative(this.fn3Ah, program.getFn3Ah());
        this.fn4Ah = negative(this.fn4Ah, program.getFn4Ah());
        this.fn5Ah = negative(this.fn5Ah, program.getFn5Ah());
    }

    public String positive(String originValue, String newValue) {
        if (originValue != null && originValue.equals("Y"))
            return originValue;

        if (newValue != null && newValue.equals("Y"))
            return newValue;

        return "N";
    }

    public String negative(String originValue, String newValue) {
        if (originValue != null && originValue.equals("Y"))
            return newValue;

        return "N";
    }

    @Override
    public AuthGroupMenuV2Id getId() {
        return AuthGroupMenuV2Id.of(grpAuthCd, menuId);
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class AuthGroupMenuV2Id implements Serializable {

        @NonNull
        private String grpAuthCd;

        @NonNull
        private Long menuId;

    }
}
