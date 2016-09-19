package com.chequer.axboot.core.domain.code;

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
public class CommonCodeId implements Serializable {

    @NonNull
    private String groupCd;

    @NonNull
    private String code;
}
