package com.chequer.axboot.admin.domain.notice;

import com.chequer.axboot.admin.domain.notice.file.NoticeFileVO;
import com.chequer.axboot.core.utils.ArrayUtils;
import com.chequer.axboot.core.utils.ModelMapperUtils;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Data
@NoArgsConstructor
public class NoticeVO {

    private Integer id;

    private String title;

    private String content;

    private String stDt;

    private String endDt;

    private String popupYn;

    private String dispYn;

    private List<NoticeFileVO> files = new ArrayList<>();

    private LocalDateTime insDt;

    private String insUserCd;

    private String insUserNm;

    private LocalDateTime uptDt;

    private String uptUserCd;

    private String uptUserNm;

    public static NoticeVO of(Notice notice) {
        NoticeVO noticeVTO = ModelMapperUtils.map(notice, NoticeVO.class);

        if (!ArrayUtils.isEmpty(notice.getNoticeFileList())) {
            noticeVTO.getFiles().addAll(NoticeFileVO.of(notice.getNoticeFileList()));
        }

        return noticeVTO;
    }

    public static List<NoticeVO> of(List<Notice> noticeList) {
        return noticeList.stream().map(NoticeVO::of).collect(toList());
    }
}
