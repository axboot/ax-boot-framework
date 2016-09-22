package com.chequer.axboot;

import com.chequer.axboot.core.AXBootCoreConfiguration;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {AXBootCoreConfiguration.class})
@EnableTransactionManagement(proxyTargetClass = true, mode = AdviceMode.PROXY)
@ActiveProfiles("dirToManualList")
public abstract class AXBootTestBase {

}
