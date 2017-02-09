package com.chequer.axboot.admin.domain.log;

import com.chequer.axboot.admin.AXBootApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.inject.Inject;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = AXBootApplication.class)
public class ErrorLogServiceTest {

    @Inject
    private ErrorLogService errorLogService;

    @Test
    public void test() {
        errorLogService.findAll();
    }
}