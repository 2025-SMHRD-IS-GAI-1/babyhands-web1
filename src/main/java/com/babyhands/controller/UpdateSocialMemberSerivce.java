package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.mindrot.jbcrypt.BCrypt;

import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;

public class UpdateSocialMemberSerivce implements Command {

	private final Gson gson = new Gson();

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		
		if (session == null || session.getAttribute("loginVO") == null) {
            return "redirect:/Gologin.do";
        }
		
		// 2. 요청 객체로 부터 데이터 꺼내오기
		String memberId = request.getParameter("id");
		String nickname = request.getParameter("nickname");

		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스

		MemberVO mvo = MemberVO.builder().memberId(memberId).nickname(nickname).build();

		MemberDAO dao = new MemberDAO();
		int row = dao.socialUpdate(mvo);
		Map<String, Object> payload = new HashMap<>();

		// 회원수정에 성공 할시
		if (row > 0) {
			// 회원 수정 된걸로 session 값 바꿈
			session.removeAttribute("loginVO");
			MemberVO loginVO = MemberVO.builder().memberId(memberId).nickname(nickname).build();
			session.setAttribute("loginVO", loginVO);

			payload.put("ok", true);
			payload.put("redirect", request.getContextPath() + "/GomemberUpdate.do");
		} else {
			payload.put("ok", false);
			payload.put("message", "회원수정에 실패했습니다.");
		}

		return "fetch:/" + gson.toJson(payload);
	}

}
