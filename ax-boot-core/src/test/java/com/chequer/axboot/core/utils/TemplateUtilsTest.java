package com.chequer.axboot.core.utils;

import org.junit.Test;

import static org.junit.Assert.*;

public class TemplateUtilsTest {


    @Test
    public void test() {
        String path = "/jsp/login.jsp";

        if (path.startsWith("/jsp")) {
            path = path.substring(4);
        }

        int lastIndex = path.lastIndexOf("/");

        System.out.print(path);
    }

    @Test
    public void test2() {
        String path = "/jsp/test/test.jsp";

        if (path.startsWith("/jsp")) {
            path = path.substring(4);
        }

        int lastIndex = path.lastIndexOf(".");

        System.out.print(path.substring(0, lastIndex) + ".js");
    }
}