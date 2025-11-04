package com.babyhands.dao;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;

public class SlLearnDAO {
	// 필드영역
	// DBCP를 만드는 공장을 꺼내오기
	private SqlSessionFactory factory = MysqlSessionManager.getFactory();

	// 메인 페이지 : 오늘의 목표 가져오기
	public int getTodayGoal(String memberId) {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.selectOne("getTodayGoal", memberId);

		sqlSession.close();

		return result;
	}
	
	// 메인 페이지 : 전체 진행률 (수어 학습한것만 카운트)
	public int getOverallProgress(String memberId) {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.selectOne("getOverallProgress", memberId);

		sqlSession.close();

		return result;
	}
	
	// 수어 학습 : 일정 정확도 이상이면 db에 추가
	public int success() {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.selectOne("success");

		sqlSession.close();

		return result;
	}
	
}
