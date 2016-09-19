package com.chequer.axboot.core.converter;

import com.chequer.axboot.core.utils.ModelMapperUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BaseConverter {

    public <T> List<T> convert(List<?> sourceList, Class<T> destinationClass) {
        return sourceList.stream().map(source -> convert(source, destinationClass)).collect(Collectors.toList());
    }

    public <T> T convert(Object source, Class<T> destinationClass) {
        T map = ModelMapperUtils.map(source, destinationClass);
        return map;
    }
}
