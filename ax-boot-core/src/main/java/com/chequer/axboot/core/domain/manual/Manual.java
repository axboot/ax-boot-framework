package com.chequer.axboot.core.domain.manual;

import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import com.chequer.axboot.core.domain.BaseJpaModel;
import com.chequer.axboot.core.domain.file.CommonFile;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;


@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "MANUAL_M")
@Comment(value = "메뉴얼")
@Alias("manual")
public class Manual extends BaseJpaModel<Long> implements Cloneable {

    @Id
    @Column(name = "MANUAL_ID", precision = 19, nullable = false)
    @Comment(value = "메뉴얼 ID")
    @ColumnPosition(1)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long manualId;

    @Column(name = "MANUAL_GRP_CD", length = 100)
    @Comment(value = "메뉴얼 그룹코드")
    @ColumnPosition(2)
    private String manualGrpCd;

    @Column(name = "MANUAL_NM", length = 100)
    @Comment(value = "목차명")
    @ColumnPosition(3)
    @NotNull(message = "목차를 입력하세요")
    private String manualNm;

    @Column(name = "PARENT_ID", precision = 19)
    @Comment(value = "부모 코드")
    @ColumnPosition(4)
    private Long parentId;

    @Column(name = "LEVEL", precision = 10)
    @Comment(value = "레벨")
    @ColumnPosition(5)
    private Integer level;

    @Column(name = "SORT", precision = 10)
    @Comment(value = "정렬")
    @ColumnPosition(6)
    private Integer sort;

    @Column(name = "CONTENT", length = 2147483647)
    @Comment(value = "컨텐츠")
    @ColumnPosition(7)
    private String content;

    @Column(name = "EXTRACTED_CONTENT", length = 2147483647)
    @Comment(value = "컨텐츠")
    @ColumnPosition(8)
    private String extractedContent;

    @Column(name = "MANUAL_KEY", length = 100)
    @Comment(value = "호출 키")
    @ColumnPosition(9)
    private String manualKey;

    @Column(name = "FILE_ID", precision = 20)
    @Comment(value = "파일 ID")
    @ColumnPosition(10)
    private Long fileId;

    @Transient
    private boolean open = false;

    @Transient
    private CommonFile file;

    @Transient
    private List<Manual> children = new ArrayList<>();

    @JsonProperty("name")
    public String label() {
        return manualNm;
    }

    @JsonProperty("id")
    public Long id() {
        return manualId;
    }

    @JsonProperty("open")
    public boolean isOpen() {
        return open;
    }

    public void addChildren(Manual manual) {
        children.add(manual);
    }

    public Manual clone() {
        try {
            Manual menu = (Manual) super.clone();
            menu.setChildren(new ArrayList<>());
            return menu;
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

    @Override
    public Long getId() {
        return manualId;
    }
}
