package com.chequer.axboot.admin.domain.user.auth;

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
public class UserAuthId implements Serializable {

    @NonNull
    private String userCd;

    @NonNull
    private String grpAuthCd;
}
