package com.babyhands.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.dto.SignQuestionResult;
import com.babyhands.dto.SignTestSummary;
import com.babyhands.vo.SlTestVO;

public class SlTestDAO {

	// DBCP 세션 공장
	private final SqlSessionFactory factory = MysqlSessionManager.getFactory();

	// =====================================
	// 랭킹 관련 기능
	// =====================================

	// TOP N 랭킹 (DTO 리스트로 반환)
	public List<MemberScoreRank> selectRankingTopN(int topN) {
		SqlSession s = factory.openSession();
		List<MemberScoreRank> out = s.selectList("com.babyhands.dao.SlTestDAO.selectRankingTopN", topN);
		s.close();
		return out;
	}

	// 이메일로 내 점수/순위 (DTO 단건)
	public MemberScoreRank getScoreRankByEmail(String email) {
		SqlSession s = factory.openSession();
		MemberScoreRank out = s.selectOne("com.babyhands.dao.SlTestDAO.getScoreRankByEmail", email);
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
		MemberScoreRank out = s.selectOne("com.babyhands.dao.SlTestDAO.getScoreRank", memberId);
		s.close();
		return out;
	}

	// ───────── 결과 화면용(최신 그룹 기준) ─────────

	// 1) 해당 회원의 최신 응시 그룹 번호
	public int selectLatestGroup(String memberId) {
		SqlSession s = factory.openSession();
		Integer r = s.selectOne("com.babyhands.dao.SlTestDAO.selectLatestGroup", memberId);
		s.close();
		return (r == null) ? 0 : r;
	}

	// 2) 최신 그룹의 문항별 결과 리스트 (내답/정답/정오)
	public List<SignQuestionResult> selectQuestionResultsByGroup(String memberId, int groupNo) {
		SqlSession s = factory.openSession();

		Map<String, Object> p = new HashMap<>();
		p.put("memberId", memberId);
		p.put("groupNo", groupNo);

		List<SignQuestionResult> out = s.selectList("com.babyhands.dao.SlTestDAO.selectQuestionResultsByGroup", p);

		s.close();
		return out;
	}

//3) 최신 그룹의 요약(정답 수/총문항/총점)
	public SignTestSummary selectSummaryByGroup(String memberId, int groupNo) {
		SqlSession s = factory.openSession();

		Map<String, Object> p = new HashMap<>();
		p.put("memberId", memberId);
		p.put("groupNo", groupNo);

		SignTestSummary out = s.selectOne("com.babyhands.dao.SlTestDAO.selectSummaryByGroup", p);

		if (out == null) {
			out = SignTestSummary.builder().correctCount(0).totalCount(0).totalScore(0).build();
		}

		s.close();
		return out;
	}
}
