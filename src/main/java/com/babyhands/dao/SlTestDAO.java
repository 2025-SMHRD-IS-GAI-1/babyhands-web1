package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.dto.DailyTestDTO;
import com.babyhands.dto.LastTestDTO;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.vo.SlTestVO;

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
    
    // 지난 학습결과 : 총 학습일 수 가져오기
 	public int getTotalTestDay(String memberId) {
 		SqlSession sqlSession = factory.openSession();

 		int result = sqlSession.selectOne("getTotalTestDay", memberId);

 		sqlSession.close();

 		return result;
 	}
    
    // 지난 학습 결과 : 평균 점수 가져오기
	public int getAvgScore(String memberId) {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.selectOne("getAvgScore", memberId);

		sqlSession.close();

		return result;
	}
	
	// 지난 학습 결과 : 지난 학습 목록 리스트 가져오기
	public List<LastTestDTO> getLastTestList(String memberId) {
		SqlSession sqlSession = factory.openSession();

		List<LastTestDTO> result = sqlSession.selectList("getLastTestList", memberId);

		sqlSession.close();

		return result;
	}
	
	// 지난 학습 결과 : 지난 일주일 일일 학습량 리스트 가져오기
	public List<DailyTestDTO> dailyTestList(String memberId) {
		SqlSession sqlSession = factory.openSession();

		List<DailyTestDTO> result = sqlSession.selectList("dailyTestList", memberId);

		sqlSession.close();

		return result;
	}

	
}
