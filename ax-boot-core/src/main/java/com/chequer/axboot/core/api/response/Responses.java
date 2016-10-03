package com.chequer.axboot.core.api.response;

import com.chequer.axboot.core.json.Views;
import com.chequer.axboot.core.vo.PageableVO;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.wordnik.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public class Responses {

    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class ListResponse {

        @JsonView(Views.Root.class)
        @JsonProperty("list")
        @NonNull
        @ApiModelProperty(value = "목록", required = true)
        List<?> list;

        @NonNull
        @ApiModelProperty(value = "페이징 정보", required = true)
        @JsonView(Views.Root.class)
        PageableVO page = PageableVO.of(0, 0L, 0, 0);
    }

    @Data
    @NoArgsConstructor
    @RequiredArgsConstructor(staticName = "of")
    public static class MapResponse {

        @NonNull
        @ApiModelProperty(value = "Map", required = true)
        @JsonProperty("map")
        @JsonView(Views.Root.class)
        Map<String, Object> map;
    }

    @Data
    @NoArgsConstructor
    public static class PageResponse {
        @NonNull
        @JsonProperty("list")
        @JsonView(Views.Root.class)
        List<?> list;

        @NonNull
        @JsonView(Views.Root.class)
        PageableVO page;

        public static Responses.PageResponse of(List<?> content, Page<?> page) {
            Responses.PageResponse pageResponse = new Responses.PageResponse();
            pageResponse.setList(content);
            pageResponse.setPage(PageableVO.of(page));
            return pageResponse;
        }

        public static Responses.PageResponse of(Page<?> page) {
            return of(page.getContent(), page);
        }
    }
}
