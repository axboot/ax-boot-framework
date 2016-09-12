package com.chequer.axboot.admin.domain.notice;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.domain.notice.file.NoticeFile;
import com.chequer.axboot.core.annotations.ColumnPosition;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.List;

@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "NOTICE_M")
@Alias("notice")
public class Notice extends BaseJpaModel<Long> {

    @Id
    @Column(name = "ID", precision = 20)
    @ColumnPosition(1)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TITLE", columnDefinition = "TEXT")
    @ColumnPosition(3)
    private String title;

    @Column(name = "CONTENT", columnDefinition = "TEXT")
    @ColumnPosition(4)
    private String content;

    @Column(name = "ST_DT", length = 8)
    @ColumnPosition(5)
    private String stDt;

    @Column(name = "END_DT", length = 8)
    @ColumnPosition(6)
    private String endDt;

    @Column(name = "POPUP_YN", length = 1)
    @ColumnPosition(7)
    private String popupYn;

    @Column(name = "DISP_YN", length = 1)
    @ColumnPosition(8)
    private String dispYn;

    @OneToMany(mappedBy = "notice")
    private List<NoticeFile> noticeFileList;

    @Override
    public Long getId() {
        return id;
    }
}
