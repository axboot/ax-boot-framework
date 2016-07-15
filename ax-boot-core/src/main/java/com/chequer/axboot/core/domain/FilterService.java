package com.chequer.axboot.core.domain;


import com.chequer.axboot.core.utils.PagingUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class FilterService<T> {
    public boolean recursionListFilter(List<T> lists, String searchParams) {
        return PagingUtils.recursionListFilter(lists, searchParams);
    }

    public List<T> filter(List<T> lists, String searchParams) {
        return PagingUtils.filter(lists, searchParams);
    }

    public Page<T> filterWithPaging(List<T> lists, Pageable pageable, String searchParams) {
        return PagingUtils.filterWithPaging(lists, pageable, searchParams);
    }
}
