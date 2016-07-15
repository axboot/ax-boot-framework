package com.chequer.axboot.admin.parameter;

import com.chequer.axboot.admin.vo.PageableVO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.data.domain.Page;

import java.util.List;

public class PageableResponseParams {

	@Data
	@NoArgsConstructor
	public static class PageResponse {
		@NonNull
		@JsonProperty("list")
		private List<?> list;

		@NonNull
		private PageableVO page;

		public static PageResponse of(List<?> content, Page<?> page) {
			PageResponse pageResponse = new PageResponse();
			pageResponse.setList(content);
			pageResponse.setPage(PageableVO.of(page));
			return pageResponse;
		}

		public static PageResponse of(Page<?> page) {
			return of(page.getContent(), page);
		}
	}
}
