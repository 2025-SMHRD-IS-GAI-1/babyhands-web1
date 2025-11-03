package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.AttendanceDAO;
import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;

public class LogoutService implements Command {

	private final Gson gson = new Gson();
    
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		// 로그인에 성공하면 session에 값 저장
		HttpSession session = request.getSession();
		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		Map<String, Object> payload = new HashMap<>();
		
		if(loginVO != null) {
			// 출석 db에 insert
			session.removeAttribute("loginVO");
            payload.put("ok", true);
            payload.put("redirect", request.getContextPath() + "/Gologin.do");
		} else {
			payload.put("ok", false);
            payload.put("message", "로그아웃 실패");
		}
		
		return "fetch:/" + gson.toJson(payload);
	}

}
