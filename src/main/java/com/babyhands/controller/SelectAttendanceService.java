package com.babyhands.controller;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.babyhands.dao.AttendanceDAO;
import com.babyhands.frontController.Command;

public class SelectAttendanceService implements Command {

    @Override
    public String execute(HttpServletRequest request, HttpServletResponse response) {

        // 파라미터 받기
        String memberId = (String) request.getSession().getAttribute("memberId"); // 세션에서 아이디 가져오기
        if (memberId == null) memberId = "test1"; // 임시 테스트용

        int year = Integer.parseInt(request.getParameter("y"));
        int month = Integer.parseInt(request.getParameter("m"));

        // DAO 호출
        AttendanceDAO dao = new AttendanceDAO();
        List<Integer> attendanceDays = dao.selectAttendanceDays(memberId, year, month);

        // JSP로 넘기기
        request.setAttribute("attendanceDays", attendanceDays);

        // main.jsp로 다시 이동
        return "Gomain.jsp";
    }
}
