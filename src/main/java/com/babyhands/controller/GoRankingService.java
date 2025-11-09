package com.babyhands.controller;

import java.util.List;
import java.util.Map;

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
        MemberVO loginVO = (session == null) ? null : (MemberVO) session.getAttribute("loginVO");
        //세션이 없으면 loginVO=null. 있으면 세션에 저장해 둔 로그인 정보("loginVO")를 꺼냄.
        
        
        // 로그인 필터가 있다고 해도 NPE 방지 1줄 권장
        if (loginVO == null || loginVO.getMemberId() == null || loginVO.getMemberId().isBlank()) {
            // 필터가 있다면 이 분기는 사실상 안 탑니다. 디버깅용 or 안전망.
            request.setAttribute("msg", "로그인이 필요합니다.");
            return "Login.jsp";
        }

        String memberId = loginVO.getMemberId();  //이후 DAO 호출에 사용할 안전한 사용자 식별자

        SlTestDAO dao = new SlTestDAO(); // DAO 인스턴스 생성
    
        int myRank = 0;
        int myScore = 0; //점수 초기값 아직 가져오지 않은 상태니까 0
        
        MemberScoreRank mine = dao.getScoreRank(memberId);   // memberId 기준
        if (mine != null) {
            myRank  = (mine.getRankNo()     != null) ? mine.getRankNo()     : 0;
            myScore = (mine.getTotalScore() != null) ? mine.getTotalScore() : 0;
        }
        // mine이 없을 수도 있으니 NPE 방지.
        // DTO 필드가 Integer(객체형)라면 null일 수 있으므로 다시 한 번 기본값 처리.

        
        ////////////////////////////////////////////////////////
        // ✅ 첫 화면은 Top 5만!
        Map<String, Integer> p = new java.util.HashMap<>();
        p.put("offset", 0);
        p.put("limit", 5);

        List<MemberScoreRank> top5 = dao.selectRankingSlice(p);

        // 총 레코드 수 (끝 감지용)
        int totalCount = dao.countAllRanking();

        request.setAttribute("top5", top5);
        request.setAttribute("totalCount", totalCount);
        ////////////////////////////////////////////////////////////
        
        
        request.setAttribute("loginVO", loginVO);
        request.setAttribute("mine", mine);

        return "Ranking.jsp";
    }
}