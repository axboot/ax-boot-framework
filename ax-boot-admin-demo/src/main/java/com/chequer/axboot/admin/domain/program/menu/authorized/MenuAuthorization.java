package com.chequer.axboot.admin.domain.program.menu.authorized;

import com.chequer.axboot.core.utils.ContextUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import org.apache.ibatis.type.Alias;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Alias("menuAuthorization")
@Data
public class MenuAuthorization implements Serializable {

    @JsonProperty("_id")
    private String menuCode;

    @JsonProperty("label")
    private String menuName;

    @JsonProperty("target")
    private String target = "_self";

    @JsonProperty("url")
    @Getter(AccessLevel.NONE)
    private String programPath = "#";

    @JsonIgnore
    private String searchAuth;

    @JsonIgnore
    private String saveAuth;

    @JsonIgnore
    private String excelAuth;

    @JsonIgnore
    private String function1Auth;

    @JsonIgnore
    private String function2Auth;

    @JsonIgnore
    private String function3Auth;

    @JsonIgnore
    private String function4Auth;

    @JsonIgnore
    private String function5Auth;

    @JsonIgnore
    private String className;

    @JsonIgnore
    private int menuLevel;

    @JsonIgnore
    private int menuIndex;

    @JsonIgnore
    private String parentMenuCode;

    @JsonIgnore
    private String icon;

    @JsonIgnore
    private String programName;

    @JsonIgnore
    private String remark;

    @JsonProperty("cn")
    private List<MenuAuthorization> child = new ArrayList<>();

    public void addChild(MenuAuthorization menuAuthorization) {
        if (!child.contains(menuAuthorization)) {
            child.add(menuAuthorization);
        } else {
            for (MenuAuthorization childMenu : child) {
                if (childMenu.getMenuCode().equals(menuAuthorization.getMenuCode())) {
                    childMenu.setAuthorization(menuAuthorization);
                    break;
                }
            }
        }
    }

    public String getProgramPath() {
        if (programPath == null || programPath.equals("#")) {
            return "#";
        }

        return ContextUtil.getContext() + programPath;
    }

    public void setAuthorization(MenuAuthorization authorizedMenu) {
        this.searchAuth = getAuthValue(this.searchAuth, authorizedMenu.getSearchAuth());
        this.saveAuth = getAuthValue(this.saveAuth, authorizedMenu.getSaveAuth());
        this.excelAuth = getAuthValue(this.excelAuth, authorizedMenu.getExcelAuth());
        this.function1Auth = getAuthValue(this.function1Auth, authorizedMenu.getFunction1Auth());
        this.function2Auth = getAuthValue(this.function2Auth, authorizedMenu.getFunction2Auth());
        this.function3Auth = getAuthValue(this.function3Auth, authorizedMenu.getFunction3Auth());
        this.function4Auth = getAuthValue(this.function4Auth, authorizedMenu.getFunction4Auth());
        this.function5Auth = getAuthValue(this.function5Auth, authorizedMenu.getFunction5Auth());
    }

    public String getAuthValue(String originValue, String newValue) {
        if (originValue != null && originValue.equals("Y"))
            return originValue;

        if (newValue != null && newValue.equals("Y"))
            return newValue;

        return "N";
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((menuCode == null) ? 0 : menuCode.hashCode());
        result = prime * result + ((menuName == null) ? 0 : menuName.hashCode());
        result = prime * result + ((programPath == null) ? 0 : programPath.hashCode());
        result = prime * result + ((target == null) ? 0 : target.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;

        if (obj == null)
            return false;

        if (getClass() != obj.getClass())
            return false;

        MenuAuthorization menuAuthorization = (MenuAuthorization) obj;

        return Objects.equals(this.getMenuCode(), menuAuthorization.getMenuCode());
    }

}
