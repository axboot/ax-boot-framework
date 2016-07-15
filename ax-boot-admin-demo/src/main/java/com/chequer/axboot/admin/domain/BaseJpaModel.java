package com.chequer.axboot.admin.domain;

import com.chequer.axboot.admin.domain.user.User;
import com.chequer.axboot.admin.utils.SessionUtils;
import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.domain.CrudModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wordnik.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.domain.Persistable;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@MappedSuperclass
@DynamicInsert
@DynamicUpdate
public abstract class BaseJpaModel<PK extends Serializable> extends CrudModel implements Persistable<PK>, Serializable {

    @Override
    @JsonIgnore
    public boolean isNew() {
        return null == getId();
    }

    @Column(name = "INS_DT", updatable = false)
    @ColumnPosition(Integer.MAX_VALUE - 10)
    @ApiModelProperty(hidden = true)
    protected LocalDateTime insDt;

    @Column(name = "INS_USER_CD", updatable = false, length = 100)
    @ColumnPosition(Integer.MAX_VALUE - 9)
    @ApiModelProperty(hidden = true)
    protected String insUserCd;

    @Column(name = "UPT_DT")
    @ColumnPosition(Integer.MAX_VALUE - 8)
    @ApiModelProperty(hidden = true)
    protected LocalDateTime uptDt;

    @Column(name = "UPT_USER_CD", length = 100)
    @ColumnPosition(Integer.MAX_VALUE - 7)
    @ApiModelProperty(hidden = true)
    protected String uptUserCd;

    @Transient
    @ApiModelProperty(hidden = true)
    private String insUserNm;

    @Transient
    @ApiModelProperty(hidden = true)
    private String uptUserNm;

    @ManyToOne
    @JoinColumn(name = "INS_USER_CD", referencedColumnName = "USER_CD", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
    @JsonIgnore
    @ApiModelProperty(hidden = true)
    protected User insUser;

    @ManyToOne
    @JoinColumn(name = "UPT_USER_CD", referencedColumnName = "USER_CD", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
    @JsonIgnore
    @ApiModelProperty(hidden = true)
    protected User uptUser;

    @PrePersist
    protected void onPersist() {
        this.insUserCd = uptUserCd = SessionUtils.getCurrentLoginUserCd();
        this.insDt = this.uptDt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        if (StringUtils.isEmpty(this.uptUserCd)) {
            this.uptUserCd = SessionUtils.getCurrentLoginUserCd();
        }
        this.uptDt = LocalDateTime.now();
    }

    @PostLoad
    protected void onLoad() {
        if (insUser != null) {
            insUserNm = insUser.getUserNm();
        }

        if (uptUser != null) {
            uptUserNm = uptUser.getUserNm();
        }
    }
}
