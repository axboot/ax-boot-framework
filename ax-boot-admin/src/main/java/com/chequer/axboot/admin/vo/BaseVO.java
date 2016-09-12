package com.chequer.axboot.admin.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BaseVO {

	public Boolean deleted;

	public Boolean added;

	public LocalDateTime insDt;

	public String insUserCd;

	public String insUserNm;

	public LocalDateTime uptDt;

	public String uptUserCd;

	public String uptUserNm;
}
