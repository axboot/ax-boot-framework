package com.chequer.axboot.core.parameter;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public class RequestParamsArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return RequestParams.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        Type type = parameter.getGenericParameterType();

        RequestParams requestParams;

        if (type instanceof ParameterizedType) {
            ParameterizedType pType = (ParameterizedType) type;
            requestParams = new RequestParams((Class<?>) pType.getActualTypeArguments()[0]);
        } else {
            requestParams = new RequestParams(Object.class);
        }

        requestParams.setParameterMap(webRequest.getParameterMap());
        return requestParams;
    }
}
