package com.chequer.axboot.admin;

import com.chequer.axboot.core.AXBootCoreConfiguration;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SuppressWarnings("SpringJavaAutowiredMembersInspection")
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {AdminApplication.class, AXBootCoreConfiguration.class})
@EnableTransactionManagement(proxyTargetClass = true, mode = AdviceMode.PROXY)
@ActiveProfiles("test")
public class AXBootTestBase {
}
