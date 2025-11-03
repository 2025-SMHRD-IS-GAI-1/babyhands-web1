package com.babyhands.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

import com.babyhands.frontController.Command;
import com.babyhands.dao.SlTestDAO;
import com.babyhands.vo.MemberVO;              // 세션에 들어있는 VO
import com.babyhands.dto.MemberScoreRank;     // 랭킹 DTO (rankNo, totalScore)

public class GoRankingService implements Command {

    @Override
    public String execute(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        MemberVO login = (MemberVO) session.getAttribute("loginMember");

        // ★ MemberVO에 memberId가 없으므로 email로 전달하고,
        //    Mapper에서 email -> MEMBER_ID 변환하도록 할 것
        String myEmail = login.getEmail();

        SlTestDAO dao = new SlTestDAO();

        // 내 순위/점수
        MemberScoreRank mine = dao.getScoreRankByEmail(myEmail); // <- 아래 DAO/Mapper 추가
        int myRank  = (mine == null) ? 0 : mine.getRankNo();      // DTO 필드명에 맞춤
        int myScore = (mine == null) ? 0 : mine.getTotalScore();  // DTO 필드명에 맞춤

        // TOP 100 랭킹
        List<Map<String,Object>> rankList = dao.selectRankingTopN(100);

        // JSP 바인딩
        request.setAttribute("rankList", rankList);  // Map: RN/NICKNAME/SCORE
        request.setAttribute("myRank", myRank);
        request.setAttribute("myScore", myScore);

        return "/WEB-INF/views/Ranking.jsp";
    }
}