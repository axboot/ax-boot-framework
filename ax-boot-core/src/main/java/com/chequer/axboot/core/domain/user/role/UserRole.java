package com.chequer.axboot.core.domain.user.role;

import com.chequer.axboot.core.annotations.Comment;
import com.chequer.axboot.core.domain.BaseJpaModel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;


@Setter
@Getter
@DynamicInsert
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "USER_ROLE_M")
@Comment(value = "사용자 롤")
@Alias("userRole")
public class UserRole extends BaseJpaModel<Long> {

	@Id
	@Column(name = "ID", precision = 19, nullable = false)
	@Comment(value = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "USER_CD", length = 100, nullable = false)
	@Comment(value = "사용자 코드")
	private String userCd;

	@Column(name = "ROLE_CD", length = 100, nullable = false)
	@Comment(value = "롤 코드")
	private String roleCd;

    @Override
    public Long getId() {
        return id;
    }
}
