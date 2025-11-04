package com.babyhands.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionDTO {
	private int slId;
	private String meaning;
	private String videoPath;
	private List<String> answers;
}
