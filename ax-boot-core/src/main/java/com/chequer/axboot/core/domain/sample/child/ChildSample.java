package com.chequer.axboot.core.domain.sample.child;

import com.chequer.axboot.core.annotations.ColumnPosition;
import com.chequer.axboot.core.domain.SimpleJpaModel;
import lombok.Getter;
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
@Table(name = "CHILD_SAMPLE")
public class ChildSample extends SimpleJpaModel<String> {

	@Id
	@Column(name = "SAMPLE_KEY")
	@ColumnPosition(1)
	private String key;

	@Column(name = "SAMPLE_PARENT_KEY")
	@ColumnPosition(2)
	private String parentKey;

	@Column(name = "SAMPLE_VALUE")
	@ColumnPosition(3)
	private String value;

	@Column(name = "ETC1")
	@ColumnPosition(4)
	private String etc1;

	@Column(name = "ETC2")
	@ColumnPosition(5)
	private String etc2;

	@Column(name = "ETC3")
	@ColumnPosition(6)
	private String etc3;

	@Override
	public String getId() {
		return key;
	}
}
