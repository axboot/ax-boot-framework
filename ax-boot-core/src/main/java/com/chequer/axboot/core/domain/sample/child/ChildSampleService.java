package com.chequer.axboot.core.domain.sample.child;

import com.chequer.axboot.core.domain.BaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;

@Service
public class ChildSampleService extends BaseService<ChildSample, String> {

	private ChildSampleRepository childRepository;

	@Inject
	public ChildSampleService(ChildSampleRepository childRepository) {
		super(childRepository);
		this.childRepository = childRepository;
	}


	public Page<ChildSample> findByParentKeyWithPaging(String parentKey, Pageable pageable) {
		return childRepository.findByParentKey(parentKey, pageable);
	}

	@Transactional
	public void deleteByKeys(List<String> keys) {
		for (String key : keys) {
			delete(key);
		}
	}
}
