package com.babyhands.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.SlTestDAO;
import com.babyhands.dto.MemberScoreRank;     // rankNo, memberId, totalScore
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;

public class GoRankingService implements Command {

    @Override
    public String execute(HttpServletRequest request, HttpServletResponse response) {

        // --- 세션/로그인 정보 ---
        HttpSession session = request.getSession(false);
        MemberVO login = (session == null) ? null : (MemberVO) session.getAttribute("loginMember");
        String myEmail = (login == null) ? null : login.getEmail();

        SlTestDAO dao = new SlTestDAO();

        // --- 내 순위/점수 (로그인 안 되어 있으면 0) ---
        int myRank = 0;
        int myScore = 0;
        if (myEmail != null && !myEmail.isEmpty()) {
            MemberScoreRank mine = dao.getScoreRankByEmail(myEmail);
            if (mine != null) {
                Integer r = mine.getRankNo();
                Integer s = mine.getTotalScore();
                myRank  = (r == null) ? 0 : r;
                myScore = (s == null) ? 0 : s;
            }
        }

     // --- TOP 100 랭킹 (DTO 리스트) ---
        List<MemberScoreRank> rankList = dao.selectRankingTopN(100);

        // 디버그 로그는 return 전에!
        System.out.println("[RANK DEBUG] size=" + (rankList == null ? "null" : rankList.size()));
        if (rankList != null && !rankList.isEmpty()) {
            MemberScoreRank r0 = rankList.get(0);
            System.out.println("[RANK DEBUG] first=" + r0.getMemberId() + "/" + r0.getTotalScore() + "/" + r0.getRankNo());
        }

        // --- JSP 바인딩 ---
        request.setAttribute("rankList", rankList);
        request.setAttribute("myRank", myRank);
        request.setAttribute("myScore", myScore);

        return "Ranking.jsp";
    }
}
