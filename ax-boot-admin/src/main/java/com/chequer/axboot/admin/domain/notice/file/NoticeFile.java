package com.chequer.axboot.admin.domain.notice.file;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.domain.notice.Notice;
import com.chequer.axboot.core.annotations.ColumnPosition;
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
@Table(name = "NOTICE_FILE_L")
public class NoticeFile extends BaseJpaModel<Long> {

    @Id
    @Column(name = "ID", precision = 20)
    @ColumnPosition(1)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NOTICE_ID", precision = 20)
    @ColumnPosition(2)
    private Long noticeId;

    @Column(name = "FILE_NAME", length = 300)
    @ColumnPosition(3)
    private String fileName;

    @Lob
    @Column(name = "FILE_BLOB", length = 4000)
    @ColumnPosition(4)
    @Basic(fetch = FetchType.LAZY)
    private byte[] fileBlob;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTICE_ID", referencedColumnName = "ID", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
    public Notice notice;

    @Override
    public Long getId() {
        return id;
    }

}
