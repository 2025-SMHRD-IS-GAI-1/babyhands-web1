package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.SlLearnDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;

public class SlLearnSuccessService implements Command {

	private final Gson gson = new Gson();

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {

		HttpSession session = request.getSession();

		if (session == null || session.getAttribute("loginVO") == null) {
			return "redirect:/Gologin.do";
		}

		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		String memberId = loginVO.getMemberId();
		
		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스

		SlLearnDAO slLearndao = new SlLearnDAO();
		String result = slLearndao.success();
		Map<String, Object> payload = new HashMap<>();

		if (result != null) {
			payload.put("ok", true);
		} else {
			payload.put("ok", false);
		}

		return "fetch:/" + gson.toJson(payload);
	}

}
