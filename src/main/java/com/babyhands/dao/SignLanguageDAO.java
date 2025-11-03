package com.babyhands.dao;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;

public class SignLanguageDAO {
	// 필드영역
	// DBCP를 만드는 공장을 꺼내오기
	private SqlSessionFactory factory = MysqlSessionManager.getFactory();

	// 메인 페이지 : 전체 진행률 (전체 수어 갯수 카운트)
	public int getCountAllSL() {
		SqlSession sqlSession = factory.openSession();

		int result = sqlSession.selectOne("getCountAllSL");

		sqlSession.close();

		return result;
	}
}
