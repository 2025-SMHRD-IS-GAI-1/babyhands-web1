package com.babyhands.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlLearnVO {
	private int slLearnId;
	private Date slLearnDate;
	private int slId;
	private String memberId;
}
