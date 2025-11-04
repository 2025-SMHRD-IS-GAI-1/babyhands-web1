package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.dto.MemberScoreRank;

public class SlTestDAO {

    // DBCP 세션 공장
    private final SqlSessionFactory factory = MysqlSessionManager.getFactory();

    // TOP N 랭킹 (DTO 리스트로 반환)
    public List<MemberScoreRank> selectRankingTopN(int topN) {
        SqlSession s = factory.openSession();
        List<MemberScoreRank> out =
            s.selectList("com.babyhands.dao.SlTestDAO.selectRankingTopN", topN);
        s.close();
        return out;
    }

    // 이메일로 내 점수/순위 (DTO 단건)
    public MemberScoreRank getScoreRankByEmail(String email) {
        SqlSession s = factory.openSession();
        MemberScoreRank out =
            s.selectOne("com.babyhands.dao.SlTestDAO.getScoreRankByEmail", email);
        s.close();
        return out;
    }

    // (옵션) 멤버ID로 내 점수/순위 필요하면
    public MemberScoreRank getScoreRank(String memberId) {
        SqlSession s = factory.openSession();
        MemberScoreRank out =
            s.selectOne("com.babyhands.dao.SlTestDAO.getScoreRank", memberId);
        s.close();
        return out;
    }
}
