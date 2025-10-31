package com.babyhands.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberVO {
	// DB 테이블의 하나의 행을 표현할 수 있는 형태를 만들어보자!
	// 필드 == 테이블의 column
	private String email;
	private String pw;
	private String tel;
	private String address;
}
