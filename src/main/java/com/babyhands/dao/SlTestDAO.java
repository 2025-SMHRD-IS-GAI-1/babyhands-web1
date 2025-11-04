package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.vo.SlTestVO;

public class SlTestDAO {

    // DBCP 세션 공장
    private final SqlSessionFactory factory = MysqlSessionManager.getFactory();

    // =====================================
    // 🔹 랭킹 관련 기능
    // =====================================

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

	// db insert 전에 group 가져옴
	public int getGroup() {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.selectOne("getGroup");

		sqlSession.close();

		return result;

	}
	
	// 수어 테스트 db insert
	public int insert(SlTestVO testVo) {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.insert("insert", testVo);
		
		sqlSession.commit(); // 커밋 필수

		sqlSession.close();

		return result;
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
