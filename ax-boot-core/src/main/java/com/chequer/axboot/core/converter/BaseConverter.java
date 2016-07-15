package com.chequer.axboot.core.converter;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BaseConverter {

	@Inject
	protected ModelMapper modelMapper;

	public <T> List<T> convert(List<?> sourceList, Class<T> destinationClass) {
		return sourceList.stream().map(source -> convert(source, destinationClass)).collect(Collectors.toList());
	}

	public <T> T convert(Object source, Class<T> destinationClass) {
		T map = modelMapper.map(source, destinationClass);
		return map;
	}
}
