package com.chequer.axboot.admin.domain.program;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.domain.program.menu.Menu;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.List;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "PROG_M")
@Comment(value = "ASP 프로그램")
public class Program extends BaseJpaModel<String> {

    @Id
    @Column(name = "PROG_CD", length = 50)
    @ColumnPosition(1)
    @Comment(value = "프로그램 코드")
    private String progCd;

    @Column(name = "PROG_NM", length = 50)
    @ColumnPosition(2)
    @Comment(value = "프로그램 명")
    private String progNm;

    @Column(name = "PROG_PH", length = 100)
    @ColumnPosition(3)
    @Comment(value = "프로그램 PATH")
    private String progPh;

    @Column(name = "EXL_AH", length = 1)
    @ColumnPosition(4)
    @Comment(value = "엑셀 권한")
    private String exlAh;

    @Column(name = "FILE_NM", length = 50)
    @ColumnPosition(5)
    @Comment(value = "파일 명")
    private String fileNm;

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

    @Column(name = "SAV_AH", length = 1)
    @ColumnPosition(11)
    @Comment(value = "저장 권한")
    private String savAh;

    @Column(name = "SCH_AH", length = 1)
    @ColumnPosition(12)
    @Comment(value = "조회 권한")
    private String schAh;

    @Column(name = "TARGET", length = 10)
    @ColumnPosition(13)
    @Comment(value = "타겟")
    private String target;

    @Column(name = "USE_YN", length = 1)
    @ColumnPosition(14)
    @Comment(value = "사용여부")
    private String useYn;

    @Column(name = "REMARK", length = 200)
    @ColumnPosition(15)
    @Comment(value = "설명")
    private String remark;

    @OneToMany(targetEntity = Menu.class, mappedBy = "program")
    @JsonIgnore
    private List<Menu> menuList;

    @Override
    public String getId() {
        return progCd;
    }

    public static Program of(String progCd, String progNm, String progPh, String savAh, String schAh, String exlAh, String target, String useYn) {
        Program program = new Program();
        program.setProgCd(progCd);
        program.setProgNm(progNm);
        program.setProgPh(progPh);
        program.setSavAh(savAh);
        program.setSchAh(schAh);
        program.setExlAh(exlAh);
        program.setTarget(target);
        program.setUseYn(useYn);
        return program;
    }
}
