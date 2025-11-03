package com.babyhands.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.dto.MemberScoreRank;

public class SlTestDAO {

	// 필드영역
	// DBCP를 만드는 공장을 꺼내오기
	private SqlSessionFactory factory = MysqlSessionManager.getFactory();

	// 마이페이지 : 누적점수, 랭킹 가져오기
	public MemberScoreRank getScoreRank(String memberId) {
		SqlSession sqlSession = factory.openSession();

		MemberScoreRank result = sqlSession.selectOne("getScoreRank", memberId);

		sqlSession.close();

		return result;
	}

	// ... 기존 필드/생성 로직 유지 (MysqlSessionManager.getFactory() 등)

	// 내 순위/점수 - email로 조회
	public MemberScoreRank getScoreRankByEmail(String email) {
		SqlSession sqlSession = factory.openSession();

		MemberScoreRank result = sqlSession.selectOne("SLTestMapper.getScoreRankByEmail", email);

		sqlSession.close();

		return result;
	}

	// TOP N 랭킹
	public List<Map<String, Object>> selectRankingTopN(int topN) {
		SqlSession sqlSession = factory.openSession();

		List<Map<String, Object>> result = sqlSession.selectList("SLTestMapper.selectRankingTopN", topN);

		sqlSession.close();

		return result;

	}

	
}
