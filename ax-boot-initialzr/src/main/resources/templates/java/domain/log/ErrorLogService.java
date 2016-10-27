package ${basePackage}.domain.log;

import ${basePackage}.domain.BaseService;
import com.chequer.axboot.core.domain.log.AXBootErrorLog;
import com.chequer.axboot.core.domain.log.AXBootErrorLogService;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.Query;


@Service
public class ErrorLogService extends BaseService<ErrorLog, Long> implements AXBootErrorLogService {

    private ErrorLogRepository errorLogRepository;

    @Inject
    public ErrorLogService(ErrorLogRepository errorLogRepository) {
        super(errorLogRepository);
        this.errorLogRepository = errorLogRepository;
    }

    @Override
    public void save(AXBootErrorLog axBootErrorLog) {
        ErrorLog errorLog = ModelMapperUtils.map(axBootErrorLog, ErrorLog.class);
        save(errorLog);
    }

    @Transactional
    public void deleteAllLogs() {
        Query query = em.createNativeQuery("DELETE FROM ERROR_LOG_M");
        query.executeUpdate();
    }

    @Override
    public void deleteLog(Long id) {
        delete(id);
    }
}
