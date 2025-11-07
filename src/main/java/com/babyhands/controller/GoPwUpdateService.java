package com.babyhands.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.MemberDAO;
import com.babyhands.dao.SlTestDAO;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;

public class GoPwUpdateService implements Command {

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		String memberId = (String) request.getAttribute("memberId");
		request.setAttribute("memberId", memberId);
		
		return "mypage.jsp";
	}

}
