package com.babyhands.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignTestSummary {
    private int correctCount;
    private int totalCount;
    private int totalScore; // correctCount * 10
}