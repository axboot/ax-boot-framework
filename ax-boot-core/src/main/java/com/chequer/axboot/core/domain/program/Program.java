package com.chequer.axboot.core.domain.program;

import com.chequer.axboot.core.domain.BaseJpaModel;
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
    private String progCd;

    @Column(name = "PROG_NM", length = 50)
    @NonNull
    private String progNm;

    @Column(name = "PROG_PH", length = 100)
    @NonNull
    private String progPh;

    @Column(name = "TARGET", length = 10)
    private String target = "_self";

    @Column(name = "AUTH_CHECK", length = 1)
    private String authCheck;

    @Column(name = "SCH_AH", length = 1)
    private String schAh;

    @Column(name = "SAV_AH", length = 1)
    private String savAh;

    @Column(name = "EXL_AH", length = 1)
    private String exlAh;

    @Column(name = "DEL_AH", length = 1)
    private String delAh;

    @Column(name = "FN1_AH", length = 1)
    private String fn1Ah;

    @Column(name = "FN2_AH", length = 1)
    private String fn2Ah;

    @Column(name = "FN3_AH", length = 1)
    private String fn3Ah;

    @Column(name = "FN4_AH", length = 1)
    private String fn4Ah;

    @Column(name = "FN5_AH", length = 1)
    private String fn5Ah;

    @Column(name = "REMARK", length = 200)
    private String remark;

    @Override
    public String getId() {
        return progCd;
    }

}
