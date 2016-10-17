package com.chequer.axboot.core.domain.manual;

import com.chequer.axboot.AXBootTestBase;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.junit.Test;

import javax.inject.Inject;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class ManualServiceTest extends AXBootTestBase {

    @Inject
    private ManualService manualService;

    @Test
    public void test() throws IOException, InvalidFormatException {
        manualService.uploadList("M01", new FileInputStream(new File("/Users/brant/Downloads/manual.xlsx")));
    }

}