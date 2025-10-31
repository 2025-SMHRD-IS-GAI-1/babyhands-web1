package com.babyhands.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.frontController.Command;
import com.babyhands.dao.MemberDAO;
import com.babyhands.vo.MemberVO;

public class LoginService implements Command {
       
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		String moveUrl = "";
		
		// 2. 요청 객체로 부터 데이터 꺼내오기
		String memberId = request.getParameter("id");
		String pw = request.getParameter("pw");
		
		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스
		
		MemberVO mvo = new MemberVO();
		mvo.setMemberId(memberId);
		mvo.setPw(pw);
		
		MemberDAO dao = new MemberDAO();
		MemberVO loginVO = dao.login(mvo);
		
		// 로그인에 성공하면 session에 값 저장
		HttpSession session = request.getSession();
		if(loginVO != null) {
			session.setAttribute("loginVO", loginVO);
            return "redirect:/Gohello.do";
		} else {
			session.removeAttribute("loginVO");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            return null;
		}
	}

}
