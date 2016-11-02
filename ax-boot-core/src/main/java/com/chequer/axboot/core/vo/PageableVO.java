package com.chequer.axboot.core.vo;

import com.chequer.axboot.core.json.Views;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@NoArgsConstructor
@RequiredArgsConstructor(staticName = "of")
public class PageableVO {

	@NonNull
	@JsonView(value = Views.Root.class)
	private Integer totalPages;

	@NonNull
	@JsonView(value = Views.Root.class)
	private Long totalElements;

	@NonNull
	@JsonView(value = Views.Root.class)
	private Integer currentPage;

	@NonNull
	@JsonView(value = Views.Root.class)
	private Integer pageSize;

	public static PageableVO of(Page pages) {
		return of(pages.getTotalPages(), pages.getTotalElements(), pages.getNumber(), pages.getSize());
	}
}
