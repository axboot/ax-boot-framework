package com.chequer.axboot.core.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Transient;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaseVO {
	@Transient
	@JsonProperty("__deleted__")
	protected boolean __deleted__;

	@Transient
	@JsonProperty("__created__")
	protected boolean __created__;

	@Transient
	@JsonProperty("__modified__")
	protected boolean __modified__;

	@Transient
	@JsonIgnore
	public boolean isDeleted() {
		return __deleted__;
	}

	@Transient
	@JsonIgnore
	public boolean isCreated() {
		return __created__;
	}

	@Transient
	@JsonIgnore
	public boolean isModified() {
		return __modified__;
	}

	public LocalDateTime createdAt;

	public String createdBy;

	public LocalDateTime updatedAt;

	public String updatedBy;
}
