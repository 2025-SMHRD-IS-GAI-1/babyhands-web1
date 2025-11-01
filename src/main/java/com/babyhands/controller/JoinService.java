package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;

public class JoinService implements Command {
	
	private final Gson gson = new Gson();
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {

		// 2. 요청 객체로 부터 데이터 꺼내오기
		String memberId = request.getParameter("id");
		String pw = request.getParameter("pw");
		String nickname = request.getParameter("nickname");
		String email = request.getParameter("email");
		
		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스
		
		MemberVO mvo = MemberVO.builder()
				.memberId(memberId)
				.pw(pw)
				.nickname(nickname)
				.email(email)
				.build();
		
		MemberDAO dao = new MemberDAO();
		int row = dao.join(mvo);
		Map<String, Object> payload = new HashMap<>();
		
		// 회원가입에 성공 할시
		if(row > 0) {
            payload.put("ok", true);
            payload.put("redirect", request.getContextPath() + "/Gologin.do");
		} else {
			payload.put("ok", false);
            payload.put("message", "회원가입에 실패했습니다.");
		}
		
		return "fetch:/" + gson.toJson(payload);
	}

}
