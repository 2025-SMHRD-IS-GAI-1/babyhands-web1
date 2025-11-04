package com.babyhands.vo;

import java.sql.Timestamp;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlTestResultVO {
    private Long slTestId;          // 오라클 NUMBER → Long 권장
    private String memberId;
    private Integer totalQuestions;
    private Integer correctCount;
    private Integer score;
    private Integer elapsedSec;
    private Timestamp createdAt;    // DATE 대신 Timestamp로 바꾸면 CAST 매핑 문제 X
    private Double accuracy;
    private Integer rankNo;
}
