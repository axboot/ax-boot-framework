package com.chequer.axboot.admin.domain.code;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import lombok.EqualsAndHashCode;
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
@EqualsAndHashCode(callSuper = true)
@Table(name = "COMMON_CODE_M")
@IdClass(CommonCodeId.class)
@Comment(value = "공통코드")
public class CommonCode extends BaseJpaModel<CommonCodeId> {

    @Id
    @Column(name = "GROUP_CD", length = 50)
    @ColumnPosition(1)
    @Comment(value = "그룹 코드")
    private String groupCd;

    @Column(name = "GROUP_NM", length = 100)
    @ColumnPosition(2)
    @Comment(value = "그룹 명")
    private String groupNm;

    @Id
    @Column(name = "CODE", length = 50)
    @ColumnPosition(3)
    @Comment(value = "코드")
    private String code;

    @Column(name = "CODE_NM", length = 50)
    @ColumnPosition(4)
    @Comment(value = "코드 명")
    private String codeNm;

    @Column(name = "DATA1", length = 100)
    @ColumnPosition(5)
    @Comment(value = "데이터1")
    private String data1;

    @Column(name = "DATA2", length = 100)
    @ColumnPosition(6)
    @Comment(value = "데이터2")
    private String data2;

    @Column(name = "DATA3", length = 100)
    @ColumnPosition(7)
    @Comment(value = "데이터3")
    private String data3;

    @Column(name = "DATA4", precision = 11)
    @ColumnPosition(8)
    @Comment(value = "데이터4")
    private Integer data4;

    @Column(name = "DATA5", precision = 11)
    @ColumnPosition(9)
    @Comment(value = "데이터5")
    private Integer data5;

    @Column(name = "REMARK", length = 200)
    @ColumnPosition(10)
    @Comment(value = "설명")
    private String remark;

    @Column(name = "SORT", precision = 11)
    @ColumnPosition(11)
    @Comment(value = "정렬")
    private Integer sort;

    @Column(name = "USE_YN", length = 1)
    @ColumnPosition(12)
    @Comment(value = "사용여부")
    private String useYn;

    @Override
    public CommonCodeId getId() {
        return CommonCodeId.of(groupCd, code);
    }
}
