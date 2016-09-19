package com.chequer.axboot.core.session;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.util.concurrent.TimeUnit;

@Component
public class RedisSessionHandler {

    @Inject
    private RedisTemplate<Object, Object> redisTemplate;

    public void set(String key, Object object, long timeout) {
        redisTemplate.opsForValue().set(key, object);
        redisTemplate.expire(key, timeout, TimeUnit.SECONDS);
    }

    public <T> T get(String key, Class<T> clazz) {
        Object value = redisTemplate.opsForValue().get(key);
        try {
            return clazz.cast(value);
        } catch (Exception e) {
            // ignore
        }
        return null;
    }

    public void logout(String token) {
        try {
            redisTemplate.delete(token);
        } catch (Exception e) {
            // ignore
        }
    }
}
