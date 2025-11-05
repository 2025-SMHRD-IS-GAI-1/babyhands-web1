package com.babyhands.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignQuestionResult {
    private int slId;
    private String jamo;        // 내가 고른 답 (CHOOSE_ANSWER)
    private String correctJamo; // 정답 (SIGN_LANGUAGE.MEANING)
    private int isCorrect;      // 1이면 정답, 0이면 오답
}