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

        HttpSession session = request.getSession(false);
        MemberVO loginVO = (session == null) ? null : (MemberVO) session.getAttribute("loginVO");
        if (loginVO == null) {
            return "/WEB-INF/views/Login.jsp"; // 혹은 redirect:/GoLogin.do
        }
        String memberId = loginVO.getMemberId();

        SlTestDAO dao = new SlTestDAO();

        // 1) 최신 그룹
        int latestGroup = dao.selectLatestGroup(memberId);

        List<SignQuestionResult> resultList;
        SignTestSummary summary;

        if (latestGroup == 0) {
            resultList = Collections.emptyList();
            summary = SignTestSummary.builder().correctCount(0).totalCount(0).totalScore(0).build();
        } else {
            resultList = dao.selectQuestionResultsByGroup(memberId, latestGroup);
            summary   = dao.selectSummaryByGroup(memberId, latestGroup);
        }

        // 2) JSP 바인딩
        request.setAttribute("resultList", resultList);
        request.setAttribute("correctCount", summary.getCorrectCount());
        request.setAttribute("totalCount", summary.getTotalCount());
        request.setAttribute("r", summary); // r.totalScore 사용

        // 게이지 퍼센트(선택)
        int denom = Math.max(summary.getTotalCount(), 1);
        int percent = (int) Math.round((summary.getCorrectCount() * 100.0) / denom);
        request.setAttribute("scorePercent", percent);

        return "SignTestResult.jsp";
    }
}
