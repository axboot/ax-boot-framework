package com.chequer.axboot.core.vo;

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
	private Integer totalPages;

	@NonNull
	private Long totalElements;

	@NonNull
	private Integer currentPage;

	@NonNull
	private Integer pageSize;

	public static PageableVO of(Page pages) {
		return of(pages.getTotalPages(), pages.getTotalElements(), pages.getNumber(), pages.getSize());
	}
}
