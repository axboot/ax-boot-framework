package com.chequer.axboot.admin.domain.file;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.annotations.Comment;
import com.chequer.axboot.core.code.AXBootTypes;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Type;

import javax.persistence.*;


@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "FILE_L")
@Comment(value = "공통 파일")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@ToString
public class CommonFile extends BaseJpaModel<Long> {
    @Id
    @Column(name = "ID")
    @Comment(value = "ID")
    @ColumnPosition(1)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TARGET_TYPE", length = 50)
    @Comment(value = "타겟 TYPE")
    @ColumnPosition(2)
    private String targetType;

    @Column(name = "TARGET_ID", length = 100)
    @Comment(value = "타겟 ID")
    @ColumnPosition(3)
    private String targetId;

    @Column(name = "FILE_NM", columnDefinition = "TEXT")
    @Comment(value = "실제 파일명")
    @ColumnPosition(4)
    private String fileNm;

    @Column(name = "SAVE_NM", columnDefinition = "TEXT")
    @Comment(value = "저장 파일명")
    @ColumnPosition(5)
    private String saveNm;

    @Column(name = "FILE_TYPE", length = 30)
    @Comment(value = "파일 타입")
    @ColumnPosition(6)
    private String fileType;

    @Column(name = "EXTENSION", length = 10)
    @Comment(value = "확장자")
    @ColumnPosition(7)
    private String extension;

    @Column(name = "FILE_SIZE")
    @Comment(value = "파일 크기")
    @ColumnPosition(8)
    private Long fileSize;

    @Column(name = "DEL_YN", length = 1)
    @Comment(value = "삭제여부")
    @Type(type = "labelEnum")
    @ColumnPosition(9)
    private AXBootTypes.Deleted delYn = AXBootTypes.Deleted.NO;

    @Column(name = "FILE_DESC", columnDefinition = "TEXT")
    @Comment(value = "설명")
    @ColumnPosition(10)
    private String desc;

    @Column(name = "SORT")
    @Comment(value = "정렬")
    @ColumnPosition(11)
    private Integer sort;

    @JsonIgnore
    @Transient
    private String _preview;

    @JsonIgnore
    @Transient
    private String _thumbnail;

    @JsonIgnore
    @Transient
    private String _download;

    @JsonProperty("preview")
    public String preview() {
        if (StringUtils.isEmpty(_preview)) {
            return "/api/v1/files/preview?id=" + getId();
        }
        return _preview;
    }

    @JsonProperty("thumbnail")
    public String thumbnail() {
        if (StringUtils.isEmpty(_thumbnail)) {
            return "/api/v1/files/thumbnail?id=" + getId();
        }
        return _thumbnail;
    }

    @JsonProperty("download")
    public String download() {
        if (StringUtils.isEmpty(_download)) {
            return "/api/v1/files/download?id=" + getId();
        }
        return _download;
    }

    @Transient
    public String getThumbnailFileName() {
        return FilenameUtils.getBaseName(getSaveNm()) + "-thumbnail" + "." + FilenameUtils.getExtension(getSaveNm());
    }

    @Override
    public Long getId() {
        return id;
    }
}
