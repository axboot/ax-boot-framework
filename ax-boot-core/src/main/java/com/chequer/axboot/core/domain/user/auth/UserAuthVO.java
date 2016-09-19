package com.chequer.axboot.core.domain.user.auth;

import com.chequer.axboot.core.utils.ModelMapperUtils;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Data
@NoArgsConstructor
public class UserAuthVO {

    private String userCd;

    private String userNm;

    private String grpAuthCd;

    private String grpAuthNm;

    private String remark;

    private String useYn;

    public static UserAuthVO of(UserAuth userAuth) {
        UserAuthVO userAuthVTO = ModelMapperUtils.map(userAuth, UserAuthVO.class);

        try {
            //userAuthVTO.setGrpAuthNm(userAuth.getAuthGroup().getGrpAuthNm());
        } catch (Exception e) {
            // ignore
        }

        try {
        } catch (Exception e) {
            // ignore
        }

        return userAuthVTO;
    }

    public static List<UserAuthVO> of(List<UserAuth> userAuthList) {
        return userAuthList.stream().map(userAuth -> of(userAuth)).collect(toList());
    }
}
