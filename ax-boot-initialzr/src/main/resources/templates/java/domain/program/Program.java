package ${basePackage}.domain.program;

import ${basePackage}.domain.BaseJpaModel;
import com.chequer.axboot.core.annotations.ColumnPosition;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "PROG_M")
public class Program extends BaseJpaModel<String> {

    @Id
    @Column(name = "PROG_CD", length = 50)
    @ColumnPosition(1)
    private String progCd;

    @Column(name = "PROG_NM", length = 50)
    @ColumnPosition(2)
    @NonNull
    private String progNm;

    @Column(name = "PROG_PH", length = 100)
    @ColumnPosition(3)
    @NonNull
    private String progPh;

    @Column(name = "TARGET", length = 10)
    @ColumnPosition(4)
    private String target = "_self";

    @Column(name = "AUTH_CHECK", length = 1)
    @ColumnPosition(5)
    private String authCheck = "Y";

    @Column(name = "SCH_AH", length = 1)
    @ColumnPosition(6)
    private String schAh = "N";

    @Column(name = "SAV_AH", length = 1)
    @ColumnPosition(7)
    private String savAh = "N";

    @Column(name = "EXL_AH", length = 1)
    @ColumnPosition(8)
    private String exlAh = "N";

    @Column(name = "DEL_AH", length = 1)
    @ColumnPosition(9)
    private String delAh = "N";

    @Column(name = "FN1_AH", length = 1)
    @ColumnPosition(10)
    private String fn1Ah = "N";

    @Column(name = "FN2_AH", length = 1)
    @ColumnPosition(11)
    private String fn2Ah = "N";

    @Column(name = "FN3_AH", length = 1)
    @ColumnPosition(12)
    private String fn3Ah = "N";

    @Column(name = "FN4_AH", length = 1)
    @ColumnPosition(13)
    private String fn4Ah = "N";

    @Column(name = "FN5_AH", length = 1)
    @ColumnPosition(14)
    private String fn5Ah = "N";

    @Column(name = "REMARK", length = 200)
    @ColumnPosition(15)
    private String remark;

    @Override
    public String getId() {
        return progCd;
    }

    public static Program of(String progCd, String progNm, String progPh, String target, String authCheck, String schAh, String savAh, String exlAh, String delAh, String fn1Ah, String fn2Ah, String fn3Ah, String fn4Ah, String fn5Ah) {
        Program program = new Program();
        program.setProgCd(progCd);
        program.setProgNm(progNm);
        program.setProgPh(progPh);
        program.setTarget(target);
        program.setAuthCheck(authCheck);
        program.setSchAh(schAh);
        program.setSavAh(savAh);
        program.setExlAh(exlAh);
        program.setDelAh(delAh);
        program.setFn1Ah(fn1Ah);
        program.setFn2Ah(fn2Ah);
        program.setFn3Ah(fn3Ah);
        program.setFn4Ah(fn4Ah);
        program.setFn5Ah(fn5Ah);
        return program;
    }
}
