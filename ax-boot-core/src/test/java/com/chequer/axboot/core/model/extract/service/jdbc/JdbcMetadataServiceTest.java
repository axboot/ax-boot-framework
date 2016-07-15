package com.chequer.axboot.core.model.extract.service.jdbc;

import com.chequer.axboot.AXBootTestBase;
import org.junit.Test;

import javax.inject.Inject;

public class JdbcMetadataServiceTest extends AXBootTestBase {

    @Inject
    private JdbcMetadataService jdbcMetadataService;

    @Test
    public void test() {
        jdbcMetadataService.getTables();
    }

}