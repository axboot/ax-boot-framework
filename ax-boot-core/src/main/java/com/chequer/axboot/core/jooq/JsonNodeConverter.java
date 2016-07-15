package com.chequer.axboot.core.jooq;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.NullNode;
import org.jooq.Converter;

import java.io.IOException;

public class JsonNodeConverter implements Converter<Object, JsonNode> {
    @Override
    public JsonNode from(Object t) {
        try {
            return t == null
                    ? NullNode.instance
                    : new ObjectMapper().readTree(t + "");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Object to(JsonNode u) {
        try {
            return u == null || u.equals(NullNode.instance)
                    ? null
                    : new ObjectMapper().writeValueAsString(u);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Class<Object> fromType() {
        return Object.class;
    }

    @Override
    public Class<JsonNode> toType() {
        return JsonNode.class;
    }
}
