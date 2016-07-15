package com.chequer.axboot.core.domain.log;

import com.chequer.axboot.core.domain.BaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.Query;


@Service
public class ErrorLogService extends BaseService<ErrorLog, Long> {

    private ErrorLogRepository errorLogRepository;

    @Inject
    public ErrorLogService(ErrorLogRepository errorLogRepository) {
        super(errorLogRepository);
        this.errorLogRepository = errorLogRepository;
    }

    @Transactional
    public void deleteAllLogs() {
        Query query = em.createNativeQuery("DELETE FROM ERROR_LOG_M");
        query.executeUpdate();
    }
}
