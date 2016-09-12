package com.chequer.axboot.admin.domain.program.menu;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.domain.program.Program;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "MNU_M")
@Comment(value = "ASP 메뉴")
@Alias("menu")
public class Menu extends BaseJpaModel<String> {

    public static final String ROOT = "__root__";

    @Id
    @Column(name = "MNU_CD", length = 50)
    @ColumnPosition(1)
    @Comment(value = "메뉴 코드")
    private String mnuCd;

    @Column(name = "ICON", length = 100)
    @ColumnPosition(2)
    @Comment(value = "아이콘")
    private String icon;

    @Column(name = "MNU_IX", precision = 11)
    @ColumnPosition(3)
    @Comment(value = "순서")
    private Integer mnuIx;

    @Column(name = "MNU_LV", precision = 11)
    @ColumnPosition(4)
    @Comment(value = "레벨")
    private Integer mnuLv;

    @Column(name = "MNU_NM", length = 50)
    @ColumnPosition(5)
    @Comment(value = "메뉴 이름")
    private String mnuNm;

    @Column(name = "MNU_UP_CD", length = 50)
    @ColumnPosition(6)
    @Comment(value = "상위 메뉴 코드")
    private String mnuUpCd;

    @Column(name = "PROG_CD", length = 50)
    @ColumnPosition(7)
    @Comment(value = "프로그램 코드")
    private String progCd;

    @Column(name = "REMARK", length = 200)
    @ColumnPosition(8)
    @Comment(value = "설명")
    private String remark;

    @Column(name = "USE_YN", length = 1)
    @ColumnPosition(9)
    @Comment(value = "사용여부")
    private String useYn;

    @org.hibernate.annotations.ForeignKey(name = "none")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns(
            value = {
                    @JoinColumn(name = "PROG_CD", referencedColumnName = "PROG_CD", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
            }
            , foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT)
    )
    private Program program;

    @Override
    public String getId() {
        return mnuCd;
    }

    public static Menu of(String mnuCd, int mnuIx, int mnuLv, String mnuNm, String mnuUpCd, String progCd, String useYn) {
        Menu menu = new Menu();
        menu.setMnuCd(mnuCd);
        menu.setMnuIx(mnuIx);
        menu.setMnuLv(mnuLv);
        menu.setMnuNm(mnuNm);
        menu.setMnuUpCd(mnuUpCd);
        menu.setProgCd(progCd);
        menu.setUseYn(useYn);
        return menu;
    }
}
