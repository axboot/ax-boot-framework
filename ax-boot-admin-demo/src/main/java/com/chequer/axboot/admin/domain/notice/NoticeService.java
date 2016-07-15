package com.chequer.axboot.admin.domain.notice;

import com.chequer.axboot.core.domain.BaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;


@Service
public class NoticeService extends BaseService<Notice, Long> {

	private NoticeRepository noticeRepository;

	@Inject
	public NoticeService(NoticeRepository noticeRepository) {
		super(noticeRepository);
		this.noticeRepository = noticeRepository;
	}

	public void saveNotice(Notice notice) {
		save(notice);
	}

	public Page<Notice> findAllByOrderByInsDtDesc(Pageable pageable) {
		return noticeRepository.findAll(pageable);
	}
}
