package com.chequer.axboot.core.model.extract.template.file;

import com.chequer.axboot.core.utils.EncDecUtils;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(staticName = "of")
public class RepositoryTemplateCode implements TemplateCode {

	@NonNull
	private String code;

	@NonNull
	private String name;

	@Override
	public String code() {
		return code;
	}

	@Override
	public String name() {
		return name;
	}

	@Override
	public String encodedCode() {
		return EncDecUtils.encode(code);
	}
}
