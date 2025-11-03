package com.babyhands.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignLanguageVO {
	private int slId;
	private String meaning;
	private String videoPath;
}
