package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;

public class GomemberUpdateService implements Command {

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		
		if (session == null || session.getAttribute("loginVO") == null) {
            return "redirect:/Gologin.do";
        }
		
		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		String memberId = loginVO.getMemberId();
		
		MemberDAO dao = new MemberDAO();
		MemberVO member = dao.selectById(memberId);
		
		request.setAttribute("member", member);
		
		return "memberUpdate.jsp";
	}

}
