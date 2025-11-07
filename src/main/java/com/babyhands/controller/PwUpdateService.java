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

public class PwUpdateService implements Command {

	private final Gson gson = new Gson();

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {

		// 2. 요청 객체로 부터 데이터 꺼내오기
		String memberId = request.getParameter("id");
		String plainPw = request.getParameter("pw");
		String pw = BCrypt.hashpw(plainPw, BCrypt.gensalt(10));

		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스

		MemberVO mvo = MemberVO.builder().memberId(memberId).pw(pw).build();

		MemberDAO dao = new MemberDAO();
		int row = dao.updatePW(mvo);
		Map<String, Object> payload = new HashMap<>();

		// 로그인에 성공하면 session에 값 저장
		HttpSession session = request.getSession();
		if (row > 0) {
			// 출석 db에 insert
			payload.put("ok", true);
			payload.put("redirect", request.getContextPath() + "/Gologin.do");

		} else {
			payload.put("ok", false);
			payload.put("message", "비밀번호 재설정 실패");
		}

		return "fetch:/" + gson.toJson(payload);
	}

}
