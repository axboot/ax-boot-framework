package com.chequer.axboot.core.utils;

import javax.servlet.jsp.tagext.JspTag;
import java.lang.reflect.Field;

public class TagUtils {

    private JspTag jspTag;
    private Class<?> clazz;

    public TagUtils(JspTag jspTag) {
        this.jspTag = jspTag;
        this.clazz = jspTag.getClass();
    }

    public String getParentAttribute(String name) {
        try {
            Field clazzField = clazz.getDeclaredField(name);
            clazzField.setAccessible(true);

            return (String) clazzField.get(jspTag);
        } catch (Exception e) {
            // ignore
        }
        return "";
    }
}
