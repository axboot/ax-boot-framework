package com.chequer.axboot.admin.domain.sample.child;

import com.chequer.axboot.admin.domain.CrudModel;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ChildSampleVO extends CrudModel {

    private String key;

    private String parentKey;

    private String value;

    private String etc1;

    private String etc2;

    private String etc3;

    public static ChildSampleVO of(ChildSample childSample) {
        return ModelMapperUtils.map(childSample, ChildSampleVO.class);
    }

    public static List<ChildSampleVO> of(List<ChildSample> childSampleList) {
        List<ChildSampleVO> vtoList = new ArrayList<>();

        for (ChildSample object : childSampleList) {
            vtoList.add(of(object));
        }

        return vtoList;
    }
}
