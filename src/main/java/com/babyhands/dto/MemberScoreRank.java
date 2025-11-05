package com.babyhands.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberScoreRank {
	private String memberId;
	private Integer totalScore;
	private Integer rankNo;
	private String nickname;
}
