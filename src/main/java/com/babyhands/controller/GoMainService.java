package com.babyhands.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.MemberDAO;
import com.babyhands.dao.SlLearnDAO;
import com.babyhands.dao.SlTestDAO;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;

public class GoMainService implements Command {

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		
		if (session == null || session.getAttribute("loginVO") == null) {
            return "redirect:/Gologin.do";
        }
		
		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		String memberId = loginVO.getMemberId();
		
		SlLearnDAO slLearndao = new SlLearnDAO();
		
		int today = slLearndao.getTodayGoal(memberId);
		int success = slLearndao.getOverallProgress(memberId);
		int total = slLearndao.getCountAllSL();
		
		int todayGoal = (int) ((today / 10.0) * 100);
		long overallProgress = Math.round((success / (double)total) * 100);
		
		request.setAttribute("todayGoal", todayGoal);
		request.setAttribute("overallProgress", overallProgress);
		
		
		return "main.jsp";
	}

}
