package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.mindrot.jbcrypt.BCrypt;

import com.babyhands.dao.AttendanceDAO;
import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;

public class LoginService implements Command {
	
	private final Gson gson = new Gson();
       
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {

		// 2. 요청 객체로 부터 데이터 꺼내오기
		String memberId = request.getParameter("id");
		String plainPw = request.getParameter("pw");
		
		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스
		
		MemberVO mvo = MemberVO.builder()
				.memberId(memberId)
				.build();
		
		MemberDAO mdao = new MemberDAO();
		AttendanceDAO adao = new AttendanceDAO();
		MemberVO result = mdao.login(mvo);
		Map<String, Object> payload = new HashMap<>();
		
		// 로그인에 성공하면 session에 값 저장
		HttpSession session = request.getSession();
		if(result != null) {
			
			// 해시화한 비밀번호와 맞으면 로그인 성공
			if(BCrypt.checkpw(plainPw, result.getPw())) {
				MemberVO loginVO = MemberVO.builder()
						.memberId(result.getMemberId())
						.nickname(result.getNickname())
						.build();
				
				// 출석 db에 insert
				adao.attendance(memberId);
				session.setAttribute("loginVO", loginVO);
	            payload.put("ok", true);
	            payload.put("redirect", request.getContextPath() + "/Gomain.do");
			} else {
				session.removeAttribute("loginVO");
				payload.put("ok", false);
	            payload.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
			}
		} else {
			session.removeAttribute("loginVO");
			payload.put("ok", false);
            payload.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
		}
		
		return "fetch:/" + gson.toJson(payload);
	}

}
