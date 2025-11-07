package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.vo.SlLearnVO;

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
	public int success(SlLearnVO slLearnvo) {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.update("success", slLearnvo);
		
		sqlSession.commit(); // 커밋 필수

		sqlSession.close();

		return result;
	}
	
	// 수어 학습 : 수어 학습 성공한 리스트 불러오기
	public List<String> getSuccessList(String memberId) {
		SqlSession sqlSession = factory.openSession();

		List<String> result = sqlSession.selectList("getSuccessList", memberId);

		sqlSession.close();

		return result;
	}
	
	// 수어 학습 : 오늘 학습 성공한 리스트 불러오기
	public List<String> todaySuccessList(String memberId) {
		SqlSession sqlSession = factory.openSession();

		List<String> result = sqlSession.selectList("todaySuccessList", memberId);

		sqlSession.close();

		return result;
	}
	
}
