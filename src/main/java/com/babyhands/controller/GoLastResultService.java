package com.babyhands.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.MemberDAO;
import com.babyhands.dao.SlLearnDAO;
import com.babyhands.dao.SlTestDAO;
import com.babyhands.dto.DailyTestDTO;
import com.babyhands.dto.LastTestDTO;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;

public class GoLastResultService implements Command {

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();

		if (session == null || session.getAttribute("loginVO") == null) {
			return "redirect:/Gologin.do";
		}
		
		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		String memberId = loginVO.getMemberId();
		
		MemberDAO dao = new MemberDAO();
		SlTestDAO slTestdao = new SlTestDAO();
		int totalLearnDay = slTestdao.getTotalTestDay(memberId); // 총 학습일 수
		int avgScore = slTestdao.getAvgScore(memberId); // 평균 점수
		List<LastTestDTO> lastTestList = slTestdao.getLastTestList(memberId);
		List<DailyTestDTO> dailyTestList = slTestdao.dailyTestList(memberId);
		
		request.setAttribute("totalLearnDay", totalLearnDay);
		request.setAttribute("avgScore", avgScore);
		request.setAttribute("lastTestList", lastTestList);
		request.setAttribute("dailyTestList", dailyTestList);
		
		return "LastResult.jsp";
	}

}
