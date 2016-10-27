package ${basePackage}.domain.sample.parent;

import ${basePackage}.domain.SimpleJpaModel;
import com.chequer.axboot.core.annotations.ColumnPosition;
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
@Table(name = "PARENT_SAMPLE")
public class ParentSample extends SimpleJpaModel<String> {

	@Id
	@Column(name = "SAMPLE_KEY")
	@ColumnPosition(1)
	private String key;

	@Column(name = "SAMPLE_VALUE")
	@ColumnPosition(2)
	private String value;

	@Column(name = "ETC1")
	@ColumnPosition(3)
	private String etc1;

	@Column(name = "ETC2")
	@ColumnPosition(4)
	private String etc2;

	@Column(name = "ETC3")
	@ColumnPosition(5)
	private String etc3;

	@Column(name = "ETC4")
	@ColumnPosition(6)
	private String etc4;

	@Override
	public String getId() {
		return key;
	}
}
