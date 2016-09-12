package com.chequer.axboot.admin.parameter;

import com.chequer.axboot.admin.vo.PageableVO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

public class CommonListResponseParams {

    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class ListResponse {

        @JsonProperty("list")
        @NonNull
        List<?> list;

        @NonNull
        private PageableVO page = PageableVO.of(0, 0L, 0, 0);
    }

    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class MapResponse {

        @NonNull
        @JsonProperty("map")
        private Map<String, Object> map;
    }
}
