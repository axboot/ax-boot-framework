package com.chequer.axboot.admin.domain.user.auth.group;

import com.chequer.axboot.admin.domain.BaseJpaModel;
import com.chequer.axboot.admin.domain.user.auth.group.menu.AuthGroupMenu;
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
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "AUTH_GRP_M")
@Comment(value = "관리자 권한 그룹")
public class AuthGroup extends BaseJpaModel<String> {

	private static final long serialVersionUID = -8354738561307166550L;

	@Id
	@Column(name = "GRP_AUTH_CD", length = 10)
	@ColumnPosition(1)
	@Comment(value = "권한그룹 코드")
	private String grpAuthCd;

	@Column(name = "GRP_AUTH_NM", length = 50)
	@ColumnPosition(2)
	@Comment(value = "권한그룹 명")
	private String grpAuthNm;

	@Column(name = "REMARK", length = 200)
	@ColumnPosition(3)
	@Comment(value = "설명")
	private String remark;

	@OneToMany(mappedBy = "authGroup", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<AuthGroupMenu> authGroupMenus;

	@Override
	public String getId() {
		return grpAuthCd;
	}
}