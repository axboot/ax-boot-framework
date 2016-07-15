package com.chequer.axboot.admin.domain.code;

import com.chequer.axboot.core.code.Params;
import com.chequer.axboot.core.domain.BaseService;
import com.google.common.collect.Maps;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import java.util.List;
import java.util.Map;


@Service
public class CommonCodeService extends BaseService<CommonCode, CommonCodeId> {

	private CommonCodeRepository commonCodeRepository;

	@Inject
	public CommonCodeService(CommonCodeRepository commonCodeRepository) {
		super(commonCodeRepository);
		this.commonCodeRepository = commonCodeRepository;
	}

	public List<CommonCode> getByGroupCd(String groupCd) {
		return commonCodeRepository.findByGroupCdAndUseYnOrderBySortAsc(groupCd, Params.Y);
	}

	public Map<String, List<CommonCode>> getByGroupCds(List<String> groupCds) {
		Map<String, List<CommonCode>> commonCodeMap = Maps.newHashMap();

		for (String groupCd : groupCds) {
			List<CommonCode> commonCodes = findByGroupCdAndUseYnOrderBySortAsc(groupCd, Params.Y);
			commonCodeMap.put(groupCd, commonCodes);
		}

		return commonCodeMap;
	}

	private List<CommonCode> findByGroupCdAndUseYnOrderBySortAsc(String groupCd, String useYn) {
		return commonCodeRepository.findByGroupCdAndUseYnOrderBySortAsc(groupCd, useYn);
	}

	public Page<CommonCode> getCommonCodes(String searchParam, PageRequest pageable) {
		Page<CommonCode> basicCodes;
		if (!StringUtils.isEmpty(searchParam)) {
			basicCodes = commonCodeRepository.findByGroupCdContainingOrGroupNmContaining(searchParam, searchParam, pageable);
		} else {
			basicCodes = commonCodeRepository.findAll(pageable);
		}
		return basicCodes;
	}

	public List<CommonCode> getAllBySearchParams(String searchParam) {
		List<CommonCode> basicCodes;

		if (!StringUtils.isEmpty(searchParam)) {
			basicCodes = commonCodeRepository.findByGroupCdContainingOrGroupNmContaining(searchParam, searchParam);
		} else {
			basicCodes = commonCodeRepository.findAllByOrderByGroupCdAscCodeAsc();
		}

		return basicCodes;
	}
}
