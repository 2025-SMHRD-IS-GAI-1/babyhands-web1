package com.babyhands.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.MemberDAO;
import com.babyhands.dao.SlTestDAO;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;

public class GoMyPageService implements Command {

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		
		if (session == null || session.getAttribute("loginVO") == null) {
            return "redirect:/Gologin.do";
        }
		
		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		String memberId = loginVO.getMemberId();
		String nickname = loginVO.getNickname();
		
		MemberDAO dao = new MemberDAO();
		SlTestDAO slTestdao = new SlTestDAO();
		MemberVO member = dao.getMemberInfo(memberId);
		MemberScoreRank memberScoreRank = slTestdao.getScoreRank(memberId);
		
		request.setAttribute("member", member);
		request.setAttribute("memberScoreRank", memberScoreRank);
		
		return "mypage.jsp";
	}

}
