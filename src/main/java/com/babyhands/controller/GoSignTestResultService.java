package com.babyhands.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.SlTestResultDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO; // 너네 로그인 VO 경로에 맞춰
import com.babyhands.vo.SlTestResultVO;

public class GoSignTestResultService implements Command {

    @Override
    public String execute(HttpServletRequest request, HttpServletResponse response) {

        HttpSession session = request.getSession(false);
        MemberVO login = (session != null) ? (MemberVO) session.getAttribute("result") : null;

        // memberId 확보 (세션 우선, 없으면 파라미터)
        String memberId = (login != null) ? login.getEmail() : request.getParameter("memberId");

        int total   = parseInt(request.getParameter("total"), 0);
        int correct = parseInt(request.getParameter("correct"), 0);
        int timeSec = parseInt(request.getParameter("timeSec"), 0);
        int score   = correct * 10;

        SlTestResultVO vo = SlTestResultVO.builder()
                .memberId(memberId)
                .totalQuestions(total)
                .correctCount(correct)
                .elapsedSec(timeSec)
                .score(score)
                .build();

        SlTestResultDAO dao = new SlTestResultDAO();
        dao.insertSignTestResult(vo);

        SlTestResultVO summary = dao.selectResultSummary(memberId);
        request.setAttribute("result", summary);

        return "sign/sign_test_result.jsp";
    }

    private int parseInt(String s, int def) {
        try { return Integer.parseInt(s); } catch (Exception e) { return def; }
    }
}