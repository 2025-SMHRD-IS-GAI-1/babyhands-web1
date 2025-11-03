package com.babyhands.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.AttendanceDAO;
import com.babyhands.dao.MemberDAO;
import com.babyhands.dto.AttendanceDTO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;

public class GetAttendanceDayService implements Command {
	
	private final Gson gson = new Gson();
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();

		if (session == null || session.getAttribute("loginVO") == null) {
			return "redirect:/Gologin.do";
		}

		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		String memberId = loginVO.getMemberId();
		String curYear = request.getParameter("curYear");
		String curMonth = request.getParameter("curMonth");
		
		AttendanceDTO dto = AttendanceDTO.builder()
				.memberId(memberId)
				.curYear(curYear)
				.curMonth(curMonth)
				.build();

		AttendanceDAO dao = new AttendanceDAO();
		List<Integer> days = dao.selectAttendanceDays(dto);

		Map<String, Object> payload = new HashMap<>();
		
		// 회원가입에 성공 할시
		if(days != null) {
            payload.put("ok", true);
            payload.put("days", days);
		} else {
			payload.put("ok", false);
            payload.put("message", "출석한 날짜 불러오기 실패");
		}
		
		return "fetch:/" + gson.toJson(payload);
	}

}
