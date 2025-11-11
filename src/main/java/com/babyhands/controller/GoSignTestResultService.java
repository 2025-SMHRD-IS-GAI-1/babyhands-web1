package com.babyhands.controller;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.SlTestDAO;
import com.babyhands.dto.SignQuestionResult;
import com.babyhands.dto.SignTestSummary;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;

public class GoSignTestResultService implements Command {

    @Override
    public String execute(HttpServletRequest request, HttpServletResponse response) {

        // --- 로그인 체크 ---
        HttpSession session = request.getSession(false);
        MemberVO loginVO = (session == null) ? null : (MemberVO) session.getAttribute("loginVO");
        if (loginVO == null) {
            return "/WEB-INF/views/Login.jsp";
        }
        String memberId = loginVO.getMemberId();

        SlTestDAO dao = new SlTestDAO();

        // --- groupNo 결정: 파라미터 우선, 없으면 최신 그룹 ---
        String gp = request.getParameter("groupNo");
        int groupNo = (gp != null && gp.matches("\\d+")) ? Integer.parseInt(gp) : 0;
        if (groupNo == 0) {
            groupNo = dao.selectLatestGroup(memberId);
        }

        // --- 회차가 없을 때 방어 ---
        List<SignQuestionResult> resultList;
        SignTestSummary summary;
        if (groupNo == 0) {
            resultList = Collections.emptyList();
            summary = SignTestSummary.builder().correctCount(0).totalCount(0).totalScore(0).build();
        } else {
            resultList = dao.selectQuestionResultsByGroup(memberId, groupNo);
            summary   = dao.selectSummaryByGroup(memberId, groupNo);
        }
        
        // --- JSP 바인딩 ---
        request.setAttribute("resultList", resultList);
        request.setAttribute("correctCount", summary.getCorrectCount());
        request.setAttribute("totalCount", summary.getTotalCount());
        request.setAttribute("r", summary);

        // 게이지 퍼센트(선택)
        int denom = Math.max(summary.getTotalCount(), 1);
        int percent = (int) Math.round(summary.getCorrectCount() * 100.0 / denom);
        request.setAttribute("scorePercent", percent);
        
        return "SignTestResult.jsp";
    }
}
