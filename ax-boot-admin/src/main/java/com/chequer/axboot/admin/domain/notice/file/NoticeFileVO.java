package com.chequer.axboot.admin.domain.notice.file;

import com.chequer.axboot.core.utils.ModelMapperUtils;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Data
@NoArgsConstructor
public class NoticeFileVO {

	private Integer id;

	private Integer noticeId;

	private String fileName;

	public static NoticeFileVO of(NoticeFile noticeFile) {
		NoticeFileVO noticeFileVTO = ModelMapperUtils.map(noticeFile, NoticeFileVO.class);
		return noticeFileVTO;
	}

	public static List<NoticeFileVO> of(List<NoticeFile> noticeFileList) {
		return noticeFileList.stream().map(noticeFile -> of(noticeFile)).collect(toList());
	}
}
