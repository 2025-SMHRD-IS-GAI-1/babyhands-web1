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

public class IdCheckService implements Command {

	private final Gson gson = new Gson();
    
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		// 2. 요청 객체로 부터 데이터 꺼내오기
		String memberId = request.getParameter("id");
		
		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스
		
		MemberDAO dao = new MemberDAO();
		String result = dao.idCheck(memberId);
		Map<String, Object> payload = new HashMap<>();
		
		if(result != null) {
            payload.put("ok", true);
		} else {
			payload.put("ok", false);
		}
		
		return "fetch:/" + gson.toJson(payload);
	}

}
