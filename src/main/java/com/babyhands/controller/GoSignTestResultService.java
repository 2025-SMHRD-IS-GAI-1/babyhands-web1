package com.babyhands.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.babyhands.dao.SlTestResultDAO;
import com.babyhands.vo.MemberVO;
import com.babyhands.vo.SlTestResultVO;
import com.babyhands.frontController.Command;

public class GoSignTestResultService implements Command {

    @Override
    public String execute(HttpServletRequest request, HttpServletResponse response) {

        HttpSession session = request.getSession(false);
        MemberVO loginVO = (session == null) ? null : (MemberVO) session.getAttribute("loginVO");

        if (loginVO == null || loginVO.getMemberId() == null || loginVO.getMemberId().isBlank()) {
            request.setAttribute("msg", "로그인이 필요합니다.");
            return "Login.jsp";
        }

        String memberId = loginVO.getMemberId();
        SlTestResultDAO dao = new SlTestResultDAO();

        // 🔹 DB에서 최신 결과 가져오기
        SlTestResultVO result = dao.selectLatestResultByMember(memberId);

        if (result == null) {
            request.setAttribute("msg", "아직 테스트 결과가 없습니다.");
            return "SignTestIntro.jsp";
        }

        // JSP에서 사용할 데이터 세팅
        request.setAttribute("r", result);
        request.setAttribute("totalCount", result.getTotalQuestions());
        request.setAttribute("correctCount", result.getCorrectCount());

        return "SignTestResult.jsp";
    }
}
