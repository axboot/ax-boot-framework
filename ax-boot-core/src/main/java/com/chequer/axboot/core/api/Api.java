package com.chequer.axboot.core.api;

import com.chequer.axboot.core.utils.JsonUtils;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.*;


public class Api {

    private final RestTemplate template;
    private final Map<String, String> cookies;
    private final HttpServletRequest request;
    private String baseUrl;

    public Api(HttpServletRequest request) {
        this.request = request;
        this.template = new RestTemplate();
        this.cookies = new HashMap<>();

        if (request.getCookies() != null && request.getCookies().length > 0) {
            for (Cookie cookie : request.getCookies()) {
                this.cookies.put(cookie.getName(), cookie.getValue());
            }
        }

        this.baseUrl = String.format("%s://%s:%s%s", request.getScheme(), request.getServerName(), request.getServerPort(), request.getContextPath());
    }

    public Map<String, String> getCookies() {
        return cookies;
    }

    public void setCookie(String key, String value) {
        cookies.put(key, value);
    }

    public <T> T post(String url, Object data, Class<T> clazz) {
        return getObject(HttpMethod.POST, url, data, clazz);
    }

    public <T> T put(String url, Object data, Class<T> clazz) {
        return getObject(HttpMethod.PUT, url, data, clazz);
    }

    public <T> T delete(String url, Object data, Class<T> clazz) {
        return getObject(HttpMethod.DELETE, url, data, clazz);
    }

    public <T> T getString(String url, Class<T> clazz) {
        return getObject(HttpMethod.GET, url, clazz);
    }

    public String getString(String url) {
        try {
            return getObject(HttpMethod.GET, url, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "";
    }

    public void json(String url, String key) {
        try {
            String json = getString(url);
            request.setAttribute(key, json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void object(String url, String key) {
        try {
            String json = getString(url);

            if (json.contains("page") && json.contains("list")) {
                JsonNode jsonNode = JsonUtils.fromJson(json);

                json = jsonNode.findPath("list").toString();
            }

            if (json.startsWith("[") && json.endsWith("]")) {
                List<Map<String, Object>> listMapType = JsonUtils.fromJsonToList(json);
                request.setAttribute(key, listMapType);
            } else {
                Map<String, Object> mapType = JsonUtils.fromJsonToMap(json);
                request.setAttribute(key, mapType);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Map<String, Object>> map(String url) {
        String json = getString(url);

        if (json.contains("page") && json.contains("list")) {
            JsonNode jsonNode = JsonUtils.fromJson(json);

            json = jsonNode.findPath("list").toString();
        }

        if (json.startsWith("[") && json.endsWith("]")) {
            return JsonUtils.fromJsonToList(json);
        }

        return Collections.emptyList();
    }

    public <T> T getObject(HttpMethod method, String url, Class<T> clazz) {
        HttpEntity<T> response = template.exchange(getRequestEntity(method, getUrl(url)), clazz);
        return response.getBody();
    }

    public <T> T getObject(HttpMethod method, String url, Object data, Class<T> clazz) {
        HttpEntity request = new HttpEntity(data, getHeaders());
        HttpEntity<T> response = template.exchange(getUrl(url), method, request, clazz);
        return response.getBody();
    }

    public String getUrl(String url) {
        return baseUrl + url;
    }

    protected String getCookiesString() {
        StringBuilder sb = new StringBuilder();
        if (!cookies.isEmpty()) {
            cookies.entrySet().forEach(entry -> {
                sb.append(entry.getKey());
                sb.append("=");
                sb.append("\"" + entry.getValue() + "\"");
                sb.append("; ");
            });
            sb.deleteCharAt(sb.length() - 1);
        }
        return sb.toString();
    }

    protected RequestEntity getRequestEntity(HttpMethod method, String url) {
        return new RequestEntity(getHeaders(), method, URI.create(url));
    }

    protected MultiValueMap getHeaders() {
        MultiValueMap headers = new HttpHeaders();
        headers.put("Cookie", Arrays.asList(new String[]{getCookiesString()}));
        return headers;
    }
}
