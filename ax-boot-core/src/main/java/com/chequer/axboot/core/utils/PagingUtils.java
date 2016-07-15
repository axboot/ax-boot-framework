package com.chequer.axboot.core.utils;

import com.chequer.axboot.core.annotations.Searchable;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.LinkedList;
import java.util.List;

import static java.util.stream.Collectors.toList;

public class PagingUtils {

    private PagingUtils() {
    }

    public static <T> boolean recursionListFilter(List<T> lists, String searchParams) {
        if (lists == null) {
            return false;
        }

        for (T t : lists) {
            if (t instanceof String) {
                String fieldValue = (String) t;
                if (StringUtils.containsIgnoreCase(fieldValue, searchParams)) return true;
            } else {
                try {
                    List<Field> searchableFields = FieldUtils.getAllFieldsList(t.getClass());

                    for (Field field : searchableFields) {
                        field.setAccessible(true);

                        Object fieldValue = field.get(t);

                        if (field.getType() == List.class) {
                            boolean find = recursionListFilter(((List) fieldValue), searchParams);
                            if (find) {
                                return true;
                            }
                        } else {
                            if (fieldValue != null) {
                                String value = fieldValue.toString();

                                if (value.contains(searchParams)) {
                                    return true;
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    public static <T> List<T> filter(List<T> lists, String searchParams) {
        if (StringUtils.isEmpty(searchParams)) {
            return lists;
        }

        return lists.parallelStream()
                .filter(t -> {
                    try {
                        Annotation annotation = t.getClass().getAnnotation(Searchable.class);
                        List<Field> searchableFields = FieldUtils.getAllFieldsList(t.getClass());

                        for (Field field : searchableFields) {

                            if (annotation != null) {
                                if (field.getAnnotation(Searchable.class) == null) continue;
                            }

                            field.setAccessible(true);
                            Object fieldValue = field.get(t);

                            if (field.getType() == List.class) {
                                boolean find = recursionListFilter((List) fieldValue, searchParams);

                                if (find) {
                                    return true;
                                }
                            } else {
                                if (fieldValue != null) {
                                    String value = fieldValue.toString();
                                    if (StringUtils.containsIgnoreCase(value, searchParams)) return true;
                                }
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return false;
                })
                .collect(toList());
    }

    public static <T> Page<T> filterWithPaging(List<T> lists, Pageable pageable, String searchParams) {
        searchParams = EncDecUtils.decode(searchParams);

        List<T> filteredList;
        List<T> pagedList = new LinkedList<>();

        if (StringUtils.isEmpty(searchParams)) {
            filteredList = new LinkedList<>(lists);
        } else {
            filteredList = new LinkedList<>();

            String[] asSearchParams = searchParams.split(",");

            for (String searchParam : asSearchParams) {
                List<T> filterList = filter(lists, searchParam);
                filterList.stream().filter(t -> !filteredList.contains(t)).forEach(filteredList::add);
            }
        }

        int start = pageable.getPageNumber() * pageable.getPageSize();
        int end = start + pageable.getPageSize();

        if (end > filteredList.size()) {
            end = filteredList.size();
        }

        if (start < end) {
            pagedList = filteredList.subList(start, end);
        }

        return new PageImpl<>(pagedList, pageable, filteredList.size());
    }
}
