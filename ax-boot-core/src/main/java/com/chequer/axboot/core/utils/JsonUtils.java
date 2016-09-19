package com.chequer.axboot.core.utils;


import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.collect.Maps;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JsonUtils {
    private final ObjectMapper mapper;

    private JsonUtils() {
        mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(MapperFeature.AUTO_DETECT_GETTERS, true);
        mapper.configure(MapperFeature.AUTO_DETECT_IS_GETTERS, true);
        mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
        mapper.configure(MapperFeature.DEFAULT_VIEW_INCLUSION, false);
        mapper.registerModule(new JavaTimeModule());
    }

    public static JsonUtils getInstance() {
        return new JsonUtils();
    }

    private static ObjectMapper getMapper() {
        return getInstance().mapper;
    }

    public static String toJson(Object object) {
        try {
            return getMapper().writeValueAsString(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T fromJson(String jsonStr, Class<T> cls) {
        try {
            return getMapper().readValue(jsonStr, cls);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static String toPrettyJson(Object object) {
        try {
            ObjectMapper objectMapper = getMapper();
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            return objectMapper.writeValueAsString(object);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static String toPrettyJson(String json) {
        Object jsonObject = JsonUtils.fromJson(json, Object.class);
        try {
            return getMapper().writerWithDefaultPrettyPrinter().writeValueAsString(jsonObject);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String toListJson(Object object) {
        try {
            Map<String, Object> map = Maps.newHashMap();
            map.put("list", object);

            return getMapper().writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T fromJsonToMap(String jsonStr) {
        try {
            return getMapper().readValue(jsonStr, new TypeReference<HashMap<String, Object>>() {
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T fromJson(String jsonStr, TypeReference<T> typeReference) {
        try {
            return getMapper().readValue(jsonStr, typeReference);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static JsonNode fromJson(String json) {
        try {
            return getMapper().readTree(json);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public static JsonNode fromJson(Object object) {
        try {
            return getMapper().convertValue(object, JsonNode.class);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public static <T extends Collection> T fromJson(String jsonStr, CollectionType collectionType) {
        try {
            return getMapper().readValue(jsonStr, collectionType);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static List<Map<String, Object>> fromJsonToList(String jsonStr) {
        try {
            return fromJson(jsonStr, new TypeReference<List<Map<String, Object>>>() {
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
