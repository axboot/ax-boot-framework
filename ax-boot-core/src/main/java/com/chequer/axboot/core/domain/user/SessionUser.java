package com.chequer.axboot.core.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Data
public class SessionUser implements UserDetails {

    private String userCd;

    private String userPs;

    private String userNm;

    private String compCd;

    private String storCd;

    private Locale locale;

    private String timeZone;

    private String menuGrpCd;

    private String dateFormat;

    private String dateTimeFormat;

    private String timeFormat;

    private String menuHash;

    private long expires;

    private Map<String, Object> details = new HashMap<>();

    public String getDetailByString(String key) {
        return getDetail(key) == null ? "" : (String) getDetail(key);
    }

    public Object getDetail(String key) {
        if (details.containsKey(key)) {
            return details.get(key);
        }
        return null;
    }

    public void addDetails(String key, String value) {
        details.put(key, value);
    }

    private List<String> authorityList = new ArrayList<>();

    private List<String> authGroupList = new ArrayList<>();

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> simpleGrantedAuthorities = new ArrayList<>();
        authorityList.forEach(role -> simpleGrantedAuthorities.add(new SimpleGrantedAuthority(role)));
        return simpleGrantedAuthorities;
    }

    public void addAuthority(String role) {
        authorityList.add("ROLE_" + role);
    }

    public boolean hasRole(String role) {
        return authorityList.stream().filter(a -> a.equals("ROLE_" + role)).findAny().isPresent();
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return userPs;
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return userCd;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }

    public void setExpires(long expires) {
        this.expires = expires;
    }

    public void addAuthGroup(String grpAuthCd) {
        authGroupList.add(grpAuthCd);
    }
}
