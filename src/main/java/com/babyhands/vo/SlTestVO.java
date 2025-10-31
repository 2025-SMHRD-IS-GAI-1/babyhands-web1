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
public class SlTestVO {
	private int slTestId;
	private Date slTestDate;
	private int slTestGroup;
	private String chooseAnswer;
	private String memberId;
	private int slId;
}
