package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.vo.SignLanguageVO;

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
	
	// 수어 학습 : 자음 리스트 가져오기
	public List<SignLanguageVO> getConsonantList() {
		SqlSession sqlSession = factory.openSession();

		List<SignLanguageVO> result = sqlSession.selectList("getConsonantList");

		sqlSession.close();

		return result;
	}
	
	// 수어 학습 : 모음 리스트 가져오기
	public List<SignLanguageVO> getVowelList() {
		SqlSession sqlSession = factory.openSession();

		List<SignLanguageVO> result = sqlSession.selectList("getVowelList");

		sqlSession.close();

		return result;
	}
}
