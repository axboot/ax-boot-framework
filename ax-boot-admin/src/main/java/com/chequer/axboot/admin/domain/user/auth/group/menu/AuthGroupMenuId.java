package com.chequer.axboot.admin.domain.user.auth.group.menu;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@RequiredArgsConstructor(staticName = "of")
public class AuthGroupMenuId implements Serializable {

	@NonNull
	private String grpAuthCd;

	@NonNull
	private String mnuCd;

	public String toString() {
		return String.format("%s-%s", grpAuthCd, mnuCd);
	}
}
