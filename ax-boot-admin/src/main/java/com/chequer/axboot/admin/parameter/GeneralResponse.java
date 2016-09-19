package com.chequer.axboot.admin.parameter;

import com.chequer.axboot.core.vo.PageableVO;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.wordnik.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public class GeneralResponse {

    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class ListResponse {

        @JsonProperty("list")
        @NonNull
        @ApiModelProperty(value  = "목록", required = true)
        List<?> list;

        @NonNull
        @ApiModelProperty(value = "페이징 정보", required = true)
        private PageableVO page = PageableVO.of(0, 0L, 0, 0);
    }

    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class MapResponse {

        @NonNull
        @ApiModelProperty(value  = "Map", required = true)
        @JsonProperty("map")
        private Map<String, Object> map;
    }

    @Data
    @NoArgsConstructor
    public static class PageResponse {
        @NonNull
        @JsonProperty("list")
        private List<?> list;

        @NonNull
        private PageableVO page;

        public static PageableResponse.PageResponse of(List<?> content, Page<?> page) {
            PageableResponse.PageResponse pageResponse = new PageableResponse.PageResponse();
            pageResponse.setList(content);
            pageResponse.setPage(PageableVO.of(page));
            return pageResponse;
        }

        public static PageableResponse.PageResponse of(Page<?> page) {
            return of(page.getContent(), page);
        }
    }
}
