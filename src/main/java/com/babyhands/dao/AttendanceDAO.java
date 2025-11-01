package com.babyhands.dao;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;

public class AttendanceDAO {

	// 필드영역
	// DBCP를 만드는 공장을 꺼내오기
	private SqlSessionFactory factory = MysqlSessionManager.getFactory();

	// 출석기능
	public int attendance(String memberId) {

		SqlSession sqlSession = factory.openSession();

		int row = sqlSession.insert("attendance", memberId);
		
		sqlSession.commit(); // 커밋 필수

		sqlSession.close();

		return row;
	}
}
