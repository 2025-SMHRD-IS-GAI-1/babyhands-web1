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
public class SlTestResultVO {
    private int slTestId;
    private String memberId;
    private int totalQuestions;
    private int correctCount;
    private int score;
    private int elapsedSec;
    private Date createdAt;
    private double accuracy;
    private int rankNo;
}
