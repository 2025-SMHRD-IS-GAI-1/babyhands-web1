package com.babyhands.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.SignLanguageDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.SignLanguageVO;

public class GoSlLearnService implements Command {

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		
		if (session == null || session.getAttribute("loginVO") == null) {
            return "redirect:/Gologin.do";
        }
		
		SignLanguageDAO sldao = new SignLanguageDAO();
		List<SignLanguageVO> consonantList = sldao.getConsonantList();
		List<SignLanguageVO> vowelList = sldao.getVowelList();
		
		request.setAttribute("consonantList", consonantList);
		request.setAttribute("vowelList", vowelList);
		
		return "Sl-learn.jsp";
	}

}
