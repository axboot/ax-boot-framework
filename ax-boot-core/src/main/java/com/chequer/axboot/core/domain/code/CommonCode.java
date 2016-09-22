package com.chequer.axboot.core.domain.code;

import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.code.Types;
import com.chequer.axboot.core.db.type.LabelEnumType;
import com.chequer.axboot.core.db.type.MySQLJSONUserType;
import com.chequer.axboot.core.domain.BaseJpaModel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "COMMON_CODE_M")
@IdClass(CommonCodeId.class)
@TypeDefs({
        @TypeDef(name = "jsonNode", typeClass = MySQLJSONUserType.class, parameters = {@org.hibernate.annotations.Parameter(name = MySQLJSONUserType.CLASS, value = "com.fasterxml.jackson.databind.JsonNode")}),
        @TypeDef(name = "labelEnum", typeClass = LabelEnumType.class, parameters = {@org.hibernate.annotations.Parameter(name = MySQLJSONUserType.CLASS, value = "com.chequer.axboot.core.db.type.LabelEnumType")})
})
public class CommonCode extends BaseJpaModel<CommonCodeId> {

    @Id
    @Column(name = "GROUP_CD", length = 100)
    @NotNull(message = "분류코드를 입력하세요")
    @Size(min = 1, max = 100, message = "분류코드를 100자리 이하로 입력하세요")
    @ColumnPosition(1)
    private String groupCd;

    @Column(name = "GROUP_NM", length = 100)
    @NotNull(message = "그룹명을 입력하세요")
    @Size(min = 1, max = 100, message = "그룹명을 100자리 이하로 입력하세요")
    @ColumnPosition(2)
    private String groupNm;

    @Id
    @Column(name = "CODE", length = 100)
    @NotNull(message = "코드를 입력하세요")
    @Size(min = 1, max = 100, message = "코드를 100자리 이하로 입력하세요")
    @ColumnPosition(3)
    private String code;

    @Column(name = "NAME", length = 50)
    @NotNull(message = "코드명을 입력하세요")
    @Size(min = 1, max = 50, message = "코드명을 50자리 이하로 입력하세요")
    @ColumnPosition(4)
    private String name;

    @Column(name = "SORT", precision = 3)
    @ColumnPosition(5)
    private Integer sort;

    @Column(name = "DATA1", length = 100)
    @ColumnPosition(6)
    private String data1;

    @Column(name = "DATA2", length = 100)
    @ColumnPosition(7)
    private String data2;

    @Column(name = "DATA3", length = 100)
    @ColumnPosition(8)
    private String data3;

    @Column(name = "DATA4", precision = 10)
    @ColumnPosition(9)
    private Integer data4;

    @Column(name = "DATA5", precision = 10)
    @ColumnPosition(10)
    private Integer data5;

    @Column(name = "REMARK", length = 200)
    @ColumnPosition(12)
    private String remark;

    @Column(name = "USE_YN", length = 1)
    @Type(type = "labelEnum")
    @ColumnPosition(13)
    private Types.Used useYn = Types.Used.YES;

    @Override
    public CommonCodeId getId() {
        return CommonCodeId.of(groupCd, code);
    }

    public static CommonCode of(String groupCd, String groupNm, String code, String name, int sort) {
        CommonCode commonCode = new CommonCode();
        commonCode.setGroupCd(groupCd);
        commonCode.setGroupNm(groupNm);
        commonCode.setCode(code);
        commonCode.setName(name);
        commonCode.setSort(sort);
        return commonCode;
    }
}
