package com.chequer.axboot.admin.domain.notice.file;

import com.chequer.axboot.core.domain.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.io.IOException;


@Service
public class NoticeFileService extends BaseService<NoticeFile, Integer> {

	private NoticeFileRepository noticeFileRepository;

	@Inject
	public NoticeFileService(NoticeFileRepository noticeFileRepository) {
		super(noticeFileRepository);
		this.noticeFileRepository = noticeFileRepository;
	}

	public void saveFiles(Long noticeId, MultipartFile file1, MultipartFile file2) throws IOException {
		if (file1 != null && !StringUtils.isEmpty(file1.getOriginalFilename())) {
			NoticeFile noticeFile = new NoticeFile();
			noticeFile.setNoticeId(noticeId);
			noticeFile.setFileName(file1.getOriginalFilename());
			noticeFile.setFileBlob(file1.getBytes());
			noticeFileRepository.save(noticeFile);
		}

		if (file2 != null && !StringUtils.isEmpty(file2.getOriginalFilename())) {
			NoticeFile noticeFile = new NoticeFile();
			noticeFile.setNoticeId(noticeId);
			noticeFile.setFileName(file2.getOriginalFilename());
			noticeFile.setFileBlob(file2.getBytes());
			noticeFileRepository.save(noticeFile);
		}
	}

	@Transactional
	public NoticeFile findFile(int noticeFileId) {
		return findOne(noticeFileId);
	}
}
