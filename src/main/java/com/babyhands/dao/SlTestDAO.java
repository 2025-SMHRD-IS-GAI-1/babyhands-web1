package com.babyhands.dao;

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

}
